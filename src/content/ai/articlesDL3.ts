import type { Article } from "../types";

// ── Foundations (후반): 딥러닝 개요, 오토인코더 ──
export const dlFoundation2Articles: Article[] = [
  {
    slug: "autoencoder",
    title: "Autoencoder 기초: Input · Latent · Reconstruction",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Input에서 reconstruction까지" },
      { id: "bottleneck", title: "Latent information path" },
      { id: "reconstruction", title: "Reconstruction objective" },
      { id: "evaluation", title: "Identity failure와 평가 분리" },
    ],
    component: () => import("@/pages/articles/ai/autoencoder"),
  },
  {
    slug: "linear-autoencoder-pca",
    title: "Linear Autoencoder와 PCA: 같아지는 정확한 조건",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "정리의 네 전제" },
      { id: "rank-k", title: "Rank-k reconstruction map" },
      { id: "theorem", title: "SVD와 principal subspace" },
      { id: "boundary", title: "Nonlinear 확장 경계" },
    ],
    component: () => import("@/pages/articles/ai/linear-autoencoder-pca"),
  },
  {
    slug: "denoising-masked-autoencoders",
    title: "Denoising과 Masked Autoencoder: 무엇을 숨기고 복원할까",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Clean·corrupted input 분리" },
      { id: "denoising", title: "Denoising objective" },
      { id: "masking", title: "Visible·masked patch" },
      { id: "choice", title: "Intervention 선택 경계" },
    ],
    component: () => import("@/pages/articles/ai/denoising-masked-autoencoders"),
  },
  {
    slug: "reconstruction-anomaly-detection",
    title: "Reconstruction Anomaly Detection: Score · Threshold · Drift",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Reconstruction score 정의" },
      { id: "threshold", title: "Threshold calibration" },
      { id: "failure", title: "Score overlap 반례" },
      { id: "release", title: "운영 receipt와 drift" },
    ],
    component: () => import("@/pages/articles/ai/reconstruction-anomaly-detection"),
  },
];

// ── Computer Vision ──
export const dlVisionArticles: Article[] = [
  {
    slug: "cnn",
    title: "CNN: 합성곱 신경망의 원리와 진화",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Image tensor와 구조적 가정" },
      { id: "convolution-layer", title: "Local operator와 spatial geometry" },
      { id: "inductive-bias", title: "Equivariance와 receptive field" },
      { id: "architectures", title: "비용·최적화 bottleneck" },
      { id: "applications", title: "Spatial task와 transfer" },
      { id: "cnn-vs-transformer", title: "Prior·cost 선택" },
    ],
    component: () => import("@/pages/articles/ai/cnn"),
  },
  {
    slug: "resnet",
    title: "ResNet: 잔차 연결이 깊은 네트워크를 학습시키는 법",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Optimization degradation" },
      { id: "skip-connection", title: "Identity path·Jacobian·shape" },
      {
        id: "architecture",
        title: "BasicBlock·Bottleneck·pre-activation",
      },
      { id: "impact", title: "해석·backbone·한계" },
    ],
    component: () => import("@/pages/articles/ai/resnet"),
  },
];
