export const C = {
  on: '#10b981',
  off: '#ef4444',
  line: '#6366f1',
  line2: '#f59e0b',
};

export const STEPS = [
  {
    label: 'XOR 진리표',
    body: '(0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. 같으면 0, 다르면 1.',
  },
  {
    label: '직선 하나로 불가능',
    body: '어떤 직선을 그어도 y=1과 y=0을 완벽히 분리할 수 없다. 선형 분리 불가능 문제.',
  },
  {
    label: '다층으로 해결',
    body: '은닉층의 2개 뉴런이 각각 직선을 담당. 두 직선의 조합으로 XOR 분리 성공.',
  },
];

export const XOR_POINTS = [
  { x: 0, y: 0, val: 0 },
  { x: 1, y: 0, val: 1 },
  { x: 0, y: 1, val: 1 },
  { x: 1, y: 1, val: 0 },
];
