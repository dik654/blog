export const oneHotVsDenseCode = `# One-Hot: 어휘 크기 V=10만이면 10만 차원, 모두 직교
"고양이" = [1, 0, 0, ..., 0]   # V차원, cos similarity = 0
"강아지" = [0, 1, 0, ..., 0]   # 의미적 관계 불가

# Dense Embedding: d=300 차원, 의미 관계 포착
"고양이" = [0.21, -0.13, 0.84, ..., 0.31]   # 300차원
"강아지" = [0.28, -0.19, 0.79, ..., 0.38]   # cos similarity = 0.91`;

export const oneHotAnnotations = [
  { lines: [1, 3] as [number, number], color: 'rose' as const, note: 'One-Hot — 희소 벡터, 의미 관계 불가' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'Dense — 의미적 유사도 포착' },
];

export const analogyExampleCode = `vec("왕") - vec("남자") + vec("여자") ≈ vec("여왕")
vec("서울") - vec("한국") + vec("일본") ≈ vec("도쿄")
vec("빠른") - vec("빠르다") + vec("크다") ≈ vec("큰")`;

export const analogyAnnotations = [
  { lines: [1, 1] as [number, number], color: 'sky' as const, note: '성별 방향 벡터' },
  { lines: [2, 2] as [number, number], color: 'emerald' as const, note: '수도-국가 방향 벡터' },
  { lines: [3, 3] as [number, number], color: 'amber' as const, note: '형용사 활용 방향 벡터' },
];
