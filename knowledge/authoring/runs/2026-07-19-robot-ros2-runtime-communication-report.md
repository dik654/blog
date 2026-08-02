# Robot ROS 2 Runtime & Communication reconstruction report

## 1. What was inferred

The next article was selected by comparing the contracts of adjacent robotics foundations. Camera geometry, localization, scene construction, planning, and feedback control all passed data or commands through ROS 2, but none owned the assumptions between a visible graph edge and a safe physical effect.

That missing layer included message meaning, endpoint compatibility, queue freshness, callback scheduling, lifecycle readiness, buffer lifetime, clock responsibility, TF lookup time, cancellation, and sensor-to-actuator response. A deeper navigation article would continue to depend on those unstated guarantees, so ROS 2 runtime and communication became the next prerequisite.

## 2. How depth was gated before prose

A private warehouse problem combined fifteen premises. The graph stayed visible while QoS was incompatible, a reliable queue accumulated stale truth, a long callback starved a watchdog, a synchronous call deadlocked with its hidden completion callback, a motor bridge remained inactive, an old transient-local path replayed after restart, ROS time moved backward, TF used arrival time, an intra-process buffer was reused early, and cancellation waited behind the work it needed to stop.

The compound problem was not used as article filler. Each premise had to map to public derivation, formula, measurable Viz state, paper evidence, or an execution gate. This tests whether the article supplies transferable diagnostic insight instead of merely defining ROS vocabulary.

## 3. How sources were transformed

The source packet separated portable current behavior from historical analytical models:

- Current ROS 2 interface and QoS documentation supplied interaction semantics and requested/offered compatibility.
- Current executor and callback-group documentation supplied wait-set readiness, overload boundaries, group concurrency, and hidden done-callback deadlock.
- The managed-node design supplied supervised readiness states and functional processing gates.
- Deadline/liveliness/lifespan, clock/time, and intra-process designs supplied precise status, time-domain, and ownership boundaries.
- Casini et al. supplied the bridge from logical callback graphs to response-time analysis under CPU reservations.

Casini's paper targets ROS 2 Crystal's built-in single-thread executor. The article therefore preserves its arrival, demand, supply, fixed-point, subchain, and processing-chain insights while labeling the historical timer policy, fixed DAG, known WCET/arrival, reservation, and executor assumptions. Current multi-thread callback groups are not presented as proven by that paper.

## 4. Resulting narrative

The nine chapters follow the runtime path:

1. Define interface and message meaning.
2. Separate discovery, match, readiness, freshness, and health.
3. Apply requested/offered QoS.
4. Choose whether overload loses samples or loses time.
5. Map ready work through executors, groups, threads, and hidden callbacks.
6. Supervise lifecycle state and command escape.
7. Trade copies for ownership and fault boundaries.
8. Assign System, Steady, and ROS time and query TF at acquisition time.
9. Bound and gate the complete sensor-to-actuator chain.

Each chapter owns one interactive lab with a measured result. The separate paper reconstruction proceeds from the authors' bottleneck and intent through runtime mapping, historical scheduling, arrival and supply equations, fixed-point analysis, the revised subchain lemma, chain composition, five evidence slices, reproduction, assumptions, failure cases, and current legacy.

## 5. Why the Viz look this way

The labs use controls only for causal variables and report operational consequences such as match/no-match, oldest sample age, callback start, deadlock, lifecycle command gate, copy count, corruption blast radius, spatial TF error, and deadline margin. Blue denotes data, teal runtime transport, violet scheduling or analytical control, amber waiting or stale risk, emerald a satisfied contract, and red only a violated invariant.

Responsive HTML carries labels and metrics; timelines and topology use restrained geometry. Borders remain one-pixel, transfer lines use rounded caps, control and metric areas have stable dimensions, and long processes collapse into vertical mobile flows. Animation is limited to places where temporal order will add information; the first pass establishes correct states and measurable interactions before continuous motion is added.

## 6. Defects found and repaired

- Long equations silently scaled below the 0.75 mobile floor despite zero document overflow. They were split into semantic aligned rows while retaining Korean in-equation operation annotations.
- Full callback names clipped inside short executor timeline bars. The bars now use stable I/W/F glyphs with an external legend.
- The final 100 ms timeline tick crossed the right edge. It now uses edge-aware alignment.
- Five lifecycle states were forced into a narrow desktop row, breaking words one letter at a time. The state panel now uses two columns on mobile and three columns in the split desktop layout.
- Tall lab screenshots can contain the global sticky header during Playwright element stitching. This was identified as capture behavior rather than inner panel overlap; page-level overflow and clipping checks remain zero.

Every repair was checked against its original failed invariant and visually reviewed at mobile and desktop widths.

## 7. Verification state

Local browser checks passed at 360, 390, 768, and 1440 px. Both articles have zero horizontal overflow, KaTeX errors, missing Korean equation annotations, inner scroll areas, clipped text, raw LaTeX, and console errors. Minimum math scale is 0.76 for the concept article and 0.77 for the paper at 360 px. All nine concept labs and the paper lab change visible measured state.

Targeted ESLint and the production build passed; the pre-existing chunk-size warning remains. `cm-blog.service` was restarted at 14:30 KST. The concept article, paper article, and robotics category return HTTP 200. Public browser checks repeated the rendering and interaction gates, and the category list contains both article links without overflow at 390 and 1440 px.

Publicly verified pages:

- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-ros2-runtime-communication>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-casini-ros2-response-time-2019>

## 8. Replay with 4B and 9B models

A small model should not receive this entire phase as one prompt.

- The orchestrator fixes the gap, source claims, version boundaries, equations, file allowlist, and validation commands.
- A 4B packet contains one claim transformation, one formula annotation, one Viz state transition, or one browser defect.
- A 9B packet contains one complete chapter with four to six source claims, one causal lab contract, and explicit inputs/outputs.
- Current documentation and the historical paper are separate source packets so the model cannot merge version-specific scheduler behavior.
- PDF extraction is bounded by selected pages and claim IDs; the writing pass does not search an unbounded paper while composing prose.
- Each lab packet declares controls, derived state, displayed metric, worst state, recovery state, responsive constraints, and acceptance assertions.
- QA produces mechanical defect packets with viewport, selector, expected invariant, measured value, and screenshot path.
- The JSON ledger preserves each `observed -> inference -> decision -> verification` event, including repaired failures.

The generic schemas and escalation rules remain in `knowledge/authoring/small-model-deep-article-protocol.md`. This report explains the human reasoning; the adjacent JSON is the machine-replay trace.
