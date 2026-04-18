export const STEPS = [
  {
    label: 'VAE 전체 학습 파이프라인',
    body: 'encode(x) → (μ, logvar).\nreparameterize(μ, logvar) → z.\ndecode(z) → x_recon.\nloss = BCE(x_recon, x) + KL(μ, logvar) → backprop.',
  },
  {
    label: 'KL Collapse (Posterior Collapse)',
    body: '현상: KL → 0, 모든 x가 같은 분포로 매핑.\n원인: 디코더가 너무 강력하여 z를 무시.\n해결: KL annealing (β를 0→1 증가), Free bits, 약한 decoder.',
  },
  {
    label: 'Blurry Output 문제',
    body: '현상: 생성 이미지가 흐릿(blurry).\n원인: Gaussian likelihood의 평균화 경향.\n해결: VAE-GAN 조합, Perceptual loss, VQ-VAE (이산 latent).',
  },
  {
    label: '학습 하이퍼파라미터',
    body: 'latent_dim: 20~128 (MNIST) / 256~1024 (이미지).\nhidden_dim: 400~2048.\nlearning_rate: 1e-3 (Adam).\n평가: 재구성 Loss, FID Score, ELBO, latent traversal.',
  },
];
