export const STEPS = [
  {
    label: '데이터 파이프라인',
    body: 'MNIST 28×28 이미지 → 784차원 벡터로 flatten. 픽셀값 [0,255] → [0,1] 변환 후 정규화: x\' = (x - 0.1307) / 0.3081.\nmean=0.1307은 MNIST 전체 평균, std=0.3081은 표준편차 — 입력 분포를 N(0,1)에 가깝게 맞춰 학습 안정화.\nDataLoader가 60,000장을 batch_size=64로 나눠 938개 미니배치 생성. shuffle=True로 매 에포크 순서를 섞어 일반화 능력 향상.\n테스트셋 10,000장은 shuffle=False — 평가 재현성 보장.',
  },
  {
    label: 'MLP 모델 정의',
    body: '구조: 784 → fc1(256) → ReLU → fc2(128) → ReLU → fc3(10). 총 파라미터 약 235K개.\nfc1 가중치: W₁ ∈ R^{256×784} = 200,704개, 바이어스 b₁ ∈ R^{256}. Xavier 초기화로 분산을 1/n_in으로 설정.\nReLU(x) = max(0, x) — 은닉층에만 적용. 음수 기울기 0으로 잘라 비선형성 부여하면서 기울기 소실(vanishing gradient) 방지.\n출력층은 raw logits(비정규화 점수) 그대로 반환 — CrossEntropyLoss가 내부에서 softmax + NLL을 결합하여 수치 안정성 확보.',
  },
  {
    label: '훈련 루프 — 1 iteration',
    body: '① optimizer.zero_grad() — 이전 배치의 기울기를 0으로 초기화. PyTorch는 기울기를 누적하므로 반드시 초기화 필요.\n② output = model(x) — 순전파. 784→256→128→10 경로로 logits 계산.\n③ loss = F.cross_entropy(output, target) — 손실 계산. L = -Σ yᵢ log(softmax(zᵢ)). 첫 에포크 초기 loss ≈ 2.3 (= -log(1/10), 랜덤 예측).\n④ loss.backward() — 역전파. chain rule로 dL/dW₁, dL/dW₂, dL/dW₃ 모두 계산.\n⑤ optimizer.step() — SGD: W ← W - lr·∇W. lr=0.01, momentum=0.9 사용 시 이전 기울기 방향도 반영.\n938배치 × 10에포크 = 총 9,380 iteration. 최종 loss ≈ 0.05 수준으로 수렴.',
  },
  {
    label: '평가 — 정확도 측정',
    body: 'model.eval() — 드롭아웃 비활성화, BatchNorm을 학습 통계 대신 이동 평균 사용. 평가 시 확률적 동작을 제거해 결과 재현.\ntorch.no_grad() — 기울기 계산 그래프를 생성하지 않아 메모리 30~50% 절감, 속도 향상.\n예측: pred = output.argmax(dim=1). 10차원 logits 중 최대값 인덱스 = 예측 숫자(0~9).\n정확도 = 정답 수 / 전체 수. MLP(3층)로 MNIST에서 약 97.5~98.2% 달성 가능.\nCNN(LeNet-5)은 99.2%, 현재 SOTA(EfficientNet)는 99.7% — MLP 대비 약 1.5%p 차이가 공간 구조 활용 여부에서 발생.',
  },
];

export const C = {
  data: '#3b82f6',
  model: '#10b981',
  train: '#f59e0b',
  eval: '#8b5cf6',
  dim: '#94a3b8',
  loss: '#ef4444',
};
