# Robot actuator mechanics, Harmonic Drive 2026 and Williamson SEA 1995

## Why the curriculum needed a mechanical plant

The preceding robotics chain could command electromagnetic torque, deliver it through an inverter, manage regenerated energy and remove torque through STO. It still jumped from motor torque to an abstract joint input. That gap hid the actual plant: ratio and efficiency, reflected inertia, mission duty, direction-reversal error, torsional compliance, two-mass resonance, sensor location, output-bearing loads and the handover from motor torque to a holding brake.

The new concept article inserts that plant before generic feedback control. Its invariant is that a joint is not an ideal torque multiplier. Usable motion is the intersection of motor limits, reducer duty and life, compliance and resonance, precision, bearing load, sensing observability, friction, temperature and brake timing.

## How depth was decided before writing

A private thirty-six-premise failure scenario was written first. A vertical robot shoulder multiplies a 3 N·m motor by 100, treats zero tooth backlash as zero output error, applies a universal 5:1 inertia rule, sizes from one peak, copies catalog values across ratio and revision, omits housing compliance and two-mass modes, watches only the motor encoder, checks no output-bearing moment and commands STO before a worn holding brake engages.

The scenario is not printed as a quiz. It is a coverage gate. The public bundle has to let a reader reconstruct why each decision fails, which equation exposes it, what the Viz must show and which conclusion still requires an exact component or measured robot.

The 36 premises are grouped across the twelve concept sections: reference-side accounting, power and ratio, reflected inertia, full-cycle duty, accuracy tests, elastic energy, flexible modes, dual-encoder observability, bearing force/moment, directional friction/backdrive, brake handover and lifecycle evidence.

## Why three articles were produced

The concept article owns transferable mechanics. It has twelve different labs because the hidden state changes shape: a physical shaft boundary, torque/speed workbench, inertia composition, load-cycle histogram, hysteresis curve, compliance strip, resonance response, dual-encoder residual, bearing force plane, torque-speed quadrant, brake-overlap timeline and change-impact ledger.

The Harmonic Drive article owns current manufacturer evidence. It reconstructs issue `1053524 05/2026` as seven source states: selection, duty/life, stiffness/resonance, accuracy, bearing, brake/feedback and disclaimer. The manufacturer’s example factors, three stiffness regions, small-torque lost-motion test and average values remain tied to exact product, size, ratio, mounting, lubrication, condition and revision.

The Williamson article owns foundational research intent. The 83-page 1995 thesis is read from the stiff-actuator problem through the motor–spring model, force transfer, output impedance, feedforward/feedback, current and velocity saturation, system identification, hard/soft/moving contact and the author’s admitted disadvantages. Model mismatch is not hidden: omitted inertia shifts the natural frequency; stiction, current clipping, backlash, noise and too much feedforward worsen observed behavior.

## How the sources were processed

The Harmonic Drive catalog and Williamson thesis were downloaded locally, text-extracted and rendered for page inspection. The manufacturer review concentrated on PDF pp. 158–175 and issue identity p. 177. The thesis review checked the physical architecture and motivation, model derivation, performance limits, frequency-response identification, contact tests, conclusion and future work.

Kollmorgen guidance bounded vertical-load brake sequencing and rejected standstill-brake use as routine dynamic braking. SKF bounded the `C/P` basic rating-life relation and separated dynamic life from static/shock and service-environment failures. Spong 1987 is kept as a historical next-reading bridge because its full primary text was not locally auditable; detailed equations were not reconstructed from metadata alone.

## Formula and visual reasoning

The concept article contains 21 display equations, the company article seven and the thesis six. Every equation has Korean `\text{...}` operation labels and exactly one FormulaNote with symbol meaning, units, reference side, assumptions and non-transfer boundary.

The first mobile run exposed the exact failure the user had warned about. Nothing overflowed, but the concept evidence-intersection formula scaled to `0.52` at 360 px and the catalog resonance formula to `0.67`. The threshold was not lowered. The inertia ledger became base inertia plus reflected load, the claim intersection became two evidence groups, the resonance equation and assumption became separate aligned lines, and piecewise stiffness used explicit per-region torque increments. Public minimum scales are now:

- 360 px: concept `0.84`, company `0.89`, thesis `0.85`
- 390 px: concept `0.89`, company `0.94`, thesis `0.94`
- 768 and 1440 px: all `1.0`

Screenshot review found another presentation defect: the global scene number such as `V13` competed with an internal label such as `JOINT LAB 11`. The internal index now remains in the accessible label while the visible caption uses only the global sequence and the Lab role.

## What the QA proves

The focused local suite passed 17 tests. The connected isolation/STO plus actuator regression passed 29. The final production build passed with the repository’s existing chunk-size warning. Repository-wide strict TypeScript is still not green because of unrelated pre-existing legacy errors, but no new actuator, Harmonic Drive or Williamson file error was reported.

The service was explicitly restarted. All three public routes return HTTP 200, and the same 17-test suite passed against the public host in 26.2 seconds. It checks 360, 390, 768 and 1440 px; formula/note counts; Korean annotations; raw LaTeX; page, formula and Viz bounds; inner scrolling; console errors; all twelve causal Lab changes; seven catalog states; thesis mechanism and six evidence states; category listing and navigation links.

## Replaying this milestone with 4B and 9B models

A 4B model receives one premise and one source slice. Its packet fixes source identity/page, motor or output reference side, units, one equation, Korean annotations, one failure, one Viz state and one acceptance metric. It may not universalize a vendor heuristic, mix sides, replace a load cycle with a peak, call zero backlash zero error, turn L10 into a warranty, use a holding brake as an unverified service brake or lower mobile thresholds.

A 9B model receives one causal section or one source-explorer state. It gets prerequisites, the reader question, misconception, four to six bounded claims, derivation order, counterexample, source boundary, Viz contract, mobile contract and critic checklist. It must read the complete assigned source slice, emit claim-condition-boundary IR, explain intuition, derive grouped formulas, add measured/failure evidence, implement one causal interaction and audit its assigned premise IDs.

The orchestrator retains multi-source retrieval, revision conflict resolution, private-problem construction, scope splitting, cross-section terminology, provenance, responsive browser QA and deployment. A failed packet returns with viewport, selector/formula, observed metric, screenshot and allowed files; the child may recompose but cannot weaken the claim or acceptance threshold.

The machine-readable ledger is `knowledge/authoring/runs/2026-07-19-robot-actuator-mechanics.json`.

## Next foundation

The next missing physical layer is `Robot Structural Mechanics, Materials, Fatigue & Thermal Design`. The actuator article treats housing and link as equivalent stiffness values; it does not yet teach how geometry, material, fasteners, stress concentration, fatigue spectrum, modes, thermal expansion and tolerance create those values or failures. The next milestone should reconstruct those foundations and correlate analytical/FEA predictions with physical strain, deflection, modal and thermal evidence.
