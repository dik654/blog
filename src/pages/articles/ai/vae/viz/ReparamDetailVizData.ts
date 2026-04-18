export const STEPS = [
  {
    label: '문제: 샘플링은 미분 불가',
    body: 'VAE loss에서 E_{z~q}[log p(x|z)]의 z 샘플링이 문제.\n확률적 노드는 미분 불가 → dL/dμ, dL/dσ 계산 불가.\nMonte Carlo 추정해도 z가 (μ,σ²)의 함수로 명시되지 않으면 gradient 흐름 불가.',
  },
  {
    label: '해결: z = μ + σ · ε',
    body: 'z ~ N(μ, σ²)를 z = μ + σ · ε, ε ~ N(0,1)로 변환.\n랜덤성 ε을 외부에서 샘플링(고정).\nz는 (μ, σ, ε)의 결정론적 함수 → gradient 계산 가능.\nE[z] = μ, Var[z] = σ² — 분포 동일.',
  },
  {
    label: 'Gradient 흐름 확인',
    body: 'dL/dμ = dL/dz · dz/dμ = dL/dz · 1.\ndL/dσ = dL/dz · dz/dσ = dL/dz · ε.\nε은 상수로 취급 — 모든 필요한 gradient 존재.\nPyTorch: std = exp(0.5 * logvar), z = mu + eps * std.',
  },
  {
    label: '다른 분포의 Reparameterization',
    body: 'Uniform U(a,b): z = a + (b−a)·u, u ~ U(0,1).\nExponential: z = −log(u)/λ.\nGumbel-Softmax (이산): softmax((log π + g)/τ) — τ→0이면 one-hot.\n핵심 조건: 샘플링 = 간단한 분포 + 결정론적 변환.',
  },
];
