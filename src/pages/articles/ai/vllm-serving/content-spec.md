# vLLM serving reconstruction contract

Date: 2026-07-29
Article: `/lab/blog/ai/vllm-serving`

## Article job

This is the entry article for the `ai-llm-serving-engine` path. It does not try
to duplicate every child article. It gives one causal service model and hands
each ledger to the article that owns the derivation.

The reader should leave able to answer:

- which workload and SLO are being optimized;
- which process owns each request state;
- why KV capacity becomes an admission constraint;
- how one V1 scheduler step shares a token budget;
- why throughput can rise while user-visible goodput falls;
- which claim is current vLLM behavior, historical paper evidence, a pinned
  repository excerpt, or an editorial teaching fixture.

## Hidden transfer problem

The article must be sufficient to solve this without printing it as an exercise:

> Interactive requests are decoding while a 6,144-token prompt and repeated
> batch prompts arrive. The interactive target is p95 TTFT <= 800 ms and p95
> TPOT <= 50 ms. Free KV headroom is low. Choose the primary metrics, decide
> whether to chunk the long prefill, explain the token-budget order, predict
> when recompute preemption becomes likely, decide whether prefix reuse helps,
> and reject a rollout that improves total token throughput while violating the
> interactive goodput SLO.

Required insight:

1. workload shape and percentile SLO precede engine tuning;
2. TTFT is dominated by admission, queueing, preprocessing, and prefill while
   TPOT reflects decode cadence;
3. V1's unified scheduler spends the step token budget on running work and can
   chunk a prefill so decode work is not blocked by the whole long prompt;
4. KV blocks are allocated on demand, so free-pool headroom constrains admission;
5. current V1 uses recomputation rather than GPU-to-CPU swapping for preemption;
6. prefix caching saves repeated prefill computation but does not create free
   GPU memory or fix every latency bottleneck;
7. throughput is not goodput unless requests meet the declared SLO;
8. configuration changes are accepted only under the same model, hardware,
   precision, prompt/output distribution, request rate, burstiness, and
   concurrency.

## Narrative

1. `overview`
   Start with the service decision, metric contract, and one interactive control
   lab before showing implementation buttons.
2. `runtime-ownership`
   Trace HTTP input through API server, EngineCore, scheduler/KV manager, worker,
   and streamed output. Name the owner and evidence at every boundary.
3. `paged-attention`
   Explain logical token order, physical KV blocks, block table, free pool,
   prefix reuse, and current recompute preemption.
4. `scheduler-step`
   Explain one unified token-budget step, decode priority under chunked prefill,
   admission pressure, and why the child scheduler article owns exact code.
5. `serving-architecture`
   Separate optimization families: attention/backend execution, speculative
   decoding, parallelism, and multimodal admission. No unscoped speedup gallery.
6. `vllm-serving-field-guide`
   End with a causal descent to PagedAttention, Scheduler, Speculative Decoding,
   and VLM Serving plus a release checklist and capability check.

## Visual contract

### `ServingControlLab`

- HTML-first, no fixed-width SVG and no horizontal scroll.
- Controls are at least 44 px high and text is at least 12 px.
- Workload profile changes the primary release metric.
- Long prompt and chunked-prefill state change the scheduler plan and
  interactive SLO outcome.
- KV headroom changes preemption risk and the release decision.
- Repeated-prefix state changes expected reusable work but never claims to add
  memory.
- Every numeric value is visibly labeled as a teaching fixture, not a vLLM
  benchmark.
- Output names the first bottleneck, current step order, metric decision, and
  next owned article.

### `RequestLifecycleViz`

- Preserve responsive reading order.
- Name process ownership rather than presenting a decorative pipeline.
- No tiny SVG labels below 12 px.

## Evidence and time boundary

### Current behavior

Use vLLM `v0.26.0` official documentation, released 2026-07-27, for:

- V1 process architecture and ZMQ boundary;
- unified scheduling and chunked prefill;
- current recompute preemption and removed GPU-to-CPU swapping;
- benchmark input controls and TTFT/TPOT/E2EL/goodput metrics;
- speculative decoding configuration and current limitations.

### Historical evidence

Use Kwon et al., SOSP 2023 only for:

- PagedAttention's fixed-token block and block-table idea;
- the paper's own memory-waste measurements;
- the paper's 2–4x throughput result against its named FasterTransformer and
  Orca baselines at the paper's same-latency comparison.

Use Orca (OSDI 2022), FlashAttention (NeurIPS 2022), and EAGLE (ICML 2024) only
for their original contributions and explicitly scoped experiment results.

### Repository excerpt set

The local CodeSidebar is not a coherent vLLM checkout. It is a verified excerpt
set whose files are pinned individually:

| path | commit | date |
| --- | --- | --- |
| `vllm/v1/engine/core.py` | `7afe0faab1eb2ab84cda5cab29b24046e516f7b8` | 2026-03-13 |
| `vllm/v1/core/sched/scheduler.py` | `35bdca5431e652b4c00267489a632c1bf5522103` | 2026-03-11 |
| `vllm/v1/core/kv_cache_manager.py` | `4ff8c3c8f9ece010a1d0e376f5cc1b468b95f366` | 2026-03-10 |
| `vllm/v1/core/kv_cache_coordinator.py` | `97fa8f65909d4d8f2eb0edc2137fb22f576a5b25` | 2026-02-10 |
| `vllm/v1/core/block_pool.py` | `a0fe7ea2f052bb44820bc06a5635456b8d1383af` | 2026-02-21 |
| `vllm/v1/worker/gpu_worker.py` | `747b0681364aa53235b71a30488f450652cc316a` | 2026-03-16 |
| `vllm/entrypoints/openai/api_server.py` | `6682c231fa97f33d3b3f4d788da4e14959989a67` | 2026-03-16 |
| `vllm/v1/spec_decode/eagle.py` | `494636b29d3b3a7b35020e4becb6c6995e200f9d` | 2026-03-30 |
| `vllm/v1/spec_decode/draft_model.py` | `cd7643015e583c1e78d437118a6ce8282cb85663` | 2026-03-25 |
| `vllm/v1/sample/sampler.py` | `d707678dfb9a1f616d174022ebc74065d1011863` | 2026-02-13 |
| `vllm/v1/sample/rejection_sampler.py` | `9e0f44bec449df17d30ed9abef7aeedc059ddfde` | 2026-03-04 |
| `vllm/v1/request.py` | `1bf2ddd0ee24cf878a87b643536b749676e8f902` | 2026-03-25 |

The article must say what the excerpt proves locally and must not imply that
these files form one current release or are mutually compatible.

## 4B / 9B handoff packet

### 4B

Give only:

```yaml
service_case:
  workload: interactive | batch
  prompt_tokens: one number
  output_tokens: one number
  concurrency: one number
  slo: TTFT and TPOT, or throughput
runtime_boundary:
  owner: one process
  resource: token budget or KV blocks
  failure: one
source_kind: current-doc | historical-paper | pinned-excerpt | teaching-fixture
next_article: one
```

Require one decision and one counterexample. Never ask the model to infer
current behavior from a historical paper.

### 9B

Additionally require:

- same-workload before/after comparison;
- percentile metric and goodput threshold;
- model, GPU, precision, version, prompt/output distribution, request rate,
  burstiness, and max concurrency;
- current-doc versus excerpt compatibility boundary;
- one falsifying measurement;
- exact child-article handoff.

## Acceptance

- mastery audit score is 100;
- one QuestionLead, ConceptPrimer, Misconception, CapabilityCheck, and
  SourceNotes are present;
- no current V1 automatic CPU swap claim remains;
- no unscoped 24x, 1.7x, 30%, FP8 perplexity, or universal backend-default
  claim remains;
- all GitHub source links are commit-pinned;
- causal state transitions are asserted in Playwright at 390 and 1440 px;
- no raw LaTeX, formula/Viz overflow, tiny labels, or page scroll;
- current-source Claude audits independently cover facts, transfer sufficiency,
  and responsive interaction with stable hashes and strict valid receipts.
