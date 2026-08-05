# MCP client/server execution boundary content spec

## Goal
- 독자가 Claw가 외부 MCP server를 소비하는 client 경로와 `claw mcp serve`로 자체 도구를 노출하는 server 경로를 반대로 그릴 수 있게 한다.
- 설정의 여섯 transport descriptor, 현재 stdio-only manager, discovery·qualified route·degraded startup, frame·retry, lifecycle validator의 실제 경계를 소스로 증명한다.

## Target question
- HTTP MCP 설정이 존재하고 `McpClientTransport::Http`까지 만들어지는데, 왜 현재 CLI에서 remote server tool이 실행되지 않는가?
- stdio `tools/call`이 timeout 났을 때 같은 작업을 즉시 재전송하지 않으면서 다음 호출은 다시 살아날 수 있는가?
- `McpLifecycleValidator`와 실제 CLI `RuntimeMcpState`는 어떤 관계이며, `claw mcp serve`는 화살표를 어떻게 뒤집는가?

## Source anchors
| Area | File/function/type | Why it matters |
|---|---|---|
| descriptor | `runtime/src/mcp_client.rs` / `McpClientTransport` | 설정이 표현하는 여섯 transport와 stdio timeout |
| naming | `runtime/src/mcp.rs` / `mcp_tool_name` | server와 raw tool을 전역 qualified name으로 묶는 규칙 |
| client runtime | `runtime/src/mcp_stdio.rs` / `McpServerManager` | 실제 stdio discovery, route, call, resource, reset |
| framing | `runtime/src/mcp_stdio.rs` / `McpStdioProcess` | Content-Length, JSON-RPC version/id validation |
| lifecycle | `runtime/src/mcp_lifecycle_hardened.rs` / `McpLifecycleValidator` | 11개 phase와 복구 가능성 기록 |
| CLI integration | `rusty-claude-cli/src/main.rs` / `RuntimeMcpState` | startup discovery, runtime tool·permission, dispatch |
| server direction | `runtime/src/mcp_server.rs`, CLI `run_mcp_serve` | Claw built-in tool을 stdio MCP server로 노출 |
| auxiliary bridge | `runtime/src/mcp_tool_bridge.rs` / `McpToolRegistry` | tools crate용 registry bridge와 CLI 직접 경로 구분 |

## Full-scope map
| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| two directions | consumer client와 exposing server | deep | CLI + `mcp_server.rs` | 같은 MCP라는 이유로 역할 혼동 금지 |
| transport scope | 6 descriptor, manager는 stdio만 | deep | `mcp_client.rs`, `mcp_stdio.rs` | “지원”의 두 의미 분리 |
| startup | initialize, paginated tools/list, best effort | deep | `McpServerManager` | 한 서버 실패의 blast radius |
| tool surface | qualified name, schema fallback, annotation permission | deep | CLI main | invented ToolExecutor type 금지 |
| wire | Content-Length, sequential request/response, version/id | deep | `McpStdioProcess` | background reader/multiplexing 주장 금지 |
| recovery | initialize/discovery/resource one retry, call no same-call retry | deep | manager helpers | side-effect duplicate risk |
| lifecycle | exact 11 phases, optional resource discovery, recovery rule | deep | hardened validator | 실제 subprocess engine으로 표현 금지 |
| registry bridge | actual sync registry and manager handoff | brief | `mcp_tool_bridge.rs` | CLI direct path와 분리 |
| broad MCP spec | elicitation/sampling/prompts | defer | not implemented here | 이 revision의 구현 글 범위 밖 |

## Reader prerequisites
- JSON-RPC request id: 요청과 응답을 같은 작업으로 확인하는 식별자.
- stdio child process: 부모가 자식 프로세스의 표준 입력과 출력을 통신 선으로 쓰는 방식.
- JSON Schema: tool argument의 field와 type을 모델에게 알려 주는 구조.
- idempotency: 같은 요청을 반복해도 부작용이 한 번과 같은 성질. tool call에는 보장되지 않는다.

## Section narrative
1. 두 방향: client manager와 server를 먼저 분리한다.
2. transport boundary: config 표현과 executable runtime을 분리한다.
3. client runtime: discovery 결과가 qualified runtime tool이 되는 과정을 추적한다.
4. framing/recovery: message boundary와 오류 뒤의 retry 차이를 설명한다.
5. lifecycle contract: 실행 엔진이 아닌 검증 어휘라는 한계를 고정한다.
6. server direction: `claw mcp serve`로 화살표를 뒤집고 실제 세 method에서 멈춘다.

## Viz plan
- 하나의 `McpRuntimeLab`에서 다섯 시나리오를 전환한다.
- stdio consume: config → spawn → initialize/list → qualified tool.
- remote config: Http descriptor → bootstrap → unsupported manager → pending.
- degraded: A 성공, B 실패 → A tool 유지 + B report.
- timeout: route → call → timeout → reset, same-call retry 없음.
- serve: external client → Claw server → 세 method → `execute_tool`.
- 모든 stage는 모바일에서 세로 rail, desktop에서 가로 단계로 바뀌며 내부 horizontal scroll을 만들지 않는다.

## Adversarial checks
- “McpClientTransport에 Http가 있으므로 CLI가 HTTP MCP를 호출한다”를 반박할 수 있는가?
- “request id가 있으므로 여러 응답을 background reader가 병렬 demux한다”를 반박할 수 있는가?
- “timeout이면 tools/call을 한 번 자동 재시도한다”를 반박할 수 있는가?
- “11단계 validator가 실제 manager의 state machine이다”를 반박할 수 있는가?
- “claw mcp serve는 resource와 sampling까지 제공한다”를 반박할 수 있는가?

## Coverage recheck
| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| descriptor/runtime split | transport boundary | none | six rows + remote scenario |
| discovery/routing/permission | client runtime | none | source-derived conditions |
| frame/id/retry | framing/recovery | none | same-call retry nuance |
| exact lifecycle | lifecycle contract | none | 11 phase grid |
| reverse server direction | server direction | none | exact methods and protocol version |
| broader MCP features | deferred | intentional | stop rule states boundary |
