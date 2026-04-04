import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '문제: Fp12 x Fp12 = 54 Fp곱',
    body: '254번 반복하면 약 14,000 Fp곱. 페어링의 병목이다.',
  },
  {
    label: '발견: l(P)의 12슬롯 중 3개만 non-zero',
    body: 'line function 결과는 twist 구조 때문에 대부분 0이다.',
  },
  {
    label: '해결: 0 슬롯을 건너뛰면 18 Fp곱',
    body: '0 x 무엇이든 = 0. 계산할 필요가 없다. 3배 절감.',
  },
];
