# Vision System Contracts Content Spec

## Reader contract

The article starts from a product failure, not a model name. A factory asks for “find every scratch and keep the same defect ID in video.” The reader must translate that sentence into observable outputs and gates. After reading, the reader can:

1. distinguish classification, detection, semantic segmentation, instance segmentation, promptable segmentation and tracking,
2. choose class, box, mask and stable identity outputs without asking one model to imply all of them,
3. map source pixels through resize, padding and crop coordinates and invert the transform,
4. explain score, IoU, duplicate suppression and set prediction as separate decisions,
5. read AP as an area under a precision-recall process rather than “average accuracy,”
6. design scenario slices for small objects, occlusion, camera cuts and unseen vocabulary,
7. define detector-to-segmenter-to-tracker handoff fields and a fail-closed release gate.

## Current-first spine

1. Product question: what decision must the downstream system make?
2. Output contract: class, box, mask and identity are different claims.
3. Coordinate contract: source, transformed input, feature and output coordinates must be invertible.
4. Decision contract: confidence and geometric overlap answer different questions.
5. Evaluation contract: aggregate AP never replaces scenario slices and calibration.
6. Handoff contract: detector proposes, segmenter refines and tracker maintains identity.
7. Release contract: geometry, task quality, runtime and provenance all pass.

## Source claim boundaries

- COCO establishes common object detection/segmentation tasks and AP-style evaluation. It does not define a universal production threshold.
- DETR establishes direct set prediction with bipartite matching. “End-to-end” does not mean preprocessing, coordinate inversion or release evaluation disappear.
- Segment Anything establishes promptable mask selection. A mask output does not by itself provide a semantic class or stable video identity.
- SAM 2 establishes promptable video segmentation with streaming memory. It does not guarantee recovery after every cut, occlusion or re-entry.

## Private transfer problem

A 3840×2160 rail-inspection video is center-cropped and resized to 960×960. The product requires every corrosion spot wider than 18 source pixels, a per-instance mask, and the same defect ID through a 37-frame machinery occlusion. Three nearby spots overlap in their boxes, one new spot appears after a line restart, and the model reports a high score for specular glare on a bolt.

The reader must choose task outputs, invert the coordinate transform, separate duplicate suppression from class confidence, define small-object and identity slices, specify detector/segmenter/tracker handoff, and decide release without hiding any failed gate behind mean AP.

## Formula contract

1. Source-to-model coordinate transform includes resize and padding with Korean underbraces.
2. IoU labels intersection and union in Korean.
3. Precision and recall label predicted/ground-truth responsibilities in Korean.
4. Release is a conjunction of geometry, task, identity and runtime gates.

Every display formula is followed by `FormulaNote`. Raw LaTeX never appears in prose.

## Viz contract

### TaskContractLab

- Select classification, detection, instance mask or tracking.
- Keep the same visual scene while changing only the asserted output.
- Show downstream question, output schema and a failure the output cannot answer.
- CSS grid and positioned HTML only; no fixed-width SVG and no horizontal scrolling.

### CoordinateTransformLab

- Select stretch, letterbox or crop fixtures.
- Show source dimensions, model dimensions, scale/padding/crop parameters and round-trip box.
- A wrong “scale only” inversion fixture must visibly fail.

### VisionReleaseGate

- Select geometry, small-object, identity or runtime failure.
- Show independent gates and fail-closed decision.
- Mean AP must remain visually separate from blocking slices.

## Small-model authoring packets

### 4B writer packet

One task output, one typed fixture, one transform, one metric oracle, one Viz state and exact mobile acceptance criteria.

### 9B writer packet

One full causal section: product symptom, output schema, coordinate transform, decision rule, failure slice, handoff and release consequence.

The orchestrator owns task taxonomy, source conflicts, symbol consistency, transfer tests, browser QA and deployment.
