import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Grid Search — 모든 조합을 빠짐없이 탐색',
    body: '탐색 공간을 균등 격자로 나누어 전부 시도. 차원이 늘면 조합이 기하급수적으로 폭발(3개 파라미터 × 10개 값 = 1,000회). 비효율적이지만 빠짐없다는 장점.',
  },
  {
    label: 'Random Search — 무작위 샘플링이 Grid보다 효율적',
    body: 'Bergstra & Bengio(2012) 실험: 동일 예산일 때 Random이 Grid보다 더 좋은 조합을 찾음. 이유 — 파라미터 중요도가 불균등하면 Grid는 중요하지 않은 축에 예산을 낭비.',
  },
  {
    label: 'Bayesian Optimization — surrogate model로 유망 영역 집중',
    body: 'surrogate model(대리 모델): 평가된 점들로 목적 함수의 근사 모델을 학습 → acquisition function(획득 함수)으로 "다음에 어디를 평가할지" 결정.\nExploitation(착취, 좋은 영역 집중) vs Exploration(탐험, 미탐색 영역 시도) 균형.',
  },
  {
    label: 'TPE — Optuna 기본 sampler (Tree-structured Parzen Estimator)',
    body: 'GP(Gaussian Process) 기반 BO의 확장성 한계를 극복한 방법.\np(x|y < y*): 좋은 결과를 낸 파라미터 분포(l) / p(x|y ≥ y*): 나쁜 결과의 분포(g)\nEI(x) ∝ l(x)/g(x) — l이 크고 g가 작은 지점이 유망.',
  },
];

/** Grid search points (uniform 5×5) */
export const GRID_PTS = Array.from({ length: 25 }, (_, i) => ({
  x: 60 + (i % 5) * 80,
  y: 30 + Math.floor(i / 5) * 32,
}));

/** Random search points (scattered) */
const RAND_SEED = [
  [78, 42], [210, 110], [130, 65], [350, 90], [90, 140],
  [280, 55], [170, 130], [310, 35], [55, 95], [240, 75],
  [160, 45], [380, 120], [110, 110], [300, 140], [200, 50],
  [340, 65], [70, 130], [250, 100], [140, 85], [320, 45],
];
export const RAND_PTS = RAND_SEED.map(([x, y]) => ({ x, y }));

/** Bayesian — evaluated + next candidate */
export const BAYES_EVALUATED = [
  { x: 150, y: 70, score: 0.82 },
  { x: 280, y: 50, score: 0.89 },
  { x: 200, y: 110, score: 0.76 },
  { x: 100, y: 130, score: 0.71 },
  { x: 320, y: 80, score: 0.91 },
  { x: 250, y: 90, score: 0.85 },
];
export const BAYES_NEXT = { x: 340, y: 65 };

/** TPE — l(good) and g(bad) distributions */
export const TPE_GOOD = [
  { x: 260, y: 140 }, { x: 280, y: 80 }, { x: 300, y: 50 },
  { x: 320, y: 40 }, { x: 340, y: 55 }, { x: 360, y: 90 }, { x: 380, y: 140 },
];
export const TPE_BAD = [
  { x: 50, y: 140 }, { x: 80, y: 100 }, { x: 110, y: 70 },
  { x: 140, y: 55 }, { x: 170, y: 50 }, { x: 200, y: 60 },
  { x: 230, y: 80 }, { x: 260, y: 120 }, { x: 290, y: 140 },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
