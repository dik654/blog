# MDP·return·value·Bellman content spec

## Reader outcome

강화학습을 “reward가 큰 행동을 외우는 학습”이 아니라 action이 다음 데이터 분포를 바꾸는 순차 의사결정 계약으로 재구성한다. 독자는 같은 observation이 Markov state인지 반례로 검사하고, reward sequence의 return, policy 아래 V·Q·advantage, Bellman expectation과 optimality backup을 한 숫자 MDP에서 계산할 수 있어야 한다.

## Ownership and cutoff

### 깊게 다룬다

- Agent, environment, policy, transition, reward의 소유 경계
- State와 partial observation, Markov sufficiency
- Finite horizon에서 clock 또는 time-indexed value가 필요한 이유
- Reward와 discounted return, one-step return recursion
- 실제 terminal과 time-limit truncation의 bootstrap 차이
- V, Q, advantage가 조건으로 고정하는 변수
- `V=Eπ[Q]`와 `Eπ[A]=0`
- Bellman expectation의 environment 평균·policy 평균
- Bellman optimality의 max와 policy evaluation의 차이

### 후속 글에 맡긴다

- Monte Carlo, n-step, TD와 function approximation
- POMDP belief update, Kalman filter, learned recurrent state
- Policy-gradient theorem과 baseline variance
- Bellman operator contraction과 tabular convergence proof

### 최소 역사 바닥

이 글은 특정 논문 계보를 새로 늘리지 않는다. Sutton & Barto의 표준 정의와 OpenAI Spinning Up의 implementation-oriented notation을 최소 바닥으로 사용한다. 혁펜하임 커리큘럼은 기술 근거가 아니라 국내 독자가 MDP에서 Bellman까지 밟는 범위를 대조하는 데만 사용한다.

## Primary and scope anchors

- Sutton & Barto, *Reinforcement Learning: An Introduction*, 2nd ed.: MDP, return, value, Bellman의 표준 정의
- OpenAI Spinning Up, *Key Concepts in RL*: state/observation, trajectory, value·advantage, Bellman의 실행 지향 연결
- 혁펜하임, *트이는 강화 학습*: 최소 학습 범위 점검만 담당

## Hidden transfer problem

이 fixture는 공개 Viz의 숫자를 재사용하지 않는다. 1차원 로봇의 센서는 현재 위치 `x=2`만 보여 준다. 한 history는 `0→2`로 이동해 숨은 속도가 `+2`, 다른 history는 `3→2`로 이동해 숨은 속도가 `-1`이다. Coast action에서 dynamics는 `x'=x+v`다.

Reward sequence는 `[2,-1,3,0,4]`, `γ=.8`이다. 다섯 번째 reward 뒤 실제 terminal인 경우와, 수집 time limit으로만 잘렸고 마지막 next state의 `V=2.5`인 경우를 비교한다.

같은 state의 safe action은 immediate reward `.5` 뒤 next value `3`으로 간다. Risk action은 확률 `.4`로 reward `6`, next value `1.5`를 얻고 확률 `.6`으로 reward `-2`, next value `.5`를 얻는다. Policy는 safe를 `.7`, risk를 `.3`으로 선택한다.

작성된 본문만 읽은 독자가 다음을 해결해야 한다.

1. 위치만 state로 쓸 때 Markov property가 깨지는 두 조건부 예측을 제시한다.
2. `(x,v)`로 state를 보강하면 왜 두 history가 서로 다른 state key가 되는지 설명한다.
3. `G0`와 `G1`의 유한 episode return을 항별로 계산하고, 같은 다섯 reward가 time-limit truncation이면 마지막 value를 어떻게 이어 붙이는지 계산한다.
4. Q 두 개와 policy 확률에서 V, 두 advantage와 policy-weighted advantage mean을 구한다.
5. Risk branch를 environment 확률로 먼저 평균한 뒤 fixed policy expectation과 optimal max를 구한다.
6. Reward, return, value, Bellman target, optimization loss를 서로 다른 객체로 분리한다.

### Hidden oracle

- Observation-only history A: `H=0→2`, hidden `v=+2`, coast 뒤 `x'=4`
- Observation-only history B: `H=3→2`, hidden `v=-1`, coast 뒤 `x'=1`
- Position-only verdict: state 부족; position+velocity verdict: 이 dynamics에서 Markov pass
- Actual terminal: `G0=2+.8*(-1)+.8^2*3+.8^3*0+.8^4*4=4.7584`
- Start `t=1`: `G1=-1+.8*3+.8^2*0+.8^3*4=3.448`
- Time-limit truncation with `V(s5)=2.5`: `4.7584+.8^5*2.5=5.5776`
- `Qsafe=.5+.8*3=2.900`
- `Qrisk=.4*(6+.8*1.5)+.6*(-2+.8*.5)=1.920`
- `πsafe=.7`, `V=.7*2.9+.3*1.92=2.606`
- `Asafe=.294`, `Arisk=-.686`, `.7*Asafe+.3*Arisk=0`
- Fixed-policy expectation `2.606`, optimal max `2.900`, 차이 `.294`

## Public Viz numeric oracle

아래 값은 브라우저 상호작용 회귀용이다. Hidden transfer 채점에는 사용하지 않는다.

- Observation-only history A: `H=-1→0`, hidden `v=+1`, coast 뒤 `x'=+1`
- Observation-only history B: `H=+1→0`, hidden `v=-1`, coast 뒤 `x'=-1`
- Position-only verdict: state 부족; position+velocity verdict: Markov pass for this dynamics
- `G0(γ=.9)=0+.9*1+.9^2*0+.9^3*(-1)+.9^4*5=3.4515`, UI `3.452`
- Start `t=2`: `0+.9*(-1)+.9^2*5=3.150`
- `Qsafe=2.800`, `Qrisk=.765`, `πsafe=.5`
- `V=.5*2.8+.5*.765=1.7825`, UI `1.783`
- `Asafe=1.0175`, UI `1.018`; `Arisk=-1.0175`, UI `-1.018`
- `.5*Asafe+.5*Arisk=0`
- Bellman default: safe `2.80`, risk `.77`, expectation `1.78`, optimal `2.80`
- Risk probability `.65`: risk `3.14`, expectation `2.97`, optimal `3.14`

## Narrative and Viz contract

### 1. Interaction ownership

Static loop는 state → policy action → environment result의 소유 경계를 보여 준다. Reward가 environment observation이고 loss가 learning algorithm의 목적이라는 오해를 바로 제거한다.

### 2. Markov sufficiency

`MarkovSufficiencyLab`은 같은 position observation 아래 두 history와 서로 다른 next position을 동시에 보여 준다. Toggle은 그림 색만 바꾸지 않고 state key 자체를 `x`에서 `(x,v)`로 바꾸며 verdict와 설명을 갱신한다. “과거를 무시한다”가 아니라 “현재 표현이 필요한 과거를 요약한다”는 주장을 증명한다.

### 3. Return

`ReturnExplorer`는 terminal에서 끝나는 다섯 reward episode임을 명시하고, γ와 시작 시점을 바꾸며 각 reward contribution, 즉시 reward, discounted future와 total을 갱신한다. Reward 하나와 trajectory return을 같은 숫자로 합치지 않는다. 이어지는 식은 실제 terminal에서는 next value를 0으로 두지만 time-limit truncation에서는 bootstrap을 유지해야 하는 이유를 TD/DQN 글 전에 고정한다.

### 4. Value conditioning

`ValueConditioningLab`은 Q 두 개를 고정하고 `πsafe=.25/.5/.75`를 전환한다. V, action별 advantage와 weighted advantage mean을 모두 계산한다. Policy Gradient 글로 넘어갈 때 advantage가 state baseline으로 중심화된 action signal이라는 연결을 소유한다.

### 5. Bellman backup

기존 `BellmanBackupSequenceViz`는 action backup을 environment 평균으로 접은 뒤 policy average와 max로 갈라지는 시간 순서를 소유하므로 유지한다. `BellmanExplorer`는 risk probability와 γ를 조작해 safe/risk action backup, fixed-policy expectation과 optimal max를 다시 계산한다.

## Formula annotation contract

총 display formula는 9개다.

1. Markov property: history-conditioned distribution과 current-state-conditioned distribution
2. Episodic/continuing return: terminal T에서 끝나는 유한 합과 continuing task의 무한 합
3. Terminal/truncation target: 실제 종료는 bootstrap 0, 시간 제한은 next value 유지
4. V definition: state만 조건으로 고정
5. Q definition: state와 첫 action을 조건으로 고정
6. Advantage: action Q에서 state baseline을 제거
7. `V=ΣπQ`, `ΣπA=0`: Q 평균과 centered advantage
8. Bellman expectation: environment 평균 뒤 policy 평균
9. Bellman optimality: next action max

모든 수식은 registry의 한국어 내부 annotation을 가져야 한다. 긴 관계는 중간 변수와 aligned row로 분해하고 mobile font를 12px 아래로 줄이거나 horizontal scroll을 만들지 않는다.

## Responsive and interaction contract

- Viewport: 390×844, 768×1024, 1440×900
- Required selectors: `data-markov-state`, `data-return-explorer`, `data-value-conditioning`, `data-bellman-explorer`, `data-step-viz`
- Formula count 9, FormulaNote count 6, missing annotation 0
- Article tables 0
- Document, formula, Viz horizontal overflow 1px 이하
- Markov representation, policy probability, return sliders, Bellman sliders의 비기본 상태를 모두 실행한다.
- Existing Bellman animation의 initial state가 비어 있지 않고 각 step control이 유지된다.

## Completion gate

- Numeric oracle의 모든 값이 UI와 Playwright에서 일치한다.
- Observation과 state를 표기와 설명에서 혼용하지 않는다.
- Finite horizon clock과 time-limit truncation으로 이어지는 기반을 남긴다.
- Average와 max가 서로 다른 질문임을 같은 action backup에서 증명한다.
- 세 viewport screenshot에서 잘림, 겹침, 빈 Viz와 내부 horizontal scroll이 없다.
