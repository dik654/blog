# AI Foundations 재구성 사양

## 목적

이 섹션의 목표는 개별 개념을 많이 나열하는 것이 아니다. 독자가 `입력 -> 모델 -> 예측 -> 손실 -> 기울기 -> 업데이트`를 하나의 학습 시스템으로 이해하고, 이후 CNN, Transformer, Diffusion, Robot Learning 글에서 같은 뼈대를 다시 찾게 만드는 것이다.

완독 기준:

- tensor의 shape를 따라 순전파를 계산한다.
- 분류 손실을 확률과 likelihood 관점에서 설명한다.
- 연쇄 법칙과 reverse-mode autodiff로 기울기 계산 순서를 설명한다.
- SGD, Momentum, AdamW가 저장하는 상태와 업데이트 차이를 비교한다.
- 학습 손실, 일반화 성능, 계산 비용을 서로 다른 문제로 구분한다.

## 독자와 설명 원칙

- 독자는 프로그래밍 경험이 있지만 대학 수준 수학을 순서대로 복습하지 않았다고 가정한다.
- 새 기호는 처음 등장할 때 말로 읽고, shape와 역할을 함께 설명한다.
- 모든 display formula 바로 아래에는 기호, 연산 이유, 출력의 의미를 적는다.
- Viz는 본문을 대체하지 않는다. 본문에서 입력, 변환, 출력을 먼저 설명한 뒤 같은 흐름을 시각화한다.
- 한 화면에는 하나의 질문만 둔다. Scene을 연속 배치하지 않고 2~4개의 본문 단락 뒤에 필요한 Viz 하나를 둔다.
- 고정 너비 SVG 텍스트를 피하고, 모바일에서는 세로 흐름으로 재배치되는 HTML/CSS 도식을 우선한다.
- 숫자 예시는 계산 전 상태와 계산 후 상태를 모두 보여준다.
- 역사, 모델 이름, 최신 GPU 목록은 원리를 설명하는 데 필요한 범위에서만 사용한다.

## 학습 경로

### Phase 00: 전체 지도

1. `deep-learning-overview`
   - 질문: 딥러닝 모델은 무엇을 어떤 순서로 배우는가?
   - 역할: 모든 후속 글의 좌표계. 역사·산업 목록이 아니라 학습 시스템의 전체 지도여야 한다.

### Phase 01: 첫 모델 만들기

1. `perceptron`
   - 가중합, 편향, 계단 함수, 선형 결정 경계, 퍼셉트론 학습 규칙.
   - 논리 게이트는 결정 경계를 검증하는 예제로만 사용한다.
2. `neural-network`
   - layer composition, tensor shape, batch, forward pass에 집중한다.
   - 활성화 함수 비교와 MNIST 구현은 중복을 줄이고 다음 글로 연결한다.
3. `activation-functions`
   - 비선형성이 없는 층 합성의 붕괴, derivative, saturation, gradient flow를 연결한다.

### Phase 02: 오차를 숫자로 만들기

1. `cross-entropy`
   - 확률분포 -> likelihood -> negative log-likelihood -> cross-entropy 순서로 전개한다.
   - softmax와 결합할 때의 안정적 구현(log-sum-exp)을 포함한다.

### Phase 03: 오차에서 학습 신호 만들기

1. `backprop-optimization`
   - 현행 42개 Scene을 약 10개 핵심 장면으로 줄인다.
   - softmax, cross-entropy, optimizer, regularization의 독립 설명은 각 전용 글로 이동한다.
   - computational graph, local derivative, vector-Jacobian product, reverse traversal에 집중한다.
2. `optimizers`
   - gradient descent, mini-batch noise, momentum state, Adam bias correction, AdamW의 decoupled weight decay를 설명한다.
   - scheduler와 optimizer의 책임을 구분한다.

### Phase 04: 표현 학습으로 통합

1. `autoencoder`
   - encoder/latent/decoder, reconstruction objective, bottleneck을 앞 개념의 통합 예제로 사용한다.
   - latent dimension 축소가 자동으로 의미 있는 표현이나 PCA와 같은 해를 보장하지 않는다는 한계를 포함한다.

## 선택 분기

- `fft`: AI Foundations의 필수 순서가 아니라 수학·신호 처리 분기다. convolution, spectral method, audio/time-series로 연결한다.
- `word2vec`: NLP 분기다. distributional hypothesis, embedding, negative sampling을 거쳐 attention/Transformer로 연결한다.

## 추가해야 할 기반

다음 네 묶음은 현재 글 사이의 실제 공백이다. 얕은 용어집으로 추가하지 않고 각각 계산 예제와 검산 문제를 갖춘 독립 글로 작성한다.

1. 선형대수와 tensor shape
   - vector, matrix, tensor, dot product, matrix multiplication, transpose, broadcasting.
   - shape mismatch를 직접 찾아 고치는 예제를 포함한다.
2. 미분과 계산 그래프
   - derivative, partial derivative, gradient, Jacobian, chain rule.
   - scalar-to-scalar에서 vector-Jacobian product까지 단계적으로 확장한다.
3. 확률과 정보 이론
   - random variable, distribution, expectation, likelihood, log, entropy, KL divergence.
   - coin flip과 multi-class classifier를 같은 표기에서 연결한다.
4. 통계와 일반화
   - sample/population, train/validation/test, data leakage, overfitting, bias-variance, calibration.
   - 낮은 train loss가 배포 성능을 보장하지 않는 반례를 포함한다.

물리학은 AI Foundations 공통 선수 과목으로 넣지 않는다. 좌표계, kinematics, dynamics, feedback control은 Robot AI 경로에서 실제 센서·행동 문제와 함께 추가한다.

## 글별 수정 우선순위

1. `deep-learning-overview`: 전체 지도형으로 전면 재작성.
2. `backprop-optimization`: 중복 분리, 장면 수 축소, 수식 사실관계 수정.
3. `neural-network`: forward/shape 중심으로 범위 축소, 모바일 Viz 재설계.
4. `perceptron`: 학습 규칙과 결정 경계 보강.
5. `cross-entropy`: likelihood와 안정적 구현 보강.
6. `activation-functions`: 비선형성, 초기화, gradient flow 연결.
7. `optimizers`: 상태, bias correction, scheduler, AdamW 보강.
8. `autoencoder`: 통합 프로젝트와 한계 보강.
9. `fft`, `word2vec`: 각 선택 분기로 이동하고 연결 글을 보강.

## 공통 UI 검수 기준

- 360px, 768px, 1440px에서 문서 전체의 가로 overflow가 0이다.
- 수식은 raw LaTeX 문자열을 노출하지 않고 KaTeX로 렌더링한다.
- display formula는 컨테이너보다 넓어지지 않으며, 핵심 식은 가로 스크롤 없이 읽힌다.
- SVG/Canvas 내부 텍스트가 잘리거나 겹치지 않는다.
- 첫 viewport에 제목, 글의 질문, 첫 설명 일부가 함께 보인다.
- Viz의 기본 상태만 보아도 입력과 출력이 구분된다.
- 동일한 Scene chrome이 세 번 이상 연속 반복되지 않는다.
- 색은 의미를 구분할 때만 사용하고 본문 텍스트 대비를 유지한다.

## 2026-07-18 공개 재구성 결정

- 카테고리 첫 화면은 평면 목록에서 `데이터 -> 모델 -> 예측 -> 손실 -> 기울기 -> 업데이트` 지도와 00–04 milestone 경로로 변경한다.
- 모든 core 글은 article coordinate, 큰 section number, 글별 semantic accent를 공유한다.
- 첫 Viz는 글마다 서로 다른 핵심 상태를 보여 준다: learning loop, contribution/threshold, tensor shape, nonlinear composition, surprisal, reverse signal, optimizer state, bottleneck, time-frequency dual, context pairs.
- 내부 가로 스크롤로 세부도를 숨기지 않는다. 360/768/1440 px에서 기본 상태가 온전히 읽혀야 한다.
- 7개 foundational paper article을 개념 직후에 배치하고, author intent·evidence limit·reproduction을 공통 schema로 렌더링한다.
- 공개 문제 풀이 섹션을 추가하지 않는다. `private-mastery-audit.md`의 transfer problem을 본문 충분성 검사에 사용한다.
- 섹션별 출처와 작성 의도는 `source-intent-ledger.md`, 논문 배치는 `foundational-paper-spine.md`에서 관리한다.
