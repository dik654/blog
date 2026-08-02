# claw-mcp vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 MCP 통합을 **3개 모듈 + 11단계 lifecycle 상태머신** 으로 설명한다.

- 3계층 구조: `McpLifecycleValidator` → `McpStdioProcess` → `McpToolRegistry`
- `mcp_tool_bridge.rs` (406 LOC, PARITY 명시) 가 server status, resource list, resource read, tool list, tool dispatch ack, auth state, disconnect 추적
- Transport: **stdio JSON-RPC 2.0 only** — `command + args + env` 로 spawn
- 4종 메시지: 요청/응답/에러/알림
- 7개 메서드: `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `sampling/createMessage`
- 네임스페이스: `mcp__{server}__{tool}`
- 인사이트: "stdio 통신 오버헤드 호출당 ~5ms"

## 원본 Claude Code 실제 동작

원본 MCP 는 **풀 SDK 통합 + 다중 transport + 인증 풀스택 + UI 와이어링**, 12,300+ LOC.

### `src/services/mcp/` (12,310 LOC) — 핵심 클라이언트

| 파일 | LOC | 역할 |
|---|---|---|
| `client.ts` | 3348 | MCP 클라이언트 메인 — `@modelcontextprotocol/sdk` 직접 사용, multi-transport |
| `auth.ts` | 2465 | OAuth 2.0, dynamic client registration, PKCE, token refresh, 401 retry |
| `config.ts` | 1578 | settings.json 파싱, env expansion, server import (Claude Desktop migration) |
| `useManageMCPConnections.ts` | 1141 | React hook — connection lifecycle 관리, 재연결 정책 |
| `utils.ts` | 575 | URL 파싱, base URL safe logging, header 처리 |
| `xaa.ts` | 511 | xaa 통합 (특정 IDP) |
| `xaaIdpLogin.ts` | 487 | IDP login flow |
| `channelNotification.ts` | 316 | 서버 → client notification routing |
| `elicitationHandler.ts` | 313 | 서버가 사용자에게 input 요청 (elicit) 처리 |
| `types.ts` | 258 | 공유 타입 |
| `channelPermissions.ts` | 240 | 채널별 권한 |
| `claudeai.ts` | 164 | claude.ai 호스팅 MCP 통합 |
| `headersHelper.ts` | 138 | 헤더 합성 (auth, telemetry, user-agent) |
| `SdkControlTransport.ts` | 136 | SDK control transport |
| `vscodeSdkMcp.ts` | 112 | VSCode 확장과의 SDK MCP |
| `mcpStringUtils.ts` | 106 | 이름 sanitize / build |
| `oauthPort.ts` | 78 | localhost OAuth callback port allocation |
| `channelAllowlist.ts` | 76 | allowlist |
| `MCPConnectionManager.tsx` | 72 | 글로벌 connection manager |
| `officialRegistry.ts` | 72 | 공식 MCP 레지스트리 (Anthropic 큐레이션) |
| `InProcessTransport.ts` | 63 | 같은 프로세스 안에서 MCP 서버 실행 |
| `envExpansion.ts` | 38 | `${ENV}` 치환 |
| `normalization.ts` | 23 | 이름 정규화 |

### 외부 도구·UI·유틸 (2000+ LOC 추가)

- `tools/MCPTool/MCPTool.ts` — MCP 도구를 claude tool 로 노출
- `tools/McpAuthTool/McpAuthTool.ts` — `/mcp auth` 슬래시
- `tools/ListMcpResourcesTool/`, `tools/ReadMcpResourceTool/` — 리소스 도구
- `commands/mcp/mcp.tsx` — `/mcp` 슬래시 명령
- `cli/handlers/mcp.tsx` — CLI subcommand `claude mcp ...`
- `entrypoints/mcp.ts` — `claude mcp serve` (claude 자체가 MCP 서버 노출)
- `components/mcp/` — 9개 UI 컴포넌트 (List, ToolDetail, ParsingWarnings, ListPanel, Settings, StdioServerMenu, RemoteServerMenu, AgentServerMenu, Reconnect)
- `components/MCPServerApprovalDialog.tsx`, `MCPServerDesktopImportDialog.tsx`, `MCPServerMultiselectDialog.tsx`, `MCPServerDialogCopy.tsx` — server approval UX
- `services/mcpServerApproval.tsx` — 서버 승인 정책
- `hooks/notifs/useMcpConnectivityStatus.tsx` — 연결 상태 알림
- `migrations/migrateEnableAllProjectMcpServersToSettings.ts` — 마이그레이션
- `utils/mcpOutputStorage.ts` — 큰 출력 디스크 저장 (binary blob, format description, large output instructions)
- `utils/mcpValidation.ts` — MCPToolResult 검증, 컨텐츠 truncation
- `utils/mcpInstructionsDelta.ts` — 서버 instructions 변경 감지
- `utils/mcpWebSocketTransport.ts` — WebSocket transport (mTLS 지원)
- `utils/plugins/mcpPluginIntegration.ts`, `mcpbHandler.ts` — plugin → MCP 통합
- `utils/claudeInChrome/mcpServer.ts`, `utils/computerUse/mcpServer.ts` — 내장 MCP 서버 2종
- `skills/mcpSkillBuilders.ts`, `skills/mcpSkills.ts` (MCP_SKILLS feature) — MCP 서버에서 skill fetch

### 핵심 차이 메커니즘

1. **다중 Transport** — claw 는 stdio only. 원본은 `@modelcontextprotocol/sdk` 의 4 transport 모두 사용:
   - `StdioClientTransport` — local subprocess
   - `SSEClientTransport` — Server-Sent Events
   - `StreamableHTTPClientTransport` — streamable HTTP
   - `WebSocketTransport` (custom in `utils/mcpWebSocketTransport.ts`) — WebSocket + mTLS
   - `InProcessTransport` — 같은 process 안에서 직접 연결 (claude-in-chrome, computerUse 같은 내장 서버용)

2. **OAuth 2.0 풀스택** (`auth.ts` 2465 LOC) — Dynamic Client Registration (DCR), PKCE, authorization code flow, token refresh, 401 retry with refresh, claude.ai 통합 OAuth, xaa IDP login. claw 의 `McpAuth` 는 단순 stub.

3. **Elicitation** (`elicitationHandler.ts` 313 LOC) — 서버가 client/user 에게 input 요청 (예: 폼). client 가 사용자에게 prompt 를 띄워 받은 값을 서버에 회신. MCP spec 의 `elicit/create` 메서드. claw 에 없음.

4. **Sampling** — 블로그가 메서드 목록에 `sampling/createMessage` 를 적었지만 claw 구현은 미언급. 원본은 서버가 client 에게 LLM 호출 요청 → client 가 자기 모델로 호출해서 결과 회신 (역방향 LLM 호출).

5. **Server Approval UX** — 새 MCP 서버를 처음 보면 사용자에게 승인 다이얼로그 (`MCPServerApprovalDialog`). 한 번 승인하면 settings 에 저장. claw 는 settings 신뢰만 하고 spawn.

6. **Resource Subscriptions / Notifications** — `channelNotification.ts` (316 LOC) 가 서버 → client 알림 routing. progress, log, resource changed 같은 push event. claw 는 ack 만.

7. **Output truncation + binary storage** (`utils/mcpOutputStorage.ts`, `mcpValidation.ts`) — 큰 결과는 디스크에 저장 후 reference 만 컨텍스트에 넣음. binary blob (이미지 등) 처리. claw 는 raw passthrough.

8. **Settings import / migration** (`config.ts` 1578) — Claude Desktop 의 `claude_desktop_config.json` import, project-scope vs user-scope vs local-scope 머지, `${ENV_VAR}` expansion, deprecated field migration.

9. **Reconnection / Health** — `useManageMCPConnections.ts` (1141) 와 `MCPReconnect.tsx` 컴포넌트 — 연결 끊김 감지, exponential backoff 재연결, 사용자에게 상태 표시. claw 는 spawn 후 죽으면 그대로 죽음.

10. **CLI/`claude mcp ...` subcommand** — `claude mcp add/remove/list/serve/auth` 등 풀 CLI. claw 는 `/mcp` 슬래시만.

11. **`claude mcp serve` — Claude 가 MCP 서버 역할** — `entrypoints/mcp.ts` 가 Claude 자체를 MCP 서버로 expose. 다른 MCP client 가 Claude 를 도구처럼 호출 가능. claw 에 없음.

12. **Plugin → MCP 통합** — plugin 시스템이 MCP 서버를 묶어서 배포 가능 (`mcpbHandler.ts` 의 `.mcpb` plugin bundle, `mcpPluginIntegration.ts`). claw 는 plugin 따로, MCP 따로.

13. **MCP Skills** (`MCP_SKILLS` feature) — 서버가 skill 을 expose 하면 client 가 가져와서 자기 skill 풀에 합침. claw 에 없음.

14. **Code Indexing 자동 감지** (`detectCodeIndexingFromMcpServerName`) — 특정 서버 이름이면 indexing 모드 자동 활성. 휴리스틱.

15. **mTLS / proxy** — WebSocket transport 가 mTLS 옵션 지원, HTTP fetch 는 corporate proxy 지원 (`getProxyFetchOptions`). claw 는 plain stdio.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | mcp_tool_bridge.rs 406 LOC + 2 보조 | services/mcp 12,310 + tools/MCP* 600 + components/mcp 1500 + commands/mcp 200 + utils/mcp* 1500 + plugins/mcp* 400 ≈ 16,500 LOC | 단순화 (40배 차이) |
| Transport | stdio only | stdio + SSE + StreamableHTTP + WebSocket(mTLS) + InProcess (5종) | 단순화 (4종 누락) |
| 인증 | stub (`McpAuth`) | OAuth 2.0 DCR + PKCE + token refresh + 401 retry + claude.ai integration + xaa IDP (2465 LOC) | 누락 |
| Elicitation | 없음 | 서버 → 사용자 input 요청 (`elicit/create`) 풀 핸들러 | 누락 |
| Sampling | 메서드 목록에만 언급 | 서버 → client LLM 호출 (역방향) 실제 구현 | 누락 |
| Server Approval | 없음 (settings 신뢰) | 첫 등장 시 승인 다이얼로그, multi-server 선택, Desktop import dialog | 누락 |
| Notifications | 없음 (ack 만) | progress / log / resource-changed routing (`channelNotification.ts` 316) | 누락 |
| Reconnection | 죽으면 그대로 | exponential backoff + 상태 알림 + manual reconnect UI (`MCPReconnect`, `useMcpConnectivityStatus`) | 누락 |
| Output storage | raw passthrough | 큰 출력 → 디스크 reference, binary blob 처리, image 다운샘플 | 누락 |
| Settings 머지 | 단일 settings 읽기 | user/project/local scope + Desktop config import + env expansion + migration (1578 LOC) | 단순화 |
| Lifecycle 단계 | "11단계 상태머신" | SDK Client 가 관리 + connection-manager hook 의 다단 retry/health/auth refresh | 다른 메커니즘 |
| Plugin 통합 | 없음 | `.mcpb` plugin bundle, plugin 이 MCP 서버 묶어서 배포 | 누락 |
| MCP Skills | 없음 | `MCP_SKILLS` feature — 서버에서 skill fetch | 누락 |
| Internal MCP servers | 없음 | claude-in-chrome MCP server, computerUse MCP server (내장) | 누락 |
| `claude mcp serve` | 없음 | Claude 자체를 MCP 서버로 expose — 다른 client 가 호출 | 누락 |
| CLI subcommand | `/mcp` 슬래시만 | `claude mcp add/remove/list/serve/auth ...` | 누락 |
| UI 컴포넌트 | 없음 | 9개 list/detail/menu/reconnect 컴포넌트 + 4개 dialog | 누락 |
| Code indexing 감지 | 없음 | 서버 이름 휴리스틱으로 indexing 모드 자동 활성 | 누락 |
| Network policy | plain stdio | mTLS, corporate proxy, WebSocket TLS opts | 누락 |

## 블로그 보강 제안

블로그가 MCP 의 표준 의의는 잘 잡았지만, claw 의 **registry-bridge 깊이** 와 원본의 **풀 lifecycle/transport/UX** 차이를 분리하면 훨씬 정확해진다.

1. **Overview 도입부 callout** — "claw-mcp 는 PARITY 가 명시한대로 'registry bridge' 깊이. 원본은 5종 transport, OAuth 2.0 풀스택, elicitation/sampling/notification, server approval UX, reconnection, plugin 통합, MCP-as-server expose 등 lifecycle 전반을 포함" 한 단락.

2. **Transport 다이어그램 보강** — claw 는 stdio 하나. 원본은 stdio + SSE + StreamableHTTP + WebSocket(mTLS) + InProcess. 5종을 나란히 그리면 차이가 시각적으로 명확.

3. **Auth 섹션 신설** — `auth.ts` 2465 LOC 는 그 자체로 큰 챕터감. OAuth 2.0 DCR + PKCE flow 그림 + claude.ai 통합. claw 의 `McpAuth` stub 과 대비.

4. **Elicitation/Sampling/Notification 한 섹션** — MCP spec 의 양방향성을 보여주는 핵심. claw 는 client → server 만, 원본은 server → client (elicit, sampling, progress) 도 처리.

5. **`claude mcp serve` 인사이트 callout** — "Claude 자체가 MCP 서버 역할도 함" 은 흥미로운 아키텍처 결정. claw 에는 없는 dimension.

6. **Plugin × MCP 표** — `.mcpb` plugin bundle 과 plugin 안에 묶인 MCP 서버. plugin 글과 cross-link.

7. **Server Approval UX 한 섹션** — "settings 에 적힌 서버 = 무조건 spawn" 은 보안 위협 (악성 설정 공유 등). 원본의 first-run approval dialog 와 multi-server select dialog 가 어떤 위협을 막는지.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/services/mcp/client.ts` (3348)
- `/home/heru/code/claude-analysis/src/services/mcp/auth.ts` (2465, OAuth 2.0)
- `/home/heru/code/claude-analysis/src/services/mcp/config.ts` (1578, settings/env/import)
- `/home/heru/code/claude-analysis/src/services/mcp/useManageMCPConnections.ts` (1141)
- `/home/heru/code/claude-analysis/src/services/mcp/elicitationHandler.ts` (313)
- `/home/heru/code/claude-analysis/src/services/mcp/channelNotification.ts` (316)
- `/home/heru/code/claude-analysis/src/services/mcp/InProcessTransport.ts`, `SdkControlTransport.ts`
- `/home/heru/code/claude-analysis/src/utils/mcpWebSocketTransport.ts` (WebSocket + mTLS)
- `/home/heru/code/claude-analysis/src/utils/mcpOutputStorage.ts`, `mcpValidation.ts`
- `/home/heru/code/claude-analysis/src/components/mcp/*` (9 components)
- `/home/heru/code/claude-analysis/src/entrypoints/mcp.ts` (claude mcp serve)
- `/home/heru/code/claude-analysis/src/cli/handlers/mcp.tsx`, `commands/mcp/mcp.tsx`
- `/home/heru/code/claude-analysis/src/utils/plugins/mcpPluginIntegration.ts`, `mcpbHandler.ts`
- `/home/heru/code/claude-analysis/src/skills/mcpSkillBuilders.ts`, `mcpSkills.ts`
- `/home/heru/code/claw-code/PARITY.md` Lane 7 — "registry bridge ... end-to-end MCP runtime depth still depend on the wider MCP runtime"
