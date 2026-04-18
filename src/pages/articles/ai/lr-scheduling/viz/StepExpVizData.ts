export const STEPS = [
  {
    label: 'StepLR — N 에포크마다 γ배 감소',
    body: 'PyTorch: StepLR(optimizer, step_size=30, gamma=0.1)\n매 30 에포크마다 LR을 현재값의 γ=0.1배로 줄임.\nη_t = η₀ × γ^(floor(t/step_size))\n예: η₀=0.1 → 0~29: 0.1, 30~59: 0.01, 60~89: 0.001\n장점: 구현 간단, 계단식이라 디버깅 용이.\n단점: step_size와 γ를 수동 지정 — 최적 지점을 사전에 알기 어려움.',
  },
  {
    label: 'ExponentialLR — 매 에포크 연속 감소',
    body: 'PyTorch: ExponentialLR(optimizer, gamma=0.95)\n매 에포크마다 η_t = η₀ × γ^t — 지수적으로 부드럽게 감소.\nγ=0.95일 때: 10 에포크 후 η=0.6η₀, 50 에포크 후 η=0.077η₀.\nStepLR과 달리 급격한 계단이 없어 학습이 더 안정적.\n주의: γ가 1에 너무 가까우면 감소가 느리고, 0.9 이하면 너무 급격.',
  },
  {
    label: 'MultiStepLR — 사용자 지정 마일스톤',
    body: 'PyTorch: MultiStepLR(optimizer, milestones=[30,80], gamma=0.1)\n지정된 에포크에서만 LR을 γ배 — StepLR보다 유연.\n예: [30,80]이면 epoch 0~29: η₀, 30~79: 0.1η₀, 80~: 0.01η₀.\nResNet 원 논문에서 사용 — 160 epoch 중 [80, 120]에서 감소.\n실무: validation loss curve를 보고 마일스톤 결정.',
  },
  {
    label: 'ReduceLROnPlateau — 자동 감지 감소',
    body: 'PyTorch: ReduceLROnPlateau(optimizer, patience=10, factor=0.5)\nvalidation loss가 patience 에포크 동안 개선되지 않으면 LR을 factor배.\n반응형 — 사전에 마일스톤을 정할 필요 없음.\npatience=10, factor=0.5: 10 에포크 정체 → LR 절반.\n장점: 데이터셋·모델에 적응적. 단점: 반응이 느릴 수 있음.',
  },
];

export const C = {
  step: '#3b82f6',
  exp: '#10b981',
  multi: '#8b5cf6',
  plateau: '#ef4444',
  dim: '#94a3b8',
  amber: '#f59e0b',
};
