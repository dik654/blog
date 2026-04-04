export const STEPS = [
  { label: 'CNN의 3가지 귀납적 편향' },
  { label: '지역성: 수용야 = 3×3' },
  { label: '평행이동 불변성: 같은 커널이 전체 순회' },
  { label: '계층 구조: 층이 깊을수록 수용야 확장' },
];

export const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };
export const C = 14;

// 5x5 grid for locality demo
export const IMG = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
];

// Pattern at position A (top-left)
export const POS_A = [
  [1, 1, 0, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0], [0, 0, 0, 0, 0],
];

// Same pattern at position B (bottom-right)
export const POS_B = [
  [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1], [0, 0, 0, 0, 1],
];

export const OVERVIEW_CARDS = [
  { label: '지역성', num: '9', unit: 'params', desc: '3×3 커널', color: '#3b82f6', x: 20 },
  { label: '불변성', num: '1', unit: 'kernel', desc: '전체 공유', color: '#8b5cf6', x: 180 },
  { label: '계층 구조', num: '5→14→22', unit: 'px', desc: '수용야 확장', color: '#f59e0b', x: 340 },
];

export const DEPTH_LAYERS = [
  { layer: 'Conv 1', rf: 3, color: '#3b82f6', x: 10 },
  { layer: 'Conv 1+2', rf: 5, color: '#8b5cf6', x: 130 },
  { layer: 'Conv 1+2+3', rf: 7, color: '#f59e0b', x: 270 },
];
