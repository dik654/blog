import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'SGD 진동 문제 — 좁은 골짜기에서 지그재그', body: '수직 방향 그래디언트가 크고, 수평 방향은 작아서 진동' },
  { label: '속도 벡터(v) 도입 — 이전 방향을 기억', body: 'v_t = β · v_{t-1} + ∇L(θ) — 관성처럼 이전 방향 유지' },
  { label: 'β의 역할 — 지수 이동 평균으로 ~10스텝 기억', body: 'β=0.9 → 최근 10스텝의 그래디언트를 가중 평균' },
  { label: '수렴 비교 — Momentum이 부드럽게 최솟값 도달', body: 'SGD 지그재그 vs Momentum 부드러운 곡선' },
];

export const CENTER = { x: 300, y: 100 };

/* SGD: 지그재그 */
export const SGD_PATH = [
  { x: 60, y: 40 }, { x: 100, y: 145 }, { x: 145, y: 50 },
  { x: 185, y: 135 }, { x: 220, y: 70 }, { x: 250, y: 115 },
  { x: 275, y: 90 }, { x: 295, y: 105 },
];

/* Momentum: 부드러운 곡선 */
export const MOM_PATH = [
  { x: 60, y: 40 }, { x: 110, y: 80 }, { x: 155, y: 95 },
  { x: 200, y: 100 }, { x: 240, y: 102 }, { x: 270, y: 100 },
  { x: 290, y: 100 }, { x: 300, y: 100 },
];

export const COLORS = {
  sgd: '#0ea5e9',
  momentum: '#10b981',
  contour: '#64748b',
  velocity: '#f59e0b',
};
