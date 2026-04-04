export const STEPS = [
  {
    label: 'Fp2 곱셈: Karatsuba → 3 Fp곱 (naive 4)',
    body: '2개의 Fp 원소 쌍을 곱할 때 Karatsuba로 4→3회로 줄인다.',
  },
  {
    label: 'Fp6 곱셈: 6 Fp2곱 = 18 Fp곱 (naive 36)',
    body: '3개의 Fp2 원소 쌍을 Karatsuba로 9→6회. 각 Fp2곱이 3 Fp곱이므로 6x3=18.',
  },
  {
    label: 'Fp12 곱셈: 3 Fp6곱 = 54 Fp곱 (naive 144)',
    body: '2개의 Fp6 원소 쌍을 Karatsuba로 4→3회. 3x18=54. naive 4x36=144 대비 2.7x 절감.',
  },
];

export const LAYERS = [
  {
    label: 'Fp2',
    naive: 4, karat: 3, unit: 'Fp곱',
    color: '#6366f1',
  },
  {
    label: 'Fp6',
    naive: 36, karat: 18, unit: 'Fp곱',
    color: '#f59e0b',
  },
  {
    label: 'Fp12',
    naive: 144, karat: 54, unit: 'Fp곱',
    color: '#ec4899',
  },
];
