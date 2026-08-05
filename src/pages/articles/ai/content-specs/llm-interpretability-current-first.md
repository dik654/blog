# LLM Interpretability · Current-first reconstruction spec

## Goal

최신 interpretability 도구 이름을 나열하지 않는다. 독자가 모델 내부의 한 신호를 보고도 곧바로 “이것이 원인이다”라고 결론내리지 않고, 관찰에서 개입과 반복 검증까지 증거 강도를 올릴 수 있게 한다.

```text
현재 연구가 주장하는 것과 아직 증명하지 못한 것
-> residual stream에서 무엇을 읽을 수 있는가
-> dense activation을 sparse feature dictionary로 어떻게 근사하는가
-> attribution으로 가설을 좁히고 intervention으로 인과를 검증하는가
```

## Ownership map

| Article | Deep ownership | Bridge only | Deferred |
|---|---|---|---|
| `llm-interpretability-frontier` | 2025-2026 evidence ladder, Gemma Scope 2, circuit tracing, J-lens, claim strength | method names | complete safety proof |
| `llm-interpretability-readouts` | residual stream, attention map, activation, logits, token distribution, vocabulary filtering, Logit/Tuned/Jacobian lens | probe and steering handoff | every lens variant |
| `sparse-autoencoder` | superposition hypothesis, encoder/decoder, sparsity-reconstruction tradeoff, feature labeling, steering caveat | transcoders | every SAE architecture benchmark |
| `llm-circuit-analysis` | activation patching, ablation, attribution patching, replacement model, attribution graph, causal controls | attention QK tracing | full frontier-model audit |

## Source and intent ledger

| Source | Supported claim | Does not prove | Article use |
|---|---|---|---|
| Anthropic Circuit Tracing, 2025 | Cross-layer transcoder replacement models can produce prompt-specific attribution graphs and can be validated post-hoc | Replacement model automatically uses the same mechanism as the original | frontier, circuits |
| Anthropic Attention QK tracing, 2025 | Feature interactions can extend attribution tracing through attention computations | Every attention weight is an explanation | circuits |
| Google DeepMind Gemma Scope 2, 2025 | SAEs, skip/cross-layer transcoders are released across Gemma 3 layers for behavior analysis | A discovered feature label is a complete causal account | frontier, SAE |
| Anthropic Jacobian Lens, 2026 | An averaged Jacobian supplies a fixed per-layer map from activations to vocabulary-disposed readouts | A ranked token list is literal hidden prose or exact per-prompt attribution | frontier, readouts |
| Belrose et al. Tuned Lens, 2023 | Per-layer affine translators reduce geometric mismatch and improve intermediate vocabulary prediction | A trained probe is necessarily the representation the model uses | readouts |
| Jain & Wallace, 2019 | Different attention distributions can preserve outputs and attention may disagree with other importance measures | Attention is never useful for any diagnostic | readouts |
| Bricken et al., 2023; Templeton et al., 2024 | Sparse dictionaries can yield more interpretable directions than individual neurons and steering can affect behavior | Every feature is monosemantic, complete, or safe to steer | SAE |

## Section contracts

### 1. Current frontier

- Start with one behavior and five evidence levels: output, readout, decomposition, attribution, intervention.
- Explain why `readable` is not `causal` and `causal on examples` is not `complete`.
- Show which 2025-2026 tools move which rung.
- Viz: evidence-ladder explorer. User changes method and sees the strongest claim it licenses and the missing control.
- Viz: failure-pair explorer. Same top token but different downstream mechanism, or same attention pattern but unchanged output.

### 2. Readouts

- Define token position and layer indexed residual stream `h_l,t`.
- Separate attention weights, activation coordinates, logits, probabilities and selected tokens.
- Logit lens: model unembedding directly applied to normalized intermediate state.
- Tuned lens: learned affine translator corrects layer geometry; useful prediction is still a probe result.
- Jacobian lens: corpus-averaged downstream Jacobian maps present activation toward present/future verbalization tendencies.
- FormulaNote after every display equation; explain norm, affine map, softmax, average Jacobian and top-k filtering.
- Viz: layer trajectory. Compare logit/tuned/Jacobian readouts and inspect entropy/top-k, without calling the result hidden CoT.
- Viz: attention counterexample. Change weights while preserving weighted value sum to demonstrate why weights alone do not identify output cause.

### 3. Sparse feature dictionaries

- Replace the existing article rather than append another list.
- Residual vector `x` is approximated by `x_hat = b + sum_i f_i d_i`.
- Explain reconstruction and sparsity as competing objectives.
- `L1` or Top-K makes few features active; it does not guarantee one human concept per feature.
- Explain dead features, feature splitting, absorption, reconstruction error and auto-label uncertainty.
- Steering is an intervention but may be off-distribution; effect size, specificity and controls are required.
- Viz: reconstruction-sparsity explorer with adjustable lambda/top-k and visible residual error.
- Viz: feature evidence explorer from top activations to label to steering and counterexample.

### 4. Causal circuits

- Define clean/corrupted runs and activation patching.
- Explain patch effect metric and why the corruption pair defines the question.
- Use attribution patching only as a gradient approximation for triage; confirm candidates with exact intervention.
- Explain replacement-model error nodes and mechanistic-faithfulness limitation.
- Attribution graph is a prompt-specific hypothesis graph, not the original network's complete source code.
- Viz: patching lab with clean/corrupted/patch state and restored logit difference.
- Viz: graph pruning explorer showing threshold, omitted mass and verification state.

## Private transfer tests

### A. Same attention, different cause

Two heads have similar attention maps over subject tokens, but patching one head restores the correct answer and patching the other does not. Explain why visual similarity was a candidate signal, not causal evidence, and design the minimum controls needed before naming a circuit.

### B. Probe accuracy without model use

A tuned lens decodes `Paris` at layer 12 with 94% accuracy. Ablating the decoded direction leaves the final answer unchanged, while another weakly decoded direction changes it. Decide what was represented, what was used, and which claim must be withdrawn.

### C. Faithful-looking attribution graph with replacement error

A cross-layer transcoder attribution graph is compact and its nodes have clear labels, but the replacement model preserves only 82% of the target logit difference and an error node carries 31% of incoming attribution. Decide what the graph can support, what intervention to run on the original model, and why a human-readable graph is not yet a faithful mechanism.

## Acceptance gates

- A reader can answer all three private tests using article prose only.
- No article equates attention, probe output, feature label, attribution or intervention.
- No claim says SAE guarantees monosemantic features or complete coverage.
- Every formula has Korean operation-choice notes.
- Viz uses responsive HTML or readable SVG; no default horizontal scroll, clipped labels or sub-9px SVG text.
- Desktop 1440, tablet 768 and mobile 390 screenshots are inspected.
- Route order and cross-links are current -> readout -> SAE -> circuit.
