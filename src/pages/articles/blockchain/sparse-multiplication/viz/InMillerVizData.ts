import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Miller Loop = 254 iterations',
    body: '매 iteration: f²(36 Fp곱) + f x l(P). squaring은 동일, 곱셈이 핵심.',
  },
  {
    label: 'Full vs Sparse: 누적 비용',
    body: 'Full: 254 x 54 = 13,716 Fp곱. Sparse: 254 x 18 = 4,572 Fp곱.',
  },
  {
    label: '전체 페어링에서의 비중',
    body: '전체 약 20,000 Fp곱 중 9,144 절약. 약 45%에 해당한다.',
  },
];

export const FULL_COST = 254 * 54;
export const SPARSE_COST = 254 * 18;
export const TOTAL_PAIRING = 20000;
export const SAVING = FULL_COST - SPARSE_COST;
