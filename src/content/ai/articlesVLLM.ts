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
          {
            id: "resource-feasibility",
            title: "Token·sequence·KV hard budget",
          },
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
    slug: "serving-latency-metrics-and-slo",
    title: "TTFT·TPOT·ITL 은 분포로 읽고 SLO 는 percentile 로 계약합니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "평균 latency 한 줄로는 부족한 이유" },
      { id: "metrics", title: "TTFT·ITL·TPOT·E2E 정의와 분해식" },
      { id: "throughput", title: "tokens/s·RPS 와 latency–throughput 상충" },
      { id: "distribution", title: "Percentile 과 tail latency 로 읽기" },
      { id: "slo", title: "SLO 문장과 violation budget 판정" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-vllm-bench", title: "vLLM serving benchmark 계산식" },
          { id: "paper-genai-perf", title: "GenAI-Perf 지표 정의" },
          { id: "paper-sre-slo", title: "SRE Book 의 SLO 장" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/serving-latency-metrics-and-slo"),
  },
  {
    slug: "serving-benchmark-methodology",
    title: "Serving benchmark 는 offered load 를 올리며 steady state 에서 재야 재현됩니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "같은 서버도 실행 조건에 따라 숫자가 달라지는 이유" },
      { id: "taxonomy", title: "Micro·macro·end-to-end 와 입력 분포" },
      { id: "protocol", title: "Cold·warm, steady state, noise 와 variance" },
      { id: "load", title: "Offered load, saturation, utilization–latency 곡선" },
      { id: "reproducibility", title: "Baseline 과 λ sweep 절차" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-vllm-cli", title: "vLLM Benchmark CLI" },
          { id: "paper-genai-perf-load", title: "GenAI-Perf 부하 옵션" },
          { id: "paper-mlperf-rules", title: "MLPerf Inference Rules" },
          { id: "paper-queueing-text", title: "Queueing 교과서(M/M/1)" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/serving-benchmark-methodology"),
  },
  {
    slug: "inference-cost-and-capacity-planning",
    title: "추론 비용은 cost/token 으로, capacity 는 peak 와 headroom 으로 계획합니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "GPU 수를 정하는 두 계산" },
      { id: "cost", title: "GPU-hour 와 cost/token·cost/request" },
      { id: "efficiency", title: "Throughput per dollar·per watt 와 TCO" },
      { id: "capacity", title: "Peak·headroom 과 over/underprovisioning" },
      { id: "scaling", title: "Reserved·on-demand, scale-up/out, autoscaling, fragmentation" },
      {
        id: "sources",
        title: "근거 문서",
        subsections: [
          { id: "paper-hpa", title: "Kubernetes HPA" },
          { id: "paper-gpu-sharing", title: "NVIDIA GPU sharing·MIG" },
          { id: "paper-aws-pricing", title: "EC2 구매 옵션" },
          { id: "paper-mlperf-power", title: "MLPerf Power" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/inference-cost-and-capacity-planning"),
  },
  {
    slug: "inference-runtime-anatomy",
    title: "Inference runtime 은 첫 요청 전에 process 를 나누고 GPU memory 지도를 확정합니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "process-anatomy", title: "Frontend·driver·worker process 분리", subsections: [{ id: "paper-vllm-arch", title: "vLLM 설계 문서의 process 구조" }] },
      { id: "loading", title: "Weight loading 과 sharding 의 대역폭 하한" },
      { id: "memory-plan", title: "Pool·arena 위의 static memory planning", subsections: [{ id: "paper-pytorch-allocator", title: "PyTorch caching allocator 문서" }] },
      { id: "startup-procedure", title: "config 에서 ready 까지의 기동 절차" },
      { id: "warmup", title: "Warmup·cold start 와 eager·lazy 초기화", subsections: [{ id: "paper-sglang-args", title: "SGLang server arguments" }] },
      { id: "backend", title: "Backend 와 compatibility layer" },
    ],
    component: () => import("@/pages/articles/ai/inference-runtime-anatomy"),
  },
  {
    slug: "vllm-scheduler",
    title: "vLLM Scheduler: Token Budget · Chunked Prefill · Preemption",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "overview",
        title: "Scheduler의 입력·출력 계약",
        subsections: [{ id: "scheduler-boundary", title: "Policy와 memory의 책임 경계" }],
      },
      {
        id: "queue-batching",
        title: "Batching 세대·queue 정책·fairness·HOL·overhead",
        subsections: [
          { id: "batching-generations", title: "Static·dynamic·iteration-level batching" },
          { id: "request-queue", title: "Request queue 와 queue discipline" },
          { id: "scheduler-fairness", title: "Token 단위 fairness 와 VTC" },
          { id: "hol-blocking", title: "Head-of-line blocking 의 두 자리" },
          { id: "scheduler-overhead", title: "Scheduler overhead 와 async scheduling" },
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
    slug: "continuous-batching-step-anatomy",
    title: "Scheduling step 해부: running 먼저, 남은 token budget 은 prefill chunk 로",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "step-unit", title: "한 step 의 입력·출력과 sequence 단위" },
      { id: "token-budget", title: "Token budget 과 sequence budget 의 소모 순서" },
      { id: "step-procedure", title: "schedule() 절차: 순회·preempt·admission·chunk" },
      { id: "batch-shape", title: "Decode·prefill·mixed batch 의 모양과 비용" },
      {
        id: "evidence",
        title: "Orca·Sarathi-Serve·vLLM V1 소스",
        subsections: [
          { id: "paper-orca-iteration", title: "Orca 의 iteration-level scheduling" },
          { id: "paper-sarathi-serve", title: "Sarathi-Serve 의 stall-free schedule" },
          { id: "source-vllm-v1-scheduler", title: "vLLM V1 schedule() 소스" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/continuous-batching-step-anatomy"),
  },
  {
    slug: "prefill-decode-phase-dynamics",
    title: "Prefill 은 compute-bound, decode 는 memory-bound: 간섭과 chunk 크기",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "두 phase 가 다른 자원에 막히는 이유" },
      { id: "arithmetic-intensity", title: "Intensity 와 ridge point" },
      { id: "interference", title: "섞인 batch 의 step 시간과 간섭" },
      { id: "chunk-size", title: "Chunk 크기 역산 절차" },
      { id: "long-context", title: "64K 이상에서 n² 항의 지배" },
      { id: "prefill-optimization", title: "Prefill 최적화의 네 층" },
      { id: "evidence", title: "근거와 경계" },
    ],
    component: () => import("@/pages/articles/ai/prefill-decode-phase-dynamics"),
  },
  {
    slug: "disaggregated-prefill-decode-serving",
    title: "Prefill과 decode를 분리 배치하면 KV transfer 비용만큼 간섭이 사라집니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "두 phase를 섞을 때 생기는 문제" },
      { id: "routing", title: "Replica routing과 cache-aware load balancing" },
      { id: "disaggregation", title: "Prefill worker와 decode worker" },
      { id: "kv-transfer", title: "KV transfer의 byte·시간·대역폭" },
      { id: "provisioning", title: "두 풀의 GPU 수와 heterogeneous serving" },
      {
        id: "evidence",
        title: "근거: DistServe·Splitwise·Mooncake와 engine 문서",
        subsections: [
          { id: "paper-distserve", title: "DistServe" },
          { id: "paper-splitwise", title: "Splitwise" },
          { id: "paper-mooncake", title: "Mooncake" },
          { id: "paper-vllm-disagg", title: "vLLM disaggregated prefilling 문서" },
          { id: "paper-sglang-router", title: "SGLang PD disaggregation·router" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/disaggregated-prefill-decode-serving"),
  },
  {
    slug: "inference-optimization-layers",
    title: "추론 최적화의 층: model·kernel·runtime·system 과 ROI",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "네 층과 자기 구간만 줄이는 구조" },
      { id: "layers", title: "층은 건드리는 병목으로 구분" },
      { id: "amdahl", title: "Amdahl 로 계산하는 end-to-end 상한" },
      { id: "interactions", title: "층 사이 상호작용과 hardware-aware 설계" },
      { id: "roi", title: "ROI 와 최적화 선택 loop" },
      { id: "regression-gate", title: "Regression 과 benchmark gate" },
    ],
    component: () => import("@/pages/articles/ai/inference-optimization-layers"),
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
          { id: "fragmentation-kinds", title: "Internal·external fragmentation" },
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
          { id: "block-allocator", title: "Allocator의 allocate·free" },
          { id: "sequence-forking", title: "Sequence fork와 copy-on-write" },
          { id: "beam-branch-sharing", title: "Beam·branch block 공유" },
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
          { id: "prefix-sharing", title: "Block 단위 prefix sharing" },
          { id: "paper-radixattention", title: "SGLang·RadixAttention 논문의 핵심" },
          { id: "prefix-operations", title: "Cache hit rate의 두 정의" },
          { id: "cache-locality", title: "Cache locality의 두 축" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-paged-attention"),
  },
  {
    slug: "serving-memory-admission-and-preemption",
    title: "KV admission은 watermark 아래서만 받고 부족하면 recompute·swap으로 비웁니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "지금 받을지와 누구를 내보낼지" },
      { id: "footprint", title: "요청 memory footprint 계산" },
      { id: "watermark-admission", title: "Watermark와 admission 판정" },
      { id: "preemption-modes", title: "Recompute와 swap preemption" },
      { id: "hybrid-fixed-state", title: "Hybrid model의 고정 state 할당" },
      {
        id: "paper-vllm",
        title: "근거: vLLM 논문과 engine 문서",
        subsections: [
          { id: "paper-vllm-docs", title: "vLLM preemption 문서" },
          { id: "paper-sglang-scheduler", title: "SGLang scheduler 인자" },
          { id: "paper-trtllm-kvcache", title: "TensorRT-LLM KV cache 설정" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/serving-memory-admission-and-preemption"),
  },
  {
    slug: "prefix-caching-radix-attention",
    title: "Prefix caching: radix tree 매칭과 cache-aware scheduling",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "매칭 구조와 실행 순서가 hit 을 정한다" },
      { id: "radix-tree", title: "Radix tree 가 공유 prefix 를 node 로 가르는 방법" },
      {
        id: "matching",
        title: "match_prefix 와 block hash 의 매칭 단위",
        subsections: [{ id: "hybrid-manager", title: "Hybrid cache manager 의 group 간 hit 합의" }],
      },
      { id: "eviction", title: "Ref counter 와 leaf-first LRU eviction" },
      { id: "scheduling", title: "Cache-aware scheduling 의 hit rate 와 fairness" },
      {
        id: "attention-metadata",
        title: "Attention metadata: slot mapping 과 block table lookup",
        subsections: [
          { id: "slot-mapping", title: "Slot mapping · KV 쓰기 경로" },
          { id: "block-table-lookup", title: "Block table lookup · KV 읽기 경로" },
        ],
      },
      {
        id: "evidence",
        title: "SGLang 논문·vLLM 설계 문서·V1 소스",
        subsections: [
          { id: "paper-sglang-radixattention", title: "SGLang RadixAttention 논문" },
          { id: "source-vllm-prefix-caching", title: "vLLM automatic prefix caching 설계" },
          { id: "source-vllm-v1-attention", title: "vLLM V1 attention metadata·coordinator 소스" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/prefix-caching-radix-attention"),
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
          { id: "verification-pass", title: "Verification pass: K+1 분포를 한 forward로" },
          { id: "rejection-point", title: "Rejection point에서의 resample과 suffix 폐기" },
        ],
      },
      {
        id: "cost-model",
        title: "α·K·c로 닫히는 speedup 모델",
        subsections: [
          { id: "speculation-length", title: "Speculation length K" },
          { id: "acceptance-rate", title: "Acceptance rate α와 기대 확정 길이" },
          { id: "speedup-model", title: "Speculative speedup 식과 표" },
          { id: "not-always-faster", title: "항상 빨라지지 않는 조건" },
        ],
      },
      {
        id: "eagle-mtp",
        title: "EAGLE·native MTP·Draft proposer 선택",
        subsections: [
          { id: "paper-eagle", title: "EAGLE 논문의 feature-level proposal" },
          { id: "paper-mtp", title: "Multi-Token Prediction 원 논문의 핵심" },
          { id: "native-mtp", title: "Native MTP의 serving 경계" },
          {
            id: "paper-specinfer",
            title: "SpecInfer의 token-tree verification",
          },
          { id: "serving-break-even", title: "Production 손익분기점" },
          { id: "dynamic-policy", title: "Dynamic speculation 정책" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/vllm-spec-decode"),
  },
  {
    slug: "speculative-decoding-variants",
    title: "Speculative decoding 변형은 draft 의 출처와 verify 의 모양으로 갈립니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "변형을 가르는 두 축: draft 출처와 verify 모양" },
      {
        id: "self-speculative",
        title: "Self-speculative decoding 의 layer 비율 비용",
        subsections: [{ id: "paper-layerskip", title: "LayerSkip 논문의 문제와 기여" }],
      },
      {
        id: "mtp",
        title: "MTP head 의 draft 비용과 효용 경계",
        subsections: [{ id: "paper-deepseek-v3-mtp", title: "DeepSeek-V3 MTP 절의 문제와 기여" }],
      },
      {
        id: "tree",
        title: "Tree 기반 speculation 의 node 수와 기대 길이",
        subsections: [{ id: "paper-medusa", title: "Medusa 논문의 문제와 기여" }],
      },
      {
        id: "tree-verify",
        title: "Tree attention mask 와 경로 확정",
        subsections: [{ id: "paper-specinfer", title: "SpecInfer 논문의 문제와 기여" }],
      },
      {
        id: "suffix",
        title: "Suffix decoding 과 변형 선택",
        subsections: [{ id: "paper-suffix-decoding", title: "SuffixDecoding 논문의 문제와 기여" }],
      },
    ],
    component: () => import("@/pages/articles/ai/speculative-decoding-variants"),
  },
  {
    slug: "kv-cache-fundamentals",
    title: "KV Cache 기초: Query · Key · Value와 GQA memory shape",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "왜 과거 K/V만 보존하는가" },
      {
        id: "kv-shape",
        title: "MHA·GQA와 토큰당 KV byte 계산",
        subsections: [
          { id: "kv-shape-sharing", title: "MHA·GQA·MQA의 head 공유" },
          { id: "paper-mqa", title: "MQA 논문의 문제와 핵심 아이디어" },
          { id: "paper-gqa", title: "GQA 논문의 문제와 핵심 아이디어" },
          { id: "kv-shape-formula", title: "토큰당 KV byte 공식" },
          { id: "kv-shape-runtime", title: "Gemma config와 TP 보정" },
          { id: "cache-representation-design", title: "Cache representation design 축" },
          { id: "mla-vs-gqa", title: "MLA vs GQA와 capacity·bandwidth saving" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/kv-cache-fundamentals"),
  },
  {
    slug: "flash-attention-io-aware-kernel",
    title: "FlashAttention 은 online softmax 로 attention 행렬을 HBM 에 쓰지 않습니다",
    subcategory: "ai-llm-serving",
    sections: [
      {
        id: "problem",
        title: "표준 attention 은 N×N 행렬을 HBM 에 썼다가 다시 읽는다",
        subsections: [{ id: "paper-flashattention", title: "FlashAttention 논문의 문제와 기여" }],
      },
      { id: "io-aware", title: "IO-aware 비용 모델과 SRAM residency" },
      {
        id: "online-softmax",
        title: "Online softmax 의 running max·normalizer 갱신",
        subsections: [{ id: "paper-online-softmax", title: "Online normalizer 논문의 문제와 기여" }],
      },
      { id: "tiling", title: "Tile 이 SRAM 에 머무는 동안 attention 을 끝내는 forward loop" },
      { id: "backward", title: "Backward 의 recompute-vs-store tradeoff" },
      { id: "boundary", title: "SRAM 크기·head dim·hardware 의존성과 다음 읽기" },
    ],
    component: () => import("@/pages/articles/ai/flash-attention-io-aware-kernel"),
  },
  {
    slug: "attention-kernel-anatomy-and-backends",
    title: "Attention kernel 은 세 단계를 한 tile 에 융합하고 prefill 과 decode 에 다른 backend 를 씁니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "Attention kernel 은 세 단계를 한 tile 안에서 끝내는 GPU 함수다" },
      { id: "anatomy", title: "QK matmul·softmax·PV matmul 과 fused kernel" },
      { id: "causal", title: "Causal kernel 의 tile skip 과 load balancing" },
      { id: "regimes", title: "Prefill 은 compute-bound, decode 는 memory-bound" },
      {
        id: "generations",
        title: "FlashAttention-2 의 warp 분할과 3 의 단계 겹치기",
        subsections: [
          { id: "paper-flashattention-2", title: "FlashAttention-2 논문의 문제와 기여" },
          { id: "paper-flashattention-3", title: "FlashAttention-3 논문의 문제와 기여" },
        ],
      },
      {
        id: "backends",
        title: "Backend 선택, FlashInfer, kernel autotuning",
        subsections: [{ id: "paper-flashinfer", title: "FlashInfer 논문의 문제와 기여" }],
      },
    ],
    component: () => import("@/pages/articles/ai/attention-kernel-anatomy-and-backends"),
  },
  {
    slug: "hybrid-kv-cache-allocation",
    title: "Hybrid KV Cache: Local·Global layer와 block 회수",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "읽기 범위와 보관 범위는 다르다" },
      {
        id: "kv-cache",
        title: "Local layer가 KV 보존 길이를 줄이는 방식",
        subsections: [
          {
            id: "spec-vllm-hybrid",
            title: "vLLM hybrid allocator의 구현 경계",
          },
          {
            id: "paper-pagedattention",
            title: "PagedAttention의 block table",
          },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/hybrid-kv-cache-allocation"),
  },
  {
    slug: "llm-serving-capacity",
    title: "LLM Serving Capacity: KV pool · 로그 검산 · Admission",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "Memory 숫자를 사용자 수로 바로 부르지 않기" },
      {
        id: "capacity",
        title: "KV byte를 요청 수용량으로 바꾸기",
        subsections: [
          { id: "capacity-sliding", title: "Sliding-window 실측 해석" },
          { id: "capacity-logs", title: "vLLM 로그의 단위 검산" },
          { id: "capacity-admission", title: "요청 분포 기반 수용량" },
        ],
      },
      { id: "deployment", title: "망분리 환경의 모델 선택과 반입 체크리스트" },
    ],
    component: () => import("@/pages/articles/ai/llm-serving-capacity"),
  },
  {
    slug: "qwen36-hybrid-architecture",
    title: "Qwen3.6-27B 아키텍처: Attention과 DeltaNet의 두 기억",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "3 DeltaNet + 1 Attention을 16번 반복" },
      {
        id: "attention-kv",
        title: "GQA와 token마다 커지는 KV cache",
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
    ],
    component: () => import("@/pages/articles/ai/qwen36-hybrid-architecture"),
  },
  {
    slug: "qwen36-hybrid-runtime",
    title: "Qwen3.6 하이브리드 런타임: Prefill · Decode · State Commit",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "두 cache를 한 request state로 관리" },
      {
        id: "hybrid-runtime",
        title: "길이 비례 KV와 request당 고정 state",
      },
      {
        id: "prefix-transaction",
        title: "Prefill·decode·MTP의 prefix transaction",
        subsections: [
          { id: "state-commit", title: "두 cache를 같은 경계에 commit" },
          { id: "paper-vllm-hybrid", title: "vLLM hybrid cache 설계" },
          {
            id: "paper-transformers-runtime",
            title: "Transformers recurrent reference",
          },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/qwen36-hybrid-runtime"),
  },
  {
    slug: "qwen36-long-context-deployment",
    title: "Qwen3.6 Long Context: mRoPE · Multimodal · 48 GiB 배포",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "위치·memory·retrieval을 분리" },
      {
        id: "position-modal",
        title: "Partial multimodal RoPE와 visual token",
        subsections: [
          { id: "partial-rope", title: "256차원 중 64차원 rotary" },
          {
            id: "paper-qwen36-model-context",
            title: "Qwen 공식 context support",
          },
          {
            id: "paper-transformers-qwen35-context",
            title: "Transformers reference path",
          },
        ],
      },
      {
        id: "memory-profile",
        title: "48 GiB known floor와 미지수",
        subsections: [
          { id: "qwen-known-floor", title: "262K profile의 44.89 GiB 바닥" },
          {
            id: "paper-qwen36-weights-context",
            title: "공식 checkpoint payload 근거",
          },
        ],
      },
      {
        id: "release-check",
        title: "Architecture·memory·kernel·quality receipt",
      },
    ],
    component: () =>
      import("@/pages/articles/ai/qwen36-long-context-deployment"),
  },
  {
    slug: "model-vram-budgeting",
    title: "모델 VRAM 계산: 가중치 · KV Cache · Runtime Headroom",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "모델 이름에서 OOM 판정까지" },
      {
        id: "weight-residency",
        title: "Parameter와 dtype에서 weight floor 계산",
        subsections: [
          { id: "weight-estimate", title: "Mixed-dtype payload 공식" },
          { id: "dtype-ledger", title: "BF16·FP8 weight ledger Viz" },
        ],
      },
      {
        id: "runtime-state",
        title: "KV·recurrent state·workspace 분리",
        subsections: [
          { id: "kv-state", title: "Context와 concurrency의 성장축" },
          { id: "known-floor", title: "Known floor와 physical peak" },
        ],
      },
      {
        id: "moe-serving-boundary",
        title: "MoE total·active·request 세 장부",
        subsections: [
          { id: "paper-qwen3-next", title: "Qwen3-Next total/active 적용 예" },
          { id: "paper-nvfp4", title: "NVFP4 format과 artifact 경계" },
        ],
      },
      {
        id: "admission-logs",
        title: "Admission과 기동 로그 receipt",
        subsections: [
          { id: "paper-safetensors", title: "Safetensors metadata 경계" },
          { id: "paper-qwen-weights", title: "Qwen BF16 payload 적용 예" },
          { id: "paper-vllm-memory", title: "vLLM physical allocation 경계" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/model-vram-budgeting"),
  },
  {
    slug: "expert-parallelism-moe-systems",
    title: "Expert parallelism은 all-to-all 통신량이 expert 계산 시간을 넘지 않게 설계합니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "Expert를 나누면 token이 건너야 하는 이유" },
      { id: "sharding", title: "Expert parallelism과 expert sharding" },
      { id: "all-to-all", title: "All-to-all의 byte·시간·절차" },
      { id: "locality", title: "Expert locality와 node-limited routing" },
      { id: "bottleneck", title: "통신 병목·straggler·routing overhead" },
      {
        id: "evidence",
        title: "근거: GShard·Switch·DeepSpeed-MoE·DeepSeek-V3·DeepEP",
        subsections: [
          { id: "paper-gshard", title: "GShard" },
          { id: "paper-switch", title: "Switch Transformers" },
          { id: "paper-deepspeed-moe", title: "DeepSpeed-MoE" },
          { id: "paper-deepseek-v3", title: "DeepSeek-V3" },
          { id: "paper-deepep", title: "DeepEP README" },
        ],
      },
    ],
    component: () => import("@/pages/articles/ai/expert-parallelism-moe-systems"),
  },
  {
    slug: "tensor-and-pipeline-parallel-inference",
    title: "Tensor, pipeline, data, context parallel 은 나누는 축이 달라 통신도 다릅니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "axes", title: "네 parallel 축이 나누는 차원과 통신" },
      { id: "tensor-parallel", title: "TP 의 column·row 분할과 layer 당 all-reduce 두 번", subsections: [{ id: "paper-megatron", title: "Megatron-LM 의 분할 근거" }] },
      { id: "collectives", title: "All-reduce·reduce-scatter·all-gather 와 α + n/B", subsections: [{ id: "paper-nccl", title: "NCCL collective 정의" }] },
      { id: "pipeline-parallel", title: "PP 의 stage·microbatch·bubble 과 latency penalty", subsections: [{ id: "paper-gpipe", title: "GPipe 의 bubble 식" }] },
      { id: "data-parallel", title: "DP replica 와 throughput scaling" },
      { id: "sequence-context-parallel", title: "Sequence·context parallel 과 ring 조건", subsections: [{ id: "paper-ring-attention", title: "Ring Attention 의 c ≥ F/B" }] },
      { id: "decode-impact", title: "Decode 에서 통신 latency 가 TPOT 에 주는 영향" },
    ],
    component: () => import("@/pages/articles/ai/tensor-and-pipeline-parallel-inference"),
  },
  {
    slug: "parallelism-strategy-and-placement",
    title: "Parallelism 전략은 통신 대 계산 비율을 topology 안에서 최소화하는 배치입니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "strategy", title: "Mesh 와 degree 배정, hybrid parallelism" },
      { id: "fabric-tiers", title: "NVSwitch 도메인과 InfiniBand 의 두 계층", subsections: [{ id: "paper-nvlink", title: "NVIDIA NVLink 사양" }] },
      { id: "placement", title: "Topology-aware shard placement 와 세 mesh 후보" },
      { id: "scaling", title: "Strong·weak scaling efficiency", subsections: [{ id: "paper-megatron-scaling", title: "Megatron-LM scaling analysis" }] },
      { id: "overlap-bottleneck", title: "통신 대 계산 비율과 overlap" },
      { id: "procedure", title: "TP·PP·DP degree 선택 절차", subsections: [{ id: "paper-vllm-parallelism", title: "vLLM parallelism 권고" }] },
    ],
    component: () => import("@/pages/articles/ai/parallelism-strategy-and-placement"),
  },
  {
    slug: "cuda-graph-capture",
    title: "CUDA Graphs: kernel launch overhead를 capture-replay로 지우기",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "Decode step의 launch overhead 문제" },
      { id: "mechanics", title: "Capture/replay 계약과 static address 제약" },
      {
        id: "graph-anatomy",
        title: "Node·edge·instantiate·update의 graph lifecycle",
        subsections: [
          { id: "stream-capture", title: "Stream capture와 cross-stream join" },
          { id: "graph-update", title: "cudaGraphExecUpdate의 topology 조건" },
        ],
      },
      { id: "graph-compatibility", title: "Graph-compatible execution과 graph pool" },
      {
        id: "implementation",
        title: "vLLM CUDAGraphWrapper의 실제 구현",
      },
      { id: "shape-padding", title: "Dynamic shape와 capture size padding" },
      {
        id: "tradeoffs",
        title: "Dynamic shape·capture 범위·memory pool trade-off",
      },
    ],
    component: () => import("@/pages/articles/ai/cuda-graph-capture"),
  },
  {
    slug: "launch-overhead-and-cpu-gpu-synchronization",
    title: "Launch overhead 는 CPU 의 고정 비용이고 GPU 는 그것을 기다리다 굶습니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "problem", title: "GPU 가 노는 이유는 CPU 가 아직 안 보내서" },
      { id: "launch-overhead", title: "Host launch overhead 와 상각" },
      { id: "submission-pipeline", title: "CPU 제출 병목과 GPU starvation" },
      { id: "sync-points", title: "동기화 지점이 pipeline 을 비우는 방식" },
      { id: "graph-replay", title: "Graph replay latency 와 warmup" },
      { id: "capture-failure", title: "Capture failure 의 세 증상과 진단" },
    ],
    component: () => import("@/pages/articles/ai/launch-overhead-and-cpu-gpu-synchronization"),
  },
];
