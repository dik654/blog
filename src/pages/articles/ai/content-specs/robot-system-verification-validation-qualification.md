# Robot Systems Engineering, Verification, Validation and Qualification content spec

## Goal

- 기존 robotics subsystem 글의 계산·시험을 `mission -> operating envelope -> measurable requirements -> architecture/interfaces -> hazards -> verification/validation -> qualification/reliability -> configuration-controlled release`로 묶는다.
- "시험을 많이 했다"가 아니라 어떤 robot configuration이 어떤 환경과 사용 시나리오에서 어떤 claim을 어떤 evidence로 닫았는지 추적 가능하게 만든다.

## Curriculum gap decision

- Existing nodes deeply cover perception, localization, planning, control, ROS 2, embedded timing, motor drive, power, energy, isolation/EMC/STO, actuator, structure, fracture, composites and tribology.
- Every subsystem article ends in evidence, but no node owns requirement quality, cross-interface budgets, verification versus validation, hazard-to-control traceability, test-article pedigree, environmental tailoring, reliability confidence, scenario coverage, change impact or release case.
- This is a reusable integration concept gap. It is not solved by adding another historical paper.

## Foundation floor

```json
{
  "branch": "robot-system-verification-validation-qualification",
  "sharedFloor": [
    "probability and statistics",
    "signals and systems",
    "robot top-down architecture",
    "subsystem evidence articles"
  ],
  "domainFloor": null,
  "currentEvidence": null,
  "standaloneSourceBudget": 0,
  "embeddedPrimaryGuidance": [
    "NASA Systems Engineering Handbook Rev 2",
    "MIL-STD-810H Change 1 official scope",
    "GSFC-STD-7000B GEVS",
    "NIST AI RMF 1.0 and AIRC",
    "NIST Response Robot Performance Standards",
    "ISO 12100:2010 official scope",
    "ISO 10218-1:2025 official scope"
  ],
  "stopReason": "The sources provide process and scope boundaries inside one concept article; reconstructing any one standard would not add a prerequisite capability to the next two public nodes."
}
```

## Reader contract

- 초등학생도 `원하는 일`, `확인할 숫자`, `위험한 상황`, `해 본 시험`, `아직 모르는 것`의 다섯 칸으로 시작할 수 있다.
- 전문 용어는 쉬운 질문 뒤에 붙인다: ConOps, ODD, requirement, hazard, verification, validation, qualification, acceptance, reliability, confidence, traceability.
- 본문을 읽은 독자는 unseen robot release package에서 그럴듯한 시험 개수보다 빠진 조건, 잘못된 표본, 잘못된 configuration and unsupported claim을 찾아야 한다.

## Private hardest transfer problem

Warehouse와 outdoor loading dock를 오가는 mobile manipulator가 80 kg payload를 운반하고 사람 주변에서 tote를 집는다. Vision policy, LiDAR localization, ROS 2 navigation, 48 V actuator and safety PLC를 결합했다. Team은 99% task success, IP54 supplier label, one-hour rain test, thermal chamber pass, 200 km driving, zero severe incidents and one emergency-stop demonstration을 근거로 release를 제안한다.

하지만:

1. `잘 집는다`는 stakeholder need가 payload, tote pose, light, floor, human distance, completion time and failure disposition이 없는 문장이다.
2. Outdoor dock, ramp, wet steel plate, reflective wrap, low sun, wireless loss and depleted battery가 ODD에 baselined되지 않았다.
3. 99%는 nominal indoor trials 100회 평균이며 condition strata와 confidence bound가 없다.
4. Same easy tote sequence가 반복되어 trials가 independent하지 않다.
5. Perception false negative와 planner recovery를 한 task-success 숫자가 숨긴다.
6. Stop-distance requirement에 speed, payload, slope, tire state, latency and uncertainty가 없다.
7. Safety scanner, planner, PLC and brake 사이 interface owner와 fault reaction time budget이 없다.
8. Software timestamp와 brake current trace의 clocks가 sync되지 않았다.
9. Risk register는 `collision`을 hazard, cause, hazardous event and harm으로 분리하지 않는다.
10. FMEA severity x occurrence 순위만 낮추고 single-point catastrophic path는 남아 있다.
11. Fault-tree common cause인 shared 24 V rail and shared configuration server를 독립 channel로 센다.
12. Warning label을 inherently safe design보다 먼저 credit한다.
13. E-stop demo는 한 위치, warm brake, empty payload, fresh battery에서만 수행됐다.
14. Verification와 validation을 같은 단어로 쓰며 stakeholder workflow test가 없다.
15. Test, analysis, inspection and demonstration method가 requirement별로 미리 정해지지 않았다.
16. Prototype A가 qualified됐지만 production unit B는 different camera, seal and firmware를 쓴다.
17. Qualification, acceptance and characterization test가 구분되지 않는다.
18. Environmental tests는 life-cycle profile가 아니라 인터넷의 온도/진동 값에서 복사했다.
19. Temperature, vibration, dust/water and voltage dip를 모두 단독으로만 시험했다.
20. Cold soak 직후 high-torque start와 condensation transition을 시험하지 않았다.
21. Random vibration input은 fixture resonance and control accelerometer trace 없이 chamber setting만 기록했다.
22. Water test 후 insulation, bearing torque, camera calibration and corrosion inspection을 하지 않았다.
23. IP54 supplier label을 assembled cable glands, breathing path and moving joints에 그대로 전이한다.
24. EMC immunity pass 중 perception latency and localization covariance가 기록되지 않았다.
25. Test-before/test-after functional baselines가 different firmware다.
26. 200 km aggregate distance가 speed, payload, terrain, stop count and joint duty distribution을 숨긴다.
27. Zero failures를 reliability=100%라고 해석한다.
28. One unit의 repeated runs를 many independent units처럼 센다.
29. Wear-out behavior가 있는데 exponential constant failure-rate model만 쓴다.
30. Maintenance interval and replaceable wear parts가 reliability claim에 포함되지 않았다.
31. AI dataset이 ODD strata, rare hazards, demographic/environment boundary and data lineage를 보존하지 않는다.
32. Offline accuracy와 closed-loop task risk를 같은 metric으로 취급한다.
33. Simulation success가 sensor artifacts, latency, contact and human response를 검증했다고 말한다.
34. HIL은 actual motor/brake thermal and mechanical stopping distance를 대체한다.
35. Model confidence threshold change가 safety requirement and regression set에 trace되지 않는다.
36. Passed test의 raw data, calibration, fixture, test article serial and anomaly disposition이 없다.
37. A failed trial is removed as `operator error` without predefined exclusion rule.
38. Waiver has no residual risk owner, expiration or compensating control.
39. A bug fix changes QoS, inference model and brake timing but only unit tests run again.
40. Supplier firmware/part revision is not linked to the released configuration baseline.
41. Golden dataset leaked into threshold tuning and final validation.
42. Mean performance passes while worst condition violates a safety limit.
43. Requirement coverage count credits duplicated evidence and unreviewed screenshots equally.
44. Hazard controls have no effectiveness evidence under injected faults.
45. Recovery action is queued behind the stalled component it must stop.
46. Human operator workload, mode confusion and reset behavior are not validated.
47. Field telemetry cannot distinguish safe stop, degraded operation and silent monitor failure.
48. Post-release drift and incident escalation thresholds are undefined.
49. Release dashboard shows green status without open assumptions, residual risks and nonconformances.
50. Review board cannot reconstruct claim -> requirement -> test configuration -> raw evidence -> anomaly -> decision.

The problem remains private. Every premise must map to public prose, one formula, one causal lab, a source boundary or a release gate.

## Premise coverage groups

| IDs | Public capability | Gate |
|---|---|---|
| Q01-Q05 | ConOps, ODD, scenario strata and measurable success | Reader turns a vague need into observable conditions and outcomes |
| Q06-Q08 | atomic requirements, budgets, owners, units, timing and interfaces | Reader detects a requirement that cannot be verified or allocated |
| Q09-Q12 | hazard chain, risk reduction hierarchy, FMEA/FTA and common cause | Reader does not use one risk score as proof of safety |
| Q13-Q17 | verification/validation and method/test-pedigree distinction | Reader assigns the right evidence method and article |
| Q18-Q25 | environment tailoring, combined sequence and before/after state | Reader does not copy a standard level or component IP label |
| Q26-Q30 | duty profile, reliability model, independence, confidence and maintenance | Reader derives a bounded claim from zero failures and declared model |
| Q31-Q35 | AI TEVV, scenario coverage, closed loop, sim/HIL boundary and thresholds | Reader separates dataset metric from system risk |
| Q36-Q44 | evidence identity, anomaly, exclusion, waiver and control effectiveness | Reader preserves negative evidence and provenance |
| Q45-Q50 | recovery independence, human factors, monitoring, drift, release case | Reader can audit a field-ready claim and its remaining uncertainty |

## Primary guidance and boundaries

| Source | Used for | Does not prove |
|---|---|---|
| NASA Systems Engineering Handbook Rev 2, 356 PDF pages | stakeholder expectations, good requirement statements/metadata, interface and risk management, verification/validation, matrices, test-article pedigree and configuration trace | NASA process is not a certification recipe for every commercial robot |
| MIL-STD-810H Change 1 official DLA scope, active 2022-05-18 | life-cycle environmental tailoring and warning that the document does not impose universal test specifications | A method number or copied level does not define a robot's environment |
| GSFC-STD-7000B, active 2021 | qualification/protoflight/acceptance distinctions, integrated versus lower-level testing, workmanship and functional before/after evidence | Spaceflight levels and margins do not transfer to warehouse/service robots |
| NIST AI RMF 1.0/AIRC | GOVERN/MAP/MEASURE/MANAGE framing, context and TEVV lifecycle | Voluntary framework does not certify a robot or provide task-specific limits |
| NIST Response Robot Performance Standards | responder-defined tasks, standard fixtures, repeatable metrics and deployment relevance | Response-robot test methods do not cover every industrial/service application |
| ISO 12100:2010 official scope | machinery life-cycle hazard identification, risk estimation/evaluation, risk reduction and documentation | Official preview is not the full normative text; article does not claim conformance |
| ISO 10218-1:2025 official scope | current industrial-robot manufacturer boundary and separation from integration/applications | It explicitly excludes service/public, medical, military, airborne/space and severe-condition uses; no universal robot claim |

## Narrative sequence

1. Start from the field mission and the conditions in which it must work.
2. Convert needs into atomic measurable requirements and budgets.
3. Allocate every requirement and interface to an owner and evidence method.
4. Build hazards from source through event to harm, then choose controls by hierarchy.
5. Use FMEA and fault trees as complementary search tools, not safety certificates.
6. Separate verification (built right) from validation (right thing), and method from test article.
7. Climb a staged evidence ladder without pretending simulation replaces physical effects.
8. Tailor environment from the life-cycle profile and preserve sequence/combined effects.
9. Turn duty and failures into reliability with model, independence and confidence boundaries.
10. Evaluate AI by ODD strata, closed-loop consequence and drift, not one mean accuracy.
11. Bind every result to configuration, anomaly, waiver and regression impact.
12. Release a claim-evidence-assumption-residual-risk case and keep monitoring after release.

## Section, formula and Viz plan

### 01 Mission, ConOps and ODD
- Formulas: scenario state tuple; weighted success with explicit strata.
- Viz: change terrain, weather, payload and human proximity; see required scenarios and unsupported region grow.

### 02 Atomic requirements and budgets
- Formulas: requirement predicate over condition/input/output/tolerance; end-to-end latency budget.
- Viz: edit missing units/conditions and allocate latency to sensor, network, compute, control and brake.

### 03 Traceability and interface ownership
- Formulas: coverage relation; interface contract tuple.
- Viz: break a requirement-to-evidence edge or an interface owner and expose orphan claims.

### 04 Hazard chain and risk reduction
- Formulas: conditional harm probability chain; residual risk after independent controls.
- Viz: select source/event/harm and move controls between inherent design, safeguarding and information.

### 05 FMEA, FTA and common cause
- Formulas: RPN as prioritization only; union/intersection probability with dependence boundary.
- Viz: inject shared power/config causes and compare false independent-channel credit.

### 06 Verification, validation and methods
- Formulas: requirement verification set; validation scenario distance from intended use.
- Viz: route claims to analysis/inspection/demonstration/test and detect wrong-method evidence.

### 07 Test ladder and article pedigree
- Formulas: evidence applicability intersection; accumulated model discrepancy.
- Viz: move between unit, SIL, HIL, subsystem and full robot; track what each level restores and still omits.

### 08 Environmental tailoring
- Formulas: life-cycle environment envelope; combined exposure state update.
- Viz: compose storage, transport, operation, washdown and transition sequences; reveal condensation/fixture/after-test gaps.

### 09 Reliability and confidence
- Formulas: Weibull survival; zero-failure lower reliability bound or no-failure MTBF bound.
- Viz: change sample count, duration, independence and beta; see confidence and mission survival change.

### 10 AI and autonomy TEVV
- Formulas: stratified risk/coverage; closed-loop expected harm or constraint exceedance.
- Viz: redistribute dataset across easy/rare strata and change threshold; compare offline metric with system consequence.

### 11 Configuration, anomaly and regression
- Formulas: release configuration identity; change-impact closure ratio.
- Viz: change firmware/model/seal/sensor and see which evidence becomes stale; retain failed trials and waivers.

### 12 Release case and field feedback
- Formulas: claim support as evidence-condition intersection; monitor detection/response coverage.
- Viz: build a release board with supported, conditional, open and rejected claims and feed field drift back to requirements.

## Formula contract

- 24 display equations and 24 adjacent FormulaNotes.
- Every `\text{...}` is Korean and describes why the operation is present.
- No unexplained acronym inside a formula; term is introduced in prose first.
- Long relations split into aligned causal rows before shrinking; target minimum math scale 0.78 at 360 px.
- FormulaNote states units or dimensionless state, independence/model assumptions and what the number cannot prove.

## Viz contract

- Twelve distinct causal labs, not one repeated box-arrow template.
- HTML owns text and controls; SVG owns plots, trees, matrices and timelines.
- Blue selected evidence, teal satisfied contract, amber conditional/open state, violet model or allocation, red only violated safety/release invariants.
- Every control changes topology, geometry, metric or release conclusion.
- Stable responsive dimensions; dedicated mobile composition when a tree/matrix would shrink below readable text.
- No inner scroll, clipped right edge, decorative animation or hover-only meaning.

## Acceptance

- 50 private premises mapped.
- 12 causal labs, 24 annotated formulas, 24 FormulaNotes.
- No standalone paper/reference routes added in this milestone.
- Official-source boundaries and current version/status are visible.
- 360/390/768/1440: no document/Viz/formula overflow, raw LaTeX, English-only formula annotations or console errors.
- Each lab changes visible derived state and a decision sentence.
- Existing 100-test connected regression, production build and public-host focused QA remain green.

## 4B/9B replay

- 4B packet: one premise, one requirement/hazard/evidence relation, one primary-source paragraph, one formula with Korean annotations, one causal control and one browser assertion.
- 9B packet: one complete section with reader misconception, 4-6 source claims, calculation boundary, failure example, Viz state machine, test contract and premise subset.
- Critic packets specifically attack vague requirements, average-only metrics, dependent evidence, copied environment levels, qualification/acceptance confusion, reliability=100%, offline-to-system transfer and stale configuration.
- Orchestrator retains ODD scope, hazard severity decisions, standard applicability, hardest-problem coverage, cross-section identity, legal/conformance disclaimers, connected QA and deployment.
