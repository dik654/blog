# Robot Fracture Mechanics & Damage Tolerance content spec

## Beginner-entry contract (2026-08-01)

- 첫 화면은 작은 찢김에서 종이가 계속 찢어지는 장면으로 균열 끝의 크기 효과를 먼저 느끼게 한다.
- `K`, `G`, `FAD`, `POD`보다 먼저 흠집을 모양으로 바꾸고, 자라게 하는 힘을 세고, 다음 검사 시점을 정하는 순서를 제시한다.
- 순서는 `BeginnerOpening -> QuestionLead -> technical section -> ConceptPrimer -> formula/evidence`를 지킨다. 아래 private transfer problem의 깊이는 줄이지 않는다.

## Goal
- Structural Mechanics의 nominal stress and fatigue screen을 `실재하거나 가정한 결함 -> crack driving force -> crack resistance -> growth history -> residual strength -> inspection and tracking` 사슬로 확장한다.
- 수식 하나로 safe/unsafe를 선언하지 않고 geometry, constraint, plasticity, spectrum, environment, NDE capability and evidence가 맞물린 engineering decision을 만든다.

## Reader contract
- 본문에는 정답 맞히기용 문제가 등장하지 않는다.
- 작성자는 아래 private transfer problem을 먼저 풀고 premise별 coverage를 감사한다.
- 독자는 article만 읽은 뒤 unseen metallic robot structure의 flaw를 이상화하고, LEFM 적용 가능성을 판단하고, residual strength and inspection plan까지 하나의 traceable ledger로 만들 수 있어야 한다.

## Private hardest transfer problem

Outdoor inspection robot의 hollow 7075-T73 shoulder shaft에 bearing-seat fillet과 cross-drilled lubrication hole이 있다. 제조 NDE 이후 smallest qualified surface flaw는 depth 0.45 mm, half-length 1.4 mm이며, service inspection에서 hole edge에 1.0 mm x 3.2 mm semi-elliptical indication이 발견되었다. Shaft는 bending-dominant spectrum, start-stop torsion and emergency brake load를 받는다. Welded steel housing의 tensile residual stress도 bearing reaction에 더해진다. Temperature range는 -25 to 75 C이고 marine chloride exposure가 가능하다. Coupon database에는 `K_Ic`, several-R fatigue crack-growth curves and yield strength가 있지만, component thickness는 coupon과 다르다. FEA reports a high notch stress, NASGRO-style analysis predicts surface-to-through transition, and inspection vendor quotes a 90/95 detection capability for one probe orientation.

다음 판단을 한 번에 닫는다.

1. Notch, manufacturing discontinuity and crack-like flaw를 구분하고 detected indication을 어떤 planar crack geometry로 이상화할지 결정한다.
2. Surface, corner, embedded and through crack의 `a`, `c`, front coordinate and reference plane을 선언한다.
3. Mode I/II/III 중 어떤 crack-tip deformation이 지배적인지 load and crack plane으로 판단한다.
4. Nominal stress, local notch stress and crack-tip singular field를 같은 값으로 중복 사용하지 않는다.
5. Griffith energy balance로 crack length가 커질수록 critical stress가 낮아지는 이유를 설명한다.
6. `K=Y sigma sqrt(pi a)`에서 `Y`가 geometry, finite width, surface and loading mode를 담는다는 것을 보인다.
7. Near-tip `1/sqrt(r)` field가 실제 infinite stress를 뜻하지 않고 plastic/process zone에서 continuum LEFM이 끊기는 것을 설명한다.
8. Plane stress/plane strain constraint and thickness가 measured toughness choice를 어떻게 바꾸는지 판단한다.
9. Plastic-zone size and remaining ligament로 small-scale yielding validity를 screen하고, 실패하면 elastic-plastic method or test로 넘어간다.
10. Critical crack size and residual strength를 서로 역문제로 계산하고 geometry factor가 crack growth와 함께 바뀜을 반영한다.
11. `Delta K`, load ratio `R`, threshold, closure and near-instability regimes를 구분하고 Paris law의 중간 구간만 사용한다.
12. Overload retardation을 자동 credit하지 않고 load order, dwell and environment effect를 spectrum에 유지한다.
13. Surface crack의 depth and aspect ratio가 함께 변하고 through-wall transition이 analysis discontinuity가 될 수 있음을 처리한다.
14. Mechanical primary stress, residual stress and thermal secondary stress가 SIF and plastic collapse에 서로 다르게 들어감을 분리한다.
15. FAD의 `K_r` and `L_r`가 fracture and collapse interaction을 함께 screen하는 좌표임을 설명한다.
16. Detection result 하나를 exact crack size로 취급하지 않고 NDE method, access, orientation and probability-of-detection boundary를 연결한다.
17. Assumed initial flaw를 NDE/proof/process capability에 맞추고 analyzed flaw보다 실제 screening capability가 나쁘지 않은지 확인한다.
18. Remaining-life output을 곧바로 inspection interval로 쓰지 않고 uncertainty/life factor and observable crack window를 둔다.
19. Proof test가 flaw를 screen하는 동시에 grow시킬 수 있어 pre/post NDE and test evidence가 필요함을 설명한다.
20. Material lot, orientation, heat treatment, environment, model version, load spectrum, inspection and repair history를 part identity에 묶어 추적한다.
21. NASGRO and another solver의 SIF/FAD discrepancy가 local/global reference stress, toughness choice or crack transition 중 어디서 생겼는지 진단한다.
22. Hand solution, FEA/weight function, crack-growth software, coupon test, NDE demonstration and component test가 서로 다른 claim을 닫도록 계획한다.

## Private premise gate

| IDs | Premises the article must make usable | Gate |
|---|---|---|
| F01-F05 | flaw vocabulary, indication-to-crack idealization, geometry and coordinates | Reader does not feed an image dimension into a solver without an analysis crack model |
| F06-F09 | deformation modes, energy balance, G and resistance | Reader explains why crack size changes allowable stress |
| F10-F14 | K, geometry factor, superposition, near-tip field | Reader separates nominal stress, notch field and crack driving force |
| F15-F19 | plastic zone, small-scale yielding, constraint, toughness, thickness | Reader can reject invalid LEFM or invalid toughness transfer |
| F20-F23 | critical crack, residual strength, surface-front evolution, transition | Reader treats geometry as state, not a fixed scalar |
| F24-F30 | Delta K, R, threshold, Paris region, full-range growth, order/environment | Reader does not extrapolate a Paris line across all regimes |
| F31-F34 | primary/secondary/residual stress, FAD Kr/Lr and limit load | Reader combines fracture and plastic collapse without mixing load classes |
| F35-F40 | NDE/POD, assumed initial flaw, inspection interval, proof test | Reader links analysis initial condition to a real screening capability |
| F41-F46 | uncertainty/life factor, verification, correlation, traceability, repair | Reader closes a damage-tolerance claim with evidence and configuration history |

## Primary source anchors

| Area | Source | Why it matters | Boundary |
|---|---|---|---|
| Foundational energy criterion | A. A. Griffith, “The Phenomena of Rupture and Flow in Solids,” 1921, all 37 PDF pages | Introduces surface-energy balance, flaw-size scaling and glass tests | The final author note says the cracked-plate strain-energy calculation and numerical equations 6-13 require correction; molecular orientation sections are historical, not modern mechanism |
| LEFM bridge | NASA-TM-103591, C. D. Wilson, 1992, 82 PDF pages | Griffith-to-Irwin bridge, modes, near-tip field, plastic-zone screens, toughness, growth, NDE/proof basics | Primer/rules of thumb are not current certification requirements or product allowables |
| Current process boundary | NASA-STD-5019A w/Change 4, revalidated 2025-09-05, 120 pages | Design-analysis-test-NDE-tracking chain, assumed flaw, load spectrum, life factor, 90/95 NDE linkage | Human-rated spaceflight requirement; used as a rigorous process example, not automatically imposed on robots |
| Current calculation report | NASA/CR-20250011200, Cardinal, Lee & Hunt, 2025, 109 pages | NASGRO FFS, FAD, full-range growth, residual stress, material choices, four examples and solver discrepancies | Guidance for API 579-style pressure-system FFS; not a substitute for NASGRO manual/API 579 and examples are notional |

## Source-processing record
- `griffith-1921.pdf`: 37 PDF pages. Every page visually inspected, including equations, glass bulbs/fibres, molecular-theory sections and the final correction note.
- `nasa-cr-20250011200.pdf`: 109 PDF pages. Text, figures and tables inspected; Sections 2-8, four Section 13 examples and Section 14 recommendations reconstructed.
- `nasa-std-5019a-change4.pdf`: 120 PDF pages. Scope/overview, metallic assessment 7.3, flaw screening 8.1, traceability 8.2 and documentation/verification 9 inspected.
- `nasa-lefm-primer-1992.pdf`: 82 PDF pages. Historical bridge, crack-tip field/plasticity, toughness, subcritical growth and fracture-control chapters inspected.

## Full-scope map

| Topic | Must cover | Depth | Risk if omitted |
|---|---|---|---|
| Flaw model | indication, notch, crack-like idealization, interaction and geometry | deep | Solver input has no defensible relation to the observed part |
| Energy balance | released elastic energy, crack resistance, critical condition | deep | K becomes an unexplained lookup formula |
| Local field | modes, coordinates, singular asymptote and K | deep | Peak stress and K are double-counted |
| Geometry factor | finite width, surface/front, stress gradient, superposition | deep | `Y=1` is silently used for the wrong part |
| Constraint/toughness | plane stress/strain, thickness, orientation, temperature | deep | Coupon toughness is transferred outside its validity |
| LEFM validity | plastic zone, ligament, yielding, elastic-plastic handoff | deep | Precise K result is reported for an invalid model class |
| Residual strength | critical crack, allowable stress, surface-to-through evolution | deep | Inspection limit and final failure state are disconnected |
| Crack growth | Delta K, R, closure, threshold, Paris, instability, sequence | deep | One straight line predicts the entire service history |
| Load/environment | residual, thermal, dwell, corrosion/EAC and spectrum | deep | Static or time-dependent driving forces disappear from life prediction |
| FAD | Kr, Lr, FAL, primary vs secondary load | deep | Fracture and plastic collapse are screened independently when they interact |
| NDE/POD | method, access, orientation, 90/95 capability and assumed flaw | deep | “No indication” is interpreted as “no flaw” |
| Inspection/proof | detectable window, interval, life factor, pre/post proof NDE | deep | Model life becomes an unqualified calendar interval |
| Evidence/traceability | hand/FEA/software/coupon/NDE/component correlation and configuration | deep | Re-analysis cannot reproduce which part and assumptions were cleared |
| Composite damage | delamination, BVID, anisotropic growth | defer | Metallic K-based story would create false transfer to laminates |

## Narrative sequence
1. Start from an inspection indication and force an explicit analysis crack model.
2. Use Griffith to explain why a flaw changes the energy ledger before introducing K.
3. Zoom into the crack tip, then immediately mark where the elastic asymptote stops being physical.
4. Separate nominal load, geometry factor, constraint and material resistance.
5. Turn one-time fracture into residual-strength and crack-growth trajectories.
6. Add load order, residual stress, temperature and environment before declaring remaining life.
7. Put fracture and plastic collapse on one FAD.
8. Convert NDE capability into initial flaw and remaining-life into an inspection decision.
9. End with verification and traceability: model output is one item in a living fracture-control ledger.

## Section and Viz plan

### 01 Flaw idealization
- Viz: indication dimensions, crack type and interaction selector change `a`, `c`, front and analysis severity.
- Formula: ellipse/front coordinate and interaction envelope.

### 02 Griffith energy balance
- Viz: crack length and applied stress change released-energy and resistance slopes; unstable point is visible.
- Formula: `G=-dPi/dA`, Griffith plate `G=pi sigma^2 a/E'`, critical size/stress.

### 03 Crack-tip modes and K field
- Viz: mode selector changes deformation glyph and angular field, not just color.
- Formula: `sigma_ij=K_I f_ij(theta)/sqrt(2 pi r)+...` with explicit asymptotic boundary.

### 04 Geometry factor and stress decomposition
- Viz: geometry, width and stress-gradient controls change Y and K contributions.
- Formula: `K=Y sigma sqrt(pi a)` and NASA polynomial stress/SIF form.

### 05 Constraint and toughness
- Viz: thickness changes plane-stress/transition/plane-strain state and allowable toughness choice.
- Formula: `G=K^2/E'`, thickness validity screen.

### 06 Plastic-zone and LEFM validity
- Viz: load/crack/yield controls compare plastic zone to crack, ligament and thickness.
- Formula: plane stress/strain plastic-zone estimates and validity ratios.

### 07 Residual strength and crack geometry state
- Viz: crack grows along a front, transitions surface-to-through, residual-strength curve falls.
- Formula: implicit `K(a_c)=K_mat`, `sigma_res=K_mat/(Y sqrt(pi a))`.

### 08 Subcritical crack growth
- Viz: Delta K/R/environment controls move among threshold, Paris-like and instability regimes.
- Formula: Delta K, R, Paris and full NASGRO equation with split annotated lines.

### 09 Spectrum and history
- Viz: reorder same loads and toggle retardation credit; life changes while simple cycle histogram does not.
- Formula: incremental integration `N=int da/(da/dN)` and spectrum state update.

### 10 FAD and residual stress
- Viz: primary and residual/thermal stress move `Lr` and `Kr` differently; trajectory approaches FAL.
- Formula: `Kr=Kapp/Kmat`, `Lr=P/PL`, residual-stress polynomial.

### 11 NDE and inspection interval
- Viz: POD curve, access/orientation and interval move assumed flaw and detectable window.
- Formula: 90/95 definition in words/formula and interval inequality with explicit factor.

### 12 Evidence and traceability
- Viz: select discrepancy and see next falsifying evidence plus ledger readiness.
- Formula: model-test normalized residual and configuration identity.

## Paper/source bundle

### Foundational reconstruction: Griffith 1921
- Reconstruct the author’s actual problem, energy argument, glass tests, fibre size effect and conclusions.
- Preserve the final correction note and separate durable principle from incorrect/outdated coefficients and molecular speculation.
- Do not retroactively claim Griffith derived modern Irwin K, metal plasticity or modern damage tolerance.

### Current reconstruction: NASA/CR-20250011200
- Reconstruct flaw idealization, SIF/load decomposition, FAD, NASGRO full-range growth and four notional examples.
- Preserve material-choice sensitivity, CC27/CC28 >10x life difference, NASGRO/INSPECT Lr discrepancy and recommendations.
- State that the report is guidance, not a substitute for the NASGRO reference manual or API 579.

## Formula contract
- Every display equation gets exactly one adjacent `FormulaNote`.
- Every `\text{...}` inside KaTeX is Korean.
- Long equations are split into aligned causal groups; 360 px acceptance scale is at least `0.82` with no horizontal scroll.
- Annotation answers why each term exists: driving force, geometry correction, constraint, resistance, cycle range, collapse coordinate or evidence normalization.

## Viz design contract
- White/black neutral structure plus sparse blue (driving force), teal (resistance/evidence), amber (boundary) and red (failure).
- Thin curves and direct labels; no generic straight-arrow pipelines or oversized colored blocks.
- Every control changes geometry, a plotted curve, a point position or a decision sentence.
- Stable viewBox and aspect ratio; labels remain inside at 360, 390, 768 and 1440 px.
- Static causal state first. Motion is added later only where time evolution adds information and respects reduced motion.
- No inner horizontal or vertical scrolling.

## Acceptance gate
- All 46 premises map to prose, formula, Viz or explicit defer boundary.
- Concept has at least 12 causal labs and 24 annotated display formulas.
- Current source and foundational paper each have 6 annotated formulas, one mechanism lab and at least 7 evidence states.
- Source URLs, dates, document IDs, page counts and claim boundaries are visible.
- QA checks formula/note parity, raw LaTeX, Korean equation annotations, viewport overflow, inner scroll, console errors and causal control state changes.
- Local build, connected robotics regression and public-host QA pass before status is complete.

## 4B/9B replay packets
- 4B: one premise + one primary page slice + one equation + Korean term annotations + one counterexample + one selector/acceptance state.
- 9B: one full causal section or source evidence state with prerequisite bridge, author intent, derivation order, claim-evidence boundary, failure modes, Viz contract and critic pass.
- Orchestrator retains private-problem construction, source conflict resolution, cross-section state identity, responsive QA, deployment and provenance.
