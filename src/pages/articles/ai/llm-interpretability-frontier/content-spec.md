# LLM Interpretability Frontier content spec

## Goal
- 독자가 2026년의 Jacobian lens와 J-space를 단순한 hidden-state 번역기가 아니라, readout과 intervention을 함께 가진 제한된 실험 도구로 이해하게 한다.
- “중간 개념이 읽혔다”에서 “그 개념이 실제 추론을 매개했다”로 넘어갈 때 필요한 swap, depth control, J-space decomposition, clamping과 held-out 검증 계약을 복원한다.

## Private transfer problem
- 공개 본문에 문제 자체를 싣지 않는다.
- 검증 질문: `spider`가 중간 표현으로 읽히는 두 단계 추론에서 `spider→ant` J-lens coordinate swap이 답을 `8→6`으로 바꿨다. 이 결과가 중간 개념의 causal use인지, answer direction의 우연한 혼입인지, context-specific linearization artifact인지 구분하는 실험을 설계할 수 있어야 한다.
- 합격 insight:
  - intermediate swap과 answer swap의 causal depth를 비교한다.
  - J-space component와 non-J-space remainder를 같은 norm으로 비교한다.
  - non-J-space intervention 뒤 J-space 재진입을 clamp한다.
  - inactive concept, random rotation, position/layer band와 held-out prompt를 대조군으로 둔다.
  - swap 실패를 곧바로 “표현 없음”으로 해석하지 않고 source loading과 single-token vocabulary limitation을 확인한다.

## Source anchors
| Area | Primary source | Why it matters |
|---|---|---|
| Jacobian lens | `transformer-circuits.pub/2026/workspace` §1.3, §A.5 | 평균 downstream Jacobian과 vocabulary readout의 정확한 정의 |
| J-space | 같은 원문 §1.4, §A.8 | overcomplete token directions, sparse nonnegative decomposition과 union-of-cones 경계 |
| Causal evidence | 같은 원문 §3.1–3.4 | report, intermediate swap, flexible generalization, selective mediation 실험 |
| Layer regimes | 같은 원문 §4.1 | early sensory, middle workspace, late motor의 경험적 경계와 자기참조 한계 |
| Limitations | 같은 원문 §9.1, §A.9 | single-token vocabulary, bag-of-concepts, inconsistent readout, template lens 보완 |
| Replacement graphs | `transformer-circuits.pub/2025/attribution-graphs/methods` | readout과 replacement-model graph를 혼동하지 않게 하는 faithfulness 경계 |
| Feature dictionaries | Google DeepMind `Gemma Scope 2` page/technical report | Gemma 3 전 layer SAE·transcoder 공개 범위와 공개 재현 경계 |

## Full-scope map
| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| Evidence ladder | observation, decomposition, attribution, intervention의 허용 claim | brief | Circuit Tracing methods | 전체 글의 반복 기준 |
| J-lens construction | prompt-specific Jacobian과 corpus average를 구분하고 readout 식 복원 | deep | Workspace §1.3 | 현재 글의 가장 큰 누락 |
| J-space | overcomplete frame, k-sparse nonnegative component, <10% variance | deep | Workspace §1.4 | “모델 생각 전체” 오해 차단 |
| Causal experiments | verbal report, reasoning, broadcast, selectivity | deep | Workspace §3 | 단순 정적 표 대신 실험 selector Viz |
| Layer regimes | sensory/workspace/motor와 early absence의 해석 경계 | deep | Workspace §4.1 | 특정 모델 layer 번호를 보편 법칙으로 만들지 않음 |
| Gemma Scope 2 | SAE와 transcoder의 공개 범위, feature 수와 faithfulness의 차이 | brief | Gemma Scope 2 | J-lens와 다른 method family |
| Circuit Tracing | replacement fidelity, error node, post-hoc original-model intervention | brief | Attribution Graphs | 구현 글로 handoff |
| Limitations | token vocabulary, relation binding, failed readout, consciousness overclaim | deep | Workspace §9 | 최신 결과의 과잉 서사 차단 |
| Reproduction | open-source J-lens code/open models vs proprietary model claims | brief | Workspace repo | 구현 가능 범위 표시 |

## Reader prerequisites
- Residual stream: Transformer block들이 읽고 update를 더하는 token별 공용 vector.
- Jacobian: 입력 vector를 조금 움직였을 때 출력 vector가 어느 방향으로 얼마나 변하는지 나타내는 국소 선형 map.
- Unembedding: final residual vector를 vocabulary logit으로 바꾸는 matrix.
- Sparse nonnegative decomposition: 많은 후보 방향 중 적은 수만 양수 계수로 골라 activation을 근사하는 방식.
- Intervention: activation을 직접 바꾸고 output metric의 변화를 측정하는 인과 실험.

## Section 1: 증거 사다리 -- 읽을 수 있음과 원인을 어떻게 분리하나
- Concept: attention, lens, SAE, attribution graph와 patching이 서로 다른 질문에 답한다.
- Execution flow:
  1. 출력 차이를 관찰한다.
  2. readout/decomposition으로 후보를 만든다.
  3. attribution으로 실험 수를 줄인다.
  4. 원 모델 intervention과 control로 claim을 닫는다.
- Design insight: 최신 도구의 이름을 외우지 않고 허용되는 주장 강도로 분류한다.
- Viz plan: 기존 Evidence Ladder selector를 유지하되 이후 모든 section에서 같은 용어를 재사용한다.

## Section 2: J-lens 구성 -- 다음 layer 전체를 어떤 map으로 근사하나
- Key variables:
  - `h_{\ell,t}`: layer `\ell`, position `t` residual state.
  - `h_{L,t'}`: 현재 또는 미래 position의 final residual state.
  - `J_\ell`: position과 prompt에 걸쳐 평균한 downstream Jacobian.
  - `W_U`: final unembedding.
- Execution flow:
  1. 여러 prompt와 source/target position에서 `∂h_L/∂h_\ell`를 구한다.
  2. context-specific use를 줄이기 위해 평균한다.
  3. `J_\ell h_\ell`로 final coordinates를 근사한다.
  4. model의 norm과 `W_U`를 적용해 vocabulary readout을 만든다.
- Failure modes:
  - 평균은 특정 prompt의 비선형 경로를 보존하지 않는다.
  - corpus distribution이 바뀌면 map의 유효 범위도 바뀐다.
  - softmax score는 explanation probability가 아니다.
- Viz plan:
  - Step 0: full downstream layers.
  - Step 1: prompt별 Jacobian sample.
  - Step 2: positions/prompts average.
  - Step 3: activation을 token ranking으로 read.

## Section 3: J-space -- 왜 전체 residual stream이 아닌가
- Key variables:
  - `v_{\ell,u}`: token `u`의 J-lens direction.
  - `\alpha_i ≥ 0`: selected direction의 local coordinate.
  - `k`: 동시에 허용하는 sparse direction 수.
- Execution flow:
  1. vocabulary 수가 hidden width보다 커 overcomplete set이 된다.
  2. 단순 basis decomposition은 유일하지 않다.
  3. 적은 수의 양수 direction으로 nearest approximation을 찾는다.
  4. 나머지를 non-J-space component로 남긴다.
- Design insight: 적은 variance가 causal importance가 작다는 뜻은 아니다. 원문은 small component의 privileged use를 intervention으로 따로 검증한다.
- Viz plan: activation bar를 J-space component와 remainder로 나누고 `k`를 바꾸어 coverage와 ambiguity를 보여 준다.

## Section 4: Causal experiments -- 읽은 개념을 실제 사용했다고 언제 말하나
- Execution flow:
  1. Verbal report: concept coordinate를 swap/inject하고 적절한 report 시점의 output을 본다.
  2. Internal reasoning: unspoken intermediate를 바꾸고 downstream answer와 causal depth를 본다.
  3. Flexible generalization: 같은 concept swap을 capital/language/continent 등 다른 function에 재사용한다.
  4. Selectivity: report/flexible task는 변하지만 automatic continuation/anomaly detection은 유지되는지 본다.
- Controls:
  - answer direction swap의 layer timing.
  - same-norm non-J-space remainder.
  - J-space re-entry clamping.
  - random/inactive direction과 held-out prompts.
- Viz plan: 네 experiment를 segmented control로 전환하고 input, intervention, changed output, unchanged control, 허용 claim을 같은 위치에서 비교한다.

## Section 5: Layer regimes -- early, workspace, motor를 어떻게 구분하나
- Execution flow:
  1. early layer: readout이 noisy하고 stable abstract content가 거의 보이지 않는다.
  2. middle layer: persistent abstract concept와 flexible causal use가 나타난다.
  3. late layer: imminent next-token prediction과 정렬된다.
- Boundary:
  - 논문의 `~L38–L92`는 연구 대상 모델에서 얻은 값이지 모든 Transformer의 고정 비율이 아니다.
  - early readout 실패는 early layer에 정보가 없다는 증명이 아니다.
- Viz plan: 상대 depth slider로 observable signals, intervention interpretation과 금지된 결론을 함께 전환한다.

## Section 6: 주장 경계와 handoff -- 어디서 멈추고 무엇으로 내려가나
- Must cover:
  - single-token vocabulary와 multi-token template lens.
  - bag-of-concepts가 relation/binding을 잃는 문제.
  - inconsistent/uninterpretable readout.
  - functional global-workspace evidence와 consciousness claim의 차이.
  - Gemma Scope 2, Circuit Tracing, J-lens의 서로 다른 replacement/readout contracts.
- Handoff:
  - `llm-interpretability-readouts`: lens family 계산.
  - `sparse-autoencoder`: feature reconstruction.
  - `paper-transformer-circuits-2021`: residual/QK/OV 기준.
  - `llm-circuit-analysis`: original-model patching과 controls.

## Coverage recheck
| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| 최신 J-lens 수식 | 2 | none | 두 식마다 한국어 FormulaNote |
| Sparse J-space 정의 | 3 | none | nonnegative top-k와 remainder 해설 |
| Hard transfer insight | 4 | none | depth, decomposition, clamp, held-out controls 모두 설명 |
| 원문 통계 | 4 | partial | 핵심 수치만 prose에 쓰고 실험 범위를 함께 표시 |
| Layer boundary | 5 | none | model-specific임을 본문과 Viz에 표시 |
| 과잉 의식 서사 | 6 | none | functional analogy와 consciousness 판단 분리 |
| 구현 연결 | 6 | none | 네 내부 경로를 이유와 함께 연결 |
