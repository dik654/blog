# 퍼셉트론 글 재구성 사양

## 중심 질문

Weight와 bias를 가진 단일 선형 분류기는 어떤 경계를 만들고, 오분류에서 어떻게 그 경계를 움직이는가?

## 포함 범위

- weighted sum, bias, step decision.
- 2차원 decision boundary와 hyperplane 일반화.
- AND, OR, NAND 파라미터를 같은 도식에서 비교.
- 오분류 하나가 perceptron learning rule의 한 번 업데이트로 경계를 어떻게 옮기는지 계산.
- linear separability와 convergence 조건.
- XOR 반례와 최소한의 다층 표현 연결.

## 후속 글로 이동

- Layer composition, batch, output head: `neural-network`.
- activation function 비교: `activation-functions`.
- differentiable loss와 gradient: `cross-entropy`, `backprop-optimization`.

## 시각 기준

- 논리 게이트 truth table 나열보다 결정 경계가 먼저다.
- AND/OR/NAND는 같은 좌표와 scale에서 전환한다.
- 학습 규칙은 같은 샘플의 `score⁰ → score¹`와 한 번의 파라미터 변화를 모두 보여준다.
- 각 업데이트 뒤 `w,b`로 `score=0` 경계를 다시 계산하고 같은 좌표계에서 실제로 다시 그린다.
- 360px에서 SVG label과 수식이 잘리지 않아야 한다.

## 비공개 숙달 문제

본문만 읽은 뒤 다음을 외부 해설 없이 계산할 수 있어야 한다.

1. `x=[2,-1]`, `y=0`, `w⁰=[0.3,0.3]`, `b⁰=0.2`, `η=0.5`에서 첫 score와 예측을 구한다.
2. 이 오분류에 learning rule을 한 번 적용해 `w¹,b¹`을 구한다.
3. 같은 샘플의 새 score와 예측을 다시 계산해 수정 방향이 맞았는지 확인한다.
4. update 전후의 `score=0` 직선을 같은 좌표계에 그리고, weight와 bias가 각각 경계의 방향과 위치를 어떻게 바꿨는지 설명한다.
5. 이 한 번의 성공이 전체 데이터셋 수렴을 보장하지 않는 이유와 linear separability 조건을 말한다.
