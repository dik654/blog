import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '순전파: 인코더 → 컨텍스트 → 디코더', body: '입력 "Thank you"가 인코더를 통과하고, 디코더가 "고마워"를 생성한다.' },
  { label: '교차 엔트로피 손실 계산', body: '디코더 출력 확률과 정답 "고마워"를 비교 — 손실(loss) 계산.' },
  { label: 'Teacher Forcing', body: '학습 시 디코더 입력 = 정답 단어. 이전 예측이 틀려도 올바른 입력 제공.' },
  { label: '역전파: 디코더 → 컨텍스트 → 인코더', body: '손실의 기울기가 역방향으로 전파. BPTT로 인코더 LSTM까지 업데이트.' },
];

export const FWD_C = '#6366f1';
export const LOSS_C = '#ef4444';
export const BPTT_C = '#f59e0b';
