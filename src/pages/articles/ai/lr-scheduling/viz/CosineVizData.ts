export const STEPS = [
  {
    label: 'Cosine Annealing — 코사인 곡선 감소',
    body: 'η_t = η_min + 0.5(η_max − η_min)(1 + cos(πt/T))\nt=0에서 η_max, t=T에서 η_min에 도달.\n코사인 곡선 특성: 초반엔 천천히 감소 → 중반에 빠르게 → 후반에 다시 천천히.\n후반의 작은 LR이 최솟값 근처에서 세밀한 탐색(fine-grained search)을 가능하게 함.\nPyTorch: CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)',
  },
  {
    label: 'Warm Restart (SGDR) — 주기적 LR 리셋',
    body: 'Loshchilov & Hutter 2017 (SGDR 논문).\n주기마다 LR을 η_max로 리셋 → 다시 코사인 감소.\nlocal minimum에 갇혔을 때 큰 LR로 탈출 가능.\nT_mult=2로 주기를 점점 늘림: 10→20→40 에포크.\n초반 짧은 주기로 다양한 영역 탐색, 후반 긴 주기로 안정 수렴.\nPyTorch: CosineAnnealingWarmRestarts(optimizer, T_0=10, T_mult=2)',
  },
  {
    label: 'Cosine vs Step — 왜 Cosine이 우세한가',
    body: 'StepLR: 급격한 계단에서 gradient 방향이 갑자기 변함 → 학습 불안정.\nCosine: 부드러운 전이로 gradient 충격 최소화.\n실험 결과: ImageNet에서 Cosine이 StepLR 대비 top-1 0.5~1% 향상.\n추가 이점: 하이퍼파라미터가 T_max와 η_min 둘뿐 — 튜닝이 간단.\n2020년 이후 CV/NLP 모두 Cosine 계열이 기본값으로 자리잡음.',
  },
];

export const C = {
  cosine: '#3b82f6',
  restart: '#ef4444',
  step: '#94a3b8',
  green: '#10b981',
  purple: '#8b5cf6',
  dim: '#94a3b8',
};
