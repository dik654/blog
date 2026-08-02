# 역전파 글 재구성 사양

## 중심 질문

Scalar loss 하나에서 모델의 모든 파라미터 gradient를 어떻게 중복 계산 없이 얻는가?

## 포함 범위

1. Forward state와 backward query의 구분.
2. Primitive operation으로 구성된 계산 그래프.
3. Upstream gradient, local derivative, chain rule.
4. 분기 그래프의 gradient accumulation.
5. Forward mode와 reverse mode의 입출력 비대칭.
6. VJP와 한 선형층의 tensor backward.
7. Dynamic autograd의 reverse topological traversal.
8. Finite difference와 실제 실패 진단.

## 제외하고 연결할 범위

- Softmax, cross-entropy, likelihood: `cross-entropy`로 연결.
- SGD, Momentum, Adam, AdamW, scheduler: `optimizers`로 연결.
- L1/L2, dropout, BatchNorm, early stopping: 일반화·정규화 전용 글로 이동 예정.
- 순전파의 layer composition과 activation 비교: `neural-network`, `activation-functions`로 연결.

## 시각 설계

- Scene chrome은 사용하지 않는다.
- 순전파/역전파 탭 하나와 branch accumulation 도식 하나만 핵심 interactive visual로 사용한다.
- 수식은 한 박스에 한 연산만 배치하고 360px에서 스크롤 없이 읽혀야 한다.
- 모든 gradient 결과는 미분 대상과 동일한 shape인지 표시한다.

## 사실 검수

- Reverse mode의 비용을 O(1)로 표현하지 않는다.
- Backpropagation과 optimizer update를 구분한다.
- 전체 Jacobian을 명시적으로 만들지 않고 VJP를 계산한다는 점을 밝힌다.
- 분기에서는 gradient를 곱하는 것이 아니라 각 경로 기여를 합산한다.
- gradient accumulation이 프레임워크 기본 동작임을 명시한다.
