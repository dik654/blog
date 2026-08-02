# World Model · Physical AI 세 판단 단위 content spec

## 1. 현재 목표

2026년 7월의 상단 질문은 “다음 영상을 그럴듯하게 만드는가?”가 아니라 “관측과 행동을 어떤 단위로 표현하고, 후보 행동의 결과를 예측해, 실제 로봇에서 다시 관측하며 계획을 고칠 수 있는가?”다. Cosmos 3의 omnimodal world-action model을 현재 출발점으로 두되, 제품 이름을 그대로 학습 경로로 사용하지 않는다.

필수 경로는 다음 네 단계에서 끊는다.

1. World Model contract hub
2. Predictive world representation
3. Action-conditioned world dynamics
4. Planning and closed-loop evidence

Model-based RL의 긴 계보, 로봇 camera calibration, 확률과 motion planning은 위 계약에서 실제로 막힐 때만 연다. “World Models(2018) 이전까지 모두 읽기”를 필수 경로로 만들지 않는다.

## 2. 비공개 전이 문제

고정 외부 camera로 수집한 tabletop robot trajectory를 이용해 action-conditioned world model을 만들었다. 배포 현장에서는 camera가 25 cm 옆으로 이동하고 12도 기울어졌으며, 새 gripper를 사용한다. 추가 interaction data는 5시간뿐이다. System은 goal image로 물체를 집어 지정 위치에 놓아야 하고, planning은 한 action당 500 ms 안에 끝나야 한다. Table 밖으로 물체를 밀 가능성이 있으면 action을 실행하면 안 된다.

작성된 세 글과 허브만으로 다음을 판정할 수 있어야 한다.

- interactive video, latent predictor, action-conditioned dynamics, joint world-action model과 direct policy의 주장 범위
- observation과 physical state가 다른 이유, 한 frame에서 가려진 state를 어떻게 다루는지
- pixel reconstruction과 latent prediction이 각각 보존하는 정보
- action-free video pretraining이 action causality를 직접 배우지 않는 이유
- camera, robot base, end-effector frame 사이 pose와 action delta의 기준
- meter·radian·gripper state, frame rate와 action rate를 한 timeline에 정렬하는 법
- forward dynamics, inverse dynamics와 joint policy mode의 conditional direction
- teacher forcing과 autoregressive rollout의 입력 분포 차이
- goal latent ambiguity와 search가 model blind spot을 악용하는 failure
- CEM으로 후보 action 분포를 갱신하고 첫 action만 실행하는 MPC loop
- horizon, uncertainty, replanning period와 실제 안전 gate의 trade-off
- camera translation·tilt, 새 gripper mapping, collision clearance와 p95 planning latency의 측정 영수증
- real closed-loop 성공률의 trial 수와 confidence lower bound를 함께 보는 fail-closed release
- demo, offline prediction, simulated planning과 real closed-loop evidence의 claim boundary
- 특정 parameter 수를 기본값으로 삼지 않고 pretrained encoder를 재사용해 target device의 memory·p95 planning latency 안에서 범위를 좁히는 실험

문제 문항은 본문에 그대로 노출하지 않고 section coverage와 capability check에만 사용한다.

## 3. 글별 ownership

### Hub. `world-model-physical-ai`

**독립 판단:** “World model”이라는 이름을 보고 입력·출력·action grounding·증거 수준을 구분하고 다음 글을 고른다.

소유 범위:

- Cosmos 3, Genie 3, V-JEPA 2/2-AC, VLA의 공개 contract 차이
- interactive visual controllability와 metric action grounding의 구분
- 현재에서 기반으로 내려가는 네 단계와 stop rule
- reader symptom에 따른 entry 선택

소유하지 않음:

- JEPA loss의 세부 계산
- pose delta와 action timestamp 구현
- CEM update와 closed-loop release gate

### A. `predictive-world-representations`

**독립 판단:** 관측에서 어떤 정보를 latent에 남겨야 미래 예측과 후속 action post-training에 재사용할 수 있는지 판정한다.

소유 범위:

- observation, hidden physical state와 partial observability
- pixel prediction과 representation prediction
- context encoder, target encoder, EMA, stop-gradient와 mask prediction
- spatial-temporal token shape와 target region
- action-free prediction이 배우는 것과 배우지 않는 causality
- representation probe와 downstream transfer evidence

소유하지 않음:

- robot action coordinate definition
- CEM과 MPC
- low-level controller stability

Viz가 제거할 오해:

1. “Pixel을 잘 복원하면 planning state도 정확하다.”
2. “Mask prediction loss가 낮으면 action의 결과를 예측할 수 있다.”
3. “한 frame의 embedding은 가려진 물리 state를 모두 알고 있다.”

### B. `action-conditioned-world-dynamics`

**독립 판단:** action-labeled trajectory가 실제 intervention model이 되려면 좌표·단위·시간·학습 objective가 어떤 계약을 가져야 하는지 판정한다.

소유 범위:

- state-action-next-state transition
- camera, base, end-effector frame과 relative pose action
- video frame, proprioception과 action timestamp alignment
- forward, inverse와 joint world-action conditional direction
- domain-specific action projection과 shared latent action token
- teacher forcing, short rollout loss와 compounding error
- stochastic future, uncertainty와 out-of-distribution action

소유하지 않음:

- search optimizer의 세부
- motor torque controller
- representation pretraining의 전체 objective

Viz가 제거할 오해:

1. “Action vector의 숫자만 맞으면 다른 camera·robot에서도 같은 의미다.”
2. “Inverse dynamics와 policy는 같은 문제다.”
3. “One-step validation loss가 낮으면 긴 rollout도 안정적이다.”

### C. `world-model-planning-closed-loop`

**독립 판단:** learned dynamics를 후보 행동 평가에 사용하고, model error와 안전 경계를 실제 관측으로 닫을 수 있는지 판정한다.

소유 범위:

- goal representation, cost, constraint와 search의 분리
- CEM candidate sampling, elite selection과 distribution update
- receding-horizon MPC와 first-action execution
- partial observation과 belief/state refresh
- goal ambiguity, model exploitation과 uncertainty penalty
- horizon, compute budget, replanning period와 failure recovery
- evidence ladder와 real closed-loop release gate
- 미측정/pass/fail 3상태, trial count와 confidence lower bound를 포함한 fail-closed 판정
- 작은 predictor 기반의 최소 재현 실험

소유하지 않음:

- camera calibration 알고리즘 전체
- collision checker와 robot dynamics 전체
- model-based RL의 모든 역사

Viz가 제거할 오해:

1. “가장 그럴듯한 future video를 고르면 최적 action이다.”
2. “긴 horizon은 항상 더 멀리 보므로 좋다.”
3. “Goal latent 거리가 줄면 안전한 task success다.”

## 4. 수식 계약

모든 display 수식은 수식 내부의 `underbrace`에 한글 항 역할을 쓰고 바로 아래 FormulaNote에서 계산 의도와 기호를 다시 설명한다.

- Representation: latent target, EMA target update, spatiotemporal token shape, action-free conditional
- Dynamics: action-conditioned transition, relative pose, teacher forcing, rollout loss, stochastic uncertainty
- Planning: goal energy, CEM mean/variance update, MPC first-action rule, uncertainty-aware cost, rollout error

모바일에서 한 줄 식이 0.80 아래로 축소되면 의미 단위 `aligned` 여러 줄로 나눈다. 기호의 긴 영문 첨자는 짧은 수학 기호로 바꾸고 FormulaNote에서 풀어 쓴다.

## 5. source anchors

| Source | 글 | claim boundary |
|---|---|---|
| NVIDIA, Cosmos 3, 2026-06 | Hub·Dynamics | AR/DM MoT, domain action projection, forward·inverse·joint generation mode의 공식 근거. 특정 robot의 안전한 closed-loop 성능으로 확대하지 않는다. |
| Meta, V-JEPA 2, 2025-06 | Representation·Dynamics·Planning | action-free pretraining, frozen encoder, 62시간 미만 DROID post-training, teacher-forcing+2-step rollout, CEM/MPC와 실제 robot evidence. 모든 embodiment로 일반화하지 않는다. |
| DreamZero, 2026-02 | Hub·Planning | 14B joint video/action policy의 7Hz real closed loop와 10–30분 adaptation. Explicit CEM planner 또는 일반 safety qualification으로 확대하지 않는다. |
| World Action Planner, 2026-07-30 | Hub freshness queue | VLM proposal과 imagined rollout search를 결합하지만 현재 공개 evidence가 simulation 중심이므로 current promotion을 보류한다. |
| Google DeepMind, Genie 3, 2025-08 | Hub | 720p, 20-24fps, 수분 수준의 interactive visual world. Metric geometry, contact와 robot control을 보장하지 않는다. |
| Ha & Schmidhuber, World Models, 2018 | Optional history | latent dynamics와 controller를 분리하는 역사적 기준. 현재 독자의 필수 첫 논문으로 노출하지 않는다. |
| Rubinstein, Cross-Entropy Method, 1997, DOI `10.1016/S0377-2217(96)00385-2` | Planning | elite sample로 proposal distribution을 갱신하는 derivative-free search의 기반. learned model의 정확성은 보장하지 않는다. |
| Mayne et al., Constrained MPC, 2000, DOI `10.1016/S0005-1098(99)00214-9` | Planning | finite horizon을 풀고 일부 action만 실행한 뒤 다시 최적화하는 control contract. Learned representation의 타당성을 보장하지 않는다. |

## 6. 기존 글 migration

`world-model-physical-ai` slug는 유지하되 현재 모델의 contract와 네 단계 읽는 경로를 고르는 허브로 바꾼다. 기존 JEPA, action-conditioned transition, planning, rollout error와 evidence ladder 설명은 세 새 글에 흡수하고 같은 prose를 중복 보존하지 않는다. `rl-model-based-world-models`와 과거 paper spine은 선택 확장으로 유지하되 current-first 필수 경로에서 제거한다.

기존 표는 모델별 설명을 압축해 연결을 끊으므로 제거한다. 각 model은 “무엇을 관측하고, action은 어디에 들어가며, 무엇을 출력하고, 어떤 증거까지만 있는가?”의 네 문장으로 순서대로 설명한다.

## 7. 완료 조건

- 허브와 세 글이 서로 다른 reader decision과 capability check를 가진다.
- current-first path는 네 단계이고 역사 하향은 V-JEPA 2/2-AC에서 멈춘다.
- Camera/frame/action unit, partial observability와 real safety가 부록이 아니라 본문에 있다.
- 각 Viz는 interaction에 따라 하나의 오해를 눈으로 반증한다.
- 360·390·768·1440px에서 document, figure, formula overflow가 0이다.
- 비공개 전이 문제의 모든 판정 항목을 네 글만으로 재구성할 수 있다.

## 8. Claude 협업 검토와 판정

- Bounded Claude Sonnet 검토는 USD 0.191085에서 완료됐다.
- Camera frame, metric grounding, partial observability, goal ambiguity와 model exploitation의 소유권이 약하다는 지적은 원문과 기존 본문을 대조한 뒤 채택했다.
- “Action-relevant representation”을 반드시 수학적 equivariance로 단정하는 제안은 V-JEPA 2 원문이 보장하지 않으므로 채택하지 않았다.
- EMA target collapse와 autoregressive exposure bias를 같은 원인으로 묶는 제안은 서로 다른 failure이므로 채택하지 않고 별도 section에서 설명한다.
- V-JEPA 2를 2026년 논문으로 적은 제안은 공식 공개일 2025-06과 충돌하므로 정정했다.
