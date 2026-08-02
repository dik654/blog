# 강화학습 학습 경로 재구성 보고서

이 문서는 강화학습 논문을 오래된 순서로 모두 읽게 만드는 목록이 아니다. 현재 해결할 행동 문제에서 시작해 RL이 필요한지, 어떤 data에 접근할 수 있는지, 어떤 실패를 막아야 하는지를 먼저 고정하고, 그 답에 맞는 한 분기와 최소 기반만 여는 과정이다. 같은 이름의 JSON은 4B·9B 모델이 이 작업을 작은 검증 단위로 재현하기 위한 실행 packet이다.

## 1. 기존 구성이 체계적으로 보이지 않은 이유

기존 강화학습 글은 각각 충분히 깊었지만 `MDP -> POMDP -> DQN -> PPO -> Offline RL -> World Model -> Safety`처럼 한 줄에 놓여 있었다. 이 순서는 서로 다른 세 축을 섞었다.

- **문제 계약**: action이 다음 observation과 data distribution을 바꾸는가?
- **data access**: 새 rollout, simulator, fixed log, expert query, verifier 중 무엇을 쓸 수 있는가?
- **목표 분기**: policy control, offline learning, planning, state estimation, safety 중 무엇이 실제 병목인가?

Offline RL 사용자가 PPO를 먼저 읽을 이유가 없고, 부분 관측 문제를 푸는 사람이 모든 DQN 역사를 선수 과목으로 읽을 이유도 없다. 반대로 reward라는 숫자가 있다는 이유만으로 static forecasting이나 image classification을 RL 문제로 바꿔서도 안 된다.

이를 다음 여섯 branch로 다시 나눴다.

1. `00 · 적용 계약`: observation, action, feedback, data access, failure cost와 release gate를 고정한다.
2. `01 · Policy · 제어`: 새 rollout과 continuous action을 쓸 수 있을 때 PPO, advantage와 policy shift를 검산한다.
3. `02 · Demonstration · Offline`: expert 또는 fixed log의 coverage, support와 OPE를 검산한다.
4. `03 · World Model · Planning`: learned dynamics의 model bias, search target과 real-return gap을 검산한다.
5. `04 · State · Safety`: 부분 관측 state estimation, expected constraint와 runtime shield를 분리한다.
6. `05 · 최소 기반`: 선택한 분기의 계산이 막힐 때만 MDP, return, Bellman, MC·TD·Q-learning으로 내려간다.

상위 화면에는 현재 embodied system boundary와 canonical PPO 한 편만 보인다. 나머지 21편의 원문 재구성은 해당 분기의 `선택 원문 근거` 안에 기본 접힘으로 남겼다. 최소 바닥은 강화학습 역사의 최초 논문이 아니라 현재 분기의 target을 계산할 수 있는 MDP·TD 지점에서 멈춘다.

## 2. 글별 책임과 연결

- `rl-decision-system-contracts`: 이 문제가 RL인지 판정하고 environment protocol, data access fork와 fail-closed release gate를 만든다.
- `rl-ppo-continuous-control`: 배포 action, stored rollout, terminal mask, GAE, clipping과 continuous control 선택을 한 실행 흐름으로 잇는다.
- `rl-policy-gradient-actor-critic`: trajectory probability, log-derivative, baseline, advantage와 actor-critic update를 계산 바닥으로 제공한다.
- `rl-imitation-offline-learning`: behavior cloning의 covariate shift, DAgger의 expert query, offline support와 OPE 경계를 다룬다.
- `rl-model-based-world-models`: learned transition, planning, latent imagination과 model exploitation을 구분한다.
- `rl-safe-constrained-learning`: average reward와 constraint, training-time expectation과 runtime action 차단을 분리한다.
- `rl-pomdp-state-estimation`: latent state, belief update, filtering과 recurrent memory가 필요한 조건을 설명한다.
- `rl-mdp-bellman`, `rl-temporal-difference-dqn`: state·return·Bellman과 MC·TD·Q target의 최소 계산 바닥이다.

LLM reasoning RL은 일반 순차 의사결정과 형식은 공유하지만 별도 제품 계약으로 둔다. RLVR, verifier, rollout compute, PPO·GRPO 구현은 LLM post-training 경로에 남겨 physical actuator safety와 섞지 않았다.

## 3. 원문 근거와 주장 경계

- Gymnasium Env API: `step(action)`의 observation, reward, terminated, truncated, info 계약에 사용했다. 이 API가 실제 robot safety를 보증한다고 확대하지 않았다.
- Google DeepMind Gemini Robotics-ER 1.6: high-level embodied reasoner가 VLA·tool을 호출하고 safety를 별도 평가하는 현재 system boundary에 사용했다. 이 release 자체를 RL 알고리즘으로 쓰지 않았다.
- DeepSeek-R1: reasoning RL, R1-Zero와 cold-start의 범위에 사용했다. Verifier reward를 robot constraint 보증으로 바꾸지 않았다.
- RL Unplugged: fixed log, standardized dataset·environment·evaluation protocol에 사용했다. Offline benchmark score를 online deployment guarantee로 확대하지 않았다.
- Active Offline Policy Selection: OPE 뒤 제한된 real interaction으로 candidate를 고르는 경계에 사용했다. 무제한 online exploration으로 해석하지 않았다.
- DreamerV3 출판본: learned world model과 latent imagination actor-critic에 사용했다. One-step prediction loss나 simulator score가 physical deployment를 보증한다고 쓰지 않았다.
- PPO와 기존 21편 논문: 각 branch의 mechanism 원문으로 유지했다. 논문 발표 순서를 모든 독자의 필수 curriculum으로 만들지 않았다.

## 4. 본문만으로 풀어야 하는 비공개 전이 문제

Warehouse robot이 fragile parcel을 집는다. Real interaction은 하루 200 episode만 가능하고 simulator의 friction은 실제보다 15% 낮다. 기존 log의 92%는 쉬운 parcel이며 평균 성공률은 86%, safety violation은 2%, OOD success gap은 11pt, sensor-to-action P95 latency는 74ms다.

독자는 본문만으로 다음 판단에 도달해야 한다.

1. Action이 다음 camera·joint observation과 수집 trajectory를 바꾸므로 sequential decision problem이다.
2. Real exploration 예산이 작으므로 PPO를 바로 고르지 않는다. Simulator branch와 fixed-log branch를 먼저 분리한다.
3. Simulator friction 오차 때문에 imagined return과 real return을 같이 보고 domain randomization 범위를 기록한다.
4. Log가 쉬운 parcel에 편향되어 있으므로 average accuracy 대신 behavior coverage, OOD action rate, ESS·OPE와 fragile slice를 본다.
5. Safety violation 2%는 success 86%로 상쇄할 수 없는 hard block이다.
6. Violation을 1% 이하, OOD gap을 8pt 이하로 낮추고 latency 80ms 이하를 유지해야 release가 가능하다.
7. Return·bootstrap 계산이 막힐 때만 MDP·TD 글을 연다. 모든 paper spine은 기본 선수 과목이 아니다.

이 fixture의 목적은 알고리즘 이름을 맞히는 것이 아니라 잘못된 data assumption과 release shortcut을 거부하는 데 있다.

## 5. 수식과 Viz 계약

새 글의 표시 수식 세 개는 모두 수식 내부 한글 역할 주석과 바로 뒤 `FormulaNote`를 가진다.

- trajectory 식: policy action과 environment transition이 전체 return distribution을 함께 만든다는 의존성을 보여 준다.
- occupancy·importance 식: policy가 방문 state를 바꾸며 offline ratio의 denominator가 작을 때 ESS가 무너지는 이유를 보여 준다.
- release 논리곱: task success, safety cost, distribution shift, P95 latency를 평균내지 못하게 한다.

모바일에서 긴 식을 여러 aligned row로 분리해 최종 scale 0.7 이상, KaTeX font 12px 이상, horizontal overflow 1px 이하를 browser oracle로 고정했다.

- `RL Fit Lab`: robot, reasoning verifier, forecast, image classification을 바꾸며 RL 후보 여부와 이유를 비교한다.
- `Access Fork`: live, simulator, fixed log, expert, verifier마다 가능한 route, 필요한 증거와 금지 shortcut을 함께 바꾼다.
- `Release Gate`: success, violation, OOD gap, latency slider를 조작해 BLOCK·REVIEW·RELEASE 판정을 확인한다.

세 Viz는 고정 폭 SVG 없이 CSS grid와 `min-width: 0`을 사용한다. 색은 선택·통과·검토·차단 의미에만 사용하고 장식용 선이나 자동 animation은 넣지 않았다. Animation은 전체 본문 재구성이 끝난 뒤 시간 순서 자체가 개념인 곳에만 추가한다.

## 6. Context-manager 협업 기록

사용자 지시대로 direct Claude CLI는 사용하지 않았다.

1. 구현 전 강화학습 IA·최신 연구 감사를 context-manager `ai-researcher`에 새 요청했으나 HTTP 500 `Provider error: All providers failed`로 끝났다.
2. 구현·시각 검증 뒤 범위를 파일 여섯 개와 다섯 claim boundary로 줄여 `ai-researcher`에 재요청했지만 같은 provider 500이 반복됐다.
3. 정보구조만 별도로 보기 위해 context-manager `curator`에 요청했으나 같은 provider 500으로 실패했다.

따라서 Claude가 이번 결과를 검토했다고 기록하지 않는다. 구현은 공식 원문 claim boundary, 비공개 전이 문제, 60개 관련 회귀, 11개 전용 계약과 12개 viewport visual audit로 독립 검증했다. Provider가 복구되면 동일 bounded packet을 재전송할 수 있도록 요청 범위와 실패 응답을 이 보고서에 보존했다.

## 7. 4B·9B 모델용 재현 packet

4B 모델에는 한 판정만 준다.

```text
문제 fixture 1개
-> action이 future data를 바꾸는지 판정
-> data access mode 1개
-> primary source claim 1개
-> 금지 extrapolation 1개
-> 계산 target 또는 release gate 1개
-> 잘못된 shortcut 1개
-> interactive state 1개
-> 390px formula·overflow·console oracle
```

예: fixed log만 있는 warehouse fixture를 주고 behavior coverage, importance ratio, ESS failure와 online 배포 전 필요한 증거만 생성하게 한다.

9B 모델에는 한 branch 전체를 준다.

```text
application contract
-> observation/action/feedback/termination
-> available data and forbidden access
-> current mechanism
-> minimum mathematical floor
-> hard transfer fixture
-> competing method and trade-off
-> source boundary
-> release gate
-> prose/formula/Viz/test packet
```

오케스트레이터는 branch 사이의 공통 용어, minimum stopping line, LLM reasoning과 physical safety의 경계, 접힌 paper evidence를 유지한다. 작은 모델 출력은 장문 prose보다 먼저 다음 JSON 형태로 받는다.

```text
claim / evidence / boundary / observation / action / feedback /
data_access / invariant / failure / viz_state / release_gate / test
```

## 8. 추론을 구현으로 바꾼 과정

숨은 사고 과정을 복제하지 않고 재현 가능한 의사결정만 남긴다.

1. **관찰**: 깊은 글과 21편 원문이 한 목록에 섞여 독자가 모든 역사를 읽어야 할 것처럼 보였다.
2. **가설**: 알고리즘 연대기 대신 application contract와 data access로 먼저 나누면 필요한 branch가 하나로 줄어든다.
3. **경계 설정**: embodied reasoner, reasoning RL, offline data, world model, safety source의 허용 claim과 금지 extrapolation을 분리했다.
4. **최소 바닥 설정**: branch 계산이 막힐 때만 MDP·TD로 내려가고 더 과거의 paper spine은 접었다.
5. **전이 문제 설계**: limited real rollout, biased log, simulator dynamics error, safety violation과 latency를 한 fixture에 결합했다.
6. **구현**: parent IA, six branches, authored paths, source folding, top-down track와 적용 계약 글을 같은 구조로 연결했다.
7. **검증**: route order, hidden sources, formula annotation·scale·font, interaction state, overflow와 console을 Playwright로 고정했다.
8. **배포 기록**: service timestamp, 공개 HTTP, 공개 browser contract와 chunk hash를 남겨 재배포 여부를 추측하지 않게 했다.

## 9. 검증과 현재 상태

- Production Vite build: 통과, 9,388 modules, 19.05s.
- 관련 정보구조·본문 회귀: `60/60` 통과.
- RL 재구성 전용 계약: local `11/11`, public `11/11` 통과.
- Visual audit: 4 routes × 3 viewports, console error 0, document overflow 0, overlap 0.
- 수동 시각 검토: 390, 768, 1440px. Viz·수식·branch row 잘림 없음.
- `git diff --check`: 통과.
- 공개 HTTP: parent, six branches와 새 article 모두 200.
- `cm-blog.service` 재시작: 2026-07-23 02:34:40 KST.
- 공개 RL chunk 7개의 SHA-256이 로컬 production build와 모두 일치했다.

전체 corpus의 다음 미완료 경로가 남아 있으므로 formal goal은 완료 처리하지 않는다.
