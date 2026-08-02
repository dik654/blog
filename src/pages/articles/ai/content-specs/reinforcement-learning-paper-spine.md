# Reinforcement Learning 원 논문 뼈대 명세

## 목적

네 개의 개념 글에서 배운 수식이 어디서 나왔고, 각 논문이 앞선 방법의 어느 실패를 실제로 수정했는지 1차 출처로 복원한다. 논문을 유명 알고리즘의 완성본으로 읽지 않는다. 출판 당시의 문제, 저자 의도, 증거가 지지하는 범위, 후속 연구가 교체한 부분을 분리한다.

## 배치 원칙

| 경로 | 논문 | 앞선 병목 | 읽고 나서 구분해야 할 것 |
| --- | --- | --- | --- |
| Value learning | Q-learning (1992) | Model 없이 optimal control | Tabular 수렴 정리와 function approximation 보장 |
| Value learning | DQN (2015) | Pixel state와 nonlinear Q의 불안정 | Replay와 target network의 서로 다른 책임 |
| Policy optimization | REINFORCE (1992) | 환경을 미분할 수 없는 stochastic action | Unbiased gradient와 finite-sample variance |
| Policy optimization | GAE (2015) | Monte Carlo variance와 critic bias | Advantage target과 policy update 안정성 |
| Policy optimization | PPO (2017) | 큰 policy step과 복잡한 TRPO | Clipped surrogate와 hard KL constraint |
| Continuous control | DDPG (2015) | 연속 action에서 argmax 불가 | Critic action gradient와 실제 환경 gradient |
| Continuous control | TD3 (2018) | Actor가 critic error를 exploit | Twin, delay, smoothing의 독립 책임 |
| Continuous control | SAC (2018) | Deterministic exploration과 brittle training | 원 SAC와 후대의 현대 SAC recipe |

## 출처 계약과 작성 의도

| 논문 | 1차 출처 | 본문에서 채택하는 증거 | 의도적으로 과장하지 않는 범위 |
| --- | --- | --- | --- |
| Q-learning | Watkins & Dayan, Machine Learning 8 | 유한 tabular MDP의 확률 1 수렴 정리와 조건 | DQN·deadly triad 수렴 보장 |
| REINFORCE | Williams, Machine Learning 8 | Expected reinforcement gradient를 따르는 stochastic update | 현대 actor-critic·GAE가 이미 완성되었다는 해석 |
| DQN | Mnih et al., Nature 518 | 49 Atari game과 end-to-end pixel control | 일반 지능, transfer, sample efficiency |
| GAE | Schulman et al., arXiv/ICLR | Lambda sweep와 continuous-control 결과 | GAE 단독 효과와 trust-region 효과의 완전 분리 |
| PPO | Schulman et al., arXiv | Surrogate 비교, locomotion·Atari 결과 | Monotonic improvement와 KL hard bound |
| DDPG | Lillicrap et al., arXiv/ICLR | 20개 이상 simulated physics task와 raw-pixel 일부 | Real-robot 안정성, seed robustness |
| TD3 | Fujimoto et al., ICML/PMLR | Approximation-error 분석과 구성 ablation | Min critic이 unbiased uncertainty estimator라는 해석 |
| SAC | Haarnoja et al., ICML/PMLR | Sample efficiency와 여러 seed의 안정성 | Automatic temperature tuning을 최초 논문의 동일 기여로 표기 |

## 논문별 숨은 숙련도 문제

문제 문장 자체를 본문에 싣지 않는다. 글을 완성한 뒤 독자가 본문만으로 아래 판단을 재구성할 수 있는지를 내부 품질 기준으로 사용한다.

### Q-learning

> 모든 state를 방문했지만 일부 action은 탐색하지 않았고 constant learning rate를 쓴 tabular agent가 Q*에 수렴하지 않았다. 팀이 Watkins-Dayan 정리에 어긋나는 실험이라고 주장한다. 정리의 각 조건을 방문 로그와 step-size sequence로 번역하고, terminal과 timeout 처리까지 포함해 반박하라.

본문은 state 방문과 state-action 방문의 차이, 두 step-size 합 조건, bounded finite MDP, terminal boundary를 제공해야 한다.

### REINFORCE

> 두 행동 bandit에서 action별 평균 reward를 baseline으로 뺀 구현이 running-mean baseline보다 variance가 낮다. 이것이 여전히 unbiased REINFORCE인지 score-function 기대값으로 판단하고, action-dependent baseline이 허용될 조건을 설명하라.

본문은 log-derivative trick, 행동과 무관한 baseline의 기대값 0, unbiasedness와 variance의 차이를 제공해야 한다.

### DQN

> Replay를 켜자 TD loss는 낮아졌지만 Q scale이 폭발하고 evaluation score는 하락했다. Target network 주기, max overestimation, truncation mask, stale replay를 어떤 순서로 진단할지 설계하고 Q-learning 수렴 정리를 근거로 안전하다고 주장할 수 없는 이유를 말하라.

본문은 replay와 target의 독립 책임, gradient가 흐르는 항, off-policy bootstrap과 function approximation의 결합, Atari evidence의 경계를 제공해야 한다.

### GAE

> Critic에 일정한 positive bias가 있고 reward noise가 큰 rollout에서 lambda를 0에서 1로 올린다. Advantage의 bias와 variance가 어떤 방향으로 바뀔지 TD residual 전개로 설명하고 terminal·truncation mask 오류가 결과를 어떻게 뒤집는지 판단하라.

본문은 delta 합, backward recurrence, gamma와 lambda의 분리, critic error와 horizon의 관계를 제공해야 한다.

### PPO

> Positive advantage sample의 ratio가 1.4, negative advantage sample의 ratio가 0.6이고 epsilon이 0.2다. 각 sample의 clipped objective와 gradient가 선택하는 항을 계산한 뒤, clip fraction이 높은데 approximate KL도 계속 증가하는 현상이 모순이 아닌 이유를 설명하라.

본문은 advantage 부호별 min의 동작, old log-probability 고정, clipping이 sample surrogate를 제한할 뿐 hard KL bound가 아니라는 사실을 제공해야 한다.

### DDPG

> Actor action에서 critic gradient는 매우 크지만 Monte Carlo evaluation return은 하락한다. Behavior noise, critic target, actor gradient path, action saturation과 replay coverage를 분리해 critic exploitation인지 environment sensitivity인지 판별하는 실험을 설계하라.

본문은 critic-to-actor chain rule, 환경 derivative 부재, slow target과 replay의 가정, Q error feedback을 제공해야 한다.

### TD3

> Twin critic 두 개가 거의 같은 값을 내고 min target은 낮아졌지만 성능이 개선되지 않았다. Critic correlation, policy delay, target smoothing, behavior exploration을 각각 바꾸는 ablation을 만들고 어느 결과가 세 설계 가설을 지지하는지 명시하라.

본문은 세 장치가 막는 오차 경로, 두 noise의 차이, min의 underestimation과 critic correlation 한계를 제공해야 한다.

### SAC

> Tanh-squashed Gaussian actor에서 entropy가 비정상적으로 커지고 Q는 좋아지지만 실제 return이 무너졌다. Jacobian correction, reward-alpha scale, original value-network formulation, modern twin-Q·automatic-temperature variant를 구분해 원인을 찾고 어떤 기여를 2018 논문에 귀속할 수 있는지 판단하라.

본문은 transformed density, maximum-entropy objective, alpha의 교환비, 원 논문과 후속 recipe의 출처 경계를 제공해야 한다.

## 통합 최고 난도 문제

> Pixel 관측의 연속 제어 환경에서 DQN, PPO, TD3, SAC 네 실험 결과가 제시되었다. DQN은 낮은 TD loss와 큰 Q, PPO는 높은 clip fraction과 KL 급증, TD3는 twin critic 동조, SAC는 높은 entropy와 낮은 return을 보인다. 각 알고리즘의 target이 어디에서 오고 어느 data distribution을 쓰며 어떤 estimator bias가 있는지 추적하라. 그런 다음 Q-learning의 수렴 정리, REINFORCE의 unbiasedness, GAE의 lambda, PPO clipping, DDPG action gradient, TD3 min target, SAC entropy 중 어떤 근거가 각 실패를 설명하고 어떤 근거는 사용할 수 없는지 출처 수준으로 분류하라.

여덟 글을 읽은 독자는 알고리즘 이름을 고르는 대신 다음 표를 스스로 만들 수 있어야 한다.

| 축 | 반드시 추적할 값 |
| --- | --- |
| Data | Behavior policy, replay age, on/off-policy mismatch |
| Target | Monte Carlo, bootstrap network, critic, entropy term |
| Gradient | Score function, critic action gradient, clipped surrogate |
| Stability | Target timescale, critic disagreement, KL, entropy |
| Evidence | Theorem 조건, benchmark 범위, ablation의 개입 단위 |

## 본문에서 애니메이션으로 전환할 흐름

본문과 수식을 모두 확정한 다음 연결한다.

1. **Q-learning Bellman backup**: 한 transition 선택 → max next-Q → TD error → table entry update.
2. **DQN learning cycle**: environment append → replay sample → frozen target → online update → target sync.
3. **REINFORCE-to-GAE**: trajectory return → baseline → TD residual trace → actor-critic update.
4. **PPO iteration**: old-policy rollout → GAE → multi-epoch ratio clipping → KL 진단 → policy snapshot 교체.
5. **DDPG-to-TD3**: actor가 critic peak를 exploit → twin min → target smoothing → delayed actor.
6. **SAC stochastic path**: Gaussian noise → reparameterized action → tanh correction → Q-entropy actor loss.

각 애니메이션은 자동 재생만 하지 않는다. Play/Pause, 이전/다음 단계, reset을 제공하고 360px에서 문서 폭을 바꾸지 않아야 한다. 조작형 수치 비교 Viz는 유지해 시간 흐름과 parameter 감도를 서로 보완한다.

## 완료 기준

- 8개 논문 URL이 세 학습 경로에 배치되고 이전·다음 글 탐색이 동작한다.
- 각 글에 저자 의도, 앞선 병목, 계산 순서, 수식, 두 종류 이상의 증거, 최소 재현, 가정, 실패, 유산이 있다.
- 모든 주장은 1차 출처가 직접 지지하는 범위와 후대 해석을 구분한다.
- 모든 display KaTeX 수식에 즉시 보이는 한국어 연산 주석이 있고 annotation 누락 marker가 0이다.
- 통합 최고 난도 문제의 모든 판단 근거가 여덟 글 안에 존재한다.
- 본문 확정 뒤 여섯 animation flow를 배치하고 direct-manipulation Viz와 중복 설명을 제거한다.
- 360px, 768px, 1440px에서 수식·Viz·목록의 document overflow가 0이다.
