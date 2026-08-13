import type { Article } from "../types";

export const genArticles: Article[] = [
  {
    slug: "generative-theory",
    title: "생성 모델 지도: likelihood에서 diffusion까지",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "생성 모델을 비교하는 축" },
      { id: "likelihood", title: "Likelihood와 autoregressive 모델" },
      { id: "latent", title: "Latent variable: VAE와 flow" },
      { id: "implicit", title: "GAN·score·diffusion의 연결" },
    ],
    component: () => import("@/pages/articles/ai/generative-theory"),
  },
  {
    slug: "vae",
    title: "VAE: latent variable과 ELBO를 함께 이해하기",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "VAE가 푸는 문제" },
      { id: "ae-vs-vae", title: "Autoencoder와 VAE" },
      { id: "reparam-trick", title: "Encoder·decoder와 reparameterization" },
      { id: "vae-loss", title: "ELBO와 likelihood" },
      { id: "training", title: "학습과 failure mode" },
      { id: "applications", title: "변형 모델과 latent diffusion" },
    ],
    component: () => import("@/pages/articles/ai/vae"),
  },
  {
    slug: "gan",
    title: "GAN: adversarial training과 failure mode",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "분포 게임과 generator signal" },
      { id: "training", title: "Two-player optimization과 failure" },
      { id: "variants", title: "Constraint·조건·평가 선택" },
    ],
    component: () => import("@/pages/articles/ai/gan"),
  },
  {
    slug: "diffusion-models",
    title: "Diffusion Models: DDPM에서 flow와 latent diffusion까지",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "여러 noise level에서 학습하기" },
      { id: "forward-reverse", title: "Forward·reverse process" },
      { id: "continuous-time", title: "SDE·ODE·Flow Matching" },
      { id: "unet", title: "Denoiser architecture" },
      { id: "stable-diffusion", title: "Latent diffusion과 CFG" },
    ],
    component: () => import("@/pages/articles/ai/diffusion-models"),
  },
];
