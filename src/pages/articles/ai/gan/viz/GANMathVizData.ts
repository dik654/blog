export const STEPS = [
  {
    label: 'GAN 최적해: JSD 최소화',
    body: 'G 고정 시 D의 최적해: D*(x) = p_data(x) / (p_data(x) + p_g(x)).\n진짜/가짜 같은 비율이면 D(x) = 0.5.\nD*를 V에 대입 → V(G) = −log(4) + 2·JSD(p_data ‖ p_g).\nJSD = 0 iff p_data = p_g → 완벽한 생성 분포.',
  },
  {
    label: 'Generator 아키텍처',
    body: '입력: z ~ N(0, I) — 100~512차원 랜덤 벡터.\nDense(1024) → Reshape(4x4x64).\nConvTranspose(stride=2)로 해상도 2배씩 확대.\nBatchNorm + ReLU (중간), tanh (출력, −1~1).',
  },
  {
    label: 'Discriminator 아키텍처',
    body: '입력: x (실제 또는 G(z)).\nConv(stride=2)로 해상도 2배씩 축소.\nFlatten → Dense(1) → Sigmoid.\nLeakyReLU(0.2), Spectral Norm (Lipschitz 제약).',
  },
];
