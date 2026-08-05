# ai-llm-serving article depth TODO

Goal: `/lab/blog/ai?sub=ai-llm-serving` under the AI category should read as a field guide for LLM serving, not as a small feature tour. Each article needs a complete scope map, architectural boundaries, runtime lifecycle, operational decisions, failure modes, observability signals, and production checklists.

## Common acceptance criteria

- [x] Fix the right-side table of contents so long article TOCs can reach the final item.
- [x] Add a concrete depth plan that covers every article in the `ai-llm-serving` subcategory.
- [x] Add field-guide sections that turn each article from a partial explanation into a full scope map.
- [ ] Add diagrams for all new field-guide sections, not only the original visualizations.
- [ ] Add more source-linked code references for non-vLLM operational topics where local source snapshots exist.
- [ ] Add cross-article navigation so readers can move from gateway, engine, GPU fleet, deployment, and observability topics without returning to the category page.

## Article coverage plan

### LLM 서빙 인프라 개요 (`llm-serving-ops`)

- Purpose: category hub and system map.
- Target TOC:
  - Serving stack from client to GPU
  - Article map by responsibility
  - Production architecture reference
  - Read order for operators, backend engineers, and platform teams
- Status:
  - [x] Overview hub exists.
  - [ ] Add a complete end-to-end serving stack diagram.
  - [ ] Add "how to read this series" paths by persona.

### LiteLLM 게이트웨이 (`litellm-gateway`)

- Purpose: LLM control plane for provider abstraction, routing, policy, reliability, cost, and audit.
- Target TOC:
  - Provider abstraction and OpenAI-compatible boundary
  - Proxy server vs SDK/router deployment models
  - Virtual keys, teams, model aliases, model groups
  - Routing strategies: latency, cost, reliability, capability, region
  - Retry, fallback, cooldown, timeout, health check
  - Budget, rate limit, spend tracking, chargeback
  - Logging, tracing, eval, prompt retention, PII handling
  - Production route review checklist
- Status:
  - [x] Existing feature overview and routing/fallback examples.
  - [x] Added field-guide section for request lifecycle, policy layers, model catalog, reliability, governance.
  - [ ] Add code references for virtual keys, budgets, and proxy auth paths.

### Kubernetes GPU Fleet (`k8s-gpu-fleet`)

- Purpose: GPU cluster operating model for LLM inference.
- Target TOC:
  - Hardware SKU planning and interconnect tradeoffs
  - Node bootstrap: driver, container runtime, device plugin, DCGM
  - NVIDIA GPU Operator component model
  - Scheduling: requests/limits, taints/tolerations, node affinity, topology, MIG
  - Autoscaling: HPA, KEDA, Karpenter/Cluster Autoscaler, warm pools
  - Capacity planning: VRAM, KV cache, batch shape, cold start, quota
  - Failure modes: bad driver, ECC, fragmentation, preemption, spot interruption
  - Security, governance, cost allocation
- Status:
  - [x] Existing operator/autoscaling overview.
  - [x] Added field-guide section for lifecycle, scheduling matrix, capacity math, incident flow.
  - [ ] Add GPU fleet runbook diagram and example Prometheus/DCGM dashboard.

### LLM 서빙 배포 패턴 (`serving-deployment`)

- Purpose: release engineering for vLLM/TGI/Triton-like model servers on Kubernetes.
- Target TOC:
  - Model artifact and image build contract
  - Runtime choice and engine configuration
  - Deployment topology: single model, shared pool, multi-tenant pool
  - Model loading and readiness gates
  - Traffic control: canary, blue/green, shadow, weighted routing
  - Scaling: queue, TTFT, tokens/sec, GPU utilization, KV cache pressure
  - Rollback and incident criteria
  - Release checklist
- Status:
  - [x] Existing model loading and HPA sections.
  - [x] Added field-guide section for release lifecycle, traffic strategy, readiness, rollback.
  - [ ] Add example manifest snippets for readiness, volume/mount, and autoscaling metrics.

### LLM 서빙 관측성 & AIOps (`observability-aiops`)

- Purpose: measurable operation model for LLM serving incidents and automation.
- Target TOC:
  - SLO model: availability, TTFT, E2E latency, output tokens/sec, error budget
  - Metric taxonomy: gateway, engine, GPU, Kubernetes, provider, cost, quality
  - Trace model: request id, model group, provider, route, scheduler, token loop
  - Logging and retention: prompt safety, PII, sampling
  - Alert rules and symptoms
  - Runbooks for slow TTFT, low TPS, OOM, provider 429, quality regression
  - AIOps levels: classify, recommend, execute, verify, rollback
  - Dashboard layout and ownership
- Status:
  - [x] Existing metric and automation overview.
  - [x] Added field-guide section for telemetry contract, dashboard layers, runbook ownership, automation gates.
  - [ ] Add concrete Prometheus rules and Alertmanager route examples.

### vLLM 고성능 서빙 엔진 (`vllm-serving`)

- Purpose: full serving engine map, from API server to scheduler, block manager, workers, tokenizer, sampler, and metrics.
- Target TOC:
  - API/request lifecycle
  - EngineCore and scheduler loop
  - KV cache blocks and PagedAttention
  - Continuous batching and prefill/decode tradeoff
  - Tensor/pipeline parallel and worker placement
  - Runtime knobs and measurement
  - Failure modes and production checklist
- Status:
  - [x] Existing engine, PagedAttention, and architecture sections.
  - [x] Added field-guide section for engine boundary, serving levers, and operator checklist.
  - [ ] Add deeper worker/parallelism and tokenizer/sampler subsections.

### vLLM Scheduler (`vllm-scheduler`)

- Purpose: scheduling algorithm analysis, not only `schedule()` walkthrough.
- Target TOC:
  - Scheduler state model
  - Waiting/running/preempted queues
  - Token budget and chunked prefill
  - Prefill/decode fairness
  - Preemption and recompute/swap tradeoff
  - Interaction with KV cache manager
  - Metrics and tuning guide
- Status:
  - [x] Existing code analysis for schedule, prefill/decode, preemption.
  - [x] Added field-guide section for policy, fairness, queue pressure, and tuning.
  - [ ] Add more examples for mixed short/long prompt workloads.

### vLLM PagedAttention (`vllm-paged-attention`)

- Purpose: memory-management guide for KV cache.
- Target TOC:
  - Why KV cache dominates inference memory
  - Logical vs physical blocks
  - Block allocation, free, eviction, reference sharing
  - Prefix caching and reuse correctness
  - Fragmentation and capacity planning
  - Failure modes: block exhaustion, cache churn, long-context starvation
  - Debugging and metrics
- Status:
  - [x] Existing block pool, KV cache manager, APC sections.
  - [x] Added field-guide section for memory lifecycle, planning, and debug signals.
  - [ ] Add examples for long-context and prefix-heavy workloads.

### vLLM Speculative Decoding (`vllm-spec-decode`)

- Purpose: latency optimization guide for draft/verify execution.
- Target TOC:
  - Draft model, verifier, acceptance rate
  - EAGLE, MTP, n-gram and target model options
  - Speedup math and when it fails
  - Scheduler interaction and memory overhead
  - Quality invariants and correctness
  - Production rollout checklist
- Status:
  - [x] Existing draft-verify and EAGLE/MTP sections.
  - [x] Added field-guide section for acceptance economics, rollout, and failure modes.
  - [ ] Add acceptance-rate measurement examples.

### vLLM VLM Serving (`vllm-vlm-serving`)

- Purpose: multimodal serving path for images/video and text.
- Target TOC:
  - OpenAI request rendering and model-specific processors
  - Multimodal feature extraction and prompt token alignment
  - Scheduler multimodal budget
  - Encoder cache and runtime cache invalidation
  - Speculative decode fallback for VLMs
  - Failure modes: image token mismatch, encoder bottleneck, cache desync
  - Production checklist
- Status:
  - [x] Existing render/preprocess, budget, runtime cache sections.
  - [x] Added field-guide section for end-to-end VLM serving lifecycle and operational risks.
  - [ ] Add a request-shape matrix for Qwen/GLM/OCR/VL-style models.
