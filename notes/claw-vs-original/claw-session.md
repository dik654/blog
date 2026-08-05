# claw-session vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 session 을 **단일 in-memory `Session` struct + ConversationRuntime + fork/merge** 로 설명한다.

- `Session { id, parent, messages, tool_calls, permission_log, token_usage, workspace_root, started_at, metadata }`
- Message: role/content blocks/timestamp
- ConversationRuntime: 메인 대화 루프, ensure_context_fits → query → tool exec → append
- Fork/merge: parent session 참조로 분기, merge 시 conflict resolution

## 원본 Claude Code 실제 동작

원본은 **disk-persisted session storage + resume + SessionMemory + remote/direct-connect/bridge** 로 ~7,500 LOC 분산.

### 핵심 모듈

| 파일 | LOC | 역할 |
|---|---|---|
| `utils/sessionStorage.ts` | 5105 | `.claude/sessions/{id}/transcript.jsonl` 영속, append-only, getMessagesAfterCompactBoundary, reAppendSessionMetadata |
| `services/SessionMemory/sessionMemory.ts` | 495 | 자동 메모리 추출 (대화에서 핵심 사실 추출 → 영속) |
| `services/SessionMemory/prompts.ts` | 324 | 메모리 추출 LLM 프롬프트 |
| `services/SessionMemory/sessionMemoryUtils.ts` | 207 | utils |
| `screens/ResumeConversation.tsx` | 398 | resume UI — 과거 세션 목록 |
| `commands/resume/resume.tsx` | 274 | `/resume` 슬래시 |
| `bridge/sessionRunner.ts`, `createSession.ts`, `sessionIdCompat.ts`, `codeSessionApi.ts` | ? | bridge mode session |
| `server/createDirectConnectSession.ts` | ? | WebSocket direct connect |
| `services/api/sessionIngress.ts` | ? | 외부 ingress |
| `commands/rename/generateSessionName.ts` | ? | LLM 으로 session 이름 자동 생성 |
| `commands/session/session.tsx` | ? | `/session` 슬래시 |
| `components/SessionPreview.tsx`, `SessionBackgroundHint.tsx`, `TeleportResumeWrapper.tsx`, `ResumeTask.tsx` | ? | UI |

### 핵심 차이

1. **Disk 영속** — claw 는 in-memory + 종료 시 사라짐. 원본은 jsonl append-only transcript 로 매 메시지 영속.
2. **Session resume** — `/resume` 명령으로 과거 세션 재개, ResumeConversation 화면으로 목록 + preview.
3. **SessionMemory** — 자동 메모리 추출 LLM (495 LOC). 대화에서 사용자 선호, 프로젝트 사실 등 추출 → 다음 세션에 inject.
4. **CompactBoundary 분리** — REPL 스크롤백용 메시지와 압축 대상 메시지를 boundary marker 로 분리. `getMessagesAfterCompactBoundary()`.
5. **Session metadata re-append** — 압축 후에도 session metadata 가 보존되도록 `reAppendSessionMetadata()`.
6. **Bridge / direct-connect / remote** — 4 종 session 생성 경로. claw 는 단일 in-memory.
7. **Auto-naming** — LLM 으로 session 이름 자동 생성 (`generateSessionName.ts`).
8. **Fork/merge** 미존재 — 원본의 fork 는 `runForkedAgent` (compact 용 캐시 키 보존) 가 가장 가까움. claw 의 fork 는 자체 추가.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | session.rs + conversation_runtime.rs | sessionStorage 5105 + SessionMemory 1026 + bridge/server/UI ≈ 7500 LOC | 단순화 |
| 영속 | in-memory | jsonl transcript append-only | 누락 |
| Resume | 없음 | `/resume` + ResumeConversation 화면 + preview | 누락 |
| SessionMemory | 없음 | LLM 자동 추출 (495 LOC) | 누락 |
| Compact boundary | `<prior-context>` XML | createCompactBoundaryMessage + getMessagesAfterCompactBoundary | 다른 메커니즘 |
| 다중 session 생성 | in-memory 단일 | bridge / direct-connect / remote / local 4종 | 단순화 |
| Auto-name | 없음 | LLM 생성 | 누락 |
| Fork/merge | claw 자체 추가 | runForkedAgent (compact 전용) | **추가** |
| Metadata re-append | 없음 | reAppendSessionMetadata | 누락 |

## 보강 제안

- "claw session 은 in-memory only — 원본의 jsonl 영속 + resume + SessionMemory 가 누락" Overview callout
- Fork/merge 는 claw 가 추가한 설계 (긍정적으로 부각)
- SessionMemory cross-link to claw-compaction (원본의 trySessionMemoryCompaction 이 1순위 fallback)

## 참조 파일

- `/home/heru/code/claude-analysis/src/utils/sessionStorage.ts` (5105)
- `/home/heru/code/claude-analysis/src/services/SessionMemory/*.ts` (1026)
- `/home/heru/code/claude-analysis/src/screens/ResumeConversation.tsx` (398)
- `/home/heru/code/claude-analysis/src/commands/resume/resume.tsx`
- `/home/heru/code/claude-analysis/src/bridge/sessionRunner.ts` 등
