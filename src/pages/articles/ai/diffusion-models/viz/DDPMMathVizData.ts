export const STEPS = [
  {
    label: 'DDPM 핵심: Forward + Reverse',
    body: 'Forward: q(x_t|x_{t-1}) = N(√(1−β_t)·x_{t-1}, β_t·I) — 노이즈 추가.\nT 스텝 후 x_T ~ N(0,I) (순수 가우시안).\nReverse: p_θ(x_{t-1}|x_t) = N(μ_θ, Σ_θ) — 신경망이 학습.\nSimple Loss: L = E[‖ε − ε_θ(x_t, t)‖²].',
  },
  {
    label: '생성 과정',
    body: '1. x_T ~ N(0,I) 샘플링.\n2. t = T, T-1, ..., 1: ε&#770; = ε_θ(x_t, t), x_{t-1} = denoise(x_t, ε&#770;).\n3. 최종 x_0 출력.\n노이즈 스케줄: β₁=10⁻⁴ → β_T=0.02 (linear) 또는 cosine.',
  },
  {
    label: 'Diffusion vs GAN vs VAE',
    body: 'GAN: 1 step, 불안정, mode collapse.\nVAE: 1 step, 안정, 흐릿.\nDiffusion: 50~1000 step, 매우 안정, 최고 품질.\n2022 이후 주류 — SD, DALL-E, Sora.',
  },
];
