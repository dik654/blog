# Object Detection Systems Content Spec

## Reader contract

The article starts from a deployment decision: a conveyor system needs six fixed defect classes at 60 FPS, while an offline media search tool must find arbitrary text concepts. The reader should be able to:

1. separate fixed-vocabulary detection from open-vocabulary grounding,
2. explain why a real-time D-FINE-style detector and Grounding DINO solve different product contracts,
3. trace image preprocessing, backbone features, query selection, decoder refinement and box restoration,
4. distinguish thresholding, NMS and bipartite set prediction,
5. identify where CLIP-like alignment helps but does not itself localize a region,
6. evaluate closed-set AP, zero-shot category slices, phrase grounding and device latency without mixing them,
7. pin artifact, preprocessing, vocabulary, prompt and postprocess versions in a release manifest.

## Current-first spine

1. Vocabulary decision: fixed class IDs or runtime text phrases.
2. Fixed branch: D-FINE as an open, reproducible real-time DETR case study, not an eternal SOTA claim.
3. Open branch: Grounding DINO as the canonical public grounding implementation; hosted 1.5/DINO-X claims remain separate deployment candidates.
4. Shared mechanism: multi-scale visual features, object queries and iterative box refinement.
5. Postprocess: confidence, duplicate handling and coordinate restoration are explicit.
6. Evaluation: class, localization, unseen concept, phrase and runtime slices.
7. Release: every critical gate passes; benchmark claims remain source-scoped.

## Source claim boundaries

- D-FINE paper and official repository establish FDR, GO-LSD and reported COCO/T4 results. Hardware, precision, batch, TensorRT and input size must accompany speed claims.
- Grounding DINO paper and official repository establish open-set detection from category names or referring expressions and the fusion stages. It is not the same as global CLIP retrieval.
- Grounding DINO 1.5 paper reports Pro and Edge results, but the public repository is API-oriented; do not imply open training weights/code equivalent to the original repository.
- DETR and Deformable DETR are the mechanism floor. Earlier R-CNN/YOLO history is optional context, not a prerequisite chain.

## Private transfer problem

A warehouse has two deployments. Camera A must detect six trained safety classes at 60 FPS on a fixed GPU. Camera B receives Korean free-text queries such as “파란 조끼를 입고 쓰러진 사람” and may run offline at lower throughput. Both see small objects, occlusion and letterboxed input. The reader must choose a branch, specify prompt/vocabulary handling, trace the query and box path, define AP/phrase/runtime slices, and reject a proposal that cites a latency number without the measurement contract.

## Formula contract

1. D-FINE distribution-to-distance expectation labels bins and probability in Korean.
2. Grounding score labels region-text alignment and threshold in Korean.
3. NMS/duplicate decision labels score and IoU roles separately.
4. Release is a conjunction, never a weighted average that hides a blocking failure.

Every display formula is followed by `FormulaNote`.

## Viz contract

### DetectionBranchLab

- Toggle fixed vocabulary and open vocabulary on one warehouse scene.
- Show input contract, model flow, output schema and operating tradeoff.
- No leaderboard table; each model is narrated as an execution path.

### DetectionDecisionLab

- Toggle keep, duplicate, unknown phrase and coordinate failure fixtures.
- Show confidence and overlap as separate measurements.
- Expose threshold/NMS/set-prediction responsibility without implying one universal threshold.

### DetectionReleaseGate

- Toggle box quality/small object, unseen phrase, device latency and manifest failures.
- Require source/model/device/preprocess/postprocess manifest fields.

## Small-model authoring packets

### 4B writer packet

One detector branch, one source excerpt boundary, one typed input, one output fixture, one metric and one Viz state.

### 9B writer packet

One end-to-end branch: user requirement, vocabulary contract, tensor/data flow, box decision, evaluation slice, runtime caveat and deployment handoff.

The orchestrator owns current-source verification, model comparison boundaries, multi-article continuity, browser QA and deployment.
