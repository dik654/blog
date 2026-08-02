# Robot drive isolation, EMC, functional safety and TIDA-01599 reconstruction

## Why this foundation had to separate four contracts

The preceding robotics chain could command torque, switch a real inverter and give regenerated energy a physical destination. It still left a dangerous vocabulary collapse: isolation, EMC integrity, operational braking, safe torque off, mechanical holding and safe electrical access were often discussed as if one could prove the others.

This milestone starts from the hazard and the claimed endpoint. Protective isolation controls an electric-shock or energy-transfer boundary. Functional or noise isolation can level-shift and break an unwanted reference path without automatically being protective separation. EMC integrity keeps interference from creating an unsafe or unavailable control state. Regenerative or dynamic braking manages motion and energy. STO prevents torque-producing power through a declared safety path, but does not actively decelerate, hold a vertical load, discharge the DC link or prove zero motion. Those contracts remain separate in every section and Viz.

## How depth was forced before prose

A private thirty-two-premise failure scenario was written before implementation. It combines undeclared isolation intent, copied creepage, an incomplete barrier, faster switching edges, parasitic return paths, symptom-driven filtering, two nominal STO channels with shared dependencies, unbudgeted OSSD filtering, stored gate-driver energy, MCU-correlated feedback, no fault injection, a falling vertical axis and an unbounded `SIL3 / PL e` claim inherited from a reference board.

The scenario is not printed as a quiz. It is a transfer gate. A reader who has only the two public articles should be able to identify the hazard and boundary, collect insulation inputs, derive displacement current, distinguish CMTI from universal immunity, draw CM and DM paths, allocate stop functions, expose common causes, budget diagnostics and timing, read TIDA/TÜV evidence conservatively and limit a deployment claim to its weakest current evidence set.

## How standards were used without fabricating design values

IEC 61800-5-1:2022 establishes the relevant adjustable-speed drive product-safety scope. IEC 61800-3:2022 with COR1:2025 establishes the EMC scope. IEC 61800-5-2:2016 anchors safety-related drive functions, and ISO 13849-1:2023 keeps the current machine-control-system context visible.

The article does not reproduce proprietary normative tables, emit a universal spacing value or choose a PL/SIL target. Instead, the insulation lab refuses to declare the lookup ready until working and repetitive voltage, impulse/transient environment, overvoltage category, pollution, material, altitude, coating/slot state and every barrier component are present. The same boundary applies to reliability: no PFH, MTTFd, diagnostic coverage or category claim is invented without the actual architecture, data, duty and risk assessment.

## Why TIDA-01599 and the TÜV report became a separate reference article

The TI design guide is useful because it exposes a real de-energize-to-trip, dual-channel architecture. It is also easy to misuse. `STO_1` controls the primary VCC path while `STO_2` controls a separate P24/isolated-secondary path. The MCU diagnostics are outside the declared safety path. Protected supplies, secondary-rail decay, temperature sensing and the input pulse contract are assumptions or integration duties rather than universal properties.

The explorer therefore has six evidence states: architecture, assumptions, diagnostics, timing, revision and TÜV scope. Approximate measurements of `2.7 ms`, `7.4 ms` and `1.52 ms` remain board/revision/test-point observations. The shown tests identify Rev. E1.0, while the later public reference is E2.1 with fifteen major changes. The TÜV document is read as a concept review of the architecture and block FMEA, not a target-machine certificate. It also uses the historical ISO 13849:2015 basis, which is not silently presented as the current 2023 edition.

## Narrative, equations and visual reasoning

The concept article follows one causal chain:

1. name the hazard and the exact claim;
2. establish whether the insulation question is ready for normative lookup;
3. disturb the barrier with switching `dv/dt`, parasitic current, skew and rail decay;
4. trace the high-frequency current through the whole machine;
5. classify source, path and victim before choosing mitigation;
6. turn emissions and immunity measurements into setup-bound evidence;
7. allocate operational stop, STO, holding, discharge and access functions;
8. test whether dual channels are independent and diagnosable;
9. extend electronics timing to the physical motion-safe endpoint;
10. limit deployment to the intersection of requirements, architecture, diagnostics, tests and lifecycle controls.

There are sixteen concept equations and six TIDA-reference equations. Each has Korean operation reasons inside KaTeX and exactly one FormulaNote that records meanings, units, assumptions and failure boundaries. Timing, CM/DM decomposition and claim intersection were split into atomic aligned lines when their original compound form became too small on mobile.

Ten concept labs use different representations because the observables differ. The first is a hazard/function matrix. Insulation is an input-readiness and boundary-continuity gate. Barrier transients expose current, skew and margin. CM current is a closed return loop. Coupling is a source-path-victim intervention map. EMC evidence is a measurement ledger. Stop functions are allocated rather than blended. Redundancy exposes shared causes and diagnostic age. STO timing shows electronics and mechanics on different clocks. The final lab is a staged safety-case gate.

Animation remains deferred until the static curriculum chain is complete, as requested. Later animation should be added only where time is causal: barrier-current pulses, diagnostic-test ageing, rail decay, STO propagation and brake engagement. Static state changes already work with explicit controls and reduced-motion settings.

## Defects found and repaired

The first focused browser run found mobile formula scales near `0.54` and `0.60`. Accepting those values or adding horizontal scroll would have hidden the reasoning. STO timing was regrouped into front-end and power-off intervals, CM/DM definitions became two aligned equations and the deployment claim became grouped intersections. Final post-font-load scales are `0.78` and `0.87` for the concept article at 360 and 390 px, and `0.74` and `0.85` for the reference article. Tablet and desktop remain `1.0`.

Representative first-lab, common-mode, STO-timing, safety-case, TIDA-architecture and revision views were inspected at mobile and desktop sizes. Narrow layouts recompose vertically; they do not crop a desktop canvas. There is no page overflow, inner Viz scrolling, clipped label, raw LaTeX or English-only equation annotation at the four tested widths.

The production build passes. Repository-wide strict TypeScript is not green because unrelated legacy pages still contain pre-existing JSX namespace and old component-prop errors. The new isolation/reference files add no reported strict-type error, and outdated `ConceptPrimer` props in the two directly connected drive pages were repaired. This limitation is recorded rather than hidden.

## Verification and public deployment

The focused local Playwright suite passed 12 tests in 27.6 seconds. The connected `Power Electronics -> Energy & Braking -> Isolation/EMC/STO` regression passed 36 tests in 29.7 seconds. After the production build and `cm-blog.service` restart, the same isolation suite passed all 12 tests against the public host in 25.7 seconds.

Both public article routes return HTTP 200. QA checks formula-note parity, every Korean `\text{...}` label, raw-LaTeX absence, post-font-load scale, document and formula bounds, no inner scrolling, interaction changes in all ten labs and all six TIDA states, category exposure and the navigation sequence from braking through the company reference.

## Replaying the work with 4B and 9B models

A 4B model receives exactly one claim-mechanism-formula-Viz or QA-repair packet. The packet contains one primary-source locator and page, one premise ID, one hazard and boundary, immutable sign and unit conventions, one atomic equation or transition, one target component, one measured failure and one acceptance metric. It must emit `claim -> source condition -> mechanism -> assumption -> does not prove` before prose. It may not retrieve broad standards, invent spacing or PL/SIL values, turn board timing into machine stop time or treat an MCU echo as independent feedback.

A 9B model receives one causal section or one TIDA evidence view. It gets four to six bounded source claims, a premise subset, derivation order, formula contract, one counterexample, Viz state machine, source/non-transfer fields and mobile/evidence checks. It normalizes the source IR, writes intuition before mathematics, derives atomic equations, adds a failure boundary, implements one causal Viz and returns unresolved integration assumptions.

The orchestrator retains source retrieval and edition conflict resolution, private compound-problem construction, scope splitting, terminology and endpoint consistency, normative handoffs, provenance, browser QA and production deployment. Failed packets return with the exact viewport, formula or selector, expected invariant, observed metric, source boundary and allowed files. A child model may decompose the content, but it may not lower thresholds or broaden a safety claim.

The machine-readable ledger is `knowledge/authoring/runs/2026-07-19-robot-drive-isolation-emc-safety.json`.

## Next milestone

The next physical dependency is `Robot Actuator Mechanics, Transmission & Holding Brake`. The curriculum already knows how to generate electromagnetic torque and remove it safely, but it has not yet connected motor torque through gear ratio, efficiency, reflected inertia, backlash, lost motion, torsional stiffness, resonance, bearing loads and encoder placement to the actual joint. It also needs to explain how a spring-applied holding brake takes over from STO, what engagement and wear assumptions mean and why a static torque label is not a complete vertical-axis safety case.

The company-reference spine will use primary strain-wave reducer and servo holding-brake engineering material, cross-checked with current motor-sizing and bearing-load sources. Vendor lifetime or safety ratings will remain tied to their stated load spectrum, lubrication, temperature, mounting and risk assumptions.
