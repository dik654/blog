# Agent system core learning path content spec

## Goal
- 독자가 `Agent loop -> Context packet -> MCP boundary -> Harness runtime`을 서로 다른 네 책임으로 구분하고, 한 요청이 실제 side effect와 검증 증거로 닫히는 전 과정을 설계하게 한다.
- 네 글만 읽고도 고정 workflow와 agent를 선택하고, 필요한 context를 선별하고, MCP 메시지와 오류 층을 추적하고, 실패를 소유 component의 regression test로 바꾸게 한다.

## Hidden challenge

다음 문제는 본문에 시험 문제로 노출하지 않는다. 네 글의 깊이를 판정하는 내부 기준으로 사용한다.

> 여러 시간에 걸쳐 저장소를 수정하는 고객지원 agent를 설계한다. Agent는 정책과 주문을 조회하고, 코드 patch를 만들고, 테스트를 실행하며, 50달러 이하 환불만 자동 commit할 수 있다. Retrieval 문서 하나는 오래됐고, MCP server는 current protocol과 legacy HTTP+SSE를 함께 언급하며, tool timeout이 간헐적으로 난다. Context window가 끝나도 다음 session이 재개해야 한다. 어떤 단계가 model, context builder, protocol, policy, executor, reducer의 책임인지 나누고, 권한 우회·무한 retry·stale evidence·protocol mismatch·진행 유실을 막는 state, message, trace와 release invariant를 설계하라.

통과 기준:
- Workflow와 agent를 자율성이라는 인상으로 나누지 않고, 관찰 이후 경로 선택권으로 나눈다.
- 다음 turn에 넣을 context를 권위·관련성·최신성·token budget으로 선별한다.
- MCP의 initialize, capability negotiation, discovery, invocation과 result를 구분하고 protocol error와 tool execution error를 혼동하지 않는다.
- Model output은 commit이 아니라 proposal/event이며 policy와 deterministic reducer를 거친다.
- Long-running task는 transcript가 아니라 checkpoint, artifact와 검증 결과로 재개한다.
- 최종 답변 점수와 forbidden side effect, task success, latency/cost release gate를 분리한다.

## Article ownership and stop rules

| Order | Article | Owns | Stops before |
|---|---|---|---|
| 1 | `agentic-patterns` | Workflow/agent 경계, ReAct state loop, 계획·반성·종료, multi-agent 분해 기준 | Context 선별 알고리즘, wire protocol, runtime 구현 |
| 2 | `context-engineering` | Turn packet, instruction hierarchy, evidence-set RAG, memory lifecycle, token admission | MCP transport, tool execution, system-wide release |
| 3 | `mcp-protocol` | Host/client/server 역할, server primitives, client capabilities, lifecycle, transport, 오류 층과 auth | Agent planning, prompt 최적화, application retry policy |
| 4 | `llm-harness` | Admission, dispatcher, policy, executor, reducer, checkpoint, trace, eval/release | Prompt-injection 세부 방어, eval dashboard 구현 |

네 글은 합치지 않는다. 독립적으로 답해야 하는 질문과 실패 소유자가 다르다. 대신 각 글 마지막에 다음 글에서 넘겨받을 state와 해결할 미해결 질문을 명시한다.

## Source anchors

| Area | Primary source | Why it matters |
|---|---|---|
| Agent boundary | Anthropic, *Building effective agents* | Workflow와 agent의 제어 차이, 단순한 구성에서 확장하는 원칙 |
| Agent loop | Yao et al., *ReAct* | Reasoning과 environment action/observation을 교차하는 원형 |
| Context | Anthropic, *Effective context engineering for AI agents* | Context를 제한된 자원으로 선별·관리하는 현재 실무 관점 |
| MCP core contract | MCP Specification `2026-07-28` | 요청 단위 capability negotiation, stateless core와 long-running task handle의 경계 |
| MCP transport | MCP Transports `2026-07-28` | Current stdio/Streamable HTTP, server discovery와 legacy sessionful 구현의 정확한 경계 |
| MCP primitives | MCP server/client concept docs | Tools/resources/prompts와 sampling/elicitation/roots의 제어 주체 |
| Harness | Anthropic long-running harness articles | Session 간 progress, checkpoint, incremental worker의 실제 패턴 |
| Harness | OpenAI, *Harness engineering* | Repository legibility, isolated environment와 feedback loop 사례 |
| Trace | OpenAI Agents SDK tracing docs | Run/turn/model/tool/guardrail/handoff span의 구현 가능한 예 |

## Full-scope map

| Topic | Must cover | Depth | Article | Risk if omitted |
|---|---|---|---|---|
| Workflow vs agent | 관찰 뒤 경로가 바뀌는지로 선택 | deep | `agentic-patterns` | Tool 사용 여부만으로 agent를 과잉 설계한다. |
| ReAct loop | state/proposal/observation/transition/verify | deep | `agentic-patterns` | 생각 문구를 architecture로 오해한다. |
| Planning/reflection | 작은 작업 단위, evidence diff, replan | deep | `agentic-patterns` | 고정 계획·자가 비평 loop가 된다. |
| Multi-agent | separability, verifier, least privilege, merge cost | brief | `agentic-patterns` | 역할 이름만 늘리고 오류 공간을 키운다. |
| Context packet | 권위, 관련성, 최신성, provenance, budget | deep | `context-engineering` | Transcript dump를 memory로 오해한다. |
| Instruction hierarchy | trusted instruction과 untrusted evidence 분리 | deep | `context-engineering` | 검색 문서가 policy가 된다. |
| RAG evidence set | claim-source span, date, confidence, conflict | deep | `context-engineering` | top-k chunk를 곧 정답으로 본다. |
| Memory lifecycle | write/read/refresh/expire/forget | deep | `context-engineering` | 오류와 민감정보가 영구 누적된다. |
| MCP architecture | host/client/server, data/transport layer | deep | `mcp-protocol` | Protocol과 application runtime을 섞는다. |
| MCP lifecycle | initialize -> initialized -> list/call/result | deep | `mcp-protocol` | Negotiation 전 capability를 사용한다. |
| MCP control | tools/resources/prompts와 client capabilities | deep | `mcp-protocol` | Server가 모든 권한을 소유한다고 본다. |
| Current transport | stdio, Streamable HTTP, legacy SSE | deep | `mcp-protocol` | 폐기된 transport를 current option으로 가르친다. |
| Error taxonomy | protocol vs tool result error | deep | `mcp-protocol` | 정상 연결을 끊거나 실패 결과를 성공으로 쓴다. |
| Harness state machine | admission/context/dispatch/policy/execute/reduce | deep | `llm-harness` | Model text가 직접 side effect를 만든다. |
| Trace/eval/release | state diff, owner, paired rerun, invariant gates | deep | `llm-harness` | Prompt 수정만 반복하고 회귀를 못 잡는다. |
| Long-running work | checkpoint, artifact, restart replay | deep | `llm-harness` | Context compaction 뒤 진행이 사라진다. |
| Security details | prompt injection data-flow defense | defer | `prompt-injection-defense` | 이 경로가 지나치게 넓어진다. |
| Eval operations | failure inbox, repeated trials, dashboard | defer | `agent-evaluation-trace` | Harness 글이 운영 UI까지 중복한다. |

## Narrative contract

1. `agentic-patterns`는 “다음 행동을 누가 고르는가?”로 시작해 loop가 매 turn 판단 packet을 필요로 한다는 질문을 넘긴다.
2. `context-engineering`은 “무엇을 보고 고르는가?”를 답하고, 선택한 근거를 tool boundary로 어떻게 전달하는지 MCP에 넘긴다.
3. `mcp-protocol`은 “어떤 계약으로 외부 capability와 왕복하는가?”를 답하고, protocol만으로 권한·retry·완료를 보장하지 못한다는 빈자리를 harness에 넘긴다.
4. `llm-harness`는 “제안이 언제 실제 commit과 release가 되는가?”를 state, policy, evidence와 eval로 닫는다.

반복하는 불변식:
- Model confidence는 authorization이 아니다.
- 외부 text는 instruction이 아니라 evidence다.
- 성공 응답은 task 완료 증거가 아니다.
- 다음 state는 transcript 재해석이 아니라 versioned event reduction으로 만든다.

## Visualization contracts

### `AgentLoopLab`
- Step 0: 정책 조회, 환불 판단, 코드 수정 시나리오를 고른다.
- Step 1: 각 업무의 관찰·결정·실행·검증 경로가 바뀐다.
- Step 2: Workflow, Agent loop, Harnessed agent 중 최소 제어 구조를 판정한다.
- Proves: Tool 유무가 아니라 결과 이후 경로 선택과 작업 길이가 architecture를 결정한다.

### `ContextPacketLab`
- Step 0: 전체 log, 현재 state, policy, tool result, 근거 문서와 memory가 보인다.
- Step 1: 전략과 4k/8k/16k budget을 바꾸면 packet 포함 항목과 token meter가 갱신된다.
- Step 2: overflow, stale contamination, missing evidence 또는 executable outcome을 판정한다.
- Proves: 더 많은 context가 항상 더 좋은 것이 아니며 model 호출 전 admission이 필요하다.

### `McpRoundTripLab`
- Step 0: 정상, version mismatch, tool error 사례를 고른다.
- Step 1: Initialize부터 result까지 실제 JSON-RPC 메시지를 탭/키보드로 추적한다.
- Step 2: Protocol failure와 tool execution failure가 서로 다른 층에서 닫힌다.
- Proves: MCP는 tool catalog가 아니라 lifecycle과 capability negotiation을 가진 protocol이다.

### `HarnessControlLab`
- Step 0: 고위험 행동, timeout, 긴 작업 인계를 고른다.
- Step 1: Policy gate, retry budget, trace/checkpoint를 켜고 끈다.
- Step 2: Commit side effect, 최초 실패 소유자와 release 결과가 바뀐다.
- Proves: 같은 model proposal도 runtime control에 따라 안전한 이관 또는 무단 변경이 된다.

Responsive contract:
- 390px에서 가로 스크롤 없이 모든 label과 code가 줄바꿈된다.
- 고정 px 폭을 두지 않고 `minmax(0, 1fr)`, `min-w-0`, `whitespace-pre-wrap`을 사용한다.
- 768px에서는 비교 항목이 2열 이하로 유지되고, 1440px에서 과도한 빈 공간 없이 4~5개 단계가 한 행에 보인다.
- 선택, hover, focus, `aria-selected`/`aria-pressed`, keyboard arrow/home/end 상태를 제공한다.

## Formula contract

- Agent 종료, context budget, runtime reducer와 release gate에만 수식을 쓴다.
- 모든 수식의 연산 단위에는 한국어 `\underbrace{...}_{\text{...}}`를 붙인다.
- 수식 바로 아래 `FormulaNote`가 기호뿐 아니라 왜 OR/AND/합/reducer를 쓰는지 설명한다.
- 수학이 mechanism을 더 명확히 하지 않는 MCP lifecycle에는 수식을 억지로 넣지 않는다.
- 390px에서 수식 박스 밖으로 나가지 않아야 하며, 공통 math wrapper가 scale/wrap 또는 horizontal fallback을 책임진다.

## Verification

- `npm run audit:learning-flow`: 네 slug의 source, visual, formula, handoff gap이 0인지 확인한다.
- Targeted TypeScript/ESLint: 새 wrapper와 `AgentSystemLabs.tsx` 오류가 없어야 한다.
- Playwright 390x844, 768x1024, 1440x900:
  - article 영역 material overflow 0
  - Viz 상호작용과 상태 변화 확인
  - MCP tab keyboard 이동 확인
  - KaTeX와 `FormulaNote` pairing 확인
  - 다음 글 링크가 실제 route로 연결되는지 확인
- Desktop/mobile screenshot을 직접 검사해 겹침, 잘림, 지나치게 작은 글자, 과도한 공백과 장식적 색 사용을 수정한다.
- Context Manager Claude 검증은 네 글을 독립 worker로 나눈다. `claude-code:sonnet` header가 없는 500/timeout/fallback 응답은 근거로 채택하지 않는다.

## Small-model reconstruction record

4B/9B 모델이 같은 작업을 반복할 때는 긴 대화를 넘기지 않고 다음 IR만 전달한다.

```yaml
path:
  order: [agentic-patterns, context-engineering, mcp-protocol, llm-harness]
article_contract:
  owns: one core question
  receives: prior article output state
  hands_off: one unresolved system question
section:
  question: concrete failure or decision
  causal_chain: [input, transform, check, output]
  source: {url, claim_scope, date_or_version}
  viz: {control, visible_transition, invariant}
  formula: {needed, korean_annotation, operation_reason}
quality_gate:
  hard_challenge_covered: true
  jargon_defined_before_use: true
  source_claim_scope_match: true
  mobile_overflow: false
  next_link_valid: true
```

작은 모델에는 한 번에 한 article contract만 주고 `draft -> source-claim check -> jargon pass -> viz handoff -> hard-challenge coverage`를 순차 실행한다. 마지막 verifier만 네 글의 handoff와 중복을 함께 본다.
