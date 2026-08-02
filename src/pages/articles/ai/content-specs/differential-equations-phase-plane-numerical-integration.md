# 미분방정식·위상평면·수치 적분 content spec

## Goal

- 독자는 `현재 상태 + 변화율 + 시간 간격`이 다음 상태를 만든다는 한 원리에서 출발해, 초기값 문제·수치 오차·안정성·위상평면·양끝 경계·사건 검출을 하나의 시간 전개 언어로 연결한다.
- 이 글은 Diffusion의 reverse ODE/SDE, 열평형, 로봇 경로 시간화, 연속시간 state-space model을 읽기 직전에 공통으로 내려오는 최소 ODE 바닥이다.
- 특정 논문의 결론을 요약하지 않는다. 상위 글의 수식과 solver log를 새 조건에서 검산할 수 있는 전이 능력을 만든다.

## Curriculum decision

- 기존 글은 Shin–McKay 1985의 forward/backward integration을 설명하려고 만들어져 common foundation 역할이 좁았다.
- 재구성 후에는 `calculus-computational-graphs`와 `integrals-fields-conservation` 다음에 놓는다. 미분이 한순간의 변화율을, 적분이 변화량의 누적을 설명했다면 이 글은 누적을 시간 순서대로 실행해 trajectory를 만든다.
- 상위 first-need point는 네 곳이다.
  - Diffusion: reverse-time ODE/SDE를 solver로 따라가는 순간.
  - Robot trajectory: `(s, \dot s)`에서 forward/backward envelope를 연결하는 순간.
  - Contact/thermal: `C_th dT/dt = P_loss - heat_out`을 시간에 따라 푸는 순간.
  - Hybrid/linear LLM: 연속 state equation을 discrete recurrence로 바꾸는 순간.
- Euler, RK4, stiff solver, event detection을 각각 독립 글로 쪼개지 않는다. 이 글 안에서 서로 다른 실패 원인을 구분할 만큼만 깊게 다룬다.

## Foundation floor

```json
{
  "branch": "differential-equations-phase-plane-numerical-integration",
  "upperQuestions": [
    "reverse diffusion trajectory를 어떤 방향과 간격으로 따라가는가",
    "thermal state가 언제 equilibrium에 도달하는가",
    "가속·감속·속도 상한을 만족하는 path timing은 어디서 전환되는가",
    "continuous state equation이 discrete recurrence가 될 때 무엇이 달라지는가"
  ],
  "sharedFloor": [
    "함수와 그래프",
    "변화율과 연쇄법칙",
    "rate를 interval에 누적하면 amount가 된다는 적분 원장",
    "두 성분 벡터"
  ],
  "newConceptRung": "state-rate-step-error-stability-phase-boundary-event",
  "deferred": [
    "ODE 해석해 공식의 역사",
    "존재·유일성 정리의 증명",
    "PDE",
    "stiff solver 전체 계보",
    "symplectic·implicit·adjoint method의 세부 구현"
  ],
  "standaloneSourceBudget": 0,
  "stopReason": "독자가 state와 rate를 세우고, step 안정성·오차·event·boundary를 구분해 상위 모델의 solver 선택과 로그를 검산할 수 있다."
}
```

## Source anchors

| Area | Local evidence | 책임 |
|---|---|---|
| Euler·global error | `.codex-tmp/ode-sources-2026-07-30/mit-es-1803-numerical-methods-2024.txt` | 작은 step의 근사를 반복하며 오차가 누적되고, step-halving과 RK4 차수 비교가 필요함을 뒷받침한다. |
| 위상평면·수치 경계 | `.codex-tmp/ode-sources-2026-07-30/mit-18-03-numerical-methods-2010.txt` | 수치 trajectory가 separatrix나 영역 경계를 잘못 넘을 수 있음을 뒷받침한다. |
| 안정성·stiffness | `.codex-tmp/ode-sources-2026-07-30/mit-18-086-stiff-ode.txt` | exact decay여도 explicit Euler multiplier가 불안정할 수 있고, 가장 빠른 time scale이 step을 제한함을 뒷받침한다. |
| IVP·tolerance·event | `.codex-tmp/ode-sources-2026-07-30/scipy-solve-ivp.txt` | `f(t,y)`, explicit/nonstiff와 implicit/stiff 구분, `rtol/atol`, `dense_output`, `events`, `max_step`의 현재 구현 경계를 제공한다. |
| 양끝 경계 | `.codex-tmp/ode-sources-2026-07-30/scipy-solve-bvp.txt` | initial value와 boundary value가 다른 문제임을 뒷받침한다. |
| 경로 시간화 | `.codex-tmp/ode-sources-2026-07-30/modern-robotics-time-scaling-part-1.txt` 외 2개 | `L(s,\dot s) <= \ddot s <= U(s,\dot s)`, forward/backward integration, velocity limit curve, multiple switch 가능성을 제공한다. |
| 출처 무결성 | `.codex-tmp/ode-sources-2026-07-30/SHA256SUMS` | 원본 PDF/HTML과 추출 text의 재현 가능한 입력을 고정한다. |

## Full-scope map

| Topic | Must cover | Depth | 실패 시 생기는 오해 |
|---|---|---|---|
| state·rate·initial condition | 값과 단위, rate가 결정하는 방향, 초기 상태가 필요한 이유 | deep | 식만 알면 trajectory가 하나로 정해진다고 오해한다. |
| autonomous·driven | `f(x)`와 `f(t,x,u(t))`, scheduled input | deep | 외부 입력 변화를 state 자체의 법칙으로 오해한다. |
| Euler step | `next = current + interval x current rate` | deep | derivative와 accumulated change의 단위를 섞는다. |
| local·global error | 한 step 오차와 끝점 오차, step-halving, method order | deep | tolerance나 local error를 최종 정답 보증으로 오해한다. |
| stability·stiffness | multiplier, exact decay/numerical growth, multiple time scales | deep | step을 줄이는 이유를 정확도 하나로만 이해한다. |
| second→first order | 위치와 속도를 state로 묶기 | deep | 위치 하나로 미래를 결정하려 한다. |
| phase portrait | state point, vector field, trajectory, damping/energy | deep | 시간축 없는 그림을 정적 좌표로 오해한다. |
| IVP·BVP | 한쪽 초기값과 양끝 조건의 차이 | deep | forward rollout 하나가 terminal condition도 만족한다고 생각한다. |
| envelope·speed cap | accelerate/cruise/brake, asymmetric bounds, multiple switches 가능 | deep | 모든 time-optimal path가 단일 bang-bang switch라고 일반화한다. |
| events·dense output | sign-change limitation, scheduled/state event, max step | deep | step endpoints가 안전하면 interval 전체도 안전하다고 생각한다. |
| solver vs model error | discretization/tolerance/event/model/unit error 분리 | deep | solver success를 물리 모델 검증으로 오해한다. |
| 역사·해석해·PDE | 명시적으로 defer | defer | prerequisite recursion이 끝없이 내려간다. |

## Private hardest transfer fixtures

공개 본문에는 아래 숫자와 정답을 그대로 싣지 않는다. 각 Viz는 다른 기본값을 사용한다. 감사자는 본문만 읽고 아래를 풀어 전이 여부를 판정한다.

### A. 저장량 원장

- state `m(0)=12 kg`.
- `0<=t<2 s`에는 `in=4 kg/s`, `out=1 kg/s`.
- `2<=t<=5 s`에는 `in=1 kg/s`, `out=2 kg/s`.
- 정답:
  - 첫 구간 net rate `+3 kg/s`, 누적 `+6 kg`.
  - 둘째 구간 net rate `-1 kg/s`, 누적 `-3 kg`.
  - `m(5)=15 kg`.
- 필요한 insight: rate를 곧바로 amount와 더하지 않는다. `rate x duration`이 같은 단위의 변화량이 된 뒤 state에 더해진다.

### B. exact decay인데 Euler는 발산

- `y'=-40y`, `y(0)=1`, `h=0.1`.
- explicit Euler multiplier `g=1+h\lambda=1-4=-3`.
- exact solution은 decay하지만 numerical sequence는 `1,-3,9,-27,...`로 부호를 바꾸며 커진다.
- scalar negative mode의 explicit Euler stability는 `|1+h\lambda|<1`, 따라서 `0<h<0.05`.
- `h=0.025`에서는 multiplier가 `0`이다. 안정적이지만 한 step에 0으로 떨어져 exact trajectory를 정확히 재현하는 것은 아니다.
- 필요한 insight: stability는 “오차가 작은가”보다 먼저 “오차가 증폭되는가”를 묻는다.

### C. driven non-autonomous state

- `x'=-x+u(t)`, `x(0)=0`.
- `u(t)=2` for `t<1.5`, 이후 `u(t)=-1`.
- scheduled event는 `t=1.5`, state event는 `x=1`.
- 필요한 insight: `t=1.5`는 입력 schedule이 이미 아는 시간이고, `x=1`은 trajectory를 적분하며 찾아야 하는 crossing이다. `f(x)`만으로는 같은 x에서 입력 전후의 서로 다른 rate를 설명할 수 없다.

### D. endpoint-only event miss

- 한 solver step이 `t=0.8`에서 `t=1.3`으로 건너간다.
- event function `g(t)=(t-1)(t-1.2)`.
- 양 endpoint에서 `g>0`이지만 interval 안에는 root가 두 개 있다.
- 필요한 insight: endpoint sign change만 보는 검출기는 두 crossing을 모두 놓칠 수 있다. `max_step` 축소, 알려진 schedule에서 step 분할, dense evaluation 또는 문제에 맞는 event formulation이 필요하다.

### E. 비대칭 경계와 속도 상한

- path length `10`, start/goal speed `0`.
- acceleration upper bound `+2`, braking magnitude `1`, speed cap `3`.
- cap이 없다면 forward/backward 교점 speed는 `sqrt(40/3)≈3.65`이므로 cap을 넘는다.
- speed 3까지 가속하는 거리 `v^2/(2a)=9/4=2.25`.
- speed 3에서 정지하는 거리 `v^2/(2b)=9/2=4.5`.
- 따라서 accelerate `[0,2.25]`, cruise `[2.25,5.5]`, brake `[5.5,10]`.
- 필요한 insight: velocity limit curve가 있으면 단일 교점이 아니라 두 switching point와 cruise segment가 생긴다. 일반 문제에는 tangent point나 여러 switch도 가능하다.

### F. convergence claim

- 같은 IVP를 `h`, `h/2`, `h/4`로 계산한다.
- smooth nonstiff case에서 Euler global error는 대체로 `O(h)`, RK4는 `O(h^4)`.
- step을 절반으로 할 때 Euler error ratio는 대략 2, RK4는 대략 16에 접근한다.
- 필요한 insight: 이는 asymptotic convergence 진단이지 tolerance가 true final error와 같다는 보증이 아니다. model error는 이 비교로 사라지지 않는다.

## Section plan

### 01. 한순간의 rate를 trajectory로 바꾸기
- 질문: 현재 amount만 알면 다음 amount가 정해지는가?
- state, rate, unit, initial condition을 저장량 원장으로 시작한다.
- 적분 글에서 올라오는 연결을 먼저 보여 준다.
- Formula: `dx/dt=f(t,x,u)`와 unit ledger.
- Viz 1 `RateLedgerLab`: inflow/outflow와 schedule을 바꾸면 rate strip, accumulated area, final state가 함께 변한다.

### 02. 같은 state여도 외부 입력이 다르면 rate가 달라진다
- 질문: `x=1`이라는 값 하나로 다음 방향이 항상 같은가?
- autonomous `f(x)`와 driven/non-autonomous `f(t,x,u(t))`를 분리한다.
- scheduled event와 state-triggered event를 아직 solver 세부 없이 구분한다.
- Formula: piecewise `u(t)`와 driven first-order state.
- Viz 2 `DrivenStateLab`: input switch time/level을 바꾸면 rate arrow, trajectory, threshold crossing이 바뀐다.

### 03. Euler 한 걸음은 rate를 짧은 구간에 누적한 것
- 질문: 컴퓨터는 연속 곡선을 어떻게 숫자 목록으로 만드는가?
- `x_{n+1}=x_n+h f(t_n,x_n)`을 unit 관점에서 유도한다.
- exact identity와 numerical approximation을 분리한다.
- Formula: Euler update와 local truncation.
- Viz 3 `EulerStepLab`: tangent rectangle/step geometry가 h에 따라 바뀐다.

### 04. 한 걸음 오차와 끝점 오차는 다르다
- 질문: 작은 오차가 왜 긴 trajectory에서 커지는가?
- local error, propagated/global error, step-halving, Euler/RK4 order를 연결한다.
- Formula: global order와 error ratio.
- Viz 4 `ErrorConvergenceLab`: h와 h/2 result/error ratio, Euler/RK4가 실제로 달라진다.

### 05. 정확도보다 먼저 안정성을 확인한다
- 질문: exact solution은 줄어드는데 왜 numerical result는 커지는가?
- test equation multiplier에서 oscillatory decay, boundary, growth를 보여 준다.
- stiffness는 빠른 mode가 step을 지배하는 multiple-time-scale 문제로 설명한다.
- explicit/implicit catalog 대신 method choice boundary만 둔다.
- Formula: `g=1+hλ`, `|g|<1`, two-mode state.
- Viz 5 `StabilityStiffnessLab`: λ와 h를 바꾸면 stable/oscillatory/unstable band와 빠른·느린 mode가 실제로 변한다.

### 06. 2차 운동을 위치·속도 state로 펼친다
- 질문: 위치 하나가 왜 완전한 state가 아닌가?
- `q''=a(q,q',t)`를 `[q,v]'=[v,a]`로 바꾼다.
- vector field, state point, trajectory, damping과 dissipated energy를 연결한다.
- Formula: first-order system과 damped energy derivative.
- Viz 6 `PhasePortraitLab`: damping/initial velocity가 vector field 위 trajectory topology와 energy drop을 바꾼다.

### 07. 출발 조건과 도착 조건을 양쪽에서 만난다
- 질문: start에서 fastest rollout만 하면 goal speed까지 자동으로 맞는가?
- IVP와 BVP를 구분한다.
- `L<=s''<=U`, forward upper edge, backward lower edge, velocity cap을 설명한다.
- 단일 switch를 보편 법칙으로 쓰지 않는다.
- Formula: asymmetric envelope와 cap.
- Viz 7 `BoundaryEnvelopeLab`: acceleration/braking/cap을 바꾸면 one-switch 또는 accelerate/cruise/brake 구조와 두 switch가 나타난다.

### 08. step 사이에서 일어난 사건을 놓치지 않는다
- 질문: endpoints가 안전하면 interval도 안전한가?
- state event, scheduled event, dense output, `max_step`, tolerance를 분리한다.
- sign-change event가 한 step 안의 짝수 crossing을 놓칠 수 있음을 보인다.
- Formula: root condition과 tolerance scale.
- Viz 8 `EventDetectionLab`: step width를 바꾸면 two-root miss/detect count, sampled points, crossing markers가 달라진다.

### 09. solver success와 model validity를 분리해 상위 글로 돌아간다
- discretization error, stability, event miss, tolerance, unit/model/parameter error를 release ledger로 정리한다.
- Diffusion, thermal, robot trajectory, hybrid state-space의 first-need point로 되돌아간다.
- Shin–McKay는 robot branch의 한 사용례로만 둔다.
- 더 오래된 ODE 역사·PDE·solver catalog로 내려가지 않는 stop floor를 명시한다.

## Formula contract

- display formula 16개 이상, 각 formula 바로 다음에 `FormulaNote` 1개를 둔다.
- 모든 핵심 연산의 이유를 한국어 underbrace로 수식 안에 표시한다.
- raw `\theta`, `\dot s`, `\frac`가 본문 text node로 노출되지 않는다.
- 긴 식은 `aligned`로 줄을 나누며 formula 내부 horizontal scroll에 의존하지 않는다.
- 390px에서 실제 formula scale은 `0.9` 이상이다. 불가피한 경우 식을 둘로 분리한다.
- `FormulaNote`는 다음 셋을 명시적으로 구분한다.
  - mathematical identity
  - numerical approximation or method property
  - physical/model assumption

## Viz contract

1. `RateLedgerLab`: rate와 amount의 단위·면적·끝 state를 함께 갱신한다.
2. `DrivenStateLab`: scheduled input과 threshold event가 서로 다른 marker로 움직인다.
3. `EulerStepLab`: current slope, tangent segment, rectangle accumulation, next point가 h에 따라 움직인다.
4. `ErrorConvergenceLab`: exact/Euler/RK4 geometry와 error ratio가 함께 변한다.
5. `StabilityStiffnessLab`: multiplier band, sequence, fast/slow time scale이 실제로 변한다.
6. `PhasePortraitLab`: field arrows, orbit, final state, energy metric이 damping/initial state에 따라 변한다.
7. `BoundaryEnvelopeLab`: forward/backward curves, speed cap, switching points와 phase label이 함께 변한다.
8. `EventDetectionLab`: coarse/fine sample points와 detected/missed roots가 step width에 따라 변한다.

공통 UI:
- article body에 맞춘 `viewBox` 약 440–480 폭을 사용한다.
- SVG text는 모바일 실제 크기 9px 이상, 주요 label은 11px 이상을 목표로 한다.
- plot safe margin, 2–3px primary stroke, 1px grid, linecap/linejoin round.
- control은 최소 44px hit target, keyboard focus visible, selected state에 `aria-pressed` 또는 native input state가 있다.
- mobile에서는 controls→plot→metrics 순서로 쌓이고 내부 horizontal scroll이 없다.
- caption은 우측 article overlay를 피하도록 `scroll-mt-24`와 `sm:pr-28`을 적용한다.
- animation은 state transition을 설명할 때만 사용한다. 자동 재생 장식은 금지한다.
- 각 lab에 안정적인 `data-ode-lab`과 결과 `data-*`를 둬 hidden-style test가 결과 변화를 검증한다.

## Upper handoff contract

- `diffusion-models/ReverseSampling.tsx`: reverse ODE/SDE solver가 처음 등장하는 문단 바로 옆에 이 글 링크.
- `robot-contact-tribology-lubrication-wear.tsx`: lumped thermal ODE 식 바로 뒤에 이 글 링크.
- `robot-trajectory-generation.tsx`: phase plane 및 forward/backward reachability가 처음 필요한 문단 바로 옆에 이 글 링크.
- `llm-architecture-hybrid-linear.tsx`: continuous state→discrete recurrence 설명에서 이미 링크가 있으면 중복하지 않고 label만 정합화한다.
- ODE 글 마지막은 네 상위 목적지를 독립 질문 카드로 제공한다.

## Claude receipt contract

- HTTP 200, `.ok=true`, worker exact `claude-code:sonnet`, first attempt `.ok=true`, source hashes stable, result 120자 초과가 모두 필요하다.
- 첫 non-empty line은 exact `ACCEPT` 또는 `REVISE`.
- 전체 응답에서 standalone verdict line은 정확히 하나여야 한다.
- `ACCEPT` 뒤에 `REVISE`, “정정합니다”, “accept가 아니라 revise” 같은 상충 표현이 있으면 transport-valid여도 content acceptance로 집계하지 않는다.
- `REVISE`는 결함을 고친 뒤 다른 current-hash packet으로 다시 감사한다.

## Acceptance

- 9 sections, 8 causal labs, 16개 이상 display formulas와 1:1 FormulaNote.
- private A–F를 공개 숫자 복사 없이 본문 원리와 lab 조작만으로 풀 수 있다.
- stability lab은 stable/unstable 상태를 모두 실제로 만든다.
- boundary lab은 cap 때문에 두 switching point와 cruise가 생기는 상태를 실제로 만든다.
- event lab은 coarse step에서 two-root miss, fine step에서 검출을 실제로 만든다.
- 390/768/1440에서 document·figure·formula overflow 1px 이하, console error 0.
- 모바일 SVG text 9px 이상, control 44px 이상, formula scale 0.9 이상.
- route metadata와 upper first-need link가 current article slug를 가리킨다.
- source ledger hash가 유지되고, Claude post-audit가 strict-valid하며 상충 판정이 없다.
