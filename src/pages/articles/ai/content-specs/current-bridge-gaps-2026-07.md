# Current bridge gaps · 2026-07

## Intent

The supplied vocabulary list is not a request for one glossary page per term. It is a coverage audit. Existing routes already cover reasoning RL, interpretability, tokenization, hybrid SSMs, video runtime, control math, and CUDA fundamentals. Three missing bridges prevent those routes from being usable:

1. Transformer math -> GPU IO: FlashAttention, online softmax, Triton, fusion.
2. ViT classification -> object detection: DETR set prediction, deformable sparse multi-scale sampling.
3. OCR markup -> trustworthy tables: HTML AST, rowspan/colspan occupancy, grid invariants, conservative backfill.

## Bounded prerequisite cutoffs

- FlashAttention stops at tiled matmul, HBM/SRAM, warp occupancy. PTX/SASS is optional diagnostic depth.
- Deformable DETR stops at CNN feature maps, QKV attention, and set matching. The full R-CNN/anchor history is not a prerequisite.
- Table reconstruction starts after table detection and cell OCR. It does not repeat OCR model architecture.

## Private tests

### FlashAttention

Given a profile where FlashAttention improves only 1.1x, distinguish a small/fragmented shape, a compute-bound kernel, and an IO-bound materialized-attention baseline. The article must prevent the false claim that FlashAttention changes exact attention semantics.

### Deformable DETR

Given normal overall mAP but poor AP_small, use feature levels, learned offsets, K sampling points, and query assignment to decide what to inspect first. Calculate `Q * H * L * K` sample reads for `300 * 8 * 4 * 4`.

### HTML table reconstruction

Given one malformed row whose expanded width is short by one column, identify whether an active rowspan, a missing cell, or a wrong colspan caused the gap. The article must not permit invented cell text as “backfill.”

## Source and claim policy

- FlashAttention and FlashAttention-2 papers, the authors' repository, and official Triton docs define algorithm/runtime claims.
- DETR and Deformable DETR original papers define set prediction and sampling claims.
- PubTabNet/TEDS defines HTML tree evaluation; PaddleOCR documentation is used only as the current product anchor.
- Performance numbers are source-specific examples, not universal guarantees.

## Small-model reconstruction packet

For 4B-9B writers, provide only: target route, current question, prerequisite cutoff, one execution trace, one hard counterexample, primary-source excerpts, required equations, and forbidden claims. Generate prose after the trace and private test are fixed; generate visuals from the trace, not from style adjectives.
