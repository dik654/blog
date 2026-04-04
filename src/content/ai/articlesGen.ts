import type { Article } from '../types';

export const genArticles: Article[] = [
  {
    slug: 'generative-theory',
    title: '생성 모델 이론: MLE에서 Diffusion까지',
    subcategory: 'ai-generative',
    sections: [
      { id: 'overview', title: '판별 vs 생성 모델' },
      { id: 'likelihood', title: 'MLE, EM, 오토리그레시브' },
      { id: 'latent', title: '잠재 변수 모델 (VAE, Flow)' },
      { id: 'implicit', title: 'GAN, Score Matching, Diffusion' },
    ],
    component: () => import('@/pages/articles/ai/generative-theory'),
  },
  {
    slug: 'vae',
    title: 'VAE: 변분 오토인코더의 원리',
    subcategory: 'ai-generative',
    sections: [
      { id: 'overview', title: 'VAE 개요: 확률적 생성 모델' },
      { id: 'ae-vs-vae', title: 'AE vs VAE: 잠재 공간의 차이' },
      { id: 'encoder-computation', title: '인코더 숫자 계산' },
      { id: 'reparam-trick', title: 'Reparameterization Trick' },
      { id: 'decoder-computation', title: '디코더 숫자 계산' },
      { id: 'vae-loss', title: '손실 함수 (재구성 + KL)' },
      { id: 'latent-space', title: '잠재 변수와 인코더-디코더' },
      { id: 'training', title: 'ELBO와 Reparameterization' },
      { id: 'applications', title: '응용과 변형 모델' },
    ],
    component: () => import('@/pages/articles/ai/vae'),
  },
  {
    slug: 'gan',
    title: 'GAN: 적대적 생성 네트워크',
    subcategory: 'ai-generative',
    sections: [
      { id: 'overview', title: 'GAN 핵심 아이디어' },
      { id: 'training', title: '학습 역학 & 안정성' },
      { id: 'variants', title: '주요 GAN 변형' },
    ],
    component: () => import('@/pages/articles/ai/gan'),
  },
  {
    slug: 'diffusion-models',
    title: 'Diffusion Models: DDPM에서 Stable Diffusion까지',
    subcategory: 'ai-generative',
    sections: [
      { id: 'overview', title: '생성 모델 계보와 DDPM' },
      { id: 'forward-reverse', title: 'Forward & Reverse Process' },
      { id: 'unet', title: 'U-Net 아키텍처' },
      { id: 'stable-diffusion', title: 'Stable Diffusion (Latent Diffusion)' },
    ],
    component: () => import('@/pages/articles/ai/diffusion-models'),
  },
];
