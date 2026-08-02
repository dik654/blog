# 최적화의 기하 콘텐츠 사양

## Goal

- Reader outcome: variable, objective, feasible set에서 시작해 gradient, Hessian, convexity, KKT와 duality를 하나의 candidate 이동·검증 계약으로 읽고 MPC, trajectory optimization, ML loss에 정확히 옮긴다.
- System invariant: theorem이 보장하는 수학적 optimum, discretized solver가 보고한 approximate solution, 실제 system에서 deadline·model error·generalization을 통과한 결과를 같은 evidence로 취급하지 않는다.

## Source anchors

| Area | Primary source | Why it matters |
|---|---|---|
| Convex set·function, local/global optimum | Boyd & Vandenberghe, *Convex Optimization*, Ch. 2-4 | Convex domain과 convex objective를 함께 요구하는 theorem premise를 고정한다. |
| Lagrangian, duality, KKT | Boyd & Vandenberghe, Ch. 5 | Weak duality, Slater condition, strong duality와 KKT의 necessary/sufficient 방향을 구분한다. |
| Numerical method | Boyd & Vandenberghe, Ch. 9-11; Nocedal & Wright, *Numerical Optimization* | Line search, Newton step, residual, scaling과 approximate termination을 theorem과 분리한다. |
| MPC | Rawlings, Mayne & Diehl, *Model Predictive Control: Theory, Computation, and Design* | Dynamics, horizon cost, hard/soft constraints, online re-solve와 infeasibility 책임을 연결한다. |
| Trajectory optimization | MIT Underactuated Robotics, Ch. 10 | Direct shooting·transcription·collocation, dynamics defect와 conditioning 차이를 연결한다. |
| ML optimization | Goodfellow, Bengio & Courville, *Deep Learning*, Ch. 8 | Ill-conditioning, saddle, stochastic gradient와 training/generalization boundary를 연결한다. |

## Full-scope map

| Topic | Must cover | Depth | Deferred boundary |
|---|---|---|---|
| Problem anatomy | Decision variable, fixed data, scalar objective, equality·inequality constraints, feasible set, infeasible/unbounded cases | deep | Modeling-language syntax |
| Local/global optimum | Neighborhood-relative local optimum, whole-feasible-set global optimum, existence versus uniqueness | deep | Nonsmooth generalized derivatives |
| Gradient | Directional first-order change, stationary point as necessary condition only in unconstrained interior | deep | Stochastic convergence proof |
| Hessian·curvature | Taylor model, eigen-directions, positive/negative/zero curvature, second-order necessary/sufficient tests | deep | Higher-order tensor methods |
| Conditioning | SPD quadratic condition number, gradient-descent stability, scaling/preconditioning, solver residual versus geometric conditioning | deep | Floating-point backward-error proof |
| Convexity | Convex feasible set and convex objective, local-to-global theorem, strict/strong convex distinctions | deep | Convex conjugate calculus |
| Constraints | Active set, feasible directions, boundary optimum, equality versus inequality multipliers | deep | Full constraint-qualification taxonomy |
| Lagrangian·KKT | Primal/dual feasibility, stationarity, complementarity, necessity and sufficiency premises | deep | Fritz John conditions |
| Duality | Dual function as lower bound, weak duality, Slater-based strong duality, gap and sensitivity | deep | Fenchel dual derivation |
| Solver evidence | Status, primal/dual residual, complementarity gap, iterations, runtime, scaling and warm start | deep | Individual solver APIs |
| MPC | Linear-quadratic convex QP boundary, nonlinear/nonconvex boundary, receding horizon, infeasibility and deadline | deep bridge | Stability/recursive-feasibility proofs |
| Trajectory optimization | Discretized states·controls, dynamics constraints, shooting/transcription conditioning, knot versus continuous feasibility | deep bridge | Contact-implicit complementarity |
| ML loss | Empirical nonconvex objective, stochastic gradient, indefinite/singular Hessian, training versus generalization | deep bridge | Optimizer-by-optimizer survey |

## Reader prerequisites

- Gradient: scalar output이 각 coordinate 변화에 얼마나 민감한지 모은 vector.
- Eigenvalue/eigenvector: matrix가 방향을 바꾸지 않고 scale만 바꾸는 방향과 배율.
- Set and inequality: 조건을 동시에 만족하는 후보의 교집합.
- Linear dynamics: 다음 state가 현재 state와 input의 함수라는 최소 control vocabulary.

## Hard transfer suite

본문은 아래 문제를 별도 해설 없이 풀 수 있는 모든 premise와 operation을 공개한다.

### T1. Curvature and conditioning

`f(x)=1/2 x^T diag(1,20)x`, `x_0=(1,1)`에 constant-step gradient descent를 적용한다.

1. Stable learning-rate 범위를 eigen-direction update에서 유도한다.
2. `eta=0.09`일 때 두 축의 contraction factor와 zig-zag 여부를 예측한다.
3. Exact Newton step이 한 번에 origin으로 가는 premise를 찾는다.
4. 두 번째 coordinate를 rescale했을 때 physical candidate와 numerical conditioning 중 무엇이 변하는지 구분한다.

Public locations: `curvature` formula notes, LandscapeExplorer, conditioning ledger.

### T2. Boundary optimum, KKT and duality

`min_u 1/2(u-2)^2` subject to `u-1<=0`를 푼다.

1. Unconstrained stationary point가 infeasible임을 보인다.
2. `u*=1`, `lambda*=1`에서 KKT 네 조건을 각각 검산한다.
3. Strictly feasible point로 Slater premise를 확인하고 zero duality gap의 적용 범위를 말한다.
4. Upper bound를 `b`로 바꿀 때 `dp*/db=-lambda*`의 부호를 해석한다.

Public locations: `constraints` worked example, KKT and dual formulas.

### T3. Nonconvex local/global diagnosis

Gradient가 0인 세 candidate 중 Hessian eigenvalues가 각각 all-positive, mixed-sign, zero를 포함한다.

1. Strict local minimum, saddle, inconclusive case를 구분한다.
2. 어느 경우에도 global optimum이라고 즉시 말할 수 없는 이유를 찾는다.
3. Convex feasible set·objective premise가 추가될 때만 local-to-global conclusion이 생김을 설명한다.

Public locations: `convexity` theorem ledger and `curvature` second-order test.

### T4. MPC formulation and deployment

Linear dynamics, quadratic tracking cost, box input/state constraints를 horizon QP로 쓴다. 이후 obstacle avoidance, soft state constraint, 5 ms deadline과 model mismatch를 차례로 추가한다.

1. 어느 변경이 convexity를 깨뜨리고 어느 변경은 feasible set만 바꾸는지 구분한다.
2. Hard constraint가 infeasible할 때 slack penalty가 해결하는 것과 포기하는 것을 말한다.
3. Solver `optimal` status와 low residual이 closed-loop safety·stability를 입증하지 않는 이유를 설명한다.

Public locations: `deep-learning` application formulation and evidence ladder.

### T5. Trajectory optimization and ML transfer

같은 long-horizon dynamics를 direct shooting과 direct transcription으로 풀고, neural network empirical loss에도 같은 curvature language를 적용한다.

1. Shooting의 `A^N` sensitivity와 transcription의 dynamics defects가 conditioning에 미치는 차이를 설명한다.
2. Knot point constraint satisfaction이 continuous-time collision freedom을 보장하지 않는 이유를 설명한다.
3. Small training gradient, low training loss, low validation loss를 서로 다른 evidence로 분리한다.

Public locations: `deep-learning` application ledger and deployment boundary.

## Section 1: `objective` -- 어떤 값을 바꾸고 무엇을 지키는가

- Concept:
  - Fixed data와 decision variable을 분리한다.
  - Objective는 candidates를 비교한다. Constraints는 candidates를 허용/거절한다.
  - Local optimum은 feasible neighborhood, global optimum은 전체 feasible set에 대한 statement다.
- Key variables:
  - `x in R^n`: solver가 고를 variable. Unit과 scale을 기록한다.
  - `f_0(x)`: scalar objective. 여러 cost term의 unit/weight가 의미를 바꾼다.
  - `f_i(x)<=0`, `h_j(x)=0`: inequality/equality contracts.
  - `F`: constraints의 intersection인 feasible set.
- Execution flow:
  1. Candidate `x`를 만든다.
  2. 모든 constraint로 feasibility를 판정한다.
  3. Feasible candidates 사이에서 objective를 비교한다.
  4. Feasible point가 없으면 infeasible, objective가 끝없이 감소하면 unbounded로 따로 종료한다.
- Design insight:
  - Penalty는 constraint를 objective trade-off로 바꾼다. 큰 weight도 hard feasibility와 동치가 아니다.
- Failure modes:
  - Unit mismatch: objective weight가 물리 단위를 숨긴다.
  - Wrong variable: fixed measurement까지 variable로 두면 다른 문제를 푼다.
  - Empty feasible set: optimizer tuning으로 해결할 수 없는 modeling result다.
- Viz contract:
  - `ConstrainedOptimumLab`은 objective contour, feasible set, active boundary와 KKT normal balance를 한 좌표계에서 보여 준다.
  - Budget slider는 boundary, primal optimum, multiplier와 sensitivity를 함께 바꾼다.
  - 색만으로 구분하지 않고 `∇f`, `λ∇g`, feasible, constraint equation label을 직접 표시한다.

## Section 2: `convexity` -- local minimum이 global이 되는 premise는 무엇인가

- Concept:
  - Convex feasible set은 feasible chord를 보존한다.
  - Convex objective는 chord보다 위로 솟지 않는다.
  - 두 premise가 함께 있을 때 local minimum은 global minimum이다.
- Theorem ledger:
  - Convex: local minimum은 global. Uniqueness는 자동이 아니다.
  - Strictly convex: optimum이 존재하면 최대 하나다.
  - Strongly convex: uniform positive curvature를 주지만 algorithm, step, numerical precision까지 자동 결정하지 않는다.
- Execution flow:
  1. 두 feasible points를 고른다.
  2. Convex combination이 feasible인지 확인한다.
  3. Function chord inequality를 확인한다.
  4. Local basin 밖의 더 낮은 point가 있다고 가정하면 chord 위 가까운 point가 local optimality를 깨뜨린다.
- Failure modes:
  - Convex objective + nonconvex obstacle set: problem은 nonconvex다.
  - Convex set + nonconvex objective: hidden basin이 가능하다.
  - Strict convexity + open/unbounded domain: existence가 보장되지 않을 수 있다.
- Viz handoff:
  - 후속 Viz는 objective와 feasible-set convexity toggle을 따로 둔다.

## Section 3: `curvature` -- gradient step은 왜 느리거나 발산하는가

- Concept:
  - Gradient는 first-order slope다.
  - Hessian quadratic form은 proposed direction의 curvature다.
  - SPD quadratic에서 eigenvalue가 direction별 gradient update scale을 정한다.
- Key equations:
  - Second-order Taylor model.
  - `e_{k+1}=(I-eta H)e_k`.
  - Stability `0<eta<2/lambda_max`.
  - `kappa=lambda_max/lambda_min` for SPD Hessian.
  - Newton step and its invertibility/positive-curvature premise.
- Execution flow:
  1. Gradient가 descent candidate를 만든다.
  2. Hessian eigen-direction마다 multiplier `1-eta lambda_i`를 계산한다.
  3. Magnitude가 1 이상인 축은 유지/발산한다.
  4. Scaling 또는 preconditioning으로 coordinate curvature spread를 줄인다.
  5. Solver는 line search/trust region과 linear-solve residual로 local model의 신뢰 범위를 관리한다.
- Design insight:
  - Large condition number는 geometric progress imbalance다.
  - Bad linear-solve residual과 floating-point range는 numerical evidence다. 같은 말로 합치지 않는다.
- Failure modes:
  - Negative Hessian eigenvalue: raw Newton step이 descent direction이 아닐 수 있다.
  - Zero eigenvalue: inverse와 finite condition number가 없다.
  - Taylor model outside local region: predicted decrease와 actual decrease가 다르다.
- Existing Viz contract:
  - LandscapeExplorer는 `H=diag(1,kappa)`의 exact quadratic만 표현한다.
  - Stable badge는 spectral radius `<1`로 판정한다.
  - 두 eigen-axis multiplier와 displayed-iteration truncation을 보여 준다.

## Section 4: `constraints` -- KKT와 duality는 어느 방향의 증거인가

- Concept:
  - Boundary optimum에서는 objective gradient가 0일 필요가 없다.
  - Active constraint normals와 objective gradient가 Lagrangian stationarity에서 균형을 이룬다.
  - Dual function은 Lagrangian을 `x`에 대해 infimum한 lower bound다.
- KKT premise ledger:
  - Differentiable local optimum + constraint qualification: KKT는 necessary.
  - Differentiable convex problem + KKT candidate: KKT는 sufficient for global optimum.
  - Convex problem + Slater strict feasibility: strong duality; attained optimum에서는 KKT necessity까지 연결.
  - Nonconvex KKT point: local candidate일 뿐 global certificate가 아니다.
- Execution flow:
  1. Primal feasibility를 확인한다.
  2. Inequality multiplier nonnegativity를 확인한다.
  3. Complementarity로 inactive multiplier를 0으로 만든다.
  4. Stationarity로 objective gradient와 active normals를 합친다.
  5. Dual objective를 maximize해 primal lower bound를 올린다.
  6. Gap과 residual을 함께 보고 approximate certificate를 판단한다.
- Worked transfer:
  - `min 1/2(u-2)^2`, `u<=1`.
  - `u*=1`, `lambda*=1`; Slater point `u=0`.
  - Bound relaxation sensitivity `dp*/db=-lambda*`.
- Failure modes:
  - Missing constraint qualification: optimum이어도 chosen multiplier/KKT form이 성립하지 않을 수 있다.
  - Penalty-only solve: small penalty loss가 feasibility를 보장하지 않는다.
  - Zero reported gap with wrong/nonconvex model assumptions: global certificate로 해석할 수 없다.
- Viz contract:
  - Budget를 움직이면 boundary optimum과 multiplier가 함께 바뀌며 primal feasibility, dual value와 stationarity를 같은 state에서 읽는다.
  - 현재 범위는 active linear inequality와 convex quadratic이다. Inactive/nonconvex case는 본문 theorem ledger와 transfer problem으로 분리한다.

## Section 5: `deep-learning` -- MPC, trajectory optimization, ML에서 무엇을 다시 검증하는가

- Concept:
  - 같은 standard form을 쓰더라도 model class와 evidence surface가 다르다.
  - Application은 theorem premise, transcription/model, solver output, deployment observation 네 층으로 감사한다.
- MPC flow:
  1. Measured state를 initial equality로 고정한다.
  2. Horizon states/inputs와 dynamics constraints를 쓴다.
  3. Tracking/control objective와 state/input constraints를 푼다.
  4. First input만 적용하고 다음 measurement에서 다시 푼다.
  5. Convex QP theorem과 deadline, model mismatch, recursive feasibility/stability를 분리한다.
- Trajectory-optimization flow:
  1. Continuous states/controls를 finite knots로 parameterize한다.
  2. Shooting은 simulation으로 states를 제거하고 transcription은 dynamics defects를 constraints로 둔다.
  3. NLP/QP solver가 discretized program의 local candidate를 반환한다.
  4. Dense/continuous dynamics, collision and actuator limits를 재검증한다.
- ML flow:
  1. Dataset minibatch가 noisy empirical gradient를 만든다.
  2. Update가 nonconvex parameter space를 이동한다.
  3. Training objective, validation metric, calibration/robustness를 별도 evidence로 기록한다.
- Evidence ladder:
  - Theorem: exact model과 assumptions 아래의 implication.
  - Transcription: finite-dimensional problem이 intended continuous/system problem을 얼마나 충실히 표현하는가.
  - Solver: status, residual, gap, iteration, runtime과 tolerance.
  - Deployment: deadline, state-estimation/model error, execution violation, validation/generalization.
- Failure modes:
  - MPC soft constraint: feasibility는 회복하지만 safety contract를 cost trade-off로 바꾼다.
  - Trajectory knot validity: between-knot violation을 숨긴다.
  - ML low training loss: generalization이나 deployed safety를 입증하지 않는다.

## Formula contract

- 모든 display formula는 `String.raw`로 작성한다.
- 모든 display formula 안에 operation을 설명하는 한국어 `underbrace`를 둔다.
- 각 display formula 바로 아래에 독립 `FormulaNote`를 둔다.
- `FormulaNote.meaning`은 representation, operation choice, theorem premise와 failure boundary를 함께 설명한다.
- `FormulaNote.symbols`는 symbol name뿐 아니라 unit/role과 왜 필요한지 설명한다.
- Mobile에서는 한 식을 여러 display rows로 분리한다. Horizontal scroll로 긴 식을 숨기지 않는다.

## Theorem and evidence boundary

| Claim | Required premise | Evidence produced | Does not prove |
|---|---|---|---|
| Local optimum is global | Convex feasible set and convex objective | Mathematical global-optimality implication | Existence, uniqueness, fast solve |
| Newton reaches a quadratic minimum in one step | Exact quadratic, invertible positive-definite Hessian, exact arithmetic/full step | Exact model step | General nonconvex convergence |
| KKT is necessary | Differentiability and appropriate constraint qualification at local optimum | First-order candidate condition | Global optimality |
| KKT is sufficient | Convex differentiable problem and KKT satisfaction | Global optimum certificate | Numerical residual is exactly zero |
| Strong duality | Convex problem plus qualification such as Slater | Zero theoretical primal-dual gap | Deployed constraints remain satisfied |
| Solver success | Correct transcription, tolerances and status semantics | Approximate finite-dimensional candidate | Continuous dynamics, deadline, robustness |
| Deployment success | Revalidation under measured state/model/data | Observed run behavior | Universal theorem/generalization |

## Coverage recheck

| Scope item | Public section | Gap after rewrite |
|---|---|---|
| Gradient, Hessian, curvature | `curvature` | none |
| Convexity and local/global | `objective`, `convexity` | none |
| Constraints and feasible set | `objective`, `constraints` | none |
| Lagrangian, KKT, duality | `constraints` | none |
| Numerical conditioning | `curvature`, `deep-learning` | Full floating-point proof deferred |
| MPC | `deep-learning` | Stability/recursive-feasibility proof deferred and named |
| Trajectory optimization | `deep-learning` | Contact/hybrid methods deferred and named |
| ML loss | `deep-learning` | Optimizer catalog deliberately deferred |
| Theorem versus solver/deployment evidence | `constraints`, `deep-learning` | none |
| Hard transfer suite | All five sections | Each premise has a public location |
