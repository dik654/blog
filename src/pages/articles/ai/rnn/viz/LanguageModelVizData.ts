import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '입력 시퀀스 투입', body: '"오늘 날씨가" — 각 단어가 순서대로 RNN에 입력' },
  { label: '은닉 상태에 맥락 누적', body: 'h_t에 이전 모든 단어의 정보가 압축' },
  { label: '다음 단어 확률 예측', body: 'softmax(W_y · h_t) → 어휘 전체에 대한 확률 분포' },
  { label: '"좋다" 선택 — 가장 높은 확률', body: 'P(좋다|오늘,날씨가) = 0.42 → argmax로 선택' },
];

export const INPUT_WORDS = ['오늘', '날씨가'];
export const VOCAB = ['좋다', '나쁘다', '흐리다', '맑다', '춥다'];
export const PROBS = [0.42, 0.15, 0.18, 0.20, 0.05];
