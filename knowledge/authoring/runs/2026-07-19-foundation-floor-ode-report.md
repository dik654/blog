# Foundation floor, source visibility and ODE prerequisite report

## 1. Problem that changed the architecture

The paper spine kept walking backward because every paper cited older work. That is historically defensible but pedagogically unusable: readers see dozens of paper cards, cannot tell what is required and never reach the current capability they wanted.

The curriculum now optimizes for an executable stopping point rather than complete chronology. A branch declares a shared concept floor, at most one canonical domain source and at most one current evidence source. Older work is embedded or cited unless it passes a strict promotion gate.

## 2. Reader-facing change

Concept articles remain expanded in category lists. `paper-*`, `research-*` and `reference-*` pages remain searchable and directly reachable but are grouped inside a collapsed `선택 원문 근거` control.

This was applied to:

- AI Foundations
- NLP
- Reinforcement Learning
- flat categories such as Robotics

The source article header now says that it is an optional reconstruction outside the required route. Its prerequisite section is framed as a ladder the reader descends only where blocked, with an explicit instruction not to read every older paper.

## 3. Top-down prerequisite rule

A retained paper remains the top. For every hard equation, figure transition or algorithm step, the author asks what exact operation blocks the target reader. Existing concept articles are reused first. A new foundation article is created only for an uncovered operation, and the ladder stops when the paper's hardest required calculation or diagnosis becomes executable.

This avoids two symmetric failures:

- bottom-up infinity: reading the history of every prerequisite before seeing why it matters;
- top-only jargon: showing `tau=a(s)s_ddot+b(s)s_dot^2+c(s)` and assuming the reader understands state integration and a phase plane.

## 4. Shin-McKay repair

The Shin-McKay source reconstruction contained raw-looking path-dynamics notation and prose that jumped directly to actuator bounds, forward integration, backward integration and a switching curve.

It was rebuilt in plain causal order:

1. `q=q(s)` means the geometric path is fixed.
2. `s=s(t)` means time only decides how fast the robot advances along that path.
3. Substitution turns every actuator limit into a permitted path acceleration interval.
4. The start rollout uses the largest allowed acceleration.
5. The goal rollout is integrated backward using the strongest allowed braking.
6. Their feasible meeting point is the acceleration-to-braking switch.

The projected dynamics and bounds now render as KaTeX, and the source reconstruction uses responsive numbered cards instead of a cramped four-column pipeline.

## 5. Why a new ODE article was required

Calculus taught local derivatives, and optimization taught feasible constraints, but no existing article taught how a local rate rule becomes a trajectory. That specifically blocked the forward/backward construction in Shin-McKay.

The new article `미분방정식과 Phase Plane: 변화 규칙에서 궤적 적분까지` supplies exactly that missing rung:

- state and rate rule;
- Euler's `current + interval x rate` update;
- step-size error and RK4 comparison;
- conversion of second-order motion to a first-order state;
- phase-plane trajectories;
- initial-value versus two-boundary problems;
- forward/backward meeting and switching;
- event detection, tolerance and model-error boundaries.

It has six Korean-annotated equations, six FormulaNotes and four causal labs. Euler, Runge, phase-plane and ODE history were not promoted to source articles. The article explicitly returns the reader to Shin-McKay and declares the stopping floor.

## 6. Verification

- Source-collapse and Shin/ODE focused tests passed 15/15 locally.
- The full connected regression passed 100/100.
- Public floor, Shin, ODE and tribology checks passed 32/32.
- At 390 and 1440 pixels, concept cards are visible, source cards are hidden by default and become visible after expansion.
- ODE checks pass at 360, 390, 768 and 1440 pixels with no overflow, inner scroll, raw LaTeX or console error.
- The production build passed and the public routes return HTTP 200.

Public routes:

- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai?sub=ai-foundations>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/differential-equations-phase-plane-numerical-integration>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-shin-mckay-time-optimal-path-1985>

## 7. Replay with small models

A 4B model should receive one blocked source operation, the exact target formula/paragraph, one prerequisite concept, one child-level analogy, one formal derivation and one browser assertion. It must not choose the next historical source.

A 9B model may own the complete prerequisite rung: blocked operations, reader model, narrative, six or fewer formulas, causal Viz contract, evidence boundary and explicit stop test.

The orchestrator decides whether the gap is real, whether an existing article already covers it, where the ladder stops and how source visibility changes. Discovery creates evidence records first; it does not create public source pages automatically.

## Artifacts

- Policy: `knowledge/authoring/foundation-floor-policy.md`
- Paper protocol: `knowledge/authoring/paper-article-protocol.md`
- Small-model protocol: `knowledge/authoring/small-model-deep-article-protocol.md`
- ODE spec: `src/pages/articles/ai/content-specs/differential-equations-phase-plane-numerical-integration.md`
- ODE article: `src/pages/articles/ai/differential-equations-phase-plane-numerical-integration.tsx`
- Source renderer: `src/pages/articles/ai/paper-spine/FoundationalPaperStudy.tsx`
- Shin source spec: `src/pages/articles/ai/paper-spine/robotTrajectorySpecs.ts`
- Category UI: `src/pages/CategoryPage.tsx`, `src/pages/category/FoundationLearningPath.tsx`, `NlpLearningPath.tsx`, `ReinforcementLearningPath.tsx`
- QA: `tests/foundation-floor-ux.spec.ts`, `tests/differential-equations-qa.spec.ts`
