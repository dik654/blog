export const TOKENS = ['나는', '학생', '이다'];

// 스케일된 어텐션 스코어 (마스크 적용 전)
export const BEFORE: number[][] = [
  [0.50, 0.24, 0.16],
  [0.30, 0.18, 0.11],
  [0.19, 0.10, 0.07],
];

// 마스크: 상삼각 = true (미래 위치)
export const MASK: boolean[][] = [
  [false, true, true],
  [false, false, true],
  [false, false, false],
];

// 마스크 적용 후 (-∞ → 표시상 -inf)
export const MASKED: (number | string)[][] = [
  [0.50, '-inf', '-inf'],
  [0.30, 0.18, '-inf'],
  [0.19, 0.10, 0.07],
];

// Softmax 결과 (-inf → 0)
export const SOFTMAX: number[][] = [
  [1.00, 0.00, 0.00],
  [0.53, 0.47, 0.00],
  [0.35, 0.32, 0.33],
];

export const STEPS = [
  { label: '스케일된 어텐션 스코어' },
  { label: '미래 위치에 -∞ 마스크 적용' },
  { label: 'Softmax → 미래 토큰 확률 = 0' },
];

export const COLORS = {
  normal: '#6366f1',
  masked: '#ef4444',
  result: '#10b981',
};
