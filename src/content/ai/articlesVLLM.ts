import type { Article } from "../types";

export const vllmServingArticles: Article[] = [
  {
    slug: "vllm-serving",
    title: "vLLM 입문: Continuous Batching부터 GPU 실행까지",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "overview",
        title: "온라인 request lifecycle과 latency 분해",
        subsections: [
          { id: "prefill-decode", title: "Prefill·decode 실행 단계" },
        ],
      },
      {
        id: "engine-loop",
        title: "Iteration-level continuous batching",
        subsections: [
          { id: "paper-orca", title: "Orca의 iteration-level scheduling" },
          { id: "resource-feasibility", title: "Token·sequence·KV hard budget" },
          { id: "paper-vllm", title: "vLLM·PagedAttention 원 논문의 핵심" },
        ],
      },
      {
        id: "serving-architecture",
        title: "Engine 책임 경계와 GPU 확장",
        subsections: [
          { id: "v1-boundary", title: "vLLM V1의 state ownership" },
          { id: "parallel-layout", title: "DP·TP·PP worker layout" },
          { id: "serving-goodput", title: "SLO goodput 승인 기준" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-serving"),
  },
  {
    slug: "vllm-scheduler",
    title: "vLLM Scheduler: Token Budget · Chunked Prefill · Preemption",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "overview",
        title: "Scheduler의 입력·출력 계약",
        subsections: [
          { id: "scheduler-boundary", title: "Policy와 memory의 책임 경계" },
        ],
      },
      {
        id: "schedule-method",
        title: "Request progress와 한 GPU step",
        subsections: [
          { id: "running-waiting-order", title: "RUNNING·WAITING admission 순서" },
          { id: "closed-loop-update", title: "Output update와 closed-loop" },
        ],
      },
      {
        id: "prefill-decode",
        title: "Chunked prefill과 decode latency",
        subsections: [
          { id: "paper-sarathi", title: "Sarathi-Serve 원 논문의 핵심" },
          { id: "scheduler-knobs", title: "Scheduler knob·metric ledger" },
          { id: "workload-replay", title: "분포를 보존한 workload replay" },
        ],
      },
      {
        id: "preemption",
        title: "KV pressure와 recomputation",
        subsections: [
          { id: "paper-fastserve", title: "FastServe의 preemption 설계 공간" },
          { id: "preemption-diagnosis", title: "Preemption 원인 진단" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-scheduler"),
  },
  {
    slug: "vllm-paged-attention",
    title: "vLLM PagedAttention: KV Block · Allocation · Prefix Cache",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "overview",
        title: "Variable-length KV를 block으로 바꾸기",
        subsections: [
          { id: "logical-physical-address", title: "Logical→physical address translation" },
          { id: "paper-pagedattention", title: "PagedAttention 원 논문의 핵심" },
          { id: "memory-kernel-boundary", title: "Manager·kernel·scheduler 책임 경계" },
        ],
      },
      {
        id: "block-pool",
        title: "Physical block의 소유권과 수명",
        subsections: [
          { id: "free-queue-eviction", title: "Free queue와 cache eviction" },
          { id: "block-invariants", title: "BlockPool의 세 불변식" },
        ],
      },
      {
        id: "kv-cache-manager",
        title: "Scheduler와 allocation 계약",
        subsections: [
          { id: "allocation-failure", title: "Allocation 실패의 책임 경계" },
          { id: "hybrid-cache-groups", title: "Hybrid model cache group" },
        ],
      },
      {
        id: "prefix-caching",
        title: "Automatic Prefix Caching",
        subsections: [
          { id: "full-block-boundary", title: "Token·full-block hit 경계" },
          { id: "paper-radixattention", title: "SGLang·RadixAttention 논문의 핵심" },
          { id: "prefix-operations", title: "Prefix cache 운영 지표" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-paged-attention"),
  },
  {
    slug: "vllm-spec-decode",
    title: "vLLM Speculative Decoding: Draft · Verify · Acceptance",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "overview",
        title: "Target 실행 한 번을 여러 token이 나눠 쓰는 원리",
        subsections: [
          { id: "acceptance-length", title: "Acceptance length의 정확한 정의" },
        ],
      },
      {
        id: "draft-verify",
        title: "Target 분포를 보존하는 rejection sampling",
        subsections: [
          {
            id: "paper-speculative-decoding",
            title: "Speculative Decoding 원 논문의 핵심 아이디어",
          },
        ],
      },
      {
        id: "eagle-mtp",
        title: "EAGLE·native MTP·Draft proposer 선택",
        subsections: [
          { id: "paper-eagle", title: "EAGLE 논문의 feature-level proposal" },
          { id: "paper-mtp", title: "Multi-Token Prediction 원 논문의 핵심" },
          { id: "native-mtp", title: "Native MTP의 serving 경계" },
          { id: "paper-specinfer", title: "SpecInfer의 token-tree verification" },
          { id: "serving-break-even", title: "Production 손익분기점" },
          { id: "dynamic-policy", title: "Dynamic speculation 정책" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-spec-decode"),
  },
  {
    slug: "hybrid-attention-serving",
    title:
      "KV Cache와 Local·Global Attention: Qwen 27B · Muse 30B · Gemma 4 31B",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "비슷한 30B라도 배치 성격은 다르다" },
      {
        id: "kv-shape",
        title: "MHA·GQA와 토큰당 KV byte 계산",
        subsections: [
          { id: "kv-shape-sharing", title: "MHA·GQA·MQA의 head 공유" },
          { id: "paper-mqa", title: "MQA 논문의 문제와 핵심 아이디어" },
          { id: "paper-gqa", title: "GQA 논문의 문제와 핵심 아이디어" },
          { id: "kv-shape-formula", title: "토큰당 KV byte 공식" },
          { id: "kv-shape-runtime", title: "Gemma config와 TP 보정" },
        ],
      },
      {
        id: "kv-cache",
        title: "Local layer가 KV 증가율을 낮추는 방식",
        subsections: [
          {
            id: "spec-vllm-hybrid",
            title: "vLLM hybrid allocator의 구현 경계",
          },
          {
            id: "paper-pagedattention",
            title: "PagedAttention의 핵심 아이디어",
          },
        ],
      },
      {
        id: "capacity",
        title: "Context 길이와 동시 사용자 수를 분리해서 계산하기",
        subsections: [
          { id: "capacity-sliding", title: "Sliding-window 실측 해석" },
          { id: "capacity-logs", title: "vLLM 로그의 단위 검산" },
          { id: "capacity-admission", title: "요청 분포 기반 수용량" },
        ],
      },
      { id: "deployment", title: "망분리 환경의 모델 선택과 반입 체크리스트" },
    ],
    component: () => import("@/pages/articles/ai/hybrid-attention-serving"),
  },
  {
    slug: "qwen36-hybrid-architecture",
    title: "Qwen3.6-27B 아키텍처: DeltaNet · Attention · Hybrid Cache",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "64층을 두 종류의 memory로 나누기" },
      {
        id: "attention-kv",
        title: "Attention·GQA와 token마다 커지는 KV cache",
        subsections: [
          { id: "kv-bytes", title: "BF16 token당 64 KiB 계산" },
          { id: "paper-qwen36-config", title: "Qwen3.6 공식 config 읽기" },
        ],
      },
      {
        id: "deltanet-state",
        title: "DeltaNet의 고정 recurrent state와 delta rule",
        subsections: [
          { id: "delta-update", title: "읽은 오차만 고쳐 쓰기" },
          { id: "state-bytes", title: "FP32 core state 144 MiB 계산" },
          { id: "paper-gated-deltanet", title: "Gated DeltaNet 원 논문" },
        ],
      },
      {
        id: "weight-vram",
        title: "27B parameter에서 48 GiB VRAM 예산으로",
        subsections: [
          { id: "weight-bytes", title: "BF16·공식 혼합 FP8 weight byte 계산" },
          { id: "vram-admission", title: "32K·128K·262K known memory floor" },
          { id: "paper-qwen36-weights", title: "공식 checkpoint payload 근거" },
        ],
      },
      {
        id: "hybrid-runtime",
        title: "Hybrid cache manager가 두 state를 함께 관리하는 법",
        subsections: [
          { id: "prefill-decode", title: "Chunked prefill과 recurrent decode" },
          { id: "paper-vllm-hybrid", title: "vLLM hybrid cache 설계" },
        ],
      },
      {
        id: "model-stack",
        title: "RoPE·FFN·MTP·multimodal token을 같은 stack에 놓기",
        subsections: [
          { id: "paper-transformers-qwen35", title: "Transformers reference path" },
          { id: "release-check", title: "배포 전 확인할 artifact와 측정" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/qwen36-hybrid-architecture"),
  },
];
