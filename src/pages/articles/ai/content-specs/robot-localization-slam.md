# Robot Localization & SLAM content spec

## Goal

- Reader outcome: the reader can turn asynchronous wheel, IMU, camera, and LiDAR measurements into a locally smooth robot pose, a globally consistent map, and a planner-safe localization contract while diagnosing drift, correlation, observability, loop-closure, and rebase failures.
- System invariant: local control consumes a continuous `odom -> base_link` estimate; global planning consumes a versioned `map -> odom` correction and map snapshot; neither consumes an unqualified pose without acquisition time, frame direction, covariance, source lineage, and health state.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Motion, odometry, localization, mapping, and SLAM | deep distinction | These words describe different unknowns and contracts; mixing them hides which state can drift or jump. |
| Acquisition time, extrinsics, covariance, and correlation | deep | State estimation can only fuse measurements that refer to compatible states and whose information has not already been counted. |
| Dead reckoning and uncertainty propagation | deep | The reader must see why small heading error becomes lateral position drift and why covariance has direction. |
| Predict-correct filtering | deep at mechanism | Explain process/measurement models, innovation, Kalman gain, covariance, and rejection without duplicating the full Kalman paper article. |
| `map -> odom -> base_link` | deep operational contract | A single pose cannot be simultaneously smooth for control and jump-corrected for global consistency. |
| Scan/feature matching and observability | deep interface | The front-end produces relative-pose factors and information; it does not by itself guarantee the match is correct or fully constrained. |
| Pose/factor graph and gauge freedom | deep | The back-end preserves relative measurements, anchors the unobservable global frame, and solves all poses consistently. |
| Loop closure and robust outlier policy | deep | A true closure distributes drift; a false closure can fold the entire map. |
| Map correction, scene rebase, and localization health | deep | Downstream occupancy, objects, paths, and controllers need an atomic response to a changed global estimate. |
| Full EKF derivation, ICP variants, VIO preintegration, dense/neural SLAM | bridge only | Each deserves a dedicated paper or implementation article; this article owns the system contract joining them. |

## Existing-content gap audit

| Existing article | What it covers | Why this article is still needed |
|---|---|---|
| `robot-camera-geometry-calibration` | Converts pixels/depth to acquisition-time metric rays and points | Assumes a trustworthy camera/base pose and does not explain how that pose is estimated or corrected. |
| `robot-perception-scene-construction` | Builds tracks, occupancy, and an atomic PlanningScene | Treats map-frame sensor pose/covariance as input and explicitly defers SLAM. |
| `robot-kinematics-coordinate-frames` | Rigid transforms and TF composition | Does not distinguish locally continuous odometry from globally corrected localization or solve uncertain poses. |
| `robot-motion-planning` | Plans against a versioned collision scene | Assumes map consistency and does not define what happens after loop closure moves the world estimate. |
| `robot-dynamics-feedback-control` | State-space control, estimator/controller separation | Explains the estimator slot abstractly, not multi-sensor localization and mapping evidence. |

## Reader prerequisites

- Rigid transform composition and frame direction.
- Mean, covariance, Gaussian intuition, Jacobian, least squares, and matrix rank.
- Sampling, latency, and frequency response from signals and systems.
- Camera/LiDAR observation geometry and occupancy-scene provenance.

## Private hardest transfer problem

Do not publish this integrated problem as article filler. Use it as a completeness gate.

A differential-drive warehouse robot fuses 50 Hz wheel odometry, 200 Hz IMU angular velocity, 10 Hz spinning LiDAR scans, and occasional camera place-recognition constraints. Wheel slip begins on a polished floor. The LiDAR driver stamps a scan at its end although its beams were acquired over 100 ms, a long parallel aisle constrains lateral position and yaw but weakly constrains motion along the aisle, and the camera proposes a visually similar but wrong aisle as a loop closure. Later a geometrically verified true closure moves the optimized past trajectory by 0.8 m. At that moment the local controller is following a path, the occupancy map and semantic tracks were built from old poses, and the planner holds scene version 42.

The reader must be able to:

1. Separate control input, dead-reckoned odometry, localization in a known map, mapping with known poses, and joint SLAM unknowns.
2. State which sensor samples refer to which acquisition-time state and deskew a scan or reject it rather than transforming every beam with one end-time pose.
3. Write a differential-drive prediction, explain why heading bias produces lateral drift, and propagate anisotropic pose covariance.
4. Form an innovation in a common frame and unit, use covariance-weighted gating, and avoid treating a small residual as trustworthy when the covariance is wrong.
5. Detect double counting when wheel odometry is fused directly and also embedded in a visual-odometry source, or when correlated high-rate frames are treated as independent evidence.
6. Explain why `odom -> base_link` should remain locally smooth while `map -> odom` may change after global correction.
7. Turn scan/feature correspondences into a relative-pose residual and information matrix, while recognizing corridor degeneracy from the Hessian eigenstructure.
8. Construct a pose/factor graph containing a prior, sequential odometry factors, scan factors, and loop-closure factors.
9. Explain gauge freedom and anchor one pose without pretending the chosen world origin is a measured physical fact.
10. Minimize a covariance-weighted nonlinear objective by linearize-solve-retract iterations and distinguish a good residual minimum from a correct data association.
11. Reject or downweight the false visual loop using geometric verification, cycle consistency, switch/robust loss, and post-fit residual evidence rather than confidence alone.
12. Use the true loop closure to distribute correction across the trajectory and explain why incrementally baked point clouds cannot be repaired without retaining local frames or provenance.
13. Rebase occupancy, semantic tracks, goals, and paths against one map revision while preserving the continuous local control frame; invalidate scene version 42 before execution continues.
14. Publish localization health from freshness, covariance, innovation statistics, degeneracy, and loop-closure state, then degrade speed, relocalize, or stop when the contract fails.

The article passes only when each premise has visible public evidence and at least one interactive state makes the failure measurable.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Cadena et al., *Past, Present, and Future of SLAM*, TRO 2016 | SLAM jointly estimates robot state and an environment model; modern systems separate front-end data association from back-end inference and face robustness and scalability limits. | A survey organizes the field but does not certify one production architecture or parameter choice. | Establish vocabulary and the full estimation chain without tying SLAM to one sensor. | Unknowns/contracts table and front-end/back-end system map. |
| Smith, Self & Cheeseman, *Estimating Uncertain Spatial Relationships in Robotics*, 1990 | Spatial estimates require covariance and cross-correlation; compounding uncertain relationships propagates coupled error. | Gaussian first-order uncertainty can be inaccurate for large rotations, multimodal associations, and nonlinearity. | Explain directional drift and why reusing correlated information is unsafe. | Dead-reckoning covariance and correlation lab. |
| Kalman 1960 plus current `robot_localization` state-estimation docs | A dynamic model predicts state/covariance and measurements correct that prediction according to innovation and uncertainty. | EKF/UKF quality depends on model, timestamps, frames, covariance, and observability; a filter cannot repair bad semantics. | Give the local fusion mechanism and operational diagnostics. | Predict-correct Viz and innovation/correlation gates. |
| Nav2 current Concepts and REP-105 convention | `odom -> base_link` supplies a smooth local estimate that drifts, while positioning/SLAM supplies `map -> odom` to correct global drift. | Frame naming does not decide which estimator, sensor, or reset policy is valid. | Prevent global loop corrections from discontinuously steering the local controller. | Two-frame continuity Viz and downstream contract. |
| Lu & Milios, *Globally Consistent Range Scan Alignment*, Autonomous Robots 1997 | Preserve local scans and uncertain relative-pose relations, then estimate all poses simultaneously under a maximum-likelihood objective; one fixed pose removes reference ambiguity. | The paper assumes mutually independent Gaussian relation errors in its practical form, relies on correct pairwise matches/initialization, uses 2D stop-and-scan data, and explicitly excludes high-level map building. | Reconstruct the transition from incremental scan baking to pose-network optimization. | Pose graph, gauge, weighted objective, iteration, evidence, and dedicated paper article. |
| GTSAM factor-graph tutorial and current robust-noise documentation | Factors encode measurement likelihoods over variables; loop closure adds a nonlocal constraint; robust models whiten residuals then reduce outlier weight. | Software primitives do not validate measurements, select kernels, or guarantee convergence to the correct basin. | Connect the foundational paper to a modern implementation vocabulary and robust objective. | Factor-graph and robust-loop labs plus reproduction checklist. |
| Hornung et al., OctoMap 2013 and the preceding scene article | Map evidence is attached to sensor origins, rays, and poses; corrected poses require consistent regeneration or submap transformation. | OctoMap itself is not a SLAM optimizer and cell probabilities do not solve pose uncertainty. | Make loop closure consequences explicit for occupancy and PlanningScene. | Map rebase transaction and scene invalidation Viz. |

## Narrative sections

### 01. Decide what is unknown before choosing an algorithm

- Separate control/motion, odometry, localization, mapping, and SLAM by inputs, unknowns, and outputs.
- Show that `pose` is incomplete without frame, timestamp, covariance, and estimator lineage.
- Introduce gauge freedom: relative measurements cannot determine an absolute origin or heading.
- Viz: choose available map/pose/sensors and reveal which problem is actually solvable and which freedoms remain.

### 02. A measurement belongs to an acquisition-time state

- Build a measurement packet with stamp interval, sensor frame, extrinsic calibration, value, covariance, source id, and correlation group.
- Explain spinning-LiDAR deskew, rolling-shutter/readout analogies, delayed transforms, and out-of-sequence data.
- Distinguish transport arrival time from acquisition time.
- Viz: rotate during a scan and toggle end-time transform versus per-beam deskew; measure wall curvature and pose bias.

### 03. Dead reckoning predicts motion and grows directional uncertainty

- Derive planar differential-drive/unicycle prediction from forward velocity and angular velocity.
- Show how heading uncertainty rotates future translation into lateral error.
- Propagate covariance with motion Jacobians and process noise.
- Viz: adjust wheel slip and gyro bias; animate predicted path and uncertainty ellipse, report cross-track drift.

### 04. Fusion is predict, innovate, gate, correct, and account

- Define process model, measurement model, innovation, innovation covariance, Kalman gain, state update, and covariance update.
- Whiten residuals before comparing heterogeneous units.
- Gate impossible measurements and inspect normalized innovation squared over time.
- Preserve source lineage to prevent direct and derived versions of the same evidence from being counted twice.
- Viz: fuse wheel/IMU/absolute pose, change covariance and correlation policy, observe oscillation, overconfidence, or stable correction.

### 05. Smooth local motion and global truth need two transforms

- Reconstruct `map -> odom -> base_link -> sensor`.
- Explain why odom is continuous but drifts and map is globally corrected but may jump.
- Apply a loop correction to `map -> odom` while keeping `odom -> base_link` continuous.
- Viz: compare a one-frame estimator with split frames during a 0.8 m closure; report controller command jump.

### 06. The front-end creates constraints, not truth

- Show scan/feature matching flow: candidate association, geometric residual, local optimization, covariance/information estimate, acceptance gate.
- Explain observability via Hessian/information eigenvalues; a corridor can fit well while leaving along-corridor motion weakly constrained.
- Distinguish front-end local minimum, measurement uncertainty, and semantic correctness.
- Viz: change scene geometry from corner to parallel aisle and inspect the scan-match cost surface/eigenvalues.

### 07. The back-end solves a graph of uncertain relations

- Define variables, prior, odometry factors, scan factors, loop factors, residuals, covariance, and information.
- Build the MAP/weighted least-squares objective and explain whitening.
- Anchor one pose to remove gauge freedom, then linearize, solve the sparse system, retract, and repeat.
- Viz: drag odometry drift and add/remove loop closure; show all poses update rather than only the last pose.

### 08. A loop closure is a high-impact hypothesis

- Separate place-recognition proposal, geometric verification, covariance, graph insertion, robust weighting, and post-fit monitoring.
- Show that a Gaussian least-squares graph is highly sensitive to one false nonlocal edge.
- Introduce Huber/switchable constraints and cycle consistency as defenses, not proof.
- Viz: toggle true/false closure and Gaussian/robust/switch policy; measure map deformation and closure weight.

### 09. Global correction is a transaction for every downstream state

- Keep raw/local scans or submaps with pose provenance so optimized poses can regenerate or transform the map.
- Version the map, occupancy, semantic tracks, goals, paths, and PlanningScene against the same global revision.
- Preserve local controller continuity in odom while invalidating global plan/scene version and replanning.
- Define health gate: freshness, covariance, normalized innovation, observability, closure status, and revision agreement.
- Viz: issue a loop closure during path execution and compare baked map, partial rebase, and atomic transaction.

## Formula contract

- Display formulas: SLAM posterior/MAP objective, acquisition-time state, unicycle prediction, covariance propagation, innovation/covariance/gain, Mahalanobis/NIS gate, transform chain, relative-pose residual on SE(2), information/Hessian eigenvalues, factor-graph objective, gauge anchor, robust loss, and health/revision gate.
- Every display formula uses `String.raw`, Korean in-equation annotations, and a `FormulaNote` containing symbols, units, operation reason, and failure boundary.
- Long update and graph formulas split into aligned semantic rows. No display may scale below 0.75 at 360 px or require horizontal scrolling.

## Viz design contract

- Each Viz changes a causal variable and exposes a measurable consequence; motion may animate only to reveal acquisition/update order.
- Use dedicated mobile compositions when geometry labels would fall below 10 px. Spatial curves use SVG with round caps; explanations and metrics remain responsive HTML.
- Color roles: blue measurement/local prediction, violet graph/global correction, amber uncertainty/weak observability, emerald verified/consistent, red only rejected/outlier/stale/invariant failure.
- Use 1-3 px hierarchy, curved paths where physical motion/constraint propagation is shown, quiet grids, restrained fills, and no decorative animation.
- Verify initial, worst, and recovery states at 360, 390, 768, and 1440 px with no inner scroll, clipped labels, overlapping controls, or illegible math.

## Paper spine

1. Lu & Milios 1997: reconstruct local-frame preservation, weak/strong relation network, covariance-weighted maximum likelihood, gauge anchor, pose composition/linearization, global solve, iteration, experiments, and limitations.
2. Smith, Self & Cheeseman 1990: future uncertainty foundation for compounding/correlation after the probability path is strengthened.
3. Dellaert & Kaess factor graphs/iSAM family: future scalable smoothing paper after the foundational batch pose-network article.
4. Robust loop closure (switchable constraints/GNC): future robustness paper after residuals and graph optimization are established.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Distinguish estimation problems | Section 01 problem-contract Viz |
| Acquisition interval and deskew | Section 02 moving-scan Viz and wall-error metric |
| Drift and anisotropic covariance | Section 03 motion/covariance Viz |
| Innovation and covariance gate | Section 04 fusion Viz and NIS formula |
| Correlation/double counting | Section 04 lineage toggle and confidence metric |
| `map/odom/base_link` split | Section 05 continuity Viz |
| Front-end relative constraint | Section 06 matching flow and residual formula |
| Corridor degeneracy | Section 06 eigenvalue/cost-surface Viz |
| Factor graph construction | Section 07 graph reconstruction |
| Gauge freedom and anchor | Sections 01/07 anchor state |
| Linearize-solve-retract | Section 07 iteration ledger |
| False loop robustness | Section 08 robust closure Viz |
| Global correction of history | Sections 07/09 all-pose and rebase behavior |
| Atomic map/scene revision | Section 09 transaction Viz |
| Localization health response | Section 09 health gate and degraded/stop decision |

## Direct entry contract

- Open with the familiar experience of walking with eyes closed: adding steps estimates motion, while small errors accumulate.
- Define pose, odometry, localization, mapping, and SLAM in ordinary Korean before covariance, observability, pose graph, or loop closure appears.
- The first formal question follows the concrete sequence move -> drift -> recognize a place -> correct the path and map.
