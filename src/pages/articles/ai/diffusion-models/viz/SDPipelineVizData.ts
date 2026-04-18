export const STEPS = [
  {
    label: 'Latent Diffusion 구조',
    body: '[1] 이미지 512x512x3 (786K dims).\n[2] VAE Encoder → 64x64x4 (16K dims) — 48배 압축.\n[3] Latent에서 Diffusion (U-Net).\n[4] VAE Decoder → 생성 이미지.',
  },
  {
    label: '추론 파이프라인 (Text-to-Image)',
    body: '1. CLIP tokenizer → 77 tokens.\n2. CLIP text encoder → (77, 768) embedding.\n3. z_T ~ N(0,I), shape (4, 64, 64).\n4. 50~100 step denoising → VAE decoder → 512x512.',
  },
  {
    label: 'SD 버전 변천',
    body: 'SD 1.x (2022): 512x512, 860M UNet.\nSD 2.x: OpenCLIP, 768x768.\nSDXL (2023): 1024x1024, 3.5B params.\nSD3 (2024): MM-DiT, flow matching.',
  },
  {
    label: '생태계',
    body: 'ControlNet: pose/edge/depth 제어.\nLoRA: 캐릭터/스타일 fine-tuning (4~8MB).\nDreamBooth: 특정 객체 학습.\nIP-Adapter: 이미지 prompt. AnimateDiff: 애니메이션.',
  },
];
