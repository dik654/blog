# claw-tool-system vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 도구 시스템을 **40 ToolSpec + 단일 match dispatch + 6 OnceLock registry** 로 설명한다.

- `ToolSpec { name: &'static str, description: &'static str, input_schema: Value, required_permission: PermissionMode }` 4 필드
- `mvp_tool_specs()` → `Vec<ToolSpec>` 40개 빌트인
- 10 카테고리: 파일 I/O, 검색, 실행, UI, 태스크, 팀, 크론, 통합(Agent/ToolSearch/Skill/WebFetch/WebSearch), MCP, LSP, 기타
- `GlobalToolRegistry` 3계층: builtin + plugin + runtime, 이름 충돌 검사
- `execute_tool()` — 단일 `match` 문 40 분기, `serde_json::from_value::<T>(input)` 역직렬화
- 6 OnceLock 글로벌 registry: LSP/MCP/Team/Cron/Task/Worker
- 인사이트: "원본 Claude Code 921 도구 모듈, claw 는 40개 핵심에 집중. 도구 추가 = ToolSpec + match arm. LangChain 같은 데코레이터 보일러플레이트 없음"

## 원본 Claude Code 실제 동작

원본은 **42+ 도구 디렉토리, 50,800 LOC, 도구마다 풀 lifecycle 객체** — 각 도구가 자체 prompt/UI/permission/result rendering 모듈을 가짐.

### `src/tools/` 구조 — 42 디렉토리

| 디렉토리 | 주요 파일 | 비고 |
|---|---|---|
| AgentTool | AgentTool.tsx 1397, UI.tsx 871, runAgent.ts, forkSubagent.ts, resumeAgent.ts, agentMemory.ts, builtInAgents.ts, loadAgentsDir.ts, agentColorManager.ts | 6072 LOC |
| BashTool | 18 files, BashTool.tsx 1143 | 14,400 LOC (bash 글에서 상세) |
| FileReadTool | FileReadTool.ts, imageProcessor.ts | image 변환, line offset/limit |
| FileEditTool | edit 알고리즘 |  |
| FileWriteTool | write 정책 |  |
| GlobTool | Glob 검색 |  |
| GrepTool | ripgrep wrapper |  |
| AgentTool | 위 |  |
| WebFetchTool | URL 가져오기 + HTML→markdown |  |
| WebSearchTool | 검색 + 결과 정렬 |  |
| ScheduleCronTool | CronCreateTool / CronDeleteTool / CronListTool / prompt.ts | 484 LOC |
| TaskCreateTool / TaskGetTool / TaskListTool / TaskOutputTool / TaskStopTool / TaskUpdateTool | 각각 별도 디렉토리 | 6 separate dirs |
| TeamCreateTool / TeamDeleteTool | 각각 |  |
| TodoWriteTool | TODO 시스템 |  |
| SkillTool | skill 호출 |  |
| MCPTool / ListMcpResourcesTool / ReadMcpResourceTool / McpAuthTool | MCP 4 도구 |  |
| LSPTool | language server |  |
| EnterPlanModeTool / ExitPlanModeTool | plan mode 관리 |  |
| EnterWorktreeTool / ExitWorktreeTool | git worktree | claw 에 없음 |
| AskUserQuestionTool | 사용자 질문 (claw 는 stub) |  |
| RemoteTriggerTool | 원격 trigger (claw 는 stub) |  |
| ConfigTool | 설정 변경 |  |
| ToolSearchTool | deferred tool search |  |
| BriefTool | Brief — claw 에선 execute_tool alias |  |
| PowerShellTool | Windows PowerShell |  |
| REPLTool | python/node REPL |  |
| SleepTool | timing |  |
| SyntheticOutputTool | 테스트용 — claw 의 StructuredOutput 과 다름 |  |
| NotebookEditTool | Jupyter |  |
| SendMessageTool | 에이전트 간 통신 — teammate mailbox |  |
| testing | 내부 테스트 도구 |  |
| utils.ts | 공유 |  |
| shared | 공유 |  |

총 도구 디렉토리 ~42개, **총 LOC ~50,800**.

### 도구 객체의 풍부함

원본 도구는 단순 ToolSpec 이 아니라 다음을 모두 갖춤:

```ts
buildTool({
  name,
  searchHint,           // ToolSearch 분류
  maxResultSizeChars,   // 결과 max
  shouldDefer,          // ToolSearch deferred?
  inputSchema,
  outputSchema,         // 출력도 스키마화
  isEnabled,            // feature flag
  toAutoClassifierInput, // auto mode 분류기 입력
  description: async () => ...,  // 동적 (feature/env 의존)
  prompt: async () => ...,       // 동적 (model/context 의존)
  getPath,              // 결과 저장 경로
  call,                 // 실행
  renderToolUseMessage, // UI: 호출 시
  renderToolResultMessage, // UI: 결과
  renderToolUseProgressMessage, // UI: 스트리밍
  renderToolUseRejectedMessage, // UI: 거부
  checkPermissions,     // 권한 체크 (도구별 커스텀)
  validateInput,        // 입력 검증 (스키마 외)
  ...
})
```

claw 의 ToolSpec 4 필드와 차원이 다른 정보량.

### `mvp_tool_specs()` vs 원본의 도구 풀

PARITY 가 명시: 40 specs. 하지만:

- `Brief` 는 spec 에 없고 `execute_tool()` 안에서 alias 처리 (PARITY 자인)
- claw 의 stub: AskUserQuestion (pending response), RemoteTrigger (stub), TestingPermission (test-only)
- 원본에 있고 claw 에 없는 것: `EnterWorktreeTool` / `ExitWorktreeTool` (git worktree 관리), `SyntheticOutputTool` (테스트), `SendMessageTool` (teammate mailbox 와 진짜 연동), `forkSubagent` 같은 sub-tool

### 핵심 차이 메커니즘

1. **도구 = 객체 vs 도구 = enum 분기** — claw 는 `match name { "bash" => ... }` 큰 분기. 원본은 각 도구가 `Tool` interface 구현 객체. 새 도구 추가 시:
   - claw: ToolSpec 추가 + execute_tool match arm 추가
   - 원본: `tools/MyTool/MyTool.ts` 디렉토리 + `buildTool({...})` + 자동 등록 + UI 컴포넌트 추가

2. **Output Schema** — 원본은 `outputSchema` 도 있어 LLM 에게 출력 형식 보장. claw 는 `Value` 자유 형식.

3. **`isEnabled` feature flag** — 도구마다 `isKairosCronEnabled()` 같은 feature gate. 빌드 환경에 따라 도구 풀이 달라짐. claw 는 항상 40개 고정.

4. **동적 prompt/description** — `description: async () => ...` 가 model, env, feature flag 에 따라 다름. 예: `CronCreate` 의 description 이 `isDurableCronEnabled()` 에 따라 변경. claw 는 `&'static str` 고정.

5. **Tool Search (deferred tools)** — `shouldDefer: true` 인 도구는 처음에 spec 안 보냄. LLM 이 `ToolSearch` 로 찾아서 enable. 컨텍스트 토큰 절약. claw 는 `ToolSearch` 도구 자체는 있지만 동적 deferred 메커니즘은 약함.

6. **Auto Classifier Input** — `toAutoClassifierInput` — auto mode 의 LLM classifier 가 도구 호출을 분류할 때 사용할 텍스트 변환기. claw 에 없음.

7. **Render 함수 5종** — 도구마다 toolUseMessage / toolResultMessage / progressMessage / rejectedMessage 렌더 함수. Ink/React 컴포넌트. claw 는 결과 string 만.

8. **Tool 별 checkPermissions** — `bashPermissions.ts` (2621), `pathValidation.ts`, `modeValidation.ts` 처럼 도구마다 자체 권한 로직. claw 는 단일 PermissionEnforcer 가 spec 의 `required_permission` 만 보고 게이트.

9. **Sub-tool 시스템** — AgentTool 의 `forkSubagent` / `runAgent` / `resumeAgent` 처럼 한 도구 안에 여러 작업. claw 의 단일 Agent 분기와 다름.

10. **`maxResultSizeChars` 도구별** — `CronCreate` 는 100,000 char cap. 도구마다 다름. claw 는 stdout 8KB / stderr 4KB 통일.

11. **`searchHint`** — ToolSearch 가 도구 찾을 때 매칭할 힌트 텍스트. claw 의 ToolSearch 는 spec name/desc 만으로 매칭.

12. **`getPath`** — 도구 결과를 디스크에 영속하는 경로. CronCreate 는 `.claude/scheduled_tasks.json`. claw 는 디스크 영속 거의 없음.

13. **Worktree 관리** — `EnterWorktreeTool` / `ExitWorktreeTool` — git worktree add/remove + cd. 동시 다중 브랜치 작업 지원. claw 에 없음.

14. **AgentTool 의 깊이** — 6072 LOC:
    - `agentMemory.ts` / `agentMemorySnapshot.ts` — agent 별 영속 메모리
    - `builtInAgents.ts` / `loadAgentsDir.ts` — `.claude/agents/` 디렉토리에서 사용자 정의 에이전트 로드
    - `agentColorManager.ts` — 여러 에이전트 동시 실행 시 색깔 구별
    - `forkSubagent.ts` — 부모 컨텍스트 포크
    - `runAgent.ts` / `resumeAgent.ts` — 실행/재개 lifecycle
    - 블로그가 `Agent` 를 한 줄 항목으로 처리하지만 원본은 거대한 sub-system

15. **42 vs 40** — claw 가 40 spec 자랑하지만 실제로 stub 3개 (AskUser/RemoteTrigger/TestingPermission), Brief 는 alias, EnterWorktree/ExitWorktree 누락. 실 동작 도구 수는 더 적음.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | tools crate 단일 + ~40 spec | tools/ 50,828 LOC, 42 디렉토리, 도구마다 별도 모듈 | 단순화 (수십 배) |
| 도구 정의 | ToolSpec 4 필드 + match arm | buildTool 객체 (15+ 필드: searchHint, outputSchema, isEnabled, toAutoClassifierInput, getPath, render*, checkPermissions, validateInput, maxResultSizeChars, shouldDefer, ...) | 단순화 |
| 도구 추가 | ToolSpec + execute_tool 분기 | tools/MyTool/ 디렉토리 + buildTool + UI 컴포넌트 | 다른 메커니즘 |
| Output Schema | 없음 (Value 자유) | outputSchema 강제 | 누락 |
| Feature flag | 항상 40개 | isEnabled per tool, model/env 의존 | 누락 |
| 동적 prompt/description | static str | async () => ... 동적, model/feature 의존 | 누락 |
| Tool Search (deferred) | ToolSearch 도구만 | shouldDefer + searchHint per tool, deferred tool 풀 | 단순화 |
| Auto classifier input | 없음 | toAutoClassifierInput per tool | 누락 |
| Render 함수 | 결과 string | toolUseMessage/result/progress/rejected 4 render | 누락 |
| Per-tool checkPermissions | required_permission 단일 enum | bashPermissions 2621 LOC 같은 도구별 깊은 권한 로직 | 누락 |
| Sub-tool (Agent) | Agent 단일 분기 | AgentTool 6072 LOC, fork/run/resume/memory/built-in agents/color manager | 단순화 |
| maxResultSizeChars | 통일 (stdout 8K/stderr 4K) | per-tool (CronCreate 100K 등) | 단순화 |
| getPath (영속) | 거의 없음 | per-tool 디스크 영속 경로 | 누락 |
| Stub 도구 | AskUser/RemoteTrigger/TestingPermission stub (PARITY 자인) | 풀 구현 + 인터랙티브 UI | 누락 |
| EnterWorktree/ExitWorktree | 없음 | git worktree add/remove + cd, 동시 멀티 브랜치 | 누락 |
| SendMessageTool | 분기만 | teammate mailbox 와 실 연동 | 단순화 |
| Brief | execute_tool alias (spec 없음) | 별도 BriefTool 디렉토리 | 단순화 |
| 사용자 정의 에이전트 | 없음 | `.claude/agents/` 디렉토리 + loadAgentsDir | 누락 |
| Agent memory | 없음 | agentMemory.ts + memorySnapshot — 영속 | 누락 |
| Color/UI 분리 | 없음 | agentColorManager — 여러 에이전트 동시 시각 구별 | 누락 |

## 블로그 보강 제안

블로그가 잘 한 것: ToolSpec 단순함을 "도구 추가 = match arm 추가" 로 정리한 것은 강한 인사이트. "코어는 작게, 확장은 MCP/플러그인으로" 도 정확한 설계 인사이트. 다만 **40 vs 921 모듈** 비교는 약간 misleading — 921 은 모든 모듈 카운트, 도구 자체는 42 종.

1. **Overview 도입부 callout** — "claw 의 ToolSpec 4 필드는 의도적 ergonomics. 원본은 도구마다 buildTool({15+ field}) + 자체 디렉토리 + UI/permission/render 모듈 — 도구 1개당 수백~수천 LOC. claw 의 단순함은 trade-off: 도구별 prompt 동적 변형, output schema, feature flag, deferred tool 같은 메커니즘 부재" 한 단락.

2. **40 vs 921 표현 보정** — "원본 도구 디렉토리 42개 / 도구 코드 50,800 LOC / claw 40 spec / claw tools crate ~5K LOC" 정확한 숫자.

3. **Stub 도구 솔직 명시** — AskUser/RemoteTrigger/TestingPermission 이 stub 이라는 점을 PARITY 인용. Brief 가 alias 인 점도. "exposed spec 수와 실 동작 도구 수가 다르다" 한 줄.

4. **AgentTool 누락 깊이 한 섹션** — 원본 6072 LOC 의 forkSubagent/runAgent/resumeAgent + agent memory + builtin agents + .claude/agents/ 로딩 + color manager. 블로그가 한 줄 처리한 Agent 가 사실 가장 큰 sub-system.

5. **EnterWorktree/ExitWorktree 도구 신설** — git worktree 동시 멀티 브랜치 작업 — claw 에 없는 흥미로운 도구. 한 단락.

6. **buildTool 객체 vs ToolSpec 비교 표** — 두 정의의 필드 옆에 옆으로 비교. 어떤 메커니즘이 누락됐는지 (output schema, isEnabled, dynamic prompt, render functions, per-tool perms) 한눈에.

7. **PluginTools.tsx 보강** — "플러그인 = 정적 확장, MCP = 동적 확장" 인사이트는 좋음. 원본의 plugin 시스템도 다르므로 cross-link 추가.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/tools/AgentTool/AgentTool.tsx` (1397) + `runAgent.ts`, `forkSubagent.ts`, `agentMemory.ts`, `builtInAgents.ts`, `loadAgentsDir.ts`
- `/home/heru/code/claude-analysis/src/tools/BashTool/*` (18 files, 14,400 LOC)
- `/home/heru/code/claude-analysis/src/tools/ScheduleCronTool/CronCreateTool.ts` (157, buildTool 예시)
- `/home/heru/code/claude-analysis/src/tools/EnterWorktreeTool/`, `ExitWorktreeTool/`
- `/home/heru/code/claude-analysis/src/tools/AskUserQuestionTool/`, `RemoteTriggerTool/`
- `/home/heru/code/claude-analysis/src/tools/SendMessageTool/`
- `/home/heru/code/claude-analysis/Tools_Overview.md`
- `/home/heru/code/claw-code/PARITY.md` "Tool Surface: 40 exposed tool specs" 섹션
