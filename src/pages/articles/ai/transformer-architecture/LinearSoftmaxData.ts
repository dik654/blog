export const VOCAB = [
  '나는', '학생', '이다', '감사', '합니다', '오늘', '날씨', '좋다',
  '공부', '하다', '열심히',
];

// 디코더 마지막 토큰의 출력 벡터 (1×6)
export const DECODER_OUT = [0.22, 0.45, -0.11, 0.67, 0.33, -0.08];

// Linear 변환 후 (1×11) — logits
export const LOGITS = [
  -0.8, 2.1, 0.3, -1.2, 0.9, -0.5, 0.1, -0.3, 1.5, -0.7, 0.4,
];

// Softmax 후 확률 분포 (1×11)
export const PROBS = [
  0.02, 0.38, 0.06, 0.01, 0.11, 0.03, 0.05, 0.03, 0.21, 0.02, 0.07,
];

export const TARGET_IDX = 1; // 정답: "학생"
export const PREDICTED_IDX = 1; // 예측: "학생" (argmax)

export const STEPS = [
  { label: '디코더 출력 벡터 (d_model=6)' },
  { label: 'Linear: d_model → vocab_size (6→11)' },
  { label: 'Softmax → 확률 분포' },
  { label: 'argmax → 예측 단어 + Loss 계산' },
];

export const COLORS = {
  decoder: '#6366f1',
  linear: '#3b82f6',
  softmax: '#10b981',
  predict: '#f59e0b',
};
