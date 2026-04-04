export const STEPS = [
  {
    label: '1층: X × W₁ + b₁ → sigmoid → A₁',
    body: '[0.5, 0.8] × W₁(2×3) + b₁ → sigmoid 적용 → [0.69, 0.44, 0.57]. 행렬 곱 한 번으로 3개 뉴런의 출력을 동시 계산.',
  },
  {
    label: '2층: A₁ × W₂ + b₂ → sigmoid → A₂',
    body: '[0.69, 0.44, 0.57] × W₂(3×2) + b₂ → sigmoid → [0.61, 0.53]. 차원 3→2 축소. 특징을 압축.',
  },
  {
    label: '출력층: A₂ × W₃ + b₃ → softmax → Y',
    body: '[0.61, 0.53] → 가중합 → [1.02, 0.38] → softmax → [0.65, 0.35]. 두 값의 합 = 1.',
  },
];

export const C = {
  input: '#6366f1',
  hidden: '#10b981',
  output: '#f59e0b',
  weight: '#94a3b8',
  accent: '#f43f5e',
  bg: 'var(--background)',
};
