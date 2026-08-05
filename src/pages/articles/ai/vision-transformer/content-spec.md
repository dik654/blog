# Vision Transformer article contract

## Reader contract

- Reconstructs `image -> patches -> projection -> position -> attention -> task output`.
- Treats patch size as a token and memory budget, not a cosmetic preprocessing option.
- Separates architecture, pretraining objective, and downstream output contract.
- Compares global, windowed, and hierarchical information flow without a model leaderboard.

## Private transfer suite

1. Trace `B=2, 224x320x3, P=16, D=768` through patchify, projection, special-token insertion, QKV head reshape, and readout.
2. For a non-divisible `230x346` input, distinguish crop, pad, and partial-patch policies and their source-coordinate consequences.
3. Increase resolution `224 -> 384`, excluding the CLS slot while interpolating the `14x14 -> 24x24` patch-position grid.
4. For `B=2, 1024x1024, P=16, h=12, bf16`, calculate score bytes and separate projection, token-pair, and MLP costs.
5. Bound the ViT paper's ResNet/ViT/hybrid data-regime evidence to its `1.3M/14M/303M` conditions.
6. Compare classification CLS, CLIP pooled representation, and multimodal projected patch-token handoff.

## Formula contract

1. Patch count and raw patch dimension.
2. Projected sequence plus position embedding.
3. Scaled dot-product attention with Korean roles.
4. QKV/head tensor shapes.
5. Full block compute and materialized score-memory budget.
6. Readout and multimodal projector/context contract.

## Viz contract

- `PatchBudgetLab`: patch-size segmented control updates grid, token count, matrix size, and relative cost.
- `ViTShapeReadoutLab`: resolution and CLS/mean/dense readout update position interpolation and output tensor shape.
- `VisionBackboneLab`: control attention scope and hierarchical stage schedule as independent axes.
- No fixed SVG, benchmark table, or animation before content QA is complete.

## Small-model packet

### 4B

Use the ViT paper for patch sequencing and Swin only for window/hierarchy. Keep four equations and the 1024px transfer calculation. Do not add model rankings.

### 9B

Add position-interpolation caveats, class-token alternatives, dense-output boundaries, DINOv2 objective separation, production manifest fields, and target-device evidence.
