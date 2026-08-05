# LLM pre-training scaling · authoring contract

## Reader decision

Given a 4B and 9B candidate, a bounded training budget, a finite unique corpus and an expected lifetime serving load, decide which pilot runs are required before approving a full pre-training run. The reader must not answer from a memorized tokens-per-parameter ratio.

## Source and claim boundary

- Kaplan et al. (2020) establishes empirical power-law behavior, not a universal coefficient table.
- Hoffmann et al. (2022) is the minimum historical anchor for training-compute allocation and IsoFLOP reasoning.
- Sardana et al. (ICML 2024) adds inference demand and motivates smaller, longer-trained deployment candidates.
- Muennighoff et al. (2023) bounds claims about repeated data; its four-epoch observation is an experimental result, not a universal stop threshold.
- Roberts et al. (2026) and Xu et al. (2026) are current preprints. Mark their scope and do not promote them to settled production defaults.
- Data extraction, filtering, mixture and contamination belong to `llm-data-engine`. Batch, optimizer and checkpoint mechanics belong to `training-pipeline`.

## Private transfer problem

The article must provide enough insight to solve this without showing it as a quiz:

1. A team has 8 zettaFLOPs, 140B unique Korean/code tokens, an 8 GB deployment target and expects 100B generated tokens with best-of-4 verification.
2. Compute the training-token alternatives for 4B and 9B under the same dense `C≈6ND` approximation.
3. Explain why the cheaper inference of 4B can justify additional pre-training even after crossing a Chinchilla-like training-only point.
4. Compute corpus passes and define a stop gate using held-out loss, memorization and capability slices rather than training loss.
5. Design an IsoFLOP proxy matrix and identify which fields must remain fixed for N·D attribution.
6. State why the formula cannot approve the full run before post-training and measured serving evaluation.

## Narrative

1. Start with next-piece prediction and define pre-training, token, parameter and budget before presenting the 4B-versus-9B decision.
2. Do not repeat a jargon-dense route question in the shared header of the first article.
3. Start the technical decision from deployment requirements, not the history of scaling laws.
4. Separate N, D, training C, unique U, serving Q and samples k before introducing any ratio.
5. Reconstruct `C≈6ND`, an additive empirical loss model and the constrained optimum with Korean annotations inside every display formula.
6. Extend the budget to inference and test-time sampling.
7. Treat repeated data as a separate regime with a clean validation and memorization stop rule.
8. End with a full-run gate and explicit handoffs to the data engine and training pipeline.

## Visual contract

- Budget Lab must expose N, D, U, Q and k and show training versus inference compute without claiming exact hardware time.
- IsoFLOP Lab must make the inverse N·D trade-off visible and label its coefficients as a synthetic teaching fit.
- Full-run gate must keep all four stages visible at 390, 768 and 1440 pixels without arrows or clipped labels.
- No SVG canvas, wide table, inner horizontal scroll or auto-start animation.
- Color encodes ownership: blue training, emerald unique data, violet inference, amber warnings.
- Every selected state has a visible explanation and deterministic numeric oracle for browser tests.

## Small-model author contract

1. Never say 4B or 9B is universally optimal.
2. Separate model quality from total-cost feasibility.
3. State whether parameter counts include embeddings and whether MoE uses total or active parameters.
4. Treat tokens-per-parameter as a coordinate, not a pass/fail score.
5. Separate consumed tokens from unique tokens and record source-specific repetition.
6. Require pilot transfer checks at more than one scale.
7. Require post-training and actual serving measurement before full approval.
8. Mark 2026 sources as preprints and preserve their claim scope.
