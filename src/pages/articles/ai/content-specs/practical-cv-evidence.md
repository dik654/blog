# Practical CV evidence contract

## Editorial intent

These four articles are not model galleries or competition recipes. They teach one
repeatable decision process:

1. define what one prediction target and one independent entity are,
2. split by the strongest shared source that could leak,
3. build the cheapest baseline that could disprove the need for complexity,
4. add image, view, time, or forensic evidence one intervention at a time,
5. evaluate on the deployment shift that the system must survive.

The reader should be able to explain why a score changed, not merely reproduce a
backbone name or a fixed hyperparameter.

## Shared learning root

| Layer | Image classification | Multi-view | Video | Deepfake |
| --- | --- | --- | --- | --- |
| Prediction unit | image or entity | entity with a view set | clip or whole video | media asset / source video |
| Leakage group | subject, product, site, time | entity and capture session | source video, subject, event | identity, pristine source, manipulation lineage |
| Cheapest baseline | frozen or small image encoder | single-view and mean pooling | single frame and shuffled frames | spatial baseline on held-out source |
| Added evidence | augmentation, resolution, representation | missing-view mask and cross-view interaction | temporal order and longer horizon | generator, codec, capture, provenance |
| Release test | target site/time/device | missing or reordered views | full-video and target horizon | unseen generator/codec/capture family |

## Article contracts

### Image classification pipeline

- Start with the decision unit, group key, target metric, and untouched test.
- Explain augmentation as a label-preserving hypothesis, not a shopping list.
- Compare pretrained representations under one budget before changing the
  backbone, resolution, and training recipe together.
- Make TTA, pseudo-labeling, and ensembling optional interventions that must earn
  their complexity on validation evidence.
- End with a release bundle: manifest, calibration, slice metrics, and error
  gallery.

### Multi-view fusion

- Define whether camera/view order has semantic meaning.
- Represent one entity as a set or ordered tuple plus a validity mask.
- Establish single-view, mean/max pooling, and missing-view baselines.
- Introduce learned weighting and cross-view attention only when interactions are
  demonstrated.
- Require view-dropout, permutation, missing-view, and per-view ablations.

### Video understanding

- Define target horizon before sampling frames.
- Split by source video/entity/event before clipping.
- Compare single-frame, order-destroyed, and temporal baselines.
- Treat 3D CNN, SlowFast, divided attention, and masked video pretraining as
  different inductive-bias candidates, not a chronology that must be followed.
- Report clip-to-video aggregation, latency, coverage, and target-domain results.

### Deepfake detection

- Separate face-swap video forensics from general AI-generated media detection.
- Track identity, pristine source, manipulation method, generator, codec,
  resolution, and capture pipeline.
- Build an evaluation matrix with in-domain and leave-one-domain-out cells.
- Treat spatial, frequency, temporal, and pretrained semantic features as
  hypotheses whose usefulness can disappear under shift.
- Explain that detection, watermarking, and signed provenance answer different
  questions and should be combined rather than collapsed into one score.

## Formula policy

- Every displayed formula must have a Korean underbrace or an adjacent Korean
  meaning block.
- Symbols must be decoded directly below the formula.
- Avoid raw LaTeX in prose.
- Mobile rendering must fit 390 px without horizontal scrolling or a math scale
  below 0.80.

## Viz policy

The labs must change a decision, not decorate a paragraph:

1. `split-contract`: change the split key and reveal leakage.
2. `augmentation-contract`: change the transform and reveal whether the target is
   preserved.
3. `view-set`: change view semantics and missing views; update the fusion gate.
4. `temporal-sampling`: change horizon and stride; update event coverage.
5. `temporal-evidence`: compare single-frame, shuffled, and ordered evidence.
6. `forensic-generalization`: change held-out domains; update the release verdict.

All labs use stable grids, restrained accent colors, no SVG text, and no nested
decorative cards.

## Primary source boundary

- Group-aware split behavior: scikit-learn GroupKFold documentation.
- Shortcut learning: Geirhos et al. (2020).
- Robust augmentation example: AugMix (ICLR 2020).
- Set inputs: Deep Sets (NeurIPS 2017), Set Transformer (ICML 2019).
- Video candidates: SlowFast (ICCV 2019), TimeSformer (ICML 2021),
  VideoMAE (NeurIPS 2022).
- Deepfake benchmarks: FaceForensics++ (ICCV 2019), Celeb-DF (CVPR
  2020), DFDC, DeepfakeBench (NeurIPS 2023).
- General generated-image detection: UniversalFakeDetect (CVPR 2023).
- Operational provenance boundary: NIST AI 100-4 and C2PA specification.

Claims from a paper stay inside that paper's dataset, preprocessing, metric, and
date boundary. No fixed gain, threshold, backbone ranking, or ensemble count is
presented as a universal rule.
