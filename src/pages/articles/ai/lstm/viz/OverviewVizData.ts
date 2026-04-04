import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① RNN의 한계 — 기울기 소실',
    body: '기울기가 시간축을 역행하며 지수적으로 감소.',
  },
  {
    label: '② 장기 의존성 문제',
    body: '먼 거리의 단어 의존성을 RNN은 학습 불가.',
  },
  {
    label: '③ 원인 — 반복 곱셈 구조',
    body: 'W_h 반복 곱셈으로 tanh\' 누적 → 기울기 수축.',
  },
  {
    label: '④ LSTM의 아이디어 — 게이트 + 덧셈 경로',
    body: '게이트로 선택적 기억·망각, 셀 상태로 기울기 경로 확보.',
  },
];

export const RNN_C = '#ef4444';
export const LSTM_C = '#10b981';
export const GRAD_C = '#f59e0b';
