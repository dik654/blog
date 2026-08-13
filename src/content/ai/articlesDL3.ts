import type { Article } from "../types";

// ── Foundations (후반): 딥러닝 개요, 오토인코더 ──
export const dlFoundation2Articles: Article[] = [
  {
    slug: "autoencoder",
    title: "오토인코더: 압축과 복원으로 배우는 표현 학습",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "복원 과제로 representation 압축하기" },
      { id: "architecture", title: "Encoder·bottleneck·decoder" },
      { id: "forward-example", title: "순전파를 숫자로 따라가기" },
      { id: "loss-backprop", title: "Reconstruction loss와 역전파" },
      { id: "dimension-reduction", title: "차원 축소의 의미" },
      { id: "applications", title: "활용 사례" },
      { id: "variants", title: "제약과 목표가 다른 변형들" },
    ],
    component: () => import("@/pages/articles/ai/autoencoder"),
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
