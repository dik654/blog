# CLIP Vision-Language Alignment Content Spec

## Reader contract

The reader starts from a concrete question: how can a new image be compared with text labels that were never used as a fixed classifier head? After reading, the reader can:

1. distinguish image/text encoders from a caption generator,
2. construct the batch similarity matrix and identify positive and in-batch negative pairs,
3. explain vector normalization, learned logit scale and symmetric contrastive loss,
4. build zero-shot class prototypes from prompt templates and calibrate them on held-out data,
5. distinguish global image-text similarity from region grounding and segmentation,
6. evaluate image retrieval with false-neighbor slices and domain reviewers,
7. decide when CLIP, SigLIP, DINOv2 or a domain-specific encoder should be compared.

## Current-first spine

1. Product use: arbitrary text labels and image retrieval require a comparable representation.
2. Training signal: paired images and text create a batch-wide matching problem.
3. Geometry: normalized directions become comparable logits.
4. Inference: prompt templates create class prototypes, not magical universal labels.
5. Boundary: global alignment does not localize a box or mask by itself.
6. Retrieval: top-K quality, false neighbors and provenance matter.
7. Release: split, prompt set, model revision and domain slice are pinned.

## Source claim boundaries

- The CLIP paper establishes natural-language supervision, symmetric batch contrastive learning and reported zero-shot transfer. It does not prove universal calibration or region localization.
- OpenAI CLIP code establishes the public reference preprocessing, tokenization and logit-scale implementation.
- SigLIP establishes a pairwise sigmoid alternative. It is a comparison candidate, not a claim that every CLIP use should migrate.
- DINOv2 is a self-supervised visual representation without the same text interface; compare it for visual neighborhood quality, not as an identical task.

## Private transfer problem

A wafer-inspection system has 40 text labels, including near-synonyms and visually similar but causally different defects. The holdout contains unseen lighting and two false-neighbor pairs. The reader must build prompt prototypes, compute and interpret the score matrix, avoid claiming localization, define retrieval metrics and reviewer slices, and reject deployment if average top-1 improves while the critical false-neighbor rate worsens.

## Formula contract

1. Similarity formula labels scale, direction match and normalization in Korean.
2. Symmetric contrastive loss labels image-to-text and text-to-image directions in Korean.
3. Prompt prototype labels template averaging and normalization in Korean.
4. Release formula labels alignment, calibration, retrieval and provenance gates in Korean.

Every display formula is followed by `FormulaNote`.

## Viz contract

### ClipAlignmentLab

- Four steps: paired inputs, batch matrix, shared space, zero-shot use.
- Use responsive HTML/CSS, not fixed-width SVG.
- The matrix visibly separates diagonal positives and off-diagonal negatives.
- The region step must state that global CLIP does not produce a box.

### RetrievalFailureLab

- Toggle correct neighbor, visual false neighbor and prompt shift.
- Show query, ranked results, metric impact and required next action.

## Small-model authoring packets

### 4B writer packet

One CLIP claim, one source boundary, one batch fixture, one equation, one Viz state and one evaluation oracle.

### 9B writer packet

One causal section from paired data through similarity/loss to zero-shot or retrieval behavior, including one failure boundary and release consequence.

The orchestrator owns source reconciliation, symbol consistency, prompt policy, transfer tests, browser QA and deployment.
