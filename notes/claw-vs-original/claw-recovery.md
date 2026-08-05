# claw-recovery vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 Recovery 를 **자율 코딩 Lane 의 실패 복구 시스템** 으로 설명한다. RecoveryRecipe, RecoveryEngine, RecoveryPolicy, StaleBranch detector, escalation flow.

## 원본 Claude Code 실제 동작

**원본에 RecoveryEngine 자체가 없음.** 가장 가까운 것:

- `services/api/withRetry.ts` (822 LOC) — API retry policy (transient errors)
- `services/api/errors.ts` — error classification (`PROMPT_TOO_LONG`, `getRetryDelay`)
- `services/lsp/manager.ts`, `LSPServerInstance.ts` — LSP server crash recovery (재spawn)
- `services/mcp/client.ts` — MCP reconnection (exponential backoff)
- `services/teamMemorySync/watcher.ts` — file watcher recovery
- `screens/REPL.tsx` — REPL crash recovery

claw 의 Recovery 는 **PolicyEngine 의 Lane 실패 복구** — 자율 자동화 sub-system. 원본은 자율 자동화 자체가 없으므로 그 위의 recovery layer 도 없음. 일부 기능은 추측:

- StaleBranch detection — 원본의 git worktree + cron 조합으로 흉내 가능하지만 별도 모듈 아님
- Recipe-based retry — 원본은 retry policy (transient/permission/rate-limit 별 다름) 가 있지만 recipe DSL 은 없음
- Escalation — 원본은 PermissionEnforcer 의 ask → user dialog 가 escalation 의 가장 가까운 형태

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| RecoveryEngine | 핵심 모듈 | 없음 | **추가** |
| RecoveryRecipe DSL | 있음 | 없음 (withRetry 의 hardcoded policy) | **추가** |
| StaleBranch detector | 있음 | 없음 | **추가** |
| Lane escalation | 있음 (PolicyEngine 연동) | 없음 (PolicyEngine 자체 없음) | **추가** |
| API retry | claw 도 있을 가능성 | withRetry.ts 822 LOC, idempotency, retry budget | (원본이 깊음) |

## 보강 제안

- "Recovery 는 PolicyEngine 위에서 동작하는 sub-system. 원본 Claude Code 에는 자율 자동화가 없어 대응하는 모듈도 없음" 명시
- API retry / LSP/MCP reconnection 같은 원본의 transient retry 와 명확히 구분 (claw 의 Recovery 는 task-level 실패 복구)
- 면접 컨텍스트: 자율 자동화 시 "실패하면 어떻게?" 질문에 답이 됨

## 참조 파일

- 원본 측 대응 모듈 없음
- 가장 가까운 원본: `/home/heru/code/claude-analysis/src/services/api/withRetry.ts` (822 LOC, transient retry only)
- LSP recovery: `/home/heru/code/claude-analysis/src/services/lsp/manager.ts`
