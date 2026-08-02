# MC·TD·Q-learning·DQN content spec

## Reader outcome

환경이 value 정답표를 주지 않아도 한 transition에서 학습 target을 만드는 과정을 계산할 수 있어야 한다. 관측한 reward와 추정한 미래를 분리하고, SARSA와 Q-learning의 다음 행동 선택 주체, termination과 truncation, DQN과 Double DQN의 선택·평가 network를 끝까지 추적한다.

이 글은 알고리즘 이름을 나열하는 글이 아니다. 하나의 숫자 예제를 계속 재사용해 target이 어느 선택에서 달라지는지 증명하는 실행 계약이다.

## Ownership and cutoff

### 깊게 다룬다

- Monte Carlo, n-step return, finite-horizon λ-return
- One-step TD residual과 bootstrap bias·variance
- SARSA의 behavior next action과 Q-learning의 greedy target action
- Exploration, off-policy, coverage의 서로 다른 역할
- DQN replay, target network, terminal gate, squared residual
- Double DQN의 online selection과 target evaluation
- Training loss와 evaluation return이 어긋날 때의 진단 지표

### 선행 글에 맡긴다

- MDP, Markov state, return, V/Q/advantage, Bellman expectation·optimality
- 신경망 regression과 optimizer의 기본

### 후속 글에 맡긴다

- Eligibility trace의 backward view와 actor-critic GAE 구현
- Distributional DQN, prioritized replay, dueling network, Rainbow 계보
- Offline RL의 support mismatch와 conservative objectives

### 역사적 최소 뼈대

Q-learning(1992)에서 tabular off-policy backup을 고정한다. DQN(2015)에서 image input, replay, target network를 연결한다. Double DQN(2016)에서 max의 action selection과 evaluation을 분리한다. 이 세 지점 아래의 더 오래된 계보와 이후 변형은 이 글의 이해에 필수일 때만 링크하고 새 아티클로 늘리지 않는다.

## Primary source anchors

- Sutton & Barto, *Reinforcement Learning: An Introduction*, 2nd ed.: MC, n-step, TD(λ), SARSA, Q-learning의 표준 정의
- Watkins & Dayan, *Q-learning* (1992): tabular Q-learning update와 수렴 조건
- Mnih et al., *Human-level control through deep reinforcement learning* (2015): Atari DQN, replay, target network
- van Hasselt et al., *Deep Reinforcement Learning with Double Q-learning* (2016): selection/evaluation 분리와 overestimation 분석
- Farama, *Handling Time Limits*: modern environment API의 termination·truncation 경계

## Hidden transfer problem

고정 trajectory의 reward가 `[1, 2, 4]`, `γ=.9`, `V(s1)=5`, `V(s2)=3`이고 세 번째 reward 뒤 목표 자체가 끝난다. 다음 state에서 behavior action의 Q는 2, greedy action의 Q는 6이다. DQN replay 한 행에서 `r=1`, `Qθ(s,a)=1.4`, online next Q는 `[2,3]`, target next Q는 `[2.1,1.6]`이다.

작성된 본문만 읽은 독자가 다음을 외부 해설 없이 해결해야 한다.

1. 1·2·3-step return을 계산하고 λ=.5 finite λ-return을 구한다.
2. Continuing, true termination, time-limit truncation에서 SARSA와 Q-learning target을 계산한다.
3. DQN과 Double DQN에서 next action을 누가 고르고 누가 평가하는지 표시한다.
4. Target, residual, squared loss를 계산하고 gradient가 흐르는 network를 표시한다.
5. Replay correlation, moving target, max bias, coverage 부족을 중복 없이 진단한다.
6. Batch loss 하락만으로 environment performance가 좋아졌다고 말할 수 없는 이유를 설명한다.

## Numeric oracle

- 1-step return: `1 + .9*5 = 5.50`
- 2-step return: `1 + .9*2 + .9^2*3 = 5.23`
- 3-step/MC return: `1 + .9*2 + .9^2*4 = 6.04`
- λ=.5 weights: `[.5, .25, .25]`
- λ=.5 return: `5.5675`, UI 표기 `5.568`
- Continuing 또는 truncation: SARSA `2.80`, Q-learning `6.40`, mask `1`
- True termination: SARSA `1.00`, Q-learning `1.00`, mask `0`
- DQN: action `a0`, target `2.89`, residual `1.49`, loss `2.2201`
- Double DQN: action `a1`, target `2.44`, residual `1.04`, loss `1.0816`
- Terminal DQN: target `1.00`, residual `-0.40`, loss `0.1600`

## Narrative and Viz contract

### 1. Prediction targets

관측 가능한 reward와 아직 관측하지 않은 미래 value를 먼저 분리한다. `LambdaReturnLab`은 1·2·3-step 답과 그 가중치를 동시에 보여 준다. Slider의 숫자만 바꾸지 말고 각 horizon contribution과 최종 target이 함께 바뀌어야 한다. “λ-return은 one-step TD와 MC 두 수의 직선 보간”이라는 오해를 반드시 반증한다.

### 2. Control target

같은 transition에 SARSA와 Q-learning을 나란히 적용한다. `ControlTargetLab`은 continuing, true termination, time-limit truncation을 전환하며 behavior action과 greedy action, bootstrap gate를 같이 보여 준다. `done` 하나로 두 경계를 합치지 않는다.

### 3. Exploration and coverage

Behavior policy는 데이터를 만들고 target policy는 개선 방향을 정하며 coverage는 그 target을 믿을 근거를 정한다. 이 세 책임을 한 문단이나 “off-policy=data reuse” 한 문장으로 합치지 않는다.

### 4. DQN backup

기존 `DqnLearningSequenceViz`는 replay sample → termination gate → frozen target → online regression의 시간 순서를 담당한다. `DqnBackupLab`은 같은 숫자를 DQN·Double DQN·terminal mode에서 재계산한다. 임의의 risk score는 만들지 않는다.

### 5. Diagnostics

Evaluation return, TD residual tail, Q scale, replay age, target lag를 분리한다. 각각 무엇을 측정하고 다음에 무엇을 확인할지 명시한다. Average training loss 하나로 정책을 판정하지 않는다.

## Formula annotation contract

총 display formula는 8개다.

1. MC return: horizon, discount, observed reward
2. n-step return: observed prefix, terminal mask, bootstrap value
3. finite λ-return: geometric weights, final remaining weight, weighted sum
4. one-step TD: reward, mask, next value, residual
5. SARSA target: behavior가 실제 고른 next action
6. Q-learning target: greedy target action
7. Double DQN: online action selection과 target evaluation
8. DQN loss: frozen target, online residual, replay expectation

각 수식은 registry의 한국어 내부 주석이 있어야 한다. 수식 묶음 바로 아래 `FormulaNote`는 기호뿐 아니라 왜 그 연산을 쓰는지 설명한다. 모바일에서 글자 크기를 12px 아래로 축소하거나 내부 horizontal scroll을 만들지 않는다.

## Responsive and interaction contract

- Viewport: 390×844, 768×1024, 1440×900
- Required selectors: `data-lambda-return`, `data-control-target`, `data-dqn-backup`
- Formula count: 8, missing annotation: 0
- Article tables: 0
- Document, formula, Viz horizontal overflow: 1px 이하
- λ, boundary, DQN/Double, terminal controls는 keyboard button/checkbox semantics를 유지한다.
- 기존 sequence animation은 자동 재생과 step control을 유지하되 transition data가 새 계산 Lab과 일치해야 한다.

## Completion gate

- Numeric oracle의 모든 값이 UI와 Playwright test에서 일치한다.
- True termination만 bootstrap을 끊고 truncation은 유지한다.
- DQN과 Double DQN의 선택 action과 target 값이 실제로 바뀐다.
- 가짜 종합 점수나 근거 없는 위험 백분율이 없다.
- 수식 한글 주석, 근접 설명, primary sources가 모두 연결된다.
- 세 viewport screenshot에서 잘림, 겹침, 빈 Viz, 내부 scroll이 없다.
