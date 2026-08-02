# Robot Kinematics & Coordinate Frames content spec

## Goal

- Reader outcome: camera, base, joint and end-effector coordinates are not interchangeable numbers; the reader can transform a measured point, compute forward and inverse kinematics, and diagnose a Jacobian singularity.
- System invariant: every pose, point, twist and Jacobian must name its source frame, target frame, timestamp and units before it is used to generate a joint command.

## Beginner-entry contract (2026-08-01)

- Start from two people saying "right by 2 m" from different origins and facing directions.
- Public render order is familiar reference-frame scene -> name the basis -> move the same point -> solve joint motion -> the camera-coordinate decision question.
- Frame, transform, kinematics, IK, Jacobian, and singularity receive formal names only after their physical roles are visible.
- Preserve the numeric transform, 2R arm, IK, singular-value, damped-inverse, source, and production-handoff evidence.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Coordinate frame and timestamp | deep | A correct transform at the wrong time is still a wrong physical point. |
| Rotation matrix and homogeneous transform | deep | They are the smallest inspectable bridge from perception coordinates to robot coordinates. |
| SO(3), SE(3), twist | medium | Explain the structure and operation without turning the article into a Lie theory course. |
| Forward kinematics | deep | Joint state to end-effector pose is the deterministic base of IK and Jacobians. |
| D-H and product of exponentials | deep comparison | D-H is historically important; PoE is the modern primary representation in the concept article. |
| Analytic and numerical IK | deep | Reachability, multiple branches, seed dependence and joint limits must be explicit. |
| Jacobian, singular values and manipulability | deep | Velocity control fails structurally near rank loss. |
| Pseudoinverse and damped least squares | deep | A production command needs bounded behavior near singularity. |
| Dynamics and torque control | bridge only | Covered by Robot Dynamics & Feedback Control. |
| Collision and motion planning | defer | Requires C-space obstacles, search and trajectory validation; it is the next independent phase. |

## Reader prerequisites

- Vector and matrix multiplication, transpose and inverse.
- Rank, null space, least squares and SVD intuition.
- Derivative and Jacobian as local change maps.
- State estimation and feedback control at the level of the preceding Robot AI path.

## Private hardest transfer problem

Do not publish this as filler. Use it as a completeness gate.

A wrist camera observes a fruit center 80 ms before the current joint-state timestamp. The camera-to-base calibration is a rotation and translation. A planar two-link surrogate has lengths 0.70 m and 0.50 m, joint limits, and a desired end-effector velocity toward the transformed target. The current elbow angle is 5 degrees, close to the straight-arm singularity.

The reader must be able to:

1. State why the point must carry frame, timestamp and meter units.
2. Apply the homogeneous transform in the correct direction and invert it when the direction is reversed.
3. Compute the two-link forward kinematics and test whether the target lies in the annular workspace.
4. Explain why reachable targets may have elbow-up and elbow-down IK solutions and why an iterative solver depends on its seed.
5. Derive the 2R Jacobian columns as endpoint velocities caused by unit joint rates.
6. Use determinant, rank and singular values to diagnose the near-straight configuration.
7. Explain why the exact inverse or pseudoinverse can demand excessive joint velocity near a small singular value.
8. Use damped least squares to trade task error for bounded joint motion, then distinguish this from explicit joint-limit and collision constraints.
9. Explain why an 80 ms transform/state mismatch cannot be repaired by a mathematically correct IK solve.

The article passes only when every premise above has a visible public location.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Lynch & Park, Modern Robotics, Ch. 3 and official video supplements | A physical point has different coordinates in different frames; rotation and translation compose as rigid transforms. | Rotation-matrix validity and timestamp calibration are separate checks. | Stop frame-less coordinate arithmetic. | Interactive frame-transform lab with recomputable coordinates. |
| Modern Robotics, Ch. 4, Eq. 4.10 and Appendix C | PoE composes joint screw motions; D-H composes specially assigned adjacent-link frames. | Both describe nominal kinematics, not manufacturing calibration by themselves. | Place D-H historically without making it the only modern implementation. | PoE/D-H comparison and chain animation. |
| Modern Robotics, Ch. 5, velocity kinematics transcript lines 32-41 | Jacobian columns are endpoint velocities from unit joint rates; rank loss removes task directions. | A coordinate parametrization singularity is not always a robot kinematic singularity. | Make singularity a visible geometric loss of direction. | 2R Jacobian lab with velocity arrows and singular values. |
| Modern Robotics, Ch. 6 | IK may have multiple or no solutions; numerical IK uses local Jacobian information and a seed. | Local convergence is not global reachability or collision safety. | Replace the black-box solver mental model. | Stepwise damped numerical IK lab. |
| Denavit & Hartenberg 1955, DOI 10.1115/1.4011045 | Carefully assigned link frames reduce a lower-pair transform description to four parameters. | Arbitrary frames do not admit that four-parameter form; near-parallel axes can be ill-conditioned for identification. | Reconstruct the original notation problem and its durable legacy. | Foundational paper article with original intent and modern comparison. |
| Whitney 1972, The Mathematics of Coordinated Control, pp. 303-309 | Desired hand-coordinate rates can be mapped to coordinated joint rates through a configuration-dependent Jacobian; singularity and redundancy require explicit handling. | Exact inverse assumes attainable directions and can become unusable near singularity. | Connect task-space commands to joint-space execution historically. | Foundational paper article with equation, evidence and reproduction ledgers. |
| ROS 2 tf2 official documentation | tf2 buffers a tree of frame transforms over time and answers transforms at requested times. | tf2 does not fix a wrong calibration, unit or timestamp. | Connect mathematical frames to production ROS behavior. | Timestamp failure note and logging checklist. |

## Narrative sections

### 01. A coordinate is an answer to a frame-and-time question

- Start with the same physical fruit represented in camera and base coordinates.
- Define active displacement versus passive coordinate change without overloading notation.
- Show rotation validity: orthonormal columns and determinant +1.
- Viz: rotate and translate the camera frame; recompute the same point in base coordinates. Keep axes, point label and numeric ledger visible at 360 px.

### 02. Homogeneous transforms make composition explicit

- Derive p_a = R_ab p_b + t_ab and the 4x4 homogeneous form.
- Show composition order and inverse as R transpose plus translated origin.
- Explain frame tree and timestamp interpolation in tf2.
- Viz: camera -> wrist -> base sequence, one transform at a time, with the composed result and timestamp mismatch state.

### 03. Forward kinematics maps joint configuration to pose

- Use a 2R numeric example before spatial notation.
- Derive x and y from link vectors.
- Generalize to SE(3) product of exponentials.
- Compare PoE with D-H: arbitrary base/tool frames versus constrained per-link frames; identification conditioning.
- Viz: joint sliders animate the two-link arm, trace endpoint and expose exact numeric pose.

### 04. Inverse kinematics is a set-valued constrained problem

- Workspace annulus first, then analytic two-branch solution.
- Separate unreachable, multiple-solution and seed-dependent local convergence cases.
- Numerical update uses pose error and local Jacobian; termination needs position/orientation tolerance, iteration and step limits.
- Viz: target drag/sliders, elbow branch toggle, step/reset numerical solve, visible residual and joint-limit flag.

### 05. Jacobian converts local joint motion into task motion

- Differentiate 2R FK and interpret each column geometrically.
- Explain shape, units and frame of a spatial Jacobian.
- Use SVD: input directions V, gains Sigma, output directions U.
- Viz: unit-joint velocity arrows, desired task arrow, velocity ellipse, sigma min/max and condition number.

### 06. Singularity is lost motion authority, not merely bad arithmetic

- At a straight 2R arm, Jacobian columns align and one task direction disappears.
- Exact inverse grows along small singular directions.
- Pseudoinverse solves least squares/minimum norm but does not impose bounds.
- DLS adds lambda squared I and explicitly trades task residual for joint-rate magnitude.
- Viz: move elbow toward zero, compare inverse/pseudoinverse/DLS joint rates and achieved velocity.

### 07. Production handoff: IK output is not a safe trajectory

- Add joint velocity/position limits, collision, latency, calibration uncertainty and controller tracking.
- Logging contract: target pose/frame/time, transform age, solver seed/status/residual, singular values, damping, joint-limit margin and applied command.
- Lead to the next motion-planning article: C-space obstacle path, time parameterization and controller tracking.

## Formula contract

Every display formula receives an in-equation Korean annotation in foundationFormulaAnnotations.ts and a nearby FormulaNote explaining symbols, operation choice, units and failure boundary. At 360 px, split a formula into aligned rows before allowing scale below 0.78. Never use horizontal scrolling for a primary equation.

## Viz design contract

- Use one stable 640x280 or 640x320 viewBox with safe margins; labels never sit against the right edge.
- Lines use round caps and 1-3 px hierarchy. Axes are muted; active transform or velocity is the only saturated accent.
- Controls use sliders, segmented controls and icon buttons with stable dimensions.
- Avoid decorative gradients, thick colored rails, nested cards and large empty stage areas.
- Every animation changes a measurable value or proves a geometric invariant.
- Desktop, 768 px and 360/390 px screenshots are required. Compare SVG/client boxes to detect clipping, not only document scroll width.

## Paper spine

1. Denavit & Hartenberg 1955: why a frame assignment convention reduced spatial linkage bookkeeping to four parameters.
2. Whitney 1972: how hand-coordinate commands became coordinated joint rates, and where inverse Jacobians fail.
3. Wampler 1986 is a successor bridge, not a full article in this phase: damped least squares repairs near-singular numerical behavior and motivates the production IK section.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Frame/time/unit contract | Sections 01-02 and transform sequence Viz |
| Numeric transform | Frame transform lab and annotated equation |
| FK and reachability | Section 03 numeric 2R lab and Section 04 workspace test |
| Multiple IK branches | Analytic branch control and prose |
| Jacobian construction | Section 05 derivative plus geometric columns |
| Singularity diagnosis | Singular values, direction loss and condition metric |
| Bounded near-singular solve | Pseudoinverse versus DLS comparison |
| Production constraints | Section 07 logging and failure ledger |
