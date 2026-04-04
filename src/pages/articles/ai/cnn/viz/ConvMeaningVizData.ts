export const STEPS = [
  { label: '이미지와 커널', body: '5×5 이미지에 3×3 커널을 합성곱합니다.' },
  { label: '커널 1: 직선 감지', body: '직선 패턴 커널 → 직선이 있는 부분에서 출력값이 높습니다.' },
  { label: '커널 2: 곡선 감지', body: '곡선 패턴 커널 → 곡선이 있는 부분에서 출력값이 높습니다.' },
  { label: '핵심 원리', body: '커널과 유사한 패턴이 있는 영역일수록 합성곱 출력이 높다 = 확률로 해석 가능' },
];

export const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };
export const C = 20; // cell size

// "1" 모양 이미지 (직선 특성이 많음)
export const IMG1 = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
];

// 커널들
export const K_LINE = [[0, 1, 0], [0, 1, 0], [0, 1, 0]]; // 수직선
export const K_CURVE = [[1, 1, 0], [0, 1, 0], [0, 1, 1]]; // 대각/곡선

export function conv(img: number[][], k: number[][], r: number, c: number) {
  let sum = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sum += img[r + i][c + j] * k[i][j];
  return sum;
}
