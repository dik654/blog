# Robot Dynamics & Feedback Control · content specification

## Reader contract

This is the missing bridge between `signals-systems-convolution`, `rl-pomdp-state-estimation`, and `robot-ai-top-down`. It must not become a formula catalog. The reader starts from an actuator command that fails in the physical world, builds a state-space model, checks whether the desired motion is controllable and observable, closes the loop, and only then compares PID, LQR, and MPC.

The article belongs to Robot AI. Linear algebra, eigenvalues, optimization, signals, and Kalman filtering remain just-in-time prerequisites rather than a detached mathematics detour.

## Beginner-entry contract (2026-08-01)

- Start from repeatedly touching and adjusting shower water instead of assuming one knob command reaches the desired temperature.
- Public render order is desired result -> measure actual result -> adjust the next command -> the open-loop robot decision question.
- Feedback is named only after the reader has seen the result-check-adjust loop; plant, state, reference, disturbance, PID, LQR, and MPC follow afterward.
- Preserve the closed-loop sequence, pole response, controllability/observability, LQR, MPC, formulas, source boundaries, and evidence ledger.

## Hardest private diagnostic problem

An orchard robot follows a row with lateral error `e_y` and heading error `e_psi`. At 0.6 m/s a hand-tuned proportional-derivative controller looks acceptable. At 1.8 m/s the robot oscillates, steering saturates at +/- 0.25 rad, the camera estimate arrives 120 ms late, and one state direction is weakly observed when trunks are occluded. The controller log shows a low average tracking error before each failure.

The finished article must give enough insight to answer, without publishing this problem as an exercise:

1. What belongs in state, observation, reference, control input, disturbance, and constraint?
2. How does changing speed or sampling time change `A` and `B`, so old gains no longer imply the same closed-loop poles?
3. Can the actuator influence every unstable state direction? Can the sensor history distinguish them?
4. Why can a larger proportional gain reduce instantaneous error while making the closed loop oscillatory or unstable?
5. What do `Q` and `R` in LQR actually trade, including unit scaling, and what do they not guarantee?
6. Why can unconstrained LQR request physically impossible steering, and how does receding-horizon MPC encode hard state/input constraints?
7. Why is finite-horizon optimization alone not an automatic stability proof? What roles do terminal cost, terminal set, recursive feasibility, and model mismatch play?
8. How do estimator lag, actuator saturation, anti-windup, deadline misses, and unlogged command clipping change failure attribution?

## Narrative order

1. Open-loop command fails because model error and disturbance accumulate.
2. State-space separates internal state, action, output, and disturbance.
3. Feedback changes the dynamics from `A` to `A-BK`; eigenvalues describe repeated error behavior.
4. Controllability and observability are structural gates before gain tuning.
5. PID acts on error history and remains useful, but integral windup and delay expose its limits.
6. LQR derives state feedback from an explicit state/action cost and Riccati recursion.
7. MPC repeatedly solves a constrained finite-horizon problem, executes only the first action, then replans.
8. State estimator and controller can be designed as distinct responsibilities under stated assumptions; production logging must preserve that separation.

## Prose-to-viz specification

### Closed-loop sequence

Five scenes: plant state -> observation/estimate -> reference error -> controller -> actuator/plant response. Each scene exposes the current input, operation, output, invariant, and two diagnostic metrics. It must fit at 360 px without horizontal scrolling.

### Pole response lab

Use a second-order discrete response with damping and natural-frequency controls. Render target and response as a bounded SVG chart with a stable aspect ratio. Show overshoot, settling classification, and the approximate discrete pole magnitude. The lab is explanatory, not a simulator or formal stability certificate.

### LQR trade-off lab

Use a scalar finite-horizon system `x_{t+1}=a x_t+b u_t`. Sliders for state penalty `q` and action penalty `r` run an actual backward Riccati recursion. Show the first feedback gain, state/action trajectory, state cost, and action cost. No fake static numbers.

### MPC horizon lab

Use a scalar integrator with bounded input. Enumerate a small action grid over horizon `N`, apply only the first action, and re-solve. Show the predicted plan, constraint, and first executed action. Make the distinction between a predicted open-loop sequence and closed-loop receding-horizon execution visible.

## Formula contract

Every display formula must have a Korean in-equation annotation registered in `foundationFormulaAnnotations.ts`. On 360 px, annotated formulas should normally retain scale >= 0.78. Split long formulas into single-responsibility rows instead of shrinking them into unreadability.

Required formulas:

- discrete state-space dynamics and output
- state feedback and closed-loop dynamics
- controllability and observability matrices/rank tests
- PID command with anti-windup boundary explained in prose
- finite-horizon LQR objective
- Riccati recursion and feedback gain as separate formulas
- constrained MPC optimization
- receding-horizon first-action execution
- observer/controller composition

## Paper spine

### Kalman 1960 · Contributions to the Theory of Optimal Control

- Reconstruct the pre-paper least-squares feedback bottleneck.
- Treat controllability/observability and Riccati feedback as the paper's central contribution, not merely the modern acronym LQR.
- Separate full-state feedback from later stochastic output-feedback LQG.
- State the robustness boundary: optimal for the declared quadratic model/cost is not universally robust or constraint-safe.

### Mayne, Rawlings, Rao, Scokaert 2000 · Constrained MPC

- Reconstruct MPC as finite-horizon open-loop optimization inside a feedback loop.
- Center constraints, recursive feasibility, terminal ingredients, Lyapunov decrease, and optimality/stability conditions.
- Preserve that the paper is a survey/review organizing mature results, not one benchmark algorithm.
- Do not claim nonlinear/output-feedback/adaptive MPC was equally mature; the authors explicitly identify boundaries.

## Source and intent ledger

- Kalman original reprint: primary historical definitions, regulator problem, Riccati equation, controllability and observability.
- Mayne et al. publisher page and full paper rendering: primary MPC scope, definition, constraints, stability and optimality boundaries.
- Stanford EE363 LQR notes: implementation notation and finite/infinite-horizon derivation cross-check.
- Berkeley EE C128 state-space notes: rank tests, pole placement, observer terminology cross-check.
- MIT 16.323 MPC lecture: terminal ingredients and Lyapunov decrease cross-check.

## Publication QA

- No document-level horizontal scroll at 360, 768, and 1440 px.
- No KaTeX parse errors, raw backslashes, missing display annotations, or formulas escaping their box.
- Every lab changes visible numeric output when its control changes.
- Step visualization advances and the active scene changes.
- Robot AI category shows the concept and both papers in a coherent order.
- `robot-ai-top-down` links to the new control foundation after POMDP.
- Public URLs return 200 after deployment and reproduce local QA.
