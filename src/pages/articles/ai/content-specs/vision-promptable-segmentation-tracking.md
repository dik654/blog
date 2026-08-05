# Promptable concept segmentation과 video tracking content spec

## Goal
- 독자는 `텍스트·예시 이미지·점·박스`가 서로 다른 prompt 계약임을 구분하고, SAM 1 -> SAM 2 -> SAM 3 -> SAM 3.1이 어떤 실패를 하나씩 해결했는지 설명할 수 있어야 한다.
- 한 frame의 좋은 mask 점수만으로는 긴 video의 concept recall, object identity, occlusion recovery와 runtime cost를 보장하지 못한다는 사실을 detector -> tracker -> memory -> multiplex 실행 경로로 증명한다.

## Article ownership

| Surface | Ownership | Why |
|---|---|---|
| `vision-promptable-segmentation-tracking` | Promptable Visual Segmentation(PVS), Promptable Concept Segmentation(PCS), SAM 1/2/3/3.1 lineage, video memory, object multiplex, release evaluation | 최신 목표에서 필요한 계약을 한 흐름으로 닫는다. |
| `deformable-detr` | Set prediction, Hungarian matching, reference point, sparse multi-scale sampling, AP_small diagnosis | Detection operator의 깊은 구현 글로 유지한다. SAM 3가 DETR 계열이라는 이유로 두 글을 합치지 않는다. |
| `clip-vision-language-model` | Contrastive image-text representation, cosine similarity, zero-shot retrieval | SAM 3의 직접 구현 문서가 아니라 vision-language alignment의 재사용 기반이다. |
| `vision-transformer` | Patch token, attention backbone, image representation | PE와 detector를 읽기 위한 최소 backbone 기반이다. |
| `video-understanding` | Frame sampling, temporal representation, action/video classification | Object identity memory와 segmentation propagation을 소유하지 않는다. 선택 보강으로 연결한다. |
| `cnn`, `resnet` | Local receptive field와 residual backbone | Detection 경로에는 남기되 SAM 3.1 필수 선행 단계로 강제하지 않는다. |

## Source anchors

| Area | Paper / file / symbol | Why it matters |
|---|---|---|
| SAM 3 task | `SAM 3: Segment Anything with Concepts` §2-3 | PCS 입력과 출력, detector-tracker 결합 계약의 1차 근거다. |
| SAM 3 detector | SAM 3 §C.2 `Fusion Encoder`, `Decoder`, `Presence Head` | Global concept presence와 local object localization을 분리하는 이유를 증명한다. |
| SAM 3 video | SAM 3 §C.3 `Tracker`, `Periodic Re-Prompting` | Propagation drift, occlusion, distractor를 detector로 교정하는 경로를 증명한다. |
| SAM 2 memory | `SAM 2: Segment Anything in Images and Videos` §4 | Memory attention, memory encoder, memory bank와 object pointer의 최소 기반이다. |
| SAM 3.1 | SAM 3 Appendix H `Object Multiplex` | O(N) per-object memory path를 O(ceil(N/M)) bucket path로 바꾸는 현재 delta다. |
| Release evidence | `facebookresearch/sam3/RELEASE_SAM3p1.md` | 2026-03-27 release, 128-object speedup과 benchmark tradeoff의 공식 근거다. |
| Request lifecycle | `sam3/model/sam3_base_predictor.py` / `handle_request`, `add_prompt`, `propagate_in_video` | Session API와 model state의 실제 실행 순서를 고정한다. |
| Bucket identity | `sam3/model/multiplex_utils.py` / `MultiplexState.mux`, `demux`, `MultiplexController.create_multiplex_state` | Object index와 bucket-slot index가 섞이지 않는 invariant를 증명한다. |
| Shared memory | `sam3/model/video_tracking_multiplex.py` / `_encode_new_memory`, mux/demux call sites | Spatial memory는 공유하고 object pointer는 분리하는 구현 경계를 보여 준다. |

All repository claims must link to commit `46957e47805eaa273f4aa7bbbd25a88bca9108ce` or an official release page so later changes do not silently rewrite the evidence.

## Full-scope map

| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| Task contract | Semantic/instance segmentation, PVS, PCS의 input-output 차이 | deep | SAM 3 §2 | 용어 나열 대신 같은 장면에서 출력이 어떻게 달라지는지 보인다. |
| Lineage | SAM 1 prompt decoder -> SAM 2 streaming memory -> SAM 3 concept detector -> SAM 3.1 multiplex | deep | SAM 2 §4, SAM 3 §3/H | 연도표가 아니라 각 단계가 직전 단계의 어떤 실패를 해결했는지 연결한다. |
| Vision-language prompt | Text and exemplar tokens, PE, fusion encoder | deep | SAM 3 §C.2 | CLIP article로 내려갈 이유와 직접 구현의 차이를 구분한다. |
| Detection | Object query, presence token, mask/box output | deep | SAM 3 §3/C.2 | Deformable DETR의 sparse operator는 별도 글로 넘긴다. |
| Tracking | Detect, propagate, match/update, spawn, suppress, re-prompt | deep | SAM 3 §3/C.3 | 높은 mask IoU가 identity 유지와 다름을 보인다. |
| Memory | Spatial memory, object pointer, occlusion score, selected frame retention | deep | SAM 2 §4, SAM 3 §C.3 | Memory를 단순 frame cache로 설명하지 않는다. |
| Object Multiplex | Fixed-capacity bucket, shared spatial memory, object embeddings, mux/demux | deep | SAM 3 Appendix H, official source | `16개가 최대`가 아니라 기본 예시 bucket capacity임을 명확히 한다. |
| Evaluation | J, F, cgF1, pHOTA, throughput/latency/VRAM | deep | SAM 3 §E/F, release notes | 하나의 평균 점수로 release하지 않는다. |
| Failure diagnosis | hard negatives, nested/ambiguous concepts, occlusion, distractors, identity swap, long-video memory, OOM | deep | SAM 3 §2/C/H | 입력 오류와 tracker 오류와 runtime 오류를 분리한다. |
| Implementation | start session -> add prompt -> propagate -> refine/reset/close | deep | `sam3_base_predictor.py` | 공개 API가 허용하는 상태 전이를 설명한다. |
| Training data engine | 4M concept labels, hard negative mining, model/human/AI annotator loop | brief | SAM 3 §4 | 학습 전체 recipe는 별도 article 후보로 defer한다. |
| Fine-tuning | Niche concept/domain adaptation boundary | brief | official Meta SAM 3 page | zero-shot을 만능으로 표현하지 않는다. |
| SAM 3D | Explicit defer | Meta SAM 3D | 2D/temporal mask 계약과 다른 3D reconstruction 경로다. |

## Reader prerequisites
- `Mask`: 각 pixel이 target object에 속하는지를 나타내는 2D binary field.
- `Object identity`: frame이 바뀌어도 같은 실제 물체에 같은 ID를 유지하는 계약.
- `Embedding`: image, text 또는 object의 특징을 비교 가능한 vector로 바꾼 표현.
- `Attention`: query가 현재 판단에 필요한 token이나 memory 위치를 가중합하는 연산.
- 선택 보강: ViT patch token, CLIP contrastive alignment, DETR object query. 본문 안에서 먼저 직관을 주고 상세 글로 내려간다.

## Authoring-only transfer problem

The public article must not print this prompt verbatim. It is the depth audit.

> 20-minute factory video contains 37 near-identical parts. A text prompt selects all red safety caps. Objects overlap, leave and re-enter, and a camera cut occurs. The system has high frame-level mask IoU but misses absent/present decisions, swaps eight identities, duplicates masks after re-entry, exceeds 24 GB VRAM, and falls below 15 FPS. Design the prompt contract, detector/tracker split, memory admission policy, object multiplex layout, correction flow, evaluation slices and release gate. Explain which failures cannot be fixed by increasing mask decoder accuracy.

The finished prose is sufficient only if a reader can derive all of these:
1. Text PCS must find every matching instance, while a point PVS selects/refines an individual instance.
2. Presence, localization, association and mask quality are distinct errors and require distinct metrics.
3. Occluded/low-confidence frames must not blindly enter memory; reliable detections can periodically re-prompt propagation.
4. N objects with bucket capacity M require ceil(N/M) memory-path bucket passes, while object-specific embeddings preserve identity through mux/demux.
5. Camera cuts, re-entry and similar distractors require explicit sequence slices and correction/reset behavior, not only average J&F.
6. Runtime release requires throughput, latency and peak VRAM at the intended object count and video length.

## Section 1: 네 segmentation 문제를 먼저 분리한다 -- prompt가 무엇을 고정하는가?
- Concept: semantic segmentation, instance segmentation, PVS and PCS differ by target selection and output cardinality.
- Execution flow:
  1. Show one crowded frame and four prompt types.
  2. Reveal one class mask, per-instance masks, one visually selected object, then every concept-matching object.
  3. Keep the same pixels so only the task contract changes.
- Design insight: “segment anything” is ambiguous unless the prompt and output multiplicity are explicit.
- Failure mode: Treating text as a click can return one plausible cap instead of all caps.
- Viz plan: interactive task-contract switch with stable frame, prompt, output count and failure statement.

## Section 2: 계보는 기능이 아니라 실패를 따라간다 -- 무엇이 다음 모델을 필요하게 했나?
- Concept: SAM 1 solves promptable image masks; SAM 2 adds temporal memory; SAM 3 adds open-vocabulary concept detection; SAM 3.1 changes multi-object runtime.
- Execution flow:
  1. SAM 1: click -> image embedding -> mask decoder.
  2. SAM 2: add memory attention/encoder/bank and streaming frames.
  3. SAM 3: add concept detector, presence head and detector-tracker association.
  4. SAM 3.1: group object memory paths into buckets.
- Design insight: the minimal canonical cutoff is SAM 1, not every prior segmentation paper. ViT and contrastive alignment are just-in-time prerequisites below it.
- Viz plan: four-stage contract ladder. Each next action starts from the visible failure of the previous stage.

## Section 3: concept를 찾는 detector -- 전역 존재와 국소 위치를 왜 분리하나?
- Key variables:
  - `I_t`: frame t.
  - `P`: short noun phrase or exemplar prompt.
  - `q_i`: local object query.
  - `p_present`: concept exists somewhere in the frame.
  - `p_local_i`: query i matches the concept given presence.
- Formula:
  - `p(query_i matches P) = p_local_i * p_present` with Korean underbraces inside KaTeX.
- Execution flow:
  1. PE encodes image and text; exemplar encoder produces exemplar tokens.
  2. Fusion encoder conditions frame embeddings on prompt tokens.
  3. Object queries localize boxes/masks; presence token reads global context.
  4. Multiply the two probabilities to gate local proposals.
- Design insight: forcing local queries to also establish global absence increases false positives and conflicts with localization.
- Failure modes: hard negative phrase, niche domain, nested instance and ambiguous phrase.
- Handoff: contrastive alignment -> CLIP article; object query/matching -> Deformable DETR article.

## Section 4: video에서 identity를 유지한다 -- detector와 tracker가 언제 서로 교정하나?
- Formula:
  - `M_hat_t = propagate(M_{t-1})`, `O_t = detect(I_t, P)`, `M_t = match_and_update(M_hat_t, O_t)`.
  - Every operator gets a Korean underbrace and a FormulaNote explaining why the split exists.
- Execution flow:
  1. Detector spawns matching object masklets.
  2. Memory attention conditions the current frame on spatial memories and object pointers.
  3. Occlusion score decides visibility and memory admission.
  4. IoU matching associates detections with propagated masks.
  5. Reliable detections periodically replace drifted tracker masks; unmatched detections spawn new masklets.
- Design insight: detector recovers concept recall; tracker preserves temporal identity. Neither subsumes the other.
- Edge cases: occlusion, disappearance/reappearance, visually similar distractor, camera cut and bad memory feedback.
- Viz plan: frame scrubber with object A/B, memory admission, identity swap counter and re-prompt action.

## Section 5: Object Multiplex -- 무엇을 공유하고 무엇을 끝까지 분리하나?
- Key variables:
  - `N`: tracked object count.
  - `M`: fixed bucket capacity, example 16.
  - `B = ceil(N/M)`: number of bucket memory-path passes.
  - `E_obj`: object-specific embedding/pointer.
- Formula:
  - `B = ceil(N/M)` and `memory-path passes: N -> ceil(N/M)` with Korean labels.
- Execution flow:
  1. Assign object indices to fixed-capacity bucket slots; pad unused slots.
  2. Mux object masks into bucket space.
  3. Encode one shared spatial memory per bucket.
  4. Preserve per-object embeddings alongside memory.
  5. Demux predictions back to stable object indices.
- Invariant: `demux(mux(x))[valid_objects] == x` and padding never becomes a real object.
- Design insight: sharing spatial work reduces redundant compute; merging identity state would create swaps.
- Viz plan: object-count slider 1..128, capacity 16, bucket visualization, pass comparison and one occluded object. Use semantic colors only for shared memory, identity and warnings.

## Section 6: 평균 mask score로 release하지 않는다 -- 어떤 metric이 어떤 실패를 잡나?
- Metrics:
  - `J`: region overlap (IoU).
  - `F`: boundary accuracy.
  - `cgF1`: phrase presence/classification gate times mask F1 in the official benchmark definition.
  - `pHOTA`: phrase-conditioned detection and association quality across time.
  - runtime: throughput, p50/p95 latency, peak VRAM by N and video length.
- Design insight: quality and efficiency can move in different directions. SAM 3.1 official results are mixed across video benchmarks even while runtime improves.
- Release matrix: presence, mask, identity, recovery and runtime each need a gate and scenario slice.
- Failure mode: quoting only the ~7x/128-object result as universal speedup.

## Section 7: 공개 API로 재현한다 -- session state를 어떻게 관리하나?
- Source anchors:
  - `Sam3BasePredictor.handle_request`
  - `start_session`, `add_prompt`, `propagate_in_video`, `remove_object`, `reset_session`, `close_session`
- Execution flow:
  1. Load checkpoint and start a session for a JPEG folder or MP4.
  2. Add text or point prompt at an explicit frame index.
  3. Stream propagation outputs and retain object IDs.
  4. Add correction prompt, remove object or reset state.
  5. Close session and release state.
- Failure modes: unsupported environment, checkpoint/code mismatch, unbounded session state, silent object-ID remap and OOM.
- Release checklist: pin commit/checkpoint, record prompt/frame/object count, validate mux/demux identity, profile target GPU, keep a rollback path to non-multiplex behavior.

## Cross-section narrative
- The prompt contract determines whether the system should return one object or all matching objects.
- The detector answers “what and where now”; the tracker answers “is it the same object over time”.
- Memory fixes temporal continuity but creates stale-state and per-object cost risks.
- Multiplex reduces the shared part of that cost without erasing object identity.
- Evaluation mirrors the same decomposition: concept presence, spatial mask, temporal association, recovery and runtime.

## Viz implementation constraints
- No generic network-box diagram. Each interaction changes a visible input, state or invariant.
- Mobile width 390 px must have zero document overflow and no horizontal scrollbar inside Viz.
- Avoid long labels inside SVG. Prefer DOM grid/flex layout with `minmax(0,1fr)`, `min-w-0`, `break-words`.
- Fixed controls use stable dimensions. Slider movement must not resize surrounding panels.
- Black/white surfaces remain primary; use blue for prompt/detection, emerald for valid identity/memory and rose/amber only for failure/warning.
- Do not use thick colored rails, gradients, nested cards or oversized empty canvases.
- Animation must respect `prefers-reduced-motion`; state change remains understandable without motion.

## Coverage recheck

| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| Task and prompt multiplicity | 1 | none | Same scene comparison. |
| Minimal lineage cutoff | 2 | none | Stop at SAM 1; link just-in-time foundations. |
| Text/exemplar concept detector | 3 | none | Presence/localization formula and failures. |
| Temporal memory and identity | 4 | none | Admission, occlusion, re-prompt and association. |
| Multi-object runtime | 5 | none | Bucket math and mux/demux invariant. |
| Evaluation and release | 6 | none | Quality plus systems metrics and slices. |
| Reproducible implementation | 7 | none | Actual public request lifecycle and pinning. |
| Full training recipe | deferred | intentional | Separate data-engine article only if the track later needs training ownership. |
| 3D reconstruction | deferred | intentional | Separate SAM 3D / world representation path. |
