# Robot Fracture Mechanics milestone report

## What changed

This milestone adds a complete metallic fracture-mechanics and damage-tolerance layer after Robot Structural Mechanics:

- Concept: `/lab/blog/ai/robot-fracture-mechanics-damage-tolerance`
- Foundational paper: `/lab/blog/ai/paper-griffith-rupture-flow-solids-1921`
- Current report: `/lab/blog/ai/research-nasa-nasgro-fitness-for-service-2025`

The concept article has 12 sections, 24 annotated display equations and 12 causal labs. Each source reconstruction has six annotated equations, one source-specific mechanism lab and seven evidence states.

## Why this layer was next

The previous structural layer could calculate load path, local stress, stiffness, fatigue screens, modes, thermal distortion and physical correlation. It stopped before a crack-like flaw became an explicit state.

That left a missing causal chain:

`indication -> analysis crack -> G/K -> resistance -> growth -> residual strength/FAD -> NDE -> inspection -> tracked part`

Adding another paragraph to the fatigue section would have hidden rather than solved this gap. Metallic fracture mechanics therefore became a dedicated layer. Composite damage remains separate because anisotropy, delamination and barely visible impact damage do not inherit the metallic K story without qualification.

## How the content was inferred

The authoring process did not start from a table of contents. It started from a private transfer problem involving a detected semi-elliptical flaw in a robot shoulder shaft, mixed bending/torsion, residual stress, environment, NDE capability and solver disagreement.

Twenty-two decisions were extracted from that scenario and normalized into 46 premises. The premise groups then dictated the narrative:

1. Make the flaw state explicit.
2. Explain crack-size physics through energy before introducing K.
3. Introduce the near-tip field and immediately mark its plastic/process-zone boundary.
4. Separate geometry, constraint and material resistance.
5. Connect critical crack and residual strength.
6. Advance the crack with a stateful spectrum model.
7. Combine fracture and collapse in FAD coordinates.
8. Convert NDE capability into the analysis initial condition and inspection window.
9. Close the decision with evidence and configuration traceability.

This sequence was chosen because a reader cannot judge a crack-growth output if the initial flaw, model class and resistance transfer have not been justified first.

## Source reasoning

### Griffith 1921

All 37 PDF pages were inspected. The durable contribution is the energy-balance question and inverse-square-root flaw-size scaling. The article deliberately retains the final Author's Note stating that the cracked-plate strain-energy calculation and equations 6-13 need numerical correction and that the experimental verification must be reconsidered.

The molecular-orientation sections are represented as historical speculation. Modern K fields, metal plasticity and damage tolerance are not retroactively attributed to Griffith.

### NASA-TM-103591

The 82-page primer supplies the conceptual bridge from Griffith to Irwin: modes, asymptotic crack-tip field, plastic-zone screens, toughness, subcritical growth, NDE and proof-test basics. It is used as a teaching bridge, not a current allowables source.

### NASA-STD-5019A Change 4

The 120-page active standard supplies the process boundary: a viable fracture-control program joins design, analysis, testing, NDE and tracking. Its assumed-flaw, spectrum, NDE and traceability structure is retained, while its human-rated spaceflight applicability is not silently transferred to robots.

### NASA/CR-20250011200

All 109 pages were reconstructed around flaw idealization, SIF decomposition, FAD, full-range growth, residual stress and four notional examples. The article preserves four high-value boundaries:

- NASGRO cannot perform nearby-flaw interaction grouping automatically.
- Toughness selection changed example 13.1 from about 12,388 cycles to failure near the surface-to-through transition around 3,450 cycles.
- CC27 versus CC28 changed nozzle-example life by more than one order of magnitude.
- NASGRO and INSPECT showed reasonably good SIF/final-crack agreement but different Lr values; the local/global cause was not fully resolved.

## Visualization reasoning

Each visualization owns a physical state transition. Examples include crack aspect and interaction, released-energy slope, crack-tip mode, geometry factor, thickness constraint, plastic-zone ratio, residual-strength curve, growth regime, ordered spectrum, FAD point, POD window and evidence closure.

The visual grammar uses neutral surfaces with restrained semantic color:

- blue: driving force or selected state
- teal: resistance or accepted evidence
- amber: model boundary or pending choice
- red: exceeded state

Controls change geometry, curves, points, metrics or decisions. Color-only changes are not counted as interaction. Static causality was completed first; decorative animation remains deferred.

## Formula reasoning

Every display equation has one adjacent FormulaNote. Every KaTeX `text` annotation is Korean and describes why a term exists, not only its symbol name.

Long formulas are split by causal role. The NASGRO thickness equation originally scaled to 0.76 at 360 px. Splitting resistance ratio and constraint length into aligned lines raised the public minimum to 0.85 at 360 px and 0.99 at 390 px without horizontal scrolling.

## Failures that changed the implementation

The first browser run found a wrong ConceptPrimer schema, an invalid SVG path used for FAD fill and a tablet-only five-pixel overflow. The overflow came from six source cards plus five arrow columns switching to a horizontal FlowRow at 768 px. Moving that shared breakpoint to 1024 px keeps source flows vertical on tablets and fixes the root layout problem across articles.

These failures are retained in the JSON record because a smaller model needs both the final contract and the critic signals that caused revision.

## Verification

- `npm run build`: passed; only the existing large-chunk warning remains.
- Fracture QA local: 17/17 passed.
- Structural regression local: 17/17 passed.
- Fracture QA public host: 17/17 passed.
- Public routes: all three return HTTP 200.
- Formula/note counts: 24/24 concept, 6/6 Griffith, 6/6 NASA.
- Public document overflow: zero at 360, 390, 768 and 1440 px for all three pages.
- Public minimum formula scale: concept 0.85/0.99/1/1; Griffith 1/1/1/1; NASA 0.85/0.99/1/1.

## 4B and 9B replay

A 4B worker should receive one premise, one source slice, one equation, one Korean annotation set, one counterexample and one acceptance selector. It should not reconcile multiple sources or decide curriculum order.

A 9B worker can own one complete causal section or one source evidence state. Its packet includes prerequisites, author intent, derivation order, claim-evidence-limit boundaries, failure diagnostics, Viz behavior and QA expectations.

The orchestrator retains the private hardest problem, multi-source conflict resolution, terminology across sections, public deployment, cross-article regression and provenance.

## Next milestone

The next gap is Robot Composite Structures, Joints and Damage. It should cover lamina/laminate coordinates, ABD coupling, failure-mode boundaries, load introduction and joints, manufacturing defects, impact/delamination, environment, NDE and allowables/evidence. A primary source spine should only be selected after complete public source access is verified.
