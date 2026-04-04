export const ENC_TOKENS = ['나는', '학생', '이다'];
export const DEC_TOKENS = ['I', 'am'];

export const STEPS = [
  { label: '인코더 출력 → K, V 생성' },
  { label: '디코더 출력 → Q 생성' },
  { label: 'Q(디코더) × Kᵀ(인코더) = 크로스 어텐션' },
  { label: '× V(인코더) = 문맥 반영 출력' },
];

export const BODY = [
  '인코더가 소스 문장 전체를 압축한 K, V',
  '디코더가 현재까지 생성한 토큰에서 Q 생성',
  '디코더 Q가 인코더 K를 참조 → 어텐션 스코어',
  '인코더 V의 가중합 → 소스 문맥 반영',
];

// 크로스 어텐션 행렬 (2×3): 디코더 2토큰 × 인코더 3토큰
export const CROSS_ATTN: number[][] = [
  [0.62, 0.20, 0.18],
  [0.15, 0.55, 0.30],
];

export const COLORS = {
  enc: '#3b82f6',
  dec: '#ef4444',
  cross: '#8b5cf6',
  output: '#10b981',
};
