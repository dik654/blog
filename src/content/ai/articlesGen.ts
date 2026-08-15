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
    title: "GAN의 출발점: generator와 discriminator의 분포 게임",
    subcategory: "ai-generative",
    sections: [
      { id: "distribution", title: "Latent에서 sample distribution으로" },
      { id: "discriminator", title: "Real·fake를 구별하는 함수" },
      { id: "objective", title: "Generator가 받는 학습 신호" },
      { id: "boundary", title: "Density·encoder·수렴의 경계" },
    ],
    component: () => import("@/pages/articles/ai/gan"),
  },
  {
    slug: "gan-training-dynamics",
    title: "GAN training dynamics: 두 optimizer가 만드는 움직이는 game",
    subcategory: "ai-generative",
    sections: [
      { id: "alternating", title: "D step과 G step" },
      { id: "gradient-path", title: "Detach와 gradient path" },
      { id: "game-dynamics", title: "회전·TTUR·local convergence" },
      { id: "mode-collapse", title: "Mode collapse를 진단하는 법" },
    ],
    component: () => import("@/pages/articles/ai/gan-training-dynamics"),
  },
  {
    slug: "gan-wasserstein-critics",
    title: "Wasserstein GAN: Lipschitz critic과 안정화 제약",
    subcategory: "ai-generative",
    sections: [
      { id: "lipschitz", title: "Lipschitz 제약의 형태" },
      { id: "wasserstein-dual", title: "Transport distance를 critic으로 읽기" },
      { id: "gradient-penalty", title: "Sampled input-gradient penalty" },
      { id: "spectral-normalization", title: "Weight operator norm 제약" },
    ],
    component: () => import("@/pages/articles/ai/gan-wasserstein-critics"),
  },
  {
    slug: "gan-conditional-evaluation",
    title: "Conditional GAN 평가: 조건·품질·coverage를 분리하기",
    subcategory: "ai-generative",
    sections: [
      { id: "conditioning", title: "Condition을 양쪽에 주는 이유" },
      { id: "fid", title: "Feature mean·covariance와 FID" },
      { id: "precision-recall", title: "품질과 coverage 분리" },
      { id: "evaluation-protocol", title: "재현 가능한 평가 계약" },
    ],
    component: () => import("@/pages/articles/ai/gan-conditional-evaluation"),
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
