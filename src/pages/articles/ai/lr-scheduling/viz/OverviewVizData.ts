export const STEPS = [
  {
    label: '학습률(Learning Rate)이란',
    body: '학습률 η는 매 업데이트에서 gradient 방향으로 이동하는 "보폭" 크기.\nθ_new = θ_old − η × ∇L(θ)\n이 한 줄이 모든 경사 하강법의 본질.\nη가 크면 보폭이 넓어 빠르지만 불안정, η가 작으면 안정적이지만 수렴이 느림.\n딥러닝에서 학습률이 가장 중요한 하이퍼파라미터로 꼽히는 이유.',
  },
  {
    label: '학습률이 너무 크면 — 발산',
    body: 'η=1.0처럼 큰 값 → loss가 줄지 않고 오히려 증가.\n최솟값을 넘어 반대편으로 튕겨나감 → 진동 → 결국 NaN (수렴 실패).\nSGD에서 η=0.1이면 잘 되는 문제도 η=1.0이면 발산하는 예가 흔함.\n실무 증상: loss가 epoch 1부터 NaN 또는 inf → LR이 너무 큰 신호.',
  },
  {
    label: '학습률이 너무 작으면 — 느린 수렴',
    body: 'η=0.00001처럼 작은 값 → 매 step에 미세하게 이동.\n100 epoch 돌려도 loss가 거의 안 줄어듦.\n더 나쁜 경우: 얕은 local minimum이나 saddle point에 갇힘.\n시간·비용이 낭비되고, 최적 해에 도달하지 못하는 경우가 다수.\nGPU 시간 = 비용이므로 "적당히 빠르게 수렴"이 실전 목표.',
  },
  {
    label: '고정 LR vs 스케줄링',
    body: '고정 LR: 훈련 내내 동일한 η 사용 → 시작할 때 적절한 값이 끝에는 너무 클 수 있음.\n스케줄링: 훈련 진행에 따라 η를 동적으로 변경.\n초반엔 큰 LR로 빠르게 loss 지형을 탐색, 후반엔 작은 LR로 세밀하게 수렴.\n2024~ 표준: Warmup(0→η) + Decay(η→0) 조합 — LLM 훈련 기본.\n다음 섹션에서 Step, Exponential, Cosine, OneCycle, Warmup 전략을 하나씩 분석.',
  },
];

export const C = {
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  dim: '#94a3b8',
};
