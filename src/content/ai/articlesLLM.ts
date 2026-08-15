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
    title: "RLHF: feedback에서 reward model·PPO까지",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "핵심 아이디어와 최소 용어" },
      { id: "reward-model", title: "두 답의 비교를 점수로 바꾸기" },
      { id: "ppo", title: "새 응답을 만들며 학습하는 PPO-RLHF" },
    ],
    component: () => import("@/pages/articles/ai/rlhf"),
  },
  {
    slug: "dpo",
    title: "DPO: chosen·rejected pair를 direct policy loss로",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Pair에서 direct update까지" },
      { id: "pair-contract", title: "Prompt·chosen·rejected·reference" },
      { id: "dpo", title: "Log-ratio margin과 DPO loss" },
      { id: "evaluation", title: "Support·shortcut·배포 평가" },
    ],
    component: () => import("@/pages/articles/ai/dpo"),
  },
  {
    slug: "constitutional-ai",
    title: "Constitutional AI: 원칙→critique→revision→RLAIF",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "판단 기준의 provenance" },
      { id: "constitution", title: "원칙의 형태와 충돌" },
      { id: "constitutional-ai", title: "Critique·revision·AI feedback" },
      { id: "evaluation", title: "Judge와 human oversight" },
    ],
    component: () => import("@/pages/articles/ai/constitutional-ai"),
  },
  {
    slug: "orpo",
    title: "ORPO: chosen SFT와 odds separation을 한 stage에",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Imitation과 separation" },
      { id: "pair-contract", title: "Reference-free와 pair-free 구분" },
      { id: "orpo", title: "Odds-ratio preference objective" },
      { id: "evaluation", title: "절감량과 품질 회귀" },
    ],
    component: () => import("@/pages/articles/ai/orpo"),
  },
  {
    slug: "kto",
    title: "KTO: 짝 없는 binary feedback으로 preference 학습",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Binary label에서 utility까지" },
      { id: "binary-feedback", title: "Exposure·label·class balance" },
      { id: "kto", title: "KL reference point와 KTO loss" },
      { id: "evaluation", title: "Logging bias와 독립 평가" },
    ],
    component: () => import("@/pages/articles/ai/kto"),
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
    title: "Kimi K3 전체 구조: sequence·depth·width를 나눠 읽기",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "세 축을 먼저 분리하기" },
      { id: "axes", title: "세 독립 수업으로 이동" },
      { id: "configuration", title: "93층 구성 장부" },
      { id: "evidence", title: "근거 강도 구분" },
    ],
    component: () => import("@/pages/articles/ai/kimi-k3-architecture"),
  },
  {
    slug: "kimi-k3-sequence-mixer",
    title: "Kimi K3 sequence mixer: KDA state에서 Gated MLA까지",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "KDA state와 delta update" },
      { id: "decay", title: "Decay의 수치 경계" },
      { id: "hybrid", title: "KDA와 MLA 조합" },
      { id: "position", title: "NoPE와 순서 신호" },
    ],
    component: () => import("@/pages/articles/ai/kimi-k3-sequence-mixer"),
  },
  {
    slug: "kimi-k3-depth-routing",
    title: "Kimi K3 depth routing: Residual에서 Block AttnRes까지",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Residual 통로" },
      { id: "depth-attention", title: "Depth source 선택" },
      { id: "block-bound", title: "Block state bound" },
      { id: "evidence", title: "표현력·비용 경계" },
    ],
    component: () => import("@/pages/articles/ai/kimi-k3-depth-routing"),
  },
  {
    slug: "kimi-k3-latent-moe",
    title: "Kimi K3 Stable LatentMoE: width·activation·load",
    subcategory: "ai-llm-theory",
    sections: [
      { id: "overview", title: "Routed width 분해" },
      { id: "activation", title: "SiTU-GLU soft cap" },
      { id: "balancing", title: "Quantile Balancing" },
      { id: "release", title: "세 안정화 경계 조합" },
    ],
    component: () => import("@/pages/articles/ai/kimi-k3-latent-moe"),
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
