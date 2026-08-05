# Reinforcement Learning 커리큘럼 공백 감사

## 비교 목적

기존 `RLHF`, `RLVR`, `GRPO` 글을 알고리즘 이름부터 외우는 경로가 아니라 MDP의 상태 정의에서 LLM post-training까지 인과적으로 올라가는 경로로 재구성한다. 공개 커리큘럼과 표준 교재를 범위 점검에 사용하되, 순서와 설명은 이 블로그의 상위 글을 이해하는 데 필요한 선수 능력으로 결정한다. 확인일은 2026-07-18이다.

## 출처와 채택 의도

| 출처 | 확인한 축 | 이 블로그에서 채택한 이유 |
| --- | --- | --- |
| 혁펜하임 `트이는 강화 학습` | MDP, Bellman, MC/TD, value/policy method, DQN, PPO, DDPG | 국내 학습자가 실제로 마주치는 범위 누락을 대조한다. 강의 목차 자체를 복제하지 않는다. |
| Sutton & Barto 2판 | Return, prediction/control, function approximation | 기호와 개념 경계를 정하는 표준 뼈대로 사용한다. |
| OpenAI Spinning Up | VPG/PPO와 DDPG/TD3/SAC 계보 | 수식이 실제 학습 loop와 data 계약으로 이어지는지 점검한다. |
| DQN, GAE, PPO, DDPG, SAC 원 논문 | 안정화 장치와 목적 함수 | 후대 요약에서 사라지는 가정과 한계를 복원한다. |

## 기존 글과의 대조

| 축 | 기존 상태 | 학습 위험 | 반영 |
| --- | --- | --- | --- |
| 순차 의사결정 | Reward와 policy를 RLHF 문맥에서 먼저 만남 | Reward, return, value, loss를 같은 숫자로 오해 | `rl-mdp-bellman` 추가 |
| Value learning | Q-learning과 DQN의 선수 설명 부재 | Bootstrap과 off-policy의 위험을 장치 이름으로만 암기 | `rl-temporal-difference-dqn` 추가 |
| Policy gradient | PPO를 곧바로 소개 | Log-probability, baseline, advantage의 이유를 놓침 | `rl-policy-gradient-actor-critic` 추가 |
| 실전 policy optimization | PPO와 GRPO 연결은 있으나 연속 제어 계보 부재 | On/off-policy와 action space를 알고리즘 유행으로 선택 | `rl-ppo-continuous-control` 추가 |
| LLM post-training | RLHF, RLVR, Open-R1 글 존재 | 기초 RL과 token MDP의 차이를 연결할 다리 부족 | 4단계 끝에서 기존 글로 분기 |

## 재구성한 4단계 경로

1. **MDP와 Bellman**: 상태가 충분하다는 의미, return의 재귀, V/Q/A, expectation과 optimality를 구분한다.
2. **TD와 DQN**: 관측하지 못한 value target을 구성하고, behavior/target policy와 function approximation의 feedback을 추적한다.
3. **Policy gradient와 actor-critic**: 환경을 미분하지 않고 policy를 바꾸는 추정량, baseline, critic, GAE를 유도한다.
4. **PPO와 연속 제어**: rollout distribution의 이동을 제한하고, action space와 data reuse로 DQN/PPO/DDPG/TD3/SAC를 비교한다.

## 통합 숨은 숙련도 문제

독자에게 그대로 노출하지 않는 품질 검증 문제다.

> 부분 관측 로봇 환경에서 센서 한 frame만 state로 쓴 PPO가 높은 training reward 뒤 붕괴했다. 같은 replay를 재사용하는 SAC로 바꾸자는 제안과 LLM의 PPO-style post-training에 같은 hyperparameter를 적용하자는 제안이 나왔다. 제한된 trajectory log만으로 Markov 위반, reward와 return, critic target, GAE, probability ratio, KL, entropy, coverage를 구분해 실패 원인을 진단하고 두 제안의 유효 범위를 판단하라.

본문 경로만으로 다음 추론이 가능해야 한다.

- 한 frame이 velocity 정보를 잃는다면 알고리즘 교체 전 state representation을 고쳐야 한다.
- Training reward, evaluation return, critic loss와 policy surrogate는 서로 다른 측정값이다.
- GAE의 `gamma`와 `lambda`가 horizon과 bias-variance를 어떻게 바꾸는지 설명해야 한다.
- PPO clip이 KL을 보장하지 않으므로 ratio 분포, KL, clip fraction, entropy를 함께 봐야 한다.
- SAC의 replay 이점은 off-policy coverage와 reward 정의 문제를 자동으로 해결하지 않는다.
- LLM은 transition과 reward source가 로봇 환경과 다르므로 대응 관계와 비대응 관계를 함께 말해야 한다.

## 보류한 확장 축

- Model-based RL, planning, world model: dynamics를 학습하는 별도 경로로 확장한다.
- Offline RL과 imitation learning: coverage와 distribution shift를 더 엄밀히 다룬다.
- Multi-agent, safe/constrained RL: 단일-agent scalar reward 가정을 벗어나는 독립 경로다.
- Distributional RL, Rainbow, MuZero: value와 planning의 기반을 통과한 뒤 논문 계보에 편입한다.
- RL theory: contraction, convergence, policy improvement proof를 별도 수학 심화 글로 둔다.

## 완료 기준

- 네 글의 모든 display 수식에 즉시 보이는 한국어 연산 주석이 붙는다.
- 각 글에 조작 결과와 원인을 함께 보여주는 Viz가 둘 이상 있다.
- 360px에서 수식과 Viz가 문서 폭을 넘지 않고 가로 스크롤을 요구하지 않는다.
- 네 글의 capability check를 합치면 통합 숨은 문제의 모든 판단 근거가 본문에 존재한다.
- 마지막 글에서 기존 RLHF, RLVR, Open-R1 글로 명시적으로 분기한다.
