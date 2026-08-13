import type { Article } from "../types";
import { vllmServingArticles } from "./articlesVLLM";

const llmBaseArticles: Article[] = [
  // ── LLM Theory: 학습, 정렬, 해석가능성 ──
  {
    slug: "supervised-fine-tuning",
    title: "SFT: demonstration을 response-token 학습으로 바꾸기",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Pretraining과 preference 사이" },
      { id: "data-contract", title: "Demonstration과 provenance" },
      { id: "response-loss", title: "Response-only loss mask" },
      { id: "teacher-forcing", title: "Teacher forcing과 prefix gap" },
      { id: "packing", title: "Packing과 sample boundary" },
      { id: "evaluation", title: "Loss와 행동 평가 분리" },
    ],
    component: () => import("@/pages/articles/ai/supervised-fine-tuning"),
  },
  {
    slug: "rlhf",
    title: "LLM post-training: RLHF·DPO·CAI·ORPO·KTO",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "핵심 아이디어와 최소 용어" },
      { id: "reward-model", title: "두 답의 비교를 점수로 바꾸기" },
      { id: "ppo", title: "새 응답을 만들며 학습하는 PPO-RLHF" },
      { id: "dpo", title: "고정 pair로 policy를 직접 학습하는 DPO" },
      { id: "constitutional-ai", title: "원칙으로 feedback을 만드는 CAI" },
      { id: "orpo", title: "SFT와 선호 분리를 합치는 ORPO" },
      { id: "kto", title: "독립적인 binary feedback을 쓰는 KTO" },
    ],
    component: () => import("@/pages/articles/ai/rlhf"),
  },
  {
    slug: "yarn-rope-extension",
    title: "RoPE에서 YaRN까지: 긴 문맥 확장의 원리와 검증",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "길이를 늘리는 것과 잘 쓰는 것" },
      { id: "rope-foundation", title: "RoPE의 회전과 주파수" },
      { id: "extension-attempts", title: "PI와 NTK-aware scaling" },
      { id: "yarn-method", title: "YaRN의 두 구성 요소" },
      {
        id: "implementation",
        title: "설정과 검증: vLLM · Transformers · llama.cpp",
      },
    ],
    component: () => import("@/pages/articles/ai/yarn-rope-extension"),
  },
  {
    slug: "grammar-constrained-generation",
    title: "문법 제약 생성: PDA에서 XGrammar까지",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "프롬프트가 아니라 디코더에서 막는다" },
      { id: "formal-language", title: "CFG와 PDA가 필요한 이유" },
      { id: "tree-sitter", title: "Tree-sitter와 무엇이 다른가" },
      { id: "decoder", title: "문법 상태에서 token mask까지" },
      { id: "serving", title: "서빙·에이전트 구현 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/grammar-constrained-generation"),
  },
  {
    slug: "mixture-of-experts",
    title: "Mixture-of-Experts: router·Top-k·load·system cost를 함께 읽기",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Dense FFN에서 conditional expert로" },
      { id: "routing", title: "Router · Top-k · weighted mixture" },
      { id: "load-balancing", title: "Load balancing · capacity · overflow" },
      { id: "system-cost", title: "Total·active parameter와 통신 비용" },
      { id: "evolution", title: "Shared·fine-grained·latent expert" },
    ],
    component: () => import("@/pages/articles/ai/mixture-of-experts"),
  },
  {
    slug: "kimi-k3-architecture",
    title: "Kimi K3 아키텍처: sequence·depth·width를 따로 스케일링하기",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "공식 구성부터 읽기" },
      { id: "hybrid-attention", title: "Sequence: KDA + Gated MLA" },
      { id: "attention-residuals", title: "Depth: Attention Residuals" },
      { id: "stable-latent-moe", title: "Width: Stable LatentMoE" },
      { id: "reading-report", title: "공개 사실과 해석을 나누는 법" },
    ],
    component: () => import("@/pages/articles/ai/kimi-k3-architecture"),
  },
  {
    slug: "sparse-autoencoder",
    title: "Sparse autoencoder: activation을 feature dictionary로 읽기",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "SAE의 관측·해석 계약" },
      {
        id: "residual-stream",
        title: "Measurement target과 hook point",
      },
      { id: "polysemanticity", title: "Superposition 가설" },
      { id: "sae-architecture", title: "Dictionary objective와 평가" },
      { id: "feature-steering", title: "해석과 causal test" },
      { id: "limitations", title: "Claim의 한계" },
    ],
    component: () => import("@/pages/articles/ai/sparse-autoencoder"),
  },

  // ── LLM Applied: 추론 모델 학습 ──
  {
    slug: "open-r1",
    title: "Open-R1: reasoning data·SFT·GRPO를 재현하는 법",
    subcategory: "ai-llm-applied",
    sections: [
      { id: "overview", title: "세 가지 재현 경로" },
      { id: "sft-process", title: "SFT token supervision" },
      { id: "grpo-process", title: "GRPO의 on-policy loop" },
      { id: "reward-system", title: "Verifier와 reward 경계" },
      { id: "data-pipeline", title: "Synthetic data lineage" },
      { id: "evaluation", title: "Sampling · uncertainty · cost" },
    ],
    component: () => import("@/pages/articles/ai/open-r1"),
  },

  // ── LLM Serving: 추론 최적화, 서빙 인프라 ──
  {
    slug: "sionic-glm-b300",
    title: "GLM-5.2를 B300에서 600 tok/s로: kernel·runtime·MTP 최적화",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "FLOPS보다 bytes와 forward 횟수" },
      { id: "roofline", title: "가중치 traffic으로 하한 계산하기" },
      { id: "kernel", title: "Split-K·TMEM·PQ-GEMM" },
      { id: "runtime", title: "작은 kernel과 CPU 동기화 제거" },
      { id: "mtp", title: "MTP: 한 forward에서 여러 token 확정" },
      { id: "measurement", title: "실측 ledger와 수치 정확도" },
      { id: "production", title: "benchmark를 production으로 옮길 때" },
    ],
    component: () => import("@/pages/articles/ai/sionic-glm-b300"),
  },
  {
    slug: "llm-serving-ops",
    title: "LLM 서빙 운영: Gateway · GPU Fleet · 관측과 자동화",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "Workload·SLO에서 운영 제어면으로" },
      { id: "litellm-gateway", title: "Capability · deadline · retry" },
      {
        id: "k8s-gpu-fleet",
        title: "Requested Pod에서 Ready GPU capacity까지",
        subsections: [
          { id: "paper-little-law", title: "Little's law 원 논문의 전제" },
        ],
      },
      { id: "serving-deployment", title: "Probe · canary · drain · HPA" },
      { id: "observability-aiops", title: "SLI · error budget · closed-loop" },
    ],
    component: () => import("@/pages/articles/ai/llm-serving-ops"),
  },
];

export const llmArticles: Article[] = [
  ...llmBaseArticles,
  ...vllmServingArticles,
];
