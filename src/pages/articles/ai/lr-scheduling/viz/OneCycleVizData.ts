export const STEPS = [
  {
    label: '1Cycle Policy — LR을 올렸다가 내리는 삼각형',
    body: 'Leslie Smith 2018.\n훈련을 세 구간으로 나눔:\n① Warmup (0→max_lr): 전체의 ~30%\n② Annealing (max_lr→max_lr/25): 전체의 ~70%\n③ Annihilation (max_lr/25→0): 마지막 몇 %\nPyTorch: OneCycleLR(optimizer, max_lr=0.01, total_steps=1000)\n핵심 아이디어: 큰 LR 구간이 regularizer 역할 → 과적합 방지.',
  },
  {
    label: 'Super-Convergence — 5배 빠른 수렴',
    body: 'Smith & Topin 2019: 1Cycle로 CIFAR-10을 5배 적은 iteration에 수렴.\n높은 max_lr이 핵심 — 일반 훈련의 3~10배 큰 LR 사용.\n큰 LR = 넓은 미니마(flat minimum)로 수렴 → 일반화 성능 향상.\n고정 LR 0.001로 200 epoch ≈ 1Cycle max_lr=0.01로 40 epoch.\nSuper-Convergence 조건: BN 사용, 충분한 모델 용량, 적절한 max_lr.',
  },
  {
    label: 'LR Range Test — max_lr 찾기',
    body: 'Smith 2015: LR을 매우 작은 값(1e-7)에서 큰 값(10)까지 선형/지수 증가.\n각 미니배치에서 loss 기록 → loss가 급감하는 구간의 LR = 좋은 후보.\nloss가 다시 증가하기 직전의 LR = max_lr 상한.\n실전: lr_finder로 10~20 미니배치 스캔 → 그래프에서 가파른 하강 지점 선택.\nPyTorch Lightning: Tuner(trainer).lr_find(model)로 자동화.',
  },
  {
    label: '1Cycle 실전 설정 가이드',
    body: 'max_lr: LR Range Test에서 loss 급감 구간 (일반적으로 base_lr의 10배).\ndiv_factor=25: initial_lr = max_lr/25 (warmup 시작점).\nfinal_div_factor=1e4: min_lr = initial_lr/1e4 (annihilation 끝점).\npct_start=0.3: 전체 step의 30%를 warmup에 할당.\nanneal_strategy="cos": cosine annealing (linear도 가능).\nResNet-50/CIFAR-10: max_lr=0.1, 40 epoch → 94.5% accuracy.',
  },
];

export const C = {
  warmup: '#ef4444',
  anneal: '#3b82f6',
  annihilate: '#8b5cf6',
  green: '#10b981',
  amber: '#f59e0b',
  dim: '#94a3b8',
};
