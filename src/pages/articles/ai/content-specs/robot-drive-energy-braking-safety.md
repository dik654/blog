# Robot Drive Energy & Braking Safety content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 내리막 자전거처럼 멈춤이 저장된 움직임을 열이나 다른 저장소로 옮기는 일이라는 장면에서 시작한다.
- `regeneration`, `DC-link headroom`, `chopper`보다 먼저 남은 에너지, 받아 줄 곳, 안전한 끝 상태를 설명한다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal

- Reader outcome: the reader can start from a robot axis stop/deceleration request, inventory the mechanical energy that must leave the axis, choose and size a physically available destination for that energy, and design a contactor/precharge/discharge sequence whose measured bus behavior proves the requested state actually exists.
- System invariant: a drive may accept negative mechanical power only while the DC bus has a measured energy destination whose instantaneous power, total energy, voltage, current and thermal limits all remain valid; otherwise the motion command must be reshaped before the bus reaches a destructive state.
- Curriculum boundary: this article owns mechanical-energy-to-DC-bus-to-sink reasoning, brake chopper/resistor first-order sizing, multi-axis reuse, source charge acceptance, precharge/discharge/contactors and energy-state commissioning. It does not certify emergency stopping, holding brakes, battery packs, high-voltage insulation, EMC, STO, PL or SIL.

## Why this is a separate foundation

| Existing article | Output it already promises | Energy assumption it leaves open |
|---|---|---|
| `robot-dynamics-feedback-control` | Produces a bounded torque trajectory and explains saturation. | Does not decide where kinetic or gravitational energy goes when torque and speed have opposite signs. |
| `robot-motor-drive-foc` | Produces negative `i_q`, field weakening and regenerative inverter states. | Does not prove that the source, battery, peer axes or resistor can absorb the returned power. |
| `robot-power-electronics-motor-driver` | Derives DC-link headroom, precharge basics and a protected bridge. | Stops before braking topology selection, repeated pulse sizing, contactor diagnosis and multi-axis energy arbitration. |
| `reference-ti-tida-010956-2025` | Reconstructs a real 48 V inverter and its bounded evidence. | Does not establish the target robot's braking energy, source sink capability, BMS behavior or discharge policy. |
| `signals-systems-convolution` | Supplies state, exponential transients and time-scale intuition. | Does not bind those dynamics to energy capacity, stop time and power-sink constraints. |

## Scope decision

| Topic | Depth | Reason |
|---|---|---|
| Rotational, translational, gravitational and elastic energy inventory | deep | Braking starts in mechanics. Motor nameplate current cannot replace the actual energy and power trajectory. |
| Four-quadrant torque-speed and signed power | deep | Negative torque is braking only relative to speed; current sign alone is ambiguous across direction changes. |
| DC-link capacitor headroom and overvoltage control | deep | A capacitor stores finite energy and may provide only milliseconds of headroom at high braking power. |
| Energy destinations: natural loss, motor loss, source/battery, common bus, capacitor, resistor and regenerative front end | deep comparison | Each destination has different power, energy, availability, efficiency, thermal and failure contracts. |
| Battery/BMS and power-supply sink capability | deep boundary | A bus connected to a battery or supply is not automatically bidirectional. Charge-current, voltage, temperature and disconnect states must be explicit inputs. |
| Brake chopper, resistor and hysteresis | deep first-order sizing | Device current, required braking power, pulse energy, repetition and fire/ambient constraints form one feasibility interval. |
| Multi-axis common DC bus | deep allocation | One motoring axis can absorb another axis's energy, but all-axes braking remains a worst case requiring another sink or trajectory limit. |
| Precharge, main contactors, discharge and welded/open detection | deep state/evidence contract | Timer-only sequencing cannot prove the physical bus or contact state. Expected voltage trajectories are diagnostic evidence. |
| Supervisory energy state machine and command shaping | deep | Hardware limits must feed back into deceleration, torque and axis scheduling before overvoltage protection becomes the normal controller. |
| Mechanical holding brake, emergency stop category and certified safety functions | scoped handoff | Electrical braking may coast, lose power or release a vertical load. Risk assessment and functional safety belong to the next isolation/EMC/STO foundation. |

## Reader prerequisites

- Energy and power: joule is stored work; watt is energy per second. Peak power and total pulse energy constrain different components.
- Rotation and translation: `omega`, torque, inertia, velocity, force and mass with SI units.
- RC transients: exponential charge/discharge and time constant from the signals article.
- FOC and four-quadrant intuition: signed `i_q`, torque, speed and DC-bus current from the motor-drive article.
- DC link and half bridge: capacitor energy, precharge and regenerative current path from the power-electronics article.

## Private hardest transfer problem

Do not publish this compound problem as a quiz. It is the coverage gate for prose, formulas, Viz states and the company-reference reconstruction.

A seven-axis mobile manipulator uses a nominal 48 V battery, a 60 V absolute bus limit, 2.2 mF local capacitance and one shared DC bus. The battery can normally accept charge, but its BMS may reduce allowable charging current near full state of charge, below freezing or during cell balancing, and it can open the pack contactor on a fault. Three arm joints and the vertical lift decelerate simultaneously while the mobile base is idle. The motion planner requests the same aggressive stop used during low-state-of-charge tests. The firmware assumes the capacitor and battery will absorb all returned energy. It computes only `1/2 J omega^2`, omits reflected load inertia, payload potential energy, gearbox efficiency and spring energy, and compares average braking power to a motor nameplate.

The bus capacitor receives the first pulse. A brake chopper exists, but its resistor was chosen from a steady wattage label. The calculation omits minimum resistance from switch current, maximum resistance from required braking power, DC-bus threshold tolerance, PWM/hysteresis, resistor pulse energy, enclosure ambient, repeated-cycle temperature and open/short failure. The resistor's thermal switch is routed only to firmware. All axes can enter regeneration together, yet the common-bus policy subtracts a fixed peer-axis motoring load that may not exist. A bench supply used during commissioning cannot sink current and trips off when the bus rises.

Power-up uses a precharge resistor and three contactors. A fixed timer declares success even if a downstream load is active or the precharge contactor is welded. Main contactor auxiliary contacts are present but ignored. DC-link voltage is measured only on the source side. On shutdown, firmware opens the contactors before removing torque and does not verify that the downstream bus discharges. A service technician sees the pack disconnected and assumes the inverter is de-energized. In a BMS-open fault during regeneration, the control loop first receives a generic undervoltage error after the pack has disconnected, even though the local bus has already exceeded the chopper threshold.

The reader must be able to:

1. Define the system boundary and sign convention so mechanical braking power, DC power and sink power cannot silently change sign.
2. Inventory motor/gear/load rotational energy, translational energy, gravitational potential and spring energy without double counting reflected inertia.
3. Separate peak braking power from total braking energy and from repeated-cycle average power.
4. Explain why torque and speed sign, not negative current alone, determine the operating quadrant.
5. Derive a stop trajectory whose requested energy and power are consistent with torque, speed and time.
6. Subtract natural load loss only when its speed-dependent model and uncertainty are declared.
7. Compute capacitor energy headroom from two squared voltage levels rather than linear voltage difference.
8. Convert capacitor headroom and regenerative power into a first-order time-to-limit and explain why the result may be milliseconds.
9. Distinguish a source that supplies current from one that can absorb current at the present voltage, temperature, state of charge and fault state.
10. Treat BMS charge-current limit and contactor state as runtime constraints, not nominal battery properties.
11. Distinguish coast, dynamic motor-loss braking, controlled regeneration, resistor braking, common-bus reuse and active-front-end return.
12. Explain why shorting motor phases dissipates energy in motor/inverter loss instead of returning it to the source, with thermal consequences.
13. Allocate simultaneous multi-axis power on a common bus while preserving the all-braking worst case.
14. Compute excess power only after subtracting measured/guaranteed sink capacity, never hoped-for peer-axis demand.
15. Derive brake-resistor current and instantaneous power from bus voltage and resistance.
16. Build a feasible resistor interval from switch current and required braking power and reject the design if the interval is empty.
17. Integrate resistor pulse energy and repeated-cycle average power instead of selecting from continuous wattage alone.
18. Model chopper on/off thresholds, hysteresis, measurement tolerance, switch delay and bus overshoot as one margin.
19. Bound chopper duty and device current at maximum bus voltage and minimum resistor value.
20. Treat resistor overtemperature, open circuit, short circuit and thermal-switch failure as distinct fault states.
21. Derive precharge voltage, initial current, resistor energy and completion criteria from the measured source and downstream bus.
22. Use the voltage-rise envelope to detect active downstream load, open precharge path or bypass/welded contact rather than relying on elapsed time.
23. Sequence negative/main/precharge contactors only after declaring topology and verify actual contact/bus state with independent feedback.
24. Derive a discharge time and prove downstream voltage, not command echo, is below the declared service threshold.
25. Explain why opening the battery contactor during regeneration can worsen the local overvoltage unless torque and a local sink are coordinated first.
26. Feed bus headroom and sink capacity back into a maximum regenerative torque or deceleration command before hardware overvoltage trip.
27. Separate a controlled operational stop, electrical braking, mechanical holding and a certified safety stop.
28. Build a commissioning ladder using an absorbent source or bounded dump load, current limit, bus probes, contactor feedback, injected BMS disconnect and repeated pulse tests.
29. Log requested mechanical energy, measured bus power, sink current, capacitor voltage, chopper state, resistor temperature and final speed as one energy ledger.
30. Read ABB's guide as a braking-solution selection framework whose industrial examples do not certify a robot battery, joint stop or safety function.

The article passes only if all thirty premises map to public causal prose, a Korean-annotated formula, a lab observable, an evidence gate or an explicit scope boundary.

## Source, intent and boundary ledger

| Source locator | Original purpose and claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| ABB Drives, *Technical guide No. 8: Electrical braking*, `3AFE64362534 REV C`, 31 May 2018, pp. 4-30 | Start braking selection from mechanics; relate torque, speed, energy and time; compare flux braking, resistor chopper, regenerative front ends and common DC; give industrial worked examples. | Examples are primarily industrial AC drives, not 48 V battery robots. The guide does not provide a target BMS contract, contactor diagnostic design, robot payload model or functional-safety certification. | Use as the company-reference spine because it reconstructs why braking topology is an energy and duty-cycle decision rather than a motor-nameplate option. | Dedicated reference article with a mechanics/headroom/chopper/alternative/common-bus evidence selector. Redraw formulas and topologies; preserve page conditions and unsupported transfer. |
| TI, `SDAA145A`, *DC-Link Capacitor Pre-Charge Designs in Automotive Systems*, Oct. 2025, Rev. A Apr. 2026, pp. 2-17 | Explain conventional RC precharge and compare relay, solid-state and converter-based alternatives. Quantify time, peak current and resistor energy/power. | The example is automotive high voltage and states a design-specific 400 ms expectation. Values and topology do not transfer to a low-voltage robot. Discharge, weld diagnostics and regeneration remain system concerns. | Ground the current precharge equations and show why expected voltage trajectory, not a universal timer, is the evidence. | Precharge state lab and formula blocks; no component recommendation is copied. |
| TI, `SLVAFB0`, *Why Pre-Charge Circuits are Necessary in High-Voltage Systems*, Dec. 2021 | Show initial, precharge and steady states and explain contact arcing/welding from capacitive inrush. | High-voltage diagrams are explanatory, not a complete diagnostic or contactor safety design. | Anchor contactor-state order and make command versus physical contact state explicit. | Section 08 contactor state machine. |
| Sensata, *How to Design a Precharge Circuit for Hybrid and Electric Vehicle Applications*, 2020/current public PDF, pp. 5-12 | Give precharge sequence, 95% target example, auxiliary feedback and voltage-rise envelope diagnosis for open, welded and downstream-load failures. | Product/vendor guidance does not establish a universal charge percentage, voltage threshold or diagnostic coverage. | Supply the missing measured-trajectory diagnostic pattern. | Section 08 fault injection; every threshold is labeled target-specific. |
| TI, *Stages of motor control* video, 2021 | Compare coast, braking, anti-voltage-surge, regeneration and resistor braking; require supply/battery voltage-current limits during regeneration. | Introductory motor-driver material does not size a multi-axis robot energy sink. | Confirm that source absorption is an explicit operating constraint and that braking modes have different energy paths. | Sections 01, 05 and source-sink lab. |
| TI, `SLLA527`, *Integrated Protection Against Back EMF Overvoltage in Motor Drive Systems*, 2020 | Explain how generated voltage can exceed connected absolute maximum and how braking/clamp paths alter current destination. | Brushed/integrated-driver examples do not transfer numerically to a three-phase FOC inverter. | Cross-check the overvoltage mechanism outside the large-drive ABB context. | Section 04 failure explanation. |
| TI TIDA-010956 design guide Rev. B, 2025 | Provide a current 48 V robot-servo inverter, bus capacitance, sensing and shutdown context. | It does not specify the reader's braking energy, battery charge acceptance, chopper or holding/safety-stop system. | Keep the new article connected to the preceding physical board rather than drifting into only mains-fed industrial drives. | 48 V defaults and explicit handoff from the reference article. |

## Full-scope map

| Topic | Must prove | Depth | Section | Risk if omitted |
|---|---|---|---|---|
| Energy boundary | requested stop creates a signed energy flow, not an abstract mode | deep | 01 | reader equates PWM off with energy removal |
| Mechanical inventory | kinetic, potential and elastic energy with reflected parameters | deep | 02 | sink is sized from motor label instead of load |
| Quadrants and trajectory | sign and time determine instantaneous power | deep | 03 | negative current is misread across speed reversal |
| Capacitor headroom | squared-voltage energy and time-to-limit | deep | 04 | capacitor is assumed to absorb an entire stop |
| Sink selection | availability, power, energy and failure of each destination | deep | 05 | battery, supply or peer axis is assumed bidirectional |
| Chopper/resistor | feasible R interval, pulse, repetition and hysteresis | deep | 06 | resistor is chosen by continuous wattage only |
| Common bus arbitration | simultaneous axis power and worst case | deep | 07 | expected peer demand is counted as guaranteed sink |
| Contactor lifecycle | precharge, main close, running, isolate, discharge, diagnose | deep | 08 | timer and coil command substitute for bus evidence |
| Supervisor | convert bus/sink limits into allowed regenerative torque | deep | 09 | hardware overvoltage becomes normal control loop |
| Evidence | staged tests and energy ledger | deep | 10 | one successful stop is mistaken for envelope proof |
| Functional safety | stop/hold/STO/PL/SIL allocation | defer | next article | electrical deceleration is mislabeled safe stop |

## Narrative sections and Viz contract

### 01. A stop command creates an energy-routing obligation

- Concept: distinguish `stop requested`, `negative torque applied`, `mechanical energy reduced`, `DC energy accepted` and `hazardous motion ended` as different states.
- Flow: torque-speed state -> signed mechanical power -> inverter/DC power -> one or more measured sinks -> final motion and bus state.
- Failure: PWM off can cause coast; battery disconnect can remove a sink; low-side short braking moves heat into the motor rather than the battery.
- Viz `BrakingEnergyContractLab`: choose coast, dynamic short, regeneration or resistor braking. Show the actual energy destination, stop-time tendency, bus effect and thermal owner. No generic arrows remain active.

### 02. Inventory energy before choosing electronics

- Concept: compute rotational, translational, gravitational and elastic changes across the requested motion, then account for reflected inertia and efficiency exactly once.
- Variables: `J_eq [kg m^2]`, `omega [rad/s]`, `m [kg]`, `v [m/s]`, `Delta h [m]`, `k [N/m]`, `x [m]`, stop time and natural load work.
- Failure: a descending axis can generate energy even near constant speed; a spring can release after motor speed reaches zero.
- Viz `MechanicalEnergyInventoryLab`: enable joint, payload lift, base translation and spring terms; change speed/height/time and expose term-by-term joules, peak/average power and double-count warning.

### 03. Quadrants determine the sign; the trajectory determines the peak

- Concept: use `P_mech=T omega`, not torque sign alone. Compare constant torque, constant power and speed-dependent natural load.
- Flow: trajectory samples -> torque/speed signs -> braking interval -> instantaneous and integrated power -> required sink envelope.
- Failure: average power can pass while the first deceleration sample exceeds chopper or battery current.
- Viz `FourQuadrantBrakingLab`: move an operating point across four quadrants and choose a stop time/profile; plot speed, torque and signed power with peak/energy cursors.

### 04. DC-link capacitance buys time, not a destination

- Concept: derive available capacitor energy between measured bus and action limit, and turn it into time-to-limit under returned power.
- Flow: `V0,C,Vaction,Pregen` -> `Delta Ecap` -> bus rise curve -> controller/chopper/trip deadlines.
- Failure: linear `C Delta V` reasoning confuses charge with energy; nominal bus leaves no room for harness overshoot and tolerance.
- Viz `BusHeadroomLab`: sweep capacitance, initial/action/max voltage and regen power; render bus voltage over milliseconds plus remaining joules and time margin.

### 05. A sink is valid only when it is available now

- Concept: compare natural/motor loss, battery or bidirectional source, peer-axis load, resistor chopper and regenerative front end across power, energy, efficiency, availability and failure.
- Flow: returned power -> measured guaranteed sink capacities -> excess power -> command limit or local dump.
- Failure: lab bench supply trips on reverse current; BMS charge allowance falls to zero; all axes brake together.
- Viz `EnergySinkAllocatorLab`: change battery acceptance, source reversibility, peer-axis demand and chopper availability. Show allocation bars and whether the stop request is feasible without extrapolating a sink.

### 06. Brake chopper sizing is a feasibility interval

- Concept: resistor value must be high enough for device current and low enough for required braking power, while pulse energy and repeated average remain inside the resistor and enclosure thermal envelope.
- Flow: threshold and required power -> `Rmin/Rmax` -> current/duty -> pulse energy -> temperature/repetition gate.
- Failure: empty interval; threshold tolerance reaches device maximum; open resistor causes overvoltage; short resistor overloads switch; thermal switch is firmware-only.
- Viz `BrakeChopperFeasibilityLab`: sliders for bus threshold, required power, current limit, resistance, pulse/repeat and cooling. Show feasible band, selected point, hysteretic bus ripple and resistor temperature state.

### 07. A common DC bus is an allocation problem

- Concept: peer axes may reuse energy with fewer conversion losses, but their motoring demand is a measured time-varying sink, not guaranteed capacity.
- Flow: per-axis signed power -> bus sum -> battery/source allocation -> chopper remainder -> per-axis regenerative torque budget.
- Failure: simultaneous braking, stale peer forecast, communication delay, source disconnect and bus segment loss.
- Viz `CommonBusArbitrationLab`: four compact axis lanes with independent motoring/braking power. Toggle measured versus forecast demand and show net bus power, reuse ratio, excess power and safe per-axis limit.

### 08. Precharge and discharge are measured state transitions

- Concept: command states and physical bus/contact states are separate. Use source-side voltage, downstream bus voltage, current and auxiliary feedback to validate each transition.
- Flow: isolated/discharged -> negative/main path -> precharge -> voltage-envelope validation -> main bypass -> run -> torque removal -> isolate -> discharge -> verified safe voltage.
- Failure: open resistor, active downstream load, welded precharge/main contact, stuck auxiliary, failed bleed and source-side-only measurement.
- Viz `PowerContactorStateLab`: step the state machine and inject each fault. Plot expected versus measured downstream voltage envelope, show actual/commanded contacts and block illegal transitions.

### 09. Energy limits must reshape motion before hardware trips

- Concept: derive available regenerative power and convert it to `Tregen,max=Pavailable/|omega|`, with low-speed torque/current limits and trajectory continuity.
- Flow: bus headroom, source/chopper/peer capacity and temperatures -> available power -> axis allocation -> torque/deceleration limit -> hardware overvoltage as last containment.
- Failure: division near zero speed, abrupt torque discontinuity, stale BMS limit, chopper overtemperature and contactor opening under returned current.
- Viz `BrakingSupervisorLab`: apply a stop request while battery acceptance or resistor temperature changes. Show requested versus allowed torque, bus prediction, stop-time extension and containment owner.

### 10. Commissioning must close an energy ledger

- Concept: progress from passive state checks to low-energy precharge, absorbent-source tests, limited-speed regeneration, chopper pulse, BMS-open injection, repeated cycle and full envelope.
- Evidence: torque/speed, mechanical energy estimate, DC voltage/current, source/battery current, chopper duty, resistor temperature, contactor feedback and final motion.
- Failure: one successful stop, one low-SOC battery or a short pulse is generalized to every payload, temperature and repetition.
- Viz `BrakingCommissioningLab`: choose stage and fault injection; reveal instruments, target traces, pass/fail invariant and next-stage permission.

## Formula contract

Every display equation must use `String.raw`, a short Korean `underbrace` that states why the operation exists and exactly one `FormulaNote` immediately below. Split operations before shrinking. Minimum computed scale: `>=0.75` at 360 px, `>=0.85` at 390 px.

1. Signed power:
   - `P_mech(t)=T_m(t) omega(t)` with torque-speed sign labeled `energy direction`.
   - `E_brake=-integral_{P_mech<0} P_mech dt` under the declared system sign.
2. Mechanical inventory:
   - `Delta E_rot=(1/2)J_eq(omega_0^2-omega_1^2)`.
   - `Delta E_trans=(1/2)m(v_0^2-v_1^2)`.
   - `Delta E_g=m g (h_0-h_1)` and `Delta E_spring=(1/2)k(x_0^2-x_1^2)` with sign and boundary notes.
3. Braking envelope:
   - `P_peak=max_t P_regen(t)` and `P_avg=E_cycle/T_cycle`; never substitute one for the other.
4. Capacitor headroom:
   - `Delta E_C=(1/2)C(V_action^2-V_0^2)`.
   - `t_headroom approx Delta E_C/P_excess` only under near-constant positive excess power.
5. Sink allocation:
   - `P_excess=max(0,P_regen-P_battery,allowed-P_source,sink-P_peer,measured)`.
   - Every allowance is runtime bounded and nonnegative under one sign convention.
6. Chopper/resistor:
   - `I_R=V_dc/R_b`, `P_R=V_dc^2/R_b`.
   - `V_on/I_switch,max <= R_b <= V_on^2/P_required` as a first-order feasibility interval; include switch, tolerance and modulation margins outside the compact formula.
   - `D_chop approx P_excess R_b/V_dc^2` for average dissipation in the declared hysteretic/PWM model.
7. Pulse and repetition:
   - `E_R,pulse=integral i_R^2 R_b dt`.
   - `P_R,avg=sum E_R,pulse/T_repeat` and `Delta T_R` comes from the vendor pulse/thermal model, not continuous wattage alone.
8. Precharge:
   - `V_C(t)=V_S(1-e^{-t/(R_pre C)})`, `I_pre(0)=V_S/R_pre`.
   - `E_pre,R approx (1/2) C V_S^2` for an ideal zero-to-source passive RC charge; state initial voltage and repeated-cycle limits.
9. Discharge:
   - `V_C(t)=V_0 e^{-t/(R_dis C)}` and `t_safe=R_dis C ln(V_0/V_safe)` under an unloaded first-order model.
10. Supervisory torque:
   - Split before shrinking: `T_power,max=P_sink,available/max(|omega|,omega_floor)`, then `|T_regen,max|=min(T_current,max,T_power,max)` with low-speed handling explicitly described.
11. Common bus:
   - `P_bus=sum_i P_dc,i`; `P_bus<0` or `>0` must follow one declared source/sink sign and never change between prose and Viz.
12. Efficiency boundary:
   - `E_dc,returned <= eta_regen E_mech,released`; efficiency is operating-point dependent and cannot create a sink.

## Visual design contract

- Surface: production engineering notebook with neutral white/graphite structure, not a red industrial brochure, dark oscilloscope wall or nested card grid.
- Accent roles: cobalt for requested motion/source, teal for measured bus/current, amber for stored energy and limited headroom, violet for chopper/control, emerald only for verified sink, red only for excess energy or illegal contact state.
- Energy paths: 1-1.5 px lines with compact arrow markers; line thickness does not encode power. Numeric labels and short legends carry magnitude.
- Time plots: stable aspect ratio, shared axis, thin traces, target/action/max bands and an explicit cursor. No decorative grids or glowing waveforms.
- Milestone hierarchy: compact stage number and question, then two or more narrative paragraphs before the full-width Viz. No scene directly beneath a title without story setup.
- Mobile: recompose four-quadrant maps, contactor topology and common-bus axes into vertical lanes. Never scale a desktop topology until labels fall below 11 px.
- Density: controls -> main representation -> consequence metrics -> one boundary note. No inner scroll and no card inside another card.
- Motion: explicit play/step only for bus rise, chopper hysteresis or contactor sequence; honor reduced motion and preserve the final state as readable static evidence.
- Accessibility: color is paired with direction, label, pattern or status text; buttons and sliders are keyboard operable with visible focus.

## Dedicated company-reference reconstruction: ABB Technical guide No. 8

### Reconstruction question

Why does ABB begin electrical-braking design from mechanical braking power and energy, how does it select among motor loss, resistor chopper, regenerative front ends and common DC, and which parts of that reasoning transfer to a battery robot without inheriting ABB's industrial-drive assumptions?

### Evidence slices

1. **Purpose and boundary** — pp. 2-5: practical guidelines for reducing stored energy or transferring it back to electrical energy; typical industrial applications and four-quadrant vocabulary.
2. **Mechanics first** — pp. 6-11: `P=T omega`, constant versus quadratic loads, braking time, kinetic energy, average power and the warning that braking power is not motor nominal current/power.
3. **Motor-loss braking** — pp. 12-13: flux braking moves energy into motor losses, can avoid extra components and adds repeated thermal stress with motor-dependent capacity.
4. **Capacitor headroom** — pp. 13-14: DC capacitors rise rapidly under reverse power; the worked 90 kW/5 mF/565-to-735 V example yields roughly 6 ms.
5. **Chopper and resistor** — pp. 14-15: threshold-activated resistor path, simple and available during supply loss, but cycle-limited, hot, space-consuming and fire/insulation-stress relevant.
6. **Regenerative alternatives** — pp. 16-22: thyristor and IGBT regenerative arrangements trade continuous return, harmonics, power factor, complexity and cost.
7. **Common DC** — pp. 23-25: one motor can reuse another's braking energy; chopper remains necessary when instantaneous net braking power is positive toward the bus.
8. **Comparison boundary** — pp. 26-29: application-specific economics and a 90 kW hoisting comparison; results vary with equipment and dimensioning and do not prescribe a robot architecture.

### Reference article contract

1. Context: author purpose, industrial problem and source date/revision.
2. Claim: braking device sizing begins with mechanics and duty, not motor nameplate.
3. Mechanism: power/energy derivation, capacitor time, chopper path and alternatives.
4. Evidence: reconstruct the fan example, 6 ms capacitor example, common-bus topology and comparison conditions.
5. Reproduction: translate one robot joint and one multi-axis bus into the same IR without copying values.
6. Boundary: no BMS, 48 V component sizing, contactor diagnostics, holding brake or safety certification is inferred.
7. Legacy: use the guide's decision method as a normalized company-research artifact.

### Reference Viz

- `AbbBrakingReferenceLab`: selectors `Mechanics`, `Headroom`, `Chopper`, `Alternatives`, `Common DC`, `Boundary`.
- For each selector show source page, claim, exact condition/example, derived mechanism, what transfers and what does not.
- The mechanics state reproduces energy/power with adjustable robot values but preserves ABB's source example separately.
- The headroom state shows ABB's 5 mF, 565-to-735 V, 90 kW, about-6-ms evidence and a distinct 48 V robot adaptation.
- The alternatives state compares energy destination, continuous capability, heat, return path and dependency, not vendor product ranking.

## Small-model authoring packets

### 4B packet

- One source page and exact claim boundary.
- One of the thirty private premises.
- One immutable equation with units and sign convention.
- One target paragraph or one Viz state.
- One deterministic check such as `360 px scale >= 0.75` or `BMS acceptance=0 creates positive P_excess`.
- Output order: claim IR -> causal explanation -> Korean underbrace -> FormulaNote -> one state/repair.

### 9B packet

- One section prerequisite/output contract.
- Four to six source claims with page ranges.
- Immutable symbol table and derivation order.
- One failure injection and its expected physical consequence.
- One Viz state machine with controls, observables and invariant.
- Coverage subset and mobile QA checklist.
- Output order: normalized IR -> source boundary table -> prose -> formulas -> Viz spec -> self-audit.

The orchestrator owns retrieval, conflict resolution, sign convention, cross-section energy ledger, scope order, source-versus-derived labels, integration, browser QA and deployment.

## Coverage recheck

| Premise group | Public owner | Gap after spec | Required check |
|---|---|---|---|
| energy boundary and modes | section 01 + contract lab | none | each mode changes destination and consequence |
| mechanics and trajectory | sections 02-03 + two labs | none | joule integral and peak watt both visible |
| capacitor and sink availability | sections 04-05 | none | BMS/source/peer loss creates excess power |
| chopper pulse and thermal | section 06 | none | empty resistor interval and overtemp are visible failures |
| common bus | section 07 | none | simultaneous braking cannot count forecast demand |
| contactors/precharge/discharge | section 08 | none | timer-only success is impossible; measured envelope gates transition |
| supervisor | section 09 | none | unavailable sink lengthens stop before trip |
| evidence | section 10 | none | one pass cannot unlock repeated/full-envelope stage |
| ABB provenance | dedicated reference | none | source example and robot adaptation never merge |
| stop/hold/STO certification | next article | intentionally deferred | all public copy calls it a handoff |

## Completion checks

- Every private premise maps to public prose, an annotated equation, a measurable Viz state, evidence field or explicit scope boundary.
- All concept labs remain useful without animation and change a numeric, temporal, path or enable consequence.
- ABB source values and robot adaptation values are visually and semantically separate.
- No battery, bench supply or peer axis is called a sink without a runtime acceptance input.
- No formula renders raw LaTeX, lacks Korean explanation or lacks exactly one `FormulaNote`.
- Formula scale is at least 0.75 at 360 px and 0.85 at 390 px; there is no document, formula, SVG-label or Viz inner-scroll overflow at 360, 390, 768 or 1440 px.
- The article never calls electrical braking, resistor braking or a contactor sequence a certified safe stop.
- The production build, interaction changes, category/bridge links, public HTTP status, service restart and public browser QA are recorded in a machine-readable run artifact.
