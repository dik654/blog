import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'EOS + 컨텍스트 → LSTM', body: 'EOS 토큰과 인코더의 컨텍스트 벡터 [0.5, 0.6]을 초기 상태로 LSTM에 입력 → h₄=[0.4, 0.8] 생성.' },
  { label: 'h₄ → Softmax → 확률 분포', body: '은닉 상태 [0.4, 0.8]을 어휘 공간에 투영 → Softmax로 확률 분포 생성. P(고마워)=0.72가 최대.' },
  { label: '"고마워" 출력 (P=0.72)', body: 'Softmax에서 가장 높은 확률의 단어 = "고마워". 이 단어가 다음 입력이 된다.' },
  { label: '"고마워" → LSTM → EOS → 종료', body: '출력 "고마워"를 다시 입력 → h₅=[0.1, 0.2] → P(EOS)=0.85 → 번역 종료.' },
];

/** Hidden state values for decoder steps */
export const H_VEC_4 = [0.4, 0.8];
export const H_VEC_5 = [0.1, 0.2];
/** Softmax probability distributions */
export const PROB_DIST = [
  { word: '고마워', prob: 0.72 },
  { word: '감사', prob: 0.15 },
  { word: '고맙다', prob: 0.08 },
];
export const PROB_DIST_2 = [
  { word: 'EOS', prob: 0.85 },
  { word: '요', prob: 0.10 },
];

export const DEC_C = '#10b981';
export const CTX_C = '#f59e0b';
export const SOFT_C = '#ec4899';
