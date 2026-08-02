# Robot Structural Mechanics, Materials, Fatigue & Thermal Design content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 책상 밖으로 길게 내민 자가 더 쉽게 휘는 장면에서 시작한다.
- `FBD`, `stress`, `buckling`, `fatigue`보다 먼저 힘의 길, 휘어짐과 파손의 차이, 실물 확인의 세 단계를 보여 준다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal
- Actuator output의 force and moment를 실제 link, housing, shaft, fastener and interface의 load path로 내리고, strength·stiffness·fatigue·mode·temperature를 서로 다른 failure gate로 계산한다.
- Hand calculation, FEA and physical test가 같은 claim을 중복하는 것이 아니라 서로 다른 model-risk를 닫는 evidence chain임을 증명한다.

## Reader contract
- 본문에는 정답 맞히기용 문제가 등장하지 않는다.
- 작성자는 아래 private transfer problem을 먼저 풀고 premise별 coverage를 감사한다.
- 독자는 article만 읽은 뒤 unseen geometry에서도 free-body diagram, critical section, load cycle, thermal state와 validation evidence를 스스로 선택할 수 있어야 한다.

## Private hardest transfer problem

6-axis robot의 shoulder joint를 설계한다. 1.1 m aluminum link 끝에 32 kg payload가 있고 link mass는 18 kg이다. Joint output bearing 뒤 housing은 machined 6061-T6, bracket은 7075-T6, shaft와 M10 bolts는 steel이다. Normal cycle은 horizontal reach, acceleration, contact, reverse and dwell을 포함하며 하루 28,000회 반복한다. Emergency stop은 rated output torque의 2.1배를 70 ms 동안 만들고, motor/drive heat 때문에 housing의 bearing seat는 ambient보다 48 K 높다. One-side fan failure 때 axial gradient가 생긴다. FEA에는 bolt-hole edge와 fixed boundary에서 sharp stress peak가 보이고, first measured mode는 analytical beam estimate보다 22% 낮다.

다음 판단을 한 번에 닫는다.

1. Payload force를 bearing reference plane과 housing fastener group까지 옮기는 free-body diagram을 만든다.
2. Link root의 axial, shear, bending and torsional resultants를 같은 coordinate and sign convention으로 적는다.
3. Nominal stress와 local notch stress를 구분하고 yield margin에 어느 것을 쓸지 설명한다.
4. Deflection and tool-point error가 allowable stress보다 먼저 설계를 제한할 수 있는지 판단한다.
5. Section height를 늘리는 것과 wall thickness를 늘리는 것이 area, second moment and mass에 미치는 차이를 설명한다.
6. Combined normal and shear stress에서 principal/von-Mises screen을 선택한다.
7. Slender cover or link segment의 buckling load와 imperfection sensitivity를 분리한다.
8. Bolt preload가 external tensile cycle 중 bolt alternating stress를 줄이는 조건과 joint slip/gap failure를 계산한다.
9. Torque wrench setting을 exact preload로 취급하지 않고 friction scatter evidence를 요구한다.
10. Mission history를 reversals로 바꾸고 mean/amplitude, S-N data condition, rainflow and cumulative damage를 연결한다.
11. Miner sum이 1보다 작다고 safe-life가 증명되지 않는 이유를 load order, spectrum omission, scatter and notch 상태로 설명한다.
12. Static stiffness matrix or beam estimate가 first flexible mode and controller bandwidth와 어떻게 연결되는지 설명한다.
13. FEA의 mesh convergence가 singular peak를 반드시 수렴시키지 않는 이유와 stress linearization/structural hot spot/energy/force balance 중 어떤 evidence를 쓸지 선택한다.
14. Steel bolt와 aluminum members의 differential expansion이 preload를 늘리거나 줄이는 방향을 계산한다.
15. Temperature field를 single maximum temperature가 아니라 conduction path and thermal resistance network로 만든다.
16. Strain gauge, displacement, hammer/modal and thermocouple tests가 각각 어떤 model parameter를 식별하는지 계획한다.
17. Test result가 model과 다를 때 material property만 tuning하지 않고 boundary, contact, preload, damping, geometry and sensor chain을 순서대로 의심한다.

## Private premise gate

| IDs | Premises the article must make usable | Gate |
|---|---|---|
| S01-S04 | system boundary, coordinates, load cases, free-body equilibrium | Reader can move loads without double-counting reactions |
| S05-S08 | traction, normal/shear stress, strain, Hooke/Poisson scope | Reader separates force, stress, strain and displacement |
| S09-S12 | axial stiffness, beam bending stress, second moment, deflection | Reader sees why stiffness and strength scale differently with geometry |
| S13-S15 | torsion, polar moment, combined stress | Reader screens a shaft/link under multi-axis load |
| S16-S18 | stress concentration, yield/ultimate margins, material allowables | Reader does not turn handbook Kt or coupon yield into installed proof |
| S19-S20 | Euler buckling and imperfection/boundary conditions | Reader does not use tensile strength to clear slender compression |
| S21-S25 | bolt preload, joint/bolt stiffness, slip, separation, load introduction | Reader distinguishes preload, external load share and interface failure |
| S26-S31 | stress cycle, S-N, mean stress, rainflow, Miner, sequence/scatter limits | Reader can construct and criticize a fatigue screen |
| S32-S34 | modal stiffness/mass, damping/excitation, controller coupling | Reader distinguishes static deflection from dynamic amplification |
| S35-S38 | FEA idealization, convergence, singularity, correlation | Reader treats color contours as model output, not evidence by themselves |
| S39-S42 | conduction/resistance, free thermal expansion, constrained stress, CTE/preload | Reader links temperature field to geometry and fastener state |
| S43-S46 | strain/displacement/modal/thermal test, uncertainty and revision | Reader closes each design claim with a matched physical measurement |

## Source anchors

| Area | Source | Why it matters | Boundary |
|---|---|---|---|
| Fastener design | NASA RP-1228, Barrett, 1990, pp. 15-25 | Preload, fatigue loading, torque scatter, combined load, thermal cycling | Legacy guidance; exact current standard and material allowables remain external |
| Current bolted-joint mechanics | NASA/TM-20250005284, Ramsey, May 2025, main text pp. 1-38 and appendices A-J | Load path, SBLIF, stiffness factor, thermal load, FEA and experiment comparison | Pure tensile PBJ focus; not an all-joint design standard |
| Cumulative fatigue foundation | NASA TN D-3839, Manson, Freche & Ensign, 1967, all 41 PDF pages | Load-order failure of linear damage and two-phase alternative | Smooth 1/4-inch specimens, limited materials/two-level evidence |
| Fatigue terminology | NBS Special Publication 702 | S-N, fatigue life, mean and alternating stress vocabulary | Vocabulary and historical practice, not product allowables |
| Tool boundary | Ansys Mechanical 2026 R1 fatigue documentation | Stress-life/strain-life, rainflow, damage outputs used in current tools | Software capability is not validation or material-data quality proof |

## Source-processing record
- `nasa-preloaded-bolt-2025.pdf`: 112 PDF pages. Main report pp. 1-38; nomenclature and appendices A-J pp. 39-103. Text extracted with `pypdf`; mechanism figures visually inspected with `pypdfium2` contact sheets.
- `manson-double-linear-damage-1967.pdf`: 41 PDF pages. Every page inspected through extracted text and contact sheets, including tables and appendices A-C.
- `nasa-fastener-design-manual-1990.pdf`: 100 PDF pages. Main narrative pp. 1-35 inspected, especially PDF pp. 19-25; later appendices are legacy allowables and are not copied as current design data.
- Miner 1945 was deliberately not selected as the standalone paper because the publisher PDF was not publicly auditable in this environment. Its DOI and abstract establish history only; no inaccessible detail is reconstructed.

## Full-scope map

| Topic | Must cover | Depth | Source anchor | Risk if omitted |
|---|---|---|---|---|
| Load path | FBD, equilibrium, reference plane, worst pose and event matrix | deep | concept derivation | Stress is computed from the wrong force or lever arm |
| Stress and strain | normal/shear traction, epsilon, E, nu and units | deep | mechanics fundamentals | Force, stress and displacement become interchangeable words |
| Section mechanics | A, I, J, c, bending/torsion, section geometry scaling | deep | concept derivation | Mass is added where geometry would be more effective |
| Deflection | axial/bending/torsional compliance in series | deep | concept derivation | Strength passes while pose accuracy and mode fail |
| Combined failure | principal/von Mises, yield vs ultimate, FoS/allowable | deep | material data boundary | A scalar contour is accepted without failure theory or condition |
| Buckling | Euler screen, effective length, imperfection | medium | concept derivation | Slender compression part is cleared by yield alone |
| Bolted joints | preload, stiffness share, slip, separation, group moment, thermal load | deep | RP-1228 and TM-20250005284 | Bolt size is selected from direct tension alone |
| Fatigue | cycle definition, mean/amplitude, S-N, rainflow, Miner and limitations | deep | Manson 1967 and NBS SP-702 | Peak/RMS replaces actual lifetime reasoning |
| Structural dynamics | mode, damping, excitation, controller separation | deep | concept/system ID | Static FEA is mistaken for dynamic robustness |
| FEA | boundary/contact/mesh/material, singularity and correlation | deep | TM-20250005284 pp. 34-38 | Pretty contour becomes self-validating evidence |
| Thermal | heat path, Rth, expansion, constrained stress and CTE mismatch | deep | RP-1228 p. 15 and TM appendix E | Maximum component temperature is checked while alignment/preload drifts |
| Materials/process | density, E, yield, fatigue, temperature, direction/process | medium | material allowables boundary | Marketing material name replaces lot/process/environment data |
| Evidence | strain, deflection, mode, temperature, preload and revision loop | deep | paper/source evidence | Model discrepancy is hidden by parameter tuning |
| Fracture/composites | crack-growth/damage tolerance, laminate failure | defer | dedicated next layer | A brief paragraph would create false competence |

## Narrative sequence

1. Start at the actuator output and create a load-case ledger before any stress equation.
2. Cut the structure. Force/moment resultants become stress through section geometry.
3. Integrate strain to recover deflection. Show strength and stiffness as separate gates.
4. Combine bending/torsion, notch and buckling to expose local and stability failures.
5. Replace the “bolt carries the load” cartoon with preload, interface friction, load introduction and separation.
6. Turn mission time history into fatigue cycles; teach linear damage and its order-effect failure.
7. Move from static compliance to modes, then use FEA only after the hand-model invariants are explicit.
8. Add temperature as a field that changes dimension, preload, material property and alignment.
9. End with matched evidence and revision, not with a green simulation status.

## Section plan

### 01 Load cases and free-body diagram
- Question: Which pose/event creates the critical load at each interface?
- Variables: `F`, `M=r×F`, gravity, inertia force, contact, braking impulse, reference plane.
- Failure modes: missing reaction, mixing static and dynamic factors, using one worst case for every failure mode.
- Viz: pose/load selector; move payload and event, see bearing/housing force and moment change independently.

### 02 Stress, strain and constitutive scope
- Question: How does a resultant become local material response?
- Equations: `sigma=F/A`, `epsilon=Delta L/L`, `sigma=E epsilon`, `tau=V/A` only as average.
- Failure modes: peak shear from average formula, nonlinear/plastic/anisotropic use outside scope.
- Viz: force -> area -> stress -> strain -> displacement causal chain with units.

### 03 Geometry, bending and deflection
- Question: Why can moving material away from neutral axis beat simply adding area?
- Equations: `sigma=Mc/I`, `I` and `delta=FL^3/(3EI)` for a declared cantilever case.
- Failure modes: wrong support/load, ignoring shear deflection/joint compliance.
- Viz: section height/wall slider with mass, stress and deflection traces.

### 04 Torsion and combined loading
- Question: Which scalar comparison is valid when normal and shear coexist?
- Equations: `tau=Tr/J`, `sigma_vm=sqrt(sigma^2+3tau^2)` for plane stress special case.
- Failure modes: applying ductile von Mises to brittle/laminated failure without qualification.
- Viz: bending/torsion sliders; stress element and yield envelope.

### 05 Concentration, allowables and buckling
- Question: Does the largest contour or yield stress decide the design?
- Equations: `sigma_local=Kt sigma_nom`, margin and Euler load.
- Failure modes: Kt double-counting, fatigue Kf=Kt assumption, unsupported effective length, local bearing/tear-out.
- Viz: notch radius and slenderness explorer with separate yield/buckling gates.

### 06 Preloaded joints
- Question: What does preload protect, and when does the interface lose that protection?
- Equations: `Delta Fb=C P`, `C=Kb/(Kb+Kj)` as simple baseline; friction/slip; gap; NASA SBLIF extension.
- Failure modes: torque=preload, preload too low/high, prying, load-plane geometry, differential CTE.
- Viz: bolt/member spring paths with load introduction position, preload, slip and separation state.

### 07 Mission spectrum and fatigue
- Question: Why is one emergency peak not enough to predict life?
- Equations: mean/amplitude, S-N lookup, `D=sum n_i/N_i`, mean-stress boundary.
- Failure modes: omitted small cycles, wrong surface/notch/environment, load order, scatter.
- Viz: time history -> rainflow pairs -> damage ledger; reorder blocks without changing Miner sum and expose prediction limitation.

### 08 Modes and excitation
- Question: Why can a statically stiff part still ring inside the control band?
- Equations: `omega_n≈sqrt(k_eq/m_eq)`, damping ratio and separation margin as screening only.
- Failure modes: boundary stiffness, joint damping, local modes, harmonic crossings.
- Viz: stiffness/mass/boundary slider and excitation spectrum overlay.

### 09 FEA as a falsifiable model
- Question: Which result should converge, and which sharp-corner stress cannot?
- Inputs: geometry idealization, contact/preload, mesh, material, boundary, load path.
- Checks: reaction balance, deformation shape, energy, mesh study away from singularity, hand-model bracket, test correlation.
- Viz: mesh refinement changes peak and structural stress differently; evidence ladder controls claim status.

### 10 Thermal field, expansion and joint state
- Question: How does heat become angle error, stress and preload drift?
- Equations: `Qdot=Delta T/Rth`, `Delta L=alpha L Delta T`, `sigma_th=E alpha Delta T` only for full restraint, differential CTE joint load.
- Failure modes: one-node temperature, assumed full/free restraint, temperature-dependent E/yield ignored.
- Viz: heat-source/cooling/material pairing; temperature gradient, tip drift and bolt preload direction.

### 11 Evidence closure
- Question: What measurement can actually falsify each model layer?
- Evidence: load cell/torque, strain rosette, dial/laser displacement, modal impact, thermocouples/IR, bolt tension/preload, teardown.
- Failure modes: calibration/time alignment, fixture stiffness, sensor self-heating, tuning one parameter to fit all modes.
- Viz: select discrepancy and inspect likely cause order plus next measurement.

## Formula contract
- Every display equation gets exactly one adjacent `FormulaNote`.
- Every `\text{...}` inside KaTeX is Korean.
- Equations with many explanations are split into aligned causal groups for 360 px; acceptance scale must remain at least `0.82` without horizontal scroll.
- Formula notes state model class, units, reference plane, assumptions and why the operation is used.

## Viz design contract
- Use white/black neutral structure with sparse blue, teal, amber and red semantic states.
- No generic node-arrow dumps. Geometry or plot must change when a control changes.
- Controls stack on mobile; SVG uses stable `viewBox` and `preserveAspectRatio`, while all labels remain inside bounds.
- Use thin 1-2 px structural lines, restrained fills below 8% opacity, 4-6 px radii and direct labels.
- Every lab has one visible physical invariant and one failure state. Motion is deferred until the static causal state is complete.
- No inner horizontal/vertical scrolling at 360, 390, 768 and 1440 px.

## Paper/source bundle

### Current research reconstruction: NASA/TM-20250005284 (2025)
- Read all 112 PDF pages; distinguish report page number from PDF page number.
- Reconstruct traditional stiffness factor, SBLIF, GLIF, thermal load, FEA extraction and experiment comparison.
- Preserve the result that SBLIF can be more accurate yet unconservative when stiffness approximations are wrong.
- Do not turn one pure-tension joint report into universal bolted-joint certification.

### Foundational paper reconstruction: Manson, Freche & Ensign, NASA TN D-3839 (1967)
- Read all 41 PDF pages including tables and appendices.
- Start from Miner's order-independent linear sum, then reconstruct the two-phase/double-linear intent.
- Preserve original equations `(Delta N)_f=14N_f^0.6` and `N_0=N_f-(Delta N)_f` as specimen-bound proposal, not universal law.
- Explain the later alternative experimental Phase I/II view and its limited verification.
- Preserve authors' explicit limit: smooth 1/4-inch specimens, limited materials and two-level histories.

## Acceptance gate
- All 46 premises map to prose, formula, Viz or explicit defer boundary.
- Concept has at least 10 causal labs and 18 annotated display formulas.
- Current source has at least 6 evidence states and paper has at least 6 evidence states.
- Source URLs, dates, document IDs and page boundaries are visible.
- Browser QA checks formula/note parity, raw LaTeX, English `\text{}` annotations, viewport overflow, inner scroll, console errors and all interactive state changes.
- Local build, connected robotics regression and public-host QA pass before status is complete.

## 4B/9B replay packets
- 4B: one premise, one source page slice, one equation, one Korean annotation set, one failure and one acceptance selector.
- 9B: one full causal section or source evidence state with prerequisites, question, misconception, bounded claims, derivation order, counterexample, Viz contract and critic checklist.
- Orchestrator retains private-problem construction, multi-source conflict, cross-section terminology, responsive QA, deployment and provenance.
