# RL and Reasoning current-first reconstruction

Date: 2026-07-25

## Objective

`Reinforcement Learning`을 논문 연대기나 용어 목록이 아니라, 현재의
행동 시스템과 reasoning post-training 문제에서 시작해 필요한 분기와 최소
기반으로 내려가는 학습 경로로 재구성한다.

독자는 다음을 구분할 수 있어야 한다.

- 이 문제가 supervised learning이 아니라 RL이어야 하는 이유
- online interaction, fixed log, demonstration 중 실제 data access 계약
- policy optimization, offline RL, world model, state estimation, safety가
  서로 해결하는 문제가 다른 이유
- LLM reasoning에서 verifier, rollout, relative advantage, clipped update,
  held-out evaluation이 연결되는 순서
- 논문상의 기대값 제약과 실제 runtime·hardware safety가 다른 이유

기존 글은 독립적인 계산 질문을 소유하면 유지하고, source paper는 핵심
경로를 가리지 않는 선택 근거로 접는다.

## Hidden transfer challenge

본문의 깊이는 공개 퀴즈 수가 아니라 다음 비공개 전이 문제를 풀 수 있는지로
판정했다.

1. 한 warehouse robot은 현재 camera frame만 보고 움직이며 복도가 가려질
   때 충돌한다.
2. 기존 log에는 사람의 teleoperation, shield intervention과 실제 actuator
   action이 섞여 있다.
3. learned world model의 one-step error는 작지만 planner가 긴 rollout에서
   존재하지 않는 shortcut을 반복해서 찾는다.
4. expected collision cost는 budget 안이지만 긴 episode에서 한 번 이상
   충돌할 확률은 높다.
5. 같은 팀은 math reasoning model에 public verifier로 GRPO를 적용했고
   training reward는 오르지만 hidden test와 answer diversity는 떨어진다.

완성 경로만으로 다음 owner를 판정할 수 있어야 한다.

- partial observation -> POMDP, belief, state estimation
- demonstration과 fixed log -> imitation and offline RL
- compounding model error -> world-model horizon and policy audit
- expected cost와 trajectory risk의 차이 -> safe RL and runtime shield
- public reward와 hidden capability의 분리 -> verifier contract and evaluation
- rollout policy와 current policy의 차이 -> policy ratio and clipping

## Structural decision

RL root는 한 번에 한 목표 분기를 고르는 일곱 경로로 정리했다.

1. `00 · 적용 계약`
2. `01 · Policy · 제어`
3. `02 · Demonstration · Offline`
4. `03 · World Model · Planning`
5. `04 · State 추정`
6. `05 · Safety · 제약`
7. `06 · 최소 기반`

State estimation과 Safety는 같은 “고급 RL” 묶음이 아니다. 전자는 policy에
넘길 state를 복원하고, 후자는 허용 가능한 action과 update를 제한한다.
두 owner를 분리하지 않으면 sensor aliasing을 optimizer 문제로 오진하거나,
belief uncertainty를 safety guarantee로 오해한다.

각 branch는 핵심 아티클을 먼저 보이고 paper evidence는 닫힌
`선택 원문 근거`로 둔다. RL root에는 대표 source paper 한 편만 남겨,
최소 시작점 아래의 과거 논문이 현재 학습 목적을 가리지 않게 했다.

LLM post-training 경로는 다음 순서를 보존한다.

1. 현재 reasoning frontier
2. feedback and verifier contract
3. RLHF execution baseline
4. policy optimization
5. Open-R1 implementation

## Content reconstruction

### Decision and foundations

- `rl-decision-system-contracts`: reward보다 먼저 action, feedback delay,
  intervention 권한, data access와 release gate를 고정한다.
- `rl-mdp-bellman`: transition, reward, return, Bellman backup을 계산한다.
- `rl-temporal-difference-dqn`: bootstrapping, target network, replay와
  overestimation failure를 연결한다.
- `rl-policy-gradient-actor-critic`: score-function gradient, baseline,
  advantage와 critic bias를 연결한다.
- `rl-ppo-continuous-control`: ratio, clipping, TD/GAE, critic target,
  integrated loss, DDPG와 SAC의 continuous-action handoff를 보존한다.

### Branch-specific systems

- `rl-imitation-offline-learning`: BC, DAgger, offline RL, CQL, IQL와 OPE를
  data access 및 distribution shift 기준으로 구분한다.
- `rl-model-based-world-models`: Dyna, World Models, MuZero, Dreamer를
  model target, action-time search, training-time imagination과 error horizon
  기준으로 구분한다. MPC는 매 step action sequence를 다시 비교하고 첫
  action만 실행하는 방식으로 정의한다.
- `rl-pomdp-state-estimation`: observation aliasing, POMDP tuple, Bayesian
  belief update, value of information, Kalman trust, NIS, recurrent burn-in과
  masked sequence loss를 한 실행 흐름으로 만든다.
- `rl-safe-constrained-learning`: CMDP, Lagrangian, CPO, Lyapunov local
  feasible set, Recovery RL, timing margin과 hardware interlock을 서로 다른
  보장 층으로 구분한다.

### Reasoning and post-training

- `reasoning-post-training-frontier`: training compute와 test-time compute,
  candidate search, sparse credit assignment, hidden verifier,
  monitorability와 marginal token efficiency를 구분한다.
- `post-training-rlvr`: CPT, SFT, preference optimization, reward-model PPO와
  RLVR을 feedback owner와 distribution shift 기준으로 비교한다.
- `rlhf`: Bradley-Terry reward model, terminal reward, per-token KL,
  return-to-go, PPO clipping과 held-out human preference를 계산한다.
- `open-r1`: one dataset row가 chat template, SFT mask, grouped rollout,
  verifier reward, group-relative advantage, clipped policy update,
  checkpoint evaluation으로 이동하는 과정을 복원한다.

## Formula contract

모든 핵심 display 식은 다음 두 층을 갖는다.

1. 수식 내부의 짧은 한글 역할 표지
2. 수식 아래 `FormulaNote`의 연산 이유, 기호, 실패 경계

긴 식은 자동 축소에 맡기지 않고 의미 보존 중간 변수로 분해했다.

- GRPO: `rho -> u -> clipped rho -> c -> L_clip`
- POMDP control: observation-conditioned future value `F*(b,a)`
- recurrent replay: burn-in output `h-tilde_B`, stopped state `h_B`,
  masked error `e_t`, normalized sequence loss
- PPO continuous control: action gradient와 entropy contribution 중간값

최종 local browser audit:

- POMDP display formulas: 12/12 Korean annotations
- POMDP at 360 px: minimum visible font 12 px, overflow 0
- POMDP at 390 px: minimum visible font 12 px, overflow 0
- POMDP at 768/1440 px: minimum visible font 16 px, overflow 0
- Open-R1 at 390 px: six formulas, minimum visible font 12.42 px,
  clipped update 16 px, overflow 0
- all audited article documents: horizontal overflow 0, KaTeX errors 0

## Visual contract

Viz는 색 변경으로 개선됐다고 판정하지 않았다. 다음을 함께 검증했다.

- 현재 읽는 항목이 한눈에 보이는 정보 위계
- 한국어 우선 label과 12 px 이상의 실제 표시 크기
- 두꺼운 border와 빈 장식 surface 축소
- mobile에서 가로 압축 대신 vertical timeline 또는 stacked state
- controls가 실제 숫자, 상태와 판단 문구를 함께 변경
- animation이 원인과 결과의 순서를 가르치며 decorative motion으로 끝나지 않음

Reasoning frontier의 mobile credit assignment는 vertical timeline으로 바꾸고,
compute·entropy·evidence lab은 서로 다른 장부를 유지했다. RL foundation,
offline RL, world model, POMDP와 safety labs는 계산 state를 DOM oracle로
검증했다.

## Source and intention ledger

Source는 article taxonomy를 대신하지 않는다. 각 원문은 다음 의도로 배치했다.

- Bellman, policy gradient, PPO: 최소 optimization foundation
- DAgger, CQL, IQL: demonstration correction과 fixed-log conservatism
- Dyna, World Models, MuZero, Dreamer: model target과 planning time의 차이
- POMDP, Kalman filter, DRQN/R2D2 lineage: latent state와 learned memory의 경계
- CPO, Lyapunov safe RL, Recovery RL: expected constraint, local feasible
  update와 runtime recovery의 서로 다른 보장
- DeepSeek-R1 and Open-R1 official implementation: reasoning RL claim과
  executable recipe의 경계

공식 repository, paper publication page와 저자 기술 문서를 우선했고,
현재 implementation 수치는 source snapshot을 명시했다. 원문이 보장하지
않는 production safety, general reasoning capability 또는 serving topology를
확장 주장으로 쓰지 않았다.

## Context Manager and Claude evidence

넓은 multi-file 호출은 Context Manager 500, 180-second timeout 또는
응답 없는 hang을 만들었다. 성공 헤더가 없는 결과는 Claude 검토로 세지
않았다. Direct CLI로 우회하지 않고, 파일과 검증 질문을 독립적으로 잘라
parallel retry했다. 최초 wide `Promise.all` hang은 종료한 뒤 bounded
review로 다시 요청했다.

최종 채택한 응답은 모두 `[claude-code:sonnet` 헤더를 가진다.

- IA: `[claude-code:sonnet · L1 · $0.0000 · 179386ms]`
- reasoning final: `[claude-code:sonnet · L1 · $0.0000 · 44490ms]`
- Open-R1 GRPO initial closure:
  `[claude-code:sonnet · L1 · $0.0000 · 18204ms]`
- Open-R1 data and evaluation:
  `[claude-code:sonnet · L1 · $0.0000 · 17408ms]`
- post-training/RLVR:
  `[claude-code:sonnet · L1 · $0.0000 · 36690ms]`
- RLHF: `[claude-code:sonnet · L3 · $0.0000 · 107822ms]`
- imitation/offline RL:
  `[claude-code:sonnet · L1 · $0.0000 · 29013ms]`
- PPO/continuous control:
  `[claude-code:sonnet · L1 · $0.0000 · 177109ms]`
- world models final:
  `[claude-code:sonnet · L1 · $0.0000 · 9264ms]`
- safe RL final:
  `[claude-code:sonnet · L2 · $0.0000 · 51431ms]`
- safe RL Lagrangian mobile split:
  `[claude-code:sonnet · L2 · $0.0000 · 55291ms]`
- Open-R1 split clipped update:
  `[claude-code:sonnet · L1 · $0.0000 · 21482ms]`
- POMDP full article:
  `[claude-code:sonnet · L2 · $0.0000 · 30093ms]`
- POMDP algebraic split:
  `[claude-code:sonnet · L1 · $0.0000 · 26904ms]`
- POMDP final burn-in split:
  `[claude-code:sonnet · L1 · $0.0000 · 17427ms]`

Claude가 찾은 실제 누락을 모두 닫았다.

- reasoning의 구체 sparse-credit example, GRPO, clipped objective,
  overthinking efficiency와 adversarial verifier
- RLVR의 DPO/RM-PPO 분기, verifier FP/FN와 policy distribution shift
- RLHF의 numeric Bradley-Terry, terminal reward-to-go와 held-out evidence
- Safe RL의 saddle point, Fisher matrix, QCQP, conjugate gradient,
  line search 정의
- World Model의 MPC first-use definition
- POMDP의 Korean internal annotations와 mobile algebraic split

최종 Claude 판정은 위 파일 모두 `PASS`, `REMAINING MUST FIX: 없음`이다.

## Small-model reconstruction plan

### 4B worker packet

4B worker에는 하나의 claim-mechanism-formula-failure packet만 준다.

```json
{
  "reader_question": "one falsifiable question",
  "owner": "state|policy|data|model|safety|verifier",
  "source_locator": "one exact primary source slice",
  "claim": "bounded claim",
  "assumptions": ["explicit conditions"],
  "operation_order": ["step 1", "step 2"],
  "formula": "one atomic or split equation",
  "korean_labels": ["role labels"],
  "formula_note": ["why", "symbols", "does_not_prove"],
  "counterexample": "one failure",
  "viz_state": "one causal transition",
  "acceptance": "one browser or numeric oracle"
}
```

4B worker는 전체 커리큘럼을 재배치하거나 다른 paper를 prerequisite로
승격하지 않는다. Source의 조건과 보장 범위를 먼저 IR로 만들고 prose는
그 뒤에 쓴다.

### 9B reviewer packet

9B reviewer에는 한 causal section 또는 한 branch의 4B packet들을 준다.
다음을 검토한다.

- observation versus state
- behavior action versus executed shield action
- online rollout versus fixed log
- model prediction versus value prediction
- action-time planning versus training-time imagination
- expected budget versus trajectory and hardware safety
- public reward versus hidden capability
- old policy versus reference policy
- algebraic equivalence after mobile formula splitting
- whether the section alone solves its hidden transfer slice

출력은 missing definition, contradiction, unsupported transfer, smallest repair로
제한한다. 전체 글을 새로 쓰지 않는다.

### Orchestrator responsibility

상위 orchestrator만 다음을 소유한다.

- current-first route와 branch ownership
- source freshness and snapshot
- accepted Claude transport headers
- cross-article notation and handoff
- hidden transfer challenge
- responsive browser metrics and screenshot review
- build, test, deployment and production evidence

## Verification

- targeted ESLint: passed
- four-article focused Playwright suite: 14 passed
- POMDP 360/390/768/1440 suite: 4 passed
- combined local RL/reasoning regression: 54 passed in 1.3 minutes
- production build: 8,866 modules transformed, built in 19.70 seconds
- existing advisory only: chunks over 900 kB
- public deploy verified at 2026-07-25 17:23:17 KST
- local/public asset identity:
  `index-DRKe4dcK.js`, `index-CpH1z_BQ.css`
- five public route probes: HTTP 200
- final production RL/reasoning regression: 54 passed in 1.1 minutes
- final production Safe RL Lagrangian at 390 px:
  scale 1.00, visible font 12 px, overflow 0

The current shell could not authenticate a `systemctl` restart and the unit was
not visible in its user namespace. This was not recorded as a successful
restart. The site publishes the built static directory directly: the public
HTML changed to the new local asset hashes, all target routes returned 200, and
the complete browser suite ran against those public assets.

Screenshots inspected:

- `/tmp/pomdp-belief-control-360.png`
- `/tmp/pomdp-learned-memory-360.png`
- `/tmp/safe-rl-lagrangian-production-390.png`

## Decision provenance

최종 구조는 기존 article count나 publication year에서 만들지 않았다.
Hidden challenge의 failure를 owner에 배정하고, owner가 독립적인 판단과
검산을 요구할 때만 branch와 article을 유지했다.

- 잘못된 문제 선택 -> RL application contract
- 불완전한 관측 -> state estimation
- fixed log extrapolation -> offline RL
- imagined shortcut -> world model audit
- 위험과 성능의 교환 -> constrained optimization
- 늦은 intervention -> runtime recovery and hardware safety
- reward만 상승 -> hidden verifier and capability evaluation
- update 폭주 -> policy ratio and clipping

이 owner graph가 sidebar와 article handoff를 결정했다. 최신 연구는 해당
owner 위에 추가할 수 있고, 새 개념이 정말 필요할 때만 최소 기반 아래에
새 prerequisite를 추가한다.
