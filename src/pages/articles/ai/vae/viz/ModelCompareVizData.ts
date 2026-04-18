export const STEPS = [
  {
    label: 'AE: 차원축소 전용',
    body: '목적: 입력 재구성.\n학습: 재구성 손실만.\n잠재공간: 결정론적 점 → 구멍 존재.\n샘플링 불가, 생성 모델이 아님.',
  },
  {
    label: 'VAE: 확률적 생성',
    body: '목적: 생성 + 압축.\n학습: ELBO (재구성 + KL).\n잠재공간: 확률분포 → 연속적.\n보간·산술 가능, 이미지 다소 흐릿.',
  },
  {
    label: 'GAN: 적대적 생성',
    body: '목적: 고품질 생성.\n학습: adversarial (G vs D).\n잠재공간: 랜덤 노이즈.\n선명한 이미지, 학습 불안정·mode collapse.',
  },
  {
    label: 'VAE의 현재 위치',
    body: 'Stable Diffusion = VAE + Diffusion + CLIP.\nVAE가 이미지→잠재 공간 8배 압축 제공.\n2013 원논문 → VQ-VAE → β-VAE → Diffusion 인프라.\n여전히 실용적 핵심.',
  },
];
