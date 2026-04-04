/* d_model=8, h=4, d_k=2 — 실제 값으로 시연 */
export const FULL_VEC = [0.31, -0.12, 0.78, 0.45, -0.56, 0.22, 0.67, -0.33];

export const HEADS = [
  { label: 'Head 1', color: '#3b82f6', slice: [0, 2] as const },
  { label: 'Head 2', color: '#10b981', slice: [2, 4] as const },
  { label: 'Head 3', color: '#f59e0b', slice: [4, 6] as const },
  { label: 'Head 4', color: '#ef4444', slice: [6, 8] as const },
];

export const HEAD_OUT = [
  [0.44, -0.08],
  [0.61, 0.33],
  [-0.39, 0.15],
  [0.52, -0.21],
];

export const CONCAT = HEAD_OUT.flat();

export const STEPS = [
  { label: '입력 (d_model=8)' },
  { label: '4개 Head로 분할 (d_k=2)' },
  { label: '각 Head 독립 Attention' },
  { label: 'Concat → W_O → 출력' },
];
