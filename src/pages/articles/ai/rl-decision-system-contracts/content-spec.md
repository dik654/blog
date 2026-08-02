# 강화학습 적용 계약 content spec

## Goal
- 독자가 알고리즘 이름을 고르기 전에 자기 문제가 정말 순차 의사결정인지 판정하고, 필요한 RL 분기 하나만 선택한다.
- observation, latent state, action, feedback, termination, data access, constraint와 release evidence가 하나의 실행 계약으로 닫혀야 학습을 시작할 수 있음을 증명한다.

## Source anchors
| Area | Source | Why it matters |
|---|---|---|
| Environment API | Gymnasium `Env.step` | observation, reward, terminated, truncated의 실제 handoff |
| Reasoning RL | DeepSeek-R1 report | verifier feedback을 쓰는 current application과 cold-start 경계 |
| Embodied system | Gemini Robotics-ER 1.6 official release | high-level reasoner, VLA/tool call과 layered safety의 현재 system boundary |
| Offline RL | RL Unplugged, Active Offline Policy Selection | logged data, OPE와 제한된 online evaluation의 책임 |
| World model | DreamerV3 Nature paper | learned latent dynamics와 imagination policy learning의 범위 |

## Full-scope map
| Topic | Must cover | Depth | Notes |
|---|---|---|---|
| RL fit | action이 future data distribution을 바꾸는가 | deep | 단순 prediction과 구분 |
| Environment contract | observation/state/action/reward/termination/constraint | deep | 이름보다 unit, frame, timing |
| Data access | live, simulator, log, expert, verifier | deep | algorithm family를 먼저 제한 |
| Objective | expected return, occupancy shift, support | deep | 평균 점수만 보지 않음 |
| Goal branches | policy, offline, world model, state/safety, LLM post-training | deep | 독립 경로로 선택 |
| Release | return, violation, shift, latency gate | deep | fail-closed |
| Algorithm derivation | PPO·CQL·Dreamer 상세 | defer | 각 독립 글로 이동 |

## Private transfer fixture

한 warehouse robot이 camera와 joint sensor를 보고 fragile parcel을 conveyor에서 집는다. 성공 reward는 +1, 파손은 -100, timeout은 8초다. 실제 robot interaction은 하루 200 episode, simulator는 contact friction이 실제보다 15% 낮고, 기존 operator log의 92%는 쉬운 parcel이다. 독자는 본문만으로 다음을 판단해야 한다.

1. 단순 supervised prediction으로 끝나지 않는 이유는 action이 다음 observation과 data distribution을 바꾸기 때문이다.
2. 실제 online PPO부터 시작하면 안 된다. imitation/offline warm start와 simulator를 쓰되 support와 sim-real gap을 추적한다.
3. camera frame만 state라고 가정하지 않고 occlusion history와 joint state를 belief/memory로 만든다.
4. average return이 올라가도 breakage, OOD parcel, end-to-end latency가 gate를 통과하지 못하면 release하지 않는다.
5. LLM reasoning RL은 별도 verifier environment이며 robot actuator path와 같은 안전 보증을 공유하지 않는다.

## Section plan

### 1. 이 문제가 정말 RL인가
- Concept: action이 future observation과 training distribution을 바꾸는 sequential feedback 여부.
- Viz: `RlFitLab`에서 reasoning, robot, forecast, classifier를 전환하고 feedback loop 유무를 판정.
- Failure: reward라는 숫자를 붙였다는 이유만으로 static prediction을 RL로 바꾸는 오류.

### 2. 환경과 feedback 계약
- Concept: `step(action) -> observation, reward, terminated, truncated, info`와 별도 safety cost.
- Formula: trajectory probability와 expected discounted return.
- Failure: latent state와 sensor observation 혼동, timeout과 terminal 혼동, reward와 safety constraint 혼합.

### 3. Data access가 정하는 분기
- Concept: live, simulator, fixed log, expert query, verifier가 허용하는 update family.
- Viz: `DataAccessForkLab`에서 access mode마다 가능한 route, 필요한 evidence와 금지 shortcut 표시.
- Formula: discounted occupancy와 offline importance ratio/ESS.

### 4. 목표별 최소 경로
- Concept: policy control, offline, world model, state/safety, LLM reasoning은 같은 선수 과목 줄이 아니다.
- Failure: 모든 branch를 순서대로 읽거나 DeepSeek-R1을 일반 robot RL 보증으로 확대.

### 5. 평가와 release gate
- Concept: average return과 constraint, distribution shift, latency를 논리곱 gate로 분리.
- Viz: `RlReleaseGateLab`에서 success, violation, OOD gap, latency를 바꾸고 release/review/block 판정.
- Formula: fail-closed release conjunction.

## Formula contract
- 모든 display formula는 `data-formula-pair` wrapper 안에서 바로 뒤 `FormulaNote`와 짝을 이룬다.
- 수식 내부에 `\underbrace{...}_{\text{한글 역할}}`를 사용한다.
- 390px에서 행을 분리하고 최종 글자 12px 이상, overflow 1px 이하로 유지한다.

## Viz contract
- 고정 폭 SVG를 사용하지 않는다.
- figure header, segmented control, divided result band의 높이는 선택 상태가 바뀌어도 안정적으로 유지한다.
- 파랑=구조, 초록=적합/통과, 주황=review, 빨강=block 의미에만 쓴다.
- 자동 animation은 전체 corpus 본문 재구성 뒤에 추가한다.

## 4B packet
`problem card 1개 -> sequential feedback yes/no -> data access 1개 -> allowed route 1개 -> forbidden shortcut 1개 -> release metric 1개 -> browser oracle`

## 9B packet
`product failure cost -> environment schema -> policy-induced distribution -> data access fork -> candidate route -> support/safety boundary -> release gate -> source boundary -> prose/formula/Viz/test`

## Coverage recheck
| Scope item | Covered by | Gap |
|---|---|---|
| 적용 판정 | Section 1 | none |
| Environment handoff | Section 2 | none |
| Online/offline/simulator/verifier | Section 3 | none |
| 기존 글 연결 | Section 4 | none |
| Production release | Section 5 | none |
| 개별 algorithm derivation | 독립 글 | intentionally deferred |
