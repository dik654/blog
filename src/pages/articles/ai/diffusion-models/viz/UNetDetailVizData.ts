export const STEPS = [
  {
    label: 'U-Net 전체 구조 (SD 기준)',
    body: '입력: x_t (noisy), t (timestep), c (text condition).\nDownsampling: [ResBlock + Attention + Down] x4.\nMiddle: ResBlock + Attention + ResBlock.\nUpsampling: [Up + ResBlock + Attention] x4 + Skip connection.',
  },
  {
    label: 'Time Embedding',
    body: 't → sinusoidal embedding → MLP → t_emb.\n사인파 임베딩 = Transformer positional encoding과 유사.\n각 ResBlock에 주입: h = h + t_proj(t_emb).\n네트워크가 노이즈 수준을 인식하게 함.',
  },
  {
    label: 'Text Cross-Attention',
    body: 'Prompt → CLIP encoder → (77, 768) token embedding.\nQ = 이미지 특징, K/V = 텍스트 임베딩.\nattn = softmax(Q·K^T / √d) · V.\n텍스트 의미가 이미지 생성에 반영.',
  },
  {
    label: '최신 동향: DiT',
    body: 'SD3, Stable Cascade: transformer 기반.\nU-Net → Diffusion Transformer (DiT).\nMM-DiT: Multi-Modal DiT.\n파라미터: SD 1.5 (860M) → SDXL (3.5B).',
  },
];
