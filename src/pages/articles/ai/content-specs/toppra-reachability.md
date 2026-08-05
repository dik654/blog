# TOPP-RA reachability path parameterization content spec

## Goal

- Proposed slug: `toppra-reachability`
- Reader outcome: a reader who already understands `q(s)` and time scaling can turn
  path-projected constraints into a discrete reachability problem, compute backward
  controllable sets, extract a forward time-optimal profile, and reject an infeasible
  boundary condition without silently clamping it to zero.
- Production outcome: the reader can distinguish an educational sampled approximation
  from a TOPP-RA implementation and can define a release gate for grid convergence,
  continuous-constraint replay, numerical tolerance, and source/version provenance.
- Historical stop: the required path ends at Shin-McKay 1985. Bobrow is parallel
  corroboration, not another mandatory step. Older control history stays hidden unless a
  concrete derivation needs it.
- Branch boundary: TOPP-RA retimes a fixed geometric path. Ruckig connects a measured
  current state to a target under jerk limits. They are adjacent modern branches, not
  interchangeable solvers.

## Why this deserves an independent article

The trajectory overview already introduces the symbols and an educational forward/backward
set approximation. It cannot also prove the LP preimage construction, discretization error,
time-optimal forward extraction, uncertainty extension, and production release contract
without becoming a mixed glossary.

This article owns one independent question:

> Given a fixed path and convex path-projected constraints, which squared path speeds can
> still reach the terminal boundary, and how is the fastest feasible profile recovered?

It does not own collision planning, geometric smoothing, online target retargeting, or
feedback tracking.

## Scope table

| Topic | Depth | Ownership decision |
|---|---|---|
| Fixed path versus time parameterization | bridge | Reuse the established trajectory article and restate only the invariant needed here. |
| Generalized path constraints | deep | Show how system constraints become affine constraints in `u` and `x`. |
| `x = dot(s)^2`, `u = ddot(s)` | deep | Derive the linear one-step recurrence and explain why squared speed is used. |
| Admissible, reachable, controllable sets | deep | Define each set by the question it answers, not by a glossary row. |
| Backward preimage LP | deep | Compute lower and upper endpoints and preserve an empty set explicitly. |
| Forward time-optimal extraction | deep | Select the greatest next state that remains in the next controllable set. |
| Segment time recovery | deep | Recover time from adjacent squared speeds and handle zero endpoints. |
| Collocation versus interpolation | deep | Explain the paper's first- and second-order discretization error claims. |
| Grid convergence and continuous replay | deep | Make these production release evidence, not an optional footnote. |
| Parametric uncertainty and AVP | bridge | Explain the additional capability and its assumptions without turning it into a second paper. |
| Redundant actuation and contact constraints | example boundary | Show why the generalized convex form matters; do not build a full humanoid solver. |
| Online jerk-limited generation | handoff only | Link to the separate Ruckig article. |

## Private hardest-transfer problem

Do not publish this problem verbatim. Use it to test whether the completed prose is deep
enough.

A seven-DoF arm follows a fixed joint-space path with nonuniform grid spacing. The projected
constraint rows include:

- a row with positive acceleration coefficient,
- a row with negative acceleration coefficient,
- a near-zero acceleration coefficient that becomes a speed-only constraint,
- a payload-dependent torque reserve,
- nonzero initial and terminal speed intervals,
- an uncertain friction coefficient represented by two extreme constraint sets.

The candidate profile is generated on 41, 81, and 161 grid points. At 81 points the sampled
constraints pass, but continuous replay finds one between-grid torque violation. A second
candidate reaches every local velocity ceiling but cannot reach the terminal interval.

The completed article must enable the reader to:

1. derive each signed control bound without assuming the coefficient is positive;
2. separate speed-only rows from acceleration rows near zero inertia;
3. compute the robust common feasible control interval;
4. propagate the terminal interval backward without assuming every controllable set starts
   at zero;
5. reject the locally feasible but terminal-uncontrollable candidate;
6. extract a forward profile using the reachable and controllable intersection;
7. explain why sampled feasibility is not continuous feasibility;
8. decide whether the 41/81/161 results satisfy a stated convergence threshold;
9. distinguish a theorem or paper experiment from a claim about the local implementation;
10. choose Ruckig instead when the fixed path is discarded and a moving target arrives.

If any step requires an unstated theorem, convention, or implementation assumption, the prose
is not complete.

## Worked numeric oracle

Use one coherent toy problem across prose, formulas, Viz, and tests.

Grid:

```text
s = [0.0, 0.5, 1.0, 1.5]
Delta = [0.5, 0.5, 0.5]
x_0 = 0
K_3 = {0}
```

Since `2 Delta_i = 1`, the transition is `x_{i+1} = x_i + u_i`.

Stage controls and state ceilings:

```text
u_0 in [-1.0,  1.0],  0 <= x_0 <= 2.0
u_1 in [-0.5,  1.5],  0 <= x_1 <= 3.0
u_2 in [-2.0,  0.5],  0 <= x_2 <= 2.5
```

Backward oracle:

```text
K_3 = {0}
K_2 = [0, 2.0]
K_1 = [0, 2.5]
x_0 = 0 is controllable
```

Forward oracle:

```text
x = [0, 1, 2, 0]
u = [1, 1, -2]
```

Segment-time oracle for constant path acceleration:

```text
Delta t_0 = 1.000000
Delta t_1 = 0.414214
Delta t_2 = 0.707107
total       = 2.121320
```

Every displayed value must be computed from the same data object. Do not duplicate these
numbers in disconnected component constants.

## Narrative structure

### 00. Current decision: the path is fixed, but the clock is not

Start with a production question: a collision-free path exists, so why can it still be
unexecutable or unnecessarily slow?

Explain before the first Viz:

- `q(s)` fixes geometric order;
- `s(t)` chooses when each point is visited;
- a retimer may change time but must not silently change the path;
- terminal conditions are global, so a locally allowed speed can still be a dead end.

Handoff from `robot-trajectory-generation` by anchor, not by repeating its full article.

### 01. Projection: many robot constraints become two scalar decisions

Begin with the chain rule and then substitute it into the generalized constraint.

Required display formulas:

```latex
\dot q=q'(s)\dot s,\qquad
\ddot q=q'(s)\ddot s+q''(s)\dot s^2
```

```latex
a(s)u+b(s)x+c(s)\in\mathcal C(s),
\qquad
u=\ddot s,\quad x=\dot s^2
```

The FormulaNote must explain:

- why `x` is squared speed: it removes the square root from the state transition and keeps
  nonnegative speed as a scalar state;
- why `u` remains signed: acceleration and braking must remain distinguishable;
- why every joint/contact row is intersected: one path state must satisfy all physical
  constraints simultaneously;
- why a near-zero coefficient is not divided: that row constrains speed rather than
  acceleration.

The first Viz lets the reader select a projected row and see positive, negative, and
near-zero coefficient handling. Changing the payload must recompute the actual interval.

### 02. Discretization: the nonlinear-looking path becomes a linear transition

Derive:

```latex
\frac{dx}{ds}=2u
```

and for one grid edge:

```latex
x_{i+1}=x_i+2\Delta_i u_i
```

Explain each operation in Korean:

- differentiating `dot(s)^2` produces `2 dot(s) ddot(s)`;
- dividing by `dot(s)` changes time derivative to path derivative only where the limiting
  interpretation is valid;
- integrating over one edge with constant collocated control gives the affine recurrence;
- `Delta_i` must remain per-edge, not a hidden global constant.

Do not call a coarse sampled recurrence an exact continuous solution.

### 03. Backward pass: ask which current speeds can still finish

Define the terminal set first. It may be a point, interval, or empty set.

Required set equation:

```latex
\mathcal K_i=
\left\{
x\in\mathcal X_i\;\middle|\;
\exists u:\,
(u,x)\in\Omega_i,\,
x+2\Delta_i u\in\mathcal K_{i+1}
\right\}
```

The FormulaNote must explain why:

- `exists u` is a feasibility question, not a chosen command yet;
- intersecting with `X_i` enforces current-stage admissibility;
- membership in `K_{i+1}` carries the terminal requirement backward;
- an empty preimage must remain empty instead of becoming `[0,0]`.

For polytopic scalar-state constraints, show how two small LPs recover the minimum and maximum
controllable state. State the assumption before drawing a single interval. If the implementation
supports disconnected sampled components, render every component rather than only an upper
envelope.

The second Viz steps from `K_3` to `K_0`, shows the feasible polygon in `(u,x)`, and highlights
the preimage slice. A toggle injects an impossible terminal interval and must visibly propagate
`NO-PATH`.

### 04. Forward pass: go as fast as possible without leaving the future

Required decision:

```latex
x_{i+1}^{*}=
\max\left(
\mathcal R_i(x_i)\cap\mathcal K_{i+1}
\right)
```

Then recover:

```latex
u_i^{*}=\frac{x_{i+1}^{*}-x_i}{2\Delta_i}
```

Explain:

- the reachable set answers what one edge can do now;
- the controllable set answers what can still finish later;
- their intersection prevents greedy acceleration into a dead end;
- the maximum selects the time-optimal branch under the paper's assumptions;
- the recovered control is rechecked against the original constraint rows.

The third Viz uses the worked numeric oracle. The reader can move one stage at a time and see
why `x_2=2.5` is locally reachable from stage 1 but rejected because `K_2` ends at 2.

### 05. Recover time and replay the original constraints

Required duration formula:

```latex
\Delta t_i=
\frac{2\Delta_i}{\sqrt{x_i}+\sqrt{x_{i+1}}}
```

Explain why adjacent path speeds are averaged and why squared states require square roots only
when recovering physical time. Handle a zero-zero edge as an explicit invalid or dwell case;
never divide by zero silently.

Replay:

- path monotonicity;
- original velocity, acceleration, torque, and contact rows;
- initial and terminal boundary conditions;
- every edge's reconstructed control;
- continuous or sufficiently dense between-grid samples.

### 06. Numerical evidence: one successful run is not a release gate

The fourth Viz compares 41, 81, and 161 points and shows:

- total duration delta;
- maximum state-profile deviation after interpolation onto a common grid;
- maximum original-constraint violation;
- minimum feasible margin;
- all active-set or switching-location drift, not only the first switch;
- solver status and tolerance.

Paper claims must be labeled as paper evidence:

- collocation discretization has first-order error in grid spacing;
- the first-order interpolation scheme described in the paper has second-order error but more
  variables and inequalities;
- the reported 100% success rate belongs to the paper's experiment set, not every TOPP problem.

Local release thresholds are editorial/engineering choices and must be labeled as such.

Suggested educational release gate:

```text
duration delta <= 0.1%
profile max deviation <= 0.01
original constraint overflow <= 1e-6
boundary error <= 1e-8
solver status = feasible
```

Do not present these example thresholds as standards from the paper.

### 07. What reachability adds, and where it stops

Explain briefly:

- admissible velocity propagation starts from an interval of initial speeds and returns the
  interval that can reach the end;
- robust constraints can intersect uncertainty extremes when the uncertainty model preserves
  the required convex form;
- redundant actuation and linearized contact constraints fit the generalized convex formulation;
- time-optimality claims require the paper's polytopic and discretization assumptions.

Then state the branch boundary:

- fixed path plus dynamic constraints -> TOPP-RA;
- arbitrary current and target `p·v·a` plus jerk limits -> Ruckig;
- model error and disturbances during execution -> feedback control.

## Prose-to-Viz specifications

### `ToppraConstraintProjectionLab`

- Inputs: selected joint row, payload, reserve, coefficient sign mode.
- Computation: signed bound sort, near-zero speed-only decision, global interval intersection.
- Visual: one compact coefficient strip, one `(u,x)` feasible region, one Korean decision line.
- Failure state: incompatible rows render `EMPTY`, not a zero-width green interval.
- Mobile: stacked controls and semantic rows; do not shrink an SVG full of labels.

### `ToppraBackwardSetLab`

- Inputs: stage stepper, terminal point/interval/impossible fixture.
- Computation: preimage endpoint LP or exact toy equivalent.
- Visual: current feasible polygon, next target interval, projected `K_i`, and accumulated stage
  rail.
- Interaction: changing terminal boundary recomputes every earlier set.
- Layout: two columns from 768px, one column at 390px; stable chart aspect ratio.

### `ToppraForwardExtractionLab`

- Inputs: stage stepper and optional greedy-without-controllability comparison.
- Computation: reachable interval, intersection with `K_{i+1}`, maximum next state, recovered
  control, edge verification.
- Visual: the rejected local maximum and accepted future-safe maximum must be visually distinct
  without relying on color alone.
- Result: profile, control, segment time, and status derive from one state object.

### `ToppraGridReleaseLab`

- Inputs: grid size and constraint replay density.
- Computation: convergence metrics and release decision.
- Visual: profile overlay, switch markers, compact evidence ledger, explicit paper/local badge.
- Failure injection: one between-grid violation must change the final decision to `NO-GO`.
- No decorative animation. Motion should only show backward propagation, forward extraction, or
  a changed release result.

## Formula and typography contract

- Every display equation uses `MathFormula` and is followed immediately by `FormulaNote`.
- Use Korean `underbrace` labels where they improve scanning; do not overload one expression
  with more than three annotated groups per line.
- Split long set-builder expressions semantically at mobile.
- Minimum rendered KaTeX scale: `0.86` at 360/390px and `1.0` at 768/1440px.
- No raw `\dot`, `\mathcal`, `\exists`, `\frac`, or `\Delta` may remain in visible text.
- Numeric substitution appears at least once for every formula used in the worked oracle.

## Source ownership

| Source | Owned claim | Explicit limit |
|---|---|---|
| Pham & Pham, TOPP by Reachability Analysis, arXiv:1707.07239 / IEEE T-RO 2018 | Generalized constraints, `x/u` discretization, reachable and controllable sets, LP algorithm, complexity, error analysis, experiments, AVP, uncertainty extension | Experimental success is not a universal runtime guarantee; time-optimality has stated convex/polytopic assumptions. |
| Official `hungpham2511/toppra` repository and documentation | Current library concepts, constraint and parametrizer APIs, examples, version-sensitive implementation behavior | Repository behavior is implementation evidence, not a replacement for the paper's theorem. |
| Shin & McKay 1985 | Minimum historical floor for fixed-path time-optimal retiming | Do not expose older history by default. |
| Bobrow et al. 1985 | Parallel historical corroboration | Optional source note, not another mandatory route step. |
| Berscheid & Kroger 2021 and official Ruckig docs | Boundary to online jerk-limited arbitrary-state generation | Not evidence for TOPP-RA's fixed-path LP algorithm. |

Primary links:

- https://arxiv.org/abs/1707.07239
- https://github.com/hungpham2511/toppra
- https://hungpham2511.github.io/toppra/
- https://arxiv.org/abs/2105.04830
- https://docs.ruckig.com/tutorial.html

## Article route

```text
Robot Motion Planning
  -> Robot Trajectory Generation & Retiming
  -> TOPP-RA Reachability
      -> Shin-McKay 1985 minimum historical floor
  -> Robot Dynamics & Feedback Control
```

Sibling, not prerequisite:

```text
Robot Trajectory Generation & Retiming
  -> Ruckig Online Jerk-Limited Generation
```

## Acceptance tests

### Content

- The article answers the independent fixed-path question without becoming a model/library
  catalog.
- Every technical term is introduced with easy intuition, role, and necessity before use.
- The worked oracle is consistent across prose, formulas, Viz, and tests.
- Paper claim, official implementation evidence, and local engineering threshold are visibly
  separated.
- The private hardest-transfer problem is solvable from the final prose without being exposed.

### Computation

- Backward oracle yields `K_2=[0,2]`, `K_1=[0,2.5]`.
- Forward oracle yields `x=[0,1,2,0]`, `u=[1,1,-2]`.
- Total time is within `1e-6` of `2.1213203436`.
- Impossible terminal boundary propagates an empty set to the start.
- Negative and near-zero coefficients never use an invalid unconditional division.
- Every selected edge control is revalidated against its original bounds.

### Rendering

- Viewports: 360, 390, 768, 1440.
- Document and component horizontal overflow: zero.
- Raw LaTeX and KaTeX errors: zero.
- Labels, controls, and focus states do not overlap.
- Tablet uses available width instead of a long narrow single column.
- Viz state changes alter computed geometry or verdict, not only color.

### Release

- Target ESLint and production build pass.
- Focused Playwright covers formulas, oracle numbers, infeasible propagation, responsive layout,
  and source-boundary labels.
- Narrative and Viz audits pass on the target route.
- A strict current-hash Claude review is accepted only with HTTP 200, `ok=true`, exact
  `claude-code:sonnet`, successful first attempt, and substantive findings.
- Public HTTPS route, asset identity, service status, and browser QA are verified after deploy.
