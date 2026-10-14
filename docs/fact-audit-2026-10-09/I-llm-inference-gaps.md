# I. LLM 추론 시스템 설계 영상과 대조한 공백 보강 (2026-10-14)

사용자 요청: 붙여 넣은 "LLM Inference" 시스템 설계 영상 대본을 보고 "블로그 내용중에 빠지거나 부족한 부분있으면 채워줘". 재작성은 teach-system, 사실은 1차 자료를 직접 열어 확인한 것만 쓴다.

## 1. 영상 주제 21개 대비 현재 블로그 (탐색 결과 요약)
이미 전용 절이 있는 주제(손대지 않음): prefill/decode 자원 차이, KV cache·MHA/GQA/MQA, 연속 배칭, PagedAttention·block table, scheduler loop, prefix caching 구조, speculative decoding, grammar 제약 decoding, TP/PP/EP, chunked prefill, worker 장애와 stream 손실, P/D 분리(DistServe·Splitwise·Mooncake), 서빙 경로(edge→gateway→cluster→pod), GPU와 CPU의 transistor 배분(`gpu/gpu-architecture` Overview, 탐색 에이전트가 놓쳤다가 직접 확인).

공백으로 판정해 이번에 채운 것:

| # | 공백 | 둔 곳 |
|---|---|---|
| 2·20 | 모델 등급별 GPU 수, 큰 등급이 fleet 대부분을 먹는 이유, 트래픽 10% 이동의 효과, 정밀도(FP8)를 같은 모델의 다른 가격 등급으로 쓰는 판단과 품질 관문 | `ai/inference-cost-and-capacity-planning` 새 절 `#tier-mix` |
| 19c | 목표 utilization 안에 clock 저하(전력·온도) 여유가 들어가는가 | 같은 글 `#capacity`의 접힘 |
| 4·16 | 128K 긴 문맥 요청이 공유 KV pool을 잠식하는 숫자, 등급별 상한·전용 pool, 우선순위로 희생자 고르기 | `ai/serving-memory-admission-and-preemption` 새 7단계 절 `#long-context-isolation` |
| 13 | gateway가 요청을 받을 때 최대 token으로 한도를 잡고 끝난 뒤 정산하는 구조 | `ai/rate-limiting-and-reliability-patterns` 새 절 `#token-reservation` |
| 14·19d | 대화형과 일괄 작업의 등급, 포화 때 버리는 순서(일괄 → 작은 모델로 낮춤 → 거절) | 같은 글 `#load-shedding-and-admission` 보강 |
| 12·19b | 요청마다 한 번 고르는 선택기와 step마다 고르는 엔진 scheduler의 분리, prefix hash 경로, tokenizer 불일치가 캐시 예측과 과금을 어긋나게 하는 이유 | `ai/onprem-k8s-inference-platform` 새 절 `#two-level-scheduling` |
| 8 | 제공자가 cache 읽기 token을 싸게 받을 수 있는 이유와 쓰기 할증 | `ai/prefix-caching-radix-attention` 새 7단계 절 `#cache-pricing` |

영상 수치 중 출처가 없는 것(44,000 GPU·$127M/월·85% 목표·10,000 GPU 이상에서만 분리가 이득 등)은 쓰지 않았다. 등급 계산은 이 글의 가정값으로 다시 세었다.

## 2. 1차 자료와 확인한 문장

| 자료 | 확인한 내용 (원문) | 쓰는 곳 |
|---|---|---|
| Llama 3 Herd of Models, arXiv 2407.21783 Table 3 | 70B: Layers 80, Model Dimension 8192, Attention Heads 64, Key/Value Heads 8 / 405B: 126, 16,384, 128, 8 / FFN 28,672·53,248 | KV 320KiB/token(70B), 405B weight 계산 |
| 같은 논문 §6.1 | "When using a BF16 number representation for the model parameters, Llama 3 405B does not fit in the GPU memory of a single machine with 8 Nvidia H100 GPUs. To address this issue, we parallelize model inference using BF16 precision across 16 GPUs on two machines." | 큰 등급 16 GPU |
| 같은 논문 §6.2 | FFN 대부분만 FP8, self-attention 매개변수와 첫·마지막 layer는 양자화하지 않음. "Evaluations on standard benchmarks often suggest that FP8 inference performs on par with BF16 inference even without these mitigations. However, we find that such benchmarks do not adequately reflect the effects of FP8 quantization." 100,000 응답의 reward 분포로 비교. FP8은 two-machine BF16 대비 "throughput improvements of up to 50% during the pre-fill stage" | 정밀도 등급과 품질 관문 |
| Together AI blog 2024-07-18 "Together Inference Engine 2.0 with new Turbo and Lite endpoints" | Turbo = FP8, Lite = INT4 포함 최적화, Reference = FP16. "on 4xH100 GPUs Together Turbo consistently achieves decoding throughput that is within 8% of Together Reference endpoints running on 8xH100 GPUs — a 2X reduction in costs." | 정밀도를 가격 등급으로 판매한 실례 (회사 자체 수치) |
| NVML `nvml.h` (NVIDIA/nvidia-settings main df684ed9, 2026-09-09) | SwPowerCap "The clocks have been optimized to ensure not to exceed currently set power limits", HW Slowdown "(reducing the core clocks by a factor of 2 or more)" 원인에 temperature·power brake, SW Thermal Slowdown "Current GPU temperature does not exceed GPU Max Operating Temperature" | clock 저하 접힘 |
| Azure OpenAI quota 문서 (Microsoft Learn, ms.date 2026-05-04) | "TPM rate limits are based on the maximum number of tokens that are estimated to be processed by a request at the time the request is received. It isn't the same as the token count used for billing, which is computed after all processing is completed." 추정에 Prompt text and count · max_tokens · best_of 포함, 분마다 reset되는 누적 counter, 240,000 TPM 예 | token 예약 절 |
| llm-d-router 907c5fe8 (2026-10-13) `apix/v1/inferenceobjective_types.go` | Priority: "The higher the value, the more critical the request is; negative values _are_ allowed." "flow control will _always_ allow requests of higher priority to be served first. Fairness is only enforced and tracked between requests of the same priority." | 등급·버리는 순서 |
| 같은 저장소 `pkg/epp/util/request/sheddable.go`, `pkg/epp/requestcontrol/admission.go` | `IsSheddable(priority) = priority < 0`; saturation ≥ 1.0이면 "system saturated, sheddable request dropped"; "Non-sheddable requests always bypass the saturation check." | 같은 곳 |
| 같은 저장소 `apix/config/v1/endpointpickerconfig_types.go` | EnableEviction: "When higher-priority requests are blocked by pool saturation, lower-priority in-flight requests (priority < 0) may be terminated to reclaim capacity." Defaults to false | 같은 곳 |
| 같은 저장소 `scorer/contextlengthaware/README.md` | "Direct long-context requests to specialized high-memory pods.", pod label `llm-d.ai/context-length-range: "0-2048"`, enableFiltering 기본 false | 긴 문맥 전용 pool |
| 같은 저장소 `dataproducer/approximateprefix/README.md`, `prefixhash/hashing.go` 103–129행 | token ID를 고정 크기 block으로 hash, 기본·최소 64 token, 선택된 endpoint를 index에 기록. "Block i's hash is xxhash over its content hash and block i-1's hash ... block 0 chains from a seed hashed over the target model and cache salt." token producer가 없으면 tokenizer 없는 `estimate` backend 자동 생성 | 2단 scheduling 절 |
| vLLM v0.27.1 (6e448d0e) `vllm/config/scheduler.py` 104–105행 | "priority" means requests are handled based on given priority (lower value means earlier handling) | 희생자 선택 |
| 같은 commit `vllm/v1/core/sched/scheduler.py` 586–596행 | allocate 실패 시 PRIORITY 정책이면 `max(self.running, key=lambda r: (r.priority, r.arrival_time))`를 선점. 이 파일에 tenant 단위 block 상한은 없음(grep) | 희생자 선택 |
| OpenAI prompt caching guide (developers.openai.com) | routing은 "Current machine load and available capacity", "A hash of the initial tokens after the hidden OpenAI content", prompt_cache_key에 따름. "Cached states live on individual machines, where traffic above 15 requests per minute can lead to overflow routing." cache write 1.25×, read 0.1×(GPT-5.6 이후 대부분), "discounted up to 95%" | 2단 scheduling·cache 가격 |
| Anthropic prompt caching 문서 (platform.claude.com) | "5-minute cache write tokens are 1.25 times the base input tokens price", "1-hour cache write tokens are 2 times", "Cache read tokens are 0.1 times the base input tokens price" | cache 가격 |

## 3. 이 글이 직접 센 값 (본문에 "직접 계산"으로 표시)
- 70B KV: 2(K·V)×80 layer×8 KV head×128 차원×2 byte = 327,680 byte = 320KiB/token. 131,072 token이면 40GiB(42.9GB). MHA였다면 head 64개라 8배.
- 405B 혼합 정밀도 weight: FFN이 layer 매개변수의 82%, 첫·마지막 layer를 뺀 124층 FFN만 1 byte로 두면 약 487GB(BF16 전체 약 812GB). 8×80GB=640GB 안에 들어간다. 논문은 이 GB를 적지 않았다.
- 등급 계산(가정값): 8B 1 GPU 5,000 tok/s, 70B TP2 1,800 tok/s, 405B BF16 16 GPU 1,000 tok/s, u=0.7, 각 100,000 tok/s → 29+160+2,288=2,477 GPU, 큰 등급 92.4%. 30,000 tok/s를 70B로 옮기면 1,837 GPU(−640, $2/GPU-h 가정으로 월 $921,600). 405B를 FP8 8 GPU로 같은 replica 처리량이라 두면 2,288→1,144.
- 긴 문맥 잠식: 앞 절의 128KiB/token·2MiB block·27,648 block pool에서 128K 요청 = 8,192 block(29.6%). 셋이면 3,072 block 남아 1,500 token까지 크는 짧은 요청(94 block)은 294개 → 32개. 긴 등급 상한 1개면 206개. 짧은 pool의 max_model_len 32,768이면 요청 하나 최대 2,048 block(7.4%).
- Azure 예: 240,000 TPM에 prompt 1,000 + max_tokens 4,000 → 요청마다 5,000, 분당 48건. 실제 출력 200이면 과금 1,200 × 48 = 57,600(24%). max_tokens 300이면 1,300 → 184건.

## 공용 파일 수정 목록
old는 2026-10-14 현재 각 파일에서 한 번만 나온다.

### `src/content/article-evidence.ts`
```old
    { kind: "공식 규격", label: "MLCommons · MLPerf Inference Datacenter power", href: "https://mlcommons.org/benchmarks/inference-datacenter/", note: "System 전체 AC 전력을 벽에서 재는 performance per watt 측정 기준의 근거" },
```
```new
    { kind: "공식 규격", label: "MLCommons · MLPerf Inference Datacenter power", href: "https://mlcommons.org/benchmarks/inference-datacenter/", note: "System 전체 AC 전력을 벽에서 재는 performance per watt 측정 기준의 근거" },
    { kind: "핵심 논문", label: "The Llama 3 Herd of Models (arXiv 2407.21783) · Table 3, §6.1, §6.2", href: "https://arxiv.org/abs/2407.21783", note: "2026-10-14 원문 확인. 405B BF16은 H100 8장 서버 한 대에 들어가지 않아 두 서버 16장, FFN 대부분만 FP8, benchmark 대신 응답 100,000개 reward 분포 비교, prefill 처리량 최대 50% 향상. 혼합 정밀도 487GB는 본문이 Table 3로 직접 센 값" },
    { kind: "공식 문서", label: "Together AI · Together Inference Engine 2.0 with Turbo and Lite endpoints (2024-07-18)", href: "https://www.together.ai/blog/together-inference-engine-2", note: "2026-10-14 원문 확인. FP16 Reference·FP8 Turbo·INT4 포함 Lite 등급, H100 4장 Turbo가 8장 Reference 대비 decode 처리량 8% 안. 회사 자체 측정" },
    { kind: "공식 문서", label: "NVIDIA · NVML nvml.h clocks event reasons (NVIDIA/nvidia-settings df684ed9)", href: "https://github.com/NVIDIA/nvidia-settings/blob/main/src/nvml.h", note: "2026-10-14 원문 확인. SW power cap, SW thermal slowdown, core clock을 절반 이하로 내리는 HW slowdown·HW thermal slowdown의 정의" },
```

### `src/content/article-evidence.ts`
```old
      "note": "2026-10-04 확인. free100MiB×0.9 vs token80MiB chooses80MiB; host byte capacity"
    },
  ],
  "ai/inference-runtime-anatomy": [
```
```new
      "note": "2026-10-04 확인. free100MiB×0.9 vs token80MiB chooses80MiB; host byte capacity"
    },
    {
      "kind": "핵심 논문",
      "label": "Long-context isolation — The Llama 3 Herd of Models Table 3",
      "href": "https://arxiv.org/abs/2407.21783",
      "note": "2026-10-14 확인. 70B 80층·KV head 8·head 차원 128(8192/64)로 토큰당 KV 320KiB, 131,072토큰 40GiB는 본문 직접 계산"
    },
    {
      "kind": "공식 문서",
      "label": "Long-context isolation — llm-d-router context-length-aware scorer (907c5fe8)",
      "href": "https://github.com/llm-d/llm-d-router/tree/907c5fe84769a8f8e80ece112fd419dc6313453e/pkg/epp/framework/plugins/scheduling/scorer/contextlengthaware",
      "note": "2026-10-14 확인. pod label 길이 범위로 점수, 긴 문맥 요청을 고용량 pod로, enableFiltering 기본 false. vLLM v0.27.1 scheduler.py에는 tenant·등급별 block 상한이 없고 priority 정책은 (priority, arrival)이 가장 큰 요청을 선점"
    },
  ],
  "ai/inference-runtime-anatomy": [
```

### `src/content/article-evidence.ts`
```old
    { kind: "공식 문서", label: "nginx · ngx_http_limit_req_module", href: "https://nginx.org/en/docs/http/ngx_http_limit_req_module.html", note: "leaky bucket rate limiting의 rate·burst 파라미터 근거" },
  ],
  "ai/robot-action-representations": [
```
```new
    { kind: "공식 문서", label: "nginx · ngx_http_limit_req_module", href: "https://nginx.org/en/docs/http/ngx_http_limit_req_module.html", note: "leaky bucket rate limiting의 rate·burst 파라미터 근거" },
    { kind: "공식 문서", label: "Microsoft Learn · Azure OpenAI quota · Understanding rate limits (2026-05-04)", href: "https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/quota", note: "2026-10-14 원문 확인. TPM 한도는 받는 시점의 추정 최대 token(prompt·max_tokens·best_of)으로, 과금 token과 다르며 분마다 reset되는 counter. 끝난 뒤 정산은 본문이 제안하는 설계" },
    { kind: "공식 문서", label: "llm-d-router · InferenceObjective priority와 sheddable admission (907c5fe8)", href: "https://github.com/llm-d/llm-d-router/blob/907c5fe84769a8f8e80ece112fd419dc6313453e/apix/v1/inferenceobjective_types.go", note: "2026-10-14 원문 확인. 클수록 중요·음수 허용, 높은 priority 먼저·같은 priority 안에서만 공정성, priority<0은 포화도 1.0 이상에서 거절, EnableEviction 기본 false" },
  ],
  "ai/robot-action-representations": [
```

### `src/content/article-evidence.ts`
```old
      note: "파드 묶음을 복제 단위로 다루는 API, 대표·작업자 이중 템플릿, 토폴로지 배치와 전체 재생성, 그룹 단위 갱신의 출처 (2026-09-11 확인)",
    },
  ],
  "ai/generative-measurement-controls": [
```
```new
      note: "파드 묶음을 복제 단위로 다루는 API, 대표·작업자 이중 템플릿, 토폴로지 배치와 전체 재생성, 그룹 단위 갱신의 출처 (2026-09-11 확인)",
    },
    {
      kind: "공식 문서",
      label: "llm-d-router — approximate prefix producer와 prefixhash/hashing.go (907c5fe8)",
      href: "https://github.com/llm-d/llm-d-router/blob/907c5fe84769a8f8e80ece112fd419dc6313453e/pkg/epp/framework/plugins/requestcontrol/dataproducer/prefixhash/hashing.go",
      note: "token ID를 기본·최소 64 token block으로 나눠 앞 block hash와 사슬로 묶는 hash, 모델 이름·cache salt seed, 선택 뒤 index 기록, token producer가 없으면 estimate backend 자동 생성 (2026-10-14 확인)",
    },
    {
      kind: "공식 문서",
      label: "OpenAI API docs — Prompt caching",
      href: "https://developers.openai.com/api/docs/guides/prompt-caching",
      note: "routing이 machine 부하·처음 token들의 hash·prompt_cache_key에 따르고, 분당 15건을 넘으면 다른 machine으로 넘칠 수 있다는 설명 (2026-10-14 확인)",
    },
  ],
  "ai/generative-measurement-controls": [
```

### `src/content/article-evidence.ts`
```old
      "note": "offline 상한과 의사코드를 현재 구현과 구별하고 자기보고 성능은 당시 workload로 한정합니다."
    }
  ],
  "ai/speculative-decoding-variants": [
```
```new
      "note": "offline 상한과 의사코드를 현재 구현과 구별하고 자기보고 성능은 당시 workload로 한정합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Anthropic — Prompt caching · Pricing",
      "href": "https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching",
      "note": "2026-10-14 확인. 5분 cache 쓰기 1.25배, 1시간 쓰기 2배, 읽기 0.1배(모델별 예외는 표 각주). 배수의 이유는 문서에 없고 본문 해석은 가정으로 표시"
    },
    {
      "kind": "공식 문서",
      "label": "OpenAI API docs — Prompt caching",
      "href": "https://developers.openai.com/api/docs/guides/prompt-caching",
      "note": "2026-10-14 확인. 최대 95% 할인, GPT-5.6 이후 쓰기 1.25배·읽기 0.1배, 한 번 쓰고 한 번 읽으면 1.35배 대 2배, machine당 분당 15건 초과 시 overflow"
    }
  ],
  "ai/speculative-decoding-variants": [
```

### `src/content/article-learning.ts`
```old
        notClaim: "TDP 나 GPU 단독 전력으로 계산한 performance per watt 가 MLPerf Power 와 같은 값이라는 뜻은 아닙니다.",
        sectionId: "paper-mlperf-power",
      },
    ],
  },
```
```new
        notClaim: "TDP 나 GPU 단독 전력으로 계산한 performance per watt 가 MLPerf Power 와 같은 값이라는 뜻은 아닙니다.",
        sectionId: "paper-mlperf-power",
      },
      {
        title: "The Llama 3 Herd of Models — §6 Inference",
        href: "https://arxiv.org/abs/2407.21783",
        problem: "405B를 BF16으로 올리면 H100 8장 서버 한 대에 들어가지 않아 두 서버 16장이 필요한 문제",
        contribution: "FFN 대부분을 FP8로 바꾸고 첫·마지막 layer와 attention은 BF16으로 남긴 추론을 두 서버 BF16과 비교해 prefill 처리량 최대 50% 향상을 보고하고, 표준 benchmark 대신 응답 100,000개의 reward 분포로 품질을 비교합니다.",
        assumptions: "H100의 FP8 지원과 row-wise·상한 있는 dynamic scaling을 전제로 한 Meta의 구현입니다.",
        evidenceScope: "4,096 입력·256 출력 조건의 처리량 비교와 reward 분포이며, 본문의 487GB는 Table 3로 직접 센 값입니다.",
        notClaim: "어느 모델이든 FP8로 바꾸면 품질이 같다거나 replica 처리량이 특정 배수로 오른다는 뜻은 아닙니다.",
        sectionId: "paper-llama3-inference",
      },
      {
        title: "Together AI — Turbo·Lite endpoints (2024-07-18)",
        href: "https://www.together.ai/blog/together-inference-engine-2",
        problem: "같은 모델을 정밀도별로 다른 가격 등급으로 제공할 수 있는가의 문제",
        contribution: "FP16 Reference, FP8 Turbo, INT4 양자화를 포함한 Lite를 나란히 내놓고 H100 4장 Turbo가 8장 Reference 대비 decode 처리량 8% 안이라고 밝힙니다.",
        assumptions: "Together 자체 inference engine과 Llama 3 모델입니다.",
        evidenceScope: "회사가 직접 잰 값이며 독립 검증이 아닙니다.",
        notClaim: "다른 엔진이나 workload에서 같은 비용 절감이 난다는 뜻은 아닙니다.",
        sectionId: "paper-together-turbo",
      },
      {
        title: "NVIDIA NVML — clocks event reasons",
        href: "https://github.com/NVIDIA/nvidia-settings/blob/main/src/nvml.h",
        problem: "GPU가 전력·온도 한도에서 clock을 낮출 때 그 이유를 구별하는 문제",
        contribution: "SW power cap, SW thermal slowdown, core clock을 절반 이하로 내리는 HW slowdown·HW thermal slowdown을 별도 사유 bit로 정의합니다.",
        assumptions: "NVML을 지원하는 NVIDIA datacenter GPU와 driver입니다.",
        evidenceScope: "header 주석의 정의이며 처리량 저하 폭은 다루지 않습니다.",
        notClaim: "목표 utilization 0.7이 clock 저하를 흡수한다는 뜻은 아닙니다.",
        sectionId: "paper-nvml-clock-reasons",
      },
    ],
  },
```

### `src/content/article-learning.ts`
```old
      { level: "basic", question: "같은 model 을 2 장 TP 로 올려 1,800 tokens/s 가 나올 때 token per GPU-second 와 cost/token 의 변화를 쓰세요.", answerChecklist: ["900 tokens/GPU-s", "시간당 $4", "$0.62/M", "약 10 % 상승"], requiredConcepts: ["gpu-hour-throughput-unit", "inference-cost-per-token"], sectionId: "cost" },
```
```new
      { level: "basic", question: "8B(1장, 5,000 tokens/s)·70B(2장, 1,800)·405B(16장, 1,000) 등급이 각각 100,000 tokens/s를 받을 때 목표 utilization 0.7에서 등급별 GPU 수와 405B 비중을 계산하세요.", answerChecklist: ["29 replica 29장", "80 replica 160장", "143 replica 2,288장", "합 2,477장", "405B 92.4%", "token당 GPU-시간 80배"], requiredConcepts: ["capacity-planning-peak-headroom", "gpu-hour-throughput-unit"], sectionId: "tier-mix" },
```

### `src/content/article-learning.ts`
```old
      { level: "advanced", question: "70B fp16 model 의 수요가 3 배로 늘 때 scale-up 과 scale-out 을 어떻게 조합할지 memory·통신·routing 관점에서 설계하세요.", answerChecklist: ["140 GB → TP 2 필수", "TP 늘리면 all-reduce 손실", "replica 복제로 선형 증가", "weight 사본 중복", "prefix routing·load balancer", "token per GPU-second 비교"], requiredConcepts: ["scale-up-vs-scale-out", "gpu-hour-throughput-unit"], sectionId: "scaling" },
```
```new
      { level: "advanced", question: "앞 문제의 fleet에서 405B GPU를 줄이는 세 손잡이(트래픽 10%를 70B로 이동, 405B 처리량 10% 향상, FP8로 서버 한 대 8장)를 계산으로 비교하고 각각의 전제를 쓰세요.", answerChecklist: ["이동 시 1,837장 640장 감소", "처리량 10%면 130 replica 208장 감소", "FP8 8장이면 1,144장", "옮긴 요청의 품질 기준", "혼합 정밀도 약 487GB 640GB 안", "reward 분포 비교 관문"], requiredConcepts: ["capacity-planning-peak-headroom", "scale-up-vs-scale-out"], sectionId: "tier-mix" },
```

### `src/content/article-learning.ts`
```old
      { level: "basic", question: "Request rate limit과 token rate limit 중 LLM 서비스에서 실제 부하를 더 정확히 반영하는 것이 무엇이고 왜인지 설명하세요.", answerChecklist: ["token rate limit", "요청마다 token 수가 크게 다르기 때문"], requiredConcepts: ["rate-limiting-algorithms"], sectionId: "rate-limiting-algorithms" },
```
```new
      { level: "basic", question: "분당 240,000 token 한도에서 prompt 1,000·max_tokens 4,000·실제 출력 200인 요청을 받을 때, 받는 시점 추정으로 막는 경우와 끝난 뒤 정산하는 경우의 분당 건수를 비교하세요.", answerChecklist: ["요청마다 5,000으로 잡음", "분당 48건", "실제 사용 57,600 한도의 24%", "정산하면 진행 중 몫만 최대치", "약 187건", "과금은 끝난 뒤 usage"], requiredConcepts: ["rate-limiting-algorithms"], sectionId: "token-reservation" },
```

### `src/content/article-learning.ts`
```old
        notClaim: "이 글의 leaky bucket 설명은 이 모듈의 정확한 내부 구현이 아니라 rate·burst 개념을 일반화한 것입니다.",
        sectionId: "rate-limiting-algorithms",
      },
    ],
  },
```
```new
        notClaim: "이 글의 leaky bucket 설명은 이 모듈의 정확한 내부 구현이 아니라 rate·burst 개념을 일반화한 것입니다.",
        sectionId: "rate-limiting-algorithms",
      },
      {
        title: "Azure OpenAI quota — Understanding rate limits",
        href: "https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/quota",
        problem: "출력 token 수를 모르는 도착 시점에 token 한도를 어떻게 검사하는가의 문제",
        contribution: "받는 시점에 prompt·max_tokens·best_of로 추정한 최대 token을 분마다 reset되는 counter에 더해 TPM 한도를 검사하고, 이 값이 끝난 뒤의 과금 token과 다르다고 명시합니다.",
        assumptions: "Azure OpenAI Standard 배포의 rate limit이며 PTU는 다르게 계산합니다.",
        evidenceScope: "2026-05-04 기준 공식 문서입니다.",
        notClaim: "끝난 뒤 남은 예약을 돌려준다는 설명은 이 문서에 없고 본문의 정산은 제안한 설계입니다.",
        sectionId: "paper-azure-openai-tpm",
      },
      {
        title: "llm-d-router — InferenceObjective priority와 sheddable admission",
        href: "https://github.com/llm-d/llm-d-router/blob/907c5fe84769a8f8e80ece112fd419dc6313453e/apix/v1/inferenceobjective_types.go",
        problem: "포화 때 어떤 요청부터 버리고 어떤 요청을 지킬지를 요청 등급으로 정하는 문제",
        contribution: "클수록 중요한 정수 priority, 같은 priority 안에서만 맞추는 공정성, priority<0을 포화도 1.0 이상에서 거절하는 admission, 실행 중인 음수 priority를 끊는 EnableEviction을 정의합니다.",
        assumptions: "Gateway API Inference Extension 위의 llm-d endpoint picker이며 commit 907c5fe8 기준입니다.",
        evidenceScope: "API 주석과 admission 코드이며 저하 3단계 순서는 본문의 가정 설계입니다.",
        notClaim: "작은 모델로 낮추는 단계가 llm-d에 자동 기능으로 있다는 뜻은 아닙니다.",
        sectionId: "paper-llm-d-priority",
      },
    ],
  },
```

### `src/content/article-learning.ts`
```old
          "프록시가 자체적으로 요청 수를 세는 방식과 모델 서버 지표를 쓰는 방식의 차이를 설명하고, 후자에도 남는 한계와 그 보정 방법을 쓰세요.",
        answerChecklist: ["프록시는 보낸 수만 알고 남은 양은 모름", "출력 길이는 생성이 끝나야 확정", "모델 서버는 배치·대기열·캐시 여유를 앎", "지표는 긁는 주기만큼 지난 값", "그 구간의 요청이 한곳으로 몰림", "보낸 직후의 요청을 따로 세어 보정"],
        requiredConcepts: ["endpoint-selection-extension-point", "service-abstraction-metric-blindness", "paged-kv-block-allocation"],
        sectionId: "service-abstraction-gap",
```
```new
          "선택기가 요청마다 한 번, 엔진이 출력 token마다 고르는 이유를 쓰고, 선택기와 엔진의 tokenizer가 앞부분 10번째 token에서 갈릴 때 300 token 요청의 예상 cache 적중이 어떻게 되는지 설명하세요.",
        answerChecklist: ["block table과 free 목록은 엔진 process 안", "30ms마다 network 왕복은 출력 속도를 늦춤", "64 token block 5개", "block hash는 앞 block hash와 사슬", "block 0부터 모두 달라져 예상 적중 0", "엔진 tokenization을 쓰는 producer나 버전 고정"],
        requiredConcepts: ["endpoint-selection-extension-point", "service-abstraction-metric-blindness", "paged-kv-block-allocation"],
        sectionId: "two-level-scheduling",
```

### `src/content/article-learning.ts`
```old
        "sectionId": "paper-trtllm-kvcache"
      }
    ],
    "entryLevel": true
  },
```
```new
        "sectionId": "paper-trtllm-kvcache"
      },
      {
        "title": "llm-d-router — Context Length Aware Scorer",
        "href": "https://github.com/llm-d/llm-d-router/tree/907c5fe84769a8f8e80ece112fd419dc6313453e/pkg/epp/framework/plugins/scheduling/scorer/contextlengthaware",
        "problem": "긴 문맥 요청이 짧은 요청과 같은 KV pool을 쓰면 짧은 요청 자리가 줄어드는 문제",
        "contribution": "pod label의 길이 범위로 요청 token 수에 맞는 pod에 점수를 주고, enableFiltering을 켜면 범위 밖 pod를 뺍니다.",
        "assumptions": "llm-d endpoint picker와 pod label 운영을 전제로 하며 commit 907c5fe8 기준입니다.",
        "evidenceScope": "README의 동작 설명이며 본문의 294→32→206 자리 수는 직접 계산입니다.",
        "notClaim": "vLLM 엔진 안에 tenant나 등급별 block 상한이 있다는 주장은 아닙니다.",
        "sectionId": "paper-llm-d-context-length"
      }
    ],
    "entryLevel": true
  },
```

### `src/content/article-learning.ts`
```old
        "notClaim": "B=4가 모든 backend의 지원 설정이라는 주장이나 hash hit 비율로 GPU 메모리 거래 수·응답 시간을 확정하는 주장은 아닙니다.",
        "sectionId": "block-hash"
      }
    ]
  },
```
```new
        "notClaim": "B=4가 모든 backend의 지원 설정이라는 주장이나 hash hit 비율로 GPU 메모리 거래 수·응답 시간을 확정하는 주장은 아닙니다.",
        "sectionId": "block-hash"
      },
      {
        "title": "Anthropic·OpenAI — Prompt caching pricing",
        "href": "https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching",
        "problem": "재사용한 앞부분 KV를 API 가격에 어떻게 반영하는가의 문제",
        "contribution": "Anthropic은 5분 쓰기 1.25배·1시간 쓰기 2배·읽기 0.1배, OpenAI는 GPT-5.6 이후 쓰기 1.25배·읽기 0.1배와 한 번 쓰고 한 번 읽으면 1.35배 대 2배를 적습니다.",
        "assumptions": "2026-10-14에 확인한 공식 가격 문서이며 모델별 예외가 있습니다.",
        "evidenceScope": "가격 배수와 routing 설명이며 배수의 원가 근거는 문서에 없습니다.",
        "notClaim": "읽기 할인이 정확히 건너뛴 prefill 비용과 같다는 주장은 아니며 본문의 원가 해석은 가정입니다.",
        "sectionId": "paper-cache-pricing"
      }
    ]
  },
```

## 공용 파일 수정 목록 (topology)
fingerprint는 이 커밋 직전 `audit-article-topology.mjs --json`의 값이다.

### `src/content/article-topology-decisions.ts`
```old
    reviewedAt: "2026-09-11",
    rationale:
      "본문은 6 section·concept 7개로 keep 범위다. 선택의 자리·복제 단위·고정 총량이 하나의 이전 결정을 함께 떠받치는 구조라 나누면 각 글이 같은 전제를 다시 세워야 한다.",
```
```new
    reviewedAt: "2026-10-14",
    rationale:
      "본문은 7 section·concept 7개로 keep 범위다. 선택의 자리·복제 단위·고정 총량이 하나의 이전 결정을 함께 떠받치는 구조라 나누면 각 글이 같은 전제를 다시 세워야 한다. 2026-10-14에 더한 2단 scheduling 절은 같은 선택기가 요청마다 무엇을 보는지(prefix hash 사슬·tokenizer 일치)를 닫는 절이라 새 concept 없이 이 글에 둔다.",
```

### `src/content/article-topology-decisions.ts`
```old
    "reviewedAt": "2026-10-04",
    "rationale": "C 한 요청의 수용·성장·중단·복원이 같은 공간 장부를 사용하므로 한 글에서 끝까지 추적합니다. allocator와 cache group의 세부 구현은 연결 글이 소유합니다.",
```
```new
    "reviewedAt": "2026-10-14",
    "rationale": "C 한 요청의 수용·성장·중단·복원이 같은 공간 장부를 사용하므로 한 글에서 끝까지 추적합니다. allocator와 cache group의 세부 구현은 연결 글이 소유합니다. 22절의 긴 문맥 격리는 같은 27,648block pool과 94block 짧은 요청으로 잠식·상한·전용 묶음·priority 희생자를 세므로 이 장부의 연장으로 둡니다.",
```

### `src/content/article-topology-decisions.ts`
```old
    "sharedGate": "40block에서 A14·B12·C9→A15·B13·C10→A16·B14·C0→B14·C11과 free14·5·2·10·15를 본문·Viz·문제에서 일치시킵니다.
```
```new
    "sharedGate": "128K 요청 8,192block, 셋이면 남는 3,072와 짧은 대화 294→32, 한 개 상한 206, 32K 상한 2,048block, 70B 320KiB/token·40GiB를 본문·계산 장부·Viz에서 일치시킵니다. 40block에서 A14·B12·C9→A15·B13·C10→A16·B14·C0→B14·C11과 free14·5·2·10·15를 본문·Viz·문제에서 일치시킵니다.
```

### `src/content/article-topology-decisions.ts`
```old
    "rationale": "한 요청의 앞 기록이 어디서 일치하고 어떤 저장 위치를 공유하며 언제 반환되는지 하나의 경로로 설명합니다.
```
```new
    "rationale": "한 요청의 앞 기록이 어디서 일치하고 어떤 저장 위치를 공유하며 언제 반환되는지 하나의 경로로 설명합니다. 21절의 cache 가격은 같은 재사용을 계산 위치 18%와 가격 29%로 다시 세는 마무리 절입니다.
```

### `src/content/article-topology-decisions.ts`
```old
  "ai/prefix-caching-radix-attention": "28ef371cafdc6aa0",
```
```new
  "ai/prefix-caching-radix-attention": "56ed4425cf24b592",
```

### `src/content/article-topology-decisions.ts`
```old
  "ai/serving-memory-admission-and-preemption": "d2ac7be19ff58785",
```
```new
  "ai/serving-memory-admission-and-preemption": "fb6c9b9f82c62700",
```

### `src/content/article-topology-decisions.ts`
```old
  "ai/onprem-k8s-inference-platform": "dd74f96021e2b718",
```
```new
  "ai/onprem-k8s-inference-platform": "1ad2dfcc5e827bfd",
```

### `src/content/article-topology-decisions.ts`
```old
  "ai/prefix-caching-radix-attention": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-04",
```
```new
  "ai/prefix-caching-radix-attention": {
    "action": "keep",
    "status": "implemented",
    "reviewedAt": "2026-10-14",
```
