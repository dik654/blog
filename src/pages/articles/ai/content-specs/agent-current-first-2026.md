# Agent systems current-first 2026 content spec

## Goal

- 독자가 2026년 agent를 “좋은 prompt를 쓰는 모델”이 아니라 model, harness, tool,
  workspace, durable state, policy와 evaluator가 결합된 실행 시스템으로 구분한다.
- API, shell, GUI와 remote agent 중 필요한 action boundary를 고르고, 실제 side effect가
  검증된 state transition으로 닫히는지 판단한다.

## Hidden challenge

다음 문제는 본문에 그대로 노출하지 않는다. 두 새 글과 기존 경로의 깊이를 판정하는
내부 oracle로 사용한다.

> 보험 심사 agent가 PDF와 사내 API를 읽고, API가 없는 legacy 웹 화면에서 고객 상태를
> 수정하며, 별도 fraud agent에 조사를 위임한다. 작업은 여러 시간과 여러 sandbox에 걸쳐
> 진행된다. 웹 화면의 버튼은 위치가 바뀌고, 제출 직후 응답이 timeout될 수 있다. 같은 요청의
> 중복 제출은 실제 지급을 두 번 만든다. 새 session은 직전 model transcript를 갖지 않는다.
> 어떤 상태를 screenshot, DOM/API observation, proposal, approval, effect receipt,
> checkpoint와 artifact로 남겨야 하는가? MCP와 A2A는 각각 어느 경계를 소유하며, retry,
> 권한 위임, 사람 확인과 최종 release를 누가 결정해야 하는가?

통과 기준:

- Model은 행동을 제안할 뿐 실제 도구 실행과 권한을 소유하지 않는다.
- API/shell/GUI/remote-agent action은 관찰 가능성, 재시도 안전성과 검증 방법이 다르다.
- Screenshot의 좌표를 곧 의미로 취급하지 않고 target identity와 observation revision을
  함께 기록한다.
- Timeout을 실패로 단정하지 않고 effect receipt 또는 새 관찰로 commit 여부를 확인한다.
- Multi-agent를 persona 수가 아니라 task envelope, artifact, lease, verifier와 권한
  delegation으로 나눈다.
- Transcript가 아니라 checkpoint, artifact와 verified state로 새 sandbox에서 재개한다.
- MCP tool invocation과 A2A agent task delegation을 같은 protocol로 설명하지 않는다.

## Route ownership

### 00 · 현재 Agent Runtime

- 새 글: `agent-runtime-current-first`
- 소유 질문: 현재 agent system의 필수 실행 층은 무엇이며 어떤 branch부터 읽어야 하는가?
- 깊이: current landscape, action surface, durability, coordination, security/eval, route chooser
- 중단선: MCP wire message, GUI grounding algorithm과 framework API 세부는 다음 글로 넘긴다.

### 01 · 도구 · Computer Use

- 새 글: `computer-use-agent-runtime`
- 기존 글: `mcp-protocol`, `skills-anatomy`
- 소유 질문: tool proposal이 실제 환경의 검증된 effect가 되기까지 어떤 상태가 필요한가?
- 깊이: screenshot/DOM/API observation, grounding, policy, idempotency, effect verification,
  computer-use eval
- 중단선: OCR·vision backbone 전체, browser engine 구현과 RPA 제품 비교는 열지 않는다.

### 02 · 장기 작업 · Multi-agent

- 기존 글: `llm-harness`, `multi-agent-implementation`
- 소유 질문: context와 process가 사라져도 run을 재개하고 분리된 worker 결과를 병합하는가?
- 후속 보강: A2A task lifecycle과 artifact handoff는 기존 multi-agent 글의 독립 gap으로
  먼저 보강하고, 분량이 커질 때만 새 글로 분리한다.

### 03 · 안전 · 평가

- 기존 글: `prompt-injection-defense`, `agent-evaluation-trace`
- 소유 질문: model confidence와 authorization을 분리하고 side effect와 task success를
  반복 가능한 evidence로 검증하는가?

### 04 · 공통 기반

- 기존 글: `agentic-patterns`, `context-engineering`, `prompt-engineering`
- 선택 근거: `xml-prompting`
- 소유 질문: workflow와 agent loop를 구분하고 한 turn의 evidence packet을 조립하는가?
- `xml-prompting`은 독립 핵심 경로가 아니다. 삭제하지 않고 source article로 접어 둔다.

### 05 · 제품 사례

- 기존 글: `agent-frameworks`, `claude-code`, `openclaw-assistant`
- 소유 질문: 공통 runtime 책임이 특정 framework/product에서 어디에 배치됐는가?
- 제품 목록은 최신 기준을 가르치는 source가 아니다. 공통 계약을 검산하는 case로만 유지한다.

## Source anchors

| Area | Primary source | Claim boundary |
|---|---|---|
| 2026 harness | OpenAI, *The next evolution of the Agents SDK* (2026-04-15) | Memory, sandbox-aware orchestration, skills, MCP, shell, snapshot/rehydration과 harness-compute 분리 |
| Computer environment | OpenAI, *From model to agent: Equipping the Responses API with a computer environment* (2026-03-11) | Model proposal, shell execution, container workspace, parallel session과 bounded result |
| GUI agent | OpenAI, *Computer-Using Agent* (2025-01-23) | Screenshot perception, virtual mouse/keyboard, iterative perception-reasoning-action과 benchmark scope |
| Long-running work | Anthropic, *Effective harnesses for long-running agents* (2025-11-26) | Initializer, incremental worker, progress artifact와 context-window handoff |
| Tool protocol | MCP Specification `2026-07-28` | 요청 단위 협상, stateless core, server discovery와 task handle의 경계 |
| Agent protocol | A2A Specification `1.0` | Binding·version 협상, signed Agent Card, SendMessage와 task/artifact lifecycle |
| GUI benchmark | OSWorld, WebArena primary papers | Environment reset, task success와 end-state evaluator의 제한 |
| Agent loop | Yao et al., *ReAct* | Observation과 action을 교차하는 최소 loop |

## Full-scope map

| Topic | Must cover | Depth | Article | Risk if omitted |
|---|---|---|---|---|
| Model vs agent system | proposal과 execution ownership | deep | current | model에게 권한을 부여한다. |
| Harness vs compute | state owner와 isolated workspace | deep | current | container loss가 run loss가 된다. |
| Action surface | API, shell, GUI, remote agent | deep | current | 서로 다른 실패·검증 계약을 섞는다. |
| Durable state | checkpoint, artifact, receipt, rehydrate | deep | current | transcript를 memory로 오해한다. |
| GUI observation | screenshot revision, DOM/a11y, target identity | deep | computer | stale frame과 좌표 drift를 놓친다. |
| Action commit | proposal, policy, approval, execute, receipt | deep | computer | 클릭 성공을 task 성공으로 본다. |
| Retry safety | idempotency key, read-after-write, ambiguous timeout | deep | computer | 중복 side effect를 만든다. |
| GUI evaluation | reset, end state, repeated trials, safety invariant | deep | computer | demo 성공을 일반 신뢰도로 과장한다. |
| MCP vs A2A | tool boundary와 remote agent task boundary | brief | current | protocol 이름을 기능 목록으로 외운다. |
| Multi-agent | task envelope, artifact, verifier, merge owner | deep | existing multi | 역할 이름만 늘린다. |
| Security | source-to-sink policy, approval, credentials | deep | existing safety | injection 탐지만 방어로 오해한다. |
| Eval | trace, final state, pass^k, release gate | deep | existing eval | 답변 score로 side effect를 가린다. |
| Prompt patterns | instruction and structured request | brief | foundations | prompt가 전체 runtime인 것처럼 보인다. |

## Section plan: `agent-runtime-current-first`

### 01 · Model에서 실행 시스템으로

- 질문: 같은 model인데 왜 prompt app과 agent product의 신뢰성이 다른가?
- 흐름: goal -> context -> proposal -> policy -> execution -> observation -> reducer -> verified state
- Viz: `AgentRuntimeStackLab`
  - control: “한 번 답하기 / API 작업 / GUI 작업 / 장기 작업”
  - visible transition: 필요한 runtime layer와 빠지면 생기는 failure가 바뀐다.
  - invariant: model output은 side effect가 아니라 proposal이다.

### 02 · Action surface를 먼저 고른다

- 질문: API가 있는데 GUI를 써야 하는가?
- 흐름: typed API -> shell/workspace -> GUI -> remote agent 순으로 관찰·권한·검증 비용 증가
- failure: API availability를 무시한 computer use, remote agent를 tool처럼 신뢰
- Viz: `ActionSurfaceLab`
  - 각 surface에서 observation, action, effect proof와 retry rule을 한 줄씩 비교한다.

### 03 · 오래 실행되려면 무엇이 밖에 남아야 하는가

- 질문: context window와 sandbox가 사라져도 이어갈 수 있는가?
- 흐름: versioned task state, checkpoint, artifact, effect receipt, rehydrate, replay
- formula: durable run의 next state는 transcript summary가 아니라 verified event reducer다.
- 모든 연산에 한국어 underbrace와 FormulaNote를 붙인다.

### 04 · Protocol과 coordination의 경계

- 질문: MCP server와 remote agent는 무엇이 다른가?
- 흐름: MCP tool/resource boundary와 A2A agent card/task/artifact/input-required lifecycle 분리
- Viz: protocol lane switcher. 정적 표만 두지 않는다.

### 05 · 어디서 읽기 시작할까

- 질문: 사용자의 실패 증상에 따라 어느 branch가 첫 글인가?
- control: “클릭이 틀림 / 작업이 끊김 / subagent 충돌 / 권한 위험 / 개선 증명”
- output: 해당 child route와 stop condition

## Section plan: `computer-use-agent-runtime`

### 01 · Screenshot은 state가 아니라 observation이다

- screenshot revision, viewport, scale, scroll, active window와 target identity를 정의한다.
- DOM/a11y/API가 있으면 pixel 좌표보다 우선하는 이유를 설명한다.

### 02 · Grounding에서 proposal까지

- target description -> candidate element -> confidence/ambiguity -> action proposal
- 좌표를 fixed truth로 저장하지 않고 observation revision에 묶는다.
- Viz: `ComputerUseLoopLab`
  - stale screenshot, coordinate drift, overlay, disabled control scenario
  - perception -> ground -> propose -> gate -> act -> observe -> verify 단계

### 03 · 클릭과 commit을 분리한다

- irreversible action은 prepare/commit, fresh confirmation과 action hash를 요구한다.
- approval은 destination, amount, account와 observation revision을 포함한다.

### 04 · Timeout과 retry를 안전하게 다룬다

- pure read, idempotent write, idempotency-key write, non-idempotent GUI action을 분류한다.
- ambiguous timeout 뒤 blind retry를 금지하고 read-after-write/effect receipt를 확인한다.
- Viz: `RetrySafetyLab`에서 action class와 timeout 결과를 바꾸면 retry/verify/escalate 판정이 변한다.

### 05 · Demo가 아닌 평가

- environment reset, hidden end-state checker, repeated trial, perturbation, forbidden side effect를 분리한다.
- OSWorld/WebArena 수치는 capability snapshot이며 실제 제품 success rate와 동일하지 않음을 명시한다.

## Cross-section narrative

- 현재 agent runtime 글은 시스템 층을 고르고 각 failure owner를 찾는다.
- Computer Use 글은 그중 관찰이 가장 약하고 side effect가 모호한 GUI branch를 확대한다.
- 이후 `llm-harness`와 `multi-agent-implementation`은 durable state와 coordination을 구현한다.
- `prompt-injection-defense`와 `agent-evaluation-trace`가 commit safety와 release evidence를 닫는다.
- 막힌 vocabulary만 MCP, context, agent loop와 prompt 기반으로 내려간다.

## Visual contract

- 390px에서 최소 글자 12px, material horizontal overflow 0.
- SVG 안에 핵심 설명문을 넣지 않는다. 상태·수치·판정은 HTML text가 소유한다.
- desktop에서도 고정 4~6열을 강제하지 않고 `auto-fit/minmax` 또는 단계형 세로 flow를 쓴다.
- selected, hover, focus, disabled와 `aria-pressed`를 제공한다.
- animation은 autoplay보다 사용자가 scenario를 바꾸며 인과를 확인하는 방식을 우선한다.
- 색은 layer family를 구분하는 보조 수단이며 상태명과 failure text를 항상 함께 표시한다.

## Formula contract

- 수학이 실행 invariant를 더 명확히 하는 durable state와 retry decision에만 사용한다.
- raw `\theta`, `\tau`, `\underbrace`가 본문에 노출되지 않는다.
- `FormulaNote`는 기호와 함께 왜 reducer, AND, fresh observation과 effect proof를 쓰는지 설명한다.
- 모바일에서 scale 0.72 미만으로 줄이지 않고 의미 단위로 식을 나눈다.

## Delivery order

1. Sidebar children과 article subcategory를 current-first 분기로 재배치한다.
2. `agent-runtime-current-first`와 route Viz를 구현한다.
3. `computer-use-agent-runtime`과 two interactive labs를 구현한다.
4. 기존 multi-agent 글에 A2A task/artifact handoff를 보강한다.
5. Product case metadata와 prompt/xml 통합은 핵심 경로 검증 후 별도 pass로 닫는다.
6. Agent ops와 Claw Code에는 cross-path만 추가하고 현재 구현 article을 대량 재작성하지 않는다.

## Small-model reconstruction

4B worker:

- 한 source의 claim/date/version 경계
- 한 action surface의 observation/proposal/effect proof
- 한 Viz scenario의 state transition과 390px contract
- 한 기존 article의 새 child route·handoff

9B reviewer:

- model proposal과 runtime authorization을 섞었는가
- API, GUI, MCP, A2A를 같은 tool 호출로 설명했는가
- timeout을 실패로 단정하거나 blind retry를 허용했는가
- transcript를 durable checkpoint로 오해했는가
- product 이름이 공통 execution contract를 가렸는가

Orchestrator:

- official source ledger, Claude identity header, browser measurement, screenshot과 test assertion을
  독립 증거로 보관한다.
- Context Manager timeout은 검증 실패로 기록하고 article/Viz 단위로 재분할한다.
