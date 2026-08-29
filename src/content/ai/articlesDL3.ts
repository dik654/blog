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
    component: () =>
      import("@/pages/articles/ai/denoising-masked-autoencoders"),
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
    component: () =>
      import("@/pages/articles/ai/reconstruction-anomaly-detection"),
  },
  {
    slug: "vision-language-model-architecture",
    title: "VLM은 image patch를 projector로 LLM token에 맞춥니다",
    subcategory: "ai-vision",
    sections: [
      { id: "problem", title: "Vision encoder·projector·LLM 조립" },
      { id: "architecture", title: "Multimodal model, VLM, vision encoder" },
      { id: "projector", title: "Multimodal projector와 차원 산수" },
      { id: "alignment", title: "Cross-modal alignment: concat vs cross-attention vs query bottleneck" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-llava", title: "LLaVA" },
          { id: "paper-flamingo", title: "Flamingo" },
          { id: "paper-blip2", title: "BLIP-2" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vision-language-model-architecture"),
  },
  {
    slug: "multimodal-retrieval-and-visual-grounding",
    title: "같은 embedding 공간이 검색을, grounding primitive가 위치를 정합니다",
    subcategory: "ai-vision",
    sections: [
      { id: "problem", title: "검색은 무엇인지, grounding은 어디인지" },
      { id: "embedding-and-retrieval", title: "Multimodal embedding, cross-modal retrieval, multimodal RAG" },
      { id: "document-retrieval", title: "Visual document retrieval과 screenshot retrieval" },
      { id: "grounding", title: "Bounding box, point, segmentation grounding" },
      { id: "vision-in-the-loop", title: "Vision-in-the-loop reasoning" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-clip", title: "CLIP" },
          { id: "paper-colpali", title: "ColPali" },
          { id: "paper-kosmos2", title: "Kosmos-2" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/multimodal-retrieval-and-visual-grounding"),
  },
];

// ── Computer Vision ──
export const dlVisionArticles: Article[] = [
  {
    slug: "cnn",
    title: "CNN 기초: Image Grid에서 Shared Kernel까지",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Image Tensor와 Local Window" },
      { id: "local-operator", title: "Cross-correlation 한 칸" },
      { id: "shared-kernel", title: "Weight Sharing" },
      { id: "output-geometry", title: "Stride·Padding·Dilation Shape" },
    ],
    component: () => import("@/pages/articles/ai/cnn"),
  },
  {
    slug: "cnn-translation-equivariance",
    title: "CNN Translation Equivariance: 이동 관계와 반례",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Equivariance와 Invariance" },
      { id: "equivariance", title: "Shared Operator 증명" },
      { id: "counterexamples", title: "Stride·Boundary 반례" },
      { id: "release", title: "Shift Test" },
    ],
    component: () => import("@/pages/articles/ai/cnn-translation-equivariance"),
  },
  {
    slug: "cnn-receptive-fields",
    title: "CNN Receptive Field: 연결 범위·실제 영향·Dilation",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Theoretical·Effective 범위" },
      { id: "theoretical", title: "Layer별 범위 누적" },
      { id: "effective", title: "Gradient·Perturbation 측정" },
      { id: "dilation", title: "Dilation과 Gridding" },
    ],
    component: () => import("@/pages/articles/ai/cnn-receptive-fields"),
  },
  {
    slug: "depthwise-separable-convolution",
    title: "Depthwise Separable Convolution: 공간 필터와 채널 혼합",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Depthwise·Pointwise 분리" },
      { id: "cost", title: "MAC 비율 계산" },
      { id: "runtime", title: "실제 Device 경계" },
      { id: "paper-mobilenet", title: "MobileNet 근거" },
    ],
    component: () =>
      import("@/pages/articles/ai/depthwise-separable-convolution"),
  },
  {
    slug: "vision-task-spatial-contracts",
    title: "Vision Task Spatial Contracts: Class·Box·Mask·Image",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Prediction Unit" },
      { id: "output-shapes", title: "Task별 Output Shape" },
      { id: "preservation", title: "Spatial Evidence 보존" },
      { id: "release", title: "Task별 Release Metric" },
    ],
    component: () =>
      import("@/pages/articles/ai/vision-task-spatial-contracts"),
  },
  {
    slug: "vla-embodiment-gap",
    title: "VLA Embodiment Gap: 의미에서 물리 행동까지",
    subcategory: "ai-vision",
    sections: [
      { id: "overview", title: "Semantic에서 physical action까지" },
      { id: "action-interface", title: "Action representation contract" },
      { id: "embodiment-alignment", title: "Cross-embodiment adaptation" },
      { id: "system-boundary", title: "Monolithic과 hierarchical boundary" },
      { id: "pixel-to-3d", title: "Pixel-to-3D interface" },
      { id: "closed-loop-release", title: "Closed-loop release gate" },
    ],
    component: () => import("@/pages/articles/ai/vla-embodiment-gap"),
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
