import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Full Fp12 곱셈: 54 Fp곱',
    body: '12 x 12 = 144 항. Karatsuba 적용하면 54 Fp곱으로 줄어든다.',
  },
  {
    label: 'Sparse 곱셈: 18 Fp곱',
    body: '12 x 3 = 36 항. Karatsuba 적용하면 18 Fp곱.',
  },
  {
    label: '절감: 36 Fp곱 (67%) 절약',
    body: '곱셈 1번당 36 Fp곱 절약. 254번이면 약 9,100 Fp곱.',
  },
];
