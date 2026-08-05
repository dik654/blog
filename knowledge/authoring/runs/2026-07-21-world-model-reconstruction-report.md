# World Model 학습 축 재구성 보고서

## 1. 목적

기존 `World Model · Physical AI` 글은 video generation, latent prediction, robot dynamics, planning, simulation을 한 번에 소개했다. 이름을 구분하는 데는 도움이 됐지만, 독자가 다음 네 질문을 서로 다른 증거로 판단하기 어려웠다.

1. 이 모델은 미래 **화면**과 행동에 필요한 **상태** 중 무엇을 예측하는가?
2. 행동을 바꾸면 미래가 올바른 방향으로 달라지는가?
3. 예측을 이용해 어떤 행동을 고르는가?
4. 실제 환경을 다시 관측하며 실패를 줄이는가?

따라서 기존 slug는 현재 시스템 가족을 구분하는 hub로 유지하고, 독립적인 판단과 실험을 가진 세 본문으로 분리했다.

## 2. 원문에서 고정한 사실

### Cosmos 3

- official project와 technical report를 함께 확인했다.
- forward dynamics는 action으로 미래 vision을 예측하고, inverse dynamics는 video에서 action을 예측하며, policy mode는 action과 video를 함께 예측한다.
- action은 인접 video token 사이에 대응하며, relative pose와 domain-specific action projection을 사용한다.
- 따라서 Cosmos 3는 현재의 통합 world foundation model 사례지만, 생성 video의 사실성만으로 metric robot dynamics나 real-world task success를 보장한다고 쓰지 않았다.

### V-JEPA 2와 V-JEPA 2-AC

- V-JEPA 2는 100만 시간 이상의 action-free video로 표상을 사전학습한다.
- V-JEPA 2-AC는 frozen encoder 위에 62시간 미만 DROID robot data로 action-conditioned predictor를 학습한다.
- 현재 video, action, end-effector state로 다음 latent state를 예측하고 teacher forcing과 짧은 rollout loss를 함께 사용한다.
- planning은 goal image의 latent와 candidate rollout의 energy를 비교하고 CEM으로 행동열을 갱신한다. 첫 행동만 실행한 뒤 다시 관측한다.
- 공개 실험 설정의 RTX 4090, 800 samples, 10 CEM refinements, horizon 1, action당 약 16초는 보편적 성능값이 아니라 해당 setup의 근거로만 기록했다.

### Genie 3

- official model page와 company research post를 확인했다.
- 720p, 20-24 fps, 수 분간 interactive world를 유지하는 현재 시각적 world model 사례로 배치했다.
- metric pose, force, collision accuracy나 robot controller success는 공식 claim이 아니므로 별도 증거가 필요하다고 명시했다.

## 3. 비공개 전이 문제

본문을 쓰기 전에 다음 문제를 답할 수 있어야 한다고 정했다.

> 새로운 카메라와 gripper가 달린 로봇이 부분 관측 환경에서 goal image만 보고 물체를 옮긴다. 화려한 video generator는 있지만 camera frame, action timestamp, uncertainty가 불명확하다. 어떤 representation과 dynamics contract를 확인하고, 어떤 planner를 붙이며, 어떤 evidence가 있어야 release할 수 있는가?

완성된 본문만 읽고 다음 답에 도달할 수 있어야 했다.

- 관측 `o_t`, 물리 상태 `s_t`, belief `b_t`, latent `z_t`를 구분한다.
- pixel reconstruction fidelity가 아니라 action-relevant state와 temporal identity를 검사한다.
- action `a_t`의 frame, unit, sign, timestamp와 aggregation window를 고정한다.
- one-step teacher forcing과 rollout error를 따로 측정한다.
- goal latent cost만 믿지 않고 constraint, uncertainty, real residual을 함께 본다.
- open-loop 행동열 전체를 실행하지 않고 첫 action 뒤 재관측하는 receding-horizon MPC를 사용한다.
- visual plausibility, metric dynamics, planning utility, closed-loop task success를 단계별 evidence로 분리한다.

## 4. 최종 구조

1. `world-model-physical-ai`: Cosmos 3, Genie 3, V-JEPA 2, direct VLA를 예측 대상과 증거 수준으로 구분하는 hub.
2. `predictive-world-representations`: observation, state, belief, latent와 JEPA-style masked prediction, EMA, collapse 경계를 설명한다.
3. `action-conditioned-world-dynamics`: forward, inverse, joint objective와 좌표·시간 계약, rollout loss, uncertainty를 설명한다.
4. `world-model-planning-closed-loop`: goal cost, CEM, receding-horizon MPC, re-observation, evidence ladder와 release gate를 설명한다.

기존의 `MDP → model-based RL → robot stack → motion planning` 강제 순서는 제거했다. MDP나 제어 기반은 본문에서 실제로 막힐 때만 내려가는 선택 기반으로 남겼다. 필수 논문 하향은 V-JEPA 2/2-AC에서 끊었다.

## 5. 수식과 Viz 설계

- display 수식은 모든 항의 역할을 한국어 `underbrace`와 바로 아래 `FormulaNote`로 설명한다.
- mobile에서 planning cost가 9.39px까지 작아지는 문제가 발견되어 utility `U(a)`와 total cost `J(a)`를 두 줄로 분해했다.
- Viz는 모델 이름 표가 아니라 오해를 제거하는 상태 변화로 설계했다.
  - 예측 계약 전환: video, latent, action-conditioned, interactive의 출력과 보장 범위가 바뀐다.
  - pixel/latent 전환: 복원 품질과 행동 정보가 같은 목표가 아님을 보인다.
  - forward/inverse/joint와 frame 전환: action ownership을 보인다.
  - horizon 전환: 긴 계획이 계산량과 model error를 함께 키우는 것을 보인다.
  - release gate: open-loop 성공과 closed-loop 성공을 분리한다.
- 360, 390, 768, 1440px에서 내부 scroll 없이 동작하도록 폭, label, curve, formula를 검사했다.

## 6. Claude 협업과 편집 판단

bounded Claude Sonnet review는 USD 0.191085를 사용했다. 다음 제안은 원문과 대조한 뒤 반영했다.

- camera frame과 calibration ownership
- visual controllability와 metric grounding의 분리
- partial observability에서 re-observation 필요성
- ambiguous goal과 model exploitation

다음 제안은 그대로 쓰지 않았다.

- action-relevant representation이 반드시 수학적으로 equivariant해야 한다는 주장: 선택 가능한 inductive bias이지 source가 보장하는 필수 계약이 아니다.
- EMA collapse와 rollout exposure bias를 같은 원인으로 묶는 설명: representation 학습 실패와 autoregressive deployment mismatch는 다른 failure mode다.
- V-JEPA 2를 2026 연구로 표기한 부분: 공식 공개 시점인 2025-06으로 교정했다.

## 7. 검증 결과

- focused ESLint 통과
- production build 통과, 기존 chunk-size warning만 유지
- 세 deep article의 4 viewport matrix 통과
- four-stage learning path와 top-down route 통과
- interactive behavior test 통과
- KaTeX parse error, raw command, document·figure·formula overflow 0
- mobile·desktop hub와 다섯 Viz state를 실제 screenshot으로 검토
- learning-flow audit: registered 579, global continuity coverage 579, learningPath assignments 248

## 8. 4B·9B handoff

4B worker는 한 원문 또는 한 본문만 받고 아래를 추출한다.

```json
{
  "prediction_target": "pixel | latent | action | joint",
  "state_observation_boundary": "",
  "action_contract": {
    "frame": "",
    "unit": "",
    "timestamp": "",
    "aggregation": ""
  },
  "training_objective": [],
  "deployment_loop": "open_loop | receding_horizon",
  "evidence_level": "visual | metric_dynamics | planning | closed_loop",
  "unsupported_claims": [],
  "source_anchor": ""
}
```

9B reviewer는 여러 packet을 합쳐 다음만 판단한다.

1. 서로 다른 prediction target을 한 품질 점수로 섞었는가?
2. action frame·unit·time 계약이 빠졌는가?
3. one-step loss를 long rollout 성능으로 확대했는가?
4. goal cost가 ambiguous하거나 model exploitation을 허용하는가?
5. 실제 관측으로 닫히는 feedback loop와 release evidence가 있는가?

상위 orchestrator만 학습 순서, 용어 통일, Viz 상태, 반응형 QA와 배포를 담당한다.
