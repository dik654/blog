export const STEPS = [
  {
    label: 'VQ-VAE: 이산 코드북',
    body: 'Encoder → z_e(x) ∈ R^d (연속).\nQuantization: z_q = e_k, k = argmin_j ‖z_e − e_j‖².\n가장 가까운 코드북 벡터에 매핑.\nDecoder(z_q) → x&#770; — 이산 latent로 blurry 해결.',
  },
  {
    label: 'Stable Diffusion의 VAE',
    body: '1st Stage: 512x512x3 → 64x64x4 (f=8 downsample, 48배 압축).\nKL 정규화 VAE, 메모리 48배 절감.\n2nd Stage: latent에서 diffusion (U-Net + CLIP cross-attention).\n결과: 8GB GPU에서 512x512 생성 가능.',
  },
  {
    label: 'VAE 응용 생태계',
    body: '음성: WaveNet-VAE. 단백질: ESM-VAE.\n분자: JT-VAE, GraphVAE. 이상탐지: 산업 품질검사.\n추천: Collaborative VAE. 시계열: Variational RNN.\n강화학습: World Model. 2024: VQ-VAE가 foundation model 기반.',
  },
];
