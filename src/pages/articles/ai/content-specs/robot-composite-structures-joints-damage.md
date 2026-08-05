# Robot Composite Structures, Joints & Damage content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 여러 장의 종이를 방향을 달리해 붙이는 장면으로 층 방향과 쌓는 순서의 효과를 먼저 설명한다.
- `Qbar`, `ABD`, `BVID`, `CAI`보다 먼저 한 장의 방향, 전체 적층, 구멍·접착·충격의 세 층을 세운다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal
- Metallic structural and fracture mechanics 다음에 복합재를 `constituent -> lamina -> laminate -> detail/joint -> damage -> inspection -> building-block evidence` 순서로 쌓는다.
- 높은 specific stiffness를 소개하는 데서 끝내지 않고 좌표 변환, ABD coupling, ply failure, delamination, BVID, environment, manufacturing and NDE가 실제 robot link release decision에서 어떻게 만나는지 닫는다.

## Reader contract
- 본문에는 정답 맞히기용 문제가 등장하지 않는다.
- 작성자는 아래 private transfer problem을 먼저 풀고 premise별 coverage를 감사한다.
- 독자는 article만 읽은 뒤 unseen composite robot link의 layup and joint를 screen하고, CLT가 답할 수 없는 damage mode를 분리하며, coupon-to-component evidence plan을 설계할 수 있어야 한다.

## Private hardest transfer problem

Outdoor manipulation robot의 780 mm hollow carbon/epoxy shoulder link가 titanium clevis insert에 bonded-and-bolted 방식으로 연결된다. Link는 `[0/+45/-45/90]s` baseline laminate이지만 cable cutout 주위에는 local pad-up and ply drops가 있고, cure temperature는 120 C, service는 -30 to 70 C and wet marine exposure다. Emergency stop은 combined axial compression, bending and torsion을 만들고, shoulder backlash impact와 dropped tool은 outer facesheet에 barely visible dent를 남길 수 있다. Supplier는 lamina elastic constants and unnotched strengths, open-hole allowables, limited Mode-I/II toughness, room-temperature dry coupon data를 제공했다. FEA는 average shell ply stresses and a high interlaminar stress near the insert edge를 보고한다. Ultrasound access is blocked over 18 mm of one bondline. Prototype static test는 통과했지만 one specimen shows local delamination before ultimate load.

다음 판단을 한 번에 닫는다.

1. Fibre, matrix, interface가 axial, transverse, shear and environmental response에서 맡는 역할을 구분한다.
2. Material axes `1-2`와 laminate/global axes `x-y`를 구분하고 ply angle의 sign convention을 선언한다.
3. Engineering shear strain convention을 tensor shear와 혼동하지 않고 stress/strain transformation을 구현한다.
4. Plane-stress orthotropic compliance에서 reciprocity `nu12/E1 = nu21/E2`를 지킨다.
5. Lamina reduced stiffness `Q`와 angle-dependent transformed stiffness `Qbar`를 계산한다.
6. 같은 fibre volume fraction이라도 ply angle이 axial, coupling and shear response를 바꾸는 이유를 설명한다.
7. Ply z-boundaries를 실제 thickness order로 선언하고 A, B, D matrices를 적분한다.
8. Symmetric, balanced and quasi-isotropic layup을 서로 다른 조건으로 구분한다.
9. Unsymmetric laminate의 `B` matrix가 membrane load를 curvature로 바꾸는 것을 예측한다.
10. `A16/A26` and `D16/D26`가 extension-shear and bend-twist coupling을 만든다는 것을 읽는다.
11. Mid-plane strain and curvature에서 각 ply top/bottom strain and stress를 복원한다.
12. Laminate average stress가 낮아도 weak transverse/compressive ply가 먼저 실패할 수 있음을 찾는다.
13. Thermal and moisture free strain을 mechanical strain에서 빼고 cure-to-service residual state를 계산한다.
14. Hygrothermal property knockdown and expansion coefficients를 room-temperature dry data와 분리한다.
15. Maximum stress, Tsai-Hill, Tsai-Wu가 답하는 질문과 failure-mode information의 차이를 구분한다.
16. Tsai-Wu interaction coefficient를 임의 기본값으로 숨기지 않고 biaxial evidence or assumption으로 남긴다.
17. Failure index 1을 ultimate component failure로 해석하지 않고 first-ply failure state로 제한한다.
18. Progressive damage에서 stiffness degradation rule, localization and mesh dependence를 드러낸다.
19. Fibre tension/compression, matrix tension/compression and shear-dominated modes를 구분한다.
20. Open-hole, notch, free edge and ply drop에서 CLT의 uniform in-plane assumption이 깨지는 위치를 표시한다.
21. Bolted joint에서 bearing, bypass, net tension, shear-out and fastener pull-through를 별도 paths로 계산한다.
22. Bolt clamp load를 metal joint와 동일하게 과대 credit하지 않고 through-thickness crushing and relaxation을 검사한다.
23. Bonded joint에서 average shear가 아니라 adherend stiffness, overlap end peel and bondline defects를 본다.
24. Insert and ply-drop geometry가 interlaminar normal/shear stress and delamination initiation을 만드는 이유를 설명한다.
25. CLT가 transverse shear/normal and free-edge delamination을 직접 예측하지 못함을 model boundary로 표시한다.
26. Mode I, II and mixed-mode energy release rates를 ply failure index와 구분한다.
27. VCCT/CZM의 crack path, toughness, penalty stiffness and mesh/process-zone assumptions를 보존한다.
28. Cohesive initiation prediction이 progression보다 mesh-sensitive할 수 있음을 해석 결과에 반영한다.
29. Low-velocity impact에서 small surface dent and large subsurface delamination이 공존할 수 있음을 설명한다.
30. Compression-after-impact residual strength가 visual dent depth alone로 결정되지 않음을 보인다.
31. Impact threat를 energy 하나가 아니라 impactor geometry, support, location, laminate and environment와 묶는다.
32. BVID, detectable damage and residual threat를 inspection capability와 연결한다.
33. Void, porosity, waviness, wrinkle, foreign object, disbond and cure variation을 서로 다른 defect classes로 관리한다.
34. Fibre angle, ply sequence, thickness, material batch, cure cycle and surface preparation을 part traceability에 묶는다.
35. Coupon allowables가 joint, cutout, impact and curved component로 자동 전이되지 않음을 설명한다.
36. Coupon -> element -> subcomponent -> component building-block tests가 각각 닫는 claim을 정한다.
37. Test pyramid를 단순 specimen-size ladder가 아니라 analysis correlation and variability loop로 설계한다.
38. B-basis residual strength/life statement와 deterministic FEA point를 구분한다.
39. NDE method를 flaw type, depth, orientation, access and reference standard에 맞춘다.
40. Uninspectable bondline zone를 zero flaw로 취급하지 않고 representative flaw or redesign decision으로 바꾼다.
41. Proof test만으로 composite flaw screening을 닫지 않고 pre/post NDE and representative pre-flawed evidence를 둔다.
42. Static ultimate pass가 cyclic delamination, impact damage and environment durability를 입증하지 않음을 설명한다.
43. Damage Threat Assessment, Impact Damage Mitigation Plan and Residual Threat Determination을 연결한다.
44. Service load spectrum에 joint impact, emergency stop, thermal cycle, humidity and dwell을 보존한다.
45. Detected delamination acceptance analysis를 similar damage configuration test로 검증한다.
46. Repair가 layup, taper, bondline, cure and inspectability state를 바꾸므로 새 configuration으로 추적한다.
47. Analysis discrepancy를 ply convention, material axes, shell offset, element formulation, mesh or boundary condition으로 진단한다.
48. Hand CLT, laminate code, shell/solid FEA, coupon, NDE demonstration, element and component test가 서로 다른 claim을 닫는다.
49. Robot mass optimization에서 stiffness, mode, joint compliance, damage tolerance and repairability를 함께 trade한다.
50. Metallic insert galvanic isolation, thermal-expansion mismatch and bearing load introduction을 material-system problem으로 본다.
51. NASA handbook example의 spaceflight process를 robot product에 자동 규정으로 적용하지 않는다.
52. Release decision을 layup revision, material/process lot, damage state, inspection and evidence version에 묶는다.

## Private premise gate

| IDs | Premises the article must make usable | Gate |
|---|---|---|
| C01-C06 | constituent roles, material axes, shear convention, orthotropic Q and Qbar | Reader can transform one off-axis ply without swapping global and material quantities |
| C07-C14 | z-order, ABD, symmetry/balance/quasi-isotropy, ply recovery, thermal/moisture | Reader predicts coupling and residual strain before reading a solver contour |
| C15-C19 | failure criteria, interaction evidence, first-ply and progressive damage | Reader does not call FI=1 a component ultimate load |
| C20-C28 | holes, joints, free edges, delamination, VCCT/CZM validity | Reader can name where CLT stops and what higher-fidelity evidence replaces it |
| C29-C34 | impact/BVID, CAI, manufacturing flaws and traceability | Reader does not infer subsurface damage from dent appearance alone |
| C35-C42 | allowables, building blocks, statistics, NDE, proof and cyclic/environment claims | Reader assigns each claim to the correct evidence level |
| C43-C52 | threat/mitigation/residual state, repair, correlation, optimization and release | Reader closes a configuration-controlled damage-tolerance decision |

## Primary source anchors

| Area | Source | Why it matters | Boundary |
|---|---|---|---|
| Foundational anisotropic and laminate mechanics | S. W. Tsai, `Strength Characteristics of Composite Materials`, NASA CR-224, 1965, 105 PDF pages | Derives off-axis strength, laminate A/B/D thermoelastic interaction, cross-ply/angle-ply examples and sequential layer failure | Early glass/epoxy model assumes plane stress, idealized properties and yield/ultimate equivalence; not a modern damage-mode criterion or production allowable |
| Current process guidance | NASA-HDBK-5010 Volume 1 Revision A, 2023, 380 pages; Volume 2 Revision A, 2024, 527 pages | Explains composite BBA, DTA/IDMP/RTD, NDE, proof limits, impact, delamination, VCCT/CZM examples and detected-flaw boundaries | Spaceflight fracture-control handbook and examples; not a universal robot certification code, solver manual or substitute for tests |
| Active requirement boundary | NASA-STD-5019A Change 4, revalidated 2025-09-05, 120 pages | Requires BBA, test-supported composite damage tolerance, environment, NDE, traceability and technical-authority review | Requirements apply by program scope; used here as a rigorous process example rather than automatic product law |
| Failure-criterion lineage | S. W. Tsai and E. M. Wu, `A General Theory of Strength for Anisotropic Materials`, 1971, pp. 58-80 / AFML-TR-71-12 | Introduces coordinate-invariant tensor polynomial, tension/compression asymmetry and independent interaction terms | Scalar failure surface does not identify damage mode, progressive degradation or ultimate structure failure; full interaction data may be unavailable |

## Source-processing record
- `nasa-cr-224-tsai-1965.pdf`: 105 pages. Contents, derivations, cross-ply/angle-ply examples, thermal warping, experimental comparisons, conclusions and appendices inspected.
- `nasa-hdbk-5010-vol1.pdf`: 380 pages. Definitions, classification, composite BBA guidance, NDE, proof, process, detected flaws and traceability inspected.
- `nasa-hdbk-5010-vol2.pdf`: 527 pages. Section 7.4 examples, Section 10 composite examples and Section 11.9 delamination/VCCT/CZM guidance inspected; blank scanned appendices are not treated as textual evidence.
- `nasa-std-5019a-change4.pdf`: 120 pages. Sections 7.4, 7.5.3, 8.1.2-8.1.5 and 8.2-8.3 inspected.
- Tsai-Wu 1971 journal metadata and abstract checked against DOI; the standalone source article uses the fully accessible NASA CR-224 rather than reconstructing an inaccessible full text from secondary summaries.

## Full-scope map

| Topic | Must cover | Depth | Risk if omitted |
|---|---|---|---|
| Material hierarchy | fibre, matrix, interface, lamina, laminate | deep | Composite is treated as a light isotropic metal |
| Coordinate transform | axes, sign, engineering shear, Q/Qbar | deep | Off-axis stress and stiffness are silently wrong |
| Laminate mechanics | z-order, A/B/D, coupling and ply recovery | deep | Average laminate result hides critical ply surfaces |
| Hygrothermal state | cure, temperature, moisture, knockdowns | deep | Residual curvature and weakened matrix disappear |
| Ply failure | maximum stress, interaction surfaces, modes and first ply | deep | A scalar FI becomes an unsupported ultimate claim |
| Details and joints | holes, bearing/bypass, bonded ends, inserts, ply drops | deep | Actual load introduction is absent from a coupon model |
| Delamination | free-edge/interlaminar stress, G, VCCT/CZM | deep | CLT is used for a through-thickness failure it cannot see |
| Impact | BVID, subsurface area, CAI, support and threat | deep | A small dent is declared benign by visual inspection |
| Manufacturing | defects, process, surface preparation and traceability | deep | Material properties are detached from how the part was made |
| Evidence | allowables, BBA, statistics, NDE, proof and component test | deep | One static prototype test certifies unrelated claims |
| Lifecycle | DTA/IDMP/RTD, repair, environment and configuration | deep | Damage and evidence lose part identity over service |

## Narrative sequence
1. Start with why fibre direction makes a composite a designed material, not a material name.
2. Rotate one lamina and build Qbar before stacking plies.
3. Integrate the stack into ABD, then immediately recover ply top/bottom states.
4. Add cure temperature and moisture so zero applied load is not assumed zero stress.
5. Compare failure criteria while separating first-ply, damage mode and ultimate collapse.
6. Move from uniform laminate to holes, inserts, bolted/bonded joints and CLT boundaries.
7. Introduce delamination energy and impact/BVID as through-thickness damage problems.
8. End with manufacturing, NDE, BBA and configuration-controlled release evidence.

## Section and Viz plan

### 01 Constituent and axes
- Viz: fibre orientation and matrix/interface controls change directional load share and weak direction.
- Formula: orthotropic compliance and reciprocity.

### 02 Off-axis lamina
- Viz: rotate one ply under fixed global load and watch material-axis stresses and deformation change.
- Formula: stress transformation and Qbar relation.

### 03 Laminate stack and ABD
- Viz: reorder/add plies and compare A/B/D heatmaps and coupling badges.
- Formula: z-integrals and laminate constitutive equation.

### 04 Coupling and ply recovery
- Viz: symmetric/balanced/unsymmetric controls bend/twist the same membrane-loaded strip and reveal ply top/bottom peaks.
- Formula: strain-through-thickness and stress recovery.

### 05 Hygrothermal state
- Viz: cure-service delta T and moisture move free strain, residual force/moment and warpage.
- Formula: thermal/moisture strain and resultants.

### 06 Ply failure envelope
- Viz: load direction traces a point through maximum-stress and Tsai-Wu envelopes while mode evidence remains separate.
- Formula: Tsai-Wu index and coefficient provenance.

### 07 Progressive damage boundary
- Viz: degrade one ply and observe load redistribution, first-ply versus last-ply state and mesh warning.
- Formula: state-dependent stiffness and energy consistency audit.

### 08 Holes and mechanical joints
- Viz: bearing/bypass ratio, edge distance and clamp control move bearing, net tension, shear-out and pull-through margins.
- Formula: bearing and net-section stress with mode ledger.

### 09 Bonded joint and delamination
- Viz: overlap, adherend stiffness and edge flaw change peel/shear concentration and mixed-mode G point.
- Formula: G components and mixed-mode propagation criterion.

### 10 Impact and CAI
- Viz: impact energy, nose radius, support and laminate change dent proxy, hidden damage and CAI residual strength independently.
- Formula: impact energy ledger and normalized CAI knockdown.

### 11 Manufacturing and NDE
- Viz: flaw type/depth/access choose ultrasound, thermography or visual evidence and expose blind zones.
- Formula: detection-to-residual-threat set relation.

### 12 Building-block release
- Viz: select a failed claim and see which coupon/element/subcomponent/component evidence must be revised.
- Formula: normalized model-test residual and configuration identity.

## Paper/source bundle

### Foundational reconstruction: Tsai NASA CR-224 (1965)
- Reconstruct why anisotropic strength and laminate thermal/mechanical interaction required a materials-plus-structures framework.
- Preserve A/B/D nomenclature, cross-ply/angle-ply experiments, thermal warping and sequential failure discussion.
- Mark early assumptions: plane stress, quasi-homogeneous plies, idealized strengths, glass/epoxy dataset and incomplete degradation mechanism.

### Current reconstruction: NASA-HDBK-5010 Rev A (2023/2024)
- Reconstruct BBA, DTA, IDMP, RTD, NDE/proof boundaries, impact, delamination VCCT/CZM and joint examples.
- Preserve example-specific numbers and explicit cautions: analysis generally insufficient without tests, initiation can be mesh-sensitive, uninspectable regions require a bounded flaw/approach, and examples do not transfer automatically.
- Treat handbook as guidance and NASA-STD-5019A as the governing requirement only where applicable.

## Formula contract
- Every display equation gets exactly one adjacent `FormulaNote`.
- Every `\text{...}` inside KaTeX is Korean.
- Long matrices are split or rendered at a 360 px scale of at least `0.82`; no horizontal scroll.
- Annotation explains why the term exists: coordinate transform, ply contribution, coupling, free strain, interaction, damage driving force or evidence boundary.

## Viz design contract
- Neutral surface with sparse blue for applied load, teal for resistance/evidence, amber for coupling/boundary and red only for failure.
- Curves, layered geometry, direct labels and small multiples replace generic straight-arrow pipelines.
- Every control changes geometry, a curve/point, load share or a decision sentence.
- Stable viewBox and responsive grid; no label or glyph outside 360, 390, 768 and 1440 px.
- Motion is deferred until static causal states, reduced-motion fallback and layout tests are complete.
- No inner horizontal or vertical scrolling.

## Acceptance gate
- All 52 premises map to prose, formula, Viz or explicit model boundary.
- Concept has 12 causal labs and 24 annotated display formulas.
- Foundational and current source articles each have 6 annotated formulas, one mechanism lab and 7 evidence states.
- Source IDs, dates, page counts, author intent and non-transfer boundaries are visible.
- QA checks formula/note parity, raw LaTeX, Korean annotations, overflow, inner scroll, console errors and causal control changes.
- Local build, structural/fracture regression and public-host QA pass before completion.

## 4B/9B replay packets
- 4B: one premise + one primary page slice + one equation + Korean term annotations + one counterexample + one interactive state + one acceptance statement.
- 9B: one causal section or evidence state with prerequisite bridge, coordinate conventions, derivation order, author intent, claim-evidence boundary, failure modes, Viz contract and critic pass.
- Orchestrator retains private-problem construction, source accessibility decisions, cross-section state identity, responsive QA, deployment and provenance.
