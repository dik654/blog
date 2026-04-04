import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'SGD 기본 수식: θ = θ − η · ∇L(θ)', body: '파라미터 θ를 손실의 그래디언트 반대 방향으로 이동' },
  { label: 'η가 크면? — 최솟값 주변에서 발산', body: '학습률 0.5 → 오버슈팅으로 수렴 실패' },
  { label: 'η가 작으면? — 수렴이 너무 느림', body: '학습률 0.001 → 수백 스텝이 필요' },
  { label: '안장점(Saddle Point) — 그래디언트 ≈ 0 정체', body: '한 방향은 최소, 다른 방향은 최대 → SGD가 멈춤' },
];

/* 타원 등고선 중심 (cx, cy) */
export const CENTER = { x: 240, y: 100 };

/* SGD 지그재그 경로 — η 보통 */
export const PATH_NORMAL = [
  { x: 80, y: 40 }, { x: 140, y: 130 }, { x: 170, y: 55 },
  { x: 200, y: 115 }, { x: 220, y: 80 }, { x: 232, y: 105 },
  { x: 238, y: 95 }, { x: 240, y: 100 },
];

/* η 클 때 — 발산 */
export const PATH_LARGE = [
  { x: 80, y: 40 }, { x: 200, y: 160 }, { x: 60, y: 20 },
  { x: 260, y: 170 }, { x: 30, y: 10 }, { x: 300, y: 180 },
];

/* η 작을 때 — 느린 수렴 */
export const PATH_SMALL = [
  { x: 80, y: 40 }, { x: 88, y: 48 }, { x: 95, y: 44 },
  { x: 102, y: 52 }, { x: 108, y: 49 }, { x: 115, y: 56 },
  { x: 120, y: 53 }, { x: 126, y: 60 },
];

/* 안장점 정체 */
export const PATH_SADDLE = [
  { x: 80, y: 100 }, { x: 120, y: 100 }, { x: 150, y: 100 },
  { x: 165, y: 100 }, { x: 172, y: 100 }, { x: 175, y: 100 },
  { x: 176, y: 100 }, { x: 176, y: 100 },
];

export const COLORS = { path: '#0ea5e9', contour: '#64748b', saddle: '#ef4444' };
