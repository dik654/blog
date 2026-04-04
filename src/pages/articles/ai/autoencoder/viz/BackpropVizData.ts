export const STEPS = [
  {
    label: '① MSE 손실: L = 0.043',
    body: '((0.8-0.593)² + (0.4-0.608)²) / 2 = 0.043. 입력과 출력 사이의 평균 제곱 오차.',
  },
  {
    label: '② dL/dw_dec₁ = -0.0313',
    body: 'dL/dx̂₁ × dx̂₁/dnet × dnet/dw = -0.207 × 0.241 × 0.627 = -0.0313.',
  },
  {
    label: '③ dL/dw_dec₂ = 0.0296',
    body: 'dL/dx̂₂ × dx̂₂/dnet × dnet/dw = 0.208 × 0.238 × 0.627 = +0.0310.',
  },
  {
    label: '④ dL/dw_enc — 체인룰을 인코더까지 전파',
    body: '디코더 그래디언트를 합산하여 인코더 가중치까지 역전파. w_new = w_old - 0.01 × grad.',
  },
];

export const C = {
  loss: '#ef4444',
  dec: '#10b981',
  enc: '#6366f1',
  muted: 'var(--muted-foreground)',
};
