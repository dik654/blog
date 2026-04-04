export const STEPS = [
  {
    label: '입력층: 값을 그대로 전달',
    body: '입력 노드 x1=0.5, x2=0.8. 연산 없이 다음 층으로 넘긴다. 각 입력은 은닉층의 모든 뉴런에 연결.',
  },
  {
    label: '은닉층: 가중합 + sigmoid 활성화',
    body: '뉴런 h1 하나를 추적. w1·x1 + w2·x2 + b = 0.3×0.5 + 0.7×0.8 + 0.1 = 0.81 → sigmoid(0.81) = 0.69. 같은 과정이 h2, h3에도 적용.',
  },
  {
    label: '출력층: softmax로 확률 변환',
    body: '은닉층 출력 [0.69, 0.44, 0.57]이 출력층에서 한번 더 가중합. softmax로 합=1인 확률 [0.72, 0.28] 변환.',
  },
];

export const C = {
  input: '#6366f1',
  hidden: '#10b981',
  output: '#f59e0b',
  line: '#94a3b8',
  accent: '#f43f5e',
  weight: '#64748b',
};
