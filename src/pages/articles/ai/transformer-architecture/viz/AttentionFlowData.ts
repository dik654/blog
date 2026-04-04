export const TOK = ['나는', '학생', '이다'];
export const TC = ['#6366f1', '#10b981', '#f59e0b'];
export const ATTN = [
  [0.50, 0.25, 0.25],
  [0.20, 0.55, 0.25],
  [0.15, 0.30, 0.55],
];
export const C = 28;

export const STEPS = [
  { label: '입력 토큰' },
  { label: 'Q, K, V 투영' },
  { label: 'Q × Kᵀ 유사도 행렬' },
  { label: 'Softmax 정규화' },
  { label: '× V → 문맥 벡터' },
];

export const BODY = [
  '3개 토큰 임베딩 → Self-Attention',
  'W_Q,W_K,W_V → Q,K,V 생성',
  'Q·Kᵀ 내적으로 유사도 계산',
  'Softmax → 확률 분포 변환',
  '가중합 → 문맥 반영 출력',
];
