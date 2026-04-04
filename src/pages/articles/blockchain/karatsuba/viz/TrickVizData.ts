export const STEPS = [
  {
    label: '3번만 곱한다: M1=ac, M2=bd, M3=(a+b)(c+d)',
    body: 'Karatsuba의 핵심: 곱셈을 딱 3번만 수행한다.',
  },
  {
    label: '실수부 복원: ac - bd = M1 - M2',
    body: '이미 계산한 M1, M2를 빼기만 하면 된다. 곱셈 추가 없음.',
  },
  {
    label: '허수부 복원: M3 - M1 - M2 = ad + bc',
    body: '(a+b)(c+d) - ac - bd를 뺄셈만으로 계산.',
  },
  {
    label: '왜 되는가: M3 = ac + ad + bc + bd',
    body: 'M3에서 이미 계산한 ac(=M1)와 bd(=M2)를 빼면 ad+bc만 남는다.',
  },
  {
    label: 'Naive 4곱+2덧 vs Karatsuba 3곱+5덧',
    body: '곱셈 1회를 덧셈 3회로 대체. 덧셈은 곱셈보다 ~10배 싸므로 이득.',
  },
];

export const BOXES = [
  { id: 'M1', label: 'M1 = ac', x: 50 },
  { id: 'M2', label: 'M2 = bd', x: 200 },
  { id: 'M3', label: 'M3 = (a+b)(c+d)', x: 350 },
];
