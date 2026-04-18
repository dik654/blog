export const STEPS = [
  {
    label: 'GAN 계보: 2014-2019',
    body: '2014: GAN (Goodfellow) — 원조, FC 구조.\n2015: DCGAN — CNN 기반 안정 학습 가이드라인.\n2017: WGAN/WGAN-GP — Wasserstein 거리 안정성 혁명.\n2017: Pix2Pix·CycleGAN — 이미지 변환.',
  },
  {
    label: 'GAN 계보: 2019-2023',
    body: '2019: StyleGAN — Mapping Network + AdaIN, 1024x1024.\n2020: StyleGAN2 — Demodulation, path regularization.\n2021: StyleGAN3 — Alias-free, rotation equivariant.\n2022: StyleGAN-XL — 대규모 class-conditional.',
  },
  {
    label: 'GAN vs Diffusion: 비교',
    body: 'GAN: 1 step 생성(빠름), 학습 불안정, mode collapse.\nDiffusion: 50~1000 step(느림), 매우 안정, 다양성 우수.\n2022년 이후 Diffusion이 주류 — SD, DALL-E, Sora.\nGAN은 실시간·모바일·style transfer에서 여전히 경쟁력.',
  },
  {
    label: '최근 트렌드 (2023~)',
    body: 'Consistency Models: 1-step diffusion.\nRectified Flow: 직선 경로.\nDiT: Diffusion Transformer.\n하이브리드: GAN + Diffusion, VQ-GAN + VQ-VAE.',
  },
];
