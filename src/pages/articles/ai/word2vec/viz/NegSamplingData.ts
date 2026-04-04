export const WORDS = ['king', 'queen', 'man', 'woman', 'dog', 'cat', 'runs', 'eats'];
export const FREQS = [120, 95, 200, 180, 60, 55, 310, 280];
const FREQ_075 = FREQS.map(f => Math.pow(f, 0.75));
const FREQ_SUM = FREQ_075.reduce((a, b) => a + b, 0);
export const PROBS = FREQ_075.map(f => f / FREQ_SUM);

export const STEPS = [
  { label: '중심어 + 맥락어 선택' },
  { label: 'P(w) ~ f(w)^0.75 확률 계산' },
  { label: 'k=4개 Negative 샘플링' },
  { label: '손실 함수로 벡터 업데이트' },
];

export const BODY = [
  '(king, queen) 쌍 → positive(+1)',
  '빈도 0.75 제곱으로 희귀어 확률↑',
  'k개 비맥락 단어 추출 (-1 레이블)',
  'σ(vᵀv\')=0.82 → Loss=-log(0.82)=0.20',
];

export const NEG_WORDS = ['man', 'dog', 'runs', 'eats'];
export const POS_C = '#10b981', NEG_C = '#ef4444', CTR_C = '#6366f1';
