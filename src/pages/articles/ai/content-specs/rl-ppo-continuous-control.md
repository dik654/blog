# PPO와 연속 제어 content spec

## Goal

PPO를 “안정적인 policy gradient”라는 이름으로 외우지 않고 old rollout과 new policy의 분포 차이를 제한하는 근사 목적과 실제 학습 loop로 이해한다. Action space와 data reuse 계약을 기준으로 PPO, DQN, DDPG/TD3, SAC의 적용 범위를 판단하고 LLM post-training으로 연결한다.

## Source anchors

| Area | Source | Why it matters |
| --- | --- | --- |
| GAE | Schulman et al. 2015 | Terminal mask, TD residual과 λ 누적의 원 정의 |
| PPO | Schulman et al. 2017 | Ratio와 clipped surrogate의 원 정의 |
| 구현 의도 | OpenAI PPO/Baselines, Spinning Up | Rollout 고정, multi-epoch update, 진단 지표 |
| DDPG | Lillicrap et al. 2015 | Continuous deterministic actor와 replay |
| TD3 | Fujimoto et al. 2018 | Twin critic, delayed actor update와 target smoothing |
| SAC | Haarnoja et al. 2018 | Maximum-entropy off-policy actor-critic |
| 상위 연결 | 기존 RLHF, RLVR, Open-R1 글 | Token action과 verifier reward로 분기 |

## Full-scope map

| Topic | Depth | Must establish | Omission risk |
| --- | --- | --- | --- |
| Policy shift | deep | rollout data와 current policy 분포 차이 | 같은 batch 무제한 재사용 |
| Probability ratio | deep | 선택 action의 전후 확률 비 | parameter 변화율로 오해 |
| PPO clip | deep | advantage 부호별 비대칭 경계 | 모든 KL을 보장한다고 오해 |
| GAE | deep | terminal mask, reverse recurrence와 critic target | episode 경계 누수, return/advantage 혼동 |
| Training loop | deep | old policy/buffer/update 경계 | 구현에서 log-prob 재계산 오류 |
| Continuous control | deep | Q argmax 열거 불가, actor 필요 | DQN을 연속 action에 직접 적용 |
| DDPG/TD3/SAC | brief but causal | replay, critic, entropy의 trade-off | 알고리즘 이름 나열 |
| LLM bridge | deep | 대응 관계와 reward proxy 차이 | 게임 RL과 동일시 |
| Offline/safe RL | defer | 후속 경로 | 선택기 과신 |

## Hidden mastery problem

> γ=0.9인 네 step rollout에서 reward=[0.2, 0, 0.5, 1.0], value=[1.0, 1.2, 0.8, 0.5], 마지막 step만 terminal이다. λ=0, 0.95, 1일 때 TD residual, GAE advantage와 critic target을 뒤에서부터 계산하라. 이어서 stored old/current log-probability로 각 sample ratio와 clipped objective를 advantage 부호별로 계산하고, 평균 KL은 낮지만 일부 ratio가 폭주한 상황을 진단하라. 같은 환경이 continuous torque action이고 rollout 수집 비용이 큰 경우 PPO, DDPG/TD3, SAC 중 후보를 좁히되 replay coverage와 safety 제약을 별도로 평가하라. 마지막으로 이 판단을 token policy에 옮길 때 state, action, transition, reward, KL 중 무엇이 같고 무엇이 다른지 쓰라.

### Numeric oracle

- TD residual은 [0.280, -0.480, 0.150, 0.500]이다.
- λ=0이면 A₀=0.280, λ=0.95이면 A₀≈0.292, λ=1이면 A₀≈0.334다.
- 모든 critic target은 R̂ₜ=Âₜ+V(sₜ)로 복원한다.
- 이 정답은 본문에 문제로 노출하지 않고 Viz와 설명이 같은 계산 경로를 제공하는지 검증하는 oracle로만 사용한다.

### Required proof path

1. Terminal mask를 적용해 TD residual과 GAE를 t=T-1부터 역산한다.
2. Advantage에 value baseline을 다시 더해 critic return target을 복원한다.
3. Stored old log-prob와 current log-prob로 ratio를 계산한다.
4. Positive advantage는 upper clip, negative advantage는 lower clip에서 개선 incentive가 잘린다.
5. Clip은 sample surrogate를 제한할 뿐 global KL bound가 아니다.
6. Rollout 동안 old policy를 고정하고 buffer 계산 뒤 여러 epoch update한다.
7. Continuous action에서는 actor가 action을 직접 parameterize한다.
8. On-policy stability와 off-policy reuse를 sample 비용, coverage, exploration과 함께 비교한다.
9. LLM reward model/verifier가 환경 법칙이 아니라 proxy일 수 있음을 남긴다.

## Section and Viz contract

| Section | Core question | Viz responsibility | Failure mode to surface |
| --- | --- | --- | --- |
| Policy shift | 큰 gradient가 왜 위험한가 | old/new action probability의 ratio | rollout 분포 무시 |
| PPO | 어느 방향을 clip하는가 | ratio, epsilon, advantage 부호 조작 | clip=trust region 보장 오해 |
| Training loop | credit을 어떻게 역산하고 무엇을 고정하는가 | λ별 수치 GAE와 rollout부터 refresh까지 5단계 상태 | terminal 누수, old log-prob 재계산 |
| Continuous control | 알고리즘 후보를 무엇으로 줄이는가 | action/replay/entropy 선택기 | 이름 중심 선택 |
| LLM bridge | Token RL은 어디까지 같은가 | state/action/reward 대응 후 기존 글 분기 | reward proxy 위험 누락 |

## Formula annotation contract

- Ratio는 새 확률/old 확률의 방향과 기준을 설명한다.
- PPO 식은 unclipped, clipped, min, advantage 부호를 한국어로 분리한다.
- TD residual과 GAE recurrence는 terminal mask, 미래 credit과 critic target을 한국어로 분리한다.
- Total loss는 maximize/minimize 부호와 actor/value/entropy의 책임을 설명한다.
- DPG와 SAC는 action gradient와 entropy-temperature trade-off를 설명한다.

## Completion criteria

- 숨은 문제의 ratio와 clip 값을 손으로 계산하고 KL과 다른 진단임을 설명할 수 있다.
- AlgorithmChooser 결과를 action space와 data contract로 반박하거나 지지할 수 있다.
- 기존 RLHF, RLVR, Open-R1 글로 이어지는 링크와 개념 다리가 존재한다.
- 수식 7개가 한국어 주석과 일치하고 모바일에서 12px 미만으로 축소되거나 잘리지 않는다.
