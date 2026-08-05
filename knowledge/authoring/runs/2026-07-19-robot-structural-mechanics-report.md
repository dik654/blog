# Robot Structural Mechanics authoring report

## 1. Why this layer was next

The actuator milestone explained how motor torque becomes joint torque, motion, compliance, bearing load and brake state. It still represented the housing and link as lumped stiffness values. The feedback curriculum then assumed that plant. The missing layer was therefore not another controller chapter; it was the physical path from robot pose and event to forces, moments, local response, failure modes and measurements.

The gap audit produced an ordered dependency:

`mission/pose -> load case -> FBD -> section resultants -> stress/strain/deformation -> failure gate -> FEA extension -> physical correlation`

The public concept article follows this order. It does not start with a colorful FEA contour because a solver cannot repair an incorrect system boundary or missing moment arm.

## 2. The private hard problem

Before writing prose, the run created a forty-six-premise shoulder-joint failure. The team in that scenario passed a peak von-Mises screenshot while mixing reference planes, omitting braking and offset moments, confusing stiffness with strength, mishandling bolt preload and fatigue, accepting singular FEA peaks and closing the claim without physical correlation.

This problem is not printed in the article. It is a coverage gate. A reader should acquire enough insight from the public article to find every bad premise. The complete premise map and its public resolution live in the content spec and adjacent JSON ledger.

## 3. How the content was reconstructed

The concept spine was built from the operations a structural claim must execute:

1. Declare pose, event, coordinates, boundary and reference plane.
2. Move forces without losing the equivalent moment.
3. Convert section resultants into stress, strain and displacement.
4. Preserve section geometry through area, second moment and torsional response.
5. Select a failure criterion that matches the material and mechanism.
6. Resolve preload, clamp, slip, separation and load-introduction paths.
7. Convert a time history into counted cycles without hiding mean stress or order effects.
8. Compare structural modes with excitation and controller behavior.
9. Treat FEA as a falsifiable model with balance, convergence and correlation gates.
10. Carry temperature into expansion, alignment and preload rather than checking only maximum temperature.
11. Close each model layer with a measurement capable of disproving it.

Every display equation explains why it divides, squares, sums, integrates or takes a square root. Each also names where the simplified relation fails. This keeps the article implementation-oriented without turning it into an equation catalog.

## 4. Why the sources are separate articles

The current NASA bolt report and the historical Manson fatigue note answer different questions.

NASA/TM-20250005284 derives a stiffness-based load-introduction factor from clamping and relieving paths. All 112 pages, including Appendices A-J, were included. Its important lesson is not that SBLIF is always better. The report explicitly shows that `n`, `phi` and thermal load share stiffness dependencies, and that a poor stiffness approximation can make SBLIF unconservative.

NASA TN D-3839 begins with Miner's order-blind linear sum and proposes double-linear damage. All 41 pages were included. The authors later relax their literal crack initiation/propagation interpretation into experimentally determined effective phases because the first total-life-only split does not fit every regime. The article preserves that self-correction and the smooth 1/4-inch specimen boundary.

The original 1945 Miner paper was not made into a standalone reconstruction. Its publisher PDF was inaccessible, so doing so from secondary summaries would violate the full-source reading rule. Manson 1967 was selected because its complete primary text was available and it both states and tests the Miner baseline.

## 5. Why the Viz use different geometries

The eleven concept labs are not one box-arrow template with different colors. They expose different observables:

- load path and moment arm,
- stress-strain response,
- section material placement,
- combined normal/shear state,
- notch and buckling margins,
- clamp and slip state,
- ordered fatigue blocks and damage ledger,
- mode/excitation separation,
- FEA convergence and reaction balance,
- thermal expansion/preload drift,
- analysis-to-test correlation.

Controls must change a computed value, a failure status or an evidence conclusion. This was verified for all eleven labs. Static causal interaction was implemented first; decorative animation remains deliberately deferred until the full curriculum prose is stable.

## 6. Formula and responsive repairs

The first mobile run found no horizontal overflow but exposed an important readability defect: a one-line mean/amplitude equation scaled to `0.72` at 360 pixels and `0.79` at 390 pixels. The moment-transport formula also reached `0.79`. The acceptance threshold was not lowered.

The fatigue equation was split into two aligned semantic rows. The moment annotations were shortened without removing the position vector, force or free moment. During the actuator-plus-structure parallel regression, the Manson transition equation passed alone at `0.86` but dipped to `0.81` under font-load timing. Its Korean labels were shortened to direct terms and tested again.

Public measurements after the repairs are:

| viewport | concept | NASA report | Manson paper | page overflow |
|---|---:|---:|---:|---:|
| 360 | 0.83 | 1.00 | 1.00 | 0 |
| 390 | 0.92 | 1.00 | 1.00 | 0 |
| 768 | 1.00 | 1.00 | 1.00 | 0 |
| 1440 | 1.00 | 1.00 | 1.00 | 0 |

There are no inner-scrolling Viz, raw LaTeX strings, English-only `\text{}` formula annotations or browser console errors in the tested pages.

## 7. Verification and deployment

- Production build passed. The repository's existing chunks-above-900-kB warning remains.
- Strict TypeScript is still not green because of pre-existing unrelated files; none of the three structural articles or their Viz/spec files appeared in the error list.
- The final connected actuator-plus-structure regression passed 34/34.
- The public structural suite passed 17/17 in 30.4 seconds.
- `cm-blog.service` was explicitly restarted and all three public routes return HTTP 200.
- Formula/FormulaNote counts are `30/30`, `6/6` and `6/6`.

## 8. Replaying the work with 4B and 9B models

A 4B model receives one bounded claim or defect. Its packet fixes one premise, source identity and page, load case and reference plane, units, one failure mode, one equation, Korean annotations, FormulaNote, one Viz state and one acceptance metric. It must emit `claim -> condition -> mechanism -> assumption -> does not prove` before prose. It may not invent a source, mix force with stress, treat stiffness as strength, double-apply `Kt`, universalize Miner or SBLIF, or lower mobile thresholds.

A 9B model receives one causal section or one source evidence state. Its packet contains prerequisites, one reader question and misconception, four to six page-bound claims, derivation order, one counterexample, model boundary, evidence type, Viz state machine, mobile contract and assigned premise IDs. It reads the complete assigned slice, emits structured IR, writes intuition before mathematics, derives grouped formulas, adds a failure observation and audits only its assigned premises.

The orchestrator retains curriculum ordering, broad retrieval, document identity checks, conflicting-source decisions, the private compound problem, symbol consistency, cross-page integration, responsive browser QA and deployment. The generic schema remains in `knowledge/authoring/small-model-deep-article-protocol.md`; the adjacent JSON preserves this run's concrete evidence and repairs.

## 9. Next foundation

The next missing layer is Robot Fracture Mechanics and Damage Tolerance. The current article deliberately stops at stress-life screening. It does not yet teach a crack-like flaw, stress-intensity factor, toughness, crack-growth history, residual strength, NDE probability of detection or inspection interval.

Composite structures should follow as a separate layer. Anisotropy, laminate coupling, joints, manufacturing defects and barely visible impact damage are too deep to append as one section to metallic fracture mechanics.

## Artifacts

- Content spec: `src/pages/articles/ai/content-specs/robot-structural-mechanics-materials-fatigue-thermal.md`
- Concept: `src/pages/articles/ai/robot-structural-mechanics-materials-fatigue-thermal.tsx`
- Concept Viz: `src/pages/articles/ai/robot-structural-mechanics-materials-fatigue-thermal/viz/StructuralMechanicsLabs.tsx`
- Source specs: `src/pages/articles/ai/paper-spine/robotStructuralSpecs.tsx`
- Source Viz: `src/pages/articles/ai/paper-spine/viz/StructuralSourceLabs.tsx`
- QA: `tests/structural-mechanics-qa.spec.ts`
- Machine ledger: `knowledge/authoring/runs/2026-07-19-robot-structural-mechanics.json`
