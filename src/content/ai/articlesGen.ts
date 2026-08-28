import type { Article } from "../types";

export const genArticles: Article[] = [
  {
    slug: "generative-theory",
    title: "생성 모델의 출발점: observation·distribution·평가",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "Observation과 distribution" },
      { id: "tractability", title: "직접 계산할 연산" },
      { id: "evaluation", title: "Likelihood와 평가 경계" },
      { id: "family-map", title: "다음 학습 경로" },
    ],
    component: () => import("@/pages/articles/ai/generative-theory"),
  },
  {
    slug: "autoregressive-generative-models",
    title: "자기회귀 생성 모델: prefix conditional을 곱하는 이유",
    subcategory: "ai-generative",
    sections: [
      { id: "sequence", title: "Token·prefix·conditional" },
      { id: "factorization", title: "Chain-rule factorization" },
      { id: "train-sample", title: "Training과 sampling" },
      { id: "boundary", title: "Ordering·exposure·latency" },
    ],
    component: () =>
      import("@/pages/articles/ai/autoregressive-generative-models"),
  },
  {
    slug: "latent-variable-generative-models",
    title: "잠재변수 생성 모델: 숨은 원인·marginalization·ELBO",
    subcategory: "ai-generative",
    sections: [
      { id: "latent-cause", title: "Latent cause와 네 분포" },
      { id: "marginalization", title: "숨은 원인을 가중해 합하기" },
      { id: "elbo", title: "Approximate posterior와 ELBO" },
      { id: "paper-aevb", title: "AEVB 근거와 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/latent-variable-generative-models"),
  },
  {
    slug: "normalizing-flows",
    title: "Normalizing flow: 가역 좌표와 density 보정",
    subcategory: "ai-generative",
    sections: [
      { id: "bijection", title: "Base·bijection·Jacobian" },
      { id: "change-of-variables", title: "Volume을 보정하는 이유" },
      { id: "failure-boundary", title: "가역성의 대가" },
      { id: "paper-real-nvp", title: "Real NVP 근거와 경계" },
    ],
    component: () => import("@/pages/articles/ai/normalizing-flows"),
  },
  {
    slug: "adversarial-density-ratios",
    title: "GAN density ratio: discriminator가 비교하는 것",
    subcategory: "ai-generative",
    sections: [
      { id: "two-sources", title: "Real과 generated source" },
      { id: "optimal-ratio", title: "Optimal discriminator ratio" },
      { id: "training-boundary", title: "이론과 실제 training" },
      { id: "paper-gan", title: "Original GAN 근거와 경계" },
    ],
    component: () => import("@/pages/articles/ai/adversarial-density-ratios"),
  },
  {
    slug: "score-based-generative-models",
    title: "Score 기반 생성 모델: local direction에서 diffusion까지",
    subcategory: "ai-generative",
    sections: [
      { id: "score-field", title: "Density와 score field" },
      { id: "gaussian-score", title: "Gaussian score의 minus" },
      { id: "noise-score", title: "Noise predictor와 score" },
      { id: "papers-score", title: "NCSN·DDPM 근거와 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/score-based-generative-models"),
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
    title: "Diffusion 기초: noise pair·prediction target·score",
    subcategory: "ai-generative",
    sections: [
      { id: "corruption", title: "Training pair와 sampling loop" },
      { id: "schedule", title: "Gaussian cumulative schedule" },
      { id: "target", title: "Prediction target와 backbone" },
      { id: "loss-derivation", title: "L_simple의 ELBO 유도" },
      { id: "score", title: "Noise–score identity" },
    ],
    component: () => import("@/pages/articles/ai/diffusion-models"),
  },
  {
    slug: "diffusion-continuous-time",
    title: "Continuous diffusion: reverse SDE·flow ODE·solver",
    subcategory: "ai-generative",
    sections: [
      { id: "reverse-sde", title: "Reverse-time SDE" },
      { id: "probability-flow", title: "Probability-flow ODE" },
      { id: "flow-matching", title: "Conditional flow matching" },
      { id: "solver-budget", title: "Solver error와 NFE" },
    ],
    component: () => import("@/pages/articles/ai/diffusion-continuous-time"),
  },
  {
    slug: "latent-diffusion-guidance",
    title: "Latent diffusion: component pipeline·CFG·release gate",
    subcategory: "ai-generative",
    sections: [
      { id: "compression", title: "Latent bottleneck" },
      { id: "pipeline", title: "Component contract" },
      { id: "guidance", title: "Classifier-free guidance" },
      { id: "evaluation", title: "Conditional release gate" },
    ],
    component: () => import("@/pages/articles/ai/latent-diffusion-guidance"),
  },
  {
    slug: "image-video-lora-architecture",
    title: "Image·Video LoRA: host architecture와 adapter 범위",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "같은 LoRA, 다른 host architecture" },
      { id: "image-scope", title: "Image denoiser의 target 범위" },
      { id: "video-scope", title: "공간·시간·교차모달 target" },
      { id: "training-evaluation", title: "Clip 학습과 평가 계약" },
    ],
    component: () =>
      import("@/pages/articles/ai/image-video-lora-architecture"),
  },
  {
    slug: "in-context-lora",
    title: "In-Context LoRA: reference·target을 한 context로 이어붙이기",
    subcategory: "ai-generative",
    sections: [
      { id: "overview", title: "새 아키텍처 대신 self-attention 재사용" },
      { id: "training", title: "Clean reference·noised target 학습" },
      { id: "applications", title: "ID-LoRA — identity guidance와 two-stage 생성" },
    ],
    component: () => import("@/pages/articles/ai/in-context-lora"),
  },
];
