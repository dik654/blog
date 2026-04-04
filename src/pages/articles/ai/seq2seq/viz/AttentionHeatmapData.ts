import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '히트맵: 입력 × 출력 어텐션', body: '행 = 출력 단어, 열 = 입력 단어. 색이 진할수록 높은 어텐션 가중치.' },
  { label: '"고마워" 생성 시 어텐션', body: '"Thank"에 0.45, "you"에 0.35 — 의미적으로 관련 높은 단어에 집중.' },
  { label: '"요" 생성 시 어텐션', body: '"you"에 0.50 — 한국어 어미가 영어 주어에 대응. 모델의 내부 해석이 가능.' },
];

export const SRC = ['Thank', 'you', '!'];
export const TGT = ['고마워', '요', 'EOS'];

/** weights[row][col] = TGT[row] attending to SRC[col] */
export const WEIGHTS = [
  [0.45, 0.35, 0.20],
  [0.15, 0.50, 0.35],
  [0.10, 0.20, 0.70],
];

export const HEAT_C = '#6366f1';
export const LABEL_C = '#64748b';
