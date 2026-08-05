# Practical model adaptation and agent runtime reconstruction

## Scope decision

`ai-practical-llm` contains two independent production questions. They share a
collection but must not be presented as one sequential curriculum.

1. `lora-finetuning`: change model behavior with a small, auditable weight
   update and release it without confusing storage precision, compute precision,
   and deployment format.
2. `multi-agent-implementation`: split a runtime only when the split creates
   measurable value, then make shared state, ownership, recovery, approval, and
   termination explicit.

The old fact-sheet sections and fixed hardware/performance numbers are replaced.
Existing subfiles remain in the repository for history but are no longer
imported by the article wrappers.

## Reader contracts

### LoRA / QLoRA

After reading, a learner must be able to:

- decide whether the failure requires retrieval, prompting, continued
  pretraining, or supervised behavior adaptation;
- derive `Delta W = (alpha / r) B A`, calculate its shapes and trainable
  parameter count, and explain why `alpha / r` is part of the experiment
  contract;
- separate frozen base weights, trainable adapter weights, activations,
  gradients, and optimizer states in a memory ledger;
- explain QLoRA as 4-bit base storage plus higher-precision computation and
  gradients into LoRA parameters, not as 4-bit gradient descent on the base;
- define chat template, truncation, assistant/completion loss mask, independent
  split, baseline, slice and regression evaluation;
- choose adapter serving versus a merged artifact and validate the exact
  artifact that will be deployed.

### Multi-agent runtime

After reading, a learner must be able to:

- reject multi-agent decomposition when one bounded agent is the stronger
  baseline;
- define a typed state schema, ownership per field, reducers, and merge
  conflicts before drawing a graph;
- distinguish routing from state update and define success, failure, budget,
  recursion, and no-progress termination;
- add timeout, bounded retry, checkpoint, stable run identity, idempotency key,
  and human approval at the correct side-effect boundary;
- explain LangGraph reducer, `thread_id`, checkpoint, `interrupt`, and resume
  semantics without implying that a node resumes from the interrupted line;
- explain CrewAI sequential and hierarchical processes without omitting the
  manager requirement;
- trace and evaluate the whole system against a single-agent baseline using
  outcome, failure, cost, latency, handoff and safety metrics.

## Article structures

### `lora-finetuning`

1. Behavior contract and smallest sufficient intervention.
2. Low-rank update geometry and a numeric worked example.
3. QLoRA precision path and memory ledger.
4. SFT data, template, loss mask, split, baseline, and evaluation.
5. Training diagnosis: rank, alpha, target modules, optimization and ablation.
6. Adapter/merge release decision and artifact validation.

### `multi-agent-implementation`

1. Split gate and single-agent baseline.
2. Typed state, ownership, reducer and conflict semantics.
3. Graph routing, handoff and bounded termination.
4. Failure recovery, checkpoint, retry, idempotency and approval.
5. Framework mapping for LangGraph and CrewAI.
6. Trace-based evaluation and a manufacturing incident example.

## Visualization contracts

All labs use responsive HTML/CSS rather than coordinate-heavy SVG. Every
interactive state change uses `aria-live`, text remains at least 11px, and no
lab requires horizontal scrolling.

- `adaptation-gate`: observed failure -> smallest responsible intervention.
- `lora-geometry`: rank and alpha sliders -> shapes, scale, parameter count,
  numeric update example.
- `qlora-precision`: storage / compute / gradient views of one forward-backward
  path.
- `sft-loss-mask`: template mode and loss boundary -> tokens that receive loss.
- `adapter-release`: adapter serving / merged release -> operational tradeoff
  and required artifact checks.
- `agent-split-gate`: topology and isolation -> single or multi-agent decision.
- `reducer-trace`: overwrite / append reducer -> same-key update trace.
- `execution-safety`: failure/approval boundary -> retry and side-effect
  contract.
- `agent-trace-eval`: trace failure selection -> attributable metric and fix.

## Formula contracts

Every display formula has Korean semantic annotations and a prose symbol note.

1. `Delta W = (alpha/r)BA`, including dimensions.
2. Trainable LoRA parameter count `r(d_in + d_out)`.
3. Completion/assistant-only masked cross entropy.
4. Release utility as a comparison bundle, never a universal scalar score.
5. Reducer state update.
6. Bounded runtime termination predicate.

## Primary sources and scope

- LoRA, Hu et al. 2021: https://arxiv.org/abs/2106.09685
- QLoRA, Dettmers et al. 2023: https://arxiv.org/abs/2305.14314
- PEFT LoRA API: https://huggingface.co/docs/peft/main/package_reference/lora
- PEFT quantization guide:
  https://huggingface.co/docs/peft/developer_guides/quantization
- PEFT model merging:
  https://huggingface.co/docs/peft/developer_guides/model_merging
- TRL SFTTrainer: https://huggingface.co/docs/trl/en/sft_trainer
- LangGraph graph API:
  https://docs.langchain.com/oss/python/langgraph/graph-api
- LangGraph persistence:
  https://docs.langchain.com/oss/python/langgraph/persistence
- LangGraph interrupts:
  https://docs.langchain.com/oss/python/langgraph/interrupts
- CrewAI processes: https://docs.crewai.com/en/concepts/processes
- CrewAI flows: https://docs.crewai.com/en/concepts/flows
- Anthropic multi-agent research system:
  https://www.anthropic.com/engineering/multi-agent-research-system

Paper headline numbers are described only inside their original experimental
scope. Current library API details are named as current documentation examples,
not timeless framework guarantees.

## Private transfer questions

These questions are used during authoring and review. They are not copied into
the article as exercises.

### LoRA / QLoRA

1. For a `4096 x 4096` projection with `r=16`, calculate trainable parameters
   and show how the answer changes if four projections are targeted.
2. Compare runs `(r=8, alpha=16)` and `(r=32, alpha=64)`. What remains constant,
   and what does not?
3. A run improves training loss but regresses exact-format compliance on an
   unseen source. Identify at least four distinct causes and the evidence needed
   to separate them.
4. Explain why NF4 storage does not imply NF4 matrix multiplication or NF4
   adapter gradients.
5. A QLoRA run must ship as a merged artifact. Write the precision and
   re-quantization validation sequence.
6. A team changes both target modules and data template in one run. Explain why
   the result cannot identify the responsible mechanism.

### Multi-agent runtime

1. Two parallel workers return updates to the same `evidence` field. Predict the
   result with no reducer and with an append reducer.
2. An approval node writes to a PLC before calling `interrupt()`. Explain the
   duplicate-action failure on resume and redesign the boundary.
3. A router alternates between search and critique until confidence improves.
   Define no-progress, budget, recursion, and success termination.
4. A hierarchical manager becomes the context and latency bottleneck. Design a
   single-agent and a deterministic fan-out baseline that can falsify the need
   for the manager.
5. A worker times out after an external ticket may already have been created.
   Specify the run ID, idempotency key, retry class, and reconciliation trace.
6. Outcome quality improved but cost tripled and safety-policy violations
   increased. Explain why an aggregate score alone cannot justify release.

## Claude audit record

- Initial factual LoRA audit timed out at 180432ms.
- Parallel pedagogy/viz audit returned FAIL and identified formula
  inconsistency, missing numeric derivation, missing dtype triad, one-sided NF4
  marks, tiny labels, and no adapter-vs-merge decision.
- Parallel multi-agent API audit returned FAIL and identified reducer,
  `thread_id`, interrupt idempotency, termination, retry, and CrewAI manager
  omissions.
- The factual audit was split into two smaller requests. Both returned valid
  `claude-code:sonnet` headers and FAIL verdicts. Findings included memory versus
  trainable-parameter conflation, unsupported 97% wording, incorrect A100 80GB
  attribution, incorrect double-quant percentage, missing BF16 compute role,
  missing loss-mask contract, unsafe merge simplification, and unsupported
  hardware/time claims.
