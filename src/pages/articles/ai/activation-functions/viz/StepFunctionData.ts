import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'f(x) = 0 (x<0), 1 (x>=0) — 이진 출력',
    body: 'x=0에서 불연속. 임계값 하나로 "발화/비발화"를 결정',
  },
  {
    label: "f'(x) = 0 (전 구간) — 미분값이 항상 0",
    body: '경사 하강법은 f\'(x)로 가중치를 갱신. 0이면 학습 불가. → 연속 함수가 필요',
  },
];

export const COLORS = {
  fn: '#6366f1',
  deriv: '#ef4444',
  warn: '#f59e0b',
};
