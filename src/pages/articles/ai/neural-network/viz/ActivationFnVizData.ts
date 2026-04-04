export const STEPS = [
  {
    label: 'sigmoid: σ(x) = 1 / (1 + e⁻ˣ)',
    body: '출력 범위 0~1. 확률로 해석 가능하여 이진 분류 출력층에 사용. 양 끝에서 기울기 ≈ 0 → 깊은 네트워크에서 기울기 소실(Gradient Vanishing) 발생.',
  },
  {
    label: 'ReLU: max(0, x)',
    body: '양수는 그대로, 음수는 0. 계산 비용 최소. 기울기 소실 문제를 크게 완화. 현재 은닉층의 기본 활성화 함수.',
  },
  {
    label: 'tanh: (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)',
    body: '출력 범위 -1~1. 중심이 0이라 sigmoid보다 학습 수렴이 빠름. RNN/LSTM 내부에서 주로 사용.',
  },
];

export const C = {
  sigmoid: '#6366f1',
  relu: '#10b981',
  tanh: '#f59e0b',
  axis: '#94a3b8',
};
