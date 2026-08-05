# Robot Localization & SLAM reconstruction report

## 1. What was inferred

The next article was not chosen from a list of popular robotics topics. The adjacent article contracts were compared:

- Camera geometry ended with a metric observation at an acquisition-time robot pose.
- Perception scene construction accepted a map-frame sensor pose and accumulated world state.
- Motion planning accepted a coherent, versioned collision world.

The pose and map revision connecting those three stages had no deep owner. ROS 2 graph/QoS was also shallow, but writing it first would leave the physical state chain incomplete. Therefore Localization & SLAM became the next dependency.

## 2. How depth was gated before prose

A private warehouse problem combined fourteen premises: spinning-scan time skew, wheel slip, gyro bias, anisotropic covariance, correlated evidence, map/odom continuity, corridor degeneracy, pose-graph gauge, iterative nonlinear solve, false and true loop closures, repairable map provenance, atomic scene rebase, and localization health.

The integrated problem was not published. Every premise had to map to a public derivation, formula, Viz, or execution gate. This prevented a fluent article that explained definitions but could not diagnose a realistic compound failure.

## 3. How sources were transformed

The source packet separated original claims from modern extensions:

- Cadena et al. supplied SLAM vocabulary and front-end/back-end boundaries.
- Smith, Self, and Cheeseman supplied uncertain spatial relations and correlation.
- Nav2/REP-105 supplied the current `map -> odom -> base_link` operational contract.
- Lu and Milios supplied preserved local scans, weak/strong pose relations, covariance-weighted global optimization, gauge anchoring, linearization, experiments, and explicit limitations.
- GTSAM documentation supplied current factor and robust-noise implementation vocabulary.

For each source the content spec records the claim, what it does not prove, why it is included, and its public transformation. Later concepts such as Huber weighting, sparse incremental solvers, deskew, and atomic planner rebase are labeled as extensions rather than attributed to the 1997 paper.

## 4. Resulting narrative

The nine sections follow causal state construction:

1. Decide the estimation problem and unknowns.
2. Attach measurements to acquisition-time states.
3. Predict dead-reckoning drift and covariance.
4. Innovate, gate, correct, and account for correlation.
5. Split local continuity from global correction.
6. Turn matches into uncertain and possibly degenerate constraints.
7. Solve the anchored pose graph by linearize-solve-retract.
8. Treat loop closure as a high-impact hypothesis.
9. Commit global correction as one downstream revision and health gate.

Each section owns one interactive causal variable and a measured consequence. The article contains fifteen Korean-annotated display formulas and nine interactive Viz. The paper reconstruction separately contains five derivation blocks, a pose-network lab, four evidence slices, a twelve-step reproduction ledger, assumptions, failures, legacy, and next reading.

## 5. Why the Viz look this way

Spatial geometry is drawn in SVG; explanations and metrics use responsive HTML. Blue denotes local measurement/prediction, violet global graph correction, amber uncertainty or weak observability, emerald verified consistency, and red only violated invariants. Curves represent motion or relation propagation and use round caps. Fixed aspect ratios and clamped dynamic coordinates prevent labels, paths, or ellipses from resizing or leaving the scene.

Animation was intentionally deferred. These interactions establish correct states, measurements, and responsive geometry first. Motion should later be added only to the deskew, covariance propagation, graph correction, and rebase order where time sequence adds explanatory information.

## 6. Defects found and repaired

- JSX parsed a transform arrow in prose as markup. It was replaced with safe display text.
- Document overflow was zero, but initial formulas silently scaled to 0.59 in the concept article and 0.52 in the paper. Multi-operation displays were split into semantic rows or separate displays; final 360 px minima are 0.76 and 0.75.
- The desktop covariance label crossed the SVG boundary and overlapped the ellipse. The label was shortened/repositioned.
- Large drift moved the mobile endpoint and ellipse outside the viewBox. Dynamic coordinates are now clamped to stable scene bounds.
- Four loop-evidence cells were too tall on mobile. They now use a 2x2 mobile and 4-column desktop grid.
- Three long rebase mode labels wrapped unevenly. Short labels preserve a one-line segmented control.

Every repair was rerun against the failed invariant rather than accepted from visual intuition.

## 7. Verification and public result

Local browser checks ran at 360, 390, 768, and 1440 px. Both articles have zero horizontal overflow, KaTeX errors, missing equation annotations, clipped SVG text, raw LaTeX, and console errors. All nine concept interactions and the paper interaction change visible state. Targeted ESLint and the production build passed; the existing large-chunk warning remains unrelated.

Publicly verified pages:

- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-localization-slam>
- <https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-lu-milios-scan-alignment-1997>

Both returned HTTP 200 after service restart. Public 390/1440 px browser checks repeated the rendering gates, interaction checks, and robotics-list integration.

## 8. Replay with 4B and 9B models

A small model should not receive this full project as one prompt.

- The orchestrator selects the dependency gap, sources, immutable equations, file allowlist, and validation commands.
- A 4B pass receives one claim packet, one formula explanation, one Viz contract, or one QA defect.
- A 9B pass receives one complete section packet with at most four to six source claims and one Viz.
- The paper source is pre-extracted by claim and page; the small model does not search an unbounded PDF corpus while writing.
- Every pass returns structured artifacts with stable IDs. Missing fields fail schema validation instead of being inferred by the next pass.
- Browser tooling produces defect packets containing viewport, selector, expected invariant, actual metric, and screenshot path.
- The run ledger preserves rejected states as `observed -> inference -> decision -> verification` events.

The reusable packet schemas, pass boundaries, mechanical gates, and escalation rules are in `knowledge/authoring/small-model-deep-article-protocol.md`. This report is the human-readable trace; the adjacent JSON is the machine replay ledger.
