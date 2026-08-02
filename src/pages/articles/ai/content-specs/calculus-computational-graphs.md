# 미분과 계산 그래프 content spec

## 0. 역할

이 글은 "미분 공식 모음"이 아니다. 현재 AI·robot system에서 작은 입력 변화가
출력과 scalar objective에 어떻게 전달되는지 다음 네 언어로 연결하는 공통
기반이다.

1. derivative를 한 점의 local linear map으로 읽는다.
2. 여러 입력의 sensitivity를 gradient와 Jacobian shape로 정리한다.
3. 계산 그래프에서 local derivative를 합성하고 분기 기여를 합산한다.
4. full Jacobian 없이 JVP·VJP를 실행하는 autodiff와 검산 경계를 읽는다.

## 1. 독립 질문

1. 함수값과 derivative는 무엇이 다르고 단위는 어떻게 달라지는가?
2. derivative가 왜 "접선의 기울기"이면서 "작은 변화 예측기"인가?
3. partial derivative, gradient, directional derivative는 무엇을 고정하고
   무엇을 출력하는가?
4. 합성 함수에서는 왜 local derivative를 곱하고, 공유 node에서는 왜 경로
   기여를 더하는가?
5. broadcast된 bias의 gradient는 왜 batch 축을 따라 합산되는가?
6. Jacobian을 행렬로 만들지 않고 JVP와 VJP가 무엇을 계산하는가?
7. reverse mode가 scalar loss와 많은 parameter에 유리한 이유는 무엇인가?
8. PyTorch autograd의 graph, saved tensor, leaf `.grad`, detach/no-grad,
   in-place 경계는 수학의 어느 부분을 보존하거나 끊는가?
9. finite difference와 2차 chain rule은 각각 구현 검산과 robot path
   acceleration에 어떻게 전이되는가?

## 2. 본문보다 먼저 만든 hidden transfer fixtures

공개 본문과 Viz에는 아래 수치를 사용하지 않는다.

### A. 단위가 있는 local prediction

```yaml
function: T(v) = 3v^2 - 2v
point: v = 1.5 V
perturbation: dv = -0.04 V
derive:
  derivative: 7 degC/V
  linear_delta: -0.28 degC
  exact_delta: -0.2752 degC
  residual: 0.0048 degC
```

성공 조건:

- `T(1.5)`와 `T'(1.5)`를 같은 양으로 말하지 않는다.
- derivative의 단위를 `출력 단위 / 입력 단위`로 설명한다.
- local approximation의 residual이 `dv`가 작을 때 고차항이라는 점을 말한다.

### B. partial, gradient, directional derivative

```yaml
loss: L(w,b) = (2w+b-4)^2 + 0.5(w-1)^2
point: [w,b] = [0.5,1]
unit_direction: [3/5,-4/5]
derive:
  gradient: [-8.5,-4]
  directional_derivative: -1.9
decision: 이 direction으로 작은 양의 step을 가면 loss가 감소한다
```

성공 조건:

- partial은 coordinate axis 방향의 directional derivative라는 관계를 말한다.
- gradient 자체와 gradient를 direction에 투영한 scalar를 구분한다.

### C. 공유 node와 broadcast 합산

```yaml
broadcast:
  y_bd: x_bd + b_d
  upstream:
    - [1,-2]
    - [0.5,3]
    - [-1,4]
  derive_db: [0.5,5]
shared_branch:
  u: 3x
  a: u^2
  c: 2u
  loss: a+c
  point: x=1.5
decision:
  - 경로 안에서는 곱한다
  - 같은 node로 돌아온 경로와 broadcast 복제본은 더한다
```

### D. JVP와 VJP

```yaml
function:
  y1: x1*x2+x3
  y2: x1^2-x2
point: [2,-1,0.5]
jacobian:
  - [-1,2,1]
  - [4,-1,0]
jvp_seed: [1,2,-1]
jvp_result: [2,2]
vjp_seed: [3,-2]
vjp_result: [-11,8,3]
mode_decision:
  full_jacobian_forward_sweeps: 3
  full_jacobian_reverse_sweeps: 2
```

성공 조건:

- `Jv`와 `J^T c`의 input/output shape를 계산한다.
- 특정 vector product 한 번과 full Jacobian materialization을 구분한다.

### E. autograd graph 경계

```yaml
leaf: theta=2
u: theta^2
detached_branch: 3*detach(u)
loss: u + detached_branch
derive:
  forward_loss: 16
  first_backward_leaf_grad: 4
  second_backward_without_zero: 8
failure:
  - saved tensor를 backward 전에 in-place 수정
  - detach branch가 gradient를 되돌릴 것이라고 기대
```

### F. float32 gradcheck

```yaml
function: f(x)=sin(x)+0.1x^3
point: x=0.7
analytic: 0.9118421873
float32_evidence:
  1e-1: abs_error 2.74e-4
  1e-2: abs_error 1.39e-6
  1e-5: abs_error 3.09e-3
  1e-8: numeric_gradient 0
decision: epsilon을 0으로 보내는 것만이 컴퓨터에서 정답이 아니다
```

### G. path 위의 2차 chain rule

```yaml
path: q(s)=[s^2,sin(s)]
state:
  s: 0.5
  s_dot: 2
  s_ddot: -1
derive:
  q_dot: [2,1.755165]
  q_ddot: [7,-2.795285]
reason:
  - q_ss*s_dot^2 is path curvature contribution
  - q_s*s_ddot is clock acceleration contribution
```

성공 조건:

- 첫 미분에는 chain rule, 두 번째에는 product rule이 추가됨을 설명한다.
- 이 글은 actuator feasibility나 ODE integration을 풀지 않고 각각 상위 글로
  넘긴다.

### H. 서로 다른 상위 loss가 shared parameter에서 만나는 경우

```yaml
parameter: theta=0.4
denoiser_loss: (2theta-1)^2
policy_loss: -1.5*log(sigmoid(theta))
derive:
  denoiser_gradient: -0.8
  policy_gradient: about -0.60197
  total_gradient: about -1.40197
decision:
  - shared parameter에서는 loss별 gradient contribution을 더한다
  - advantage나 target이 detach됐는지는 graph contract로 별도 확인한다
```

## 3. source and intent ledger

| Source | 채택하는 주장 | 작성 의도 | 경계 |
|---|---|---|---|
| MIT 18.S096 Matrix Calculus full notes | derivative는 `df=f'(x)[dx]`인 local linear operator, directional derivative, Jacobian chain, forward/reverse order, finite-difference truncation·roundoff, second derivative | slope에서 arbitrary vector space의 linearization까지 끊기지 않게 연결 | epsilon-delta 증명, manifold calculus, eigenproblem derivative는 내리지 않음 |
| Baydin et al., *Automatic Differentiation in Machine Learning: a Survey* | symbolic·numerical·automatic differentiation의 차이, forward/reverse AD, trace와 intermediate 저장 | "autograd가 수식을 외운다"는 오개념을 교정 | compiler implementation 전체와 checkpointing 최적화는 defer |
| PyTorch 2.13 Autograd Mechanics | 실행한 연산으로 graph를 만들고 매 iteration 재생성, saved tensor, leaf grad accumulation, no-grad/inference, in-place correctness | 수학 graph와 실제 runtime state를 연결 | 모든 engine node와 thread semantics는 다루지 않음 |
| PyTorch 2.13 `torch.func` API·`vjp` | JVP는 tangent를 push forward, VJP는 cotangent를 pull back, full Jacobian 없이 product를 계산 | mode·shape·seed를 실제 API 언어로 연결 | API가 모든 op를 지원한다고 일반화하지 않음 |
| PyTorch 2.13 Gradcheck Mechanics | central finite difference와 analytic derivative 비교, precision·nondeterminism 경계 | backward 구현 검산을 독립 gate로 둠 | finite difference를 training 방법으로 제시하지 않음 |
| PyTorch 2.13 Broadcasting | singleton/trailing axis expansion | broadcast backward가 복제된 기여를 원래 shape로 sum-reduce하는 이유를 설명 | forward broadcast rule만 원문 직접 주장, backward sum은 chain rule로 유도 |
| Modern Robotics Ch.5 | `x_dot=J(theta) theta_dot`, Jacobian column의 velocity 의미 | JVP가 robot velocity kinematics와 같은 계산임을 회수 | singularity·pseudoinverse는 kinematics/decomposition 글로 넘김 |
| Sutton et al. 1999 Policy Gradient | expected reward를 policy parameter gradient로 쓰고 advantage/value approximation으로 추정 | `grad log pi * advantage`가 parameter graph에 연결되는 상위 bridge | theorem 증명과 estimator variance는 RL 글 책임 |

캐시:

```text
.codex-tmp/calculus-computational-graphs-sources-2026-07-30/
```

HTML/PDF, 추출 text, `SHA256SUMS`를 함께 보관한다.

## 4. history stop rule

다음이 가능해지는 첫 지점에서 역사 하향을 멈춘다.

- derivative를 local linear prediction으로 사용한다.
- multivariable chain rule에서 product와 branch sum을 구분한다.
- Jacobian의 shape와 JVP/VJP를 계산한다.
- autodiff runtime이 graph를 기록·절단·누적하는 경계를 읽는다.
- finite difference로 작은 backward를 검산한다.
- `q(s(t))`를 두 번 미분한다.

Newton·Leibniz의 역사, 엄밀한 극한 증명, 일반 적분론, differential geometry,
measure theory로 내려가지 않는다. 그 지식은 현재 hidden fixture의 판단을
바꾸지 않는다.

## 5. 이웃 글과 책임 분리

```yaml
this_article:
  owns:
    - derivative, partial, gradient, directional derivative
    - product and chain rule
    - branch and broadcast gradient sum
    - Jacobian, JVP, VJP
    - autodiff graph boundary
    - finite-difference gradient check
    - q(s(t)) first and second derivative
optimization_geometry:
  owns:
    - Hessian geometry and curvature-conditioned step
    - convexity, constraints, KKT, Newton direction
ode_phase_plane:
  owns:
    - derivative rule을 시간에 적분해 state trajectory 생성
    - solver step, event, forward/backward boundary, numerical integration error
linear_algebra_decompositions:
  owns:
    - Jacobian rank, null space, singular value, pseudoinverse
backprop_optimization:
  owns:
    - neural-network layer별 backward와 training procedure
```

공간 적분으로 distributed load·stress를 resultant와 balance로 바꾸는 기초는
`integrals-fields-conservation`가 소유한다. `calculus-computational-graphs`는
local sensitivity와 chain rule까지만 소유하고, 공간 누적·flux·conservation을
가르치는 것처럼 표시하지 않는다.

## 6. 최종 서사

1. `why-sensitivity`: 네 상위 시스템을 한 sensitivity 질문으로 묶는다.
2. `derivative-linearization`: secant → derivative → local prediction → 단위.
3. `gradient-direction`: partial → gradient → directional derivative.
4. `chain-product-graph`: chain/product rule → shared branch → broadcast sum.
5. `jacobian-products`: Jacobian shape → JVP/VJP → mode 선택.
6. `autograd-runtime`: dynamic graph → saved tensor → leaf accumulation → graph cut.
7. `gradient-check`: symbolic/numeric/AD → epsilon tradeoff → nonsmooth boundary.
8. `path-second-chain`: `q(s(t))` velocity·acceleration → robot handoff.
9. `return-up`: LLM, diffusion, RL, robot, optimizer로 올라가는 outgoing links.

각 section은 `왜 필요한가 → 직관 → 수식 → 숫자 예 → Viz 조작 →
실패 경계 → 다음 section handoff` 순서를 따른다.

## 7. causal Viz 계약

### 7.1 LocalLinearizationLab

- control: 기준점 `x`, perturbation `dx`
- invariant: derivative는 기준점에서 고정되고 exact delta와 linear delta는
  `dx`가 커질수록 벌어질 수 있다.
- evidence: secant, tangent, exact endpoint, predicted endpoint, residual.
- mobile: label을 SVG 밖 metric strip에도 반복한다.

### 7.2 DirectionalDerivativeLab

- control: direction angle, step size
- invariant: point와 gradient를 고정하고 direction만 회전한다.
- evidence: `grad L`, unit direction, `grad L dot v`, actual local delta.
- decision: positive/negative/near-zero direction을 색과 문장으로 구분한다.

### 7.3 GradientFlowLab

- modes: shared branch, broadcast bias, detached branch
- control: node/axis 선택 또는 upstream 변경
- evidence: path 안의 product, 합류/broadcast의 sum, detach의 zero contribution.
- anti-pattern: 정적 `↗ ↘` 문자만으로 graph를 표현하지 않는다.

### 7.4 JacobianProductLab

- modes: JVP, VJP
- control: input dimension `n`, output dimension `m`, seed vector 선택
- evidence: `J[named shape]`, seed shape, result shape, full Jacobian sweep count.
- decision: one-to-many에는 JVP, many-to-one에는 VJP가 유리한 이유를 보여준다.

### 7.5 AutogradTapeLab

- stages: forward record, backward once, backward twice, zero grad
- toggle: normal vs detach
- evidence: saved values, leaf/non-leaf, `.grad` accumulation, disconnected edge.
- boundary: in-place saved tensor 수정은 별도 error state로 설명한다.

### 7.6 GradcheckPathLab

- tabs: float32 epsilon sweep, path chain rule
- float control: epsilon exponent, smooth vs kink
- robot control: `s_dot`, `s_ddot`
- evidence: truncation/roundoff error와 `q_ss*s_dot^2`, `q_s*s_ddot`를 분리한다.

## 8. 수식·언어 계약

- 모든 display 수식은 `MathFormula`로 렌더링한다.
- 모든 display 수식 묶음 바로 뒤에 `FormulaNote`를 둔다.
- 핵심 식의 underbrace 설명은 한국어로 쓴다.
- `theta`, `frac`, `nabla`, `dot`, `ddot`가 raw text로 노출되지 않는다.
- 행/열 convention은 한 가지로 고정한다.

```text
J_ij = partial y_i / partial x_j
JVP = J v
VJP = J^T c
```

- 수식은 390px에서 0.88 미만으로 축소하지 않도록 긴 식을 나눈다.
- 9px·10px·11px 수식을 사용하지 않는다.

## 9. cross-path 회수

| 경로 | 이 글에서 가져갈 산출물 |
|---|---|
| LLM architecture | residual·normalization·MoE branch에서 gradient path와 합산 |
| Diffusion | denoising objective의 residual이 denoiser parameter로 VJP되는 경로 |
| RL | `grad log pi * advantage`가 shared policy parameter로 누적되는 경로 |
| activation/backprop | local derivative의 부호·크기, branch accumulation |
| optimizer | gradient는 현재 위치의 1차 local 정보라는 경계 |
| RNN/LSTM | 펼친 시간 graph에서 반복되는 Jacobian product |
| multimodal shared loss | shared parameter에서 loss별 gradient sum |
| robot kinematics | `x_dot=J q_dot` JVP와 Jacobian column 의미 |
| robot trajectory | `q_s`, `q_ss`, `s_dot`, `s_ddot` 2차 chain rule |

구조역학·tribology의 "미분과 적분" 오연결은 다음처럼 교정한다.

- tribology의 시간 상태 적분은 ODE 글로 이동한다.
- 구조역학의 공간 적분 참조는 제거하고 전용 기반 backlog로 기록한다.

## 10. 출시 완료 조건

- 9개 질문과 hidden fixture A~H가 본문·Viz로 풀린다.
- public 수치가 hidden fixture와 다르다.
- 9 sections, 6 causal Viz, 12개 이상의 설명된 수식이 있다.
- 29개 기존 연결 중 derivative/Jacobian/autodiff 책임이 trace되고 두 잘못된
  적분 연결이 교정된다.
- 390/768/1440에서 document·figure·formula overflow 0.
- 모든 control 44px 이상.
- raw LaTeX·console error 0.
- Claude를 수학, runtime, cross-path, formula-responsive 네 범위로 분리해
  strict receipt를 받는다.
- build, local production, public route, public asset hash를 검증한다.
