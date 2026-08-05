# Robot Drive Isolation, EMC & Functional Safety content spec

## Goal

- Reader outcome: the reader can take a robot-drive boundary, state why isolation exists, trace common-mode and differential-mode noise from source through coupling path to victim, allocate operational braking, STO and mechanical holding to different functions, and assemble a safety case whose claim is no broader than its evidence.
- System invariant: a safe drive state is not established by a software command or a single low signal. It exists only when the declared hazard-control function, independent channels, timing, diagnostics, EMC immunity, insulation boundary and lifecycle evidence remain valid under the faults and environmental assumptions used by the machine risk assessment.
- Curriculum boundary: this article owns isolation intent and coordination inputs, isolated gate-power/data behavior, CMTI and parasitic-current reasoning, CM/DM EMC paths, EMC test evidence, STO architecture/timing/diagnostics, and safety-case assembly. It does not issue creepage tables, select a final safety integrity target, certify a machine, size a holding brake, or replace IEC/ISO standards and a competent conformity-assessment process.

## Why this is a separate foundation

| Existing article | Output it already promises | Boundary this article must close |
|---|---|---|
| `robot-power-electronics-motor-driver` | Builds a protected inverter from bus, switches, gate drive, sensing and layout. | A working board does not prove an adequate insulation boundary, EMC behavior or a safety-related torque-off function. |
| `robot-drive-energy-braking-safety` | Gives stop energy a real destination and verifies bus/contactors. | Regenerative braking is an operational energy-control function, not independently a certified STO or a mechanical hold. |
| `robot-motor-drive-foc` | Produces current and torque from PWM. | Setting `i_q=0` or PWM duty to zero remains dependent on the control path and may not remove torque-producing energy. |
| `robot-embedded-realtime-control` | Explains task deadlines, watchdogs and fault escalation. | A diagnostic MCU or watchdog is only part of a safety claim when its independence, coverage, reaction and failure assumptions are proven. |
| `signals-systems-convolution` | Supplies transient, bandwidth and filter intuition. | EMC and STO filters trade noise/pulse rejection against reaction delay and must be tied to measured limits. |
| `reference-ti-tida-010956-2025` | Reconstructs a real 48 V servo inverter. | It does not certify machine STO, final EMC, holding behavior or insulation coordination for the reader's installation. |

## Scope decision

| Topic | Depth | Reason |
|---|---|---|
| Protective, functional and noise-isolation intent | deep comparison | An isolation symbol is not evidence of which hazard, ground loop or level-shift contract it satisfies. |
| Insulation-coordination inputs | deep process, no lookup-table design | Working/transient voltage, overvoltage category, pollution, material, altitude and geometry must be known before creepage/clearance can be justified. |
| Isolated data and gate-power transients | deep | Barrier capacitance, CMTI, propagation delay, UVLO and rail decay connect switching physics to false turn-on and torque removal. |
| Common-mode and differential-mode EMC paths | deep | Noise is a closed current path. Ferrites or filters chosen without source-path-victim reasoning can move rather than solve the problem. |
| Layout, chassis, shield and PE boundaries | deep first principles | Functional ground, chassis and protective earth have different jobs; return geometry controls high-frequency behavior. |
| Emissions and immunity evidence | deep workflow | A passing screenshot without setup, bandwidth, detector, cable, load, margin and uncertainty cannot support deployment. |
| Operational stop, STO, coast and holding | deep allocation | These functions remove different hazards on different time scales and must not be collapsed into one stop button. |
| Dual-channel 1oo2/HFT1 architecture and diagnostics | deep | Independence, stuck faults, common cause, test pulses and diagnostic-test interval determine whether redundancy is real. |
| STO electronics timing versus motion-safe timing | deep | Gate energy can disappear in milliseconds while a loaded joint continues to coast or fall. |
| PL/SIL numeric determination and certified component selection | bounded handoff | Target selection and quantitative reliability require the actual risk assessment, architecture, mission profile, data and current standards. |
| Safety lifecycle and change control | deep evidence contract | A one-time bench result does not survive PCB revision, firmware change, component substitution or production drift automatically. |

## Reader prerequisites

- Electric potential and capacitance: voltage is a potential difference; parasitic capacitance carries current when voltage changes quickly.
- Switching inverter: half-bridge switch node, dead time, bootstrap/isolated gate supply and DC-link path from the power-electronics article.
- Energy stop boundary: negative torque, regenerative power, brake resistor, contactor and mechanical hold from the braking article.
- Signals: frequency response, common/differential decomposition, delay and first-order filtering from the signals curriculum.
- Reliability vocabulary: fault, failure mode, diagnostic coverage, common-cause failure, safe state and mission time are not interchangeable.

## Private hardest transfer problem

Do not publish this compound problem as a quiz. It is the hidden coverage gate. The public article passes only if a reader can derive a defensible solution from the prose, equations, labs and evidence boundaries.

A seven-axis 48 V mobile manipulator uses six PWM inverters in the torso and one vertical lift drive near the battery. The controller designer adds digital isolators to every PWM and SPI line because “isolation is safer,” but does not declare whether the purpose is protective separation, functional level shifting or a noise boundary. Both sides share chassis through oscilloscope earth, USB and encoder cable shields. Barrier creepage was copied from another board without recording working voltage, surge/transient environment, pollution degree, material group, coating, altitude or expected conductive contamination. The selected isolator has an attractive reinforced-isolation label, while the isolated DC/DC transformer, connector spacing and PCB slot have not been checked as one boundary.

The SiC/GaN-like edge-rate option is enabled to reduce switching loss. Switch-node `dv/dt` couples through MOSFET capacitance, motor cable, heat sink, barrier capacitance and encoder cable. Phase-current samples jump during commutation, an encoder occasionally resets, and the gate driver reports a false fault. The team replaces the input capacitor and adds ferrites until the symptom disappears on an open bench. It has not separated CM from DM current, drawn the return loop, measured cable/shield termination, recorded LISN/probe configuration, tested immunity or repeated the test under maximum motor cable, payload and enclosure states. A low-frequency ground diagram is treated as a high-frequency current map.

The safety input has two 24 V channels. Firmware interprets either low channel as “stop,” commands zero torque, sends PWM disable through one shared serial link and applies a motor holding brake after a timer. Both channels share a connector, filter network, logic supply, MCU, clock and PCB route. Short diagnostic pulses from an upstream OSSD are filtered, but the filter delay is absent from the reaction-time budget. A single load switch cuts the primary gate-driver rail while stored secondary energy and bootstrap charge remain. The READY feedback is generated by the same MCU that issues the command. No injected stuck-high, cross-short, supply fault, clock fault or diagnostic-age test exists.

During a vertical-axis stop, STO removes torque but the payload descends before the spring-applied brake develops holding torque. Marketing calls the observed electronics delay the “robot stop time.” The risk assessment instead needs time from sensor demand through input filtering, channel logic, rail decay and gate blocking, plus mechanical coast/fall and brake engagement. The DC link remains energized. A service technician assumes STO means electrically safe to touch. Another team assumes a Cat 0 coast stop is a controlled deceleration. The machine uses a TIDA-01599-derived circuit and cites “SIL3 / PL e” without preserving the reference design's assumptions, revision boundary, diagnostic exclusions or TÜV report scope.

The reader must be able to:

1. Name the hazard and boundary before choosing isolation, and distinguish protective from functional/noise isolation.
2. Explain why a 48 V drive may or may not need galvanic isolation at each interface.
3. Treat all barrier components and PCB geometry as one insulation system rather than inheriting the isolator package rating.
4. Gather working voltage, repetitive peak, transient/impulse, overvoltage category, pollution, material, altitude and environment before consulting current standard tables.
5. Keep creepage, clearance and dielectric barrier meaning separate.
6. Explain why coating or a slot changes only particular paths and does not erase conductive contamination or assembly constraints by assertion.
7. Compute displacement current through barrier/parasitic capacitance from `C dv/dt` and connect it to receiver or gate disturbance.
8. Interpret CMTI as a tested boundary with stated conditions, not as immunity to every common-mode event.
9. Budget channel propagation skew and explain how mismatch can create a transient unsafe switching state.
10. Include isolated supply UVLO, rail decay, Miller current and stored gate energy in false-turn-on/turn-off reasoning.
11. Draw high-frequency common-mode current as a closed return path through cable, frame, shield, PE/chassis and parasitics.
12. Decompose measured conductor currents into common and differential components with an explicit current-direction convention.
13. Distinguish source, coupling path and victim before adding a filter or slowing an edge.
14. Explain why reducing loop area attacks magnetic coupling while reducing `dv/dt` or capacitance attacks displacement current.
15. Separate functional ground, chassis and protective earth roles and avoid a universal one-point-ground slogan at high frequency.
16. Treat shield termination as a frequency- and geometry-dependent current-path decision, not a decorative wire.
17. Explain filter resonance, damping, saturation, leakage and control-loop interaction before selecting an LC value.
18. Build an emission/immunity evidence record containing setup, cable, load, mode, detector/bandwidth, limit, uncertainty and margin.
19. State that pre-compliance diagnosis and accredited compliance evidence serve different decisions.
20. Allocate controlled stop, STO/coast, mechanical hold, DC-link discharge and safe access as separate functions.
21. Explain why STO prevents torque-producing power but neither actively brakes nor proves zero motion, zero bus voltage or vertical holding.
22. Derive a system reaction-time budget that ends at the hazard-safe condition rather than READY-bit transition.
23. Explain a dual-channel 1oo2/HFT1 path and show which single faults must lead to safe state or timely detection.
24. Reject two channels that share an unanalysed single point or common-cause path.
25. Interpret OSSD/test pulses alongside minimum valid-pulse and filter-delay constraints without allowing an unclassified intermediate pulse width.
26. Distinguish diagnostic coverage from diagnostic frequency and include diagnostic-test interval in fault accumulation.
27. Treat feedback generated by the same command path as correlated evidence unless independence is justified.
28. Build a fault-injection matrix for stuck high/low, cross-short, supply loss, load-switch failure, rail decay, clock/MCU loss and stale diagnostics.
29. Separate TIDA-01599 target claims from its excluded quantitative analysis, external assumptions, MCU/software scope and final integration duties.
30. Preserve the difference between the revision used for shown measurements and the later public reference revision.
31. Read the TÜV report as a concept assessment whose final architecture, diagnostics, DTI, integration and safety lifecycle remain system-owner work.
32. Assemble a safety case whose claim is the intersection of requirements, architecture, diagnostics, test evidence, production control and lifecycle evidence.

## Source, intent and boundary ledger

| Source locator | Original purpose and claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| IEC 61800-5-1:2022, including current corrigenda listed by IEC | Product safety requirements for adjustable-speed electrical power drive systems covering electrical, thermal, fire, mechanical and energy hazards. | The purchased standard contains the normative tables and conditions. A blog must not fabricate final creepage/clearance values or replace product evaluation. | Establish which insulation inputs must exist and why the whole boundary matters. | Input-readiness lab with no copied proprietary tables; link to current IEC source. |
| IEC 61800-3:2022, including COR1:2025 | EMC requirements and test methods for power drive systems and machine tools. | Passing a board-level bench check does not prove the installed machine, cable and enclosure configuration. | Ground the emissions/immunity evidence distinction and installation boundary. | Source-path-victim and evidence-ledger labs. |
| IEC 61800-5-2:2016 | Functional-safety requirements for safety-related power drive systems in the IEC 61508 framework. | It does not perform the machine risk assessment or prove the reader's architecture. | Anchor STO as one declared safety function and separate drive response from machine motion. | Function-allocation and timing labs; no self-issued SIL claim. |
| ISO 13849-1:2023 | Methodology and requirements for safety-related parts of control systems, including software. | Target PL/category and quantitative validation depend on the actual machine and current normative process. | Keep current machine-control-system context visible. | Standards boundary panel and safety-case lifecycle. |
| TI TIDA-01599 design guide, TIDUDS9B, Dec. 2017 revised Nov. 2022 | Dual-channel, de-energize-to-trip STO reference architecture; gives assumptions, truth table, test-pulse behavior and measured response examples. | A concept reference design is not final system certification. Quantitative analysis, MCU/software, PCB common cause, some supplies/protections and final diagnostics remain out of scope or assumed. | Reconstruct a real architecture without converting its headline targets into a blanket product claim. | Dedicated company-reference article with architecture, assumptions, diagnostics, timing, revision and TÜV evidence selectors. |
| TÜV report TF97657T Rev. 1.1, 9 Feb. 2022 | Concept review of the TIDA-01599 architecture and block FMEA; finds the architecture generally capable of supporting intended use. | Functional-safety management, final integration, self-tests/diagnostic effectiveness and final DTI require end-user evaluation. Its ISO 13849 basis is the historical 2015 edition. | Teach how to read an assessor report for what was and was not assessed. | Scope ledger with “evidence / assumption / end-user work” states. |
| TI SLVA959B, motor-driver board layout guidance | Explains CM/DM noise and how high-current return-loop area affects emissions and coupling. | Layout guidance is not an EMC pass certificate and component examples do not transfer numerically. | Connect inverter commutation to physical return geometry. | Interactive CM/DM path and loop-area lab. |
| TI isolated-gate-driver/CMTI technical material | Explains isolated gate-drive architecture, transient coupling and CMTI behavior. | Datasheet CMTI conditions and device-specific behavior must be checked; a ratio in this article is a design-screening margin, not a standard compliance metric. | Ground barrier-current and transient-margin intuition. | Barrier transient lab with explicit tested-condition boundary. |

## Full-scope map

| Topic | Must prove | Depth | Section | Risk if omitted |
|---|---|---|---|---|
| Contract separation | isolation, EMC, braking, STO, hold and safe access answer different questions | deep | 01 | reader treats one label as universal safety |
| Coordination inputs | geometry cannot be selected before electrical/environmental classification | deep | 02 | copied spacing becomes false assurance |
| Barrier transient | parasitic current, CMTI, skew and rail state connect edge rate to failure | deep | 03 | isolation symbol hides dynamic coupling |
| CM current | high-frequency current must return through a physical loop | deep | 04 | random filters and ground changes |
| Coupling/mitigation | source-path-victim maps intervention to mechanism | deep | 05 | symptom suppression replaces design |
| EMC evidence | setup and uncertainty bound the claim | deep | 06 | one screenshot becomes compliance claim |
| Function allocation | operational stop, STO, hold and access are separate | deep | 07 | falling/coasting axis called safe |
| Redundancy | independence, diagnostic coverage, DTI and CCF make 1oo2 meaningful | deep | 08 | duplicated labels hide one failure path |
| Timing | electronics response and hazard cessation use different clocks | deep | 09 | READY time mislabeled stop time |
| Safety case | claim is no stronger than weakest evidence set | deep | 10 | prototype evidence silently becomes product claim |
| Company evidence | TIDA/TÜV assumptions, revision and exclusions remain visible | deep | reference | vendor headline becomes certification |

## Cross-section narrative

1. Start with the hazard and function contract, before showing a circuit.
2. Build the static insulation boundary, then disturb it with switching transients.
3. Follow the transient current out through the full machine and learn to classify/measure it.
4. Move from electromagnetic integrity to control integrity: define which stop function is actually needed.
5. Open the dual-channel architecture, expose its shared causes and timing, then close with lifecycle evidence.
6. Only after the concepts are stable, reconstruct TIDA-01599/TÜV as a bounded example of evidence transfer.

## Section and Viz contracts

### 01. SafetyContractBoundaryLab -- what claim are we trying to prove?

- Concept: drag/select a hazard (`touch`, `false switching`, `uncommanded torque`, `coast/fall`, `stored bus`) and show which mechanism can and cannot control it.
- Required states: protective isolation, functional/noise isolation, EMC integrity, controlled braking, STO, mechanical hold, discharge/safe access.
- Visible invariant: no single function receives all green checks.
- Failure gate: selecting STO must leave motion, holding and DC-link-energy badges unresolved.
- Responsive rule: desktop uses a two-column claim/evidence matrix; mobile recomposes as one selected-hazard stack, never a compressed grid.

### 02. InsulationCoordinationLab -- when is a spacing answer even ready?

- Inputs: working/repetitive voltage, transient/impulse, category/environment, pollution, material, altitude, coating/slot state and boundary components.
- Execution: classify inputs -> reveal missing fields -> trace clearance, creepage and solid-insulation paths separately -> permit “consult current normative table” only when inputs are complete.
- Design insight: the lab never emits a universal millimetre answer. It proves input completeness and boundary continuity.
- Failure modes: isolated IC rated but DC/DC/connector/PCB path incomplete; contamination; altitude correction absent; measurement reference ambiguous.

### 03. IsolationBarrierTransientLab -- why does galvanic isolation still pass a transient current?

- Controls: barrier capacitance, switch-node edge rate, receiver CMTI, channel propagation delays, isolated-rail decay and UVLO.
- Visible data: barrier displacement-current pulse, CMTI screening ratio, channel skew, gate-enable timeline.
- Failure modes: false receiver transition, Miller turn-on, unequal channel removal, secondary rail held above UVLO.
- Boundary: the CMTI ratio is an engineering screening signal, not a compliance or safety-integrity metric.

### 04. CommonModeCurrentLab -- where does the current close its loop?

- Controls: cable length, equivalent capacitance, edge rate and shield termination.
- Visible flow: bridge switch node -> motor/cable/frame -> shield/PE/chassis/parasitics -> DC link.
- Compare: both conductors same direction for CM; opposing directions for DM; show probe placement and sign convention.
- Failure gate: opening the intended shield path must not make current disappear; it moves into less controlled parasitic paths.

### 05. EmcCouplingLab -- which intervention acts on source, path or victim?

- Controls: selected symptom and mitigation (`edge rate`, `loop area`, `shield/chassis`, `CM choke`, `DM filter`, `receiver filtering`).
- Visible effect: mechanism-specific score, loss/delay/leakage/resonance trade-off and unresolved path.
- Required comparison: `dv/dt`/capacitance for electric coupling; loop area/current for magnetic coupling; input filtering/immunity for victim.
- Failure modes: LC resonance, choke saturation, PE leakage, control-loop phase loss, filter after the coupling point.

### 06. EmcEvidenceLab -- what does a trace actually prove?

- Evidence fields: mode, operating point, PWM/edge state, cable/load/enclosure, instrument/probe or LISN, bandwidth/detector, frequency band, limit, uncertainty, margin and immunity acceptance criteria.
- Interaction: omit one field and watch claim shrink from deployment evidence to exploratory observation.
- Visible comparison: pre-compliance diagnosis, formal emission test and immunity test are distinct rows.
- Failure gate: a positive raw margin that becomes negative after measurement uncertainty must fail.

### 07. SafetyFunctionAllocationLab -- what must stop, and what must remain held?

- Scenarios: horizontal base, free-spinning arm, vertical payload, service access and DC-bus maintenance.
- Functions: controlled deceleration, STO/coast, spring-applied holding brake, contactor/discharge and verification.
- Visible timeline: command -> torque trajectory -> STO -> brake engagement -> zero motion -> bus below access threshold.
- Failure gate: vertical axis with STO and no proven hold remains hazardous; controlled stop without independent torque removal remains a different contract.

### 08. DualChannelDiagnosticLab -- when are two wires truly redundant?

- Architecture: channels A/B, separate input/filter/logic/switch paths, shared connector/supply/clock/MCU choices and feedback.
- Fault injection: stuck high/low, A-B cross-short, shared supply loss, load-switch short, stale diagnostic, MCU/clock loss.
- Visible results: safe state, detected within interval, dangerous undetected, common-cause exposure.
- Evidence: 1oo2/HFT1 is structural language; PL/SIL still needs reliability, coverage, CCF and lifecycle evidence.

### 09. StoTimingLab -- which clock ends at the hazard?

- Electronics chain: input recognition -> pulse filter -> channel logic -> load switch -> isolated-rail decay -> gate off.
- Machine chain: gate off -> motor coast/gravity -> mechanical-brake engagement -> motion-safe confirmation.
- Controls: pulse width, filter delay, rail decay, inertia/load and brake delay.
- Failure gate: reject/unclassified pulse band is visible; electronics READY cannot label itself total stop time.
- Evidence overlay: mark TIDA measured examples as board/revision-specific observations, not universal limits.

### 10. SafetyCaseCommissioningLab -- how does evidence survive deployment and change?

- Layers: requirements/risk, architecture/FMEA, component assumptions, diagnostics/DTI, fault injection, insulation/EMC, integration, production and lifecycle/change.
- Interaction: select a PCB revision, firmware change, alternate isolator or new cable; invalidate affected evidence and show required re-test/re-analysis.
- Visible invariant: deployable claim is the intersection of all current evidence layers.
- Final handoff: animation is deferred until these static causal states pass responsive and content QA across the curriculum.

## Formula contract

Every display formula must render through `MathFormula`, contain short Korean `\text{}` annotations where the grouping itself needs explanation, and be followed immediately by one `FormulaNote`. Long formulas must recompose or split on mobile; CSS scaling is a last bounded fallback, never the primary layout.

| Formula | Purpose and Korean annotation |
|---|---|
| `V_{work}=\max_t\lvert V_P(t)-V_S(t)\rvert` | 실제 barrier 양단의 지속/반복 potential difference; annotate `절연 장벽 양단`. |
| `i_{barrier}=\underbrace{C_{barrier}}_{기생 결합}\underbrace{dv_{cm}/dt}_{전압 변화율}` | galvanic isolation does not remove displacement current. |
| `M_{CMTI}=\underbrace{CMTI_{min}}_{검증된 한계}/\underbrace{|dv_{cm}/dt|_{max}}_{예상 최대값}` | screening ratio with explicit non-standard-metric note. |
| `\Delta t_{skew}=\max(t_{pd,k})-\min(t_{pd,k})` | channel timing mismatch. |
| `i_{cm}=\underbrace{C_{eq}}_{전체 귀환 결합}\underbrace{dv_{sw}/dt}_{스위칭 자극}` | whole-machine CM pulse. |
| `|I_{cm}(f)|=2\pi f C_{eq}|V_{cm}(f)|` | frequency-domain capacitor-current intuition. |
| `i_{cm}=(i_1+i_2)/2`, `i_{dm}=(i_1-i_2)/2` | measured-current decomposition with sign convention. |
| `m_{loop}=\underbrace{I}_{루프 전류}\underbrace{A}_{루프 면적}` | first-order magnetic coupling intuition, not full-field prediction. |
| `f_0=1/(2\pi\sqrt{LC})` | filter resonance that requires damping/parasitic/load analysis. |
| `M_{dB}=\underbrace{L_{limit}}_{허용 한계}-\underbrace{L_{meas}}_{측정 최대}-\underbrace{U}_{측정 불확도}` | conservative EMC margin. |
| `D_{system}=(D_A\cap D_B)\cup D_{CCF}` | conceptual dangerous-failure set; no independence probability invented. |
| `DC=\lambda_{DD}/(\lambda_{DD}+\lambda_{DU})` | detected dangerous share; frequency alone is not coverage. |
| `t_{STO}=t_{input}+t_{filter}+t_{logic}+t_{switch}+t_{rail}+t_{gate}` | electronics torque-removal chain. |
| `t_{motion-safe}=t_{STO}+t_{coast\;or\;hold}` | the machine hazard ends later than electronics response. |
| `t_{detect}\le T_{DTI}+t_{monitor}` | accumulated-fault detection bound, with architecture-specific caveat. |
| `C_{deploy}=C_{req}\cap C_{arch}\cap C_{diag}\cap C_{test}\cap C_{life}` | claim strength is intersection of evidence, not sum of badges. |

## Company-reference reconstruction contract

- Article slug: `reference-ti-tida-01599-sto-2022`.
- Primary artifact: TIDA-01599 design guide `TIDUDS9B`, public Rev. B (Nov. 2022).
- Assessment artifact: TÜV report `TF97657T`, Rev. 1.1 (9 Feb. 2022).
- Required explorer views:
  1. Architecture: STO_1 removes primary logic supply; STO_2 removes the isolated secondary supply path; active-low/de-energize-to-trip; MCU diagnostics outside the safety path.
  2. Assumptions: protected supplies, pulse-width contract, secondary-rail decay assumption, temperature sensing requirement, quantitative-analysis and PCB/common-cause exclusions.
  3. Truth/diagnostics: channel combinations, feedback states, single-fault behavior, HFT1 limit and dual-dangerous-fault boundary.
  4. Timing evidence: 2.7 ms, 7.4 ms and 1.52 ms examples plus 1 ms rejection/100 us diagnostic-pulse observations, each labeled by test configuration and not generalized.
  5. Revision boundary: displayed tests identify Rev. E1.0 while the public design is E2.1; summarize major architectural changes without merging evidence across revisions.
  6. TÜV scope: concept review, historical standards basis, architecture suitability, and the final user's integration/diagnostics/DTI/FSM/lifecycle duties.
- Required statement: “generally suitable/capable of supporting” is not “the reader's machine is SIL3/PL e certified.”
- No schematic screenshot is used as the primary teaching visual. Redraw the functional blocks and preserve traceable source-page labels.

## Prose and visual design contract

- Start each section with one concrete causal question, then answer it through a lab state before expanding the terminology.
- Use a restrained multi-role palette: blue for command/data, teal for verified safe/return path, amber for assumption/delay, red for unresolved hazard, violet only for measurement/evidence. Color is never the sole state cue.
- Use thin 1 px connectors, rounded joins, quiet surfaces and short labels. Avoid thick arrows, long centered text inside shapes and decorative empty regions.
- Cards stay at `rounded-md` or less and are not nested as floating cards. Repeated evidence items may be cards; page sections remain unframed.
- At 360/390 px, every lab becomes a single-column causal sequence. No inner horizontal scroll, miniature desktop canvas or clipped SVG label is allowed.
- At 768/1440 px, use stable grid tracks and aspect ratios; dynamic labels or error states cannot resize the whole lab.
- Every SVG gets `role=img`, a specific Korean/English accessible name and label-safe padding. Prefer HTML layout for dense text/evidence.
- Interactions must change an observable causal state and a status/evidence conclusion. Decorative toggles do not count.
- Static states ship first. Motion is added only after the entire curriculum's content and responsive composition pass; animation must respect reduced motion and never become the only explanation.

## 4B/9B replay packet

The authoring record must keep small-model work narrow and auditable:

1. `scope packet`: title, prerequisites, ownership boundary and ten public questions.
2. `source packet`: one source at a time with artifact identity, page anchors, claims, assumptions and prohibited transfer.
3. `reasoning packet`: four to six hidden premises from the private problem, each mapped to public prose/equation/Viz/evidence.
4. `section packet`: one section contract, formula rows and a maximum of two neighboring handoffs.
5. `viz packet`: state variables, controls, derived values, failure status, mobile composition and acceptance checks.
6. `critic packet`: search for overclaim, missing unit/sign, unproven independence, English formula annotations, clipping and claim/evidence mismatch.
7. `integration packet`: metadata, curriculum graph, previous/next links and source update date.

The model never receives “write the whole article” as one task. A deterministic validator checks packet fields, formula-note parity, source identity, hidden-premise coverage and responsive QA results before packets are merged.

## Completion checks

- All 32 hidden premises map to public prose, Korean-annotated formula, lab observable, evidence gate or explicit boundary.
- Ten concept labs and the six-view TIDA/TÜV explorer exist and expose causal failure states.
- Every display formula has exactly one adjacent `FormulaNote`; raw `\theta`-style source text never leaks into the rendered page.
- Every `\text{}` annotation is Korean unless it is a formal symbol/acronym that cannot be translated without changing meaning.
- STO is never described as active braking, zero speed, holding, DC-link discharge or touch-safe isolation.
- No PL/SIL claim is inferred from a vendor headline, block architecture or concept-assessment report.
- Mobile 360/390, tablet 768 and desktop 1440 have no page overflow, inner scroll, clipped label, formula escape or post-font-load downscale below the accepted floor.
- Interaction tests cover at least one safe and one unsafe state per lab and all explorer views.
- Local build, focused Playwright QA, visual screenshots, public deployment, HTTP 200 checks and public QA all pass.
- The run JSON/report records sources, intent, rejected transfers, implementation decisions, exact checks and next milestone for later 4B/9B replay.
