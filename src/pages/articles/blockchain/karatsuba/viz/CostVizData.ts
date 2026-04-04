export const STEPS = [
  {
    label: 'Naive 타워: Fp12곱 = 144 Fp곱',
    body: '각 층에서 naive 곱셈을 사용하면 4 x 9 x 4 = 144번의 Fp 곱셈이 필요하다.',
  },
  {
    label: 'Karatsuba 타워: Fp12곱 = 54 Fp곱. 2.7배 절감',
    body: '각 층에서 Karatsuba를 적용하면 3 x 6 x 3 = 54. Miller Loop 254회 반복에서 누적되는 차이.',
  },
];
