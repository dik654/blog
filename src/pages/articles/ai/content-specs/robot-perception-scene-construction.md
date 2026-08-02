# Robot Perception & Scene Construction content spec

## Goal

- Reader outcome: the reader can turn time-aligned RGB-D or point-cloud observations into persistent object tracks and a conservative planning scene, while diagnosing whether a failure came from pixel evidence, depth support, data association, free-space fusion, dynamics, uncertainty, or scene freshness.
- System invariant: a planner never consumes a detector output directly; it consumes an atomic scene snapshot whose geometry, object identity, occupied/free/unknown state, uncertainty, source time, transform provenance, and update policy are explicit.

## Beginner-entry contract (2026-08-01)

- Start from a phone drawing a face box: detection is what appeared in one image, not a persistent 3D world.
- Public render order is familiar scene -> what was seen -> where it is -> how it persists -> the detector/planner decision question.
- Define box, object outline, depth, and repeated identity in Korean before observation, support, association, occupancy, or PlanningScene becomes required vocabulary.
- Preserve every metric-support, tracking, occupancy, versioning, formula, source, and interactive evidence block after the bridge.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Observation contract | deep | A box, mask, depth image, and point cloud answer different questions and must retain acquisition frame/time and validity. |
| Detection, semantic segmentation, and instance segmentation outputs | deep at interface | The article explains output semantics, confidence, masks, overlap, and deployment failure, not backbone architecture. |
| Mask/depth to 3D evidence | deep | Planning geometry requires valid depth support, robust aggregation, organized-cloud semantics, and robot self-filtering. |
| Temporal prediction and data association | deep | Frame-by-frame detections do not provide persistent identity; association errors create teleporting or duplicated obstacles. |
| Track lifecycle and occlusion | deep | Tentative, confirmed, occluded, stale, and deleted are operational states, not display labels. |
| Point cloud, TSDF, occupancy, and object scene representations | deep comparison | Each representation preserves different facts; no single representation answers every planner query. |
| Inverse sensor model and free-space ray clearing | deep | An endpoint says occupied while the traversed ray says observed free; unobserved space remains unknown. |
| Log-odds occupancy fusion, clamping, and octree compression | deep | Repeated noisy observations must accumulate without making the map unable to change. |
| Static/dynamic semantic layers | deep | Moving tracks must not be burned permanently into a static occupancy map or cleared by one missed detection. |
| PlanningScene handoff | deep | Collision objects, attached objects, octomap, self-filter, allowed contacts, uncertainty inflation, and scene version must form one snapshot. |
| Detector architectures, stereo training, neural radiance fields, learned 3D occupancy | bridge only | Separate model articles should reconstruct these; this article owns the robot-state contract around their outputs. |
| Full SLAM and loop closure | defer | Camera/robot pose estimation is an independent prerequisite chain; here pose covariance is an input. |

## Existing-content gap audit

| Existing article | What it covers | Why this article is still needed |
|---|---|---|
| `robot-ai-top-down` | Orchard detection + segmentation + row fitting overview | Does not build persistent 3D world state or planner acceptance gates. |
| `robot-camera-geometry-calibration` | Pixel ray, depth/plane scale, frame/time, covariance | Ends at one metric observation and explicitly defers scene construction. |
| `multiview-fusion` | Early/late/attention fusion for multi-image classification | Does not use camera geometry, free space, tracking, occupancy, or PlanningScene. |
| `robot-motion-planning` | Collision checking against a scene snapshot | Assumes the scene already exists and is versioned. |

## Reader prerequisites

- Camera ray, depth semantics, acquisition-time transforms, and covariance from Robot Camera Geometry & Calibration.
- Rigid frames and homogeneous transforms from Robot Kinematics & Coordinate Frames.
- Probability, log odds, covariance, Kalman prediction intuition, and bipartite assignment.

## Private hardest transfer problem

Do not publish this problem as article filler. Use it as a completeness gate.

A wrist-mounted RGB-D camera observes a mug on a table while the robot arm crosses the image. The detector produces a high-confidence mug box, a lower-confidence instance mask after a hand partially occludes the mug, and a few background false positives. Depth is aligned to color but contains zeros on the glossy mug, mixed foreground/background pixels at the mask boundary, and points belonging to the robot itself. The camera and base transforms are correct at acquisition time. In the next frames the person moves the mug, the detector misses it once, and then returns a low-score box. The planner asks for a collision-free grasp path while the scene monitor is updating.

The reader must be able to:

1. State why a class box and score are observations, not persistent objects or collision geometry.
2. Distinguish semantic and instance masks, including what happens when two same-class objects overlap.
3. Intersect the instance mask with valid aligned depth, reject invalid/boundary points, and form a robust 3D support set rather than unprojecting only the box center.
4. Remove points explained by the current robot geometry before world fusion, without deleting an object merely because it is near the arm.
5. Predict existing tracks to the current acquisition time, gate detections by motion uncertainty and overlap/appearance, and solve one-to-one assignment.
6. Explain why a single confidence threshold fragments an occluded track and why ByteTrack's second low-score association does not make every low-score box a new object.
7. Maintain tentative, confirmed, occluded, and deleted lifecycle states with explicit hit/miss and age policies.
8. Separate static volumetric occupancy from dynamic tracked objects so a moved mug does not leave a permanent ghost obstacle.
9. Use sensor rays to mark traversed voxels free and endpoints occupied, while preserving unobserved space as unknown.
10. Fuse repeated free/occupied evidence in log odds with clamping, and explain the trade-off between noise rejection, adaptability, and compression.
11. Choose point cloud, TSDF, occupancy, and object primitives according to the planner query instead of treating them as interchangeable scene formats.
12. Inflate collision geometry from pose/shape covariance and reject stale or weakly observed objects rather than pretending point estimates are exact.
13. Publish one atomic PlanningScene version containing robot state, octomap, collision objects, attached objects, allowed contacts, transforms, source stamps, and provenance; replan when that version is invalidated.

The article passes only when each premise has visible public evidence and at least one interactive state makes the failure measurable.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| He et al., Mask R-CNN, ICCV 2017 | A mask branch can predict an instance mask in parallel with class and box branches; RoIAlign avoids quantization misalignment. | The paper does not make mask confidence a metric 3D occupancy probability and its reported speed/accuracy are model-era specific. | Establish why instance-level support is more useful than a box for object geometry. | Box/mask/depth evidence lab and output-contract ledger. |
| ROS 2 `sensor_msgs/PointCloud2` | A cloud carries acquisition stamp and frame; it may be organized like an image or unordered and can contain extra fields and invalid points. | Message layout does not validate units, alignment, density, or calibration. | Preserve frame/time/layout/validity while converting depth and masks to points. | Organized-cloud and invalid-depth gate. |
| MoveIt Planning Scene Monitor current docs | World geometry monitor accepts point clouds or depth images, maintains an OctoMap, and self-filters visible robot geometry. | The current MoveIt occupancy path does not use OctoMap's per-cell probability directly for collision checking and cannot infer semantic object identity. | Connect sensor evidence to the actual planner world and show why robot points must be filtered. | Self-filter and scene-handoff sections. |
| Bewley et al., SORT, ICIP 2016 | Efficient online tracking can combine Kalman prediction, IoU association, and Hungarian assignment; detector quality strongly controls tracking quality. | SORT's image-box constant-velocity model is a baseline, not a complete 3D dynamic-object model. | Reconstruct the smallest persistent-identity pipeline. | Predict-gate-assign-update lab. |
| Zhang et al., ByteTrack, ECCV 2022 | High-score detections are associated first; unmatched tracks can then recover occluded objects from low-score detections without spawning every background box. | MOT17 numbers and thresholds do not transfer directly to mugs, robots, or 3D scenes. | Show why thresholding is part of association policy, not proof of object existence. | Two-stage confidence association state. |
| Hornung et al., OctoMap, Autonomous Robots 2013 | Octrees with probabilistic occupancy explicitly model occupied, free, and unknown space; raycasting updates endpoints occupied and traversed cells free; bounded log odds enable adaptation and pruning. | The inverse sensor parameters are sensor/use-case dependent; paper datasets are mostly static and do not solve semantic tracking. | Build the foundational bridge from point measurements to collision-queryable volumetric state. | Ray update, log-odds/clamping, representation, and dedicated paper article. |
| OctoMap Sections 3.3-3.4 | Maximum child occupancy gives a conservative coarse query; stable equal children can be pruned and regenerated on contradictory evidence. | Coarse maximum aggregation is conservative, not an exact surface representation. | Explain resolution/safety/memory trade-offs and why hierarchy is more than storage. | Multi-resolution/pruning Viz in paper reconstruction. |
| Curless & Levoy, SIGGRAPH 1996 | Multiple aligned range images can be fused into a weighted signed-distance volume for incremental, order-independent surface reconstruction with directional uncertainty. | TSDF surface quality does not explicitly represent unknown versus observed-free space in the same planner-ready way as occupancy. | Contrast surface reconstruction with collision/free-space questions. | Representation chooser. |
| MoveIt Rolling `CollisionObject`, `AttachedCollisionObject`, `PlanningScene`, `PlanningSceneWorld` messages | World objects have frame, id, geometry and operation; attached objects move with a robot link and define touch links; PlanningScene bundles robot state, world octomap/objects, transforms and collision policy. | Message completeness alone does not provide atomic versioning, freshness, or covariance semantics; the application must enforce those. | Define the production scene snapshot and grasp attach/detach transition. | Planning-scene transaction lab and checklist. |

## Narrative sections

### 01. A model output is evidence, not world state

- Start from one mug box and ask whether the planner may avoid it.
- Define observation packet: source id, acquisition stamp, frame, calibration id, image/depth geometry, class distribution, score, mask/box, depth validity, covariance.
- Distinguish semantic mask, instance mask, box, keypoint, depth image, organized point cloud, and track.
- Explain that confidence is model evidence under its training distribution, not collision probability or persistent identity.
- Viz: toggle box/semantic/instance and depth present/invalid; show which planner questions remain unanswered.

### 02. Instance mask plus valid depth becomes a 3D support set

- Intersect mask with valid registered depth pixels and unproject each pixel at acquisition time.
- Reject zero/NaN/out-of-range depth and erode or downweight uncertain boundaries where foreground and background mix.
- Compare box-center depth, mean, median, trimmed support, and cluster consistency.
- Apply robot self-filter using current link geometry and distinguish self points from nearby external objects.
- Viz: mask contamination, depth holes, boundary erosion, robust estimator, and self-filter controls; report centroid bias and retained support.

### 03. Persistent objects require predict, gate, assign, update

- Track state includes id, class belief, pose/velocity, covariance, shape, source history, age, hits, misses, lifecycle state.
- Predict every track to the current acquisition time.
- Build cost from 3D innovation/Mahalanobis distance, IoU, mask overlap, and appearance; invalidate pairs outside gates.
- Solve one-to-one minimum-cost assignment, update matches, retain unmatched tracks as occluded, and initialize only qualified unmatched detections.
- Viz: two crossing objects and detections; adjust motion uncertainty, appearance weight, and threshold to expose ID switch or correct assignment.

### 04. Low confidence during occlusion is association evidence, not a new object

- Reconstruct SORT's single association baseline and ByteTrack's high-score then low-score matching.
- Explain why dropping every low-score box fragments tracks and why accepting every low-score box creates false objects.
- Use track prediction as context for a second-stage recovery; low-score unmatched boxes do not automatically spawn confirmed tracks.
- Define tentative -> confirmed -> occluded -> deleted transitions with hit/miss/time limits.
- Viz: confidence threshold and occlusion timeline; compare hard filter, two-stage recovery, false births, fragmentation, and ID continuity.

### 05. Choose a scene representation by the query it must answer

- Point cloud: preserves measured samples but does not encode observed-free versus unknown or bounded memory under repeated scans.
- TSDF: fuses surface distance and weights for reconstruction; useful for mesh/surface queries.
- Occupancy grid/octree: models free/occupied/unknown and collision/visibility queries with resolution trade-offs.
- Object scene: preserves identities, poses, semantics, dynamics, support relations, and grasp subframes but approximates geometry.
- Production scene is layered: static occupancy + semantic/object primitives + dynamic tracks + robot/attached geometry.
- Viz: choose query (collision, grasp handle, surface mesh, exploration, dynamic avoidance) and see which representations answer or lose required state.

### 06. A range measurement updates a ray, not only its endpoint

- From sensor origin to valid endpoint, raycast traversed voxels as observed free and endpoint voxel as occupied.
- Uninitialized cells remain unknown; absence of a detection is not free-space evidence.
- Define inverse sensor model and log-odds additive update.
- Explain same-scan conflict policy: endpoint occupied wins over another ray's free update when discretization collides.
- Viz: move sensor/endpoints and toggle endpoint-only versus ray update; show ghost occupied, free corridor, unknown region, and collision path result.

### 07. Bounded evidence keeps the map both stable and changeable

- Derive log odds and additive hit/miss evidence.
- Apply lower/upper clamping to bound how many contradictory observations are needed to change state.
- Explain threshold, noise rejection, dynamic clearing, and stable-child pruning trade-offs.
- Use conservative max-child occupancy for coarse collision queries and show resolution inflation.
- Viz: send hit/miss sequences, change clamp and resolution; report occupancy probability, flips-to-clear, node count proxy, and conservative collision result.

### 08. Static occupancy and dynamic objects need different lifecycles

- Do not permanently fuse moving people, carried mugs, or the robot itself into the static layer.
- A missed detector frame is not clearing evidence; use ray free evidence, track prediction, staleness policy, and explicit dynamic decay separately.
- Preserve occluded object covariance and grow collision margin with time.
- Use semantic identity for interaction/grasping, occupancy for unknown obstacle protection, and track state for motion prediction.
- Viz: move a mug, miss one frame, and receive a later free ray; compare monolithic map ghost, premature deletion, and layered correct behavior.

### 09. PlanningScene is an atomic safety snapshot

- Bundle robot state, fixed transforms, octomap, collision objects, attached objects, allowed collision matrix, padding, scene id/version, source stamps, and provenance.
- On grasp, remove/transition the mug from world object to attached object and allow only specified touch links.
- Inflate geometry using covariance and stopping/reaction margin; reject stale transforms, stale tracks, or scene versions.
- Plan against version N; before and during execution, detect invalidation and replan/stop rather than silently executing against N+1.
- Viz: scene transaction timeline with perception update, attach, plan, concurrent world change, version gate, and replan decision.

## Formula contract

- Display formulas: mask-depth support set, IoU, Mahalanobis gate, minimum-cost assignment, log odds, clamped update, ray inverse sensor model, occupancy-to-collision threshold, covariance inflation, and scene freshness bound.
- Every display formula uses `String.raw`, Korean in-equation annotations, and a FormulaNote that states symbols, units, operation reason, and failure boundary.
- Mobile mapping must split long assignment/log-odds formulas into meaningful aligned rows before allowing scale below 0.80.
- No formula may require horizontal scrolling or render raw commands.

## Viz design contract

- Every Viz exposes one invariant through controls and measurable output. Animation follows frame/time/ray/update order and never loops decoratively.
- Use dedicated mobile geometry when a 650-700 unit desktop scene would make labels smaller than 10 px. Put explanatory sentences in 12 px HTML captions.
- Use blue for measurements/predictions, violet for identity/association, amber for uncertainty/unknown, emerald for verified free/consistent state, and red only for false-clear, ID-switch, collision, stale, or invariant failure.
- Lines use round caps with 1-3 px hierarchy. Track paths and rays are strongest, grids and candidate relations are quiet, and selected assignment is distinct without thick bars.
- Numeric ledgers use stable one/two/four-column layouts. Long IDs and frame names wrap by phrase, not character.
- Verify initial, worst-case, and recovery states at 360, 390, 768, and 1440 px; test diverse controls, keyboard focus, no inner horizontal scroll, no SVG text clipping, and no overlapping rotated/moving objects.

## Paper spine

1. Hornung et al. 2013 OctoMap: reconstruct the free/occupied/unknown requirement, octree hierarchy, probabilistic log-odds update, clamping, pruning, multi-resolution queries, sensor-ray policy, evaluation, and boundaries.
2. Bewley et al. 2016 SORT: future dedicated tracking foundation after Kalman/data-association prerequisites; this concept article reconstructs the minimal mechanism and evidence boundary.
3. He et al. 2017 Mask R-CNN: future instance-segmentation paper under the CV foundation path; here it supplies the observation interface and RoI alignment rationale.
4. Curless & Levoy 1996: future TSDF/surface reconstruction paper if scene reconstruction is expanded beyond collision occupancy.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Box/score is not object state | Section 01 contract and evidence-capability Viz |
| Semantic versus instance identity | Section 01 overlapping-instance state |
| Mask + valid depth support | Section 02 support-set derivation and contamination lab |
| Robot self-filter | Section 02 link-geometry filter and retained-support metric |
| Predict/gate/assign/update | Section 03 equations and crossing-track lab |
| Low-score occlusion recovery | Section 04 two-stage association timeline |
| Track lifecycle | Sections 03-04 state transition ledger |
| Representation choice | Section 05 query-driven comparison Viz |
| Ray free/endpoint occupied/unknown | Section 06 inverse sensor model and ray lab |
| Log-odds clamping | Section 07 evidence sequence and flips-to-clear metric |
| Static/dynamic separation | Section 08 ghost-obstacle recovery lab |
| Uncertainty inflation | Sections 08-09 time/covariance margin |
| Atomic scene and attach transition | Section 09 scene transaction Viz |
| Version invalidation | Section 09 pre-execution and online gate |
