# Robot drive energy, braking safety and ABB Guide No. 8 reconstruction

## Why this was the next dependency

The preceding chain could turn a torque request into FOC voltage, PWM, gate switching and measured phase current on a concrete 48 V board. It still could not answer the next physical question: when the robot slows down, where does the released mechanical energy go?

That omission is dangerous because negative torque is not an energy destination. A battery may reject charge, a bench supply may trip on reverse current, every axis may regenerate at once, a DC-link capacitor may offer only milliseconds of headroom and a resistor that passes average-watt calculations may fail its current or pulse-energy limit. This milestone therefore owns the chain from the requested stop to measured mechanical energy, DC-bus rise, runtime sink allocation, contactor state and commissioning evidence.

Isolation, EMC and certified functional safety were split into the next milestone. Those topics require a different evidence system: insulation coordination, interference paths, redundant shutdown channels, diagnostic coverage and standards allocation. Combining both would have produced a broad catalog instead of a problem-solving foundation.

## How depth was forced before prose

A private thirty-premise failure scenario was written first. It combines reflected inertia, a descending payload, elastic energy, simultaneous multi-axis regeneration, a BMS whose charge allowance vanishes, a source that cannot sink current, a resistor selected from average watts, timer-only precharge, ignored contact feedback, source-side-only voltage measurement and a battery disconnect during regeneration.

The scenario is not printed as a quiz. It is a coverage gate. The resulting article must let a reader reconstruct the sign convention, energy inventory, peak and repeated duty, capacitor deadline, valid sink set, resistor feasibility interval, common-bus residual, contactor lifecycle, torque supervisor and staged evidence needed to diagnose it. Every premise maps to causal prose, a Korean-annotated equation, an interactive observable, a failure boundary or an operational gate.

## Why ABB became the company-reference spine

ABB Technical Guide No. 8 provides a durable order for reasoning about braking: start with mechanics, calculate power and energy, expose the short DC-capacitor timescale, then choose an energy destination according to duty and system constraints. Its Rev. C identity and date are pinned as `3AFE64362534 REV C EN`, 31 May 2018.

The guide's values are not treated as robot evidence. The public reference lab keeps ABB's published `5 mF`, `565→735 V`, `90 kW`, approximately `6 ms` calculation in one panel. An illustrative `2.2 mF`, `50→56 V`, `5 kW` robot calculation appears in a separate panel and is explicitly labeled as adaptation rather than source evidence. The same boundary applies to the fan, hoist, common-DC and economic examples.

This is the reusable company-research pattern: preserve `claim -> source condition -> observation -> transfer -> does not transfer`, rather than converting a vendor guide into an unattributed tutorial.

## Narrative and formula reconstruction

The concept article follows the failure chain:

1. a stop request creates an energy-routing obligation;
2. rotational, translational, gravitational and elastic energy are inventoried;
3. torque-speed signs and the trajectory define quadrant, peak power and event energy;
4. squared-voltage capacitor headroom becomes an intervention deadline;
5. only currently valid battery, source, peer and dump sinks are counted;
6. resistor current, power and pulse constraints form a feasibility interval;
7. synchronized axis powers determine common-bus reuse and residual;
8. precharge, main contact, isolation and discharge become measured state transitions;
9. available sink power is converted back into allowed regenerative torque;
10. commissioning closes mechanical and electrical energy ledgers.

There are 25 concept equations and eight ABB-reference equations. Each has short Korean operation reasons inside KaTeX and exactly one FormulaNote containing symbol meaning, units, assumptions and failure boundaries. Sink allocation is written as a sum over the currently valid sink set. The final supervisor derivation is deliberately split into `available power -> power-limited torque` and `power/current intersection`; this improves both reasoning order and mobile legibility.

## Why the Viz is not one repeated diagram

Ten labs use representations chosen for the mechanism. The first exposes the actual energy destination of coast, dynamic, regenerative and resistor modes. Energy inventory uses a term ledger. Four-quadrant control uses an operating-point map and signed-power trace. Bus headroom uses a millisecond voltage curve. Sink selection uses allocation bars. The chopper uses a resistance interval and pulse ledger. Common DC uses synchronized axis lanes. Contactor logic is a physical state machine with injected faults. The supervisor compares requested and allowed torque. Commissioning is a staged evidence gate.

ABB's alternative comparison remains a table on larger screens but becomes stacked cards on mobile. This repair matters because a bounded four-column table can still be unreadable. The design rule is to change composition when the information hierarchy changes, not just reduce font size.

Animation remains deferred until static causal states across the curriculum are complete. Explicit controls already expose the causal transitions and work with reduced motion. Later animation should add time only to bus rise, contactor sequencing, chopper hysteresis or fault propagation where temporal order adds information.

## Defects found and repaired

The first browser pass found English-only equation annotations such as `chopper current`, `precharge trajectory` and `stop-time first estimate`. All underbrace text was translated, and QA was strengthened to inspect every `\text{...}` annotation rather than merely checking that a formula contained some Korean somewhere.

A later post-deployment metric rerun exposed a font-load-dependent minimum scale of `0.83` at 390 px even though an earlier run had passed at `0.85`. The test now waits for `document.fonts.ready`. The overloaded formulas were then normalized or split instead of shrinking further. Final public scales are `0.78` at 360 px, `0.89` at 390 px and `1.0` at 768 and 1440 px.

Representative mobile and desktop captures were inspected for the energy path, four-quadrant map, resistor interval, contactor state machine, commissioning ladder and ABB source/adaptation view. There is no document overflow, inner Viz scrolling, formula overflow, raw LaTeX, SVG-label escape or console error at the four tested viewports.

## Verification and deployment

The production build passed. The repository's existing warning for chunks larger than 900 kB remains and is not caused by this milestone.

The Playwright suite checks both articles at 360, 390, 768 and 1440 px. It verifies equation-note counts, every Korean formula annotation, raw-LaTeX absence, document and formula bounds, no inner Viz scrolling, SVG label bounds, post-font-load scale thresholds and console errors. It also changes all ten concept labs, changes the ABB evidence selector, checks both category links and proves the `Power Electronics -> Drive Energy & Braking -> ABB Guide` navigation sequence.

All 12 tests passed locally in 25.2 seconds and on the public host in 21.8 seconds. Both article routes and the robotics category return HTTP 200. `cm-blog.service` is active after the final production restart.

## Replaying the work with 4B and 9B models

A 4B model receives one claim-mechanism-formula-Viz packet. It gets one primary-source locator and page, one premise ID, immutable sign and unit conventions, one equation or state transition, one target component, one observed failure and one acceptance metric. It must emit claim-condition-boundary IR before prose. It cannot broaden retrieval, change signs, invent component ratings or copy ABB values into a robot claim.

A 9B model receives one causal section. Its packet contains the prerequisite and output contract, four to six source claims, its assigned premise subset, derivation order, formula contract, one counterexample, a Viz state machine and mobile/evidence checks. It normalizes IR, writes intuition before mathematics, derives atomic formulas, implements one causal Viz and audits only its assigned premises.

The orchestrator retains source retrieval and conflict resolution, private compound-problem construction, scope splitting, cross-section signs and symbols, source-versus-adaptation provenance, browser QA and deployment. A failed packet comes back with viewport, selector or formula ID, expected invariant, observed value and allowed files; it does not silently expand scope.

The machine-readable ledger is `knowledge/authoring/runs/2026-07-19-robot-drive-energy-braking.json`.

## Next milestone

The next dependency is `Robot Drive Isolation, EMC & Functional Safety`. TIDA-01599 and its TÜV assessment are already pinned for the company-reference reconstruction. The concept article must separate operational braking, mechanical holding and certified torque removal while covering isolated power and signal paths, creepage and clearance assumptions, common-mode and conducted/radiated interference, dual-channel STO behavior, diagnostics, proof tests and the limits of what a reference design or standard title alone proves.
