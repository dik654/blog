# 신경망 레이어 구현 (Rust) · content spec

## 이 글이 맡는 질문

자동 미분 `Value`를 얻은 뒤, trainable parameter가 모델 안에서 정확히 한 번
소유·열거·초기화·갱신되게 하면서
`zero_grad → forward → loss → backward → optimizer step`을 어떤 Rust 경계로
나눠야 하는가?

## 독자와 도달점

- 선행: `dezero-autodiff`, tensor shape의 batch/feature 축, MSE와
  cross-entropy의 목적.
- 도달점: 두 Layer 학습 step을 shape와 parameter identity로 추적하고,
  공유 parameter가 두 번 열거되어도 optimizer가 한 번만 갱신해야 하는 이유를
  설명한다.
- 다음: `dezero-advanced`에서 explicit recurrent state, normalization axis,
  stochastic mode와 index lookup을 같은 graph에 얹는다.

## 최소 기반과 stop rule

필수:

1. `Parameter`는 gradient를 받는 leaf `Value`다.
2. `Layer`는 forward computation과 owned parameter 열거를 분리한다.
3. loss는 scalar output으로 graph를 닫는다.
4. optimizer state는 vector position이 아니라 stable parameter identity에
   귀속되어야 한다.

여기서 멈춘다:

- full ndarray broadcasting와 GPU tensor backend
- 모든 optimizer 계보
- distributed parameter server, mixed precision

## Source ledger

### 공식 DeZero

- official book / pinned repository commit은 autodiff spec과 동일.
- `dezero/layers.py`, `dezero/optimizers.py`, `dezero/functions.py`를
  Parameter/Layer/optimizer/loss 설계의 역사적 교육 source로 사용한다.
- 금지 claim: 이 글의 Rust trait, lazy initialization, parameter deduplication이
  공식 DeZero 코드 그대로라는 주장.

### 수학과 optimizer

- Kingma & Ba, *Adam: A Method for Stochastic Optimization*:
  first/second moment와 bias correction.
- 기존 `loss-functions`와 `probability-information-theory`:
  MSE, logits, stable softmax, NLL/CE의 공통 기반.
- 금지 claim:
  - sigmoid output이 자동으로 calibrated probability라는 주장
  - GELU가 모든 Transformer의 보편 표준이라는 주장
  - Adam이 sparse gradient 문제를 항상 해결하거나 SGD보다 항상 낫다는 주장

### Rust 재구성

`examples/dezero-rs/src/nn.rs`는 교육용 compile-tested implementation이다.
공식 Rust port가 아니다. 초깃값은 독립 RNG 논의를 끌어들이지 않도록
deterministic fixture로 두고, production initializer는 범위 밖임을 쓴다.

## 숨은 전이 문제

```yaml
fixture:
  input_shape: [2, 3]
  layer_1: [3, 2]
  layer_2: [2, 1]
  shared_parameter: "layer_1 weight[0] is intentionally listed twice"
  labels: [0.4, -0.2]
  required:
    - every activation shape
    - scalar MSE
    - zero_grad must precede backward
    - each leaf receives accumulated gradient
    - shared parameter is updated exactly once
    - loss after one small SGD step decreases
  failures:
    - optimizer indexes state by current Vec order
    - layer hides a parameter from parameters()
    - update runs before backward
    - logits are fed to naive exp without max subtraction
```

공개 본문은 다른 shape와 수치를 사용한다.

## 서사

1. **Graph leaf를 Parameter로 승격**: 값과 학습 대상의 차이.
2. **Layer의 두 계약**: `forward` 계산과 `parameters` 소유 목록.
3. **Shape가 먼저다**: batch × in feature, weight, bias, output.
4. **Loss가 graph를 scalar로 닫는다**: MSE와 stable log-softmax CE.
5. **한 step의 순서와 identity**: zero, forward, backward, deduplicated step.

Activation catalogue는 독립 절로 길게 늘이지 않는다. ReLU/tanh/sigmoid는
forward graph와 local derivative 사례로 필요한 지점에 통합한다.

## 수식 계약

1. `Y = XW + b`
   - sample 수, input feature, output feature 축을 한글로 표시
2. `dL/dX = dL/dY W^T`, `dL/dW = X^T dL/dY`
   - 어떤 축이 contraction되고 어떤 shape가 남는지 설명
3. `L_MSE = (1/N) sum_i (y_i-t_i)^2`
   - residual, square penalty, batch mean
4. `log_softmax(z)_k = z_k - m - log sum_j exp(z_j-m)`
   - shift, stable exponent, normalizer
5. `theta <- theta - eta grad_theta L`
   - parameter, learning rate, gradient, one update

각 식은 한국어 FormulaNote와 모바일 의미 단위 분할을 갖는다.

## Viz 계약

핵심 `TrainStepLedgerLab` 하나를 둔다.

- controls: phase selector, learning rate, duplicate parameter toggle
- visible state:
  - shape ledger
  - parameter identity/owner
  - gradient status
  - before/after value와 loss
- causal transition:
  - phase를 바꾸면 해당 artifact가 새로 생긴다.
  - duplicate listing을 켜도 dedup된 update count는 1이어야 한다.
  - 잘못된 order는 실행하지 않고 failure owner를 표시한다.
- 390px에서는 두 열을 세로로 바꾸며 표를 수평 스크롤시키지 않는다.

## 실행 코드와 테스트

- `src/nn.rs`
- `tests/nn_contract.rs`

필수 테스트:

1. Linear shape mismatch is rejected
2. parameter enumeration contains every leaf exactly once
3. duplicated handle is updated once
4. one SGD step lowers a deterministic toy loss
5. zero_grad removes prior accumulation

## Metadata와 QA

- level: `intermediate`
- estimated minutes: `35`
- summary와 prerequisites 추가
- previous/next handoff 추가
- 공식 source와 Rust reconstruction 경계를 `SourceNotes`에 적는다.
- 390/768/1440 overflow, KaTeX, keyboard, code source button, cargo test를
  release gate로 둔다.
