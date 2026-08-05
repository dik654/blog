# Context Manager Claude gap reconciliation

Date: 2026-07-25 KST

## Objective

Context Manager의 과거 `500`, timeout, headerless 응답을 그대로 재실행하지 않는다. 기존 closure와
실제 파일 상태를 먼저 대조하고, 아직 accepted Claude 결과가 없는 bounded invariant만
`claude-code:sonnet`에 다시 보낸다. 첫 출력 header가 `[claude-code:sonnet`으로 시작하지 않으면
검증으로 인정하지 않는다.

## Excluded as already closed

- `2026-07-23-claude-review-final-identity-audit.json`: article identity 71/71 closed.
- `2026-07-23-claude-source-followup-closure.md`: Comfy Cloud, PaddleOCR, MinerU-Popo,
  animation/current-product source follow-ups closed.
- 2026-07-24 generative, practical, time-series와 2026-07-25 agent, RL/reasoning records:
  broad timeout invariants were already replaced by bounded accepted Sonnet reviews.

These exclusions prevented duplicate reviews from being mistaken for new product findings.

## Accepted review ledger

### Viz, GAN and ARIMA

Accepted first headers:

- `[claude-code:sonnet · L1 · $0.0000 · 27405ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 18366ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 40282ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 56229ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 51404ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 51099ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 76767ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 56645ms]`

All passed. The bounded targets were WGAN versus WGAN-GP source ownership, ADF, AICc and
Ljung-Box claims, runtime state derivation, computer-use retry receipts, and adaptation safety
verdicts. No accepted review remained open.

### Article content and shared paper template

- `[claude-code:sonnet · L2 · $0.0000 · 53323ms]`: found four medium issues in
  `stable-diffusion-open-models`.
- `[claude-code:sonnet · L2 · $0.0000 · 113581ms]`: mixed PASS and MUST FIX for the
  DeepSeek report template, so it was not used as a final verdict.
- `[claude-code:sonnet · L1 · $0.0000 · 13776ms]`: bounded rerun confirmed the
  `보고서이`, `보고서을` particle defect.
- `[claude-code:sonnet · L1 · $0.0000 · 34734ms]`: Stable Diffusion post-fix PASS.
- `[claude-code:sonnet · L1 · $0.0000 · 44812ms]`: shared paper-template post-fix PASS.

Repairs:

- Moved the U-Net Viz after the explanatory narrative.
- Split 512 to 1024 cost into latent locations `4x`, dense spatial self-attention score cells
  `16x`, and fixed-text cross-attention or fixed-channel convolution `4x`, with implementation
  caveats.
- Restricted `clip_skip` to pipeline mechanics and checkpoint-specific seed-locked A/B evidence.
- Bound Illustrious tag and multi-level caption claims to arXiv:2409.19946.
- Replaced suffix-sensitive document particles with neutral mixed-language sentences.

### High-level information architecture

Accepted headers:

- `[claude-code:sonnet · L1 · $0.0000 · 89424ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 101826ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 154897ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 73277ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 77171ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 96280ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 78630ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 140662ms]`

One broad registry call timed out after 180366 ms without a valid header. The bounded
`73277ms` packet replaced it.

The real product defect was not the path registry itself. `CategoryPage` bypassed the registered
generative paths and rendered a second, core-first `generativeCurriculum`. The fix removed this
duplicate renderer and data file. The generic sequence renderer now exposes:

1. `ai-generative-current-first`: five steps, current structure to minimum foundations.
2. `ai-generative-core`: four steps, distribution through VAE, GAN and Diffusion.

The RL parent description now includes state estimation. The LLM parent explicitly presents
reasoning feedback, pre-training data, interpretability evidence, device release and serving SLO
as five independent entry contracts. The final `140662ms` review passed with no remaining
must-fix.

## Formula closure

The fresh learning-flow audit initially found three AI blocker rows:

- LoRA live element substitution lacked a local `FormulaNote`.
- The shared LoRA file made the same issue appear under `multi-agent-implementation`.
- RLHF numeric reward-offset verification lacked a local `FormulaNote`.

The live LoRA equation and RLHF numeric verification now have Korean operation and boundary notes.
`data-formula-pair` is preserved for the interactive LoRA block. Final AI audit:

- articles: 284
- formula blockers: 0
- formula gaps: 0

The Stable Diffusion complexity formula was split after browser evidence showed a `0.54` mobile
scale. Final public scales are at least `0.86` at 390 px for that article, with 10 formulas and
10 notes.

## Verification

- ESLint: passed for all modified source and test files.
- TypeScript `--noEmit`: passed.
- `git diff --check`: passed.
- Focused Playwright: 34 relevant checks passed after current IA expectations were aligned.
- Generative route and top-down routes: 17/17 passed.
- Practical model adaptation and agent runtime: 7/7 passed.
- Production build: passed.
- `cm-blog.service`: restarted and active from `2026-07-25 17:48:40 KST`.
- Public and local asset identity: `assets/index-CL2ute1-.js`.
- Public 390/1440 checks: no horizontal overflow, raw LaTeX or console errors on generative,
  Stable Diffusion, RLHF, DeepSeek and LoRA routes.

## Reproducible 4B packet

A small worker receives one invariant, not an entire domain:

```yaml
target: stable-diffusion-open-models
invariant: resolution_cost_boundary
failed_attempt: optional prior request id or timeout
superseding_header: exact accepted claude-code header
evidence_slice:
  files: [one or two files]
  lines: bounded relevant region
source:
  primary_url: exact paper or official documentation
  supported_claim: one sentence
expected:
  mechanism: explicit operation order
  boundary: what the source does not prove
observed: concrete file or DOM evidence
status: pass | fail | contradictory
browser_oracle:
  widths: [390, 1440]
  overflow: <= 1
  raw_latex: false
  formula_note_pair: exact counts
```

The 4B worker may extract facts and compare one claim. It must not choose the global curriculum,
merge contradictory reviews, infer source identity, or declare deployment complete.

## Reproducible 9B review

The 9B reviewer receives several completed 4B packets and checks:

1. first-header provenance and replacement of failed calls;
2. duplicate targets and contradictory verdicts;
3. source ownership and claim boundary;
4. registry declaration versus actual rendered route;
5. prose before Viz and state-derived interactive output;
6. formula-to-Korean-note coverage;
7. mobile DOM evidence and public asset identity;
8. remaining must-fix list with no broad advice.

The orchestrator alone owns target selection, cross-route ordering, edits, tests, build, service
restart and public acceptance.

## Reasoning trace

`observed -> inference -> decision -> verification` was retained for each repair:

- A declared path was correct but absent from the DOM -> renderer bypass, not registry defect ->
  remove duplicate curriculum -> assert two path IDs and 5/4 link counts publicly.
- A formula fit at desktop but scaled to 0.54 on mobile -> one expression carried too many
  concepts -> split location growth from operator complexity -> verify scale, counts and overflow.
- A claim described community behavior without a primary source -> mechanism and model-specific
  effect were conflated -> keep official mechanics and source the model-specific data contract ->
  Claude source-boundary closure plus browser regression.

This record is the input for the later full implementation retrospective requested for 4B and 9B
models.
