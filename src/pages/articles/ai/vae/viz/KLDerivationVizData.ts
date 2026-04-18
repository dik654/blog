export const STEPS = [
  {
    label: 'KL Divergence 일반 정의',
    body: 'KL(q‖p) = ∫ q(x) · log[q(x)/p(x)] dx.\n두 분포 q와 p의 "거리" (비대칭).\nq = N(μ₁, σ₁²), p = N(μ₂, σ₂²) 두 가우시안의 KL:\nlog(σ₂/σ₁) + (σ₁² + (μ₁−μ₂)²)/(2σ₂²) − 0.5.',
  },
  {
    label: 'VAE 특수 경우: p = N(0, 1)',
    body: 'μ₂ = 0, σ₂ = 1 대입.\nKL(N(μ,σ²)‖N(0,1)) = −0.5·(1 + log σ² − σ² − μ²).\n다차원: KL = −0.5 · Σᵢ (1 + log σᵢ² − σᵢ² − μᵢ²).\nPyTorch: kl = -0.5 * sum(1 + logvar - mu² - logvar.exp()).',
  },
  {
    label: '각 항의 의미',
    body: '−1: 상수(정규화).\n−log σ²: 분산 축소 억제 (σ가 너무 작아지면 페널티).\n+σ²: 분산이 크면 페널티.\n+μ²: 평균이 0에서 멀면 페널티.\n최적: μ=0, σ²=1 → KL=0.',
  },
  {
    label: 'β-VAE: 균형 조정',
    body: 'L = L_recon + β · L_KL.\nβ=0: 일반 AE (KL 무시).\nβ=1: 표준 VAE.\nβ>1: disentanglement 강화 — 각 차원이 독립 요인 포착.\nβ=4~10이 일반적, 너무 크면 재구성 저하.',
  },
];
