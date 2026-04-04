import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Peephole — 셀 상태 엿보기',
    body: '게이트 계산에 C_{t-1}도 참조.\n게이트가 현재 셀 상태의 크기를 고려 → 더 정밀한 제어.',
  },
  {
    label: '② GRU — 게이트 3→2개 축소',
    body: 'Cho et al. (2014). 리셋(r) + 업데이트(z) 게이트.\n셀 상태와 은닉 상태 통합 → 파라미터 25% 감소.',
  },
  {
    label: '③ LSTM vs GRU 비교',
    body: 'LSTM: 게이트 3개, 상태 2개, 긴 시퀀스에 강점.\nGRU: 게이트 2개, 상태 1개, 학습 20% 빠름.\n실무에서 성능 차이는 대부분 미미.',
  },
];

export const LSTM_C = '#6366f1';
export const GRU_C = '#10b981';
export const PEEK_C = '#f59e0b';
