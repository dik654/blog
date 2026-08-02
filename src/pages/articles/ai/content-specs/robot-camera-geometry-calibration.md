# Robot Camera Geometry & Calibration content spec

## Goal

- Reader outcome: the reader can turn a distorted image observation into a metric ray or 3D point, carry it into the robot base frame at the image acquisition time, and diagnose whether the dominant error came from intrinsics, distortion, hand-eye extrinsics, depth, or synchronization.
- System invariant: every visual measurement entering planning carries a calibrated image model, image size and ROI, source frame, acquisition timestamp, metric-depth contract, transform direction, uncertainty, and validation result.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Pinhole projection and homogeneous scale | deep | A pixel determines a camera ray, not a unique metric point. This is the first missing bridge from perception to kinematics. |
| Intrinsic matrix K and normalized image coordinates | deep | Focal length and principal point define the mapping between pixels and rays; resize or crop silently changes that contract. |
| Radial and tangential distortion | deep | Edge observations can be systematically wrong even when the image center and global RMS look acceptable. |
| Planar multi-view calibration | deep | Zhang's homography constraints explain why tilted views identify intrinsics and parallel views do not. |
| Reprojection residual and validation | deep | One aggregate RMS cannot expose edge bias, weak poses, bent targets, or deployment drift. |
| Per-view extrinsics versus fixed hand-eye extrinsic | deep | Confusing target-to-camera pose with camera-to-gripper calibration produces plausible but wrong frame chains. |
| Hand-eye AX=XB and motion diversity | deep | The fixed camera mount is observable only when robot motions excite independent rotations. |
| Timestamp, motion delay, and rolling shutter | deep | A correct spatial transform evaluated at the wrong time produces a wrong world point; one image may also contain multiple row times. |
| Depth and ray-plane intersection uncertainty | deep | Metric localization requires depth or another geometric constraint, and shallow intersections amplify pixel error. |
| Detection, segmentation, stereo, and learned depth | bridge only | The next independent article, Robot Perception & Scene Construction, will turn image evidence into objects, depth, and planning-scene state. |

## Reader prerequisites

- Vector and matrix multiplication, inverse, least squares, SVD, and condition number intuition.
- Homogeneous rigid transforms and frame direction from Robot Kinematics & Coordinate Frames.
- Derivatives, covariance as directional uncertainty, and timestamps in a sampled system.

## Private hardest transfer problem

Do not publish this problem as article filler. Use it as a completeness gate.

A 1280 x 720 wrist camera observes a fruit center near the image edge. Calibration was performed with eight nearly fronto-parallel checkerboard views and reports a low global reprojection RMS. The deployed image is cropped and resized to 640 x 384 without updating K. The detector returns a distorted pixel. A noisy depth estimate is available, but the fruit also lies near a known support plane. The robot moves while inference adds 80 ms of latency, and the driver stamps the publication time instead of acquisition time. The hand-eye dataset contains large translations but nearly parallel rotation axes. The planner receives a point transformed with the latest TF.

The reader must be able to:

1. Explain why one image pixel is a projective ray and cannot determine metric depth by itself.
2. Convert a pixel into normalized camera coordinates with K inverse and state the ray convention.
3. Undistort the observation before interpreting it as a pinhole ray, especially near the edge.
4. Update focal lengths and principal point correctly after scale and crop, including crop-origin subtraction.
5. Distinguish camera intrinsics, each calibration image's target-to-camera extrinsic, and the fixed camera-to-gripper hand-eye extrinsic.
6. Reconstruct why one planar homography provides two intrinsic constraints and why diverse target orientation matters more than repeated parallel translations.
7. Interpret AX=XB as the same physical relative motion expressed in robot and camera coordinates, then diagnose weak rotation-axis diversity.
8. Use depth or ray-plane intersection to obtain a metric point and explain uncertainty amplification at shallow ray-plane angles.
9. Transform the point camera -> gripper -> base in the correct direction at the image acquisition timestamp, not at processing completion or latest TF.
10. Estimate first-order spatial error from robot velocity and timestamp offset, and explain why a rolling-shutter frame may require row-dependent time.
11. Reject a calibration using per-view, per-region, holdout, physical-length, and frame-chain checks even when aggregate training RMS is low.

The article passes only when each premise has visible public evidence and the interactive states make the corresponding failure measurable.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| OpenCV 4.x calib3d official documentation | The pinhole model is `s p = K [R|t] P`; real cameras add distortion; K must scale when image resolution changes. | The library model does not guarantee that a fitted calibration is well conditioned or valid for a deployment crop. | Establish the executable pixel-projection contract and current API vocabulary. | Pinhole ray, resize/crop, and distortion labs. |
| Zhang, MSR-TR-98-71 / PAMI 2000 | A planar pattern viewed at different orientations yields two orthonormality constraints per homography; closed-form initialization is refined by minimizing reprojection error. | Pure translation or parallel target planes are degenerate; the paper's experiments do not certify a modern robot deployment. | Reconstruct why planar calibration works rather than presenting `calibrateCamera` as a black box. | Diverse-pose calibration lab and a dedicated foundational paper article. |
| Zhang, Sections 4-5 and appendices | More images reduce simulated error, orientation around 45 degrees performed best in the stated simulation, and systematic non-planarity can bias calibration. | The 45-degree result excludes practical corner-detection degradation from foreshortening and is not a universal collection rule. | Teach evidence boundaries, target flatness, and conditioning rather than copying a magic angle. | Pose-quality meter, residual field, and validation ledger. |
| Tsai & Lenz 1989 | A rigid eye-on-hand mount can be estimated from relative robot and camera motions; at least two non-collinear rotation axes are required for a unique full solution. | Reported speed and accuracy belong to the paper's robot, camera, target, and noise regime. | Explain AX=XB, fixed versus per-pose transforms, and excitation design. | Hand-eye loop-closure and motion-diversity lab. |
| OpenCV 4.x `calibrateHandEye` documentation | Robot gripper-to-base and target-to-camera poses are inputs; the returned transform is camera-to-gripper; eye-in-hand and eye-to-hand frame chains differ. | Correct inputs and frame directions remain the application's responsibility. | Connect the historical equation to a modern API contract. | Direction ledger and runtime transform chain. |
| ROS 2 `sensor_msgs/CameraInfo` and tf2 official documentation | CameraInfo uses acquisition time and optical frame; tf2 stores a time-buffered frame tree and answers transforms at a requested time. | tf2 cannot repair a wrong acquisition stamp, calibration, unit, or optical-frame convention. | Make time a first-class coordinate and prevent latest-transform misuse. | Timestamp motion lab and production rejection gate. |
| ROS REP-103 | Optical frames use x right, y down, z forward, while body frames conventionally use x forward, y left, z up. | REP conventions do not prove that a particular driver publishes the promised frame. | Expose axis-convention errors before transform composition. | Axis legend and camera-to-base chain. |
| Oth et al., CVPR 2013 | Rolling-shutter rows are exposed at different times; accurate moving-camera calibration must model line delay and a continuous camera trajectory. | The article gives a failure bridge, not a full rolling-shutter calibration implementation. | Show why one frame timestamp may be insufficient under rapid motion. | Row-time overlay inside the timestamp lab. |

## Narrative sections

### 01. A pixel is a direction, not a 3D position

- Begin with a fruit pixel and ask where it is in meters.
- Derive `u = fx X/Z + cx`, `v = fy Y/Z + cy` and normalized coordinates.
- Explain homogeneous scale: every positive depth along the ray has the same pixel.
- Viz: move pixel, focal length, and depth; show multiple 3D points collapsing to one pixel while numeric ray and projected pixel remain visible.

### 02. K is tied to the exact image geometry

- Define fx, fy, cx, cy, skew and pixel units.
- Derive correct resize and crop update: focal lengths scale; principal point scales then subtracts the crop origin.
- Separate raw K from rectified P and recorded ROI/binning.
- Viz: toggle correct versus stale K after resize/crop; draw the resulting ray and base-plane miss distance.

### 03. Distortion must be removed before metric ray reasoning

- Define normalized radius and radial/tangential displacement.
- Show center error versus edge error and why a global score can hide edge bias.
- Distinguish distorted raw image, undistorted normalized point, and rectified output.
- Viz: k1 slider and test-point radius; animate a grid and report pixel displacement and ray-angle error.

### 04. Diverse planar views turn homographies into intrinsic constraints

- Set the calibration plane to Z=0 and derive `H = K[r1 r2 t]`.
- Use orthogonality and equal norm of r1 and r2 to obtain two constraints.
- Stack `Vb=0`, solve by the smallest right singular vector, then recover each view's extrinsic.
- Explain closed-form algebraic initialization versus reprojection-error refinement.
- Viz: fronto-parallel/diverse pose selector, independent-constraint and condition meter, spatial coverage, and residual field.

### 05. Calibration quality is a spatial generalization test

- Use per-view and per-region residual vectors, median/tail errors, holdout views, parameter stability, and known-distance checks.
- Show bent target, blur, corner coverage, focus/zoom, temperature, and deployment resolution as shift sources.
- State exactly what Zhang's experiments support and do not support.
- Viz: residual map with center-only low RMS versus edge holdout failure; allow removal of a weak view and show parameter stability.

### 06. Hand-eye calibration solves a fixed transform from relative motions

- Distinguish `T_camera_target(i)`, `T_base_gripper(i)`, and fixed `T_gripper_camera`.
- Derive the loop relation and relative-motion form `A_i X = X B_i` with explicit transform directions.
- Explain why translations or repeated same-axis rotations leave directions weakly observed.
- Viz: pose-pair loop closure, axis-diversity selector, condition score, and camera-to-base point consistency.

### 07. A correct transform at the wrong time is a wrong point

- Use the image acquisition stamp to query base-to-gripper; quantify translation and rotation error from delay.
- Separate acquisition, publication, inference completion, and planning times.
- Explain global versus rolling shutter and row-dependent exposure time.
- Viz: robot velocity and delay sliders, latest-versus-acquisition TF, spatial error, and rolling-shutter row sweep.

### 08. Metric point and uncertainty enter the planning scene together

- Depth path: `p_c = d K^{-1} p`; clarify whether d is optical-axis Z or Euclidean range.
- Plane path: intersect `o + lambda r` with `n^T p + d = 0`; shallow denominator amplifies uncertainty.
- First-order covariance propagation through unprojection and rigid transform.
- Production gate: calibration ID, image geometry, stamp age, depth validity, covariance, frame chain, scene age, and physical sanity.
- Viz: ray-plane intersection angle, pixel/depth noise, uncertainty ellipse, and accept/reject pipeline.

## Formula contract

- Every display formula has Korean in-equation annotations and a nearby FormulaNote that explains symbols, operation choice, units, direction, and failure boundary.
- Use `String.raw` for every LaTeX source in TSX.
- Split projection, resize/crop, distortion, homography constraints, AX=XB, time error, and ray-plane intersection into aligned rows on mobile before allowing scale below 0.80.
- No primary equation may require horizontal scrolling or render raw commands such as `\\theta`.

## Viz design contract

- Use stable 700 x 320 desktop and dedicated 340 x 280-320 mobile viewBoxes with 18-40 px safe margins.
- Lines use round caps and 1-3 px hierarchy; grids and axes remain quiet, measured rays/residuals carry the saturated accent, and red appears only for an actual failed invariant.
- Use blue for observed/projected geometry, violet for transforms, amber for uncertainty or warning, emerald for verified agreement, and neutral gray for construction lines.
- Every slider or mode changes a measurable numeric readout and proves one invariant; no decorative animation.
- Text sits in HTML ledgers when SVG labels would become too small. Avoid long sentences inside SVG.
- Controls, plots, and ledgers retain stable dimensions across states. No nested cards, thick color rails, large empty stages, clipped right labels, or automatic horizontal scroll.
- Verify 360, 390, 768, and 1440 px, dark/light contrast, keyboard focus, reduced motion, KaTeX errors, clipped SVG text, and document overflow.

## Paper spine

1. Zhang 2000: how planar homographies identify camera intrinsics, how closed-form initialization becomes reprojection optimization, and where pose degeneracy and target non-planarity break the method.
2. Tsai & Lenz 1989: successor foundation for a dedicated hand-eye article after the camera model is stable; the concept article introduces AX=XB and original evidence boundaries now.
3. Oth et al. 2013: successor bridge for spatiotemporal and rolling-shutter calibration, deferred from full reconstruction until the perception/sensor-fusion path is built.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Pixel is a ray, not a point | Section 01 derivation and ray-depth lab |
| K inverse and optical convention | Sections 01-02 and axis ledger |
| Resize/crop changed image | Section 02 stale-versus-correct K lab |
| Edge distortion | Section 03 distortion field and ray-angle error |
| Weak planar calibration poses | Section 04 homography constraints and diversity meter |
| Misleading global RMS | Section 05 per-region and holdout residual map |
| Intrinsic/per-view/hand-eye distinction | Sections 04 and 06 frame-role ledger |
| AX=XB motion diversity | Section 06 loop closure and axis-diversity lab |
| Depth or plane constraint | Section 08 depth and ray-plane paths |
| 80 ms moving-robot delay | Section 07 measurable spatial error |
| Rolling-shutter row time | Section 07 row-time overlay |
| Production rejection | Section 08 validation and logging contract |

## Direct entry contract

- Open with the familiar ambiguity that one image point gives a viewing direction but not a distance.
- Define pixel, depth, camera frame, and robot body frame before projection, intrinsic, extrinsic, or hand-eye terminology appears.
- The first formal question is allowed only after the reader has followed direction -> distance -> robot-frame conversion once in ordinary Korean.
