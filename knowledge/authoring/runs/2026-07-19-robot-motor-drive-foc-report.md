# Robot motor drive and FOC reconstruction report

## 1. What was inferred

The feedback-control article already produced a torque request, and the embedded real-time article proved that a fresh command could reach a PWM latch on time. Neither one explained what the PWM value means physically, how three phase currents become a rotating field, why `d` and `q` are valid only under an angle contract, or how a gate-driver trip can invalidate a successful software command.

The next dependency therefore had to own the chain `torque -> current -> voltage -> duty -> gate -> phase current -> observed torque`. A full power-electronics and PCB treatment is still too large for the same article, so this milestone closes the FOC contract and leaves semiconductor sizing, isolated supplies, creepage, EMC, STO and production layout to the next hardware foundation.

## 2. How depth was gated

Before prose, a private twenty-two-premise IPMSM joint failure was written. It combines line/phase parameter confusion, peak/RMS mismatch, poles versus pole pairs, incompatible Clarke scaling, reversed encoder direction, wrong phase order, uncertain alignment, missing sample-time integration, scalar clipping, windup, stale DC-bus assumptions, switching-edge samples, two-shunt blind windows, dead time, sensor saturation, regenerative bus rise, a hidden gate-driver trip and unsafe commissioning order.

The problem is not published as a quiz. It is a coverage gate. Every premise must map to public derivation, a Korean-annotated formula, a lab observable, an evidence slice or an operational gate. This forces the article to contain the insight needed to solve the hard problem without turning the article into a list of answers.

## 3. Sources and provenance boundaries

The primary paper spine is Felix Blaschke's complete 1973 thesis. The 264-page PDF was retained at `/tmp/pdfs/blaschke-field-orientation-1973.pdf`, extracted to text, and rendered pages were visually checked where notation and diagrams mattered. Evidence anchors cover the problem and DC analogy, field coordinates, measured-field structure, model-field tolerance, synchronous/induction cases, stability/generalization and TRANSVEKTOR converter realization.

This selection was deliberate. A full accessible Park 1929 primary text was not secured, so an exact Park reconstruction was not fabricated from secondary summaries. Park remains bibliographic context until the primary source is available.

Blaschke grounds the representation-as-control-design idea. Modern equations and implementation details are separately grounded in current TI and Microchip documents: Clarke/Park flow, IPMSM `d-q` voltage and torque, `Vdc/sqrt(3)` under the declared convention, MTPA, field weakening, anti-windup, PWM-state-dependent sampling, commissioning, dead time, gate drive and inverter protection. The article explicitly avoids attributing these later details to the thesis.

## 4. Narrative reconstruction

The concept article follows physical causality:

1. torque is a request, not a phase duty;
2. balanced phase currents are one rotating vector;
3. Clarke removes a redundant coordinate under a declared scaling and zero-sequence assumption;
4. Park rotates the coordinates only when pole pairs, sign, offset and phase order are correct;
5. PMSM equations expose resistance, dynamics, coupling, back EMF and two torque sources;
6. two current PI loops share one limited voltage actuator;
7. SVPWM constructs an average vector from discrete inverter states;
8. current and rotor sensing determine whether the coordinates are observable;
9. MTPA and field weakening navigate current, voltage, thermal and regenerative constraints;
10. commissioning proves the chain with independent physical evidence.

The Blaschke article then reconstructs the historical reasoning rather than repeating the modern tutorial. It begins with the inaccessible coupled operating variables, derives field-parallel and perpendicular channels, compares measured and model field references, exposes detuning leakage, separates synchronous and induction cases, and ends at stability limits and physical realization.

## 5. Why the Viz works this way

There are ten concept labs and one primary-source mechanism lab. Each control changes geometry, a numerical response, a physical limit or a gate. Examples include phase-vector orientation, Clarke scaling, electrical-angle leakage, PMSM torque decomposition, current-loop saturation, SVPWM dwell, current-sample observability, operating-envelope feasibility and commissioning advance.

The visual language is restrained. Teal marks applied current and valid runtime paths, violet marks electrical frames and references, amber marks modeled uncertainty or limits, emerald marks verified states, and red is reserved for violated invariants. Lines are thin, plot dimensions are stable, controls stack before evidence on mobile, and long prose stays outside plots.

Animation is still deferred. A rotating-field or PWM-period play mode may be useful later, but static states and explicit controls already need to explain the mechanism, work with reduced motion and pass responsive QA first.

## 6. Defects found and repaired

The first formula pass had no horizontal scrollbar, yet several equations were scaled to 52-69 percent on a 360 px viewport. The failure was semantic density: wide matrices and several operations had been packed into one row. Clarke/Park transforms were expanded into scalar projections, torque and motor terms were split, and limiter, saturation and integrator updates were separated. Every display formula retains a short Korean reason inside KaTeX and one detailed `FormulaNote` below it.

The first visual pass also revealed defects that a color audit would miss. Rotor flux and the `d` axis share a direction, while original and model fields can be close, so endpoint prose overlapped. Vector names now live in compact color/line-style legends and only `d/q` remain at endpoints. The current-loop failure curve used a fixed vertical domain; a high-speed impossible request fell below it and appeared as a flat line. The chart now derives its range from the actual trace, while the default state starts inside the feasible voltage region so the intended tracking mechanism is visible before the reader induces failure.

## 7. Verification state

Targeted ESLint, TypeScript and the production build passed. The existing large-chunk warning remains; the new motor/FOC chunk is about 84.6 kB, 26.9 kB gzip.

Public browser QA at 360, 390, 768 and 1440 px reports zero document overflow, inner scroll, clipped text, forced word breaks, KaTeX errors, annotation misses, raw LaTeX and console errors. The concept article has 27 display formulas and 27 notes; its minimum scale is 0.78 at 360 px. The paper article has six formulas and six notes; its minimum is 0.77. All ten concept interactions and the paper mechanism interaction changed visible state.

`cm-blog.service` was rebuilt and restarted. The concept article, paper reconstruction and robotics category return HTTP 200, and the category contains both links on mobile and desktop.

## 8. Replaying with 4B and 9B models

A 4B model should receive one immutable claim packet: source and page range, one premise ID, the exact public section, one formula or Viz contract, the target component, one shared primitive and one acceptance metric. It may explain or repair the packet, but it must not retrieve an unbounded corpus, rewrite the equation convention or infer curriculum order.

A 9B model may receive one full section packet: prerequisite and output contract, four to six source claims, derivation order, immutable equations and symbol table, one failure counterexample, one Viz state machine and the section coverage checklist. It should emit structured IR first, then prose, then the Viz spec. The orchestrator owns retrieval, conflicting-source resolution, cross-section symbols, file integration, browser QA and deployment.

QA feedback must remain narrow. A useful repair packet says: viewport `360`, selector or formula ID, expected invariant `scale >= 0.75`, observed value `0.52`, screenshot path, and allowed file. The small model repairs that one defect and the deterministic browser runner returns the next measurement. After two failed repairs of the same invariant, it escalates instead of broadening scope.

The machine-readable ledger in `knowledge/authoring/runs/2026-07-19-robot-motor-drive-foc.json` preserves the rejected designs and observed-to-inference decisions. The generic pass protocol remains in `knowledge/authoring/small-model-deep-article-protocol.md`.

## 9. Remaining boundary and next phase

The labs are educational deterministic models, not dynamometer, oscilloscope, thermal or EMC measurements from a real drive. The next hardware foundation should cover power-device selection, gate loop and isolated supply, shunts and amplifiers, DC link, protection, thermal paths, EMI, stack-up and PCB current-return geometry. Induction-machine observers, sensorless control and an exact Park 1929 reconstruction remain separate source-bounded tracks.
