# Agent Frameworks 2026 - content spec

## Scope

| 구분 | 이 글이 소유하는 질문 | 다른 글로 넘기는 질문 |
| --- | --- | --- |
| Framework 선택 | 실행 loop, state, approval, replay 중 무엇을 framework에 맡길지 어떻게 결정하는가? | Agent가 필요한지 자체는 `agentic-patterns` |
| Runtime 책임 | process restart와 사람 대기 뒤에도 어떤 상태와 증거가 남아야 하는가? | reducer, checkpoint 구현 원리는 `llm-harness` |
| 제품군 읽기 | 직접 API, Agent SDK, graph/workflow, data workflow, crew runtime을 어떤 책임 차이로 읽는가? | 각 제품의 모든 API 사용법 |
| Migration | 제품명 교체 전에 어떤 application contract를 고정해야 하는가? | 특정 저장소의 실제 crate·module 구현은 Claw 경로 |
| 최신성 | 2026-07 공식 문서가 말하는 현재 책임과 승계 관계는 무엇인가? | 장래 roadmap을 확정 사실처럼 예측하지 않음 |

## 독자가 본문만으로 풀어야 하는 내부 검증 문제

1. 환불 agent가 결제 API 호출 직후 응답을 받기 전에 process가 재시작됐다. 사용자는 두 시간 뒤 승인했다. 이때 저장해야 할 state, 승인 revision·expiry, idempotency key, effect evidence와 재개 지점을 구분할 수 있는가?
2. OpenAI Responses API 직접 호출과 Agents SDK 사용의 차이를 모델 성능이 아니라 loop·tool dispatch·state 소유권으로 설명할 수 있는가?
3. LangGraph checkpointer와 store가 각각 무엇을 보존하며, application database의 실제 업무 상태와 왜 같지 않은지 설명할 수 있는가?
4. LlamaIndex Workflows와 CrewAI Flows를 “RAG용”, “multi-agent용”이라는 표어가 아니라 event·state·resume·coordination 경계로 비교할 수 있는가?
5. AutoGen을 새 프로젝트의 현재 기본값처럼 소개하면 왜 잘못된가? Microsoft의 공식 승계 관계를 근거로 답할 수 있는가?
6. framework가 persistence와 tracing을 제공해도 product-specific authorization, idempotency, effect verification과 release gate가 왜 남는지 설명할 수 있는가?

## 서사

### 1. Library 이름보다 실행 책임을 먼저 본다

- destructive side effect와 장기 중단이 있는 하나의 사례로 시작한다.
- model proposal, framework runtime, application contract, external system을 분리한다.
- 독자가 “framework가 해 준다”는 표현에서 빠진 owner를 찾게 한다.
- Viz: 한 run이 proposal에서 checkpoint, approval, commit, verification, trace로 가는 장면.

### 2. 여섯 책임 경계로 빈칸을 센다

- turn loop
- tool dispatch와 policy
- checkpoint와 resume
- approval과 commit
- effect verification
- trace, replay와 release evidence
- Formula는 각 경계에서 runtime과 application owner의 빈칸을 따로 센다. 우열 점수로 사용하지 않는다.

### 3. 최소 runtime에서 필요한 만큼만 올린다

- 직접 model API + application-owned loop
- lightweight Agent SDK
- durable graph/workflow runtime
- data-centered event workflow
- role/crew coordination runtime
- Microsoft Agent Framework는 AutoGen/Semantic Kernel의 현재 승계 흐름으로 별도 주석 처리
- 제품별 feature table 대신 각 family가 “대신 소유하는 것 / 여전히 application이 소유하는 것 / 멈출 조건”을 서술한다.
- Viz: 업무 특성과 필요한 보장을 고르면 최소 충분 runtime과 남은 의무를 보여 주는 ownership lab.

### 4. Timeout 뒤 실제 effect를 검증하는 end-to-end test

- prepare와 commit을 분리한다.
- approval payload와 state revision을 묶는다.
- approval expiry를 검사하고 만료된 승인은 새 action으로 다시 받는다.
- restart 뒤 pending action을 복원한다.
- timeout event가 없더라도 pending commit을 복원하면 blind retry 전에 external state를 reconcile한다.
- framework demo가 아니라 application invariant를 검증한다.

### 5. Migration은 framework 이름이 아니라 contract를 고정한다

- run state schema, tool envelope, checkpoint identity, approval record, effect receipt, trace event를 먼저 고정한다.
- 같은 fixtures로 old/new runtime을 paired replay한다.
- 현재 공통 계약 글과 제품 사례 글로 연결한다.

## 시각 설계

- 큰 비교표와 장식 카드 grid를 쓰지 않는다.
- `RuntimeOwnershipLab`은 390px에서도 가로 scroll 없이 control과 결과가 세로로 접힌다.
- 색은 blue/emerald/amber/rose를 상태 의미에만 사용하고, 본문은 neutral surface를 유지한다.
- 선은 얇은 border와 짧은 connector만 사용한다. 긴 화살표와 작은 SVG text를 피한다.
- controls는 segmented buttons와 checkbox를 사용하며 모든 결과 변화에 텍스트 근거가 따라온다.
- `RuntimeExecutionViz`는 StepViz의 장면 전환을 쓰되 각 장면 안의 글자는 HTML로 렌더링한다.

## 근거 원문

- OpenAI Agents SDK official docs: SDK와 Responses API의 loop ownership 차이, sessions, HITL, tracing.
- LangGraph official docs: low-level orchestration runtime, durable execution, checkpointer/store 차이.
- LlamaIndex official docs: event-driven step workflow, branches/loops, durable workflow.
- CrewAI official docs: Crews와 Flows, structured state, persistence, resume/fork.
- Microsoft Agent Framework official docs: AutoGen/Semantic Kernel의 direct successor와 agent/workflow 구분.

## 중단 기준

- 모든 framework API를 나열하지 않는다.
- 벤치마크 없는 “더 빠르다/더 좋다/더 쉽다” 순위를 만들지 않는다.
- application-specific side effect를 framework persistence가 자동 해결한다고 쓰지 않는다.
- 공식 문서에 없는 roadmap이나 내부 구현을 사실로 단정하지 않는다.
