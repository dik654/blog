export const STEPS = [
  { label: 'Layer 1: 엣지 감지' },
  { label: 'Layer 2~3: 도형 감지' },
  { label: 'Layer 4~5: 부분 인식' },
  { label: '최종: 물체 인식' },
  { label: '인간 시각 시스템과의 대응' },
];

export const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

// 3x3 kernel patterns showing each layer's learned features
export const EDGE_V: number[][] = [[0, 1, 0], [0, 1, 0], [0, 1, 0]]; // vertical
export const EDGE_H: number[][] = [[0, 0, 0], [1, 1, 1], [0, 0, 0]]; // horizontal
export const EDGE_D: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // diagonal

// 5x5 shape patterns (edges combine)
export const SHAPE_L: number[][] = [
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
];
export const SHAPE_C: number[][] = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
];

// 7x7 part-level patterns (shapes combine into parts)
export const PART_EYE: number[][] = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
];

export const LAYERS = [
  { label: 'Conv 1', sub: '엣지', color: '#3b82f6', brain: 'V1' },
  { label: 'Conv 2-3', sub: '도형', color: '#8b5cf6', brain: 'V2' },
  { label: 'Conv 4-5', sub: '부분', color: '#f59e0b', brain: 'V4' },
  { label: 'FC', sub: '물체', color: '#ef4444', brain: 'IT' },
];
