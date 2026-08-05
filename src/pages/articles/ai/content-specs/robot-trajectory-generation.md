# Robot Trajectory Generation & Retiming content spec

## Goal

- Reader outcome: the reader can distinguish a geometric path from a time-indexed trajectory, choose boundary continuity, compute a feasible duration from joint limits, diagnose waypoint corners, and separate offline path retiming from online jerk-limited state-to-state generation.
- System invariant: every command sent to a controller has monotonic timestamps, continuous state to the required derivative order, validated position/velocity/acceleration/jerk limits, and a documented response when the measured state diverges or the target changes.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Path q(s), time scaling s(t), trajectory q(s(t)) | deep | Planning and execution responsibilities remain confused without this separation. |
| Cubic and quintic boundary-value scaling | deep | They expose how endpoint derivative constraints determine polynomial degree and coefficients. |
| Trapezoidal and S-curve profiles | bridge; dedicated follow-up planned | This article defines the acceleration/jerk distinction; a later phase Viz will compare all motion phases without overloading the fixed-path retiming derivation. |
| Via points and continuity | deep | Position-continuous waypoint lists can demand discontinuous velocity or unbounded acceleration at corners. |
| Multi-DoF synchronization | deep | One joint is usually the bottleneck; independent minimum-time profiles must finish coherently. |
| Kinematic time parameterization | deep | Velocity and acceleration limits are the practical MoveIt handoff. |
| Dynamic time-optimal path parameterization | deep | Torque limits depend on configuration and velocity, so a constant global speed factor is wasteful or invalid. |
| Jerk-limited online generation | deep | Retargeting from a nonzero current state is a production control-loop problem. |
| Collision planning | bridge only | Covered by Robot Motion Planning; smoothing must revalidate geometry. |
| Feedback tracking | bridge only | Covered by Robot Dynamics & Feedback Control. |

## Private hardest transfer problem

A planner returns a collision-free three-joint waypoint path. The second waypoint creates a sharp corner. The robot is already moving with nonzero velocity when a new goal arrives. Each joint has different positive/negative velocity, acceleration and jerk limits, and the control loop runs at 1 kHz. A naive implementation assigns equal time to every segment, linearly interpolates joint positions, and sends the result after the planning scene changes.

The reader must be able to:

1. Separate q(s), s(t) and q(t), then derive q_dot and q_ddot with the chain rule.
2. Explain why increasing total duration changes velocity as 1/T and acceleration as 1/T^2.
3. Derive cubic scaling from position and zero-velocity endpoint constraints and quintic scaling after adding zero endpoint acceleration.
4. Diagnose a position-continuous corner whose incoming and outgoing tangent differ, and state the derivative continuity required by the controller.
5. Compute a conservative minimum duration from every joint's path slope, velocity and acceleration limits and identify the bottleneck joint.
6. Explain why independently time-optimal joints need synchronization and what time versus phase synchronization changes.
7. Rewrite manipulator dynamics along q(s) as a(s)s_ddot + b(s)s_dot^2 + d(s)s_dot + c(s) and turn torque bounds into lower/upper path-acceleration bounds.
8. Reverse the interval endpoints when a projected acceleration coefficient is negative, and treat |a_i| below a declared epsilon as a speed-only torque constraint rather than dividing by a small number.
9. Intersect all joint intervals, apply an inward torque reserve, integrate x=s_dot^2 with dx/ds=2s_ddot, and reject a state that is instantaneously feasible but cannot reach the terminal speed.
10. Distinguish time-optimal path parameterization from path optimization: the geometry is fixed in the former.
11. Explain why jerk discontinuity excites vibration even when velocity and acceleration remain within limits.
12. Regenerate from measured current position, velocity and acceleration when a target changes, instead of restarting from rest.
13. Reject stale geometry or scene versions before execution even if timing is valid, and apply numeric convergence/start-state/replay thresholds rather than prose-only gates.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Lynch & Park, Modern Robotics Ch. 9 | A trajectory is a path plus time scaling; polynomial, trapezoidal, S-curve and dynamic time-optimal scalings satisfy different conditions. | Chapter separates collision-free path finding and feedback tracking. | Establish the mathematical responsibility boundary. | Time-scaling profile lab and path/trajectory equations. |
| Shin & McKay 1985 | Manipulator dynamics along a fixed geometric path reduce to a scalar path-parameter timing problem under torque constraints. | Rigid known dynamics and specified path; open-loop optimal timing still needs feedback tracking. | Reconstruct the minimum historical floor of dynamic path retiming. | Phase-plane Viz and foundational paper article. |
| Bobrow et al. 1985 | Time-optimal motion along a specified path can be derived independently from manipulator torque limits. | Parallel classic corroboration, not another required lower prerequisite. | Confirm the classic problem boundary without exposing infinite older history. | Source note beside Shin-McKay. |
| Pham & Pham 2018, TOPP-RA | Reachable and controllable sets can be propagated on a discretized path by small LPs. | Modern fixed-path follow-up; not the same problem as online state-to-state generation. | Give the production numerical branch after the educational forward/backward integral. | Explicit truth boundary below the phase-plane Lab. |
| MoveIt time parameterization docs | MoveIt planners primarily return kinematic paths; post-processing assigns velocity and acceleration constrained timing, with jerk smoothing as a further step. | Correct configuration and joint limits remain application responsibility. | Connect equations to the current planning pipeline. | Plan-to-controller gate and logging checklist. |
| Berscheid & Kroger 2021 / Ruckig | Arbitrary current and target position, velocity and acceleration can be connected online with velocity, acceleration and jerk limits and multi-DoF synchronization. | State-to-state time optimality and intermediate-waypoint behavior are different problems. | Explain real-time retargeting rather than treating smoothing as an offline file operation. | Online retarget lab and production contract. |

## Narrative sections

### 01. A path says where, a trajectory says when

- Define q(s), s(t), q(t).
- Derive velocity and acceleration scaling.
- Viz: same geometric path with duration slider; path stays fixed while speed and acceleration change.

### 02. Boundary conditions choose the polynomial

- Cubic: position and zero endpoint velocity.
- Quintic: add zero endpoint acceleration.
- Compare peak velocity, endpoint acceleration and jerk.
- Viz: profile toggle with synchronized plots of s, s_dot, s_ddot and jerk.

### 03. Waypoints need tangent and derivative continuity

- Piecewise linear q is only C0 at corners.
- Distinguish stop-at-waypoint from pass-through waypoint.
- Explain cubic splines, blending radius and collision revalidation.
- Viz: corner blend slider with tangent vectors and clearance change.

### 04. Limits determine duration and the bottleneck DoF

- Propagate path derivatives to joint velocity and acceleration.
- Compute per-joint lower bounds on T.
- Synchronize all DoFs; contrast time and phase synchronization.
- Viz: duration slider, per-joint limit bars and violation status.

### 05. Torque limits make feasible speed depend on path position

- Substitute q(s) into M(q)q_ddot + h(q,q_dot) = tau.
- Derive a(s)s_ddot + b(s)s_dot^2 + d(s)s_dot + c(s) and L <= s_ddot <= U.
- Define `x = s_dot^2`, the one-edge reachable interval `R_k(x)`, and the
  terminal-controllable set `C_k`.
- Preserve every sampled connected interval in `C_k`; do not assume that
  nonlinear speed-dependent bounds make the set `[0, upper]`.
- Propagate `C_N = {0}` backward, then choose the fastest state from
  `R_k(x_k) ∩ C_{k+1}` while rechecking the required edge acceleration.
- Treat an empty intersection as an explicit `NO-PATH`; never repair it by
  silently clamping a negative or unreachable state to zero.
- Compare every active-constraint transition across grid refinements, not only
  the first switch. Explain why a production solver still needs grid
  convergence and a verified TOPP-RA path.
- Viz: (s, s_dot) phase-plane envelope and active torque bottleneck.
- The Viz must evaluate one coherent three-joint projected model, expose positive/negative/near-zero a_i cases, draw each acceleration interval and calculate the ceiling plus forward/backward integration from those same numbers.

### 06. Jerk-limited online generation starts from the current state

- Explain trapezoidal acceleration discontinuity and S-curve jerk phases.
- Current and target states contain p, v, a; limits contain v_max, a_max, j_max.
- Retarget in a 1 kHz loop from measured/current output state.
- Viz: target change toggle comparing restart-from-rest discontinuity with continuous regeneration.

### 07. Production execution contract

- Validate monotonic timestamps, derivative limits and control-cycle discretization.
- Recheck scene, attached geometry and start-state drift.
- Log trajectory generator, limit source/version, duration, extrema, bottleneck DoF, regeneration reason and tracking error.
- Hand off to feedback control and safety monitor.

## Formula and Viz contracts

- Every display formula has concise Korean in-equation annotations and a nearby FormulaNote.
- At 360 px, split annotated formulas into rows before allowing scale below 0.78.
- Profile plots share axes and fixed dimensions so toggles never shift layout.
- Use restrained blue for position/path, violet for velocity, amber for acceleration and red only for actual violations.
- Mobile receives dedicated plot layout when desktop aspect ratio makes labels unreadable.
- Verify 360, 768 and 1440 px for overflow, clipped SVG text, KaTeX errors and interaction state.

## Paper spine

1. Shin & McKay 1985: minimum-time motion along a specified geometric path under actuator constraints.
2. Fixed-path modern branch: Pham & Pham 2018 TOPP-RA -> Shin & McKay 1985 historical floor. Do not expose older history by default.
3. Online target branch: Berscheid & Kroger 2021 Ruckig -> stop. Promote TOPP-RA and Ruckig to dedicated articles after the concept article's numeric release contract is stable.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Path versus timed trajectory | Section 01 and duration Viz |
| Cubic/quintic boundary conditions | Section 02 derivation and profile plots |
| Sharp waypoint corner | Section 03 blend Viz and continuity ledger |
| Multi-joint bottleneck | Section 04 per-joint limit lab |
| Dynamic torque retiming | Section 05 equations and phase plane |
| Jerk and nonzero-state retarget | Section 06 online generation lab |
| Stale scene and execution | Section 07 validation pipeline |
