// 3층 신경망, w=0.1, sigmoid, x=0.5
// sigmoid(z) = 1/(1+e^(-z)), sigmoid'(z) = sigmoid(z)*(1-sigmoid(z))

export const forwardSteps = [
  { layer: '입력', z: 0.5, h: 0.5, formula: 'x = 0.5' },
  { layer: '1층', z: 0.05, h: 0.5125, formula: 'h1 = σ(0.1×0.5) = σ(0.05) = 0.5125' },
  { layer: '2층', z: 0.05125, h: 0.5128, formula: 'h2 = σ(0.1×0.5125) = σ(0.05125) = 0.5128' },
  { layer: '출력', z: 0.05128, h: 0.5128, formula: 'y = σ(0.1×0.5128) = σ(0.05128) = 0.5128' },
];

export const gradients = [
  { layer: 'dL/dw3', value: 0.1148, absVal: 0.1148 },
  { layer: 'dL/dw2', value: 0.00311, absVal: 0.00311 },
  { layer: 'dL/dw1', value: 0.000076, absVal: 0.000076 },
];

export const gradientSteps = [
  {
    label: '순전파: x=0.5, w=0.1 (모든 층 동일)',
    body: 'σ(0.1×0.5) = σ(0.05) = 0.5125 → 매우 비슷한 값이 전달됨',
  },
  {
    label: '출력층 기울기: dL/dw3 = -0.1148',
    body: 'target=1, y=0.5128 → dL/dy = -(1-0.5128)/0.5128 → |dL/dw3| = 0.1148',
  },
  {
    label: '2층 기울기: dL/dw2 = -0.00311 (37배 감소!)',
    body: 'σ\'(0.05128) × w3 = 0.2500 × 0.1 = 0.025 곱해져 37배 감소',
  },
  {
    label: '1층 기울기: dL/dw1 = -0.000076 (1,500배 감소!)',
    body: '체인룰 곱셈 한 번 더 → 0.025 또 곱해져 1,500배 감소. 앞쪽 층은 학습 불가',
  },
];

export const COLORS = {
  high: '#10b981',
  mid: '#f59e0b',
  low: '#ef4444',
};
