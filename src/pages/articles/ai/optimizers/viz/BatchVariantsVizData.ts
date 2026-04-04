import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Batch GD — 전체 5개 데이터로 기울기 1번 계산',
    body: '∇L = 평균(전체) → w 0.2 → 0.596. 안정적이지만 한 에폭에 1번만 업데이트.',
  },
  {
    label: 'Stochastic GD — 데이터 1개씩, 기울기 5번 계산',
    body: 'w: 0.2→0.236→0.353→0.650→1.243→2.243. 빠르지만 지그재그 노이즈가 큼.',
  },
  {
    label: 'Mini-batch GD — 2개씩 묶어서 기울기 3번 계산',
    body: 'w: 0.2→0.272→0.541→1.041. Batch의 안정성 + SGD의 빠른 업데이트.',
  },
];

/* 손실 곡선 데이터 (에폭 0~5) */
export const BATCH_LOSS = [
  { epoch: 0, loss: 44.0 },
  { epoch: 1, loss: 18.5 },
  { epoch: 2, loss: 7.8 },
  { epoch: 3, loss: 3.3 },
  { epoch: 4, loss: 1.4 },
  { epoch: 5, loss: 0.6 },
];

export const SGD_LOSS = [
  { epoch: 0, loss: 44.0 },
  { epoch: 0.5, loss: 28.0 },
  { epoch: 1, loss: 8.2 },
  { epoch: 1.5, loss: 12.0 },
  { epoch: 2, loss: 2.5 },
  { epoch: 2.5, loss: 5.1 },
  { epoch: 3, loss: 0.8 },
  { epoch: 3.5, loss: 2.2 },
  { epoch: 4, loss: 0.3 },
  { epoch: 4.5, loss: 1.0 },
  { epoch: 5, loss: 0.1 },
];

export const MINIBATCH_LOSS = [
  { epoch: 0, loss: 44.0 },
  { epoch: 0.7, loss: 22.0 },
  { epoch: 1, loss: 12.5 },
  { epoch: 1.7, loss: 8.0 },
  { epoch: 2, loss: 5.2 },
  { epoch: 2.7, loss: 3.8 },
  { epoch: 3, loss: 2.1 },
  { epoch: 3.7, loss: 1.5 },
  { epoch: 4, loss: 0.9 },
  { epoch: 4.7, loss: 0.6 },
  { epoch: 5, loss: 0.3 },
];

export const COLORS = {
  batch: '#0ea5e9',
  sgd: '#10b981',
  mini: '#f59e0b',
};
