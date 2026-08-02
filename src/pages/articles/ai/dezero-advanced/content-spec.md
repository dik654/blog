# Sequence · Normalization · Embedding 구현 (Rust) · content spec

## 이 글이 맡는 질문

한 step 안의 feed-forward graph는 만들었다. 이제 시간으로 이어지는 state,
feature 축 통계, train/eval에 따라 바뀌는 stochastic mask, 반복 token의
index lookup을 graph와 parameter ownership에 어떻게 넣어야 sequence 사이
누수와 잘못된 gradient를 막을 수 있는가?

## 범위 재구성

기존 제목은 LSTM·LayerNorm·Dropout·Embedding을 기능 목록으로 나열했다.
새 글은 네 기능을 다음 하나의 공통 질문으로 묶는다.

> forward에서 생긴 어떤 상태를 backward와 다음 step이 다시 읽으며, 그
> 상태의 lifetime·axis·mode·identity를 누가 소유하는가?

RNN/LSTM은 시간 state, LayerNorm은 reduction state, Dropout은 mode/mask,
Embedding은 index identity를 맡는다.

## 선행과 도달점

- 선행: `dezero-autodiff`, `dezero-nn`, sequence index와 tensor shape.
- 도달점:
  - state를 argument/return으로 명시해 sequence boundary를 제어한다.
  - truncated BPTT에서 `detach`와 `reset`을 구분한다.
  - `[batch,time,feature]`의 LayerNorm axis를 고른다.
  - inverted dropout의 train/eval expectation을 계산한다.
  - repeated token의 gradient가 같은 embedding row에 합산됨을 설명한다.
- 상위 handoff: LSTM을 최신 sequence architecture 전체로 확대하지 않고
  `state-space-models`, `attention-theory`, `tokenization`으로 필요한 책임만
  연결한다.

## 최소 기반과 stop rule

필수:

1. recurrence와 unrolled graph
2. chain product와 additive cell path
3. mean/variance와 reduction axis
4. Bernoulli mask의 expectation
5. gather forward와 scatter-add backward

여기서 멈춘다:

- 모든 LSTM variant와 peephole history
- BatchNorm/GroupNorm 전체 taxonomy
- vocabulary training과 tokenizer algorithm
- sparse optimizer kernel과 distributed embedding table

## Source ledger

### 공식 DeZero

- pinned repository `dezero/layers.py`의 RNN/LSTM과
  `dezero/functions.py`의 dropout을 교육 source로 사용한다.
- 공식 repository에는 이 글의 Rust code와 동일한 LayerNorm/Embedding
  implementation이 없으므로 이를 DeZero source claim으로 돌리지 않는다.

### 원 논문과 현재 공식 문서

- Hochreiter & Schmidhuber, *Long Short-Term Memory*, Neural Computation 1997:
  multiplicative gate와 constant-error path의 직접 역사적 근거.
- Ba, Kiros, Hinton, *Layer Normalization*, 2016:
  한 training case 안의 unit statistics와 adaptive gain/bias.
- Srivastava et al., *Dropout*, JMLR 2014:
  training의 random thinning과 test-time approximation.
- PyTorch `Embedding` 공식 문서:
  fixed dictionary lookup, `padding_idx`, sparse gradient 같은 현재 API
  boundary. 이 글의 minimal gather/scatter는 `padding_idx`, `max_norm`,
  sparse storage를 구현하지 않는다.

### 금지 claim

- “LSTM은 기울기 소실을 해결한다”를 조건 없이 단정하지 않는다.
  cell path의 Jacobian은 forget gate의 곱이며 gate saturation과 other paths가
  남는다.
- LayerNorm의 `gamma=1, beta=0`을 전체 layer identity라고 부르지 않는다.
  이는 normalized value에 대한 affine identity일 뿐 입력 `x` 자체는 이미
  centered/scaled되었다.
- dropout이 항상 과적합을 막거나 추론 연산이 0이라는 주장을 하지 않는다.
- embedding lookup의 전체 복잡도를 근거 없이 `O(Vd)` 대 `O(nd)`로 단정하지
  않고 실제로 materialize하는 one-hot baseline과 gather를 비교한다.

## 숨은 전이 문제

```yaml
fixture:
  sequence:
    batch: 2
    time: 4
    feature: 3
    independent_examples: true
  lstm:
    forget_gates: [0.9, 0.8, 0.95, 0.7]
    required:
      - cell-path gradient product
      - reset between examples
      - detach after t=2 without erasing numeric state
  layer_norm:
    normalized_shape: [3]
    required:
      - per [batch,time] mean/variance over feature only
      - distinguish affine identity from full identity
  dropout:
    p: 0.25
    activation: 8
    required:
      - train nonzero scale
      - expected output
      - eval output
  embedding:
    ids: [2, 0, 2]
    required:
      - output shape
      - row 2 gradient doubled
      - row 1 untouched
  failures:
    - hidden state leaks from batch item 0 into item 1
    - normalize over time axis
    - reuse a new dropout mask in backward
    - assign rather than add repeated embedding gradient
```

공개 본문은 다른 수치와 ID를 쓴다.

## 서사

1. **시간축을 펼치면 graph가 길어진다**: state ownership, reset, detach.
2. **LSTM은 우회로가 아니라 조건부 additive memory path다**.
3. **LayerNorm은 어느 축을 한 sample로 보는가의 계약이다**.
4. **Dropout은 mode와 같은 mask를 소유한다**.
5. **Embedding은 lookup보다 repeated-index backward가 핵심이다**.

## 수식 계약

1. simple RNN recurrence와 chain product
2. LSTM `f,i,g,o,c,h` equations
3. `partial c_T / partial c_t = product f_k`
4. LayerNorm `mu`, `sigma^2`, `x_hat`, affine output
5. inverted dropout `y = m x / (1-p)`와 `E[y]=x`
6. embedding gather `Y_t = W_{id_t}`와 scatter-add

긴 LSTM 식은 gate, memory update, output 세 formula frame으로 나눈다. 모든
기호는 한국어 역할을 바로 뒤에 설명한다.

## Viz 계약

핵심 `SequenceStateLab` 하나가 네 tab을 가진다.

- `시간 상태`: reset/detach를 바꾸며 numeric state와 graph length를 분리 표시
- `LSTM memory`: gate slider가 memory contribution과 gradient product를 변경
- `정규화·Dropout`: axis/mode가 statistics와 expectation을 변경
- `Embedding`: token ID를 바꾸면 lookup row와 scatter ledger가 함께 변경

Viz는 목록형 정적 SVG가 아니라 reader control이 visible numeric invariant를
바꾸는 HTML/SVG hybrid다. 390px에서 tab label, formula, row ledger가 잘리지
않고 내부 horizontal scroll이 없어야 한다.

## 실행 코드와 테스트

- `src/sequence.rs`
- `tests/sequence_contract.rs`

필수:

1. explicit state reset and detach semantics
2. LSTM cell path matches gate product
3. LayerNorm reduces last feature axis per sample
4. deterministic inverted dropout mask reuses same backward path
5. repeated embedding indices accumulate gradients

## Metadata와 QA

- level: `advanced`
- estimated minutes: `42`
- prerequisites와 상위 handoff 추가
- source claim / Rust reconstruction / current API를 서로 다른 note로 표시
- cargo test, 390/768/1440, raw LaTeX, formula-note pair, keyboard,
  noninitial state를 release gate로 둔다.
