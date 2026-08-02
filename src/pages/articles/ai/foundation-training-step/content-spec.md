# 한 Training Step 원장 content spec

## Goal

- 독자가 하나의 고정된 binary logistic unit에서 `입력 → logit → 확률 → BCE → gradient → SGD update → loss 재검산`을 같은 숫자로 끝까지 계산하게 한다.
- 각 값이 언제 만들어지고 어느 다음 연산의 입력이 되는지 원장처럼 추적해, 순전파·손실·역전파·옵티마이저를 서로 끊어진 공식으로 외우지 않게 한다.

## Source anchors

| Area | Primary source | Why it matters |
|---|---|---|
| Binary objective | PyTorch `BCEWithLogitsLoss` | Sigmoid와 BCE를 결합한 raw-logit 계약 및 수치 안정성 |
| Parameter update | PyTorch `SGD` | `parameter - learning rate × gradient`의 실제 optimizer step |
| Computation graph | Deep Learning Book, Ch. 6 | Feedforward network와 back-propagation의 공통 계산 구조 |
| Automatic differentiation | JMLR, *Automatic Differentiation in Machine Learning* | Reverse-mode가 scalar loss에서 많은 parameter gradient를 계산하는 이유 |

## Full-scope map

| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| Fixed ledger | `x=[1,2]`, `y=1`, `w=[0.2,-0.1]`, `b=0.1`을 모든 단계에서 재사용 | deep | local arithmetic + BCE contract | 기존 기반 글의 서로 다른 예제를 한 번에 닫는다 |
| Forward | dot product가 feature contribution을 합치고 sigmoid가 logit을 probability로 바꾸는 이유 | deep | BCEWithLogitsLoss | 학습 구현은 raw logit을 loss에 전달한다고 분리 |
| Objective | BCE의 log가 confident wrong answer를 크게 벌주는 이유 | deep | BCEWithLogitsLoss | `y=1`일 때 `-log p`로 축약 |
| Backward | `dL/dz=p-y`, `dL/dw=(p-y)x`, `dL/db=p-y` | deep | computation graph | local derivative와 input responsibility를 연결 |
| Update | 같은 gradient로 learning rate만 바꿔 새 parameter와 새 loss 계산 | deep | SGD | gradient를 새 parameter에서 다시 계산한 것처럼 섞지 않음 |
| Verification | loss 감소는 한 sample·한 작은 step의 local 결과임을 제한 | deep | SGD + validation practice | 전체 데이터 일반화 보장으로 과장하지 않음 |
| Multilayer transfer | 깊은 network는 같은 local contract를 layer마다 반복 | brief | AD survey | matrix/Jacobian 확장은 다음 글들의 지식을 재사용 |
| Autoencoder handoff | label `y` 대신 input `x`를 target으로 바꾸되 loop는 유지 | brief | autoencoder article | 다음 글의 역할을 통합 예제가 아니라 objective transfer로 명확화 |

## Reader prerequisites

- logit: 확률로 바꾸기 전의 제한 없는 실수 score.
- gradient: 현재 parameter를 아주 조금 바꿀 때 loss가 어느 방향으로 얼마나 변하는지 나타내는 local slope.
- learning rate: gradient 방향으로 실제로 이동할 비율.

## Section 1: 고정 원장 -- 무엇을 끝까지 바꾸지 않을까?

- Concept: 하나의 sample과 하나의 logistic unit만 두고 각 값의 생성 시점을 고정한다.
- Key variables:
  - `x=[1,2]`: 두 feature.
  - `y=1`: binary target.
  - `w=[0.2,-0.1]`, `b=0.1`: update 전 parameter snapshot.
- Execution flow:
  1. 입력과 parameter snapshot을 기록한다.
  2. 해당 snapshot으로만 forward와 gradient를 계산한다.
  3. optimizer가 새 snapshot을 만든 뒤 forward를 다시 실행한다.
- Design insight:
  - 계산 중간에 parameter를 덮어쓰면 gradient가 어느 snapshot의 책임인지 잃는다.
- Edge cases/failure modes:
  - sigmoid probability를 fused BCE에 다시 전달하면 sigmoid가 중복된다.
  - update 뒤의 loss를 이전 logit으로 계산하면 검산이 무효다.
- Viz plan:
  - Step 0: input, target, parameter snapshot.
  - Step 1: 여섯 단계 ledger의 비활성 상태.
  - Step 2: 현재 단계만 accent하고 들어온 값·연산·나간 값을 함께 표시.

## Section 2: 인터랙티브 원장 -- 값은 어느 단계에서 바뀌나?

- Concept: learning rate를 조절하면서 계산 그래프와 optimizer state transition을 구분한다.
- Execution flow:
  1. Forward에서 `z=0.1`, `p≈0.52498`.
  2. Loss에서 `L≈0.64440`.
  3. Backward에서 `δ≈-0.47502`, `dw=[δ,2δ]`, `db=δ`.
  4. Update에서 `w'=w-ηdw`, `b'=b-ηdb`.
  5. Verify에서 새 parameter로 `z'`, `p'`, `L'`를 다시 계산.
- Design insight:
  - learning rate는 gradient를 바꾸지 않고 update 크기만 바꾼다. 새 위치에서는 다시 forward/backward해야 다음 gradient가 생긴다.
- Viz plan:
  - 2×3 mobile / 6-column desktop stage selector; horizontal scroll 금지.
  - 현재 단계의 input, operation, output을 stable three-band surface에 표시.
  - before/after loss bar는 같은 scale을 사용하고 숫자를 병기.
  - range input은 `0.02–0.30`, default `0.10`.

## Section 3: 수식 해부 -- 왜 이 연산을 고르나?

- Concept: 각 공식의 기호보다 연산 선택 이유를 바로 아래에서 설명한다.
- Formula groups:
  1. dot product + bias, sigmoid.
  2. BCE, fused derivative `p-y`.
  3. weight/bias gradients.
  4. SGD update, re-forward, loss delta.
- Design insight:
  - dot product는 feature별 contribution을 합친다.
  - sigmoid는 score의 순서를 보존하며 `(0,1)`로 옮긴다.
  - log는 확신한 오답을 강하게 벌한다.
  - `p-y`는 sigmoid와 BCE의 derivative가 약분된 안정적인 logit signal이다.
  - `×x`는 그 weight가 실제로 본 input만큼 책임을 배분한다.
  - gradient를 빼는 것은 1차 근사에서 loss 감소 방향으로 움직이기 때문이다.
- Formula rule:
  - 모든 display KaTeX 직후 `FormulaNote`를 둔다.
  - 한국어 underbrace를 포함하고 mobile에서 자동 축소되더라도 0.52 아래로 내려가지 않게 식을 분리한다.

## Section 4: 구현·검증 -- 숫자가 맞아도 무엇을 더 확인할까?

- Concept: framework code의 실행 순서와 수학 ledger를 일치시킨다.
- Execution flow:
  1. gradient를 비운다.
  2. raw logits를 만든다.
  3. fused loss를 계산한다.
  4. backward로 gradient를 채운다.
  5. optimizer step으로 parameter를 갱신한다.
  6. 새 forward를 별도로 실행해 loss를 비교한다.
- Failure modes:
  - probability를 `BCEWithLogitsLoss`에 전달.
  - `zero_grad` 누락으로 gradient 누적.
  - update 전후 loss를 서로 다른 sample/batch로 비교.
  - 한 sample의 loss 감소를 validation 성능 향상으로 일반화.
- Transfer checks:
  - fused BCE에 probability를 넘겼을 때 sigmoid가 중복되는 계약 오류.
  - 한 sample의 update 후 loss 감소를 validation 성능 향상으로 일반화할 수 없는 이유.
  - 같은 parameter에 새 입력과 반대 label을 넣었을 때 gradient 부호를 update 전에 예측하는 방법.
- Handoff:
  - Autoencoder는 loop를 새로 배우는 글이 아니라 target과 representation objective를 바꾸는 다음 실험이다.

## Cross-section narrative

- Section 1이 immutable snapshot을 고정하고, Section 2가 그 snapshot의 값 흐름을 보여 준다.
- Section 3이 각 화살표의 수학적 이유를 해부하고, Section 4가 framework 실행 순서와 failure gate로 닫는다.
- 모든 섹션은 `같은 숫자`, `같은 parameter snapshot`, `새 위치에서는 재-forward`라는 세 불변식을 반복한다.

## Coverage recheck

| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| Same-number continuity | 1, 2, 3 | none | 테스트에서 핵심 numeric data attribute 검증 |
| Formula operation reasons | 3 | none | 모든 display formula 바로 뒤 FormulaNote |
| Responsive Viz | 2 | none | 390×844, 768×1024, 1440×900 screenshot 검증 |
| Framework contract | 4 | none | raw logits, zero_grad, re-forward 명시 |
| Generalization boundary | 4 | none | one-sample local result임을 경고 |
| Next article handoff | 4 | none | autoencoder의 target/objective 변화로 연결 |
