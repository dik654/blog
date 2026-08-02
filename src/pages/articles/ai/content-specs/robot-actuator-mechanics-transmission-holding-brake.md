# Robot Actuator Mechanics, Transmission & Holding Brake content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 자전거의 낮은 기어처럼 속도와 힘을 맞바꾸는 익숙한 장면에서 시작한다.
- 감속비 뒤에는 손실, 휘어짐, 베어링과 정지 뒤 고정이 남는다는 세 단계만 먼저 세우고 정식 용어는 뒤에서 정의한다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal

- Reader outcome: the reader can turn a motor torque request into a defensible robot-joint plant model, size the transmission against motion and duty, distinguish accuracy terms, predict elastic resonance, decide what motor- and output-side encoders can observe, screen output-bearing loads, and design a holding-brake handover that does not drop a vertical load.
- System invariant: a joint is not an ideal torque multiplier. Its usable motion is the intersection of motor limits, ratio and efficiency, reducer duty and life, reflected inertia, compliance and resonance, precision error, bearing load, thermal state, sensing observability, and brake timing.
- Curriculum boundary: this article owns the mechanical plant between motor shaft and robot link. It does not design gear teeth, certify a brake, replace vendor life calculations, derive full manipulator dynamics, or tune the final feedback controller without measured plant data.

## Why this is a missing foundation

| Existing article | Output it already promises | Boundary this article must close |
|---|---|---|
| `robot-kinematics-coordinate-frames` | Converts joint coordinates into link pose and Jacobians. | Kinematics treats commanded joint motion as available; it does not explain transmission deflection, lost motion, load capacity or brake behavior. |
| `robot-dynamics-feedback-control` | Builds state-space, PID, LQR and MPC feedback intuition. | Its plant matrices and actuator input are abstractions until the motor, reducer, compliance, friction and payload are reflected to a common side. |
| `robot-motor-drive-foc` | Converts torque request into measured current and electromagnetic torque. | Motor torque is not output torque, and motor encoder angle is not necessarily link angle. |
| `robot-power-electronics-motor-driver` | Delivers protected current through the motor. | Electrical current capability does not establish reducer duty, output-bearing life, joint accuracy or holding. |
| `robot-drive-energy-braking-safety` | Gives moving energy an electrical destination during operational stopping. | Dynamic braking and regenerative energy handling do not prove a spring-applied brake can hold a gravity-loaded axis. |
| `robot-drive-isolation-emc-functional-safety` | Separates STO, mechanical holding, motion-safe and safe-access claims. | It deliberately defers actual brake sizing, engagement timing, backlash and load motion to this mechanical plant article. |

## Scope decision

| Topic | Depth | Reason |
|---|---|---|
| Actuator boundary and reference side | deep | Motor, reducer, output bearing, brake, encoders and link must be placed before any equation has a valid side or unit. |
| Ratio, speed, torque, efficiency and power | deep | Ratio multiplies torque and divides speed; efficiency is directional and power is not created. |
| Reflected inertia and acceleration torque | deep | Inertia scales by ratio squared and changes both control response and motor sizing. |
| Peak, repeated peak, average speed, RMS torque and life | deep | A peak-only design can pass one move and fail its mission profile. |
| Backlash, lost motion, hysteresis, repeatability and transmission error | deep comparison | These quantities use different tests and cannot be collapsed into one “accuracy” number. |
| Torsional stiffness, stored energy and piecewise behavior | deep | Compliance creates both load filtering and position/force error; catalog stiffness may depend on load region. |
| Two-mass resonance and bandwidth | deep | A flexible joint creates modes that a rigid-body controller does not contain. |
| Motor/output encoder observability | deep | Dual sensing separates motor motion, reducer deformation and link motion, but does not magically remove noise or compliance. |
| Output-bearing radial, axial and tilting loads | deep screening, bounded final life | Robot joints often load the integrated bearing through offset moments, not pure output torque. |
| Friction, efficiency and backdrivability | deep direction-aware reasoning | Static friction, preload and reducer geometry break a single constant-efficiency story. |
| Holding brake selection and handover | deep sequence | A holding brake is not a service brake; vertical load safety depends on torque overlap and timing. |
| Gear tooth geometry, lubrication formulation and final ISO life | handoff | These require the exact component, mounting, contamination, load spectrum and current vendor/standard procedure. |

## Reader prerequisites

- Rotational units: angle, angular velocity, torque, work, power, inertia and the difference between motor-side and output-side quantities.
- Signals and systems: second-order resonance, damping, frequency response and why phase matters near a mode.
- Motor-drive chain: `i_q` produces motor torque within current, voltage, speed and thermal limits.
- Robot dynamics: payload configuration changes joint inertia and gravity torque.
- Safety allocation: STO removes torque-producing power but does not hold a gravity-loaded joint.

## Private hardest transfer problem

Do not publish this compound problem as an exercise. It is the hidden depth test. The article set passes only when a reader can reconstruct a defensible decision and identify which values still require measurement or vendor confirmation.

A seven-axis collaborative arm has a vertical shoulder joint driven by a nominal 3 N·m servomotor, a 100:1 strain-wave reducer, an integrated cross-roller output bearing, a motor-side absolute encoder and a spring-applied holding brake mounted on the motor shaft. The team multiplies 3 N·m by 100 and calls the joint “300 N·m,” although it has not separated continuous, repeated peak, acceleration, emergency or brake torque, included efficiency, reducer inertia, speed limit, thermal duty or life. A marketing statement that the reducer has “zero backlash” is treated as zero output error. A fixed 5:1 load-to-motor inertia heuristic is treated as a stability theorem.

The arm lifts a payload whose center of mass moves from 0.15 m to 0.75 m from the shoulder as the elbow extends. A short pick cycle contains acceleration, dwell, reverse, collision recovery and idle intervals. Sizing uses only the largest instantaneous torque. The housing and output link are assumed infinitely rigid. The command trajectory repeatedly crosses a reducer-related resonance and a compliant two-mass mode; the controller is tuned from a rigid one-inertia model. Motor encoder motion looks smooth while a laser tracker sees delayed output motion, direction-reversal error and residual oscillation. The team increases position-loop gain.

The reducer catalog gives three torsional-stiffness regions, lost motion around a stated small-torque test, repeatability, transmission accuracy, rated/repeated-peak/momentary torque, a life procedure and an example resonance relation. Values from one ratio and catalog revision are copied to a different size and ratio. Average test values are treated as guaranteed minima. Normal-temperature, standard-lubrication and mounting assumptions are omitted. A simplified resonance equation is used even though housing stiffness, motor inertia, load inertia and controller dynamics are comparable.

The wrist link applies radial and axial force plus an offset tilting moment to the integrated output bearing. The designer checks only reducer output torque. Shock, acceleration, mounting preload, contamination and duty distribution are absent from bearing life. During an emergency stop, STO is commanded first and the vertical payload falls through reducer lost motion before the brake closes. In normal production, the holding brake is also cycled for every deceleration, causing wear and heat. Startup releases the brake before drive torque is established; shutdown removes motor torque before brake engagement is proved. Brake rated torque is compared directly with static gravity torque without service factor, motor-shaft conversion, delay, wear, temperature or allowable stopping-energy evidence.

The reader must be able to:

1. Draw the physical actuator boundary from motor current through rotor, reducer, output bearing, brake, encoders and link.
2. Declare whether each variable is motor-side or output-side and reject mixed-side arithmetic.
3. Derive speed division and ideal torque multiplication from virtual work or power conservation.
4. Insert direction- and operating-point-dependent efficiency without claiming that a reducer creates power.
5. Explain why motor continuous torque, peak torque and output catalog torque limits are separate constraints.
6. Reflect load inertia to the motor by the square of ratio and reflect motor inertia to the output consistently.
7. Include rotor, brake hub/coupling and reducer input inertia in the motor-side plant.
8. Reject a universal “5:1” inertia ratio as a stability theorem while preserving it as a possible vendor screening heuristic.
9. Recompute payload inertia and gravity torque across robot configuration rather than at one pose.
10. Separate acceleration torque, gravity torque, friction and disturbance torque with a declared sign convention.
11. Compute RMS torque and average speed over the full cycle instead of sizing from one peak.
12. Compare peak, repeated peak, momentary/emergency, average-speed and life constraints without merging their time bases.
13. Explain why a move can be electrically feasible while reducer life or temperature is unacceptable.
14. Distinguish backlash, lost motion, hysteresis, repeatability and transmission error by stimulus and measurement.
15. Explain why “zero backlash teeth” does not imply zero lost motion or zero direction-reversal error.
16. Avoid transferring an accuracy value across size, ratio, load range, mounting or catalog revision.
17. Convert torsional stiffness into output deflection at a stated torque and use radians consistently.
18. Compute elastic energy and connect it to shock filtering, recoil and oscillation.
19. Handle piecewise or load-dependent stiffness rather than forcing one global slope.
20. Derive the relative two-inertia resonance and state the assumptions behind a one-inertia vendor shortcut.
21. Explain how housing, link and bearing compliance add to reducer compliance.
22. Keep command frequency, mechanical resonance and control bandwidth separate.
23. Predict why raising loop gain against an unmodeled flexible mode can worsen output oscillation.
24. State what motor-side encoder feedback observes and what it hides behind the reducer.
25. Use output-side sensing to estimate link angle and, with a calibrated elastic model, transmission torque.
26. State why dual encoders still require synchronization, resolution, alignment, noise and stiffness calibration.
27. Decompose output bearing demand into radial, axial and tilting-moment components at the bearing reference point.
28. Convert offset force into moment and avoid checking only transmitted torque.
29. Treat basic bearing `L10` as a statistical rating-life model with load-spectrum and environment boundaries, not a warranty.
30. Distinguish dynamic bearing life from static safety against permanent deformation and shock.
31. Explain why efficiency, friction and backdrivability depend on direction, speed, load, lubrication and preload.
32. Separate an actuator's desirable high-frequency compliance from low-frequency force-control accuracy.
33. Allocate commanded deceleration, holding brake, STO and gravity restraint to separate functions and clocks.
34. Sequence startup as drive torque proven before brake release, and shutdown as brake engagement proven before motor torque removal where the risk assessment requires it.
35. Reject repeated operational stopping with a standstill holding brake unless its energy/duty rating explicitly permits it.
36. Build a commissioning evidence ledger that invalidates affected conclusions after payload, ratio, mounting, lubricant, brake, encoder, firmware or trajectory changes.

## Source, intent and boundary ledger

| Source | Original purpose | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Harmonic Drive AG, *Harmonic Drive Mechatronics*, issue 1053524, 05/2026 | Product selection and technical-data catalog for actuators, gears, bearings, brakes and feedback options. | Values and rules are product-, ratio-, mounting-, test- and revision-specific. Catalog averages are not universal guarantees. | Ground duty, stiffness, accuracy vocabulary, integrated bearing and brake decisions in a current manufacturer artifact. | Dedicated source-reconstruction article with page/revision labels and non-transfer warnings. |
| Matthew M. Williamson, *Series Elastic Actuators*, MIT AI-TR-1524 / MS thesis, 1995 | Derives and experimentally evaluates intentional series compliance for force control. | The clamped-load linear model omits many reducer, structural, electronic and saturation effects; the thesis itself reports mismatch. | Show why compliance can improve force control and shock isolation while limiting bandwidth and maximum force. | Dedicated foundational-paper article that follows claim -> equation -> hardware -> experiment -> admitted failure. |
| M. W. Spong, “Modeling and Control of Elastic Joint Robots,” ASME JDSMC, 1987 | Develops elastic-joint robot models under explicit coupling assumptions and relates them to rigid models. | Abstract/metadata is available; full equation reconstruction is deferred until the primary text is locally auditable. | Establish the historical bridge from rigid manipulator dynamics to flexible-joint control. | Bounded historical note and next-reading link, not an equation source. |
| Kollmorgen, *Application Sizing Guide* and official inertia-ratio guidance | Practical motor/reducer sizing and reflected-inertia guidance. | Suggested ratios are heuristics under an application and controller context, not universal stability constants. | Reject the copied 5:1 rule and show iterative sizing. | Inertia lab with heuristic/physics labels. |
| SKF, *Rolling Bearings* catalog / ISO 281 life method overview | Defines basic rating life and equivalent bearing-load workflow. | Basic life assumptions do not include every contamination, lubrication, mounting, misalignment, shock or system failure mode. | Give a bounded bearing-life screen and distinguish static from dynamic verification. | Bearing lab and evidence boundary; no invented final selection. |
| Kollmorgen official motor holding-brake guidance | Defines spring-applied standstill brake behavior and vertical-load sequencing risks. | Drive brake control is not by itself personal-safety evidence; exact delays and torque depend on the component and system. | Ground brake handover and misuse warnings in current vendor guidance. | Brake timing lab with torque-overlap and fall-state observables. |

## Narrative spine

1. Begin with the motor-to-link physical boundary, not a catalog torque number.
2. Move every variable to a declared reference side and close the power, speed, torque and inertia accounting.
3. Replace single-point sizing with a time history and vendor constraint ledger.
4. Show that precision is a family of different measurements, then make the hidden elastic state visible.
5. Turn compliance into a dynamic two-mass plant and expose the resonance/control interaction.
6. Add observability and output-bearing loads before asking whether the joint can survive and be controlled.
7. Close with friction/backdrivability and a vertical-axis brake handover whose safe state depends on sequence and evidence.
8. Reconstruct the manufacturer catalog and Williamson thesis only after the shared concepts can be named, so sources refine rather than replace understanding.

## Concept article section and Viz contracts

### 01. ActuatorBoundaryLab -- where does commanded torque actually go?

- Show motor current, electromagnetic torque, rotor inertia, input coupling, reducer, output bearing, brake, motor encoder, output encoder and robot link as inspectable layers.
- Selecting a layer reveals owned variables, unmodeled losses and which existing article hands data into or out of it.
- Failure state: “300 N·m joint” remains unresolved until torque type, side, speed, duty, efficiency and component limit are declared.
- Mobile: vertical stack with short connectors; desktop: compact horizontal sectioned shaft, no fixed-width SVG.

### 02. RatioWorkbenchLab -- ratio changes units, not energy conservation

- Controls: ratio, motor speed/torque, forward efficiency and direction.
- Observables: output speed, output torque, input/output power and loss.
- States: motoring forward, reverse/load-driven, ideal comparison and limit conflict.
- Failure gate: increasing ratio past an output-speed limit must not appear as a free torque improvement.

### 03. ReflectedInertiaLab -- which side does the controller feel?

- Controls: ratio, rotor/input inertia, load inertia and payload radius.
- Observables: reflected load inertia, total motor-side inertia, inertia ratio, acceleration torque and pose sensitivity.
- Mark numeric ratio guidance as heuristic; physics results remain separate.
- Use stable bars/dials rather than a decorative network diagram.

### 04. DutyLifeLab -- can the actuator repeat the move?

- Build a five-segment motion cycle with acceleration, hold, reverse, shock/recovery and idle.
- Observables: peak, repeated peak duration, RMS torque, average speed, temperature/life warning and which catalog constraint fails first.
- Interaction must let the same peak produce different RMS/life conclusions when dwell and repetition change.

### 05. AccuracyVocabularyLab -- “zero backlash” is not zero joint error

- Plot torque-versus-output-angle loading/unloading traces with dead zone, elastic slope and hysteresis width.
- Toggle backlash, lost motion, repeatability, transmission error and motor/output encoder view; each highlights a different measurement operation.
- Failure gate: motor encoder can report perfect return while output trace retains reversal error.

### 06. TorsionalComplianceLab -- where is energy stored?

- Controls: output torque and one-/three-region stiffness model.
- Observables: twist angle, link-tip error, active stiffness region and stored energy.
- Show housing/link compliance in series as optional contributors; total compliance must increase when any member softens.
- Avoid overscaled spring cartoons; use a compact physical cross-section plus numeric deformation strip.

### 07. TwoMassResonanceLab -- why does more gain sometimes make motion worse?

- Controls: motor-side inertia, load inertia, stiffness, damping and excitation/controller bandwidth.
- Observables: rigid/body-like mode, relative resonance, phase/amplitude trace and risk band.
- Compare full two-inertia relation with the source-specific one-inertia shortcut only when its assumptions are selected.
- Failure state: bandwidth crossing the lightly damped mode produces an explicit oscillation warning.

### 08. DualEncoderObservabilityLab -- which angle is real?

- Animate or step motor command, reducer deflection and output response without relying on motion for meaning.
- Observables: `theta_m / i`, measured output angle, deflection estimate, torque estimate and residual/model mismatch.
- Controls: load, stiffness calibration error, synchronization offset and sensor noise.
- Conclusion changes between “link motion observed,” “torque estimate usable” and “calibration/synchronization invalid.”

### 09. OutputBearingLoadLab -- torque is not the only joint load

- Controls: radial/axial force, offset arm, shock factor and duty share.
- Observables: tilting moment, equivalent dynamic load screen, static-load warning and relative `L10` life.
- Draw bearing reference plane and force/moment geometry with label-safe padding.
- Never present the simplified screen as final product selection.

### 10. BackdriveFrictionLab -- why does the same gearbox feel different in reverse?

- Controls: direction, speed, load, preload/friction and lubrication/temperature state.
- Observables: motor-driven efficiency, load-driven threshold, heat/loss and backdrive state.
- Show a four-quadrant torque-speed plane with thin axes and clear labels; do not use one constant for both directions.

### 11. BrakeHandoverLab -- what keeps a vertical load from falling?

- Controls: gravity torque, brake torque, brake delay, motor-torque buildup/decay, STO order and wear state.
- Observables: torque overlap, unheld interval, predicted fall angle, brake energy misuse and safe/unsafe sequence.
- Required sequences: startup torque-before-release; shutdown brake-proven-before-torque-removal; emergency behavior remains risk-assessment-specific.
- Failure gate: STO-before-hold on a gravity axis remains hazardous even when electronics response is fast.

### 12. JointCommissioningLab -- what evidence survives a change?

- Ledger: units/reference side, kinematic envelope, duty trace, torque/speed limits, stiffness/resonance sweep, accuracy trace, dual-encoder residual, bearing loads, brake timing, thermal state and source revision.
- Changes: payload, ratio, mounting, lubricant, encoder, brake, trajectory or controller firmware invalidate the dependent rows.
- Final claim is the intersection of current rows; it cannot be restored by one catalog badge.

## Formula contract

Every display equation renders through `MathFormula` and is followed immediately by exactly one `FormulaNote`. Grouping annotations use short Korean `\text{}` labels. Symbols, units, reference side and source/model boundary are explained in the note. Long equations split semantically before bounded mobile scaling.

| Formula | Role and required Korean grouping |
|---|---|
| `i=\omega_m/\omega_o` | Define ratio with motor/output side named. |
| `\omega_o=\omega_m/i` | Speed trade, annotated `출력 속도`. |
| `\tau_o=\underbrace{\eta(i,\omega,\tau,T)}_{운전점 효율}\underbrace{i\tau_m}_{이상적 토크 변환}` | Real torque multiplication and state-dependent efficiency. |
| `P_o=\tau_o\omega_o=\eta\tau_m\omega_m` | Power conservation and loss. |
| `J_{L\to m}=J_L/i^2` | Reflected load inertia. |
| `J_{m,tot}=J_m+J_{coupling}+J_{gear,in}+J_L/i^2` | Complete motor-side inertia ledger. |
| `\tau_m=J_{m,tot}\alpha_m+\tau_g/i\eta+\tau_f+\tau_d` | Acceleration, gravity, friction and disturbance terms, with sign caveat. |
| `\tau_{RMS}=\sqrt{\sum_k \tau_k^2 t_k/\sum_k t_k}` | Full-cycle thermal duty. |
| `\bar{\omega}=\sum_k |\omega_k|t_k/\sum_k t_k` | Absolute average speed for a declared vendor procedure. |
| `\delta=\tau/K_t` | Torsional twist; radians and active stiffness region explicit. |
| `E_s=\tfrac12K_t\delta^2` | Stored elastic energy. |
| `K_{eq}^{-1}=K_g^{-1}+K_h^{-1}+K_l^{-1}` | Series compliance of gear, housing and link. |
| `\omega_r=\sqrt{K_{eq}(1/J_{m,o}+1/J_L)}` | Relative two-inertia mode, both inertias on output side. |
| `f_n=(2\pi)^{-1}\sqrt{K/J}` | Vendor shortcut shown only with `단순화 가정` annotation. |
| `\hat\delta=\theta_m/i-\theta_o` | Dual-encoder deformation estimate. |
| `\hat\tau=K_{cal}\hat\delta` | Torque estimate and calibration boundary. |
| `M=\underbrace{F}_{작용 힘}\underbrace{r_\perp}_{수직 거리}` | Offset force to tilting moment. |
| `L_{10}=(C/P)^p` | Relative basic rating life; statistical and source-bound. |
| `\tau_{brake,o}=i\eta_{hold}\tau_{brake,m}` | Motor-shaft brake conversion with non-dynamic boundary. |
| `\Delta\theta_{fall}\approx\tfrac12\alpha_g(\Delta t_{unheld})^2` | Visible consequence of an unheld timing gap. |
| `C_{joint}=C_{motion}\cap C_{duty}\cap C_{precision}\cap C_{mode}\cap C_{bearing}\cap C_{hold}` | Deployable mechanical claim is an evidence intersection. |

## Harmonic Drive 2026 company-reference contract

- Slug: `reference-harmonic-drive-mechatronics-2026`.
- Primary artifact: Harmonic Drive AG, *Harmonic Drive Mechatronics*, issue `1053524 05/2026`, 177 PDF pages.
- Required source explorer states:
  1. Selection boundary: torque, speed, stiffness, wave-generator bearing and output-bearing checks form a process, not a single rated-torque lookup.
  2. Duty/life: reconstruct the catalog cycle, RMS torque, average speed and bearing-life workflow; label the dynamic-factor recommendations as manufacturer-specific.
  3. Stiffness/resonance: show three stiffness regions and the catalog's simplified `f_n` relation with housing/load assumptions visible.
  4. Accuracy: separate zero tooth backlash, hysteresis loss, lost motion, repeatability and transmission accuracy; retain the stated small-torque test context.
  5. Bearing: expose radial, axial and moment load interfaces and why torque sizing is incomplete.
  6. Brake/feedback: brakes are holding/fail-safe devices in the catalog context; show spring/permanent-magnet options and motor/output feedback availability.
  7. Evidence disclaimer: values are test averages under stated normal conditions unless otherwise declared and are not automatically guaranteed properties.
- Each state shows page anchors, what the artifact claims, what it assumes, what must not transfer and what the reader must measure.
- No catalog page screenshot is the primary visual. Reconstruct causal diagrams and keep a direct source link.

## Williamson 1995 foundational-paper contract

- Slug: `paper-williamson-series-elastic-actuators-1995`.
- Artifact: Matthew M. Williamson, *Series Elastic Actuators*, MIT AI Technical Report 1524 and MS thesis, January 1995, 83 pages.
- Document kind label: `석사 논문·AI Technical Report`.
- Reconstruction order:
  1. Before: stiff geared actuators offer bandwidth but transmit reflected inertia, friction, backlash, torque ripple and shocks.
  2. Intent: place a calibrated spring in series so force follows deformation and high-frequency output impedance falls.
  3. Minimal model: motor inertia, spring, motor/load angles and torque balance; derive clamped transfer and natural frequency.
  4. Control: feedforward/feedback and output-impedance goals, with current/velocity saturation.
  5. Hardware: actual motor, gearbox, spring and sensors reveal friction, backlash, stiction, noise and electronics limits.
  6. Evidence: predicted/actual frequency response, hard/soft contact and moving-output tests.
  7. Failure: too much feedforward, phase lag, current clipping and backlash worsen behavior; compliance trades bandwidth and maximum force for force control and shock tolerance.
  8. Legacy: connect SEA intuition to modern torque-controlled robot joints without claiming all compliant actuators use the same model.
- Required equations: motor torque balance, spring torque, clamped-load transfer, `sqrt(k_s/J_m)`, output impedance and at least one saturation-aware comparison.
- Required evidence selector states: ideal model, measured mismatch, hard contact, soft contact, moving output, admitted limitations.
- Every figure becomes a data-flow or measured-claim reconstruction; do not reproduce the PDF figure bitmap as the core explanation.

## Prose and visual design contract

- Open each section with a concrete failure or design question, then let the lab expose the hidden state before naming the general rule.
- Use blue for commanded/motor-side quantities, teal for output/verified capacity, amber for stored energy/assumption, red for exceeded limit or unheld load, violet for measurement/model residual. Color is never the only signal.
- Use thin 1 px axes/connectors, round line joins and real charts where a relation matters. Avoid thick pipelines, equal-size box chains and unused empty canvas.
- Milestone numerals may orient major conceptual transitions, but headings remain compact and do not become decorative hero cards.
- Dense evidence uses aligned rows, legends and direct comparisons; cards are only for repeated selectable entities and are not nested.
- At 360/390 px, controls wrap above the observable, plots reserve label gutters, equations recompose, and no lab has page or inner horizontal scroll.
- At 768/1440 px, grid tracks, plot heights and metric widths remain stable across state changes.
- All text fits its element after web fonts load. SVG is used only where geometry is clearer than HTML/CSS and receives an accessible Korean label.
- Interaction changes a causal observable and conclusion. Static states ship first; later motion respects reduced motion and is never required to understand the state.

## 4B/9B replay packet

1. `scope packet`: one article role, owned questions, prerequisites, prohibited claims and neighboring handoffs.
2. `source packet`: one artifact, identity/revision, page anchors, extracted claim, assumption, evidence type and non-transfer rule.
3. `premise packet`: four to six hidden premises mapped to public prose, equation, Viz state and validation observation.
4. `section packet`: one causal question, misconception, derivation, example, failure and handoff.
5. `formula packet`: symbolic form, Korean underbraces, unit/reference side, assumptions, adjacent note and mobile split rule.
6. `viz packet`: state, control, derived values, safe/fail conclusion, accessibility and 360/390/768/1440 composition.
7. `critic packet`: mixed-side arithmetic, unit/sign error, peak/RMS confusion, universalized vendor rule, model/evidence mismatch, raw LaTeX, clipped label and decorative interaction checks.
8. `integration packet`: metadata, graph links, source date, formula-note parity, interaction counts, QA and deployment evidence.

The small model never receives the complete bundle as one prompt. Deterministic validation rejects missing packet fields, source identity loss, premise gaps, formula-note mismatch and layout regressions before merge.

## Completion checks

- All 36 hidden premises map to public prose, a Korean-annotated formula, causal Viz observable, source boundary or evidence gate.
- The concept article contains 12 distinct labs; the company reference contains seven source states; the paper contains the required mechanism and evidence selectors.
- Every display equation has exactly one adjacent `FormulaNote`; no raw `\theta`, broken superscript or English-only explanatory underbrace leaks into the page.
- Motor/output side and units are explicit wherever quantities are transformed.
- No vendor heuristic, average test value, example resonance rule, catalog torque or brake statement becomes a universal guarantee.
- Holding brake, operational deceleration, STO and gravity restraint remain separate functions.
- 360/390/768/1440 viewports have no page overflow, inner scroll, clipped label, formula escape or unstable resize after fonts load.
- Each lab has at least one state-changing interaction and tests at least one misleading/unsafe state.
- Local build, focused Playwright QA, screenshot review, connected curriculum regression, deployment, HTTP 200 and public QA pass.
- Run JSON/report records source intent, page anchors, rejected transfers, implementation decisions, premise coverage, exact checks and next milestone for 4B/9B replay.
