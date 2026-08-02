# Policy Gradient 실행 계약 content spec

## Goal and ownership

환경 transition을 미분하지 않고 stochastic policy의 기대 return gradient를 추정하는 과정을 바닥부터 재구성한다. 이 글은 `trajectory factorization -> log-derivative -> causal reward-to-go -> action-independent baseline -> actor-critic -> GAE`를 소유한다.

- 아래 기반: MDP, return, TD residual.
- 이 글의 상한: GAE의 residual weighting 의미.
- 다음 글: `rl-ppo-continuous-control`이 terminal-safe reverse GAE, stored old log-probability, clipped update와 continuous-control algorithm choice를 소유한다.
- 제외: TRPO의 constrained optimization 증명, PPO epoch implementation, off-policy replay와 deterministic policy gradient.

## Source anchors

| Area | Primary or official source | Why it matters |
| --- | --- | --- |
| REINFORCE | Williams 1992 | Score-function estimator의 원형 |
| Policy gradient theorem | Sutton et al. 1999/2000 | State visitation까지 포함한 gradient 근거 |
| Reward-to-go and baseline | OpenAI Spinning Up policy optimization | Causality와 expected grad-log-prob lemma를 구현 직전 언어로 연결 |
| GAE | Schulman et al. 2015 | Advantage의 bias-variance 조절 |
| 실행 순서 | OpenAI Spinning Up VPG | Rollout, reward-to-go, policy/value update 계약 |

## Minimum historical cutoff

Williams의 score-function estimator와 Sutton의 policy-gradient theorem을 최소 첫 기반으로 자른다. 그 아래 likelihood-ratio estimator의 더 오래된 통계 역사나 control variate 일반론은 별도 수학 글이 필요할 때만 연다. 최신 PPO/RLHF 글에서 내려온 독자가 이 두 원문과 GAE만으로 현재 구현까지 복귀할 수 있어야 한다.

## Hidden transfer problem

본문에 문제 자체를 노출하지 않는다. 작성자와 작은 모델 평가에는 다음 oracle을 쓴다.

1. Binary bandit에서 `p(A)=sigmoid(theta)`, `R_A=2`, `R_B=-1`, `theta=0`이다.
2. 직접 미분한 exact gradient는 `p(1-p)(R_A-R_B)=0.75`다.
3. REINFORCE estimator `(R-b) grad log pi`는 baseline과 무관하게 기대값 0.75를 유지한다.
4. `b=0`에서 두 sample은 1.0, 0.5이고 variance는 0.0625다.
5. 이 1D binary estimator의 variance-minimizing scalar baseline은 `b*=(1-p)R_A+pR_B=0.5`다. 두 sample이 모두 0.75가 되어 variance는 0이다. 이 결과를 일반 MDP에서 value baseline이 항상 최적이라는 주장으로 일반화하지 않는다.
6. `b=2`에서 두 sample은 0, 1.5이고 variance는 0.5625다. Action-independent baseline은 기대값을 보존하지만 나쁜 baseline은 variance를 키울 수 있다.
7. `gamma=1`, reward `[1,-2,4]`인 trajectory에서 전체 return weight는 `[3,3,3]`, reward-to-go는 `[3,2,4]`다.
8. 미래 action의 policy score와 과거 reward의 곱은 action을 평균하면 0이다. 과거 항 제거는 bias를 만들지 않고 noise만 제거한다.
9. TD target은 terminal에서 `(1-d_t)`로 next value를 차단한다. 이 mask가 없으면 다음 episode의 value가 현재 episode의 마지막 reward에 섞인다.
10. One-step TD residual은 언제나 exact advantage가 아니다. On-policy이고 critic이 `V^pi`를 맞춘 경우 action-conditioned expectation에서 advantage와 일치한다.

## Required proof path

1. Trajectory probability를 initial distribution, policy, environment transition의 곱으로 쓴다.
2. `grad p = p grad log p`로 expectation gradient를 score-function expectation으로 바꾼다.
3. Log trajectory에서 theta와 무관한 environment 항을 제거한다.
4. 미래 action이 과거 reward를 바꿀 수 없고 expected policy score가 0임을 이용해 reward-to-go를 얻는다.
5. Action과 무관한 baseline 항의 기대가 `grad sum_a pi(a|s)=0`임을 보인다.
6. Baseline별 sample gradient 평균과 variance를 직접 계산한다.
7. Critic은 baseline/target을 추정하고 actor는 advantage-weighted log probability를 최적화한다.
8. Terminal-safe TD residual과 GAE의 residual trace를 구분한다.

## Narrative and Viz contract

| Section | Reader question | Viz responsibility | Boundary to surface |
| --- | --- | --- | --- |
| Objective | Policy를 직접 학습한다는 뜻은 무엇인가 | prose + trajectory factorization | fixed dataset 분류 loss가 아님 |
| Score function | Simulator를 왜 미분하지 않아도 되는가 | derivation formulas | environment dynamics가 theta와 무관하다는 가정 |
| Reward-to-go | 어느 reward를 어느 action에 줄 것인가 | `ReturnToGoViz`, full `[3,3,3]` vs causal `[3,2,4]` | unbiased와 low-variance는 다른 주장 |
| Baseline | 빼도 gradient가 왜 같은가 | `PolicyGradientBanditLab`, expected gradient와 variance를 함께 표시 | 나쁜 baseline은 variance를 키움 |
| Actor-critic | 두 network는 무엇을 학습하는가 | 기존 animated sequence + role split | TD residual은 일반적으로 exact advantage가 아님 |
| GAE | 먼 미래 credit을 얼마만큼 쓸까 | residual map, lambda 0/0.5/0.95/1 | gamma와 lambda의 역할이 다름 |

## Formula annotation contract

- Display formula 11개 모두 `foundationFormulaAnnotations.ts`에 정확히 등록한다.
- Trajectory factorization은 policy와 environment를 한 줄에 압축하지 말고 annotated aligned row로 나눈다.
- Causal-zero 식은 과거 reward 묶음과 expected policy score가 0인 이유를 한글로 표시한다.
- Baseline 식은 기대값 보존만 증명하며 variance 감소를 자동으로 주장하지 않는다.
- TD residual은 terminal mask를 식 안에 포함한다.
- 390px에서 primary formula font가 12px 아래로 내려가거나 수평 scroll을 요구하면 실패다.

## Responsive and interaction contract

- 390, 768, 1440px에서 document, formula, Viz 내부 horizontal overflow가 0이다.
- Bandit preset `b=0`, `b=b*`, `b=2`는 exact/expected gradient를 유지하고 variance만 0.0625/0/0.5625로 바꾼다.
- Return mode는 full `[3,3,3]`과 reward-to-go `[3,2,4]`를 전환한다.
- 표를 독자 UI로 쓰지 않는다. 계산 비교는 행과 상태 변화로 보여 준다.
- Actor-Critic animation은 유지한다. 의미가 있는 시간 흐름을 정적 카드로 퇴행시키지 않는다.

## Completion criteria

- 숨은 transfer problem의 모든 수치를 본문과 Viz만으로 재현할 수 있다.
- 기대값 보존, 분산 감소, bias 도입을 서로 다른 주장으로 설명한다.
- FormulaNote와 수식 내부 한글 annotation이 symbol, operation, assumption과 failure boundary를 설명한다.
- 이 글에서 PPO 글로 넘어갈 때 중복 없이 terminal-safe GAE 구현과 clipping으로 연결된다.
