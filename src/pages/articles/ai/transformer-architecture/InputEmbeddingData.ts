// d_model = 6, 3개 토큰: "나는", "학생", "이다"
export const TOKENS = ['나는', '학생', '이다'];

// 임베딩 벡터 (3×6) — 학습된 값 예시
export const EMB: number[][] = [
  [0.12, -0.34, 0.56, 0.78, -0.11, 0.45],
  [0.67, 0.23, -0.89, 0.01, 0.44, -0.56],
  [-0.33, 0.91, 0.15, -0.67, 0.28, 0.03],
];

// 위치 인코딩 (3×6) — sin/cos 공식 적용
export const PE: number[][] = [
  [0.00, 1.00, 0.00, 1.00, 0.00, 1.00],  // pos=0
  [0.84, 0.54, 0.04, 1.00, 0.00, 1.00],  // pos=1
  [0.91, -0.42, 0.08, 1.00, 0.00, 1.00], // pos=2
];

// 최종 입력 = EMB + PE
export const INPUT: number[][] = EMB.map((row, i) =>
  row.map((v, j) => Math.round((v + PE[i][j]) * 100) / 100)
);

export const STEPS = [
  { label: '토큰 임베딩 (학습된 벡터)' },
  { label: '위치 인코딩 (sin/cos)' },
  { label: '임베딩 + 위치 = 최종 입력' },
];

export const COLORS = {
  emb: '#6366f1',
  pe: '#10b981',
  sum: '#f59e0b',
};
