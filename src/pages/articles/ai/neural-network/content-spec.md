# 신경망 글 재구성 사양

## 중심 질문

퍼셉트론 여러 개를 layer로 묶고 합성할 때 값과 tensor shape는 어떻게 흐르는가?

## 비공개 mastery gate

- `X[B,2]`를 두 층에 통과시키며 sample, batch, parameter, output shape를 모두 추적할 수 있어야 한다.
- 저장된 weight `[out,in]`와 글의 계산 표기 `[in,out]`를 구분하고, 샘플 하나에서는 통과하지만 batch에서 깨지는 전치 오류를 진단할 수 있어야 한다.
- `x=[1,2]`의 두 층 순전파를 행렬 원소별 기여까지 계산할 수 있어야 한다.
- 회귀, binary, multiclass, multilabel 각각에서 model output과 target shape를 함께 고를 수 있어야 한다.

## 포함 범위

- 뉴런에서 vector output과 matrix multiplication으로 확장.
- 입력층, 은닉층, 출력층의 역할.
- 단일 sample과 batch의 shape.
- 편향 broadcasting.
- PyTorch `Linear`의 `y=xA^T+b`, weight `[out,in]` 저장 계약.
- sample-only matmul이 batch에서 실패하는 counterexample.
- 2-layer MLP의 완전한 숫자 순전파.
- 회귀, binary, multi-class, multi-label의 output·target·loss 계약.
- 파라미터 수와 구현 경계 검산.

## 다른 글로 연결할 범위

- 활성화 함수 계보와 derivative: `activation-functions`.
- likelihood, softmax, cross-entropy: `cross-entropy`.
- gradient 계산: `backprop-optimization`.
- optimizer update: `optimizers`.
- MNIST 전체 훈련은 별도 end-to-end capstone으로 추가한다.

## 시각 기준

- 함수 합성 도식 하나, shape 전환 탭 하나, sample/batch 전치 오류 debugger 하나, 숫자 순전파 탭 하나.
- 모든 layer 경계에 shape를 표시한다.
- 360/390px에서는 흐름을 세로로, 768px 이상에서는 한 줄 또는 비교 가능한 두 열로 보여 준다.
- 768px의 5단계 overview는 각 stage 폭 108px 이상, 수식 최소 글자 12px 이상을 유지한다.
- 360px에서 수식과 코드는 잘리지 않으며 문서와 Viz에 가로 스크롤이 없어야 한다.

## 근거와 의도

- Deep Learning Book ch. 6: feedforward network를 함수 합성과 output unit으로 설명하는 개념 뼈대.
- PyTorch `Linear`: 저장된 weight가 `[out,in]`이고 연산은 `xA^T+b`라는 구현 경계.
- PyTorch `BCEWithLogitsLoss`: binary·multi-label input과 target이 같은 shape라는 계약.
- PyTorch `CrossEntropyLoss`: multiclass logits `[B,C]`와 class-index target `[B]`의 기본 계약.
- 목적은 API 목록을 외우게 하는 것이 아니라, 바뀐 task와 framework에서도 마지막 차원과 target 계약을 다시 유도하게 하는 것이다.
