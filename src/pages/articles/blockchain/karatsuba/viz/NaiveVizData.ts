export const STEPS = [
  {
    label: 'FOIL 전개: ac + adu + bcu + bdu²',
    body: '(a+bu)(c+du)를 분배법칙으로 전개한 결과다.',
  },
  {
    label: '4개의 곱셈: ac, ad, bc, bd',
    body: '각 항에 Fp 곱셈 1번씩, 총 4번의 곱셈이 필요하다.',
  },
  {
    label: 'u² = -1 대입 → (ac-bd) + (ad+bc)u',
    body: 'bdu² = -bd. 실수항끼리, 허수항끼리 모은다.',
  },
  {
    label: '정리: 실수부 ac-bd, 허수부 ad+bc. 총 Fp곱 4번',
    body: '곱셈 4회 + 덧/뺄셈 2회. 이것이 Naive 비용이다.',
  },
];

export const MULS = [
  { label: 'ac', desc: 'Fp곱 #1', x: 30 },
  { label: 'ad', desc: 'Fp곱 #2', x: 150 },
  { label: 'bc', desc: 'Fp곱 #3', x: 270 },
  { label: 'bd', desc: 'Fp곱 #4', x: 390 },
];
