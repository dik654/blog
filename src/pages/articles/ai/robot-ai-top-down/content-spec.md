# Robot AI top-down reconstruction contract

Date: 2026-07-29
Article: `/lab/blog/ai/robot-ai-top-down`

## Reader contract

Target reader:

- can call a Python model but has not built a robot stack;
- may think a VLA action is already a motor command;
- may know the names ROS 2, PID, simulator, and PCB without knowing their
  ownership boundaries;
- wants a current Robot AI entry point without reading every lower foundation
  first.

The article starts from one visible goal and descends only as far as needed:

> "빨간 상자를 집어 왼쪽 바구니에 놓아라"라는 명령이 들어왔다. 카메라
> detection은 맞았지만 TF가 180 ms 오래됐고, wrist가 물체에 닿자
> 예상보다 큰 접촉력이 생겼으며, 한 actuator update가 deadline을
> 놓쳤다. 어떤 layer가 어떤 증거로 문제를 발견하고, 어느 출력은 폐기하거나
> 다시 계산하며, 어떤 safety boundary는 learned policy와 독립적으로
> 남아야 하는가?

The completed article must let the reader solve that case without external
explanation.

## Minimum mental model

The learner must distinguish:

1. world state from sensor observation;
2. state estimate from a high-level task goal;
3. geometric path from time-parameterized trajectory;
4. trajectory reference from controller output;
5. controller output from drive-level current/PWM;
6. commanded motion from measured physical effect;
7. an algorithmic success from a safe real-world release.

Every boundary must expose:

- input contract;
- output contract;
- typical owner;
- relative cadence, without inventing a universal Hz number;
- evidence that proves the boundary worked;
- failure that the next or previous layer cannot silently repair.

## Narrative order

1. `execution-contract`
   Start with the red-box goal and reveal the eight-stage execution chain.
2. `feedback-contract`
   Derive reference, estimate, error, command, plant, and measurement.
3. `ros-contract`
   Choose topic, service, action, or TF by interaction semantics and time.
4. `foundation-descent`
   Give a minimum top-down reading descent, not an unranked link gallery.
5. `orchard-case`
   Run a second example from pixels to calibrated ground points, robust row
   model, centerline trajectory, feedback, and obstacle gate.
6. `sim-real-release`
   Separate simulator training evidence, real rollout evidence, and independent
   safety/recovery evidence.

## Formula contract

Use three mobile-safe equations rather than one long expression:

```latex
e_k = r_k - \hat{x}_k
```

```latex
u_k = \pi_c(e_k,\mathcal C)
```

```latex
x_{k+1} = f(x_k,u_k,w_k)
```

Korean annotations must explain:

- `r_k`: the reference required at the current execution time;
- `\hat{x}_k`: the time-aligned state estimate;
- `e_k`: the discrepancy the controller can act on;
- `\mathcal C`: joint, velocity, torque, collision, and safety constraints;
- `u_k`: the command passed to the lower execution layer;
- `w_k`: unmodeled disturbance such as slip, contact, or load change.

The prose must state that the equations are an ownership model, not a claim
that every robot uses the same controller or state transition.

## Visualization contract

No fixed SVG overview, wide comparison table, horizontal-scrolling scene, or
tiny text.

### ExecutionBoundaryLab

- eight selectable stages;
- stage selection changes input, output, owner, evidence, cadence, and failure;
- a stale-TF perturbation must visibly stop the chain before trajectory
  execution;
- mobile layout wraps stages into stable full-width controls.

### FeedbackDisturbanceLab

- nominal, stale estimate, contact disturbance, and missed-deadline scenarios;
- one compound state applies the article's configured TF-age, contact, and
  actuator-watchdog failures in one episode;
- state values and selected safe response must change;
- every scenario names the first detecting boundary, owner, and relative
  cadence;
- shows why a learned policy does not replace the fast feedback and safety
  boundary.

### RosContractLab

- learner selects camera stream, calibration query, navigation goal, or frame
  transform;
- output names topic, service, action, or TF and explains why;
- at least one wrong-interface consequence is visible.

### OrchardEvidenceLab

- clean row, missing trunks, outlier, curved row, and person-on-path cases;
- each scenario changes model choice, confidence, and execution decision;
- distinguishes pixel, calibrated ground point, geometric centerline,
  time-bearing reference, and safety gate.

## Source ownership

Use primary or official sources:

- ROS 2 official interfaces documentation for topic, service, and action;
- ROS 2 official TF documentation for time-indexed transforms;
- ROS 2 Control official joint trajectory controller documentation for
  waypoint execution, feedback, tolerances, and action monitoring;
- Isaac Lab official docs for parallel simulated environments and training
  limitations;
- LeRobot official docs for record, train, checkpoint, and real-robot
  evaluation workflow;
- the cited orchard-navigation paper only for its own detection, bottom-point,
  line-fit, and centerline case.

Editorial guidance must be labeled:

- the exact eight-stage decomposition;
- the relative cadence labels;
- the recommended first-project order;
- release gates and stop rules.

Do not claim:

- simulation success proves real-world safety;
- domain randomization covers every reality gap;
- a VLA output is universally a pose, trajectory, torque, or token;
- ROS 2 transport alone supplies control stability;
- one orchard method generalizes to all fields or robots.

## Private adversarial checks

The article is insufficient unless the learner can answer:

1. A detector is correct but its transform is stale. Which downstream outputs
   are invalid and why?
2. A policy proposes a valid end-effector pose. What is still missing before a
   motor can execute it?
3. A trajectory goal takes five seconds and must be canceled. Why is an action
   a better contract than a service or fire-and-forget topic?
4. Wheel slip makes measured motion differ from expected motion. Which quantity
   changes first in the feedback equations?
5. Domain randomization improves simulated success. What evidence is still
   required before a real rollout?
6. An orchard centerline is clear but a person steps onto it. Which independent
   gate must override the path?

## 4B/9B packet

Do not give a small model the whole robotics corpus.

```yaml
packet:
  transfer_case: one failure
  article_section: one
  source_excerpt: one official contract
  boundary_fields:
    - input
    - output
    - owner
    - evidence
    - failure
  counterexamples: two
output:
  failed_boundary: one
  invalidated_outputs: ordered list
  safe_next_action: one
  support: source | editorial | unknown
```

## Acceptance

- no page overflow at 390, 768, or 1440 px;
- no horizontal table or fixed SVG;
- every control is at least 44 px high;
- formula scale at least 0.78 and no raw LaTeX;
- all four labs change causal output;
- the compound failure state reaches a configured safe state before
  re-estimation and replanning;
- internal links preserve top-down order:
  kinematics, planning, trajectory, feedback, ROS 2 runtime, embedded, drive;
- article-local Playwright checks outcomes, not mere component presence;
- Context Manager final factual, transfer, and responsive reviews are strict
  valid with stable source hashes.
