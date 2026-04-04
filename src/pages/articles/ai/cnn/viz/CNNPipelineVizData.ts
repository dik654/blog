export const STEPS = [
  { label: '입력 이미지 (6×6)' },
  { label: 'Conv 3×3 → 4×4 특징 맵' },
  { label: 'ReLU → 음수를 0으로' },
  { label: 'MaxPool 2×2 → 2×2 축소' },
  { label: '파이프라인 완성: 6×6 → 2×2' },
];

export const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

// "T" 형태 6x6 이미지
export const INPUT = [
  [1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
];

// 수직선 감지 커널
export const CONV_K = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];

export function applyConv(img: number[][], k: number[][]): number[][] {
  const out: number[][] = [];
  for (let r = 0; r <= img.length - 3; r++) {
    const row: number[] = [];
    for (let c = 0; c <= img[0].length - 3; c++) {
      let s = 0;
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) s += img[r + i][c + j] * k[i][j];
      row.push(s);
    }
    out.push(row);
  }
  return out;
}

export function applyRelu(m: number[][]): number[][] {
  return m.map(row => row.map(v => Math.max(0, v)));
}

export function applyPool(m: number[][]): number[][] {
  const out: number[][] = [];
  for (let r = 0; r < m.length; r += 2) {
    const row: number[] = [];
    for (let c = 0; c < m[0].length; c += 2) {
      row.push(Math.max(m[r][c], m[r][c + 1], m[r + 1][c], m[r + 1][c + 1]));
    }
    out.push(row);
  }
  return out;
}
