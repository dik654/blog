# Agent system core learning path reconstruction

## 목표

에이전트 글을 기능 목록으로 나열하지 않고 다음 한 줄의 실행 경로로 연결한다.

`Agent Loop -> Context Packet -> MCP Exchange -> Harness Runtime -> Injection Containment -> Eval Evidence`

핵심 네 글은 서로 다른 질문을 소유한다.

1. `agentic-patterns`: 관찰 뒤 다음 행동을 누가 고르는가?
2. `context-engineering`: 그 판단에 어떤 상태와 근거를 넣는가?
3. `mcp-protocol`: 외부 capability와 어떤 protocol contract로 왕복하는가?
4. `llm-harness`: Model proposal이 언제 실제 commit과 release가 되는가?

그 뒤 `prompt-injection-defense`가 untrusted source의 privileged sink 도달을 막고,
`agent-evaluation-trace`가 수정 전후 개선을 반복 실행 증거로 확인한다.

## 이 경로를 고른 이유

Context Manager의 초기 Agent cluster 감사에서 실제 읽기 순서는
`agentic-patterns -> context-engineering -> mcp-protocol -> llm-harness`인데
sidebar 순서, 본문 인계, metadata와 MCP 깊이가 맞지 않는다는 finding이 나왔다.
네 글을 하나로 합치면 읽기는 짧아지지만 실패 소유자가 다시 섞인다. 따라서 독립 글은
유지하고, 한 글의 출력 state가 다음 글의 입력이 되도록 재구성했다.

최신 trend를 계속 추가할 때도 이 바닥은 변하지 않는다. 새 agent framework나 tool
protocol은 어느 책임을 바꾸는지에 따라 이 경로 위에 delta로 놓을 수 있다.

## 숨은 난도 검증

본문에 문제를 그대로 싣지 않고 아래 문제를 내부 acceptance test로 사용했다.

> 여러 시간 동안 저장소를 수정하는 고객지원 agent를 설계한다. Agent는 정책과 주문을
> 조회하고 코드 patch와 test를 만들며, 50달러 이하 환불만 자동 commit할 수 있다.
> Retrieval 문서 하나는 오래됐고 MCP server는 current protocol과 legacy HTTP+SSE를
> 함께 언급한다. Tool timeout이 간헐적으로 발생하고 context window가 끝나도 다음
> session이 재개해야 한다. Model, context builder, protocol, policy, executor와
> reducer의 책임을 나누고 권한 우회, retry 폭주, stale evidence, protocol mismatch와
> 진행 유실을 막는 state, message, trace와 release invariant를 설계하라.

네 글만 읽고 다음 결론에 도달할 수 있어야 통과로 보았다.

- 고정 순서면 workflow, 관찰 뒤 경로를 다시 고르면 agent를 쓴다.
- Model output은 authorization이나 commit이 아니라 typed proposal이다.
- Context는 transcript dump가 아니라 권위, 최신성, 관련성과 token budget을 통과한 packet이다.
- MCP initialize와 capability negotiation이 끝나기 전에 tool을 쓰지 않는다.
- Current transport는 stdio와 Streamable HTTP이며 HTTP+SSE는 legacy다.
- Tool application error와 JSON-RPC protocol error를 다른 recovery path로 보낸다.
- Policy gate와 deterministic reducer가 side effect와 다음 state를 소유한다.
- 긴 작업은 transcript가 아니라 checkpoint, artifact와 test evidence에서 재개한다.
- Critical invariant는 평균 품질이나 낮은 비용으로 상쇄하지 않는다.

## 근거와 주장 범위

주요 설명은 다음 1차 자료를 기준으로 했다.

- [ReAct](https://arxiv.org/abs/2210.03629): reasoning trace와 task action을 교차하고 environment observation으로 갱신하는 원형
- [Anthropic · Building effective agents](https://www.anthropic.com/research/building-effective-agents): workflow와 agent 구분, 단순한 구성에서 시작하는 기준
- [Anthropic · Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): 제한된 context를 선별하고 유지하는 현재 실무 관점
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25): lifecycle, capability negotiation, primitives, transport와 authorization
- [Anthropic · Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): session 간 progress와 external artifact
- [Anthropic · Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps): 긴 application task의 harness 연구
- [OpenAI · Harness engineering](https://openai.com/index/harness-engineering/): repository legibility, isolated environment와 feedback loop 사례
- [OpenAI Agents SDK · Tracing](https://openai.github.io/openai-agents-python/tracing/): run, turn, model, tool, guardrail과 handoff span의 구현 사례

사례 글의 productivity 수치를 보편 scaling law로 쓰지 않았다. MCP 설명은
`2025-11-25` revision에 pin했다. OAuth, transport와 experimental task처럼 revision에
따라 변할 수 있는 항목은 current spec link와 함께 기록했다.

## 구현 판단

### `agentic-patterns`

- Workflow, agent와 harnessed agent를 tool 유무가 아니라 경로 선택권과 작업 길이로 나눴다.
- ReAct를 생각 문구가 아닌 `state -> proposal -> observation -> transition -> verify` loop로 설명했다.
- Planning을 작은 DAG/queue, reflection을 evidence diff와 failure-owner 분류로 바꿨다.
- 완료 증거, budget 소진, 위험 한계를 OR로 묶은 종료 수식을 한국어 underbrace와 FormulaNote로 설명했다.
- Multi-agent는 separability, 독립 verifier, least privilege와 coordination cost를 통과할 때만 연다.

### `context-engineering`

- System policy, 현재 request/state, tool result, retrieval evidence와 durable memory를 한 turn의 packet으로 분리했다.
- Untrusted document를 instruction이 아닌 evidence로 취급하고 authority hierarchy를 먼저 세웠다.
- RAG를 top-k chunk가 아니라 claim, source span, date, conflict를 보존하는 evidence set으로 바꿨다.
- Memory에 write/read/refresh/expire/forget gate를 두고 compaction, durable memory, prefix cache를 분리했다.
- Model 호출 전 token admission을 실행하고 포함·제외 이유를 남기도록 했다.

### `mcp-protocol`

- Host/client/server와 data/transport layer를 나눴다.
- Server primitives인 tools/resources/prompts와 client capabilities인 sampling/elicitation/roots를 제어 주체까지 설명했다.
- stdio와 Streamable HTTP를 current transport로, HTTP+SSE를 legacy로 명시했다.
- `initialize -> notifications/initialized -> tools/list -> tools/call -> result`를 실제 JSON-RPC로 추적했다.
- Protocol mismatch와 `isError: true` tool result가 서로 다른 층이라는 점을 분리했다.

### `llm-harness`

- Admission, context builder, dispatcher, policy, executor, state manager를 실행 state machine으로 만들었다.
- Model output을 event로 두고 `x[t+1] = reduce(x[t], e[t])`로 versioned state를 갱신했다.
- Release를 critical invariant 0, task success 하한, latency/cost budget의 AND gate로 만들었다.
- Failure를 model/context/tool/policy/state/grader로 나눈 뒤 같은 snapshot에서 paired rerun하도록 했다.
- Long-running task는 checkpoint, artifact registry, test와 restart replay를 사용한다.

## Viz와 공용 디자인 수정

네 Lab은 장식이 아니라 선택에 따라 판단이 달라지는 도구다.

- `AgentLoopLab`: 정책 조회, 환불 판단, 코드 수정에서 최소 제어 구조가 바뀐다.
- `ContextPacketLab`: 구성 전략과 4k/8k/16k budget에 따라 overflow, stale contamination, evidence miss가 드러난다.
- `McpRoundTripLab`: 정상, version mismatch, tool error를 실제 message 단계와 keyboard tab으로 추적한다.
- `HarnessControlLab`: policy, retry, trace/checkpoint를 끄면 commit, 최초 실패 소유자와 release가 바뀐다.

첫 desktop screenshot에서 공용 `FlowRow`가 카드와 화살표를 모두 같은 grid fraction으로
배정해 `proposal`, `commit`이 중간에서 끊어졌다. 데스크톱을 `카드 flex-1 + 화살표
고정 폭`으로 바꿨다. 이 수정은 Agent Lab뿐 아니라 같은 공용 component를 쓰는 35개
기존 Flow에 적용된다. 모바일은 세로 단계, tablet/desktop은 밀도 높은 가로 단계로 유지한다.

수식 wrapper에는 `data-formula-pair`를 추가했다. 따라서 “화면 아래 어딘가에 설명이
있다”가 아니라 각 KaTeX block 바로 뒤의 FormulaNote를 자동 검증할 수 있다.

## Claude 검증 기록

Context Manager 결과는 첫 줄이 `[claude-code:sonnet`인 경우만 채택했다.

### 제외

- 파일 전체를 읽히는 L1 병렬 4건: 모두 180초 timeout, code 143
- 같은 결과를 500이나 내용 검증으로 오인하지 않고 4건 전부 폐기

### 채택

파일 탐색을 제거하고 본문의 핵심 주장만 bounded assertion set으로 전달했다.

- Agent: `[claude-code:sonnet · L1 · $0.0000 · 17446ms]`, PASS
- Context: `[claude-code:sonnet · L1 · $0.0000 · 11703ms]`, PASS
- MCP: `[claude-code:sonnet · L1 · $0.0000 · 18725ms]`, PASS
- Harness: `[claude-code:sonnet · L1 · $0.0000 · 22693ms]`, PASS

Claude는 네 set의 사실·프로토콜·논리 오류를 0개로 판정했다. MCP 검증에서는 current
transport, lifecycle, primitives, tool error와 OAuth 2.1 기반 authorization 범위를
독립적으로 확인했다.

## 작은 모델용 재현 절차

4B/9B 모델에는 네 파일이나 전체 대화를 한 번에 넣지 않는다. 먼저 경로 IR을 고정한다.

```yaml
path:
  order: [agentic-patterns, context-engineering, mcp-protocol, llm-harness]
article:
  owns: one concrete system question
  receives: prior output state
  hands_off: one unresolved question
section:
  question: failure or decision
  causal_chain: [input, transform, check, output]
  source:
    url: primary source
    claim_scope: exact supported claim
    revision: date or protocol version
    must_not_generalize: unsupported extension
  viz:
    control: reader input
    state_change: visible causal change
    invariant: conclusion proved by the change
  formula:
    needed: true or false
    operation_reason: why OR, AND, sum, normalize or reduce
    korean_annotation: every semantic term
quality_gate:
  hidden_challenge_covered: true
  jargon_defined_before_use: true
  source_scope_match: true
  formula_note_paired: true
  mobile_overflow: false
  next_link_valid: true
```

작업 단위도 좁힌다.

1. **Route**: 최신 목표 질문 하나와 필요한 기반만 고르고 stop rule을 쓴다.
2. **Extract**: 원문 하나에서 claim/scope/revision/반례만 추출한다.
3. **Draft**: 한 section을 `질문 -> 관찰 -> mechanism -> failure -> decision` 순서로 쓴다.
4. **Jargon pass**: 처음 등장하는 전문 용어를 쉬운 예와 기술 정의로 두 번 설명한다.
5. **Formula pass**: 연산이 판단을 압축할 때만 쓰고 모든 term과 operation reason을 한국어로 붙인다.
6. **Viz pass**: control을 바꿨을 때 state와 결론이 실제로 바뀌는지 검사한다.
7. **Challenge pass**: 숨은 난도 문제를 풀며 본문 밖 전제가 나오면 해당 owner 글만 보강한다.
8. **Deterministic QA**: route, source, KaTeX pairing, overflow, keyboard, console과 interaction을 코드로 검사한다.
9. **Independent audit**: reviewer에는 전체 파일 대신 assertion set만 주고 맞음/수정만 받는다.

작은 모델의 가장 흔한 실패는 네 책임을 한 “agent” 문단에 섞는 것, 최신 framework
목록으로 새는 것, protocol과 application policy를 혼동하는 것이다. `owns`,
`stops_before`, `hands_off`를 생성 전에 고정하면 이 범위를 좁힐 수 있다.

## 검증

- `npm run build`: PASS, 9,248 modules
- `npx tsc --noEmit`: PASS
- Target ESLint: PASS
- `git diff --check`: PASS
- 학습 흐름 감사: 네 slug 모두 score 0, issues 0
- 로컬 Agent path Playwright: 14/14
- 로컬 공통 formula regression: 6/6
- 운영 Agent path Playwright: 14/14
- 운영 공통 formula regression: 6/6
- Viewport: 390x844, 768x1024, 1440x900
- 직접 screenshot 검사: desktop card 단어 분절을 발견하고 공용 FlowRow 수정 후 재검사
- Claude accepted audit: 4/4 PASS, confirmed issue 0

## 운영 배포

- `cm-blog.service`: 2026-07-23 21:46:04 KST 재시작, active
- 운영 route: 네 slug 모두 HTTP 200
- 운영 entry: `/lab/assets/index-6mdslWLn.js`
- 운영 style: `/lab/assets/index-WXyTU67k.css`
- 운영 경로: `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai?sub=ai-agents`

이 기록은 Agent 핵심 경로 milestone의 release evidence다. 전체 블로그의 남은
release blocker와 enrichment backlog가 완료됐다는 뜻은 아니다.
