import type { Article } from "../types";

export const vllmServingArticles: Article[] = [
  {
    slug: "vllm-serving",
    title: "vLLM 입문: Continuous Batching부터 GPU 실행까지",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 짧은 답이 먼저 끝나면 다음 요청을 시작해야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 받고 고르고 계산하고 결과를 돌려줍니다"
  },
  {
    "id": "small-case",
    "title": "3. 한 번에 4조각, 요청은 최대 2개를 처리합니다"
  },
  {
    "id": "inside-engine",
    "title": "4. 각 요청은 읽은 위치와 남겨 둔 기록이 다릅니다"
  },
  {
    "id": "why-engine",
    "title": "5. 처리할 양과 저장할 공간을 따로 제한해야 합니다"
  },
  {
    "id": "engine-loop",
    "title": "6. 요청 교체와 기록 저장을 서로 다른 역할로 봅니다"
  },
  {
    "id": "request-trace",
    "title": "7. B가 끝난 자리에 C가 들어옵니다"
  },
  {
    "id": "scheduler-source",
    "title": "8. 원문에서 남은 양을 자르고 저장 공간을 확인합니다"
  },
  {
    "id": "latency-accounting",
    "title": "9. A의 첫 출력 45ms와 전체 65ms를 나눠 읽습니다"
  },
  {
    "id": "serving-architecture",
    "title": "10. GPU 배치와 조건을 지킨 처리량을 따로 계산합니다"
  },
  {
    "id": "serving-limits",
    "title": "11. 가능한 배치가 좋은 지연을 보장하지는 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "12. 상한과 관측값을 바꾸면 무엇이 달라질까요"
  }
],
    component: () => import("@/pages/articles/ai/vllm-serving"),
  },
  {
    slug: "serving-latency-metrics-and-slo",
    title: "TTFT·TPOT·ITL 은 분포로 읽고 SLO 는 percentile 로 계약합니다",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 첫 응답의 기다림과 도중의 멈춤을 따로 봅니다"
  },
  {
    "id": "black-box",
    "title": "2. 시각을 남기고 간격을 계산한 뒤 약속과 비교합니다"
  },
  {
    "id": "small-case",
    "title": "3. 다섯 조각이 도착한 기록부터 계산합니다"
  },
  {
    "id": "inside-measurement",
    "title": "4. 시계와 응답 개수와 집계 범위가 모두 필요합니다"
  },
  {
    "id": "why-observations",
    "title": "5. 같은 평균이라도 멈춘 순간은 다를 수 있습니다"
  },
  {
    "id": "latency-terms",
    "title": "6. 첫 도착과 각 간격과 마지막 도착에 이름을 붙입니다"
  },
  {
    "id": "metrics",
    "title": "7. 1초와 327ms를 더하고 네 간격으로 나눕니다"
  },
  {
    "id": "throughput",
    "title": "8. 서버 전체의 400토큰과 한 사람의 간격을 구분합니다"
  },
  {
    "id": "distribution",
    "title": "9. 같은 100개를 순서대로 놓으면 느린 쪽이 보입니다"
  },
  {
    "id": "source-client-events",
    "title": "10. 실제 수신 코드는 토큰 대신 이벤트를 관측합니다"
  },
  {
    "id": "paper-vllm-bench",
    "title": "11. 같은 기록을 실제 평균과 처리량 코드에 넣습니다"
  },
  {
    "id": "slo",
    "title": "12. 하루 288구간에서 세 번째 실패는 허용범위를 넘습니다"
  },
  {
    "id": "slo-procedure",
    "title": "13. 관측이 빠진 구간을 통과한 구간으로 세지 않습니다"
  },
  {
    "id": "boundary",
    "title": "14. 지표 하나가 원인이나 용량을 자동으로 결정하지는 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "15. 표본과 분모를 바꿨을 때 결과를 예상해 보세요"
  }
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
    "id": "overview",
    "title": "1. 긴 입력을 받더라도 이미 쓰던 답을 이어 가야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 진행 상태와 예산을 받아 이번 계산 목록을 만듭니다"
  },
  {
    "id": "small-case",
    "title": "3. 기존 요청에 1개씩 주면 새 입력에는 3개가 남습니다"
  },
  {
    "id": "inside-scheduler",
    "title": "4. 순서와 배정량, 저장 위치를 함께 기록합니다"
  },
  {
    "id": "why-scheduler",
    "title": "5. 처리 순서만 정해도 긴 작업의 독점은 남습니다"
  },
  {
    "id": "queue-batching",
    "title": "6. 언제 묶음을 바꾸는지와 누구를 먼저 보는지는 다릅니다"
  },
  {
    "id": "schedule-method",
    "title": "7. 5개 예산을 1·1·3으로 쓰고 결과로 위치를 바꿉니다"
  },
  {
    "id": "scheduler-source",
    "title": "8. 원문에서 12를 4로, 다시 3으로 줄이는 자리를 찾습니다"
  },
  {
    "id": "prefill-decode",
    "title": "9. 상한 4여도 12개 입력에 실제로 네 번이 필요합니다"
  },
  {
    "id": "priority-order",
    "title": "10. 작은 priority가 앞서도 공간 검사는 남습니다"
  },
  {
    "id": "scheduler-fairness",
    "title": "11. 요청 두 개와 입력 세 개가 같은 서비스를 뜻하지는 않습니다"
  },
  {
    "id": "preemption",
    "title": "12. 기록을 비운 뒤에는 실제 재사용한 양만 빼고 다시 계산합니다"
  },
  {
    "id": "scheduler-overhead",
    "title": "13. 겹친 5ms도 CPU 자원은 사용합니다"
  },
  {
    "id": "scheduler-limits",
    "title": "14. 평균 길이와 선점 횟수만으로 설정을 고르지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "15. 남은 양과 시간의 의미를 먼저 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/vllm-scheduler"),
  },
  {
    slug: "continuous-batching-step-anatomy",
    title: "Scheduling step 해부: running 먼저, 남은 token budget 은 prefill chunk 로",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 답변을 이어 쓰면서 새 질문도 받아야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 남은 일을 보고 나눠 넣은 뒤 결과를 받습니다"
  },
  {
    "id": "small-case",
    "title": "3. 여덟 자리 중 두 자리를 쓰면 여섯 자리가 남습니다"
  },
  {
    "id": "inside-step",
    "title": "4. 요청의 위치와 남은 용량을 함께 적습니다"
  },
  {
    "id": "why-two-limits",
    "title": "5. 토큰이 남아도 새 요청의 자리가 없을 수 있습니다"
  },
  {
    "id": "step-unit",
    "title": "6. 한 번의 배정을 scheduling step이라고 부릅니다"
  },
  {
    "id": "token-budget",
    "title": "7. 같은 잔액에서 A와 B를 빼고 C에 배정합니다"
  },
  {
    "id": "batch-shape",
    "title": "8. 둘째 실행에는 C를 마치고 D를 받습니다"
  },
  {
    "id": "source-running",
    "title": "9. 진행 목록을 먼저 돈다는 말의 범위를 확인합니다"
  },
  {
    "id": "source-admission",
    "title": "10. 새 요청은 저장 공간을 받은 뒤에 들어옵니다"
  },
  {
    "id": "source-output",
    "title": "11. 배정한 입력 위치 수를 실행 기록에 담습니다"
  },
  {
    "id": "progress-and-result",
    "title": "12. 계산된 위치라는 필드도 갱신 시점을 읽어야 합니다"
  },
  {
    "id": "sequence-accounting",
    "title": "13. 응답 세 개를 요구하면 생성 경로도 세 개입니다"
  },
  {
    "id": "paper-orca-iteration",
    "title": "14. Orca는 실행 한 번마다 요청을 다시 고릅니다"
  },
  {
    "id": "paper-sarathi-serve",
    "title": "15. Sarathi는 남은 예산에 입력 조각을 넣습니다"
  },
  {
    "id": "boundary",
    "title": "16. 토큰 수가 같아도 단계와 시간은 다릅니다"
  },
  {
    "id": "prediction-questions",
    "title": "17. 다음 배정을 먼저 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/continuous-batching-step-anatomy"),
  },
  {
    slug: "prefill-decode-phase-dynamics",
    title: "Prefill과 decode의 간섭: 계산·메모리 장부에서 조각 크기까지",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 긴 새 입력이 기존 답변을 얼마나 늦출지 따져 봅니다"
  },
  {
    "id": "black-box",
    "title": "2. 이번에 할 양을 고르고 함께 실행한 뒤 진행을 기록합니다"
  },
  {
    "id": "small-case",
    "title": "3. A와 B에 한 칸씩 주고 C에 네 칸을 줍니다"
  },
  {
    "id": "inside-step",
    "title": "4. 계산할 횟수와 가져올 데이터는 다른 장부입니다"
  },
  {
    "id": "why-two-resources",
    "title": "5. 더 빨리 계산해도 기다리는 데이터가 남을 수 있습니다"
  },
  {
    "id": "phase-terms",
    "title": "6. 입력 읽기와 답변 이어 쓰기에 이름을 붙입니다"
  },
  {
    "id": "request-trace",
    "title": "7. C의 20위치를 다섯 번에 걸쳐 읽습니다"
  },
  {
    "id": "mixed-model",
    "title": "8. 조각 크기에 따라 두 시간을 비교합니다"
  },
  {
    "id": "arithmetic-intensity",
    "title": "9. byte마다 필요한 연산 수로 두 한도를 비교합니다"
  },
  {
    "id": "bound-not-measurement",
    "title": "10. 하한 1.8 ms는 2 ms 목표의 통과 증거가 아닙니다"
  },
  {
    "id": "paper-roofline",
    "title": "11. 원 논문의 roof는 속도의 상한입니다"
  },
  {
    "id": "source-progress",
    "title": "12. 실제 scheduler는 남은 위치 수에서 출발합니다"
  },
  {
    "id": "source-priority",
    "title": "13. 진행 목록 먼저가 모든 decode 먼저라는 뜻은 아닙니다"
  },
  {
    "id": "source-admission",
    "title": "14. 대기 중인 C도 조각과 저장 조건을 함께 통과합니다"
  },
  {
    "id": "paper-sarathi",
    "title": "15. Sarathi는 A와 B를 먼저 담는 절차를 명시합니다"
  },
  {
    "id": "large-case",
    "title": "16. 큰 dense 사례에서도 byte 단위를 먼저 맞춥니다"
  },
  {
    "id": "chunk-attention",
    "title": "17. 조각의 뒤쪽일수록 더 많은 앞 기록을 봅니다"
  },
  {
    "id": "chunk-size",
    "title": "18. 448은 다시 측정할 후보로 고릅니다"
  },
  {
    "id": "long-context",
    "title": "19. 긴 문맥에서는 앞 위치 쌍의 계산이 커집니다"
  },
  {
    "id": "prefix-rereads",
    "title": "20. 작게 나누면 같은 앞 기록을 다시 읽습니다"
  },
  {
    "id": "paper-distserve",
    "title": "21. 두 단계를 다른 장치로 보내면 KV 전달이 생깁니다"
  },
  {
    "id": "prefill-optimization",
    "title": "22. 바꿀 대상을 실행·배정·배치 위치로 나눕니다"
  },
  {
    "id": "boundary",
    "title": "23. 이 모형의 숫자로 말할 수 있는 범위를 확인합니다"
  },
  {
    "id": "prediction-questions",
    "title": "24. 조건을 바꿔 다음 결과를 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/prefill-decode-phase-dynamics"),
  },
  {
    slug: "disaggregated-prefill-decode-serving",
    title: "Prefill·decode 분리 서빙: KV 전달부터 두 풀의 용량까지",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 읽는 일과 이어 쓰는 일을 다른 장치에 맡깁니다"
  },
  {
    "id": "black-box",
    "title": "2. 목적지를 고르고 기록을 넘긴 뒤 출력을 보냅니다"
  },
  {
    "id": "small-case",
    "title": "3. 네 자리의 기록 128바이트를 옮기는 요청입니다"
  },
  {
    "id": "handoff-map",
    "title": "4. 복사 중에는 양쪽 자리가 함께 필요합니다"
  },
  {
    "id": "why-hold",
    "title": "5. 끝났다는 신호가 없으면 안전하게 자리를 돌려줄 수 없습니다"
  },
  {
    "id": "names",
    "title": "6. 서로 다른 GPU에서 두 단계를 실행하는 것이 분리 서빙입니다"
  },
  {
    "id": "request-trace",
    "title": "7. 요청 R은 4·6·8밀리초의 서로 다른 완료를 지납니다"
  },
  {
    "id": "proxy-request",
    "title": "8. 실제 프록시는 P에 한 토큰만 요청합니다"
  },
  {
    "id": "proxy-output",
    "title": "9. 첫 출력의 주인은 응답을 보내는 코드에서 확인합니다"
  },
  {
    "id": "source-allocation",
    "title": "10. 받을 공간을 잡고 비동기 읽기가 끝나기를 기다립니다"
  },
  {
    "id": "source-finish",
    "title": "11. P의 계산 완료와 원본 반환은 다른 사건입니다"
  },
  {
    "id": "cache-reuse",
    "title": "12. D의 캐시도 재사용할 수 있고 층별 전송은 별도입니다"
  },
  {
    "id": "routing-source",
    "title": "13. SGLang의 균형 판정은 두 조건을 함께 봅니다"
  },
  {
    "id": "routing-estimate",
    "title": "14. 캐시 이득보다 대기가 크면 다른 서버가 빠릅니다"
  },
  {
    "id": "transfer-bytes",
    "title": "15. 논리 기록 크기와 실제 전송량을 먼저 구분합니다"
  },
  {
    "id": "layer-overlap",
    "title": "16. 앞 층을 먼저 보내도 전송 대기열은 남습니다"
  },
  {
    "id": "transfer-budget",
    "title": "17. 한 요청의 시간과 초당 옮길 양은 다른 조건입니다"
  },
  {
    "id": "provisioning",
    "title": "18. GPU 시간의 평균 장부에서 후보 풀 크기를 구합니다"
  },
  {
    "id": "paper-distserve",
    "title": "19. DistServe는 평균 계산 뒤 배치 후보를 실제 부하 모형으로 비교합니다"
  },
  {
    "id": "paper-mooncake",
    "title": "20. Mooncake의 저장 계층과 평가 버전을 나누어 읽습니다"
  },
  {
    "id": "heterogeneous",
    "title": "21. GPU 종류와 두 대뿐인 배포도 같은 조건으로 비교합니다"
  },
  {
    "id": "failures",
    "title": "22. 전송 실패 뒤의 재시도도 한 요청의 일부입니다"
  },
  {
    "id": "boundary",
    "title": "23. 실제 코드의 범위와 가정한 시간을 구분합니다"
  },
  {
    "id": "prediction-questions",
    "title": "24. 조건을 바꾸어 다음 결과를 예상해 보세요"
  }
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
    "id": "overview",
    "title": "1. 길이를 모르는 답의 기록을 조금씩 늘립니다"
  },
  {
    "id": "black-box",
    "title": "2. 위치 목록과 저장 공간과 계산기를 연결합니다"
  },
  {
    "id": "small-case",
    "title": "3. 35개 기록은 16칸짜리 공간 3개에 들어갑니다"
  },
  {
    "id": "inside-blocks",
    "title": "4. 순서표와 사용 중 표시를 따로 둡니다"
  },
  {
    "id": "why-blocks",
    "title": "5. 연속된 큰 빈자리와 중복 기록을 줄입니다"
  },
  {
    "id": "block-names",
    "title": "6. 기록과 주소와 소유권에 이름을 붙입니다"
  },
  {
    "id": "logical-physical-address",
    "title": "7. 38개로 늘어난 A의 위치 37을 찾아갑니다"
  },
  {
    "id": "fragmentation-kinds",
    "title": "8. 마지막 빈칸과 연속 공간 부족은 다릅니다"
  },
  {
    "id": "block-pool",
    "title": "9. A가 끝나도 B가 읽는 P7은 덮어쓰지 않습니다"
  },
  {
    "id": "sequence-forking",
    "title": "10. 공유한 마지막 block에 쓰기 전에 복사합니다"
  },
  {
    "id": "kv-cache-manager",
    "title": "11. 35에서 38은 추가 0개, 49는 추가 1개입니다"
  },
  {
    "id": "hybrid-cache-groups",
    "title": "12. 같은 16칸 계산으로 모든 모델을 재지 않습니다"
  },
  {
    "id": "prefix-caching",
    "title": "13. 같은 앞의 32 token을 다시 읽지 않습니다"
  },
  {
    "id": "prefix-sharing",
    "title": "14. 계산 생략과 저장 공간 절약을 각각 셉니다"
  },
  {
    "id": "cache-locality",
    "title": "15. 반복 입력이 같은 저장소에 남아 있어야 합니다"
  },
  {
    "id": "paper-pagedattention",
    "title": "16. 원 논문의 범위와 현재 구현을 연결합니다"
  },
  {
    "id": "memory-kernel-boundary",
    "title": "17. 주소가 맞아도 내용과 수명이 틀리면 실패합니다"
  },
  {
    "id": "prediction-questions",
    "title": "18. 같은 사례에서 다음 값을 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/vllm-paged-attention"),
  },
  {
    slug: "serving-memory-admission-and-preemption",
    title: "KV admission은 watermark 아래서만 받고 부족하면 recompute·swap으로 비웁니다",
    subcategory: "ai-llm-serving",
    sections: [
  {
    "id": "overview",
    "title": "1. 처음 들어갔던 요청도 나중에는 자리를 잃을 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 들어갈 공간을 확인하고 성장한 만큼 다시 확인합니다"
  },
  {
    "id": "small-case",
    "title": "3. 40칸 중 14칸이 비어 있고 C가 9칸을 원합니다"
  },
  {
    "id": "inside-admission",
    "title": "4. 공간 장부와 대기 목록이 서로 다른 일을 합니다"
  },
  {
    "id": "why-headroom",
    "title": "5. 남겨 둔 3칸은 다음 성장을 위한 여유입니다"
  },
  {
    "id": "memory-terms",
    "title": "6. 보관 공간과 수용 판정에 이름을 붙입니다"
  },
  {
    "id": "watermark-admission",
    "title": "7. C를 받으면 빈 공간이 14에서 5로 줄어듭니다"
  },
  {
    "id": "growth-pressure",
    "title": "8. 16번 더 이어 쓰면 다음 한 칸이 부족합니다"
  },
  {
    "id": "resume-trace",
    "title": "9. C는 10칸을 돌려줬지만 11칸이 있어야 돌아옵니다"
  },
  {
    "id": "footprint",
    "title": "10. 한 block의 2MiB는 모델의 저장 모양에서 나옵니다"
  },
  {
    "id": "source-v0-admission",
    "title": "11. 과거 코드의 세 판정에 C를 넣어 봅니다"
  },
  {
    "id": "pool-budget",
    "title": "12. 54GiB를 block 수로 바꾼 뒤 같은 판정을 합니다"
  },
  {
    "id": "source-v1-admission",
    "title": "13. 현재 코드는 전체 입력 검사와 조각 할당을 나눕니다"
  },
  {
    "id": "preemption-modes",
    "title": "14. 버리고 다시 계산할지 복사해 둘지 선택합니다"
  },
  {
    "id": "source-v1-preemption",
    "title": "15. C의 진행 상태를 0으로 되돌리는 코드를 읽습니다"
  },
  {
    "id": "source-v0-swap",
    "title": "16. CPU 공간 실패를 다른 방식으로 바꿔 읽지 않습니다"
  },
  {
    "id": "recovery-cost",
    "title": "17. 계산 시간과 왕복 전송 시간을 같은 요청으로 비교합니다"
  },
  {
    "id": "hybrid-fixed-state",
    "title": "18. 길이가 짧아도 처음부터 필요한 상태가 있습니다"
  },
  {
    "id": "paper-vllm",
    "title": "19. 논문의 복구 정책은 그 실험과 함께 읽습니다"
  },
  {
    "id": "engine-settings",
    "title": "20. SGLang은 수용의 보수성을 따로 조절합니다"
  },
  {
    "id": "engine-pool-sizing",
    "title": "21. 메모리 비율의 분모가 다르면 용량도 달라집니다"
  },
  {
    "id": "boundary",
    "title": "22. 수용에 성공해도 끝까지의 여유를 보장하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "23. 조건을 바꾸면 다음 판정은 어떻게 될까요"
  }
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
  {
    "id": "overview",
    "title": "1. 앞에서 계산한 결과를 남겨 답변을 이어 씁니다"
  },
  {
    "id": "black-box",
    "title": "2. 새 위치 하나와 과거 기록을 받아 다음 계산으로 넘깁니다"
  },
  {
    "id": "small-case",
    "title": "3. 세 위치의 기록 48byte에 한 위치를 더합니다"
  },
  {
    "id": "inside-cache",
    "title": "4. 현재 질문과 남길 기록의 수명을 나눕니다"
  },
  {
    "id": "why-cache",
    "title": "5. 과거 질문은 다음 위치에서 다시 쓰지 않습니다"
  },
  {
    "id": "kv-shape",
    "title": "6. 조회와 기록에 Q·K·V라는 이름을 붙입니다"
  },
  {
    "id": "request-trace",
    "title": "7. 새 K와 V를 먼저 붙이고 네 위치를 읽습니다"
  },
  {
    "id": "attention-read",
    "title": "8. 같은 네 기록에서 출력 (2.5, 5)를 얻습니다"
  },
  {
    "id": "kv-shape-sharing",
    "title": "9. Q 4개를 유지하며 기록을 4·2·1벌로 나눕니다"
  },
  {
    "id": "shape-layout",
    "title": "10. 현재 Q의 길이 1과 저장 K/V의 길이 4를 구분합니다"
  },
  {
    "id": "source-repeat-kv",
    "title": "11. 실제 repeat_kv는 0·0·1·1 순서로 짝지웁니다"
  },
  {
    "id": "source-cache-update",
    "title": "12. 실제 DynamicLayer는 위치 축에 새 기록을 잇습니다"
  },
  {
    "id": "paper-mqa",
    "title": "13. MQA 원문은 K/V의 head 축을 없앱니다"
  },
  {
    "id": "paper-gqa",
    "title": "14. GQA 원문은 묶음별 평균 뒤 다시 학습합니다"
  },
  {
    "id": "kv-shape-formula",
    "title": "15. 같은 셈을 모든 층에 더해 토큰당 byte를 구합니다"
  },
  {
    "id": "model-configs",
    "title": "16. 실제 설정에서 KV를 남기는 층을 셉니다"
  },
  {
    "id": "kv-shape-runtime",
    "title": "17. Gemma는 local과 global의 폭을 따로 셉니다"
  },
  {
    "id": "cache-representation-design",
    "title": "18. 같은 기록을 더 작은 공통 숫자로 나타낼 수 있습니다"
  },
  {
    "id": "mla-vs-gqa",
    "title": "19. MLA는 매번 전체 K/V를 펼치지 않아도 됩니다"
  },
  {
    "id": "position-key",
    "title": "20. 위치 회전용 기록은 별도 경로에 남습니다"
  },
  {
    "id": "parallel-budget",
    "title": "21. GPU 한 장의 저장량과 모델 전체를 구분합니다"
  },
  {
    "id": "capacity-bandwidth",
    "title": "22. 저장량이 4분의 1이어도 전체 시간은 따로 계산합니다"
  },
  {
    "id": "boundary",
    "title": "23. 재사용 조건과 실제 할당을 확인합니다"
  },
  {
    "id": "prediction-questions",
    "title": "24. 값을 바꾸기 전에 다음 결과를 예상해 보세요"
  }
],
    component: () => import("@/pages/articles/ai/kv-cache-fundamentals"),
  },
  {
    slug: "flash-attention-io-aware-kernel",
    title: "FlashAttention 은 online softmax 로 attention 행렬을 HBM 에 쓰지 않습니다",
    subcategory: "ai-llm-serving",
    sections: [
      {
            "id": "overview",
            "title": "1 · 같은 답을 더 적은 왕복으로 구한다"
      },
      {
            "id": "black-box",
            "title": "2 · 점수와 값을 받아 가중평균을 돌려준다"
      },
      {
            "id": "case",
            "title": "3 · 네 항을 한 번에 계산하면 7.376113이다"
      },
      {
            "id": "picture",
            "title": "4 · 조각을 버리고 기준값과 두 합만 남긴다"
      },
      {
            "id": "need",
            "title": "5 · 계산보다 중간 행렬의 왕복이 커질 수 있다"
      },
      {
            "id": "names",
            "title": "6 · FlashAttention은 attention 행렬의 저장을 피하는 구현이다"
      },
      {
            "id": "mechanism",
            "title": "7 · 옛 합의 기준을 옮기면 중간 행렬이 필요 없다"
      },
      {
            "id": "source",
            "title": "8 · 공식 코드의 row_scale에 e⁻²를 넣는다"
      },
      {
            "id": "comparison",
            "title": "9 · FA4는 지수 계산과 온칩 이동도 함께 겹친다"
      },
      {
            "id": "limits",
            "title": "10 · 같은 shape와 오차 기준으로 시간을 재야 한다"
      }
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
    slug: "qwen38-flash-next-architecture",
    title: "Qwen3.8-Flash-Next는 선형과 희소 attention을 층마다 나눠 씁니다",
    subcategory: "ai-llm-serving",
    sections: [
      { id: "overview", title: "48층을 선형 36개와 희소 12개로 나눕니다" },
      {
        id: "qsa-index",
        title: "희소 attention은 블록을 먼저 고르고 원본을 읽습니다",
        subsections: [
          { id: "qsa-budget", title: "2048 토큰 예산이 자리 2051개를 잡는 이유" },
          { id: "paper-native-sparse-attention", title: "선행 논문이 물려준 아이디어" },
        ],
      },
      {
        id: "gated-residual",
        title: "층 사이를 잇는 통로가 네 갈래로 늘어납니다",
        subsections: [{ id: "paper-hyper-connections", title: "Hyper-Connections가 보인 것" }],
      },
      { id: "ple-ngram", title: "n-gram 임베딩은 한 층에만 붙고 표는 51B입니다" },
      { id: "param-classes", title: "125B와 51B와 6B는 서로 다른 회계입니다" },
      { id: "request-state", title: "요청 하나가 남기는 상태는 세 종류입니다" },
    ],
    component: () => import("@/pages/articles/ai/qwen38-flash-next-architecture"),
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
      {
            "id": "overview",
            "title": "1 · 선택한 계산기가 다른 GPU에 있으면 입력을 옮겨야 한다"
      },
      {
            "id": "black-box",
            "title": "2 · 입력·expert 번호·가중치를 받아 결합 결과를 돌려준다"
      },
      {
            "id": "case",
            "title": "3 · token 37은 8192바이트를 두 곳에 보낸다"
      },
      {
            "id": "picture",
            "title": "4 · 입력을 보내고 결과를 원래 위치로 돌려놓는다"
      },
      {
            "id": "need",
            "title": "5 · weight를 나눈 절약과 token 이동을 함께 계산한다"
      },
      {
            "id": "names",
            "title": "6 · Expert parallelism은 expert의 배치 축을 나눈다"
      },
      {
            "id": "mechanism",
            "title": "7 · 평균 바이트와 가장 늦은 GPU를 함께 본다"
      },
      {
            "id": "source",
            "title": "8 · EPBuffer는 배정 결과와 유효 수신 범위를 함께 전달한다"
      },
      {
            "id": "comparison",
            "title": "9 · 전송 공유와 expert 복제는 서로 다른 비용을 바꾼다"
      },
      {
            "id": "limits",
            "title": "10 · 작은 decode에서는 고정 지연이 남는다"
      }
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
