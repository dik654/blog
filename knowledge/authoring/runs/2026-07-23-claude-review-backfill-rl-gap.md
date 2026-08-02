# Claude review backfill: RL gap

Date: 2026-07-23

## Identity gate

Context Manager의 `cm_route_delegate`로 RL 글 5개를 아티클 단위로 좁혀 검토했다. 관찰한
응답 header가 정확히 `[claude-code:sonnet`으로 시작한 실행만 채택했다. Codex fallback,
timeout, 연결 실패와 socket 종료는 모두 폐기했다.

| target slug | accepted header | high | medium | low | disposition |
|---|---|---:|---:|---:|---|
| `rl-mdp-bellman` | `[claude-code:sonnet · L3 · $0.0000 · 83130ms]` | 0 | 2 | 0 | 모두 `confirmed_then_fixed` |
| `rl-policy-gradient-actor-critic` | `[claude-code:sonnet · L3 · $0.0000 · 110533ms]` | 0 | 1 | 1 | 모두 `confirmed_then_fixed` |
| `rl-temporal-difference-dqn` | `[claude-code:sonnet · L3 · $0.0000 · 150560ms]` | 0 | 2 | 0 | 모두 `confirmed_then_fixed` |
| `rl-pomdp-state-estimation` | `[claude-code:sonnet · L3 · $0.0000 · 172587ms]` | 0 | 2 | 0 | 모두 `confirmed_then_fixed` |
| `rl-model-based-world-models` | `[claude-code:sonnet · L3 · $0.0000 · 128864ms]` | 0 | 2 | 1 | 모두 `confirmed_then_fixed` |
| `rl-mdp-bellman` spec/Viz | `[claude-code:sonnet · L3 · $0.0000 · 33906ms]` | 0 | 0 | 0 | 좁은 범위 통과 |
| `rl-mdp-bellman` hidden fixture | `[claude-code:sonnet · L3 · $0.0000 · 93406ms]` | 1 | 0 | 0 | `confirmed_then_fixed` |

고유 target은 5개, 채택한 true-Claude 실행은 7개다. 총 17회 중 10회는 폐기했다.

## Confirmed findings

### MDP와 Bellman

첫 pass는 유한 terminal episode와 continuing return, true termination과 time-limit
truncation의 차이가 다음 TD 글로 넘어가기 전에 더 명시적이어야 한다고 지적했다. 현재 글은
episodic·continuing return을 별도 식으로 보여 주고, 실제 종료에서는 bootstrap을 끊지만
시간 제한에서는 next value를 유지하는 target을 한국어 주석과 함께 설명한다. `backup`과
`credit`도 현재 추정에 다음 가치를 접는 연산, 이전 결정으로 전달되는 책임 신호로 풀었다.

별도 cross-file pass에서는 더 중요한 문제를 찾았다. Hidden transfer fixture가 공개 Viz의
history, reward, gamma, Q, policy, advantage와 Bellman 숫자를 거의 그대로 재사용해
전이 능력이 아니라 공개 예제 기억을 채점하고 있었다.

현재 hidden fixture는 다음처럼 완전히 분리됐다.

- History: `0→2`, `3→2`
- Reward: `[2,-1,3,0,4]`, `γ=.8`
- Safe/risk branch: `.4/.6`, policy `.7/.3`
- Time-limit bootstrap: `V=2.5`
- Oracle: `G0=4.7584`, `G1=3.448`, truncated `5.5776`
- Oracle: `Q=2.9/1.92`, `V=2.606`, `A=.294/-.686`

기존 숫자는 `Public Viz numeric oracle` 아래에만 남고 hidden scoring에는 사용할 수 없다고
명시됐다. 이 high finding은 `confirmed_then_fixed`다.

### Policy gradient와 actor-critic

`GAE`가 이름만 먼저 등장하던 구간은 `Generalized Advantage Estimation`과 기능 설명으로
보완됐다. Actor-critic 전환부도 `bootstrap(부트스트랩)`과
`TD residual(시간차 잔차)`을 첫 사용에서 푼다.

Claude가 high로 제시한 긴 수식 overflow는 결함으로 채택하지 않았다. 공용
`MathFormula`는 `ResizeObserver` 기반 display auto-fit, max-width와 overflow 제약을
사용한다. 실제 browser 증거 없이 source만으로 overflow를 확정할 수 없다. Baseline 문장의
분산 대상도 인접 Lab이 `sample gradient 분산`으로 명시하므로 exact gradient와 혼동된다는
medium 지적은 기각했다.

### TD와 DQN

Replay buffer와 function approximator가 설명보다 먼저 사용되던 흐름을 수정했다. 현재 글은
과거 transition 저장소와 Q network라는 기능을 첫 사용에서 설명한다. Finite lambda-return의
`N`도 현재 시점부터 terminal `T`까지 남은 최대 return horizon으로 FormulaNote에 정의한다.

수식 overflow 주장은 같은 공용 auto-fit 경계 때문에 browser 결함으로 확인되지 않아 채택하지
않았다. 부호, terminal mask, SARSA/Q-learning target, DQN/Double DQN의 선택·평가
network 분리는 통과했다.

### POMDP와 state estimation

`NIS`, `EKF`, `UKF`, `RSSM`은 각각 정식 명칭과 한국어 의미를 첫 사용에서 풀었다. Viz의
evidence `P(o)`와 본문 정규화 상수 `Z_(t+1)` 사이도
`Z_(t+1)=P(o_(t+1)|b_t,a_t)`로 직접 연결했다. Bayes prediction, correction,
normalization의 시간 순서와 숫자는 일치했다.

### Model-based RL과 world models

`MDN-RNN`, `MCTS`, `RSSM`의 첫 사용 명칭을 보완했다. Model-bias Lab은 acceleration
단위와 추상 step을 혼합하던 경계를 `Δt=1s`인 교육용 계산으로 고정했다.

Claude가 high로 제시한 Dreamer lambda-return indexing은 기각했다. 인용된
[DreamerV3 Nature 출판본](https://www.nature.com/articles/s41586-025-08744-2)이
글과 같은 `r_t`, `c_t`, `v_t` 재귀를 사용한다. 현재 FormulaNote는 출판본 표기를 따른다는
점과 transition reward를 next-state index에 붙이는 구현에서는 같은 재귀가 한 칸 이동할 수
있다는 점을 함께 명시한다.

## Rejected ledger

| id | target | result | reason |
|---|---|---|---|
| A01 | MDP | `[codex:gpt-5.5 · L3 · $0.0000 · 272929ms]` | Codex fallback |
| A02 | Policy gradient | timeout | header 없음 |
| A03 | TD/DQN | `[codex:gpt-5.5 · L3 · $0.0000 · 287182ms]` | Codex fallback |
| A04 | POMDP | unable to connect | header 없음 |
| A05 | World models | unable to connect | header 없음 |
| A06 | MDP | `[codex:gpt-5.5 · L3 · $0.0000 · 259760ms]` | Codex fallback |
| A07 | Policy gradient | socket closed | header 없음 |
| A08 | TD/DQN | `[codex:gpt-5.5 · L3 · $0.0000 · 250388ms]` | Codex fallback |
| A09 | POMDP | timeout | header 없음 |
| A10 | World models | unable to connect | header 없음 |

## Coverage boundary

기존 identity-audited baseline 57개에 이 ledger의 고유 RL 5개를 합치면 이 ledger만의
기여는 `57 → 62 / 71`이다. 동시에 작성된 architecture와 training ledger는 실행 횟수가
아니라 slug 합집합으로 다시 계산해야 한다.

이 reviewer는 앱 코드를 수정하지 않았다. Root agent가 확인된 finding을 수정했고, 이
reviewer는 최종 파일과 MDP hidden/public fixture 분리를 다시 확인했다. 새 screenshot 실행은
이 보고서의 범위가 아니다.
