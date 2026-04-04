import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Step 1: Attention Score (Dot Product)',
    body: 's·h₁=0.62, s·h₂=0.34, s·h₃=0.50 — 디코더 상태와 각 인코더 상태의 내적.',
  },
  {
    label: 'Step 2: Softmax → 확률 분포',
    body: 'softmax([0.62, 0.34, 0.50]) = [0.40, 0.30, 0.30] — 합이 1이 되는 가중치.',
  },
  {
    label: 'Step 3: 가중합 → 컨텍스트 벡터',
    body: '0.40×h₁ + 0.30×h₂ + 0.30×h₃ = [0.50, 0.50] — 새로운 동적 컨텍스트.',
  },
  {
    label: 'Step 4: 컨텍스트 → 디코더 → 다음 단어',
    body: '새 컨텍스트 벡터가 디코더 LSTM에 입력 → 다음 단어 "고마워" 생성.',
  },
];

export const S_VEC = [0.7, 0.3];
export const H_VECS = [
  [0.8, 0.2],
  [0.1, 0.9],
  [0.5, 0.5],
];
export const SCORES = [0.62, 0.34, 0.50];
export const PROBS = [0.40, 0.30, 0.30];
export const WEIGHTED = [
  [0.32, 0.08],
  [0.03, 0.27],
  [0.15, 0.15],
];
export const CTX = [0.50, 0.50];

export const BAR_MAX_W = 60;
export const H_C = '#6366f1';
export const S_C = '#10b981';
export const ATT_C = '#f59e0b';
