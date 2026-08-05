# Foundation and Model Review Backfill

## Contract

This was a read-only Context Manager backfill. Each accepted result has an explicit
`[claude-code:sonnet ...]` response header. Codex fallbacks and the headerless
timeout are recorded separately and are not labeled as Claude reviews. This task
did not edit application code.

## Outcome

- 12 target articles reviewed and accepted.
- 22 Context Manager attempts: 12 accepted Claude Code Sonnet results, 9 rejected
  Codex fallbacks, and 1 headerless timeout.
- No HTTP 500 occurred.
- AI Foundations continuity passed:
  `optimizers -> foundation-training-step -> autoencoder`.
- The new article is registered in `articlesDL.ts`, `ai-foundations-core`, and
  `foundationCurriculum.ts`; the existing article test covers 390, 768, and
  1440 px.

## Accepted Reviews

| Slug | Exact accepted header | Verdict |
| --- | --- | --- |
| `rnn` | `[claude-code:sonnet · L3 · $0.0000 · 119230ms]` | confirmed defect |
| `lstm` | `[claude-code:sonnet · L3 · $0.0000 · 120436ms]` | confirmed defect |
| `transformer-architecture` | `[claude-code:sonnet · L3 · $0.0000 · 159234ms]` | pass; suggestion rejected |
| `bert` | `[claude-code:sonnet · L3 · $0.0000 · 174564ms]` | confirmed low defect |
| `reasoning-post-training-frontier` | `[claude-code:sonnet · L4 · $0.0000 · 92935ms]` | pass |
| `llm-data-engine` | `[claude-code:sonnet · L4 · $0.0000 · 103432ms]` | confirmed defect |
| `training-pipeline` | `[claude-code:sonnet · L3 · $0.0000 · 141590ms]` | confirmed defects |
| `rl-decision-system-contracts` | `[claude-code:sonnet · L4 · $0.0000 · 109631ms]` | pass |
| `rl-safe-constrained-learning` | `[claude-code:sonnet · L3 · $0.0000 · 80738ms]` | pass |
| `rl-ppo-continuous-control` | `[claude-code:sonnet · L3 · $0.0000 · 155080ms]` | confirmed defects |
| `rl-imitation-offline-learning` | `[claude-code:sonnet · L3 · $0.0000 · 142082ms]` | pass |
| `foundation-training-step` | `[claude-code:sonnet · L3 · $0.0000 · 132838ms]` | pass; route pass |

## Confirmed Defects

1. **RNN, medium**:
   `src/pages/articles/ai/rnn/Rebuilt.tsx:41` described a bias term that the scalar
   recurrence did not compute. The concurrent fix states that the example uses
   `b=0`.
2. **LSTM, medium**:
   `src/pages/articles/ai/lstm/Rebuilt.tsx:154` used scenario-max-normalized bars
   for absolute sigmoid gate values. The concurrent fix supplies `scaleMax={1}`.
3. **BERT, low**:
   Fractional MLM expected counts used inconsistent one- and three-decimal
   formatting. The concurrent fix passes the article formatter into
   `ProbabilityBars`.
4. **LLM data engine, medium**:
   `CurrentFlowExplorers.tsx:119` mixed retained/removed raw-corpus shares with a
   synthetic verification share using another denominator. The concurrent fix
   separates the 100% original snapshot from the synthetic funnel.
5. **Training pipeline, high**:
   `viz/LoopViz.tsx:198` labeled loss as FP16 inside autocast. The concurrent fix
   says `op별 dtype` and `안정 dtype`.
6. **Training pipeline, medium**:
   `viz/OverviewVizData.ts:28` said scheduler calls are always epoch-level. The
   concurrent fix allows configured batch or epoch cadence.
7. **Training pipeline, medium**:
   `Logging.tsx:11` and `viz/LoggingViz.tsx:89` averaged batch means by batch
   count, which biases unequal final batches. The concurrent fix divides a
   compatible loss sum by `sample_count`.
8. **PPO continuous control, high**:
   `viz/PpoFoundationViz.tsx:6` made the time-limit bootstrap branch unreachable.
   The concurrent fix adds terminal/time-limit controls.
9. **PPO continuous control, medium**:
   The GAE label attributed zero tail to truncation instead of separating the
   rollout edge from value bootstrap. The current label distinguishes both.
10. **PPO continuous control, low**:
    The continuous-control article used a discrete probability example without a
    density or tanh change-of-variables boundary. The concurrent prose now adds it.

The parent task reported targeted tests passing for the training-pipeline and PPO
fixes. This read-only task checked the resulting source state but did not run
those tests itself.

## Optional Suggestions

- `llm-data-engine`: positive coloring for zero verified synthetic data was
  optional; the parent accepted and fixed it.
- `training-pipeline`: explain the conditions under which gradient accumulation
  exactly matches a single large batch.
- `rl-ppo-continuous-control`: plain-text `Â` could be introduced explicitly as
  the advantage estimate.
- `foundation-training-step/content-spec.md:109`: a Codex fallback and local
  inspection found a stale XOR transfer-check bullet after the rendered
  CapabilityCheck changed to validation generalization. This does not affect the
  accepted article or route result.

## Rejected / No Issue

- `transformer-architecture`: the accepted reviewer suspected that Stanford
  Winter 2025 `a4.pdf` was the wrong assignment. The official PDF is titled
  **Self-Attention, Transformers, and Pretraining** and contains the claimed
  material, so the suggestion is rejected.
- `reasoning-post-training-frontier`: formulas, semantic decision ladder, route
  links, and the VQA claim boundary passed.
- `rl-decision-system-contracts`: private/public fixtures, release contract,
  formulas, and links passed.
- `rl-safe-constrained-learning`: expected-cost math, CPO/Lyapunov/Recovery
  boundaries, and three distinct primary-source handoffs passed.
- `rl-imitation-offline-learning`: BC/DAgger, CQL/IQL, OPE/ESS arithmetic,
  fixture separation, and five evidence dimensions passed.
- `foundation-training-step`: ledger arithmetic and AI Foundations continuity
  passed in the accepted review.

## Fallbacks and Failures

Rejected Codex fallback headers:

- `[codex:gpt-5.5 · L3 · $0.0000 · 52091ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 61711ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 55899ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 57526ms]`
- `[codex:gpt-5.5 · L4 · $0.0000 · 294310ms]`
- `[codex:gpt-5.5 · L4 · $0.0000 · 233214ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 257095ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 251595ms]`
- `[codex:gpt-5.5 · L3 · $0.0000 · 271685ms]`

One `rl-safe-constrained-learning` retry returned only
`error: The operation timed out.` It had no response header and was rejected.
The later narrow request succeeded with the accepted Claude Code Sonnet header.
