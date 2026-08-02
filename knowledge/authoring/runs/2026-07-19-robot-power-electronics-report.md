# Robot power electronics and TIDA-010956 reconstruction report

## 1. Why this was the next dependency

The preceding FOC milestone could calculate a requested `d-q` voltage, synthesize PWM and ask whether phase current was observable. It still treated the inverter as a mostly hidden actuator. A reader could therefore understand current control while remaining unable to explain DC-link inrush, regenerative bus rise, half-bridge freewheel current, gate-loop ringing, current-shunt corruption, thermal limits or why a firmware trip may arrive too late.

This milestone owns that missing contract: `source -> protection -> precharge -> DC link -> half bridge -> motor -> shunt -> amplifier -> ADC -> protection decision -> gate discharge`. The public concept article follows that physical path. The company-reference article then checks whether a real design package provides evidence for each part of it.

## 2. How depth was forced before writing

A private twenty-eight-premise inverter failure was written before the prose. It mixes an unbounded DC-link charge, a source that cannot absorb regeneration, incomplete commutation reasoning, MOSFET selection from `Rds(on)` alone, a long shared-source gate loop, misleading probing, an incomplete loss budget, unqualified surface-temperature inference, non-Kelvin shunt routing, insufficient PWM settling, firmware-dependent fault shutdown and an unsafe full-current first power-up.

The problem is not printed as a quiz. It is a transfer gate. Every premise must be answerable from the resulting article through a derivation, Korean-annotated equation, interactive consequence, evidence card or operational gate. This keeps the prose explanatory while preventing the authoring process from skipping the difficult cross-domain assumptions.

## 3. Why a company reference design became the source spine

For this hardware boundary, TI TIDA-010956 provides something a single academic paper usually does not: a linked design guide, schematic, PCB layout, waveform conditions and thermal result. Company research and reference material is therefore handled by the same normalized reconstruction pipeline as a paper, but the document kind is shown honestly as `회사 레퍼런스 디자인`.

The critical provenance repair is the separation of title claim and measured point. The design title states 85 Arms. The shown thermal point is 48 V, 16 kHz, 26.2 Arms or 37 A peak, 28 C ambient, with no heatsink or fan. The reported MOSFET surface rise is 45.5 C to about 73.5 C, and the junction is estimated below 125 C. That evidence supports operation at the shown point. It does not establish continuous 85 Arms operation, hotter-enclosure behavior, lifetime, transient overload or certified STO.

The public Viz therefore keeps five fields separate: claim, test/document condition, observed result, supports and does not support. This is the reusable pattern for later company research posts.

## 4. Narrative and formula reconstruction

The concept article is organized by causal failure order:

1. draw the complete energy and return path;
2. bound DC-link charge and regenerative energy;
3. reconstruct half-bridge commutation and dead time;
4. derive gate current, edge time, bootstrap and Miller limits;
5. separate power, gate and probe-loop parasitics;
6. close the conduction, switching and auxiliary loss budget;
7. propagate loss through a thermal network;
8. treat current sensing as a timed analog chain;
9. convert protection latency into fault current and energy;
10. prove the board through staged bring-up evidence.

There are 23 concept equations and nine reference equations. Each display equation has a short Korean `underbrace` explaining why the operation exists and exactly one `FormulaNote` for units, assumptions and failure modes. Initial mobile formulas that only fit by shrinking to 52-71 percent were split into atomic steps. The final public minimum scales are 0.79 at 360 px and 0.85 at 390 px for the concept article, and 0.85 and 0.96 for the reference article.

## 5. Why the Viz is not a palette change

Ten concept labs use different representations because the mechanisms differ. The energy path uses source-to-load topology; precharge uses charge and energy states; commutation uses current paths; gate drive exposes charge, current and edge-time tradeoffs; ringing separates loop inductance from probe pickup; loss and thermal use budgets and networks; sensing uses a PWM-relative timing window; protection turns latency into current and energy; bring-up is an evidence-gated sequence.

The TIDA desktop architecture remains a topology diagram. On mobile it is not scaled down. It becomes four ordered nodes with readable labels, followed by claim and evidence panels. Long captions reserve space for expansion controls, arrows follow energy direction, lines stay thin and stable dimensions prevent interaction-driven layout shifts.

Animation is deliberately deferred. Explicit controls already expose causal before/after states and work with reduced motion. A future animation pass should add time only to mechanisms such as precharge, commutation, ringing or fault propagation where the temporal sequence adds information.

## 6. Defects found and repaired

The first automated pass caught formulas that had no scrollbar but were too small to read. This changed the acceptance rule from `overflow == 0` to a combined bound: no overflow, no raw LaTeX, Korean annotation present, one note per formula and minimum scale thresholds at both 360 and 390 px.

The first TIDA mobile Viz also passed geometric bounds while remaining visually weak because it was a reduced desktop SVG. It was replaced with a dedicated mobile composition. The evidence cards were then checked for title/control competition, arrow direction, label bounds and inner scrolling. This is the important design lesson: a bounded scene is not automatically an understandable scene.

## 7. Verification and deployment

The production build passed after the final edge-time formula repair. The existing repository warning for chunks larger than 900 kB remains; the new concept chunk is about 82.81 kB, 25.82 kB gzip.

The Playwright suite checks both articles at 360, 390, 768 and 1440 px. It asserts formula and note counts, Korean annotations, absence of raw LaTeX, document and formula bounds, absence of Viz inner scrolling, SVG label bounds and minimum formula scale. It also changes all ten concept labs, changes the TIDA evidence path, verifies both robotics-category links on mobile and desktop, and checks the `FOC -> power electronics -> TIDA` navigation sequence.

All 12 tests passed locally in 24.9 seconds and again on the public host in 21.0 seconds. Both articles and the robotics category return HTTP 200. `cm-blog.service` is active after the production restart.

## 8. Replaying the work with 4B and 9B models

A 4B model receives one claim-mechanism-formula-Viz packet only. The packet contains one source locator and evidence boundary, one private premise ID, one immutable equation and symbol table, one target component, one allowed shared primitive and one deterministic acceptance metric. It emits claim IR first, then a short causal explanation, Korean annotation, FormulaNote and one Viz state or repair. It cannot broaden retrieval or alter units.

A 9B model receives one causal section. Its packet contains the prerequisite and output contract, four to six source claims, derivation order, immutable equations, one counterexample, one Viz state machine and the mobile/evidence checklist. It emits normalized IR before prose and runs a self-audit against only the assigned premise subset.

The orchestrator retains the tasks most likely to cause silent errors: retrieval, source conflicts, title-versus-evidence boundaries, private hard-problem construction, curriculum order, cross-section symbols, browser QA and deployment. A repair packet stays narrow: viewport, selector or formula ID, expected invariant, observed value, screenshot and allowed file. After repeated failure the packet escalates; it does not silently expand scope.

The machine-readable event ledger is `knowledge/authoring/runs/2026-07-19-robot-power-electronics.json`. It records the rejected alternatives and every major observation-to-decision transition so later 4B and 9B pipelines can reproduce the process rather than imitate the final prose.

## 9. Remaining boundary and next phase

These labs are deterministic educational models, not physical oscilloscope, thermal-camera, dynamometer, emissions or fault-injection results. The next dependency is the production hardware-safety layer: isolated and auxiliary gate power, regenerative brake and discharge paths, creepage and clearance, conducted and radiated EMC, independent torque shutdown, functional-safety allocation and the evidence needed before a motor driver becomes a production robot drive.
