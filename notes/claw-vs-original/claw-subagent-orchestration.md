# claw-subagent-orchestration vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 sub-agent 를 **AgentTool + worktree isolation + TeamLead/Workers + AgentSelection + Guardrails** 로 설명한다.

- AgentToolInput: description, prompt, subagent_type ("Explore"/"Plan"/"general-purpose"), model, isolation ("worktree")
- 메인 = coordinator, sub = worker (독립 context window)
- Team-lead/workers 패턴
- Guardrails: 권한 위임 + budget cap

## 원본 Claude Code 실제 동작

원본 sub-agent 시스템은 **AgentTool 6072 LOC + tasks/LocalAgentTask 682 + swarm 4585 + coordinator 369 + teammate mailbox 1183 = ~13,000 LOC** 의 거대한 sub-system.

### 핵심 모듈 (task-team 글에서도 다룸)

| 모듈 | LOC | 역할 |
|---|---|---|
| `tools/AgentTool/AgentTool.tsx` | 1397 | 메인 도구 |
| `tools/AgentTool/UI.tsx` | 871 | sub-agent UI rendering |
| `tools/AgentTool/runAgent.ts` | ? | 에이전트 실행 |
| `tools/AgentTool/forkSubagent.ts` | ? | 부모 컨텍스트 포크 |
| `tools/AgentTool/resumeAgent.ts` | ? | 재개 |
| `tools/AgentTool/agentMemory.ts` | ? | agent 별 영속 메모리 |
| `tools/AgentTool/agentMemorySnapshot.ts` | ? | 메모리 snapshot |
| `tools/AgentTool/builtInAgents.ts` | ? | 내장 agent 목록 |
| `tools/AgentTool/loadAgentsDir.ts` | ? | `.claude/agents/` 사용자 정의 agent 로드 |
| `tools/AgentTool/agentColorManager.ts` | ? | 동시 실행 시 색깔 구별 |
| `tasks/LocalAgentTask/LocalAgentTask.tsx` | 682 | sub-agent task class |
| `utils/swarm/inProcessRunner.ts` | 1552 | swarm 에이전트 실행 |
| `utils/swarm/permissionSync.ts` | 928 | leader → follower 권한 sync |
| `utils/swarm/teamHelpers.ts` | 683 | team 헬퍼 |
| `utils/teammateMailbox.ts` | 1183 | 에이전트 간 메시지 큐 |
| `coordinator/coordinatorMode.ts` | 369 | coordinator 모드 |
| `tasks/InProcessTeammateTask/` | 246 | in-process teammate task |
| `tasks/RemoteAgentTask/RemoteAgentTask.tsx` | 855 | 원격 에이전트 (다른 머신) |

### 핵심 차이

1. **사용자 정의 agent (`.claude/agents/`)** — 사용자가 markdown frontmatter 로 agent 정의 → 자동 등록. claw 의 subagent_type 은 fixed enum.

2. **Built-in agents** — `Explore`, `Plan`, `general-purpose` 외에 더 많은 builtin (search, refactor, test 등).

3. **Agent memory** — sub-agent 별 영속 메모리. 다음 호출 시 이전 컨텍스트 inject. claw 에 없음.

4. **Pane backend** — iTerm/tmux 로 sub-agent 별 별도 pane. claw 의 worktree isolation 보다 시각적으로 분리.

5. **Teammate mailbox** (1183 LOC) — agent 간 진짜 메시지 큐. Send/receive, broadcast, reply.

6. **Permission sync** — leader 가 worker 권한을 동적으로 sync. worker 가 새 권한 요청 시 leader 가 결정.

7. **Coordinator mode** — coordinator 가 worker fleet 관리. spawn/kill/respawn/load balancing.

8. **Remote agent** — WebSocket 으로 다른 머신의 Claude 에 작업 위임 (855 LOC). 분산 시스템.

9. **agent fork (`forkSubagent`)** — 부모 컨텍스트 그대로 fork. 권한·컨텍스트·메모리 상속.

10. **resume agent** — sub-agent 가 일시 중지 후 재개. claw 는 단발성.

11. **AgentColorManager** — 여러 agent 동시 시각 구별. claw 에 없음.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | AgentTool 단일 분기 | ~13,000 LOC sub-system | 단순화 (수십 배) |
| Subagent type | 3 fixed (Explore/Plan/general) | builtin 다수 + 사용자 정의 markdown | 단순화 |
| 사용자 정의 agent | 없음 | `.claude/agents/` markdown frontmatter | 누락 |
| Agent memory | 없음 | per-agent 영속 메모리 | 누락 |
| Pane backend | worktree isolation | iTerm/tmux 별도 pane | 다른 메커니즘 |
| Teammate mailbox | 없음 | 1183 LOC msg queue | 누락 |
| Permission sync | Guardrails (권한 위임) | leader → worker 동적 sync (928 LOC) | 단순화 |
| Coordinator | TeamLead 개념 | coordinatorMode 369 + worker fleet | 단순화 |
| Remote agent | 없음 | WebSocket 다른 머신 (855 LOC) | 누락 |
| Fork subagent | 가능? | forkSubagent — 부모 컨텍스트/권한/메모리 상속 | 단순화 |
| Resume | 없음 | resumeAgent | 누락 |
| Color manager | 없음 | 여러 agent 시각 구별 | 누락 |
| Worktree isolation | 핵심 | 원본은 EnterWorktreeTool 별도 도구 | 다른 메커니즘 |

## 보강 제안

- "claw 는 worktree isolation 단순함, 원본은 13K LOC sub-system + iTerm/tmux pane + teammate mailbox + remote agent + .claude/agents/ 사용자 정의" Overview callout
- 사용자 정의 agent (markdown frontmatter) — claw 에 없는 ergonomic feature
- Remote agent — 분산 시스템으로 확장한 점
- task-team 글과 cross-link

## 참조 파일

- `/home/heru/code/claude-analysis/src/tools/AgentTool/*` (6072 LOC)
- `/home/heru/code/claude-analysis/src/tasks/LocalAgentTask/LocalAgentTask.tsx` (682)
- `/home/heru/code/claude-analysis/src/tasks/RemoteAgentTask/RemoteAgentTask.tsx` (855)
- `/home/heru/code/claude-analysis/src/utils/swarm/inProcessRunner.ts` (1552)
- `/home/heru/code/claude-analysis/src/utils/swarm/permissionSync.ts` (928)
- `/home/heru/code/claude-analysis/src/utils/teammateMailbox.ts` (1183)
- `/home/heru/code/claude-analysis/src/coordinator/coordinatorMode.ts` (369)
