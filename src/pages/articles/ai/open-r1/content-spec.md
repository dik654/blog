# Open-R1 implementation article specification

## Editorial contract

- **Reader goal:** Reconstruct one Open-R1 training batch from source data to saved checkpoint, rather than memorize a tool list.
- **Current evidence boundary:** Hugging Face `open-r1` commit `1416fa0cf21595d2083b399a2a0bbddd7f6e9563` (2026-04-02) and the official Open-R1 project posts.
- **Historical floor:** DeepSeek-R1 explains why pure RL, cold-start SFT, and multi-stage training are different experiments. Do not walk farther back unless PPO/advantage is the reader's blocker.
- **Implementation boundary:** The code sidebar contains compact teaching excerpts. Every excerpt must say that it is not a verbatim repository snapshot and must point to the official control flow it preserves.
- **Serving boundary:** Open-R1 owns training, rollout generation, evaluation launch, and checkpoint output. General production serving architecture belongs to the LLM serving path.

## Private transfer problem used to test article depth

Do not print this as a quiz. The finished prose and visualizations must provide every insight needed to solve it.

1. A batch has `P=8` distinct prompts, `G=16` completions per prompt, and `C=2048` maximum completion tokens. Compute the maximum sampled completion-token budget and explain why it is not the optimizer batch size.
2. For one simplified group with rewards `[1, 1, 0, 0]`, compute the population mean, standard deviation, and normalized advantages.
3. Repeat for `[1, 1, 1, 1]`. Explain why epsilon prevents division failure but does not create a learning signal.
4. A distilled model's chat template pre-fills `<think>` and omits the reasoning block from the returned completion. Predict which verifier fails and why higher model quality cannot repair the interface mismatch.
5. Accuracy reward rises while held-out pass rate and policy entropy fall. Decide whether to ship, and name the evidence needed before continuing training.
6. A code reward executes candidate programs on the trainer host. Identify the security boundary violation and redesign it using an external sandbox provider.

## Narrative spine

### 00. Snapshot and one-sample lifecycle

- Open with the question: “What exactly happens between one problem row and one policy update?”
- Separate the three project goals: reasoning-trace distillation, pure RL, and base-to-RL multi-stage reproduction.
- State that SFT is useful for distillation/cold start but is not a universal prerequisite for RL; R1-Zero is the counterexample.
- Show one lifecycle: source row -> conversation -> tokenizer contract -> G rollouts -> verifier vector -> group-relative advantage -> update -> checkpoint -> held-out evaluation.
- Explain the official 350k Mixture-of-Thoughts result as evidence, not as a generic leaderboard table.

### 01. SFT is a token contract

- Explain next-token loss only on serialized training tokens.
- Show why chat template and EOS token jointly determine the actual target sequence and stopping behavior.
- Trace official `sft.py`: parse config -> seed/checkpoint -> dataset/tokenizer/model -> fallback ChatML -> `SFTTrainer` -> save/eval/push.
- Treat recipe values as a reproducible snapshot for 8x H100, never as universal defaults.
- Failure cases: wrong EOS, template mismatch, truncation, sequence packing assumptions, topology change without global-batch correction.

### 02. GRPO batch ledger

- Show a small interactive four-completion group for arithmetic clarity and separately show the official recipe `G=16`.
- Annotate the group-relative advantage equation in Korean.
- Show the sampled-token upper bound `P * G * C` and distinguish rollout compute from optimizer examples, gradient accumulation, and world size.
- Show mixed, all-correct, and all-wrong states. Make zero variance visible without layout shift.
- Trace official `grpo.py`: dataset -> prompt conversation -> registry-selected rewards -> `GRPOTrainer` -> checkpoint lifecycle.
- Explain critic removal versus increased rollout generation cost.

### 03. Verifier registry and trust boundary

- Replace a hard-coded universal reward formula with a configuration-selected vector.
- Explain accuracy, format, tag count, reasoning-step, repetition, length, overlong punishment, and code execution as distinct contracts.
- Mark format/tag rewards as parser contracts, not proof of faithful reasoning.
- Show why invalid gold and parser exceptions need an observable quarantine path.
- Put code execution behind E2B/Morph/Piston-style sandbox providers. Never imply `exec` on the trainer is acceptable.
- Warn that correlated rewards double-count behavior and that length rewards can directly induce overthinking.

### 04. Data, evaluation, and runtime close the loop

- Data generation: teacher sampling -> verifier/pass-rate filtering -> immutable dataset version -> SFT or RL input.
- Evaluation: held-out prompts and fixed generation settings; separate capability, format compliance, diversity/entropy, token cost, and latency.
- Explain the official AIME/MATH/GPQA/LiveCodeBench result as a four-axis comparison. No table.
- Runtime: colocated vLLM for a single node versus a dedicated vLLM server on N+1 nodes. Show resource ownership and failure modes.
- Finish with stop/continue decisions and a bounded route back to PPO, statistics, or serving.

## Visual system

- Use restrained neutral surfaces with blue for data/control flow, amber for verifier decisions, teal for accepted signals, and rose only for failures.
- No nested cards, decorative gradients, dense SVG labels, or inner horizontal scroll.
- Use full-width bordered ledgers and compact milestones. At 390px every row becomes a vertical stack; at 768px comparisons may use two columns.
- All numeric blocks have stable dimensions. Interactive state changes must not move subsequent content.
- Motion explains execution order only. Respect reduced-motion preferences through existing Framer Motion behavior.

## Evidence ledger

- Open-R1 repository and README: project scope, scripts, recipes, runtime modes, benchmark result, chat-template warning.
- Official `src/open_r1/sft.py`: training lifecycle and save/eval behavior.
- Official `src/open_r1/grpo.py`: conversation construction, reward registry, trainer lifecycle.
- Official `src/open_r1/rewards.py`: selectable verifier registry and sandbox-backed code reward.
- Official SFT and GRPO recipes: snapshot values and topology assumptions.
- DeepSeek-R1 technical report: pure RL versus cold-start/multi-stage distinction and GRPO origin.

## Acceptance gates

- No article `<table>` elements and no blanket “SFT must come first” claim.
- No raw LaTeX text; every displayed equation has a Korean `FormulaNote`.
- Reader can calculate mixed/all-equal advantages and rollout token budget.
- Reader can diagnose chat-template/EOS mismatch and unsafe code-verifier execution.
- Article distinguishes official repository behavior from teaching excerpts.
- No horizontal overflow at 390, 768, and 1440 widths; no clipped formula or visualization label.
- Sidebar path reads current problem -> post-training foundation -> RL implementation -> data/pretraining -> interpretation -> efficiency -> serving.
