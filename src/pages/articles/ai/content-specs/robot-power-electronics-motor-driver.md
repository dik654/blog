# Robot Power Electronics & Motor Driver Hardware content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 전등 스위치처럼 `명령`과 `실제 결과`가 다르다는 일상 장면에서 시작한다.
- `DC link`, `half bridge`, `gate charge`를 먼저 나열하지 않는다. 에너지 입력, 스위치 분배, 전류 확인의 세 단계 뒤에 정식 용어를 붙인다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal

- Reader outcome: the reader can take a bounded three-phase voltage or PWM request from the FOC layer and design, inspect and commission the physical energy path that actually applies it: source and DC link, three half bridges, gate drive, MOSFET commutation, current measurement, independent protection, thermal path and PCB return geometry.
- System invariant: power may remain enabled only when bus energy is bounded, every commanded switching transition has a legal current path and dead time, gate and power loops remain inside measured overshoot limits, current feedback is valid outside PWM common-mode transients, hardware protection can remove gate energy without firmware cooperation, and electrical/thermal observations agree with the claimed operating envelope.
- Curriculum boundary: this article owns the physical layer between `duty_abc` and measured phase current. It derives first-order sizing and evidence methods, but does not claim a production-ready schematic, safety certification, full EMC qualification, creepage/clearance design, battery certification or semiconductor lifetime qualification.

## Why this is the next missing foundation

| Existing article | Output it already promises | Hardware assumption it leaves open |
|---|---|---|
| `robot-motor-drive-foc` | Produces vector-limited `v_dq`, SVPWM dwell/duty and a staged control commissioning contract. | Leaves MOSFET sizing, DC-link energy, gate-loop parasitics, switching/current-sense waveforms, hardware trips, heat flow and power-PCB layout to this article. |
| `robot-embedded-realtime-control` | Delivers PWM compare values before a deterministic latch and separates software deadlines from hardware trips. | Does not explain what a gate driver does with that logic edge, why a legal compare can still create shoot-through, or what protection must bypass firmware. |
| `signals-systems-convolution` | Supplies sampling, transient, resonance, bandwidth and state intuition. | Does not map `L di/dt`, an LC ring or amplifier settling to switch-node geometry and ADC trigger placement. |
| `robot-dynamics-feedback-control` | Produces bounded torque requests and reasons about saturation. | Does not close electrical input power, mechanical output power, inverter loss, stored bus energy and temperature. |
| `robot-ai-top-down` | Names the motor driver, PCB, encoder, MCU and power layers. | Does not let a software-first reader diagnose the copper, timing and measurement evidence required before a real actuator is safe to energize. |

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Source, connector, fuse, precharge, DC-link and discharge path | deep energy contract | The bus is stored energy, not an ideal voltage constant; hot-plug, cable inductance and regeneration can exceed device ratings before software reacts. |
| Three-phase bridge and commutation paths | deep switching mechanism | Each PWM state must preserve an inductive current path through channel or body diode while avoiding simultaneous high/low conduction. |
| MOSFET voltage/current/SOA and parallel-device behavior | deep first-order selection | Headline voltage/current ratings do not prove repetitive switching, transient or current-sharing capability at temperature. |
| Gate driver, bootstrap, dead time, Miller effect and slew control | deep causal mechanism | Gate charge and parasitic source inductance determine transition time, false turn-on, switching loss and EMI. |
| Power-loop inductance, ringing, overshoot and damping | deep measurable geometry | `V=L di/dt` turns millimeters of copper and capacitor placement into device stress; scope setup can invent or hide the result. |
| Conduction, switching, diode/recovery and gate-drive losses | deep estimate with evidence boundary | Loss budgeting connects modulation and switching choices to junction temperature, but datasheet estimates must be verified at the target waveform. |
| Thermal impedance, copper/vias, interface and cooling | deep steady/transient contract | Case/surface temperature is not junction temperature and one benign ambient/current point is not a continuous-current qualification. |
| Shunt, current-sense amplifier, ADC and Kelvin routing | deep measurement contract | PWM common-mode steps, shunt heating, amplifier recovery and shared copper can make a stable-looking number physically false. |
| VDS overcurrent, UVLO, OTSD, shutdown and fault energy | deep independent-protection contract | Threshold, blanking, propagation and gate-discharge time determine how much energy reaches a short before the bridge is disabled. |
| PCB zoning, high-current loops, return ownership and EMI bring-up | deep implementation/evidence contract | A correct schematic does not encode loop area, shared impedance, heat spreading or probe reference. |
| Isolated bias supplies, creepage/clearance, functional-safety metrics and compliance EMC | scoped handoff | These depend on voltage class, standards, hazard analysis, enclosure, stack-up and accredited test evidence. |

## Reader prerequisites

- Voltage, current, resistance, inductance, capacitance, energy and power with SI units.
- First-order RC/RL transients, derivative intuition and sinusoidal/RMS versus peak quantities.
- PWM, phase current, SVPWM duty, dead time and regeneration from the FOC article.
- Sampling, bandwidth, settling, saturation and independent hardware-trip intuition from the signals and embedded articles.

## Private hardest transfer problem

Do not publish this integrated problem as a quiz. It is the completeness gate for the prose, formulas, Viz behavior and evidence ledger.

A battery robot joint uses a nominal 48 V pack that reaches 60 V at full charge. A long harness, hot-plug connector and regenerative deceleration feed a motor-control PCB with 1.5 mF of bulk capacitance. There is no precharge, bleeder or brake path. The designer selects 80 V MOSFETs from their room-temperature current headline, places the bulk capacitor at the connector instead of the half bridges and omits local high-frequency ceramics. Two MOSFETs are paralleled per position, but their gate traces, source returns and thermal copper differ. The gate driver is far from the bridge, its bypass capacitor returns through logic ground, and each MOSFET shares a power-source segment with the gate-driver return. Gate current is maximized to reduce transition time, dead time is minimized, and no Miller clamp or negative gate strategy is evaluated. One leg exhibits false turn-on and reverse-recovery current during high `dV/dt` commutation.

A switch-node trace rings at the bench. The designer measures it with a long passive-probe ground lead, chooses a fixed RC snubber from the displayed ring and assumes the problem is solved at every current and cable length. The loss spreadsheet uses `R_DS(on)` at 25 C, omits switching/recovery/gate losses and converts a thermal-camera surface reading directly into junction temperature. It never evaluates transient thermal impedance, hotter ambient, enclosure airflow or thermal-interface resistance.

Each phase uses a 200 micro-ohm shunt. The sense traces branch from unequal high-current copper instead of Kelvin points, the amplifier common-mode range is checked only against the 48 V nominal bus, its PWM step recovery is omitted and the ADC trigger occurs at the switch edge. The firmware reports a smooth filtered current while the raw amplifier output is held during the common-mode transition. VDS overcurrent threshold is divided by cold `R_DS(on)` to claim an exact current trip; temperature, parallel sharing, comparator tolerance, drain overshoot, blanking and propagation are ignored. Firmware is the only normal shutdown path, UVLO power sequencing is undefined and full power is applied before the gate outputs, bus transient, shunt polarity and hardware trip are independently captured.

The reader must be able to:

1. Draw four separate paths: source/DC-link energy, phase commutation current, gate-charge current and current-sense/protection evidence.
2. Distinguish nominal pack voltage, maximum steady bus, regenerative rise and switching overshoot before choosing device voltage margin.
3. Compute stored capacitor energy and show why a small voltage increase at high bus voltage can absorb substantial regenerative energy.
4. Derive first-order precharge voltage/current, resistor energy and completion criteria without assuming an RC timer alone proves contactor state.
5. Explain why bus discharge and safe-voltage verification are separate from precharge and why a floating charged board remains hazardous.
6. Trace high-side on, low-side on, dead-time/freewheel and regeneration current paths for positive and negative phase current.
7. Explain shoot-through, diode conduction, reverse recovery and false turn-on as different mechanisms with different evidence.
8. Separate MOSFET absolute maximum, repetitive switching margin, pulsed/current SOA, package/interconnect current and thermally sustainable current.
9. Predict why parallel MOSFETs need symmetric gate/power/source geometry and why static positive temperature coefficient does not guarantee dynamic sharing.
10. Relate gate charge and driver current to transition time while preserving the boundary that `Q_g/I_g` is a first estimate, not a waveform guarantee.
11. Explain bootstrap charge, duty/refresh boundary, UVLO and power-up sequencing rather than treating a high-side driver as a logic buffer.
12. Show how common-source inductance and Miller current alter actual `V_GS`, and why a Kelvin-source return changes both switching and overcurrent evidence.
13. Use `V=L_loop di/dt` to connect loop geometry and local ceramic placement to overshoot, then distinguish it from the LC ringing frequency.
14. Demonstrate why a long probe ground can add a measurement loop and require a spring ground/differential probe with declared bandwidth and reference.
15. Choose whether to reduce loop inductance, tune gate slew, add a snubber or add a clamp based on the measured failure, not as interchangeable decorations.
16. Close a loss budget containing channel conduction, switching overlap, diode/reverse-recovery, gate-drive, shunt and auxiliary losses with units and operating point.
17. Use temperature-dependent `R_DS(on)` and switching energy rather than room-temperature headline values, while marking interpolation/model uncertainty.
18. Estimate steady and transient junction temperature from an explicit thermal path and explain why thermal-camera surface evidence is not junction evidence.
19. Calculate shunt dissipation and signal amplitude, then test amplifier input range, output headroom, bandwidth, PWM rejection/settling and ADC acquisition timing.
20. Explain Kelvin routing as measurement-node ownership: the amplifier must observe the shunt terminals, not voltage drop in load copper.
21. Treat VDS overcurrent as an approximate voltage-derived protection threshold whose result moves with temperature, tolerance, parasitics and blanking.
22. Build a protection-latency budget from fault onset through detection, blanking/deglitch, propagation and gate discharge, then bound let-through energy.
23. Separate UVLO, overcurrent, overtemperature, bus overvoltage and external shutdown because no single mechanism owns every hazard.
24. Require a hardware path that can remove gate drive without the MCU, while refusing to equate a reference design's shutdown architecture with certified STO.
25. Zone the PCB by noisy power, gate drive, sensing and logic; minimize the DC-link and gate loops; keep switch-node copper intentional; route differential sense pairs away from it.
26. Build a low-energy bring-up ladder whose evidence progresses from resistance/short checks to bias/UVLO, gate waveform, limited-bus double pulse or motor test, current-sense calibration, trip injection, thermal and envelope testing.
27. Separate command echo, driver input, `V_GS`, switch node, bus current, phase current, amplifier output, ADC code and temperature evidence so a plausible software trace cannot prove hardware actuation.
28. Read a company reference design as claim, implemented mechanism, test condition, observed result and unsupported extrapolation rather than copying its title specification.

The article passes only if every premise above has visible public evidence, every equation states its approximation boundary, and every lab changes a physical path, measurable waveform, numeric margin or enable decision.

## Source, author-intent and boundary ledger

| Source locator | Original purpose and claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| TI, `TIDUF82B`, *48-V, 85-A Dual-Axis Servo Drive Reference Design for Industrial Robot With STO*, Rev. B, May 2025, pp. 3-24 | Present TIDA-010956 architecture, schematic choices, power-up, shutdown paths, gate/switch-node waveforms, propagation, current-sense settling and a thermal test for a 48 V servo inverter. | `85 Arms` is a design/title claim. The displayed thermal run is 48 V, 16 kHz, 26.2 Arms/37 A peak, 28 C ambient and no heatsink/fan; it does not itself demonstrate full 85 Arms continuous thermal operation or certified STO. | Anchor the complete hardware chain and teach claim-evidence discipline with a current company reference design. | Dedicated reconstruction article plus selected concept examples. Architecture and plots are redrawn as interactive causal diagrams; no raw PCB layer image is treated as explanation. |
| TI, `SLVAF66`, *High-Power Motor Driver Design*, 2022 | Organize high-power motor-drive failures around shoot-through, shorts/overcurrent, diode recovery, parasitic effects, component stress and thermal behavior. | Application guidance is not a target-specific FMEA or qualification result. Device examples and numeric thresholds do not transfer without the target schematic and layout. | Supply the failure taxonomy and show that similar symptoms can have different time scales and owners. | Sections 03-07 and a failure-to-evidence matrix. |
| TI, `SLVA959B`, *Best Practices for Board Layout of Motor Drivers*, Rev. B, 2021, pp. 4-34 | Explain ground/plane strategy, bulk and local decoupling, MOSFET/gate-driver placement, switch node, high-current loops, thermal vias, VDS Kelvin and shunt routing. | Layout figures are patterns, not universal geometry. Copper weight, layer stack, current, package, switching edge and enclosure require target validation. | Turn “good PCB layout” into named current-return and measurement loops with inspectable geometry. | Sections 05, 08 and 10 plus the PCB return-path lab. |
| TI, DRV8162 datasheet, current Rev. E, sections 7-9 | Specify a 100/105 V half-bridge gate driver with smart gate drive, dead-time control, `dV/dt` false-turn-on mitigation, UVLO, VDS overcurrent, thermal shutdown, split gate supplies and fault reporting. | Protection thresholds/timing have tolerances and configuration dependencies. Split supplies can assist a shutdown architecture but do not confer system safety certification. | Ground gate-drive and independent protection behavior in a real component contract. | Sections 04 and 09; configurable behaviors are exposed as bounds, not copied as one recommended register value. |
| TI, INA241A/B datasheet, current Rev. C, sections 7-12 | Specify enhanced-PWM-rejection inline current sensing across a wide common-mode range and state transient settling/hold behavior and Kelvin layout requirements. | Common-mode range and bandwidth do not mean the output is instantly valid at a PWM edge; variant, gain, input filter, output loading and ADC timing matter. | Make current measurement a timed physical observation rather than a clean scalar. | Section 08 and the current-sense integrity lab with a visible invalid window. |
| TI, `SDAA145A`, *DC-Link Capacitor Pre-charge Circuit Evaluation*, 2025, pp. 2-17 | Compare resistor-based and controlled precharge paths, model capacitor charging and expose inrush, time, dissipation and control tradeoffs. | Automotive examples and component values are not a robot drive prescription. Contactor feedback, discharge and regeneration remain system responsibilities. | Ground first-order bus-charge formulas and keep energy/safety evidence visible. | Section 02 and the DC-link energy lab. |
| Infineon, *MOSFET PCB Layout Guidelines for MOSFET Gate Driver Applications*, current application note | Minimize gate-drive loop and shared inductance, place bypass close to the driver and control return geometry to reduce oscillation and false switching. | Generic layout guidance cannot predict a target switching waveform without package, stack-up and parasitic measurement/modeling. | Explain why schematic nets are insufficient and why gate return has physical ownership. | Sections 04-05 and gate/power loop overlays. |
| Analog Devices, AN-1321 and AN-1308 | Explain high-side current-sense common-mode transients and amplifier step-response/PWM-rejection considerations. | Demonstrations are amplifier- and test-condition-specific; they do not replace target-edge capture and acquisition timing. | Cross-check the sense-amplifier timing boundary outside one vendor family. | Section 08 evidence checklist and invalid-sample visualization. |

## Narrative sections and Viz contract

### 01. A duty request is not delivered electrical power

- Open at the FOC handoff: `duty_abc` names desired average bridge states, not an observed voltage/current/torque.
- Draw four paths and their owners: energy, commutation, gate charge and evidence/protection.
- Close the power identity `P_dc = P_mech + P_copper + P_switch + P_magnetic + dE_stored/dt` with explicit signs during regeneration.
- Viz `PowerPathContractLab`: select motoring, coast, regeneration or fault; animate only the active energy arrows and report requested/applied/absorbed/protected values separately.

### 02. The DC link is an energy reservoir

- Distinguish pack nominal/max, connector and harness inductance, local bulk/high-frequency decoupling, precharge, discharge and brake/absorption paths.
- Derive capacitor energy, first-order RC charge, initial inrush and regeneration headroom.
- Explain capacitor ripple-current/ESR and placement qualitatively; do not select a production capacitor from capacitance alone.
- Viz `DcLinkEnergyLab`: change bus voltage, capacitance, precharge resistance, regen power/time and maximum bus; plot charge/bus rise, energy/headroom, peak current and an enable decision.

### 03. A half bridge commutates inductive current

- Build one phase leg before showing all three. Trace positive/negative current through high-side, low-side, body diode and regeneration states.
- Separate dead-time diode conduction, reverse recovery, shoot-through and short-circuit current.
- Explain device voltage/current/SOA margin and parallel-device current sharing at temperature.
- Viz `HalfBridgeCommutationLab`: controls for switch state, current sign, dead time and parallel mismatch; show the physical current path, forbidden overlap and which device absorbs energy.

### 04. The gate driver controls charge, not an abstract bit

- Explain gate-source loop, charge/current/transition approximation, bootstrap refresh/UVLO, Miller current and common-source inductance.
- Show turn-on/off resistance and source/sink asymmetry as a trade among loss, overshoot, false turn-on and EMI.
- Separate commanded dead time from measured effective dead time after propagation mismatch.
- Viz `GateDriveSlewLab`: change gate charge, source/sink current, common-source inductance, Miller coupling and dead time; report estimated edge time, false-turn-on margin and shoot-through gate.

### 05. Copper geometry becomes voltage stress

- Derive overshoot from commutation-loop inductance and current slew; derive the first LC ringing estimate.
- Overlay the local DC-link loop, gate loop, switch node and probe loop on a board-zone reconstruction.
- Choose loop reduction, slew tuning, snubber or clamp according to measured cause; state snubber loss and tuning boundary.
- Viz `RingingLayoutLab`: drag/select capacitor and driver zones or use compact placement controls; show loop area proxy, overshoot estimate, ring frequency and probe-induced error.

### 06. Every switching choice enters the loss budget

- Add conduction, switching overlap, diode/recovery, gate-drive, shunt and auxiliary losses at a declared bus/current/duty/frequency/temperature.
- Annotate which terms are first-order estimates and which require datasheet energy curves or waveform integration.
- Explain why lower `R_DS(on)` may increase charge/capacitance and why faster switching can move rather than eliminate loss.
- Viz `LossBudgetLab`: change current, frequency, temperature, slew and device profile; render a compact stacked loss budget plus efficiency and dominant uncertainty.

### 07. Heat follows an impedance path and a time scale

- Separate junction, case, board, interface, heatsink and ambient nodes; compare steady `theta` and transient `Z_theta(t)` reasoning.
- Explain copper spreading, thermal vias, airflow, adjacent phases and enclosure ambient.
- Require calibration/uncertainty for thermal-camera evidence and a margin to maximum junction temperature.
- Viz `ThermalPathLab`: change loss pulse/steady loss, duration, ambient, board/cooling path; plot estimated junction versus surface evidence and report margin/derate state.

### 08. Current sensing must survive the switch node

- Compute shunt signal and heating; show inline versus low-side tradeoffs without declaring one universal winner.
- Explain Kelvin nodes, amplifier common-mode range, PWM rejection/hold/settling, output headroom, bandwidth and ADC acquisition.
- Place the sample in a valid window and preserve raw/filtered/saturation diagnostics.
- Viz `CurrentSenseIntegrityLab`: change current, shunt, gain, edge timing, Kelvin error and amplifier settling; report true current, ADC-inferred current, invalid interval and close-loop validity.

### 09. Protection is a latency and energy budget

- Compare VDS overcurrent, shunt comparator, UVLO, OTSD, bus overvoltage and external shutdown by detected quantity and coverage.
- Derive approximate VDS trip current while exposing temperature/tolerance/parallel/layout/blanking boundaries.
- Sum detect/blank/propagate/gate-discharge time and integrate fault energy; show why firmware is a slower supervisory layer.
- Viz `ProtectionLatencyLab`: inject short, overcurrent, bus overvoltage or gate-supply fault; show the detection timeline, let-through estimate, first owner and whether hardware independently removes gates.

### 10. PCB and bring-up must produce physical evidence

- Zone connector/bulk, three bridge legs, drivers, sensing, logic and isolation/shutdown boundary; name every high `di/dt` return.
- Use a staged bring-up ladder: unpowered checks -> current-limited bias/UVLO -> driver inputs and `V_GS` -> limited-bus switching -> sense calibration -> trip injection -> thermal/envelope expansion.
- Require short-ground or differential probing, current probe, bus capture, amplifier output/ADC correlation and temperature evidence.
- Viz `BringupEvidenceLab`: choose a stage and injected defect; reveal required instruments, pass/fail observations and the exact next-stage enable gate.

## Formula contract

Every display equation must use `String.raw`, Korean `underbrace` annotations inside KaTeX and exactly one `FormulaNote` immediately below. Split one semantic operation per display before reducing scale. Target minimum computed scale is `>= 0.75` at 360 px and `>= 0.85` at 390 px.

1. Power and stored energy:
   - `P_dc = P_mech + P_copper + P_switch + P_other + dE_stored/dt`
   - `E_C = (1/2) C V_dc^2`
   - annotate signed regeneration and the system boundary.
2. Precharge and regeneration headroom:
   - `V_C(t)=V_S(1-e^{-t/(R_pre C)})`
   - `I_pre(0)=V_S/R_pre`
   - `Delta E_head=(1/2)C(V_max^2-V_0^2)` and `Delta V≈I_regen Delta t/C` only for the declared short interval/rough constant-current assumption.
3. Parasitic overshoot and ring:
   - `Delta V≈L_loop di/dt`
   - `f_0≈1/(2pi sqrt(L_loop C_eq))`
   - do not imply that the same equivalent `L/C` remains fixed across operating points.
4. Gate transition and gate-drive power:
   - `t_edge≈Q_switch/I_gate`
   - `P_gate≈Q_g V_G f_sw N_gates`
   - distinguish plateau/transition charge from total datasheet charge and driver loss from MOSFET overlap loss.
5. Conduction and first-order switching loss:
   - `P_cond≈I_rms^2 R_DS(on)(T_j) D`
   - `P_sw≈(1/2)V_DS I_D(t_r+t_f)f_sw`
   - mark waveform, modulation, reverse-recovery and nonlinear-capacitance omissions.
6. Shunt and sensor output:
   - `P_sh=I_rms^2 R_sh`
   - `V_out=V_ref+G(I_phase R_sh+V_Kelvin-error+V_amp-error)`
   - keep common-mode voltage separate from differential signal.
7. Thermal:
   - steady estimate `T_j≈T_a+P_loss theta_JA`
   - transient estimate `Delta T_j(t)≈P_pulse Z_theta(t)`
   - do not add incompatible thermal-resistance paths or convert a surface pixel directly into junction temperature.
8. Approximate VDS overcurrent:
   - `I_trip≈V_DS,threshold/R_DS(on)(T_j)`
   - annotate comparator tolerance, parasitic drop, current sharing and blanking as error/boundary terms.
9. Fault latency and energy:
   - `t_off=t_detect+t_blank+t_prop+t_gate-discharge`
   - `E_fault=integral_0^t_off v_device(t)i_device(t)dt`
   - do not replace SOA or short-circuit withstand evidence with one scalar estimate.
10. Efficiency:
   - `eta=P_mech/P_dc=1-P_loss/P_dc` only for matching steady boundaries; regeneration requires signed definitions rather than blindly applying the motoring ratio.

## Visual design contract

- Surface: production engineering notebook, not a dark oscilloscope theme, marketing card grid or component catalog.
- Palette: neutral white/graphite surfaces; blue for commanded/source quantities, cyan/teal for measured current/valid conduction, violet for gate/control, amber for stored energy/uncertainty, red only for active electrical stress or prohibited overlap, green only for verified margin.
- Board geometry: use softened orthogonal traces with 1-1.5 px strokes and small-radius bends; power copper may be filled but must not become thick decorative rails. Current direction is shown by moving markers or compact arrowheads, never glow.
- Waveforms: shared time axis, thin traces, restrained grid, stable chart height, numeric cursor result and explicit requested-versus-measured legend. Animation plays only after user action and honors reduced motion.
- Hierarchy: compact milestone number, one causal question, two-line answer, then prose and a full-width lab. No scene immediately after a heading without narrative setup.
- Density: no nested cards. Use unframed stage plus compact instrument/control band. At most four metrics in a full-width row and no unexplained whitespace below diagrams.
- Typography: plot labels `11-12 px`, body `13-15 px`, measurements tabular/monospace. Long explanation stays outside SVG/canvas geometry.
- Responsive: mobile order is controls -> physical stage/waveform -> measured consequence. Recompose the bridge/board instead of scaling a desktop schematic until illegible.
- Formula: never horizontal-scroll. Split causal terms and attach Korean in-formula labels plus a Korean `FormulaNote`.
- Accessibility: all color states have path labels/line styles/text state; controls are keyboard reachable and focus-visible; static text contains the lesson when animation is paused.

## Dedicated company-reference reconstruction: TI TIDA-010956

### Reconstruction question

How does a modern 48 V robot-servo reference design turn a current/power claim into a schematic, PCB, protection and test-evidence package, and precisely which parts of the `85 Arms` and shutdown story are or are not demonstrated by the published measurements?

### Evidence slices

1. **Claim and architecture** — design guide pp. 2-4: 24-60 V input, dual-axis intent, three half bridges per axis, C2000 host interface, current sensing and split shutdown paths.
2. **Device/parallel and protection choices** — pp. 5-9 plus schematic sheets 2-6: DRV8162L, two parallel MOSFETs per switch, local decoupling/bootstrap, configurable drive/dead time/VDS OCP, inline shunts and distinct amplifier options.
3. **Power-up and stored energy** — p. 16: sequenced bias and bus connection; board capacitance above 700 microfarads with an optional 3.6 mF capacitor board.
4. **Switching mechanism** — pp. 17-21: double-pulse or motor-test setup, hard/soft switching traces, gate/switch-node behavior and measured PWM-to-gate propagation/dead time.
5. **Current-sense observation** — pp. 22-23: inline amplifier behavior and a displayed worst-case settling around 1 microsecond under the documented setup.
6. **Thermal evidence** — p. 24: 48 V, 16 kHz, 26.2 Arms/37 A peak, 28 C ambient, no heatsink/fan, reported surface rise 45.5 C and junction estimate under 125 C; higher current/ambient may need cooling.
7. **Evidence boundary** — no displayed full-85-Arms continuous thermal trace, no target robot mechanical load/lifetime qualification, no certified STO evidence and no universal transfer of thresholds/layout to another board.

### Reconstruction article structure

1. Context: why a robot joint needs a complete reference design rather than a controller algorithm alone.
2. Claim: list the title/spec claims separately from measured claims.
3. Mechanism: reconstruct the energy, bridge, driver, sensing and shutdown paths from guide/schematic/layout.
4. Evidence: align each plot/test condition with only the claim it supports.
5. Reproduction: define instruments, operating point, calibration and pass/fail fields needed to repeat the public tests.
6. Boundary: enumerate extrapolations the published evidence does not justify.
7. Legacy: show how a reader can reuse the claim-evidence method on later company research notes and reference designs.

### Reference labs

- `TidaArchitectureLab`: choose power, commutation, gate, sense or shutdown view and see only that path with its physical owner and observation point.
- `TidaClaimEvidenceLab`: select `85 Arms`, switching, propagation/dead time, current-sense settling, thermal or shutdown; show claim, implementation, exact test condition, observed evidence, supported inference and unsupported inference.
- Optional embedded calculator within the evidence lab: `I_trip≈V_DS,threshold/R_DS(on)(T)` for single/parallel and temperature cases, explicitly labeled as an estimate whose errors include blanking, sharing, threshold tolerance and Kelvin geometry.

## Coverage gate

| Transfer premise | Public location required |
|---|---|
| four distinct physical/evidence paths | section 01 + power-path lab |
| stored bus energy, precharge, discharge and regen headroom | section 02 + DC-link lab |
| legal/illegal half-bridge commutation and parallel sharing | section 03 + commutation lab |
| gate charge, bootstrap, Miller, shared-source inductance and dead time | section 04 + gate lab |
| parasitic overshoot, ring, probing, damping and PCB loop geometry | section 05 + layout lab |
| complete first-order loss budget with boundaries | section 06 + loss lab |
| steady/transient junction estimate and thermal evidence boundary | section 07 + thermal lab |
| shunt/Kelvin/common-mode/settling/ADC validity | section 08 + sensing lab |
| trip threshold, independent shutdown, latency and let-through energy | section 09 + protection lab |
| board zoning and low-energy evidence ladder | section 10 + bring-up lab |
| company claim versus implementation/test/unsupported extrapolation | dedicated TIDA reconstruction article |

## Completion checks

- Every private transfer premise maps to a prose paragraph, annotated formula, lab state or evidence table.
- All labs remain useful without motion and change a numeric or geometric consequence when operated.
- No formula renders raw `theta`, `partial`, `Delta` or a missing Korean annotation.
- No article lab uses inner horizontal/vertical scrolling at 360, 390, 768 or 1440 px.
- Target computed formula scale is at least `0.75` at 360 and `0.85` at 390.
- TIDA `85 Arms` is never presented as proven by the 26.2 Arms thermal capture.
- Shutdown architecture is never called certified STO without certification evidence.
- Source links point to direct official product, guide, datasheet or application-note pages.
- Final build, responsive screenshots, interaction state changes, KaTeX checks, overflow checks, public HTTP checks and production restart are recorded in a machine-readable run artifact.
