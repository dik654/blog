# Robot Motor Drive & Field-Oriented Control content spec

## Goal

- Reader outcome: the reader can convert a bounded joint torque request into physically auditable three-phase actuation by defining motor/inverter/sensor conventions, reconstructing the current vector, aligning it to electrical rotor flux, regulating `d-q` current under delay and voltage saturation, synthesizing realizable PWM, and commissioning the drive without confusing requested duty with measured torque.
- System invariant: gate drive may remain enabled only when phase-current scaling and ordering are calibrated, electrical angle identity is valid, the current sample belongs to a measurable PWM window, the `d-q` voltage request is vector-limited against the measured DC bus, the current regulator has a bounded anti-windup state, independent hardware protection remains armed, and observed current/power/temperature agree with the commanded operating region.
- Curriculum boundary: this article owns the electromagnetic and power-conversion layer between torque request and PWM/gate output. It bridges timing to the existing embedded real-time article and control demand to the existing dynamics/feedback article. It introduces gate drive, switching loss, thermal evidence and PCB current-loop layout, but leaves device sizing, isolated supplies, EMC qualification, safe-torque-off certification and production power-PCB design to a later power-electronics article.

## Why this is the next missing foundation

| Existing article | Output it already promises | Motor-drive assumption it leaves open |
|---|---|---|
| `robot-dynamics-feedback-control` | A controller computes torque or generalized actuator input `u_k`. | Assumes torque is an actuator-native scalar instead of a request that must become phase current, voltage and switching states. |
| `robot-embedded-realtime-control` | A fresh command reaches a bounded target cycle and a PWM shadow register before its latch. | Deliberately defers electrical angle, Clarke/Park transforms, current regulation, inverter limits, current sensing and motor protection. |
| `signals-systems-convolution` | Sampling, phase, delay, filtering, frequency response and state-space intuition. | Does not map them to PWM-synchronous current acquisition, electrical frequency, current-loop bandwidth or dead-time distortion. |
| `robot-kinematics-coordinate-frames` | Coordinates are named maps with explicit frame direction. | Does not show that FOC is itself a coordinate-frame contract whose wrong sign/zero/pole-pair value creates false torque and flux channels. |
| `robot-ai-top-down` | Names BLDC/PMSM, motor driver, encoder, PWM and FOC as lower stack. | Does not explain how to commission or prove that a commanded joint torque became the intended electromagnetic torque. |

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Torque-to-current-to-voltage-to-duty contract | deep system chain | A torque scalar is not a phase duty; every conversion has units, saturation, timing and observable evidence. |
| Balanced three-phase field and space-vector geometry | deep physical intuition | Clarke/Park are otherwise memorized matrices without an explanation of what rotating vector they preserve. |
| Clarke transform and scaling conventions | deep mathematical contract | Amplitude-invariant and power-invariant forms are both valid but cannot be mixed with each other or with inverse/torque constants. |
| Park transform and electrical angle identity | deep mathematical/commissioning contract | Pole pairs, mechanical/electrical angle, zero offset, direction and phase order determine whether `d` and `q` mean flux and torque. |
| PMSM `d-q` voltage and torque model | deep mechanism | Resistance, inductance, speed coupling, back EMF, magnet torque and reluctance torque explain controller feedforward and operating limits. |
| Discrete current PI, decoupling, vector saturation and anti-windup | deep control mechanism | Two independent-looking PI blocks share one inverter voltage vector and are limited by sample/PWM delay. |
| Inverse transforms, SVPWM, DC bus, dead time and minimum pulse | deep actuation mechanism | Desired `v_dq` must fit inside the inverter hexagon and survive switching nonidealities before it becomes average phase voltage. |
| Current/position sensing, alignment and sampling window | deep production boundary | Offset, gain, sign, channel order, encoder zero and switching-edge samples can make a mathematically correct controller unstable. |
| Current circle, voltage ellipse, MTPA, field weakening and regeneration | deep operating envelope | `i_d=0` is a basic SPM policy, not a universal IPM/high-speed rule; DC-bus and thermal limits close the outer contract. |
| Gate driver, MOSFET/inverter, protection, thermal and PCB layout | bridge with physical evidence | Software correctness cannot prevent shoot-through, desaturation/overcurrent, ringing, shunt common-mode error or thermal failure. |
| Full semiconductor sizing, isolated gate supplies, creepage, EMC and STO certification | deferred | These require device data, switching waveforms, layout stack-up, safety standard and laboratory evidence beyond one FOC article. |

## Reader prerequisites

- Vectors, dot product, sine/cosine, matrix multiplication and coordinate-frame direction.
- Feedback error, PI control, sampling period, delay, saturation and anti-windup intuition.
- Voltage, current, power, resistance, inductance and the qualitative meaning of magnetic flux.
- PWM timer, ADC trigger, ISR/DMA, target cycle and hardware trip from the embedded real-time article.

## Private hardest transfer problem

Do not publish this integrated problem as a quiz. Use it as the completeness gate for prose, formulas and labs.

A 48 V robot joint uses an IPMSM, a 14-pole encoder, a three-phase two-level inverter and two low-side shunts. The outer controller requests `18 N·m` at 1 kHz; a 20 kHz center-aligned FOC loop should apply it. The motor sheet mixes line-line resistance with phase inductance and gives peak current while the firmware stores RMS current. The code sets `p=14`, uses mechanical angle directly in Park, assumes phase order `A-B-C`, subtracts a single startup offset from both shunts, and combines a power-invariant Clarke transform with an amplitude-invariant inverse. Encoder zero was captured while the rotor was not fully aligned, and positive encoder rotation is opposite the assumed electrical direction.

At low speed the joint moves, but q-current contains a large second harmonic. At high speed the controller requests independent `v_d` and `v_q`, clips each axis separately, keeps integrating the unclipped error, ignores measured DC-bus droop, and omits cross-coupling/back-EMF feedforward. The continuous-time PI gains are copied into the discrete integrator without multiplying by sample time. PWM duty is updated before the intended latch, ADC triggers sit beside switching edges, and the two-shunt measurement loses a valid window near high duty. Dead time and minimum on-time alter the average phase voltage; one gate-driver leg has a different propagation delay. A current sensor saturates during regeneration, the bus capacitor rises above its allowed voltage, and software still reports the requested duty after the gate driver has latched overcurrent. The first commissioning attempt enables full torque before PWM mapping, sensor polarity, alignment current, open-loop rotation and current-loop sign are independently verified.

The reader must be able to:

1. Trace `tau* -> i_dq* -> v_dq* -> v_alpha-beta* -> duty_abc -> gate state -> i_abc -> measured torque` and name requested, limited, applied and observed variables separately.
2. Reconcile line-line versus phase resistance/inductance, peak versus RMS current, SI units and motor/inverter ratings before computing gains or limits.
3. Explain how balanced sinusoidal phase currents create one rotating stator current vector and why torque depends on its orientation relative to rotor flux.
4. Derive an amplitude-invariant Clarke transform, state its zero-sequence assumption and keep its inverse and torque/power constants consistent.
5. Contrast amplitude-invariant and power-invariant scaling without declaring either universally correct.
6. Convert mechanical to electrical angle using pole pairs, offset and sign; distinguish fourteen poles from seven pole pairs.
7. Show how phase order, encoder direction and zero-offset errors rotate or reflect the inferred `d-q` axes and leak torque current into flux current.
8. Use the PMSM `d-q` voltage equations to identify resistive drop, current dynamics, cross-coupling and magnet back EMF.
9. Use the torque equation to separate magnet torque from reluctance torque and explain why `i_d*=0` is a basic SPM policy but not generally MTPA for an IPM.
10. Choose a current-loop bandwidth below switching/sample/delay constraints, derive model-based PI starting gains, discretize the integral state with `T_s`, and treat parameter error as a validation issue.
11. Add speed-dependent decoupling/feedforward without treating it as feedback or trusting it when angle/parameter estimates are wrong.
12. Limit the two-axis voltage as one vector, preserve direction where appropriate and feed the difference between limited and unlimited voltage into anti-windup.
13. Convert the limited stationary voltage vector to SVPWM dwell/duty values using current `V_dc`, then distinguish the linear circle from the full switching hexagon and overmodulation.
14. Explain why dead time prevents shoot-through yet introduces current-direction-dependent voltage error, and why minimum pulse/propagation mismatch changes applied voltage.
15. Place current sampling in a valid PWM-synchronous window, include switch rise, amplifier settling, sample-and-hold and dead time, and choose a policy when two-shunt/single-shunt reconstruction becomes unobservable.
16. Calibrate current offset/gain/polarity/channel mapping and encoder index/absolute zero before closing the loop; prove each with physical scope/current-probe evidence.
17. Apply current-circle and voltage-ellipse constraints, locate constant-torque/constant-power/constant-voltage regions, and explain MTPA and field weakening as constrained operating policies.
18. Detect regeneration from signed mechanical/electrical power, bound DC-bus rise and define brake/load/disable behavior rather than silently clipping torque.
19. Separate MCU command echo, PWM compare, gate-driver output, phase voltage/current, rotor motion and torque evidence so a hardware trip cannot look like successful actuation.
20. Build a staged commissioning ladder that starts de-energized, verifies mapping and protections, uses limited alignment/open-loop/current-loop tests, and expands the envelope only with captured evidence.
21. Identify which failures belong to control software, timing/sensing, motor parameters, power stage, PCB layout, thermal design and independent safety protection.
22. State what Blaschke's field-orientation thesis established, what modern PMSM equations add, and what neither source proves about a specific robot drive.

The article passes only when all twenty-two premises have visible public evidence and every lab changes a geometric, numerical, timing, constraint or physical-evidence consequence.

## Source, author-intent and boundary ledger

| Source locator | Original purpose and claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Felix Blaschke, *Das Verfahren der Feldorientierung zur Regelung der Drehfeldmaschine*, 1973 thesis, PDF pp. 5-12, 26-46, 56-84, 86-109, 142-161 | Re-express a coupled rotating-field machine in field-oriented vector coordinates so flux-parallel and torque-producing current components become directly accessible; compare measured-field and model-field variants by effort, quality and tolerance; apply the principle to synchronous and induction machines; realize vector operations with TRANSVEKTOR blocks and current/voltage-controlled converters. | The thesis uses its own general machine notation and period hardware. It predates modern PMSM MCU APIs, today's standard Clarke/Park sign conventions, SVPWM libraries and robot-drive safety practice. | Supply the historical problem, the coordinate-frame design intent, measured-versus-model field tradeoff, parameter sensitivity, stability questions and physical realization lineage. | Dedicated primary-source reconstruction plus a rotating-field decomposition lab. The concept article cites the principle but attributes modern formulas and hardware details to current implementation sources. |
| TI SPRABZ5, *Single-Axis Motor Control and PFC*, pp. 7-10 | Explain current space vector, Clarke/Park projection, independent-looking `i_d/i_q` regulation, inverse Park, space-vector PWM and the centrality of rotor flux position. | Introductory 2015 implementation document; its basic `i_d*=0` PMSM statement is not a universal IPM/MTPA/high-speed policy. | Establish the readable modern FOC data flow and angle-error consequence. | Sections 02-04 and the angle-contract lab, with an explicit scaling/sign-convention warning. |
| TI TIDUF67, *Universal Motor Control Reference Design for AM263x*, rev. Dec. 2024, pp. 15-17 | Give current hardware prerequisites, IPMSM `d-q` voltage and torque equations, current/voltage constraints, `V_dc/sqrt(3)` SVPWM limit, MTPA, field weakening and operating regions. | Reference-design equations assume declared units/model and do not validate a reader's motor parameters, sensor alignment, loop gains, thermal path or safety case. | Ground the motor model and constrained operating envelope in a current official implementation source. | Sections 05 and 09, torque-surface and current-circle/voltage-ellipse labs. |
| Microchip, *Sensored Encoder-Based FOC of Three-Phase PMSM*, current online docs, FOC/control-loop sections | Show an encoder-based FOC pipeline, separate PI loops, rotor alignment/position handling, and back-calculation-style integral windup limiting. | Device/example implementation; exact gains, numeric format, PWM polarity and startup state machine are target-specific. | Ground vector-wide saturation/anti-windup and commissioning sequence without treating PI as two unrelated scalar clips. | Sections 06 and 08, current-loop lab and staged commissioning checklist. |
| TI SPRACT7, *Sensorless FOC for PMSM With Single DC-Link Shunt*, pp. 4-16 | Compare current-sensing locations, tie samples to PWM conduction state, derive minimum valid active-vector duration from switch/amplifier/ADC/dead-time delays, and identify unmeasurable sector/low-modulation regions. | Single-shunt details do not transfer unchanged to inline, two-shunt or three-shunt sensing; sensorless estimation is not the main scope here. | Make current observability a physical time-window contract rather than a generic “sample at PWM center” rule. | Section 08 sampling-window formula and sensing lab; topology-specific boundaries remain visible. |
| TI SLUUDM5, *MSPM0 FOC Motor Control User Guide*, March 2026, commissioning and dead-time sections | Require consistent PWM/current phase mapping, verify gate outputs with the motor disconnected, validate current sensing with a probe and limited source, align before current control, and describe dead-time-induced applied-voltage/current distortion. | Vendor firmware and proprietary compensation are not a generic algorithm specification or safety certification. | Use a current official production workflow for physical evidence and ordering, not for copying device-specific register values. | Sections 07, 08 and 10; evidence ladder separates command, PWM, gate, sensor and motion. |
| TI DRV8305-Q1 datasheet and TIDA-010956/TIDA-01629 inverter reference designs | Gate-drive strength and dead time trade switching loss, EMI and shoot-through risk; modern robot/servo inverters add current sensing, multilevel shutdown, overcurrent/short/thermal protection and explicit power-stage constraints. | Reference-design performance and diagnostic coverage apply only to tested configurations; they do not replace system hazard analysis or certification. | Bridge FOC software to the power stage and show why independent protection owns a shorter path than firmware. | Section 10 power-stage/fault ladder and scoped handoff to power-electronics/PCB follow-up. |
| TI low-side current-sensing PCB layout guidance | Use Kelvin shunt routing, keep gain/decoupling components close and control return paths to preserve the measured quantity. | Layout recommendations require target stack-up, current, common-mode transient and thermal verification. | Prevent the article from implying that an ADC number is independent of copper geometry. | Section 10 PCB bridge and failure ownership table, without attempting a full layout tutorial. |

## Narrative sections and Viz contract

### 01. Torque is a request, not a phase duty

- Start with the unresolved handoff from `u_k` and the embedded target cycle.
- Trace torque/current/voltage/duty/gate/current/torque with units, limit owner and observable evidence.
- Separate BLDC waveform naming from PMSM machine physics; explain that many so-called BLDC motors are PMSMs driven with six-step or sinusoidal/vector control.
- Viz `TorqueActuationContractLab`: choose a broken unit/identity/limit/evidence link; show requested, limited, applied and observed values and identify the first invalid contract.

### 02. Three phases are one rotating vector

- Build balanced phase currents at `0`, `-120`, `+120` electrical degrees and show their spatial winding axes.
- Explain why the sum is zero in a three-wire balanced machine and what zero sequence means.
- Relate current-vector angle to rotor flux and distinguish field-building versus perpendicular torque-producing components.
- Viz `RotatingFieldLab`: scrub electrical angle and phase/current amplitude; animate only on explicit play; report vector magnitude, torque angle and phase values.

### 03. Clarke removes a redundant coordinate, not physics

- Derive the amplitude-invariant `abc -> alpha-beta` projection from the three fixed winding axes.
- State zero-sequence assumption and show inverse reconstruction.
- Compare amplitude-invariant `2/3` and power-invariant `sqrt(2/3)` conventions; require one convention end to end.
- Viz `ClarkeProjectionLab`: change phase balance and scaling; show alpha-beta point, reconstruction residual, zero-sequence residual and norm/power interpretation.

### 04. Park makes the reference frame rotate with flux

- Define `theta_e = p theta_m + theta_0` with direction and wrap convention.
- Rotate alpha-beta coordinates into `d-q`; explain why steady rotating current becomes nearly DC when the frame is correct.
- Inject pole/pole-pair, sign, phase order and zero-offset failures; show cross-axis leakage.
- Viz `ParkAngleContractLab`: controls for pole pairs, encoder sign, offset and phase order; measured outputs are `i_d`, `i_q`, angle error and torque-efficiency ratio.

### 05. PMSM equations explain torque and cross-coupling

- Decompose each `d-q` voltage equation into resistive, inductive, speed cross-coupling and magnet back-EMF terms.
- Decompose torque into magnet and reluctance components; contrast SPM (`L_d≈L_q`) and IPM saliency.
- Explain unit/parameter traps: line-line versus phase, poles versus pole pairs, peak versus RMS, temperature-dependent `R_s`, saturation-dependent `L_d/L_q`.
- Viz `PmsmTorqueModelLab`: choose SPM/IPM, current vector and speed; show torque terms, voltage-term budget and the parameter whose mismatch dominates.

### 06. Two PI loops share one voltage actuator

- Model-based starting point under ideal decoupling: `K_p=L omega_c`, `K_i=R_s omega_c`; call it a starting approximation, not a universal tuning recipe.
- Discretize integral state with `T_s`; expose compute/PWM delay and bandwidth margin.
- Add cross-coupling/back-EMF feedforward and explain it cancels a modeled disturbance but cannot stabilize bad angle or bad sensing.
- Vector-limit `v_dq`, back-calculate saturation difference, preserve outer-loop/current-limit priorities.
- Viz `DqCurrentLoopLab`: change bandwidth, delay, speed, voltage limit and anti-windup; plot a compact deterministic response and report overshoot, settling, saturation duration and integrator state.

### 07. SVPWM asks the inverter for an average vector

- Inverse Park/Clarke produces stationary/phase voltage references; SVPWM schedules discrete inverter states whose period average approximates that vector.
- Show linear circle inside the switching hexagon, sector, adjacent active-vector dwell and zero-vector remainder.
- Normalize with measured `V_dc`; separate linear modulation, overmodulation and impossible request.
- Introduce dead time, minimum pulse and propagation mismatch as applied-voltage errors, not merely waveform cosmetics.
- Viz `SvpwmInverterLab`: move magnitude/angle, `V_dc`, dead time and minimum pulse; show sector, dwell, duty and requested-versus-applied vector error.

### 08. Current and angle sensing decide whether the math is true

- Compare inline, three-shunt, two-shunt and single-shunt observability and common-mode/timing tradeoffs.
- Calibrate offset, gain, polarity and channel mapping; reconstruct the third current only when KCL/model assumptions hold.
- Define encoder/index/absolute zero and bounded alignment state; never close q-current before sign/order/zero are validated.
- Place ADC acquisition inside an actual measurable conduction/settling window; expose unobservable regions and fallback/reject policy.
- Viz `SensorAlignmentWindowLab`: change offset/gain/sign, alignment error, ADC phase and sensing topology; show KCL residual, `d-q` leakage, valid window and close-loop gate.

### 09. MTPA and field weakening are constraint navigation

- Current circle bounds copper/inverter current; speed-shrinking voltage ellipse bounds realizable steady-state current.
- Show SPM `i_d=0` baseline, IPM MTPA using saliency and negative `i_d` field weakening above base speed.
- Explain constant-torque, constant-power and constant-voltage regions, thermal derating and regeneration/DC-bus limit.
- Viz `OperatingEnvelopeLab`: change speed, torque, motor type, DC bus and temperature; show feasible point, chosen policy, current/voltage margins, signed power and brake/derate decision.

### 10. Commissioning proves the chain with physical evidence

- Build independent protection order: driver/desaturation/overcurrent -> PWM trip -> firmware latch -> supervisory acknowledgement; command echo never proves gate output.
- Bridge gate resistance/slew, dead time, switching loss, bus capacitance, shunt Kelvin routing, gate/power loop, thermal sensor and EMI into named failure ownership.
- Stage commissioning: de-energized mapping -> limited bus/PWM -> sensor calibration -> alignment -> open-loop rotation -> closed current loop -> speed/torque -> envelope/fault injection.
- Require scope/current probe/bus voltage/temperature/applied sequence evidence before widening the envelope.
- Viz `CommissioningEvidenceLab`: select a stage and inject a failure; reveal which evidence channel passes/fails and whether power enable may advance.

## Formula contract

Every display equation must use `String.raw`, Korean `underbrace` annotations inside the KaTeX expression and a `FormulaNote` immediately below. Split by semantic operation before shrinking. Target minimum computed scale is `>= 0.75` at 360 px.

1. Balanced phases and amplitude-invariant space vector:
   - `i_a+i_b+i_c=0`
   - `i_s=(2/3)(i_a+i_b e^{j2pi/3}+i_c e^{-j2pi/3})`
   - explain that `2/3` preserves sinusoidal phase peak as vector magnitude under this convention, not electrical power in every coordinate system.
2. Clarke and inverse Clarke:
   - matrix form with explicit `alpha` and `beta` axes
   - zero-sequence/reconstruction residual
   - compare but do not mix amplitude-invariant and power-invariant coefficients.
3. Electrical angle and Park:
   - `theta_e = p theta_m + theta_0`
   - rotation matrix and sign convention
   - angle-error rotation causing cross-axis leakage.
4. PMSM dynamics:
   - `v_d=R_s i_d+L_d di_d/dt-omega_e L_q i_q`
   - `v_q=R_s i_q+L_q di_q/dt+omega_e L_d i_d+omega_e psi_m`
   - every term annotated by physical role and SI unit.
5. Torque:
   - `T_e=(3/2)p[psi_m i_q+(L_d-L_q)i_d i_q]`
   - identify magnet and reluctance torque and the scaling-convention dependency.
6. Discrete PI and decoupling:
   - model-based starting gains
   - `x_I[k+1]=x_I[k]+T_s(K_i e[k]+K_aw(v_sat-v_unsat))`
   - shared vector saturation, not scalar per-axis clipping.
7. Voltage limit and SVPWM dwell:
   - `||v_dq|| <= V_dc/sqrt(3)` for the declared phase-reference/SVPWM convention
   - sector-local `T_1`, `T_2`, `T_0` and `T_0=T_pwm-T_1-T_2`
   - separate average-vector construction from transistor instantaneous voltage.
8. Current sample window:
   - `T_active > T_rise + T_settle + T_S&H + T_dead`
   - topology boundary and trigger delay.
9. Operating constraints and power:
   - `i_d^2+i_q^2<=I_max^2`
   - `v_d^2+v_q^2<=V_max^2`
   - `P_mech=T_e omega_m`, signed regeneration, and a loss/thermal balance bridge.

## Visual design contract

- Surface: technical content page with compact instrument labs, not a dashboard and not a decorative card-news page.
- Hierarchy: each section opens with one causal question and a two-line answer before the lab. Large milestone numbers are muted anchors, not oversized hero numerals.
- Geometry: use a full-width vector stage when spatial orientation is the claim. On mobile, stack controls -> vector/evidence stage -> measured outcome; never miniaturize a desktop system chart.
- Density: at most three compact metric cells in one half-panel row and at most four in a full-width row. Avoid large empty lower halves.
- Lines: 1-1.5 px strokes, rounded line caps, restrained arrowheads, no thick connector rails. Use dashed lines only for reference/estimated quantities.
- Color semantics: blue measurement/stationary frame, teal current/valid runtime path, violet rotor/electrical angle/control frame, amber saturation/delay/model uncertainty, emerald verified/feasible, red only active fault or forbidden transition.
- Typography: labels `11-12 px`, body `13-14 px`, numeric results tabular/monospace. Do not place long prose inside vector plots.
- Motion: all labs must remain understandable when static. Optional play animates only rotating phase/field or PWM period; honor reduced-motion and pause when out of view. Do not use ambient loops.
- Interaction: segmented controls for topology/motor mode, sliders for continuous quantities, toggles only for binary faults/compensation, visible focus state and textual measured consequence after every change.
- Responsive: no `overflow-x-auto` in article labs or formulas, no fixed plot width, no word breaking, no clipped arrow/text, and no inner vertical scroll.

## Dedicated primary-source reconstruction: Blaschke field orientation

### Reconstruction question

How did Blaschke turn the inaccessible, coupled internal behavior of a rotating-field machine into directly commandable field-parallel and torque-producing channels, and what trade did he expose between measuring the actual field and reconstructing a model field?

### Evidence slices

1. **Problem and DC-machine analogy** — thesis PDF pp. 5-12: orthogonal field/current axes make the DC machine controllable; rotating-field machines hide those components behind dynamic coupling.
2. **Field-oriented coordinate representation** — pp. 26-39: represent current vectors by components parallel and perpendicular to the field and connect them to input coordinates through field angles.
3. **Measured-field decoupling** — pp. 42-46: feed back/counter-transform field angles and inverse coordinate conversions to gain direct access to field-oriented components and torque.
4. **Model-field variant and tolerance** — pp. 56-73: replace measured field with a machine model; matching model and machine preserves the decoupled behavior, while heating/parameter detuning causes mutual influence.
5. **Synchronous and induction applications** — pp. 86-96: specialize original/model-field structures, including the electronic-commutator interpretation and induction slip/model sensitivity.
6. **Variants, stability and missing freedom** — pp. 96-153: add model tracking, analyze stability/limited operating ranges, handle real synchronous-machine constraints, leakage and voltage control.
7. **Physical realization** — pp. 154-173: implement coordinate transforms and other vector operations as TRANSVEKTOR modules and connect them to current/voltage-controlled converters and PWM-era hardware.

### Paper lab

`BlaschkeFieldOrientationLab` exposes field angle, stator-current magnitude/angle, measured-versus-model field, model detuning and machine case. It reports field-parallel current, perpendicular torque-producing current, orientation error and channel coupling. The lab is an educational reconstruction from the thesis structure, not digitized experimental data.

### Modern boundary

- Preserve Blaschke's problem, intervention, observation, tradeoff and implementation ambition.
- Translate notation into a clearly declared modern two-axis vector convention only after showing that this is a transformation.
- Do not attribute the standard modern PMSM torque equation, `V_dc/sqrt(3)` SVPWM limit, digital PI anti-windup, dead-time compensation or current-shunt window to the 1973 thesis.
- Use Park 1929 as historical coordinate-transformation context from bibliographic metadata, but do not claim an exact reconstruction without the primary full text.

## Coverage gate

| Transfer premise | Public location required |
|---|---|
| requested/limited/applied/observed chain and units | section 01 + contract lab |
| rotating-field physical intuition | section 02 + vector lab |
| Clarke convention/zero sequence/reconstruction | section 03 + projection lab |
| pole pairs/electrical angle/sign/offset/phase order | section 04 + angle lab |
| PMSM `d-q` voltage/torque and parameter units | section 05 + model lab |
| PI discretization/decoupling/vector saturation/anti-windup | section 06 + response lab |
| inverse transform/SVPWM/DC bus/dead time/minimum pulse | section 07 + inverter lab |
| current/encoder calibration/alignment/sample observability | section 08 + sensing lab |
| current/voltage constraints/MTPA/field weakening/regen/thermal | section 09 + envelope lab |
| gate/protection/PCB bridge/staged physical evidence | section 10 + commissioning lab |
| original author intent/evidence/boundaries | dedicated Blaschke article |

## Completion checks

- Targeted TypeScript/ESLint and production build pass.
- Public metadata lists concept then primary-source reconstruction in the robot foundation path.
- At 360, 390, 768 and 1440 px: no document or inner horizontal scroll, clipped text, forced word break, empty plots, overlapping controls or formula overflow.
- Every display formula renders with Korean operation annotations, no raw LaTeX and no KaTeX console errors.
- Every lab control produces a visible state or measured-outcome change; static initial state already explains the section claim.
- Public prose covers all twenty-two private transfer premises without publishing the integrated answer as a quiz.
- Source ledger and paper evidence preserve observed source content, author intent, transformation decision and applicability boundary.
- Run record captures observed gap -> inference -> decision -> files -> verification -> remaining risks so a constrained 4B/9B model can repeat the work.

## Direct entry contract

- Open with the gap between asking for joint force and deciding how three motor wires must be energized.
- Define torque, three-phase current, inverter, and PWM duty before Clarke/Park, d-q, PMSM, SVPWM, MTPA, or field weakening appears.
- The first formal question follows desired force -> current direction and size -> switch timing -> measured force.
