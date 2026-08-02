# Robot Contact Mechanics, Tribology, Lubrication, Wear & Seals content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 마른 손과 기름 묻은 손으로 유리컵을 미는 차이에서 시작한다.
- `Hertz`, `EHL`, `Hamrock-Dowson`보다 먼저 무엇이 닿는지, 압력과 기름막, 시간에 따른 열·마모 변화를 설명한다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal
- Actuator mechanics가 남긴 bearing force, gear torque, speed, duty and environment를 `contact geometry -> pressure/deformation -> surface/film state -> friction/heat -> damage -> sealing/contamination -> evidence`로 변환한다.
- Friction coefficient, catalog bearing life and grease name을 독립 입력으로 두지 않고 서로 되먹임되는 surface-life state로 재구성한다.

## Reader contract
- 본문에는 정답 맞히기용 문제가 등장하지 않는다.
- 작성자는 아래 private transfer problem을 먼저 풀고 premise별 coverage를 감사한다.
- 독자는 article만 읽은 뒤 unseen robot joint에서 Hertz contact, lubrication regime, starvation, friction/thermal loop, wear mode, seal trade and validation plan을 구분할 수 있어야 한다.
- 계산값이 정확해 보인다는 이유로 smooth, fully flooded, isothermal, Newtonian or steady-state assumption을 실제 grease-lubricated reversing joint에 자동 전이하지 않아야 한다.

## Private hardest transfer problem

Outdoor quadruped robot의 shoulder joint가 48 V BLDC, strain-wave reducer, crossed-roller output bearing, input ball bearing and radial shaft seal을 한 housing에 넣는다. Nominal output torque는 190 N m, emergency-stop peak는 430 N m, output bearing은 simultaneous radial/axial load and overturning moment를 받는다. Gait 동안 output은 대부분 +/-18 deg의 짧은 왕복을 0.2-2 Hz로 반복하지만 recovery motion에서는 22 rpm까지 올라가고 motor-side bearing and reducer input은 수천 rpm을 본다. Service는 -25 to 70 C ambient, rain/dust ingress, transport vibration, washdown and six-hour thermal soak를 포함한다.

Supplier는 dynamic load rating, generic L10 life, one grease viscosity at 40/100 C, nominal seal torque, surface roughness target and catalog efficiency만 제공한다. Prototype A는 cold start current가 높고 40분 뒤 효율이 좋아진다. Prototype B는 세 달 후 torque hysteresis와 backlash가 커지며 grease에 dark debris가 보인다. Prototype C는 씰 lip force를 낮춘 뒤 초기 current는 줄었지만 water ingress 뒤 raceway indent and pitting이 생겼다. Teardown은 gear flank polishing, local fretting at an oscillating bearing zone and one bearing의 asymmetric contact track을 보여준다. Temperature sensor는 housing 외벽에 하나뿐이고 motor current에는 control torque, seal drag, bearing/gear friction and acceleration이 섞여 있다.

다음 판단을 한 번에 닫는다.

1. Gear tooth, rolling element, cage/guide, seal lip and fitted interface를 서로 다른 contact pair로 inventory한다.
2. Nominal component load를 각 contact의 normal load, tangential load, moment and load-sharing uncertainty로 변환한다.
3. Point, elliptical and nominal line contact를 구분하고 local curvature pair를 선언한다.
4. 두 재료의 modulus and Poisson ratio를 combined elastic modulus로 묶는다.
5. Hertz contact patch, maximum pressure and approach가 load and curvature에 따라 어떻게 변하는지 계산한다.
6. Hertz의 smooth, elastic, non-conforming, frictionless-normal-contact 가정을 실제 edge load and plasticity와 분리한다.
7. Misalignment, housing deflection, preload and clearance가 nominal load를 contact edge로 몰 수 있음을 찾는다.
8. Roughness를 Ra 하나가 아니라 scale, direction, Rq/composite roughness, waviness and lay로 관리한다.
9. Apparent contact area와 asperity가 실제로 load를 드는 real contact area를 구분한다.
10. Running-in이 단순 초기 마모가 아니라 topography, contact area and friction state를 바꾸는 과정임을 설명한다.
11. Rolling, sliding, rolling/sliding and spin을 contact kinematics로 분해한다.
12. 두 surface speed에서 entrainment speed와 slide-to-roll ratio를 계산한다.
13. Oscillation reversal and dwell에서 entrainment speed가 0에 가까워지고 기존 film이 붕괴할 수 있음을 찾는다.
14. Viscosity가 lubricant label의 상수가 아니라 temperature, pressure and shear history의 state임을 설명한다.
15. Viscosity-temperature relation을 cold start and hot soak operating points로 변환한다.
16. Pressure-viscosity coefficient가 EHL film formation에 들어가는 이유를 설명한다.
17. Hydrodynamic wedge가 converging gap, entrainment and viscosity로 pressure를 만드는 원리를 Reynolds balance로 읽는다.
18. Boundary, mixed, full-film hydrodynamic and elastohydrodynamic regimes를 원인과 load-carrying path로 구분한다.
19. Hamrock-Dowson의 isoviscous-rigid, viscous-rigid, isoviscous-elastic and viscous-elastic map을 everyday regime names와 혼동하지 않는다.
20. Dimensionless speed U, load W, material G and ellipticity k의 역할을 구분한다.
21. Elliptical-contact minimum film thickness를 input units and source convention을 보존해 계산한다.
22. Central film and minimum film, point/elliptical and line-contact formula를 서로 바꿔 쓰지 않는다.
23. Composite roughness and minimum film로 lambda ratio를 계산하되 threshold를 확정적 failure oracle로 쓰지 않는다.
24. Fully flooded film prediction과 actual inlet supply를 분리한다.
25. Grease channeling, bleed, replenishment, churning and starvation이 local inlet state를 바꾸는 이유를 설명한다.
26. Starvation correction이 speed, supply, geometry and operating history에 의존함을 남긴다.
27. Contact friction을 dry Coulomb coefficient 하나가 아니라 asperity shear, lubricant traction, plowing, hysteresis and spin loss로 분해한다.
28. Bearing friction, gear mesh loss, seal drag and lubricant churning을 torque/power ledger로 분리한다.
29. Sliding speed and traction force가 local flash/bulk heat를 만드는 경로를 계산한다.
30. Heat가 viscosity를 낮추고 film을 얇게 하며 mixed contact와 friction을 바꾸는 feedback loop를 푼다.
31. Cold viscous drag와 hot thin-film distress가 서로 반대 방향의 risk임을 설명한다.
32. Preload and clearance가 temperature, fits and housing/material expansion으로 바뀌는 것을 contact load에 되먹인다.
33. Catalog L10의 rating-load, equivalent load, exponent and population reliability 의미를 보존한다.
34. L10이 individual bearing guarantee, contamination-insensitive life or wear/backlash predictor가 아님을 구분한다.
35. Gear flank pitting/micropitting, bearing rolling-contact fatigue and surface distress를 Hertz stress 하나로 동일시하지 않는다.
36. Adhesive, abrasive, corrosive, fretting and fatigue wear를 motion/amplitude/debris/environment symptoms로 구분한다.
37. Scuffing을 high friction/flash-temperature/film-collapse event로, micropitting을 surface-scale repeated distress로 구분한다.
38. Archard wear relation을 sensitivity ledger로 사용하되 wear coefficient를 material constant처럼 전이하지 않는다.
39. Debris가 결과이면서 three-body abrasion and indentation의 다음 원인이 되는 feedback을 설명한다.
40. Contaminant particle size/hardness and film/contact scale가 dent stress and subsequent fatigue risk를 바꾸는 것을 본다.
41. Seal lip load, material, shaft finish, eccentricity and pressure differential이 drag, heat, leakage and wear를 함께 바꾸는 것을 설명한다.
42. Seal preload 감소가 friction을 낮추면서 ingress barrier를 약화할 수 있음을 trade한다.
43. Grease compatibility, fill amount, base-oil viscosity, thickener and additive system을 brand name과 분리한다.
44. Overfill churning and under-supply starvation을 같은 `more grease is safer` 판단에서 분리한다.
45. Motor current residual에서 inertia, commanded torque and external load를 제거한 뒤 friction proxy를 만든다.
46. Housing temperature 하나로 local contact temperature를 직접 관측했다고 말하지 않는다.
47. Torque-speed-temperature-hysteresis, vibration/acoustic, debris and inspection observations를 mode hypothesis에 연결한다.
48. Run-in, cold start, steady duty, reversal/dwell, overload, ingress and end-of-life test blocks를 분리한다.
49. Single-contact tribometer, bearing rig, reducer subsystem and full-joint endurance가 닫는 claim을 구분한다.
50. SKF railway bearing result의 coating placement, roughness, pressure, SRR, lubricant, speed and geometry를 robot joint에 자동 전이하지 않는다.
51. Lubricant/seal/coating/process revision을 contact-state configuration and evidence version에 묶는다.
52. Release decision을 worst-case friction/power, film/starvation margin, contact stress/life, wear/ingress and monitor/inspection evidence로 닫는다.

## Private premise gate

| IDs | Premises the article must make usable | Gate |
|---|---|---|
| T01-T07 | contact inventory, load sharing, curvature, Hertz patch/pressure/deformation and alignment | Reader can locate the real local contact before applying a life or film equation |
| T08-T13 | roughness, real area, running-in and rolling/sliding/spin/reversal kinematics | Reader can explain why nominal rolling motion still has surface distress |
| T14-T22 | viscosity state, Reynolds wedge, four regimes, U/W/G/k and Hamrock-Dowson film | Reader calculates a bounded film estimate without mixing model families |
| T23-T32 | lambda, starvation, grease supply, friction decomposition, heat and preload loop | Reader predicts both cold drag and hot film-loss failure paths |
| T33-T40 | rating life, RCF, pitting/micropitting, wear modes and debris/contamination feedback | Reader does not turn one Hertz or L10 value into a universal life verdict |
| T41-T44 | seal and grease tradeoffs | Reader can explain why lower drag or more grease can reduce reliability |
| T45-T52 | observability, staged tests, source transfer and configuration release | Reader creates an evidence plan rather than diagnosing from one current/temperature trace |

## Primary source anchors

| Area | Source | Why it matters | Boundary |
|---|---|---|---|
| Foundational film-regime mechanics | Bernard J. Hamrock and Duncan Dowson, `Minimum Film Thickness in Elliptical Contacts for Different Regimes of Fluid-Film Lubrication`, NASA TP-1342, October 1978, 26 PDF pages | Restates four film-parameter equations and maps viscosity/elasticity influence for elliptical contacts using dimensionless speed, load, material and ellipticity groups | Theoretical, isothermal and fully flooded smooth-contact framework assembled from earlier studies; not a grease-replenishment, thermal, non-Newtonian, transient-reversal or wear-life model |
| Broad mechanism/design boundary | J. R. Jones, `Lubrication, Friction, and Wear`, NASA SP-8063, 1971, 79 PDF pages | Separates rough-surface friction components, wear modes, lubrication choices, environment, adverse histories and mechanism-level tests | Space-vehicle design monograph with historical materials and data; its generic mechanism logic transfers, but catalog values and space-environment selections do not automatically transfer to modern robots |
| Practical film/starvation bridge | Erwin V. Zaretsky, `Bearing Elastohydrodynamic Lubrication: A Complex Calculation Made Simple`, NASA TM-102575, April 1990, 12 PDF pages | Connects Hamrock-Dowson film thickness to bearing geometry, operating-temperature viscosity, starvation reduction, composite roughness and a life-correction interpretation | First-order approximation and historical empirical correction; not a current manufacturer rating method or proof that lambda alone determines individual bearing life |
| Current company research | Broitman et al., `Comparison of Various Conversion Layers for Improved Friction Performance of Railway Wheel-End Bearings`, Coatings 13(12):1980, 2023, DOI 10.3390/coatings13121980, SKF Research & Technology Development, CC BY 4.0 | Connects coating microstructure/hardness, rougher-surface placement, running-in, roughness tracks, rolling/sliding friction and full bearing torque across controlled rigs | Railway double cylindrical roller bearings at declared loads, speeds, grease and 60 C; up-to-30-percent headline and up-to-75-percent axial-load-cycle result are test-condition-specific and lubricant chemistry interaction was outside the interpretation |

## Foundation floor and stop decision

- Shared floor: calculus, signals/systems, statistics, actuator mechanics and structural mechanics concept nodes. The branch does not recurse into standalone historical articles for elementary elasticity, Reynolds flow, Hertz contact or viscosity laws.
- Domain floor: Hamrock-Dowson 1978 is the one canonical reconstruction because preserving the four-regime map, paper-specific `E'` convention and minimum/central equation identity adds a unique calculation and model-selection capability.
- Current evidence: SKF RTD 2023 is the one modern standalone source because the rig ladder, adverse coating variants and condition-specific torque claims change how a production surface hypothesis is tested and transferred.
- Embedded sources: NASA SP-8063 and Zaretsky 1990 supply mechanism and practical boundary claims inside the concept article; they do not need separate public routes for this branch.
- Cite-only lineage: earlier Hertz, Reynolds, Barus and rough-contact antecedents add provenance here but no premise absent from the shared concept floor. Backward tracing stops at this point.
- Standalone source budget: two, fully used by one domain-floor source and one current-evidence source. Any exception must identify a new reader capability required by a later public node.

## Source-processing record
- `hamrock-dowson-1978.pdf`: 26 pages. Summary, symbols, dimensionless grouping, equations 1-35, four regimes, mapping procedure, conclusions, figures 1-12 and references inspected. Original NTRS PDF and metadata verified.
- `nasa-sp-8063.pdf`: 79 pages. Contents, friction, five wear types, wear process/rates, hydrodynamic/EHD/boundary regimes, grease/oil/solid lubricant tradeoffs, environment, design criteria, recommended practices, tests and appendices inspected.
- `zaretsky-1990.pdf`: 12 pages. Historical formula comparison, simplified bearing form, temperature-viscosity selection, starvation factor, lambda/life interpretation, figures and stated first-order boundary inspected.
- `skf-2023.xml`: full official MDPI JATS artifact, 14 original TIFF figures and nine tables secured. Abstract, methods, three rigs, repeats, run-in, results, discussion, conclusions, authorship, SKF affiliation and CC BY license inspected.
- MDPI HTML/PDF edge returned 403 in this environment. The official `mdpi-res.com` JATS and every cited figure artifact remained accessible, so reconstruction uses the complete publisher artifact rather than search snippets or a secondary summary.

## Full-scope map

| Topic | Must cover | Depth | Risk if omitted |
|---|---|---|---|
| Contact inventory | pair, load, curvature, motion, material and environment | deep | One component-level load is applied to the wrong local contact |
| Elastic contact | combined modulus, point/line geometry, patch, pressure, deflection | deep | Nominal area or average stress hides GPa-scale local state |
| Surface state | asperities, Rq/lay/waviness, real area and running-in | deep | Friction coefficient is treated as a material constant |
| Kinematics | entrainment, sliding, SRR, spin, reversal and dwell | deep | Rolling contact is assumed no-slip and always film-forming |
| Lubricant state | viscosity-temperature-pressure and non-Newtonian boundary | deep | A 40 C datasheet value is used at cold start and hot contact |
| Film formation | Reynolds wedge, four regimes, Hamrock-Dowson and formula identity | deep | A plausible film number comes from mismatched equations/units |
| Supply | full flood, starvation, grease replenishment, bleed and churning | deep | Theoretical film is credited without lubricant at the inlet |
| Friction and heat | loss sources, flash/bulk heat and thermal feedback | deep | Efficiency is a constant and runaway paths are invisible |
| Life and damage | L10 boundary, RCF, pitting, wear, scuffing and micropitting | deep | One life equation covers failure modes it does not model |
| Debris/contamination | particle ingress, indentation and three-body feedback | deep | Dirt and wear particles are treated only as post-failure symptoms |
| Sealing | drag, heat, leakage, exclusion and shaft/interface conditions | deep | Friction reduction silently removes ingress protection |
| Evidence | observer limits, rig hierarchy, inspection and configuration | deep | One current trace or catalog value becomes a release argument |

## Narrative sequence
1. Start from named contact pairs, not from grease or a friction coefficient.
2. Build local elastic pressure/deformation from load, curvature and material.
3. Place real rough surfaces inside that nominal patch and introduce running-in.
4. Derive entrainment and slip before asking whether a lubricant film can form.
5. Turn temperature and pressure into viscosity state, then derive the wedge balance.
6. Reconstruct the four Hamrock-Dowson regimes and compute a bounded minimum film.
7. Compare film with roughness, then remove the fully flooded assumption through starvation and grease supply.
8. Decompose friction power and close the heat-viscosity-film-contact feedback loop.
9. Separate rating life from pitting, micropitting, scuffing, fretting and abrasive/adhesive wear.
10. Add grease ageing, debris, contamination and seal drag/ingress as lifecycle state.
11. End with observers, staged test rigs, teardown evidence and configuration-controlled release.

## Section and Viz plan

### 01 Contact inventory and load path
- Viz: switch among gear flank, rolling element, seal lip and fitted interface; each selection changes geometry, load type, motion and candidate failure modes.
- Formula: local normal/tangential load ledger and combined modulus.

### 02 Hertz contact patch and pressure
- Viz: load, effective radius and modulus reshape the contact ellipse, maximum pressure and elastic approach; an edge-load toggle breaks the symmetric assumption.
- Formula: circular-contact radius/maximum pressure and effective radius.

### 03 Rough surfaces and running-in
- Viz: roughness amplitude/lay and coating hardness change asperity load share and before/after topography; real contact points grow without changing apparent area.
- Formula: composite roughness and lambda precursor.

### 04 Rolling, sliding, spin and reversal
- Viz: two surface-speed controls update entrainment, SRR, sliding heat direction and zero-speed reversal warning.
- Formula: entrainment speed and SRR.

### 05 Viscosity as temperature-pressure state
- Viz: cold start, rated and hot soak operating points move on viscosity-temperature and pressure-viscosity curves.
- Formula: Walther-style temperature relation and Barus pressure relation with stated range boundary.

### 06 Wedge pressure and four film regimes
- Viz: geometry/speed/load/material controls move one point through isoviscous-rigid, viscous-rigid, isoviscous-elastic and viscous-elastic regions.
- Formula: one-dimensional Reynolds balance and U/W/G/k definitions.

### 07 Minimum film, lambda and model identity
- Viz: compute fully flooded Hamrock-Dowson minimum film, compare it with composite roughness and expose which inputs/assumptions dominate.
- Formula: 1978 viscous-elastic minimum-film parameter and lambda.

### 08 Starvation and grease supply
- Viz: supply, speed, fill and dwell change inlet meniscus, replenishment, churning loss and effective film independently.
- Formula: bounded starvation factor and grease mass/energy ledger, explicitly empirical.

### 09 Friction-power-thermal feedback
- Viz: bearing, gear, seal and churning loss stack into temperature; temperature feeds viscosity, film and mixed-contact loss until equilibrium or runaway.
- Formula: torque/power decomposition and lumped thermal state equation.

### 10 Life, wear and surface distress
- Viz: choose duty/contact state and see rating-life, asperity wear, scuffing, micropitting/RCF and fretting hypotheses remain separate.
- Formula: basic rating life and Archard sensitivity relation.

### 11 Contamination, seals and grease lifecycle
- Viz: seal lip force and ingress severity trade drag against exclusion; debris size and hardness change dent/abrasive feedback.
- Formula: seal drag power and contamination/wear state update.

### 12 Observation, rigs and release evidence
- Viz: a symptom trace routes hypotheses into single-contact, bearing/reducer and full-joint tests; failed correlation feeds assumptions back rather than only advancing upward.
- Formula: motor-current torque residual and normalized model-test residual/configuration identity.

## Paper/source bundle

### Foundational reconstruction: Hamrock-Dowson NASA TP-1342 (1978)
- Reconstruct why pressure-viscosity and elastic deformation create four mathematical regimes rather than one universal EHL equation.
- Preserve definitions of H, U, W, G, k and reduced gV/gE; show how the authors derive a log-log regime map from four limiting equations.
- Distinguish paper equation identity, minimum versus central film and five ellipticity maps.
- Preserve author intent: a complete theoretical film-parameter solution for elliptical contacts within stated regime assumptions, not a wear/life or transient grease model.
- Mark non-transfer: smooth surfaces, fully flooded inlet, isothermal formulation, Newtonian pressure-viscosity representation and results assembled from earlier theoretical datasets.

### Current company research reconstruction: SKF RTD / Coatings 2023
- Reconstruct the hypothesis that a softer conversion layer on the rougher counterpart can facilitate running-in and reduce friction.
- Preserve three evidence levels: reciprocating fretting, WAM ball/roller-on-disk rolling/sliding, and grease-lubricated double-CRB torque rig.
- Preserve test conditions and repeats: 1/1.3/0.27 GPa contact states, lambda 0.3 WAM tests, 60 C, 7000 N radial load, 200-1000 N axial load, 300-4500 rpm, ten-hour run-in and repeated cycles.
- Separate headline up-to-30-percent torque reduction from the up-to-75-percent high axial-load-cycle comparison and explain why neither is a universal coating factor.
- Preserve adverse evidence: MnPh/ZnCaPh can remain rougher and sometimes produce higher bearing friction; coating both sides is not the same as placing a soft layer on the rougher counterpart.
- Preserve author limit: interpretations are mechanical and do not include potential lubricant interaction.

## Formula contract
- Every display equation gets exactly one adjacent `FormulaNote`.
- Every `\text{...}` inside KaTeX is Korean and states the causal role of the term.
- Long multi-term equations are split by role before font shrinking; 360 px target scale is at least `0.82`, with no horizontal scroll.
- FormulaNote names units, equation family/source identity, assumptions and why the operation is used.
- Dimensionless groups never hide their original dimensional inputs or unit convention.

## Viz design contract
- Neutral surface with sparse blue for applied/selected state, teal for film/resistance/evidence, amber for regime/model boundary/feedback and red only for exceeded/damage state.
- Curved pressure/film profiles, surface topography, contact ellipses and feedback loops replace generic arrow pipelines.
- Every control changes geometry, curve, metric and decision sentence; color-only changes do not count.
- Dense maps use separate 340-unit mobile and 620-unit desktop coordinate systems.
- SVG text target is 18-22 units on desktop diagrams or 11.5-14 units in dedicated mobile diagrams.
- Stable plot height and responsive control/plot grid; no inner scroll, clipping, control overlap or unreadable effective text.
- Decorative time-based animation remains deferred until static causal state and reduced-motion behavior pass screenshot QA.

## Acceptance gate
- All 52 premises map to prose, formula, Viz or explicit model boundary.
- Concept has 12 causal labs and 24 annotated display formulas.
- Foundational and current source articles each have 6 annotated formulas, one mechanism lab and 7 bounded evidence states.
- Source title, authors, institution, date, page/artifact scope, author intent, evidence and non-transfer boundary are visible.
- QA checks formula/note parity, raw LaTeX, Korean annotations, formula scale, material overflow, inner Viz scroll, console errors and causal control changes.
- Screenshots at 360, 390, 768 and 1440 px are visually inspected after automated QA.
- Local build, actuator/structural/fracture/composite regression and public-host QA pass before completion.

## 4B/9B replay packets
- 4B: one premise + one primary page/XML slice + one equation + Korean why annotations + one counterexample + one causal control + one acceptance selector.
- 9B: one complete causal section or source evidence state with prerequisite bridge, state/unit conventions, derivation order, author intent, claim/evidence/non-transfer split, Viz contract and critic pass.
- Source-worker packet must include exact artifact identity and page/section/figure/table range. Search snippets are not source evidence.
- Critic packet tests equation-family mixing, viscosity unit/reference-temperature loss, fully flooded transfer, lambda/L10 overclaim, no-op interactions and effective mobile text size.
- Orchestrator retains hardest-problem construction, source accessibility decisions, cross-section state identity, source conflict/non-transfer, screenshot criticism, deployment and provenance.
