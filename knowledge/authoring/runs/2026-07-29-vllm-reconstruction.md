# vLLM serving reconstruction receipt

Date: 2026-07-29
Route: `/lab/blog/ai/vllm-serving`

## Why this article was selected

The mastery selector scored the route 70:

- question: missing;
- capability: missing;
- sources, formula notes, Viz, causal Viz, links and depth: present.

That score understated the factual problem. Direct reading found:

- a 2023 paper's `2–4x` result presented like a current product property;
- unpinned `main` GitHub links;
- current V1 process claims mixed with March 2026 source excerpts;
- removed GPU-to-CPU KV swapping described as current V1 behavior;
- unsupported `24x`, `1.7x`, CUDA Graph `30%`, and FP8 perplexity values;
- code buttons before the service mental model;
- tiny fixed SVG labels and a static optimization-card gallery;
- only one forward link despite four owned child ledgers.

## Reasoning sequence

### 1. Start from a transfer decision, not the feature list

The hidden case is a mixed workload:

- ongoing interactive decode;
- one 6,144-token prompt;
- repeated prefixes;
- low KV headroom;
- p95 TTFT <= 800 ms and p95 TPOT <= 50 ms.

The learner must choose metrics, chunked prefill, admission/preemption response,
and reject a throughput improvement that violates goodput. This case forced the
article to connect workload, metric, process, memory and scheduler rather than
describe isolated features.

### 2. Separate four evidence clocks

```yaml
current_behavior:
  authority: vLLM v0.26.0 official docs
  released: 2026-07-27
historical_idea:
  authority: original papers
  examples: PagedAttention, Orca, FlashAttention, EAGLE
code_excerpt:
  authority: one exact file commit
  limitation: not one coherent checkout
teaching_fixture:
  authority: editorial
  limitation: never a benchmark
```

This separation was necessary because a paper can prove that an idea worked
under its experiment while saying nothing about a current deployment's SLO.

### 3. Reconstruct the narrative in causal order

1. workload and percentile SLO;
2. TTFT, TPOT, goodput and KV headroom;
3. API Server → ZMQ → EngineCore/Scheduler/KV → GPU Worker → stream;
4. logical token order → block table → physical block → free pool;
5. one scheduler token budget and chunked prefill;
6. optimization family → changed bottleneck → required measurement;
7. four child ledgers in execution order.

Code buttons moved after the boundary they prove.

### 4. Make the Viz answer the same transfer problem

`ServingControlLab` changes:

- mixed workload as the default case, with interactive-only and batch-only
  controls as counterfactuals;
- 256 versus 6,144 prompt tokens;
- 128 versus 8 free KV blocks;
- chunked prefill on/off;
- repeated prefix on/off.

Those controls causally change:

- primary metric;
- TTFT and TPOT teaching values;
- total throughput teaching value;
- scheduler step plan;
- reusable prefill work;
- recompute-preemption risk;
- first bottleneck;
- pass/hold decision and next article.

The numbers are visibly labeled as a teaching fixture.

`RequestLifecycleViz` was rebuilt as responsive HTML. Every scene exposes owner,
artifact and next metric. A screenshot review caught a 9-column desktop layout
that broke words one letter at a time; the layout was corrected to five owner
columns with non-consuming arrows.

### 5. Remove rather than recolor dead visual debt

Seventeen unreferenced components and fixed SVG support files were removed.
They contained the stale swap claim, unsupported speedups and the smallest
labels. Keeping them would allow obsolete content to be imported again.

## Per-file source boundary

The CodeSidebar excerpt set is explicitly pinned:

| concern | path | commit |
| --- | --- | --- |
| EngineCore | `vllm/v1/engine/core.py` | `7afe0faab1eb2ab84cda5cab29b24046e516f7b8` |
| Scheduler | `vllm/v1/core/sched/scheduler.py` | `35bdca5431e652b4c00267489a632c1bf5522103` |
| KV manager | `vllm/v1/core/kv_cache_manager.py` | `4ff8c3c8f9ece010a1d0e376f5cc1b468b95f366` |
| API server | `vllm/entrypoints/openai/api_server.py` | `6682c231fa97f33d3b3f4d788da4e14959989a67` |
| GPU worker | `vllm/v1/worker/gpu_worker.py` | `747b0681364aa53235b71a30488f450652cc316a` |

The complete 12-file manifest lives in
`src/pages/articles/ai/vllm-serving/sourceSnapshot.ts` and the content spec.

## 4B reproduction packet

```yaml
question:
  workload:
    running: interactive_decode
    arrivals:
      - long_interactive_prompt
      - repeated_prefix_batch
  prompt_tokens: 6144
  concurrency: 64
  slo:
    p95_ttft_ms: 800
    p95_tpot_ms: 50
state:
  kv_free_blocks: 8
  repeated_prefix: true
  chunked_prefill: false
required_output:
  primary_metric: one
  first_bottleneck: one
  current_owner: one
  safe_action: one
  next_article: one
evidence_label:
  - current-doc
  - historical-paper
  - pinned-excerpt
  - teaching-fixture
```

The model must receive one counterexample: total throughput rises while p95
TTFT or TPOT violates the SLO. Do not give the full vLLM corpus.

## 9B reproduction packet

Add:

- same-workload before/after measurements;
- model, GPU, precision, vLLM version and non-default flags;
- input/output distribution, request rate, burstiness and max concurrency;
- a falsifier such as low acceptance or repeated recompute preemption;
- current-doc versus pinned-excerpt compatibility warning;
- exact handoff fields for the next child article.

Ask the 9B model to produce:

1. claim ledger with source kind;
2. causal section order;
3. one interactive state transition table;
4. one failure boundary per section;
5. release decision and rollback evidence.

## Verification

- selected ESLint: pass;
- `npx tsc --noEmit`: pass;
- production build: Vite `8,764 modules`, `18.02s`, pass;
- local learning contract: `6/6` pass;
- public vLLM focused suite: `18/18` pass;
- public representative mobile/desktop lifecycle: `2/2` pass;
- public mobile document width: `clientWidth = scrollWidth = 390`;
- public raw LaTeX residue: `false`;
- public sticky-navigation geometry: pass;
- mastery score: `70 → 100`, prose depth `5,273`;
- built chunk: `dist/assets/vllm-serving-CGWBHZee.js`, `43,583 bytes`;
- public route:
  `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/vllm-serving`;
- public asset: HTTP `200`, immutable;
- local, public and built index SHA-256:
  `58594e30b662fe3bef6032b8ce3f060d02dd47194d2f4c010b8e3cf5964df913`.

## Claude current-source closure

Only HTTP 200, `ok=true`, `claude-code:sonnet`, first attempt success, an
`ACCEPT|REVISE` first line, substantive output and stable source hashes count.
Any 500, timeout, malformed first line or unstable hash is retried and is not
release evidence.

The final read-only closure used three independent scopes:

| scope | strict receipt | verdict |
| --- | --- | --- |
| current facts and version-pinned docs | `.codex-tmp/claude-vllm-facts-format-2026-07-29/result.raw.json` | ACCEPT |
| hidden-transfer sufficiency | `.codex-tmp/claude-vllm-closure-2026-07-29/results/transfer-current-closure.raw.json` | ACCEPT |
| responsive causal UI and test contract | `.codex-tmp/claude-vllm-closure-2026-07-29/results/responsive-current-closure.raw.json` | ACCEPT |

All three source-hash comparisons were stable. The first broad responsive call
timed out, and the first facts rerun returned a substantive answer without the
required first-line token. Neither was counted. Their scopes were reduced and
resubmitted; the table above contains the only release receipts.

## Production closure

`cm-blog.service` was restarted from the final build and remained active on port
`14010`. The public index hash equals the built and local service hashes, the
versioned vLLM asset returns HTTP 200, the public focused suites pass, and the
390px screenshot has no horizontal overflow, clipped controls or raw LaTeX.
