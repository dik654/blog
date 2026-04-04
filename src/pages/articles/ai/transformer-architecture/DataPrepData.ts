export const VOCAB = [
  '나는', '학생', '이다', '감사', '합니다', '오늘', '날씨', '좋다',
  '공부', '하다', '열심히',
];

export const EXAMPLE_SENTENCE = ['감사', '합니다'];
export const EXAMPLE_INDICES = [3, 4];

export const STEPS = [
  { label: '단어장 (Vocabulary) 정의' },
  { label: '문장 → 토큰 분리' },
  { label: '토큰 → 인덱스 변환' },
  { label: '인덱스 → 원-핫 벡터' },
  { label: '원-핫 → 임베딩 벡터 (학습)' },
];

export const BODY = [
  '11개 단어로 구성된 단어장',
  '"감사합니다" → ["감사", "합니다"]',
  '"감사"=3, "합니다"=4',
  '인덱스 위치만 1, 나머지 0',
  '원-핫 × 임베딩 행렬 = 밀집 벡터',
];

export const EMB_EXAMPLE = [0.34, -0.12, 0.78, 0.56, -0.45, 0.23];

export const COLORS = {
  primary: '#6366f1',
  secondary: '#10b981',
  accent: '#f59e0b',
};
