# Robot embedded real-time control reconstruction report

## 1. What was inferred

The previous ROS 2 milestone ended at a bounded host-side actuator callback. The feedback-control article already computed `u_k`, but no article owned whether the device accepted the current epoch, sampled sensors at the intended hardware instant, finished before the PWM latch, applied the same sequence, or returned physical evidence.

That was the next dependency. Adding FOC immediately would have placed a motor algorithm on top of an unstated execution model, so this milestone owns host-to-MCU execution and leaves motor electromagnetics, inverter switching, sensing circuitry, thermal design, EMI, and PCB layout to the next phase.

## 2. How depth was gated

Before prose, a private sixteen-premise manipulator failure was written. The link and heartbeat remain healthy while stale restart commands, ADC skew, early DMA reuse, ISR logging, priority inversion, incomplete WCET, wrong clocks, timer wrap, fixed-point overflow, early watchdog kicks, hidden driver faults, and multi-axis cycle skew interact.

The problem is not published as a quiz. It is a coverage test: every premise must have a derivation, annotated equation, measured lab state, evidence slice, or operational gate in the public article. This prevents a fluent summary from skipping the exact boundary that makes the final failure possible.

## 3. Sources and boundaries

Current FreeRTOS documentation grounds fixed-priority preemption, interrupt/API boundaries, short ISR guidance, and simplified priority inheritance. Arm documentation grounds NVIC nesting. ROS 2 `rclc` documentation supplies the execution-order and LET bridge. EtherCAT Technology Group material separates frame arrival from synchronized local target time.

Liu and Layland 1973 supplies the paper spine. All sixteen pages were read using PDF-aware web extraction; the valid PDF remains at `/tmp/pdfs/liu-layland-1973.pdf`. Local `pdftotext` and `pypdf` were unavailable, so the record explicitly says that no local text extraction was created.

The theorem boundary is part of the content: single preemptive CPU, independent periodic tasks, deadline equal to period, constant or maximum execution time, and restricted nonperiodic work. The RM bound is sufficient rather than necessary. The deadline-driven utilization-one result is not practical 100 percent MCU headroom after ISR, blocking, jitter, I/O, dependencies, caches, faults, and multicore are added.

## 4. Narrative reconstruction

The article follows physical causality rather than API categories:

1. requested, accepted, applied, and observed command identity;
2. function completion versus physical PWM latch deadline;
3. timer-triggered sample, compute, and actuate order;
4. NVIC, bounded ISR work, DMA completion, and buffer ownership;
5. task period, WCET, deadline, jitter, utilization, RM, and EDF foundations;
6. priority inversion and blocking-aware response iteration;
7. fieldbus arrival, distributed clock, target cycle, command age, and axis skew;
8. timer wrap, fixed-point range, stack, logging, and allocation bounds;
9. hardware trip, firmware latch, host observation, and supervised restart.

This order lets a reader trace one torque request to a physical effect and identify the first violated contract.

## 5. Why the Viz works this way

Each of the nine labs changes a causal input and exposes a measurable output. The labs report applied identity, latch cycle, sample error, IRQ margin, buffer corruption, task certificate, high-priority response, command age, six-axis skew, numeric state, or PWM gate. Color is semantic rather than decorative: teal is runtime, violet is scheduling/time, amber is waiting or staleness, emerald is bounded validity, and red is reserved for violated invariants.

Mobile uses vertical causal order. Desktop uses stable split panels, but no half-panel is forced into five tiny columns. Continuous animation remains deferred because timer phase and DMA motion should be added only after static states, interaction, and responsive bounds are correct.

## 6. Defects found and repaired

The first browser pass had no document overflow, yet several equations scaled to 52-69 percent. They technically fit while becoming hard to read. The cause was packing too many annotated operations into one widest row. Command gates, IRQ release, DMA ownership, RM bounds, response iteration, timer wrap, health gates, and host-to-physical response were split into semantic rows. In-equation explanations were also normalized to Korean.

The command and DMA flows initially placed five state cards in a narrow desktop half-panel. Words broke and visual order weakened. This was a density defect, not a color defect. The layout now uses a three-column 3+2 rhythm on desktop and a vertical sequence on mobile.

## 7. Verification state

Local checks at 360, 390, 768, and 1440 px report zero document overflow, KaTeX errors, missing annotations, inner scroll, clipped text, forced word breaks, raw LaTeX, and console errors. The concept article has 14 annotated display formulas and reaches a minimum scale of 0.84 at 360 px. The paper article has six and reaches 0.76. All nine concept labs and the paper schedule lab changed visible state.

Targeted ESLint and the post-repair production build passed; the existing large-chunk warning remains. `cm-blog.service` was restarted and has been active since 2026-07-19 15:11:39 KST. Both articles and the robotics category return HTTP 200. Public browser QA repeated the same four viewport results, all ten interactions changed state, and the category exposed both links at 390 and 1440 px with no overflow or console errors.

## 8. Replaying with 4B and 9B models

For a 4B model, give one bounded packet: one source claim, its version boundary, one private premise, the exact public section, one formula or Viz contract, and one acceptance check. Do not ask it to infer the full curriculum or write the whole article.

For a 9B model, give one section packet: prerequisite and output contract, three to five source excerpts, operation order, one failure counterexample, formula schema, Viz states, and a checklist. Have it produce structured IR first, then prose, then the Viz spec. A stronger model or deterministic validator should check theorem scope, source support, symbol consistency, mobile scale, and interaction behavior.

The reusable protocol is `knowledge/authoring/small-model-deep-article-protocol.md`. This run ledger adds the concrete observed-to-inference decisions and QA repair packets needed to reproduce this milestone.

## 9. Next phase

The next dependency is motor drive and field-oriented control: torque and flux, BLDC/PMSM equations, Clarke/Park transforms, d/q current loops, decoupling, SVPWM and inverter dead time, current sensing and electrical angle, voltage/current/thermal limits, overcurrent and gate-driver protection, parameter identification, and the bridge into power PCB, EMI, and thermal layout. Park and Blaschke are the likely foundational paper spine, subject to source audit.
