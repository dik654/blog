export const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export const STEPS = [
  { label: 'PUSH1 0x03', body: '값 3을 스택에 push — 스택 깊이 +1' },
  { label: 'PUSH1 0x05', body: '값 5를 스택에 push — 스택: [3, 5] (top = 5)' },
  { label: 'ADD → 0x08', body: '스택에서 두 값(3, 5)을 pop, 더한 결과(8)를 push — 가스 3 소비' },
];

export const stackStates = [
  [{ val: '0x03', color: C1 }],
  [{ val: '0x03', color: C1 }, { val: '0x05', color: C2 }],
  [{ val: '0x08', color: C3 }],
];
