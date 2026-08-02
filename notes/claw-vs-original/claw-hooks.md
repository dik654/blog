# claw-hooks vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 hook 시스템을 **3 이벤트 + JSON stdin/stdout 프로토콜 + 4 matcher** 로 설명한다.

- 3 이벤트: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`
- 4 matcher: `Always`, `Tool(String)`, `ToolPattern(String)`, `BashCommand(String)`
- HookRunner: pre_tool_hooks / post_tool_hooks / user_prompt_hooks / default_timeout (2000ms)
- HookDefinition: command, matcher, timeout, env
- JSON 프로토콜:
  - stdin: `{ event, tool_name, tool_input, session_id, workspace_root, timestamp }`
  - stdout: `{ permission: allow/deny/prompt/skip, reason?, message? }`
- 5단계 execute_hook: JSON 입력 준비 → /bin/sh -c spawn → stdin 전송 → 타임아웃 → stdout 파싱
- Pre 훅: first-decision wins, deny/prompt/allow 시 즉시 반환
- Post 훅: 경고·로깅만, JSON 프로토콜 불필요 (stdout 텍스트 = 경고)
- 인사이트: "Pre 훅 < 500ms, 50턴 × 3 도구 = 150회 = 5분 지연 위험"

## 원본 Claude Code 실제 동작

원본 hook 은 **28 이벤트 + 다중 transport (shell/HTTP/agent/prompt) + 별도 라이프사이클** 로 5,022 LOC 메인 + 18 보조 모듈.

### 주의: 두 가지 "hook"

원본 Claude Code 에는 두 종류의 "hook" 이 있다:
1. **React hooks** (`src/hooks/` 104 files) — UI 훅 (useTextInput, useTasks, useQueueProcessor 등). 블로그의 hook 과 무관
2. **User-defined hooks** (`src/utils/hooks.ts` 5022 LOC + `src/utils/hooks/` 18 files = 13,765 LOC) — 블로그의 HookRunner 와 대응. 사용자가 settings.json 에 등록하는 shell command / agent / HTTP webhook

이 비교는 **2번** (사용자 hook) 만 다룬다.

### 28 Hook Events — claw 의 3개와 차원이 다름

`src/entrypoints/sdk/coreTypes.ts` 의 `HOOK_EVENTS`:

```ts
'PreToolUse', 'PostToolUse', 'PostToolUseFailure',
'Notification', 'UserPromptSubmit',
'SessionStart', 'SessionEnd', 'Setup',
'Stop', 'StopFailure',
'SubagentStart', 'SubagentStop',
'PreCompact', 'PostCompact',
'PermissionRequest', 'PermissionDenied',
'TeammateIdle', 'TaskCreated', 'TaskCompleted',
'Elicitation', 'ElicitationResult',
'ConfigChange',
'WorktreeCreate', 'WorktreeRemove',
'InstructionsLoaded', 'CwdChanged', 'FileChanged'
```

각 이벤트의 의미:
- `PostToolUseFailure` — 도구 실패 시 별도 이벤트 (success 와 분리)
- `Notification` — 사용자 알림 발생 시
- `Stop` / `StopFailure` — Claude 중지 시 (정상/실패)
- `SubagentStart` / `SubagentStop` — sub-agent 라이프사이클
- `PreCompact` / `PostCompact` — 컨텍스트 압축 전후 (compact 글에서 핵심)
- `PermissionRequest` / `PermissionDenied` — 권한 요청·거부 시점
- `TeammateIdle` — 멀티에이전트 teammate 가 idle 됐을 때
- `TaskCreated` / `TaskCompleted` — task lifecycle
- `Elicitation` / `ElicitationResult` — MCP elicitation
- `ConfigChange` — settings 변경
- `WorktreeCreate` / `WorktreeRemove` — git worktree
- `InstructionsLoaded` — CLAUDE.md 등 instruction file 로드
- `CwdChanged` — 작업 디렉토리 변경
- `FileChanged` — 파일 변경 감지 (file watcher 와 연동)

### `src/utils/hooks/` 18 모듈 (8,743 LOC)

| 파일 | LOC | 역할 |
|---|---|---|
| `sessionHooks.ts` | 447 | SessionStart/SessionEnd hook 처리 |
| `hooksConfigManager.ts` | 400 | hook config 관리 + 머지 |
| `execAgentHook.ts` | 339 | hook 으로 sub-agent 실행 (shell command 외 옵션) |
| `AsyncHookRegistry.ts` | 309 | 비동기 hook 등록/실행 |
| `ssrfGuard.ts` | 294 | HTTP hook 의 SSRF 방어 (private IP 차단) |
| `hooksSettings.ts` | 271 | hook settings.json 스키마 |
| `skillImprovement.ts` | 267 | skill 자동 개선 hook |
| `execHttpHook.ts` | 242 | HTTP webhook 실행 (POST + SSRF guard) |
| `execPromptHook.ts` | 211 | hook 결과를 LLM prompt 에 inject |
| `hookEvents.ts` | 192 | 이벤트 broadcast (started/progress/response) |
| `fileChangedWatcher.ts` | 191 | 파일 변경 감지 → FileChanged hook 트리거 |
| `apiQueryHookHelper.ts` | 141 | API query 중 hook 처리 |
| `hooksConfigSnapshot.ts` | 133 | 실행 중 config snapshot (race condition 방지) |
| `hookHelpers.ts` | 83 | 공유 헬퍼 |
| `postSamplingHooks.ts` | 70 | LLM sampling 후 hook |
| `registerFrontmatterHooks.ts` | 67 | markdown frontmatter 의 hook 자동 등록 |
| `registerSkillHooks.ts` | 64 | skill 의 hook 자동 등록 |
| 메인 `utils/hooks.ts` | 5022 | 메인 orchestration |

### 핵심 차이 메커니즘

1. **3 transport** — claw 는 shell command only. 원본은:
   - **Shell command** — `/bin/sh -c` 스폰 (claw 와 동일)
   - **Agent hook** (`execAgentHook.ts` 339) — hook 으로 sub-agent 실행. agent definition 을 가진 hook 이 LLM 한 번 돌려서 결정
   - **HTTP webhook** (`execHttpHook.ts` 242) — POST 로 외부 서버 호출. SSRF 방어 (private IP 차단), timeout, retry
   - **Prompt hook** (`execPromptHook.ts` 211) — hook 결과를 LLM prompt 에 inject (사용자 메시지처럼)

2. **HookSpecificOutput 구조화** — claw 는 `permission: allow/deny/prompt/skip` 만. 원본은:
   ```ts
   { hookSpecificOutput: { hookEventName: 'PreToolUse'|'UserPromptSubmit'|'PostToolUse', ... event-specific fields } }
   ```
   PreToolUse 는 `permissionDecision` + `permissionDecisionReason`, UserPromptSubmit 은 `additionalContext`, SessionStart 는 `additionalContext` + `agentInstructions` 등 이벤트별 다른 응답 스키마.

3. **AsyncHookRegistry** (309 LOC) — hook 을 비동기로 실행, await 안 하고 진행. session-end 등에서 fire-and-forget.

4. **이벤트 broadcasting** (`hookEvents.ts` 192) — hook started / progress / response 를 SDK 사용자에게 stream. `includeHookEvents` SDK 옵션. claw 의 단순 동기 실행과 다름.

5. **PreCompact / PostCompact hook** — compact 글에서 본 그대로. 압축 전후 hook 이 customInstructions 와 userDisplayMessage 를 mutate. claw 의 compact 는 hook 없음.

6. **SessionStart / SessionEnd / Setup hook** (`sessionHooks.ts` 447) — 세션 시작 시 `additionalContext` inject, `agentInstructions` 추가. 매 세션 처음 한 번 cleanup, 마지막 cleanup. claw 에 없음.

7. **FileChanged hook + watcher** (`fileChangedWatcher.ts` 191) — 파일 변경 감지 → 자동 hook 트리거. claw 에 없음.

8. **PermissionRequest / PermissionDenied hook** — 권한 요청·거부 시점에 hook 으로 추가 logic. claw 의 PreTool 은 권한 결정 자체에 영향, 원본은 권한 system 의 별도 이벤트.

9. **TaskCreated / TaskCompleted / TeammateIdle hook** — task lifecycle 과 swarm teammate 상태 변화에 hook. 멀티에이전트 시스템 통합. claw 에 없음.

10. **Elicitation / ElicitationResult hook** — MCP elicit 호출 시 hook 으로 응답 자동 생성 가능 (사용자 input 대신). claw 의 MCP 는 elicit 자체가 없음.

11. **WorktreeCreate / WorktreeRemove / CwdChanged / ConfigChange / InstructionsLoaded hook** — 환경 변화 이벤트. CLAUDE.md 자동 reload, config 핫 리로드 등.

12. **shouldSkipHookDueToTrust** — workspace trust system 과 연동. 신뢰하지 않은 workspace 에서는 hook 자동 비활성. claw 에 trust 시스템 없음.

13. **getSessionEndHookTimeoutMs** — session end hook 만 별도 timeout. claw 는 단일 default_timeout (2000ms).

14. **frontmatter / skill 자동 등록** — markdown frontmatter (`registerFrontmatterHooks.ts`) 와 skill (`registerSkillHooks.ts`) 의 메타데이터에 hook 정의 → 자동 등록. claw 는 settings.json 만.

15. **postSamplingHooks** — LLM 응답 후 hook. claw 에 없음.

16. **HookBlockingError 별도 처리** — hook 이 의도적으로 차단 (deny) 한 것과 hook 자체 에러 (timeout, parse fail) 를 다르게 처리. claw 는 둘 다 skip.

17. **SSRF Guard** (`ssrfGuard.ts` 294) — HTTP webhook 의 보안. private IP, link-local, DNS rebinding 방어. claw 는 HTTP hook 자체 없음.

18. **hooksConfigSnapshot** (`hooksConfigSnapshot.ts` 133) — hook 실행 중 config 변경되면 race condition 발생. snapshot 을 떠서 일관성 보장.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | hook 모듈 ~수백 LOC | utils/hooks.ts 5022 + utils/hooks/ 8743 = 13,765 LOC | 단순화 (수십 배) |
| Hook event 수 | 3 (PreToolUse/PostToolUse/UserPromptSubmit) | 28 | 단순화 |
| 누락 이벤트 | — | PostToolUseFailure, Notification, SessionStart/End, Setup, Stop/StopFailure, SubagentStart/Stop, PreCompact/PostCompact, PermissionRequest/Denied, TeammateIdle, TaskCreated/Completed, Elicitation/Result, ConfigChange, WorktreeCreate/Remove, InstructionsLoaded, CwdChanged, FileChanged (25) | 누락 |
| Transport | shell command only | shell + agent (sub-LLM) + HTTP webhook + prompt inject (4종) | 누락 |
| Output 스키마 | `{ permission: ..., reason? }` 단일 | hookSpecificOutput 이벤트별 다른 스키마 (permissionDecision/additionalContext/agentInstructions) | 단순화 |
| Pre/Post compact hook | 없음 | PreCompact/PostCompact 가 customInstructions + userDisplayMessage mutate | 누락 (compaction 글 cross-link) |
| Session hooks | 없음 | SessionStart/End/Setup 447 LOC | 누락 |
| File watcher 연동 | 없음 | FileChanged hook 191 LOC | 누락 |
| Permission hooks | 없음 (PreTool 이 결정에 영향) | PermissionRequest/Denied 별도 이벤트 | 다른 메커니즘 |
| Task/Teammate hooks | 없음 | TaskCreated/Completed/TeammateIdle | 누락 |
| MCP Elicitation hook | 없음 | Elicitation/ElicitationResult | 누락 |
| Config hot reload hook | 없음 | ConfigChange + hooksConfigSnapshot race-safe | 누락 |
| Worktree hooks | 없음 (worktree 자체 없음) | WorktreeCreate/Remove | 누락 |
| Instructions hook | 없음 | InstructionsLoaded — CLAUDE.md 등 reload | 누락 |
| AsyncHookRegistry | 없음 | 309 LOC fire-and-forget hook | 누락 |
| Hook event broadcasting | 없음 | started/progress/response stream to SDK | 누락 |
| HTTP webhook | 없음 | execHttpHook 242 + SSRF guard 294 | 누락 |
| Agent hook (sub-LLM) | 없음 | execAgentHook 339 — hook 이 LLM 한 번 돌림 | 누락 |
| Prompt inject hook | 없음 | execPromptHook 211 — hook 결과를 LLM prompt 에 주입 | 누락 |
| Frontmatter / skill 자동 등록 | settings.json 만 | markdown frontmatter + skill 메타에서 자동 등록 | 누락 |
| Trust 시스템 연동 | 없음 | shouldSkipHookDueToTrust — untrusted workspace 자동 비활성 | 누락 |
| Snapshot config | 단일 config read | hooksConfigSnapshot 으로 race-safe | 누락 |
| Timeout per event | default 2000ms | event 별 (sessionEndHook 등 별도 timeout) | 단순화 |

## 블로그 보강 제안

블로그가 잘 한 것: 5단계 execute_hook 파이프라인, JSON 프로토콜, "Pre 훅 < 500ms" guideline 인사이트는 모두 강하다. 단 28 vs 3 이벤트 격차가 가장 큰 누락이라 이 부분만 보강하면 정확성이 크게 올라간다.

1. **Overview 도입부 callout** — "claw 는 3 이벤트 + shell-only hook. 원본은 28 이벤트 + 4 transport (shell/agent/HTTP/prompt) + 별도 lifecycle 모듈 13,765 LOC. 가장 큰 누락은 PreCompact/PostCompact (compaction 글), SessionStart/End, SubagentStart/Stop, FileChanged (file watcher), PermissionRequest/Denied, TaskCreated/Completed (task glob 글)" 한 단락.

2. **28 이벤트 표 신설** — 각 이벤트의 의미를 한 줄씩. claw 의 3 이벤트가 어디에 매핑되는지 (PreTool/PostTool/UserPromptSubmit 셋만 매칭).

3. **HTTP webhook + SSRF guard 한 섹션** — 외부 SIEM/Slack/PagerDuty 와 연동하는 진짜 production 케이스. claw 의 shell-only 보다 enterprise-friendly.

4. **Agent hook 한 섹션** — "hook 이 LLM 한 번 돌려서 판정" 은 흥미로운 패턴. 정적 shell script 로 못 표현하는 정책을 LLM 으로 대체.

5. **Prompt inject hook 한 섹션** — hook 결과를 LLM prompt 에 사용자 메시지처럼 inject. 외부 컨텍스트 (issue tracker, PR description 등) 를 자동 주입.

6. **PreCompact/PostCompact cross-link** — claw-compaction 글과 cross-reference. claw 의 compaction 이 hook 을 호출하지 않는다는 점.

7. **이벤트 broadcasting 섹션** — SDK 사용자가 hook started/progress/response 를 stream 으로 받는 구조. claw 에 없음.

8. **Trust system + frontmatter 자동 등록** — workspace trust 와 결합한 hook 자동 비활성, markdown frontmatter 의 메타데이터로 hook 등록 — claw 에 없는 ergonomic feature.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/utils/hooks.ts` (5022, 메인)
- `/home/heru/code/claude-analysis/src/utils/hooks/sessionHooks.ts` (447)
- `/home/heru/code/claude-analysis/src/utils/hooks/hooksConfigManager.ts` (400)
- `/home/heru/code/claude-analysis/src/utils/hooks/execAgentHook.ts` (339, agent hook)
- `/home/heru/code/claude-analysis/src/utils/hooks/AsyncHookRegistry.ts` (309)
- `/home/heru/code/claude-analysis/src/utils/hooks/ssrfGuard.ts` (294, HTTP SSRF)
- `/home/heru/code/claude-analysis/src/utils/hooks/hooksSettings.ts` (271)
- `/home/heru/code/claude-analysis/src/utils/hooks/skillImprovement.ts` (267)
- `/home/heru/code/claude-analysis/src/utils/hooks/execHttpHook.ts` (242, HTTP webhook)
- `/home/heru/code/claude-analysis/src/utils/hooks/execPromptHook.ts` (211, prompt inject)
- `/home/heru/code/claude-analysis/src/utils/hooks/hookEvents.ts` (192, broadcasting)
- `/home/heru/code/claude-analysis/src/utils/hooks/fileChangedWatcher.ts` (191)
- `/home/heru/code/claude-analysis/src/utils/hooks/registerFrontmatterHooks.ts` (67)
- `/home/heru/code/claude-analysis/src/utils/hooks/registerSkillHooks.ts` (64)
- `/home/heru/code/claude-analysis/src/utils/hooks/postSamplingHooks.ts` (70)
- `/home/heru/code/claude-analysis/src/entrypoints/sdk/coreTypes.ts` line 25 — HOOK_EVENTS 28 종
- `/home/heru/code/claude-analysis/Hooks_Overview.md` (React hooks 와 헷갈리지 말 것)
