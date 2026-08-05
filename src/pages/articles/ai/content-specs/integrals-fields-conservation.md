# 적분·장·보존법칙 content spec

## 0. 역할

이 글은 적분 공식 모음이나 벡터미적분 축약본이 아니다. 위치마다 다른 작은
양을 시스템 전체의 총량, 합력, flux와 balance로 바꾸는 공통 기반이다.

1. `density × 작은 measure`를 더한 합이 적분이 되는 이유를 단위와 함께 읽는다.
2. 선·면·부피 중 어디에 분포한 양인지 먼저 고르고 scalar field와 vector
   field를 구분한다.
3. 분포하중을 합력과 모멘트가 같은 하나의 힘으로 바꾼다.
4. 경계를 통과하는 vector field를 orientation이 있는 flux로 계산한다.
5. 내부의 divergence와 바깥 경계의 net flux가 같은 이유를 shared face
   cancellation으로 확인한다.
6. `storage = inflow - outflow + source`를 control volume과 finite-volume
   cell에서 같은 ledger로 사용한다.

## 1. 독립 질문

1. 왜 단순히 함수값을 더하지 않고 `density × 길이·면적·부피`를 더해야 하는가?
2. Riemann sum의 partition을 잘게 나누면 무엇이 바뀌고 무엇이 보존되는가?
3. `dx`, `ds`, `dA`, `dV`는 장식이 아니라 어떤 기하와 단위를 선택하는가?
4. scalar field와 vector field는 각각 무엇을 저장하며 적분 결과의 shape는
   어떻게 달라지는가?
5. 비균일 분포하중의 합력과 작용선은 왜 0차 모멘트와 1차 모멘트 두 조건이
   필요한가?
6. `F·n`은 왜 vector 전체가 아니라 경계의 법선 방향 성분만 통과량으로 세는가?
7. 닫힌 경계에서 outward normal을 뒤집으면 flux의 부호는 어떻게 바뀌는가?
8. divergence를 작은 cell마다 더하면 왜 내부 face가 사라지고 외부 경계만
   남는가?
9. 정상상태가 아닌 control volume에서 inflow와 outflow가 달라도 왜 모순이
   아닌가?
10. nonuniform grid에서 cell width를 무시하거나 shared face에 두 flux를
    쓰면 어떤 가짜 source가 생기는가?

## 2. 본문보다 먼저 만든 hidden transfer fixtures

공개 본문과 Viz에는 아래 수치를 사용하지 않는다. 최종 본문만 읽은 사람이
기억이 아니라 단위·부호·불변량으로 풀 수 있어야 한다.

### A. Piecewise density의 총량과 centroid

```yaml
domain: 0 <= x <= 4 m
linear_density:
  0 <= x <= 1.5: 2 kg/m
  1.5 < x <= 4: 5 kg/m
derive:
  total_mass: 15.5 kg
  first_moment_about_zero: 36.625 kg*m
  centroid: 2.362903 m
```

성공 조건:

- `kg/m`를 그대로 더하지 않고 각 구간 길이를 곱한다.
- 총량은 `∫λ dx`, 1차 모멘트는 `∫xλ dx`로 구분한다.
- centroid의 단위가 길이로 돌아오는 이유를 분자·분모 단위로 설명한다.

### B. Distributed load의 합력과 작용선

```yaml
beam: 0 <= x <= 4 m
downward_load: w(x) = 2 + 3x kN/m
derive:
  resultant: 32 kN downward
  moment_about_left: 80 kN*m
  line_of_action: 2.5 m from left
decision:
  equivalent_point_force_must_match:
    - total_force
    - moment_about_the_same_origin
```

성공 조건:

- `w(x)`의 면적만 맞춘 힘을 아무 위치에 놓을 수 없다고 말한다.
- `R x_R = ∫xw(x)dx`에서 같은 origin과 부호 convention을 유지한다.
- 합력의 방향과 moment의 회전 부호를 분리한다.

### C. Flux 부호와 orientation

```yaml
region: rectangle 0 <= x <= 2, 0 <= y <= 1
field: F(x,y) = [2x,-y]
outward_flux:
  left: 0
  right: 4
  bottom: 0
  top: -2
  net: 2
volume_check:
  divergence: 1
  area: 2
  integral: 2
```

성공 조건:

- 각 변의 outward normal을 먼저 적고 `F·n`을 계산한다.
- top에서 field가 안쪽을 향하므로 negative flux가 되는 이유를 말한다.
- `∫∂V F·n dA`와 `∫V div(F)dV`의 단위가 같음을 확인한다.

### D. Cell divergence와 global boundary flux

```yaml
cell_widths: [0.5,1.0,1.5]
oriented_face_flux_left_to_right: [-1.0,2.5,0.5,4.0]
per_cell_net_outflow:
  - 3.5
  - -2.0
  - 3.5
cell_average_divergence:
  - 7.0
  - -2.0
  - 2.333333
global:
  volume_integrated_divergence: 5.0
  boundary_flux_right_minus_left: 5.0
```

성공 조건:

- cell-average divergence를 단순 합하지 않고 cell width로 다시 가중한다.
- 내부 face flux가 이웃 두 cell에서 반대 부호로 등장한다고 설명한다.
- global 합에는 왼쪽과 오른쪽 external face만 남는 것을 직접 검산한다.

### E. Unsteady control-volume ledger

```yaml
stored_mass_now: 18 kg
inflow: 4.5 kg/s
outflow: 3.1 kg/s
reaction_source: -0.4 kg/s
derive:
  storage_rate: 1.0 kg/s
  mass_after_6_seconds_if_rates_constant: 24 kg
equivalent_conventions:
  intuitive: storage = inflow - outflow + source
  outward_normal: storage + net_outflow = source
```

성공 조건:

- source의 음수가 내부 소모를 뜻한다고 말한다.
- outward-normal convention의 `net outflow = outflow - inflow`를 사용해 같은
  결과를 얻는다.
- 정상상태를 임의로 가정하지 않고 storage term을 먼저 계산한다.

### F. Nonuniform grid와 conservative face bookkeeping

```yaml
cell_widths: [0.75,1.25,1.5]
cell_density: [2.0,3.0,4.0]
stored_total: 11.25
source_density: [0.2,-0.1,0.4]
integrated_source: 0.625
shared_face_flux_left_to_right: [-0.5,1.2,0.4,2.1]
conservative:
  per_cell_storage_rate: [-1.55,0.675,-1.1]
  global_storage_rate: -1.975
  source_minus_boundary_outflow: -1.975
nonconservative_counterexample:
  cell_2_left_flux: 1.0
  cell_3_left_flux: 0.7
  global_storage_rate: -1.875
  ghost_source: 0.1
```

성공 조건:

- stored total과 integrated source에 cell width가 필요한 이유를 단위로 말한다.
- 같은 internal face는 하나의 numerical flux 값을 공유해야 한다.
- 두 cell이 서로 다른 face flux를 사용하면 global ledger에 남는 차이를
  `ghost source`로 진단한다.

Hidden fixture와 본문의 대응은 일대일 암기가 아니라 다음처럼 절을 가로지르는
전이로 고정한다.

- A: section 2의 `density × measure`와 section 4의 first moment를 함께 사용한다.
- B: section 4의 force·moment 동시 보존을 사용한다.
- C: section 5의 outward orientation과 section 6의 volume check를 함께 사용한다.
- D: section 6에서 internal-face cancellation을 얻고, section 8에서
  nonuniform cell의 `divergence average × cell width` 가중을 가져온다.
- E: section 7의 fixed control-volume ledger를 사용한다.
- F: section 8의 measure weighting과 single shared numerical flux를 함께 사용한다.

## 3. source and intent ledger

| Source | 직접 지지하는 주장 | 작성자가 유도하는 부분 | 작성 의도와 경계 |
|---|---|---|---|
| MIT 18.01 Riemann Integral notes | partition rectangle의 합과 refinement limit | density의 단위를 measure와 곱해 총량 단위로 만드는 일반화 | 엄밀한 Riemann integrability·Lebesgue measure는 내리지 않음 |
| MIT 18.02 Surface Integrals | surface subdivision, `∫_S f dS`, oriented surface와 `∫_S F·n dS` | line·area·volume measure를 한 `density × measure` 언어로 묶는 서사 | smooth bounded surface를 기본 가정하고 singular surface는 defer |
| MIT 18.02 Lecture 20 transcript | `dr=T ds`, `F·dr=F·T ds`, tangent projection과 path direction | scalar line density `∫_C λ ds`와 vector work integral의 차이 | 기존 짧은 FTLI 발췌에는 tangent 정의가 없으므로 이 transcript를 owner로 둠 |
| MIT 18.02 FTLI notes | conservative gradient field, path independence와 closed-loop integral | 이 글의 상위 handoff에서만 conservative field를 짧게 구분 | potential·curl·Stokes theorem 전체는 다루지 않음 |
| MIT 1.050 Solid Mechanics exercises | 정역학의 resultant·moment 개념, 원주를 따라 분포한 pressure를 적분해 합력을 구하는 사례 | 이 원문을 일반 beam-load first-moment 공식의 직접 출처로 사용하지 않음 | 1.050은 분포량을 미소 기여로 합하는 보조 사례만 맡음 |
| David Roylance, *Statics of Bending* notes (MIT OCW hosted) | 일반 beam load의 `R=∫w dx`, `M_O=∫xw dx=Rx_R`, triangular load의 centroid 작용선과 moment equilibrium | Riemann sum의 `density × measure`와 이 정역학 식을 한 서사로 연결 | 과목번호를 문서 안의 사실처럼 귀속하지 않으며 shear/moment diagram·bending stress 전체는 구조역학 글 책임 |
| MIT 18.02 Divergence Theorem | volume divergence와 closed-surface flux의 equality, domain 분할 시 opposite normal의 internal-face cancellation | 1D cell ledger를 divergence theorem의 discrete analogue로 단순화 | theorem의 일반 proof 조건과 differential forms는 defer |
| MIT 2.25 Control Volume Laws | fixed/moving CV 정의, outward normal, storage + net outward transport = supply 형태 | 초심자용 `storage=in-out+source`로 같은 부호를 재배열 | 본문은 fixed control volume·단일 scalar quantity를 기본값으로 제한 |
| MIT 2.29 Finite Volume Methods | integral conservation law, contiguous CV, local/global conservation, surface-integral cancellation | 1D nonuniform grid fixture와 ghost-source counterexample | OCR 수식은 인용하지 않고 PDF 원본에서 기호·부호를 재확인 |

캐시:

```text
.codex-tmp/integrals-fields-conservation-sources-2026-07-30/
```

PDF, 추출 text와 `SHA256SUMS`를 함께 보관한다.

## 4. history stop rule

다음 판단이 가능해지는 첫 지점에서 역사와 수학 하향을 멈춘다.

- density와 measure의 단위를 보고 올바른 적분을 고른다.
- partition refinement가 coarse approximation의 오차를 줄이는 이유를 말한다.
- 분포하중의 합력과 작용선을 force·moment 두 조건으로 계산한다.
- surface orientation을 정하고 flux 부호를 계산한다.
- divergence theorem을 internal-face cancellation으로 설명한다.
- fixed control volume의 storage·inflow·outflow·source ledger를 닫는다.
- nonuniform cell의 measure와 shared numerical flux로 discrete conservation을
  검산한다.

Newton·Leibniz의 역사, measure theory, differential forms, 일반 tensor
calculus, full continuum mechanics, moving/deforming control-volume 일반식,
Navier–Stokes 유도, Stokes theorem, finite-volume solver의 reconstruction과
Riemann solver 전체로 내려가지 않는다. 이 지식은 hidden A–F의 판단을 바꾸지
않는다.

## 5. 이웃 글과 책임 분리

```yaml
this_article:
  owns:
    - Riemann sum and density-times-measure units
    - line, surface and volume accumulation
    - scalar and vector field distinction
    - distributed-load resultant and first moment
    - oriented flux and divergence theorem
    - fixed control-volume balance
    - discrete shared-face cancellation
calculus_computational_graphs:
  owns:
    - local derivative, gradient, Jacobian and chain rule
ode_phase_plane:
  owns:
    - storage rate를 시간에 적분해 trajectory를 만드는 solver
    - step error, event and boundary integration
signals_systems:
  owns:
    - time signal, convolution, sampling and LTI state
structural_mechanics:
  owns:
    - FBD, section stress, deflection, fatigue and thermal evidence
fracture_mechanics:
  owns:
    - stress intensity, energy release rate, crack growth and inspection decision
tribology:
  owns:
    - contact pressure, lubrication PDE, heat and wear law
finite_volume_or_cfd_future:
  owns:
    - PDE-specific flux model, reconstruction, limiter, Riemann solver and convergence
```

이 글은 상위 공학식을 대신 풀지 않는다. 대신 상위 글에서 분포량을 합력,
energy, mass와 heat ledger로 바꿀 때 필요한 `무엇을 더하는가`, `어느 방향이
양수인가`, `내부 경계가 왜 사라지는가`를 제공한다.

## 6. 최종 서사

1. `why-accumulation`: point value와 system total의 차이를 물·하중·열 사례로
   묶는다.
2. `sum-to-integral`: 작은 조각의 `density × measure`와 partition refinement,
   단위 검산을 만든다.
3. `domain-and-fields`: `dx`, `ds`, `dA`, `dV`, scalar/vector field와 적분
   결과의 shape를 분리한다.
4. `resultant-moment`: distributed load를 같은 force와 moment를 만드는
   equivalent point force로 바꾼다.
5. `oriented-flux`: boundary orientation, normal projection과 inward/outward
   flux 부호를 계산한다.
6. `divergence-local-global`: local divergence를 cell별로 합해 internal face가
   사라지고 outer boundary만 남는 것을 보인다.
7. `control-volume-ledger`: storage, inflow, outflow, source와 정상/비정상
   상태를 한 ledger로 닫는다.
8. `discrete-conservation`: nonuniform cell quadrature와 shared numerical
   flux, ghost source를 비교한다.
9. `return-up`: 구조역학, fracture, tribology·thermal과 이후 conservative
   simulation 글로 복귀한다.

각 section은 `왜 필요한가 → 일상 직관 → 단위 → 수식 → 작은 숫자 예 →
Viz 조작 → 실패 경계 → 다음 section handoff` 순서를 따른다. 첫 절 직후에
뜬금없는 scene을 놓지 않는다. 본문이 독자에게 질문과 대상을 먼저 만든 뒤
Viz가 그 원인을 조작하게 한다.

## 7. formula and explanation contract

모든 display KaTeX 바로 아래에 `FormulaNote`를 둔다. `FormulaNote`는 기호
사전에서 멈추지 않고 연산 선택 이유와 부호 convention을 설명한다.

필수 수식:

```text
Q ≈ Σ ρ(x_i*) Δμ_i  →  Q = ∫_Ω ρ dμ
m = ∫ λ ds,  Q_A = ∫_A q dA,  Q_V = ∫_V ρ dV
R = ∫_0^L w(x) dx
M_O = ∫_0^L x w(x) dx = R x_R
Φ = ∫_S F·n dA
∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z
∫_V ∇·F dV = ∮_{∂V} F·n dA
d/dt ∫_V q dV + ∮_{∂V} F·n dA = ∫_V s dV
ΔQ = Q̇_stored Δt,  Q(t₀+Δt) = Q(t₀) + ΔQ
ΔV_i dq_i/dt + Σ_f F_f A_f = s_i ΔV_i
```

설명 필수:

- `dμ`는 하나의 추상 기호를 자랑하기 위한 것이 아니라 현재 domain이 선인지,
  면인지, 부피인지에 따라 `ds`, `dA`, `dV`로 바뀌는 measure 자리다.
- `F·n`은 접선 방향 이동을 통과량에서 제거하고 경계를 뚫는 법선 성분만
  남긴다.
- closed surface에서 `n`은 outward로 고정한다. inward convention을 택하면
  전체 flux 부호가 함께 바뀐다.
- divergence theorem은 local source를 새로 만드는 식이 아니라 같은 net
  transport를 volume과 boundary 두 관점으로 읽는 식이다.
- source `s`는 boundary를 통하지 않고 cell 내부에서 생성·소멸하는 양이다.
- 일정한 storage rate에 경과 시간을 곱하면 누적 변화량이 된다. Rate가
  시간에 따라 달라지면 단순 곱 대신 시간 적분이 필요하다.
- shared face는 이웃 cell의 outward normal이 반대이므로 하나의 flux가 자동으로
  `+/-` 쌍을 이루어야 한다.

긴 수식은 `min-w-0` wrapper 안에서 MathFormula의 scale-to-fit을 사용한다.
390 px에서 0.9 미만으로 축소되지 않도록 multi-line `aligned`나 두 식으로
분할하고, 축소 뒤 실제 수식 글자는 9 px 미만이 되지 않게 한다. 모바일에서
수평 스크롤로 회피하지 않는다. `underbrace`의 설명은 모두 한글로 쓰고 짧은
phrase로 제한한다.

## 8. causal Viz 계약

공통 UI:

- `figure`는 `overflow-hidden`, 내부 grid는 모두 `min-w-0`를 사용한다.
- 390 px에서 figure 자체의 horizontal overflow는 0이어야 한다.
- button·slider·segmented control의 최소 hit area는 44 px다.
- SVG는 고정 `viewBox`와 `w-full h-auto`, 좌우 label safe margin을 둔다.
- 검정·흰색만 쓰지 않는다. 청록은 누적, amber는 moment, blue는 flux,
  rose는 오류처럼 의미가 있는 accent만 제한적으로 쓴다.
- 선은 `strokeLinecap="round"`와 적절한 굵기 계층을 사용한다. 모든 edge를
  같은 두꺼운 직선으로 그리지 않는다.
- transition은 숫자와 geometry의 인과를 보여 주되 `prefers-reduced-motion`을
  존중한다.

### 8.1 PartitionRefinementLab

- controls: partition count `N`, density profile `uniform/ramp/piecewise`
- visible data: 각 cell의 width, sample density, rectangle contribution,
  approximate total, exact total, absolute error
- causal change: `N`을 늘리면 rectangle width와 error가 줄고 total의 단위는
  유지된다.
- invariant: contribution은 항상 `density × cell width`다.
- forbidden: rectangle 색만 바꾸고 값이 그대로인 animation

### 8.2 DomainMeasureLab

- controls: domain `line/surface/volume`, field output `scalar/vector`
- visible data: 선택한 geometry, `dμ`가 바뀐 `ds/dA/dV`, density unit,
  measure unit, contribution unit, 적분 결과의 scalar/vector shape
- causal change: 같은 숫자 2라도 line density, area density, volume density의
  denominator와 total이 달라진다. vector field를 고르면 component별 contribution이
  더해져 결과도 vector로 남는다.
- invariant: `density unit × domain measure unit = total unit`
- forbidden: 용어 네 개를 표나 정적 카드로만 나열

### 8.3 ResultantLineOfActionLab

- controls: load shape `uniform/triangular/trapezoid`, peak load, span
- visible data: distributed arrows, area contribution, resultant arrow, origin,
  total force, moment, line-of-action coordinate
- causal change: load의 오른쪽 비중을 늘리면 force와 moment가 변하고
  resultant arrow가 오른쪽으로 이동한다.
- invariant: distributed load와 point resultant의 force·moment가 동시에 같다.
- failure state: force만 맞춘 arrow를 `span/4`의 임의 위치에 두어 모든 load
  profile에서 moment residual이 보이는 counterexample

### 8.4 FluxOrientationLab

- controls: field direction angle, surface orientation `outward/inward`,
  surface tilt
- visible data: vector `F`, unit normal `n`, tangent component, normal projection,
  signed `F·n`
- causal change: field를 tangent로 돌리면 flux가 0, normal을 뒤집으면 부호가
  바뀐다.
- invariant: vector length가 같아도 normal projection만 flux에 기여한다.

### 8.5 DivergenceFieldLab

- controls: vector field preset `source/mixed/balanced`
- visible data: 2D arrow field, four signed face fluxes, coordinate divergence,
  rectangle area, boundary net, volume integral, theorem residual
- causal change: `F=(ax,by)`의 `a,b`가 바뀌면 arrow 방향과 각 face flux가
  함께 바뀌고 `(a+b) area`가 boundary net과 계속 같아야 한다.
- invariant: nonzero face flux가 있어도 inward와 outward contribution이
  상쇄되면 divergence integral과 boundary net은 모두 0이다.
- public worked value: `F=(x,0.5y)`, rectangle `2.5×1.5`; hidden C와 함수,
  domain, 수치가 모두 다르다.

### 8.6 InternalFaceCancellationLab

- controls: number of cells, selected internal face, face flux profile
- visible data: cell별 left/right outward contribution, divergence average,
  폭을 빼고 더한 잘못된 divergence 합, volume-weighted total, external
  boundary flux
- causal change: internal face 값을 바꾸면 이웃 두 cell 값은 반대로 바뀌지만
  global total은 유지된다.
- invariant: internal face pair sum은 정확히 0이다.
- failure state: 한쪽 normal을 잘못 쓰면 uncancelled residual이 표시된다.

### 8.7 ControlVolumeLedgerLab

- controls: inflow, outflow, internal source/sink, elapsed time
- visible data: 저장 tank level, four ledger terms with units, storage rate,
  steady/unsteady state, predicted amount
- causal change: inflow/outflow/source를 바꾸면 storage rate와 tank level이
  함께 바뀐다. elapsed time을 바꾸면 `initial + storage rate × elapsed`로
  predicted amount가 바뀐다.
- invariant: `storage - inflow + outflow - source = 0`
- failure state: storage term을 지운 가짜 steady-state balance

### 8.8 ConservativeGridLab

- controls: grid `uniform/nonuniform`, mode `shared/split face flux`, selected
  internal face
- visible data: cell width, density, stored amount, integrated source, face flux,
  per-cell residual, global residual
- causal change: width를 바꾸면 density가 같아도 stored amount가 바뀐다.
  split mode에서는 ghost source가 나타난다.
- invariant: shared mode에서 per-cell 식을 더하면 internal face가 사라지고
  global boundary ledger와 정확히 같다.

## 9. section implementation map

| Section | 깊이 | 핵심 변수와 단위 | Source anchor | Viz |
|---|---|---|---|---|
| why-accumulation | deep | point density, total | MIT 18.01 | 다음 Viz를 위한 concrete setup |
| sum-to-integral | deep | `Δx`, density/unit-length, contribution, error | MIT 18.01 | PartitionRefinementLab |
| domain-and-fields | deep | `ds`, `dA`, `dV`, scalar/vector output shape | MIT 18.02 line/surface notes | DomainMeasureLab |
| resultant-moment | deep | `w` kN/m, `R` kN, `M` kN·m, `x_R` m | MIT 1.050 + David Roylance, *Statics of Bending* (MIT OCW hosted) | ResultantLineOfActionLab |
| oriented-flux | deep | `F`, unit normal, `F·n`, area | MIT 18.02 surface integrals | FluxOrientationLab |
| divergence-local-global | deep | coordinate divergence, cell volume, boundary flux | MIT 18.02 divergence theorem | DivergenceFieldLab + InternalFaceCancellationLab |
| control-volume-ledger | deep | storage/time, in/out/source rates | MIT 2.25 | ControlVolumeLedgerLab |
| discrete-conservation | deep | `ΔV_i`, source density, numerical face flux | MIT 2.29 PDF | ConservativeGridLab |
| return-up | brief | upper-path quantities | existing article sources | route handoff band |

## 10. 오개념과 실패 경계

- 적분은 항상 "그래프 아래 면적"이다: 1D의 그림일 뿐이며 실제 의미는
  density와 domain measure가 정한다.
- sample 수를 늘리면 무조건 정확하다: integrand의 불연속, singularity와
  quadrature rule에 따라 별도 조건이 필요하다. 이 글은 bounded piecewise-smooth
  예를 사용한다.
- `∫F dA`가 flux다: orientation이 있는 flux는 `∫F·n dA`다.
- outward flux는 항상 양수다: field가 경계 안으로 향하면 local contribution은
  음수다.
- divergence가 양수면 모든 방향으로 field가 양수다: divergence는 한 점
  주변의 net outflow rate이지 개별 component의 부호가 아니다.
- inflow와 outflow가 같지 않으면 conservation이 깨졌다: storage와 source가
  차이를 설명할 수 있다.
- cell average를 그냥 더하면 global total이다: nonuniform grid에서는 cell
  measure로 가중해야 한다.
- 양쪽 cell이 각자 더 정확한 face flux를 쓰면 좋다: shared face에서 두 값이
  다르면 local 식을 더할 때 가짜 source가 남는다.

## 11. 공개 예제와 hidden fixture 분리

공개 본문과 Viz는 다음 숫자를 쓴다.

- partition: `ρ(x)=1+0.5x`, `[0,3]`
- domain measure: line `3 m`, area `6 m²`, volume `12 m³`, density magnitude `2`
- distributed load: triangular `0→6 kN/m`, span `3 m`
- flux: constant field와 기울어진 선분 또는 작은 2D box
- divergence field: `F=(x,0.5y)`, rectangle `2.5×1.5`, plus mixed/balanced presets
- internal cancellation: nonuniform 3-cell widths `[0.8,1.15,1.5]`,
  left-to-right face flux `[-2,1.5,2,5]`
- control volume: inflow `5`, outflow `3`, source `0.5`
- finite volume:
  - cell widths `[0.8,1.1,1.6]`
  - density `[1.5,2.5,3.25]`
  - source density `[0.15,-0.2,0.35]`
  - shared face flux `[-0.8,1.1,0.6,2.4]`
  - split counterexample는 선택한 face 하나만 `0.85` 또는 `0.9`로 바꿈

hidden A–F의 함수, domain, 수치와 오류 패턴을 공개 예제에 그대로 노출하지
않는다. 본문은 계산 답안을 암기시키지 않고 다음 재사용 절차를 가르친다.

```text
domain 선택
→ density와 measure의 단위 확인
→ orientation과 부호 convention 고정
→ local contribution 계산
→ 합산
→ global invariant로 검산
→ 상위 문제로 복귀
```

## 12. 상위 경로 회수 계약

- Robot Structural Mechanics:
  - distributed load를 force·moment로 바꾸는 이유
  - area integral이 section resultant와 geometric moment를 만드는 이유
- Fracture Mechanics:
  - energy density나 crack-growth rate를 경로·영역에 걸쳐 누적하는 언어
  - 이 글은 J-integral 자체를 유도하지 않고 domain·orientation·units만 넘긴다.
- Tribology and Thermal:
  - pressure distribution을 total normal load로 바꾸는 area integral
  - heat storage와 loss를 fixed control-volume ledger로 읽는 법
- Future conservative simulation:
  - finite-volume method가 PDE 이름보다 먼저 local/global conservation을
    보존하도록 설계되는 이유

각 bridge는 해당 상위 글의 독립 질문 앞에 무조건 삽입하지 않는다. 실제로
분포량→총량 또는 balance가 처음 필요한 위치에 `InternalLink`로 연결한다.
등록 책임은 `foundationScienceGaps`, `foundationMathBridges`의 structural,
fracture, tribology key와 `learning-paths.ts`의 `ai-math-change-foundations`,
`ai-robot-structural-mechanics`, `ai-robot-fracture-mechanics` step에 둔다.
`ai-robot-contact-tribology`에도 같은 글을 두어 pressure area integral과
thermal control-volume ledger에서 아래로 이동할 수 있게 한다.

## 13. 검증 계약

구조:

- metadata의 9개 section id와 실제 DOM id가 일치한다.
- display formula 수와 `FormulaNote` 수가 일치한다.
- literal `\theta`, `\int`, `\nabla`가 일반 text node에 노출되지 않는다.
- 모든 `underbrace` 설명은 한글이다.
- 8개 Viz root에 stable `data-*` selector와 current numeric state가 있다.

상호작용:

- Partition: `N` 증가 후 error가 감소한다.
- Resultant: triangular direction 전환 후 line of action이 이동한다.
- Flux: normal reverse 후 signed flux가 정확히 부호 반전한다.
- Divergence field: preset을 바꿔도 boundary net과 volume integral이 같고,
  balanced preset에서는 nonzero face flux가 상쇄되어 net이 0이다.
- Cancellation: internal flux 변경 후 global total은 유지된다.
- Ledger: source 변경 후 storage rate가 같은 양만큼 바뀐다.
- Grid: shared→split 전환 후 global residual이 0이 아니게 된다.

반응형:

- 390×844, 768×1024, 1440×900에서 document와 모든 figure의 horizontal
  overflow가 0이다.
- 모든 control은 최소 44×44다.
- formula wrapper는 box 밖으로 벗어나지 않고 scale-to-fit 결과를 기록한다.
- console error와 hydration warning이 없다.

사후 감사:

1. math·physics sign/unit/source responsibility
2. hidden A–F transfer sufficiency
3. Viz causality and responsive composition
4. upper-path links and minimal-floor stop rule

각 감사의 strict `ACCEPT` 뒤에만 배포한다.
