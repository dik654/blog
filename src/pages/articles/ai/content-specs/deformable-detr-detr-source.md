# DETR (2020) source closure inside Deformable DETR

## Goal
- Existing `deformable-detr` article owns DETR's exact set-prediction floor before explaining the sparse multi-scale correction.
- Matching cost and training loss, no-object slots, parallel query execution, ablations and the small-object/convergence evidence must be distinguishable.

## Ownership
- `object-detection-systems`: current fixed/open-vocabulary production choice.
- `deformable-detr`: DETR canonical floor plus Deformable DETR's correction.
- No separate DETR article: the reader's causal question is continuous from set prediction to the bottleneck and fix.

## Section plan
1. Exact set construction:
   - N predictions, padded N targets with empty class.
   - Hungarian matching cost uses class probability and box similarity.
2. Exact training loss:
   - negative log class probability.
   - empty-class term down-weighted by factor 10.
   - box term only for real objects.
   - `L_box=lambda_iou L_GIoU + lambda_L1 ||b-b_hat||_1`.
3. Query execution:
   - CNN -> flattened image sequence -> encoder.
   - N learned object queries decoded in parallel, not autoregressively.
   - shared prediction FFN; auxiliary Hungarian loss at each decoder layer.
4. Evidence explorer:
   - DETR vs Faster R-CNN-FPN+: equal AP 42.0.
   - AP_small 20.5 vs 26.6.
   - AP_large 61.1 vs 53.4.
   - 300 epoch ablation and 500 epoch comparison schedule.
   - GIoU-only 39.9 AP, L1-only 35.8, combined 40.6.
5. Deformable correction:
   - keep existing dense-read bottleneck, sparse sampler and AP_small diagnosis.

## Authoring-only transfer problem
> 100 queries predict three objects. Six slots duplicate one large object while most slots predict empty. AP_small is low but AP_large is high. Decide which evidence belongs to matching, no-object weighting, query specialization, feature resolution and the later deformable sampler. Propose one ablation per cause.

## Viz contract
- A 4x4 assignment fixture must show one-to-one responsibility without requiring horizontal scroll.
- Matching cost and training loss use different labels and colors.
- Evidence explorer keeps metric family and source setup visible.
- 390 px has no clipped query labels or equations.

## Stop rule
The reader can compute an assignment and loss, explain parallel object queries and interpret the original AP/epoch/loss ablations. Hungarian algorithm implementation details and the full detector history are not prerequisites.
