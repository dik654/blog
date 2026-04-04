export const CORPUS = '나는 오늘 학교에 가서 친구를 만났다';
export const WORDS = CORPUS.split(' ');
export const WIN = [1, 2, 3]; // window center index per step 0

// Concrete embedding vector for "학교" (5 of 300 dims shown)
export const EMB = [
  { v: 0.31, label: 'd₁' },
  { v: 0.82, label: 'd₂' },
  { v: -0.14, label: 'd₃' },
  { v: 0.65, label: 'd₄' },
  { v: 0.93, label: 'd₅' },
];

export const NEG = ['바다', '컴퓨터', '구름'];

export const STEPS = [
  { label: '코퍼스 위 슬라이딩 윈도우' },
  { label: '중심어 · 주변어 추출' },
  { label: '임베딩 조회 (W[w] → 벡터)' },
  { label: 'Negative Sampling' },
  { label: '손실 → SGD → 임베딩 갱신' },
];

export const BODY = [
  '윈도우 크기만큼 단어 쌍 추출',
  '중심=target, 양옆=context',
  '단어 ID → W에서 d차원 벡터 조회',
  'k개 노이즈 단어로 이진 분류',
  'σ(v\'ᵀv) 역전파 → 벡터 업데이트',
];
