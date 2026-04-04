export const OH_CAT = [1, 0, 0, 0, 0, 0, 0, 0];
export const OH_DOG = [0, 1, 0, 0, 0, 0, 0, 0];
export const DN_CAT = [0.21, -0.13, 0.84, 0.31];
export const DN_DOG = [0.28, -0.19, 0.79, 0.38];
export const CELL = 18;
export const GAP = 2;

export const STEPS = [
  { label: 'One-Hot 인코딩' },
  { label: 'One-Hot의 한계' },
  { label: 'Dense Embedding' },
  { label: '의미적 유사도 포착' },
];

export const BODY = [
  'V차원 희소 벡터, 자기 위치만 1',
  '모든 단어가 직교 (cos sim = 0)',
  '300차원 연속 벡터로 의미 인코딩',
  'cos similarity = 0.91 → 매우 유사',
];
