# Robot AI top-down causal reconstruction receipt

Date: 2026-07-29
Article: `/lab/blog/ai/robot-ai-top-down`
Scope: narrative, equations, source ownership, five interactive learning
surfaces, responsive behavior, and minimum-foundation handoffs

## Why this article was selected

The mastery triage initially scored `robot-ai-top-down` at 66. The article
named perception, planning, ROS 2, control, embedded systems, and motor drives,
but the reader could not reliably trace one command through those owners or
decide which downstream artifacts became invalid after an upstream timing
failure.

The reconstruction uses one private transfer case:

> A red-box pick task has a correct detection, a transform that is 180 ms old
> against this cell's configured 50 ms limit, unexpected wrist contact, and
> one missed actuator update. Which boundary reacts first, which state-derived
> artifacts are discarded, when may replanning resume, and which protections
> must remain independent of the learned policy?

This problem is not printed as a quiz in the article. It is an authoring gate:
the public explanation and tools must contain enough causal information to
solve it without outside robotics knowledge.

After reconstruction, the mastery triage scores this article at 100 with
4,651 Korean prose characters and all measured question, capability, source,
formula-note, Viz, causal-interaction, internal-link, and depth checks enabled.
The audit is triage rather than release proof; browser and source verification
remain separate.

## Primary evidence and ownership

Primary or official sources:

- ROS 2 interfaces:
  `https://docs.ros.org/en/ros2_documentation/rolling/Concepts/Basic/Interfaces-Topics-Services-Actions.html`
- ROS 2 TF2:
  `https://docs.ros.org/en/rolling/Concepts/Intermediate/About-Tf2.html`
- ROS 2 Control Joint Trajectory Controller:
  `https://control.ros.org/jazzy/doc/ros2_controllers/joint_trajectory_controller/doc/userdoc.html`
- Isaac Lab training guide:
  `https://isaac-sim.github.io/IsaacLab/main/source/overview/reinforcement-learning/training_guide.html`
- LeRobot real-robot workflow:
  `https://huggingface.co/docs/lerobot/main/en/getting_started_real_world_robot`
- LeRobot HIL workflow:
  `https://huggingface.co/docs/lerobot/main/hil_data_collection`
- Orchard navigation paper:
  `https://www.mdpi.com/2077-0472/12/10/1650`

Source claims are intentionally narrow:

- topic, service, action, and TF are explained by interaction and time
  semantics, not by payload shape alone;
- the Joint Trajectory Controller is one concrete feedback, waypoint,
  tolerance, and action-monitoring example, not a universal controller;
- Isaac Lab supports parallel simulated environments but the article preserves
  memory, rendering, step-time, instability, and limit-setting boundaries;
- LeRobot owns the record, inspect, train, evaluate, and HIL workflow claims,
  not a universal safety-certification process;
- the orchard paper owns YOLO V3 trunk detection, bounding-box bottom
  references, least-squares row fitting, and its reported centerline case;
- RANSAC, spline fitting, independent obstacle gates, the exact eight-stage
  decomposition, relative cadence labels, and three release stages are
  explicitly editorial extensions.

The first Claude evidence review found that the article had incorrectly
attributed segmentation to the orchard paper. The current text says YOLO V3
tree-trunk detection and no longer assigns an unreported segmentation stage to
that source.

## Narrative reconstruction

The old topic list was replaced by a dependency chain:

1. turn a task instruction into a verifiable goal;
2. distinguish observation from a time-aligned state estimate;
3. convert state and goal into a pose, path, or action candidate;
4. add dynamic limits and time to form a trajectory;
5. compute feedback error and constrained command;
6. let drive and mechanism produce a physical effect;
7. measure that effect and decide success, retry, or stop;
8. descend only to the minimum foundation that owns the observed failure.

The article then transfers the same boundaries to orchard row navigation and
to simulator-to-real release evidence. A centerline can be geometrically valid
while an independent obstacle gate still stops for a person.

The foundation handoff is ordered rather than presented as a link gallery:

1. coordinate frames and kinematics;
2. motion planning;
3. trajectory generation;
4. dynamics and feedback control;
5. ROS 2 runtime communication;
6. embedded real-time control;
7. motor drive and FOC.

Graph-level lateness in DDS, queues, and executors is separated from
hardware-level lateness in timers, fieldbus, drive updates, and watchdogs.

## Equation contract

The feedback story uses three mobile-safe equations:

```latex
e_k=r_k-\widehat{x}_k
```

```latex
u_k=\pi_c(e_k,\mathcal C)
```

```latex
x_{k+1}=f(x_k,u_k,w_k)
```

The orchard case uses a residual and a least-squares objective. Every displayed
equation has Korean role annotations and a `FormulaNote`. The prose states
that these equations express ownership and information flow; they do not claim
that every robot uses one controller or transition function.

The longest mobile equation was shortened semantically rather than hidden
behind horizontal scrolling. Final formula scale is at least 0.93 at 390 px
and 1.00 at 1440 px.

## Interactive learning decisions

`ExecutionBoundaryLab`:

- exposes eight selectable boundaries;
- changes input, output, owner, relative cadence, evidence, and failure;
- injects a configured stale-TF case;
- computes the first blocked index, six invalidated downstream boundaries,
  current chain position, and next permissible handoff;
- uses a four-column desktop layout rather than shrinking eight English labels
  into unreadable cards.

`FeedbackDisturbanceLab`:

- distinguishes normal tracking, stale state, contact, deadline miss, and a
  compound incident;
- exposes reference, estimate, error, disturbance, first detecting boundary,
  owner, cadence, evidence, and safe next action;
- shows the concrete `0.31 rad` estimate, `180 ms > 50 ms` age failure, and
  invalidation of pose, path, and trajectory;
- orders the example as configured safe state, stop confirmation, state
  re-estimation, and replanning;
- explicitly rejects a universal `hold > slow-stop` law.

`RosContractLab`:

- selects topic, service, action, or TF from interaction semantics;
- makes a wrong-contract consequence visible.

`OrchardEvidenceLab`:

- changes detected points, ground evidence, model, confidence, and execution
  decision for clean, missing, outlier, curved, and person-on-path cases;
- maps action semantics consistently: go is teal, review is amber, stop is
  rose.

`SimulatorReleaseStrip`:

- separates simulation, bench/shadow, and real-rollout evidence;
- states that this is an editorial guide, not a certification standard.

Animation is intentionally deferred until the content-wide animation phase,
as requested. Current decision explorers still change visible consequences and
are not counted as numerical simulators merely because their scenarios are
authored fixtures.

## Context Manager and Claude record

Historical Context Manager HTTP 500 gaps were not blindly rerun. The final
identity ledger already replaced the old failed calls with 71/71 bounded,
actual-Claude article receipts. Current Robot work was reviewed again because
its source changed.

Preserved current queues:

- weak-article pre-audit:
  `.codex-tmp/claude-next-weak-three-preaudit-2026-07-29`
- current Robot pre-audit:
  `.codex-tmp/claude-robot-current-preaudit-2026-07-29`
- first current closure:
  `.codex-tmp/claude-robot-current-closure-round1-2026-07-29`
- bounded retry:
  `.codex-tmp/claude-robot-current-bounded-retry-2026-07-29`
- exact final closure:
  `.codex-tmp/claude-robot-current-final-closure-2026-07-29`

Receipt acceptance required all of:

```yaml
http: 200
ok: true
decision.worker: claude-code:sonnet
attempts[0].ok: true
first_non_empty_line: ACCEPT | REVISE
result: substantive
source_hash_before_equals_after: true
```

One responsive call returned an empty result and three broader calls timed out
with code 143. None counted as review. They were split into compound transfer,
mobile, and desktop packets and retried with at most two concurrent workers.

Valid findings that were applied:

- remove the unsupported orchard segmentation attribution;
- make the compound incident solvable rather than showing three unrelated
  single-failure tabs;
- add configured thresholds, first detecting boundary, owner, and cadence;
- separate ROS-runtime and embedded deadline ownership;
- include pose and path in stale-state invalidation;
- restore the concrete state-estimate value;
- align risk colors by action;
- fill the execution detail panel with computed chain state;
- replace the eight-column desktop grid that split `Observation`.

Two suggestions were rejected:

- a universal `hold > slow-stop > re-estimate` law, because the safe state is
  hardware- and hazard-dependent;
- the claim that every authored decision fixture requires animation or a
  numerical solver to qualify as a learning tool.

Final accepted receipts on the exact current hashes:

1. factual and source boundary: `ACCEPT`;
2. compound transfer: `ACCEPT`;
3. 390 px production UI: `ACCEPT`;
4. 1440 px production UI: `ACCEPT`.

## Bounded workflow for 4B and 9B models

Do not give a small model the entire robotics corpus or the full article.
Compile one boundary-sized packet:

```yaml
packet:
  transfer_event: one
  article_section: one
  current_boundary:
    input: one
    output: one
    owner: one
    cadence: relative
    evidence: one_to_three
    failure: one
  official_excerpt: one
  editorial_rule: zero_or_one
  counterexamples: two
output:
  first_failed_boundary: one
  invalidated_outputs: ordered
  immediate_safe_response: one
  recovery_precondition: one
  next_foundation_slug: one
  support: source | editorial | unknown
```

Recommended passes:

1. observation versus state estimate;
2. pose/path versus time-bearing trajectory;
3. reference, estimate, error, and command;
4. command versus measured physical effect;
5. topic/service/action/TF choice;
6. ROS-runtime versus embedded deadline;
7. stale-state invalidation;
8. contact and watchdog protection;
9. orchard source boundary;
10. simulation versus real-release evidence.

The 4B model extracts one boundary and must answer `unknown` when evidence is
absent. The 9B reviewer receives the extracted packet plus two counterexamples
and checks ordering, source ownership, and unsafe generalization. Deterministic
code then checks slugs, formula rendering, interaction state, viewport
overflow, control size, and source hash. The orchestrator alone merges
sections, runs browser QA, and deploys.

## Current source identity

```text
005305410a16ce83c894159f112c5ec16a66a2daa8b6732f04217b53c2cfd93c  src/pages/articles/ai/robot-ai-top-down/content-spec.md
36f359e9ba265f8bdab71f18189e4033830423216e5dde7fedfe7471303d619f  src/pages/articles/ai/robot-ai-top-down.tsx
d08f257fc8288ef3700224a1350b800bdeb42d42b063841c3d0cd3bf98a3e7c3  src/pages/articles/ai/robot-ai-top-down/viz/RobotAiViz.tsx
428642e1366609f10508ce854ec62c7147260d05320b7b64fbf4caba276680ec  src/content/ai/articlesSystemsFoundation.ts
9b71de455c645b875a7caee2cbd64a6ff22e0e33c8e04d2f79129c27fec4642a  tests/robot-runtime-route-contract.spec.ts
a598a7f3d2e8722c4940cc50e77185300233ea1ee1d9a97b26fe99a0b830e4fa  .codex-tmp/ai-mastery-coverage-2026-07-29-robot-final.json
```

## Verification before deployment

- selected-file ESLint: pass;
- `npx tsc --noEmit --pretty false`: pass;
- local focused Playwright: 5/5 pass;
- viewports: 390x844, 768x1024, 1440x900;
- horizontal overflow: zero;
- clipped interactive controls: zero;
- mobile formula scale: at least 0.93;
- desktop formula scale: 1.00;
- browser console errors: zero;
- mastery score: 66 to 100;
- remaining weak article references: `arima`, `vllm-serving`.

## Production closure

- production build: 8,779 modules, pass;
- existing large-chunk advisory only;
- `cm-blog.service`: active from `2026-07-29 16:13:37 KST`;
- public article: HTTP 200;
- public JavaScript: `index-DpsTp0v7.js`, HTTP 200;
- public CSS: `index-CQhlYvLv.css`, HTTP 200;
- local and public `index.html` SHA-256:
  `3ce2fa4dbe2c096b9cc2873f4a5c089348426ac20c7b36258e639c4a75f0106a`;
- public focused Playwright: 5/5 pass at 390, 768, and 1440 px;
- public mobile screenshot:
  `.codex-tmp/robot-ai-top-down-public-mobile-2026-07-29.png`;
- public horizontal overflow: zero;
- public browser console errors: zero.
