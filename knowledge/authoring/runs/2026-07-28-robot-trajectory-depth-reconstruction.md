# Robot trajectory depth reconstruction

Date: 2026-07-28 KST

## Objective

`robot-trajectory-generation`을 용어 모음이나 정적 개요가 아니라, 독자가 다음 판단을
직접 수행할 수 있는 article로 재구성한다.

1. 고정 경로와 시간 궤적을 구분한다.
2. 다관절 torque bound를 signed path-acceleration interval로 바꾼다.
3. 음수 계수와 near-zero coefficient를 안전하게 처리한다.
4. 모든 관절 interval을 교차하고 torque reserve를 적용한다.
5. 출발점 최대가속과 종점 최대감속을 `x = s_dot^2`로 적분한다.
6. 순간 feasible과 종점에서 멈출 수 있는 controllable state를 구분한다.
7. 수렴, start drift, replay saturation, scene version을 숫자 release gate로 판정한다.

## Why this scope

이전 글은 raw LaTeX와 document overflow는 이미 해결했지만, hardest transfer problem에서
필요한 signed bound, zero-inertia, interval intersection, robust reserve, terminal
controllability와 numeric release threshold를 계산할 수 없었다. 시각화도 같은 제약식에서
나온 값처럼 보였지만 실제로는 독립적인 synthetic curve였다.

따라서 이번 pass는 “설명이 더 많아 보이는가”가 아니라 다음 invariant를 기준으로 했다.

```yaml
article_invariant:
  prose_equation_viz:
    - one projected three-joint dynamics fixture
    - one signed-bound implementation
    - one backward-controllable and forward-reachable profile result
  truth_boundary:
    - educational discrete approximation is labeled as such
    - Ruckig continuity demo is not called Ruckig
    - replay/start/scene values are labeled example evidence
  mobile:
    - no document or formula overflow
    - annotated formula scale >= 0.78 at 360 px
    - mobile plot has its own layout and visible legend
```

## Reasoning pipeline

### 1. Reconcile external-review failures

Context Manager의 과거 HTTP 500, code 143, empty result와 4-character `PASS`를 성공으로
세지 않았다. accepted Claude receipt는 다음 다섯 조건을 모두 만족해야 한다.

```yaml
accepted:
  http: 200
  ok: true
  decision.worker: claude-code:sonnet
  attempts[0].ok: true
  result: substantive
```

과거 실패와 후속 narrow replacement의 대조는
`.codex-tmp/claude-unvalidated-inventory-2026-07-28.md`에 남겼다. 31개 anomaly 중
23개 historical failure, 2개 AI IA broad timeout, 1개 permission Viz short result는
accepted narrow receipt로 대체되었다. smoke probe 1개는 audit coverage에서 제외했다.
이번 글의 broad/timeout 결과는 수정 전 진단으로만 보존하고 stable source hash에 대한
두 개의 final packet만 closure로 사용한다.

실제 closure는 세 단계로 진행됐다.

1. 과거 500/timeout 인벤토리는 strict replacement 후 미대체 0건이 됐다.
2. 중간 hash `31ea0773...`의 P1/P2는 multi-interval·forward 로직을 검증하면서,
   terminal이 infeasible인데도 `C_N={0}`을 seed하는 마지막 결함을 찾았다.
3. 수정 후 최종 hash
   `3e40608e26893022c493d0fd2552b1a798f2de6c99dfc8d8ffb7cc721dfedcc4`
   에서 Q1/Q2가 모두 HTTP 200, `ok=true`, `claude-code:sonnet`,
   first attempt `ok=true`, substantive result로 통과했다.

최종 영수증:

- `.codex-tmp/claude-robot-trajectory-closure-2026-07-28/Q1.raw.json`
- `.codex-tmp/claude-robot-trajectory-closure-2026-07-28/Q2.raw.json`
- `.codex-tmp/claude-robot-trajectory-closure-2026-07-28/assessment.md`

Q1은 invalid terminal에서 `C_N=[]`가 되고 empty set이 backward loop 전체에
fail-closed로 전파됨을 확인했다. Q2는 이 수정이 forward `R ∩ C`, null/status,
infeasible mode 제외, all-switch convergence와 fine-time denominator guard를
바꾸지 않았음을 확인했다.

### 2. Create a private transfer problem

본문을 먼저 늘리지 않았다. 세 관절, sharp corner, nonzero current state, different
v/a/j limits, 1 kHz controller, stale scene을 결합한 private problem을 만들었다.
정답에 필요한 연산을 capability list로 바꾼 뒤 현재 본문이 그 능력을 제공하는지
감사했다.

Private audit:

- `.codex-tmp/robot-trajectory-depth-audit-2026-07-28.md`

이 방식의 목적은 문제를 본문에 싣는 것이 아니다. author가 빠뜨린 연산을 찾고,
본문만 읽은 독자가 새로운 수치 사례에서도 같은 판단을 옮길 수 있는지 확인하는 것이다.

### 3. Bound the paper spine

최소 역사와 현대 분기를 분리했다.

| Role | Source | Inclusion intent |
|---|---|---|
| 개념·교재 경계 | Modern Robotics Ch. 9 | path, time scaling, trajectory와 profile family를 처음 정의 |
| 최소 고전 floor | Shin & McKay 1985 | fixed path dynamics를 scalar retiming으로 내리는 직접 근거 |
| 병렬 고전 corroboration | Bobrow et al. 1985 | 같은 specified-path minimum-time 문제의 독립 정식화 |
| 현대 fixed-path branch | TOPP-RA 2018 | fragile event integration 대신 reachability grid를 여는 선택 후속 |
| 현재 online branch | Ruckig 2021 | arbitrary current/target p-v-a와 v/a/j constraint |
| runtime handoff | MoveIt current docs | planner output, time parameterization, jerk smoothing의 실제 순서 |

Shin-McKay 아래로 무한정 과거 논문을 노출하지 않는다. Bobrow는 병렬 근거이고,
TOPP-RA와 Ruckig은 서로 다른 현대 branch다.

### 4. Reconstruct the mathematics

본문과 구현에 같은 순서를 사용했다.

1. `q=q(s)`, `s=s(t)`를 분리한다.
2. chain rule로 `q_dot`, `q_ddot`을 얻는다.
3. viscous term을 버리지 않고 `tau=a*s_ddot+b*s_dot^2+d*s_dot+c`로 내린다.
4. `h=b*s_dot^2+d*s_dot+c`를 먼저 계산한다.
5. signed division의 두 결과를 sort해 joint interval을 얻는다.
6. `|a_i|<epsilon`이면 나누지 않고 speed-only torque feasibility를 검사한다.
7. `L=max lower_i`, `U=min upper_i`로 모든 joint interval을 교차한다.
8. torque reserve를 안쪽으로 적용한 뒤 같은 계산을 다시 한다.
9. `x=s_dot^2`, `dx/ds=2*s_ddot`로 한 edge의 reachable interval
   `R_k(x)=[x+2L_k*ds, x+2U_k*ds]`를 만든다.
10. `C_N={0}`에서 시작해 “다음 controllable set에 닿을 수 있는 현재 x”의 연결
    구간들을 `C_k`의 합집합으로 backward propagation한다. `C_k=[0,upper]`를
    가정하지 않는다.
11. 출발점에서는 `R_k(x_k) ∩ C_{k+1}`의 가장 큰 값을 고르고, 그 edge에 필요한
    가속도가 실제 `[L_k,U_k]` 안인지 다시 검사한다.
12. 교집합이 비면 음수 상태를 0으로 clamp하지 않고 `null`과 명시적 `NO-PATH`
    status로 노출한다.
13. grid refinement에서는 첫 switch 하나가 아니라 모든 mode transition의 개수와
    최대 위치 편차를 비교한다.

모바일에서 한 줄 수식이 작아지는 문제는 font threshold를 낮추지 않고 후보 계산,
sort, intersection과 recurrence를 여러 독립 row로 분리해 해결했다.

### 5. Make the Viz prove the same computation

`PhasePlaneLab`의 카드, joint interval bar, speed ceiling, forward candidate,
terminal-controllable upper와 실행 profile은 모두 `projectedDynamics -> accelerationBounds ->
feasibleSpeedCeiling -> buildRetimingProfile`을 공유한다.

세 joint는 의도적으로 다른 edge case를 맡는다.

- J1: positive projected acceleration coefficient
- J2: negative coefficient and reversed inequality
- J3: near-zero coefficient and speed-only feasibility

전환점을 찾지 못했을 때 `s=0.5`를 임의 표시하던 fallback은 제거했다. 이전 단일
forward/backward pass는 속도 ceiling을 pointwise minimum한 뒤 edge acceleration을
재검증하지 못했고, 음수 backward candidate를 0으로 clamp했다. Claude의 stable-hash
감사에서 이 결함이 확인되어, backward terminal-controllable set과 forward reachable
intersection으로 교체했다.

첫 교체 뒤에도 fixed-hash Claude 검증을 다시 실행했다. 여기서 `C_k=[0, upper]`의
하향 연결 가정, 빈 집합과 `x=0`의 센티널 충돌, infeasible edge의 mode 오기록,
첫 transition만 비교하는 수렴 gate가 발견됐다. 최종 구현은 다음처럼 바꿨다.

- sampled predicate의 모든 연결 interval을 `C_k`의 합집합으로 보존
- 빈 집합은 `[]`, 끊긴 실행 상태는 `null`, 전체 결과는 explicit status로 반환
- infeasible mode를 accelerate/controllable transition에서 제외
- coarse/fine grid의 모든 transition 개수와 최대 위치 편차를 비교
- 현재 slider state도 local `[L,U]`뿐 아니라 가장 가까운 `C_k` membership 검사

현재 plot은 여전히 scalar grid의 교육용 이산 근사이므로 exact Shin-McKay event
integrator나 TOPP-RA 구현이라고 부르지 않는다. 속도 천장도 정지 상태와 이어진 첫
feasible 성분만 보수적으로 유지한다. 배포용 선택지는 grid convergence와 검증된
TOPP-RA solver로 경계를 그었다.

`RetargetLab`은 arbitrary quintic의 current-state continuity와 v/a/j post-check만
보여 준다. Ruckig 자체가 아니라고 visible caption에 명시했다.

### 6. Connect release evidence to computation

release gate의 total-time, all-switch position, peak-torque change는 hardcoded number가
아니라 같은 dynamics fixture를 서로 다른 grid count로 다시 계산해 얻는다.

- before evidence: `21 -> 41`
- revalidated evidence: `201 -> 401`

재검증 결과는 total time `0.01%`, 모든 transition의 최대 위치 편차 `0.003`,
peak torque `0.00 N·m`였다. edge acceleration은 bisection boundary를 작은 `ds`로
나누며 생기는 floating-point 확대 오차만 허용하도록 `1e-6 /s^2` numerical
tolerance를 별도 선언했다. 그보다 큰 위반은 계속 `NO-PATH`다.

start drift, 1 kHz saturation dwell과 planning-scene version은 실제 장비 계측처럼
오해되지 않도록 example release bundle이라고 visible prose에 적었다. 각 failure에는
독립 reason code가 있고 어느 하나라도 실패하면 `NO-GO`다.

## Changes

- `src/pages/articles/ai/robot-trajectory-generation.tsx`
  - signed bound and zero-inertia derivation
  - robust torque reserve
  - `x=s_dot^2` backward controllable-set and forward reachable-set recurrence
  - multi-interval controllable-set union and explicit `null`/`NO-PATH`
  - local edge-acceleration and current-state terminal controllability recheck
  - all-transition grid convergence
  - coherent dynamic retiming Lab
  - truthful quintic continuity/limit Lab
  - computed grid-convergence release gate
  - Bobrow and TOPP-RA source notes
- `src/pages/articles/ai/content-specs/robot-trajectory-generation.md`
  - private transfer and Viz truth contract
- `src/content/ai/articlesSystemsFoundation.ts`
  - signed interval/ODE prerequisites
- `src/content/learning-paths.ts`
  - optimization and ODE bridge, fixed-path paper stop rule
- `src/content/ai/foundationCurriculum.ts`
  - just-in-time phase-plane foundation
- `tests/robot-trajectory-generation-qa.spec.ts`
  - 360/390/768/1440 formula and Viz QA
  - signed/zero-inertia/robust interaction
  - local-feasible but terminal-uncontrollable state
  - recorded NO-GO to revalidated GO state change

## Verification

```text
eslint target files                         PASS
npm run build                              PASS
Playwright robot trajectory QA             6/6 PASS
target narrative audit                     2 checks, 0 findings
target Viz audit                            2 checks, 0 findings
document overflow                           0 px
raw visible LaTeX                           0
Korean formula annotation gaps              0
formula count / minimum scale at 360 px     31 / 0.78
revalidated grid evidence                   0.01% / 0.003 / 0.00 N·m
```

Visual evidence:

- `.codex-tmp/robot-trajectory-generation-mobile-390-2026-07-28.png`
- `.codex-tmp/robot-trajectory-generation-desktop-2026-07-28.png`
- `.codex-tmp/robot-retiming-viewport-final-mobile-390-2026-07-28.png`
- `.codex-tmp/robot-retiming-viewport-final-desktop-1440-2026-07-28.png`
- `.codex-tmp/robot-release-viewport-final-mobile-390-2026-07-28.png`
- `.codex-tmp/robot-release-viewport-final-desktop-1440-2026-07-28.png`

## Small-model reproduction recipe

4B/9B model에는 article 전체와 모든 source를 한 번에 주지 않는다. 다음 bounded packet을
순서대로 사용한다.

1. `scope packet`: target reader, one private transfer problem, stop rule
2. `source packet`: one source claim, exact boundary, inclusion intent
3. `math packet`: one derivation and three edge cases
4. `Viz packet`: inputs, state transition, output invariant, failure state
5. `truth packet`: what the demo computes versus what it only illustrates
6. `render packet`: mobile overflow, formula annotation, interaction checks
7. `release packet`: test evidence and unresolved backlog

각 packet의 출력은 prose가 아니라 다음 IR로 먼저 제한한다.

```yaml
concept:
claim:
source_owner:
assumptions:
operation_order:
edge_cases:
reader_can_now:
viz_must_prove:
deferred:
```

작은 모델의 결과는 다음 단계 입력으로 그대로 넘기지 않는다. source locator와 invariant를
rule-based check로 먼저 확인하고, 실패한 field만 다시 생성한다. 이 작업에서 broad Claude
audit가 timeout되고 narrow equation/source/Viz packet이 성공한 것도 같은 설계를 지지한다.

## Remaining backlog

- TOPP-RA를 fixed-path numerical reachability 전용 article로 승격
- Ruckig을 online jerk-limited state-to-state generation 전용 article로 승격
- trapezoidal, S-curve, arbitrary quintic의 차이를 실제 v/a/j phase Viz로 비교
- production robot log와 연결할 때 example replay fields를 real telemetry adapter로 교체

이 backlog는 현재 글 아래로 더 오래된 논문을 노출하는 일이 아니다. current target에서
새 구현 세부가 필요할 때 현대 branch를 위에 추가하는 확장이다.
