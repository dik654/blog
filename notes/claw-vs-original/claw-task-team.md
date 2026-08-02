# claw-task-team vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 task/team/cron 시스템을 **TaskPacket 구조 + in-memory registry** 로 설명한다.

- `task_registry.rs` (335 LOC) — `TaskRegistry` thread-safe in-memory store: create / get / list / stop / update / output / append_output / set_status / assign_team
- `team_cron_registry.rs` (363 LOC) — `TeamRegistry` + `CronRegistry` 로 TeamCreate/Delete, CronCreate/Delete/List
- `TaskPacket` 구조 — id, title, description, priority, tags, goals, constraints, acceptance_criteria, assigned_team/worker, depends_on, blocks, deadline, estimated_duration
- 7개 status: Pending → Assigned → InProgress → Review → Completed / Rejected → InProgress (역류) / Cancelled
- 6 task tool: TaskCreate, TaskGet, TaskList, TaskStop, TaskUpdate, TaskOutput
- Goal { description, measurable, completion_check } + Constraint 5 종류
- "구조화 명세 + Goal/Constraint 가드레일" 인사이트
- PARITY 명시: "in-memory lifecycle behavior on `main`; they still stop short of a real background scheduler or worker fleet"

## 원본 Claude Code 실제 동작

원본은 **다종 task class + 실 spawn + 백그라운드 worker fleet + cron daemon + UI fleet** 구조. ~10,500 LOC.

### `src/tasks/` (2579 LOC) — Task 클래스

| 파일 | LOC | 역할 |
|---|---|---|
| `RemoteAgentTask/RemoteAgentTask.tsx` | 855 | 원격 에이전트 (다른 머신·사용자 머신) 작업 — WebSocket 연결, progress streaming |
| `LocalAgentTask/LocalAgentTask.tsx` | 682 | 로컬 서브 에이전트 (별도 컨텍스트, sub-conversation) |
| `LocalShellTask/LocalShellTask.tsx` | 522 | 로컬 shell 백그라운드 task (terminal-like) |
| `LocalMainSessionTask.ts` | 479 | 메인 세션 자체를 task 로 추적 |
| `DreamTask/DreamTask.ts` | 157 | "dream" task (특수 모드 — async 분석) |
| `InProcessTeammateTask/InProcessTeammateTask.tsx` | 125 | swarm 의 in-process teammate |
| `InProcessTeammateTask/types.ts` | 121 | teammate 타입 |
| `stopTask.ts` | 100 | 통합 stop 로직 |
| `pillLabel.ts` | 82 | UI pill |
| `LocalShellTask/killShellTasks.ts` | 76 | shell task kill |
| `types.ts` | 46 | 공통 타입 |
| `LocalShellTask/guards.ts` | 41 | guards |

### `src/utils/cron*` (1526 LOC) — Cron 시스템

| 파일 | LOC | 역할 |
|---|---|---|
| `cronScheduler.ts` | 565 | 1초 polling, lock 획득, file watcher, missed task recovery, jitter |
| `cronTasks.ts` | 458 | `.claude/scheduled_tasks.json` 영속 store, jittered next-run 계산 |
| `cron.ts` | 308 | cron expression 파서 + cronToHuman |
| `cronTasksLock.ts` | 195 | 다중 세션 간 scheduler 소유권 lock |

### `src/tools/ScheduleCronTool/` (484 LOC) — Cron 도구

| 파일 | LOC | 역할 |
|---|---|---|
| `CronCreateTool.ts` | 157 | recurring/durable 옵션, MAX_JOBS=50, semantic boolean |
| `prompt.ts` | 135 | LLM 프롬프트 + Kairos/Durable feature gate |
| `CronListTool.ts` | 97 | 목록 조회 |
| `CronDeleteTool.ts` | 95 | 삭제 |

### `src/utils/swarm/` (4585 LOC) — Multi-agent / Team

| 파일 | LOC | 역할 |
|---|---|---|
| `inProcessRunner.ts` | 1552 | in-process swarm 에이전트 실행 — message routing, lifecycle |
| `permissionSync.ts` | 928 | leader → follower 권한 sync |
| `teamHelpers.ts` | 683 | 팀 헬퍼 |
| `spawnInProcess.ts` | 328 | in-process spawn |
| `spawnUtils.ts` | 146 | spawn 유틸 |
| `teammateInit.ts` | 129 | teammate 초기화 |
| `reconnection.ts` | 119 | 재연결 |
| `teammateLayoutManager.ts` | 107 | UI 레이아웃 (split pane) |
| `leaderPermissionBridge.ts` | 54 | bridge |
| `constants.ts`, `teammateModel.ts`, `teammatePromptAddendum.ts` | 61 | 보조 |
| `backends/` | ~10 files | iTerm, tmux, InProcess pane backends — 진짜 터미널 멀티플렉서 통합 |

### Coordinator + Teammate 인프라

- `coordinator/coordinatorMode.ts` (369 LOC) — coordinator 가 여러 worker 에이전트 관리
- `hooks/toolPermission/handlers/coordinatorHandler.ts` — 권한 위임
- `utils/teammateMailbox.ts` (1183 LOC) — 에이전트 간 메시지 큐
- `utils/teammate.ts` (292) — teammate 정의
- `utils/teammateContext.ts` (96) — teammate context

### UI / Components

- `components/tasks/` 13 files — BackgroundTask, BackgroundTasksDialog, ShellProgress, ShellDetailDialog, AsyncAgentDetailDialog, RemoteSessionProgress, RemoteSessionDetailDialog, DreamDetailDialog, InProcessTeammateDetailDialog, BackgroundTaskStatus, taskStatusUtils, renderToolActivity

### 핵심 차이 메커니즘

1. **여러 Task 종류** — claw 는 `TaskRegistry` 단일 in-memory store. 원본은 5+ 종 task class:
   - `LocalAgentTask` — sub-conversation 으로 다른 prompt 실행 (블로그의 TaskPacket 와 가장 유사)
   - `LocalShellTask` — 백그라운드 shell 명령 (claw 의 `run_in_background` 와 유사하지만 task 로 추적)
   - `RemoteAgentTask` — WebSocket 으로 원격 에이전트 호출 (다른 머신의 Claude)
   - `LocalMainSessionTask` — 메인 세션 자체
   - `DreamTask` — async 분석 task
   - `InProcessTeammateTask` — swarm teammate

2. **실제 백그라운드 실행** — claw 는 in-memory 만 (PARITY 자인). 원본은 `LocalShellTask.tsx` (522) + `LocalAgentTask.tsx` (682) 가 진짜 spawn, lifecycle 관리, kill, progress streaming.

3. **Cron daemon** — claw 는 `CronRegistry` in-memory. 원본은:
   - 1초 polling (`CHECK_INTERVAL_MS = 1000`)
   - `.claude/scheduled_tasks.json` file-backed durable persistence
   - **다중 세션 간 lock** (`cronTasksLock.ts` 195 LOC) — 한 세션이 owner, 죽으면 다른 세션이 takeover
   - **Missed task recovery** — `findMissedTasks()` 가 idle 동안 놓친 fire 복구
   - **Jitter** (`cronJitterConfig.ts`) — 동시 fire 방지
   - **Aging** — recurring task 가 N 일 이상이면 자동 만료
   - **Permanent flag** — 영속 task 는 만료 안 됨
   - `recurring` (반복) vs `durable` (재시작 생존) 두 축 분리
   - `MAX_JOBS = 50` 캡

4. **Swarm / Team — 진짜 멀티에이전트** — claw 의 `TeamRegistry` 는 단순 store. 원본은:
   - 4585 LOC swarm 인프라
   - **iTerm / tmux backend** — 진짜 터미널 멀티플렉서를 컨트롤해서 여러 Claude 인스턴스를 별도 pane 에 띄움
   - `inProcessRunner.ts` (1552) — 같은 프로세스에서 여러 에이전트 실행, message routing
   - `permissionSync.ts` (928) — leader 가 follower 권한 결정 sync
   - `teammateMailbox.ts` (1183) — 에이전트 간 메시지 큐
   - `coordinatorMode.ts` (369) — coordinator 가 worker 들 관리
   - `reconnection.ts` — pane 재연결, layout 복구
   - PaneBackendExecutor / It2Setup — 사용자 터미널 자동 setup

5. **Cron tool 의 LLM-친화 옵션** — `recurring`, `durable` 을 `semanticBoolean` 으로 받아 LLM 이 자연어 ("yes"/"true"/"persist") 도 boolean 으로 해석. 블로그의 TaskPacket 구조화 정신과 같지만 cron 에 직접 적용.

6. **UI 와이어링** — claw 는 ack 만 하고 끝. 원본은 13개 UI 컴포넌트 (BackgroundTask, BackgroundTasksDialog, 종류별 DetailDialog, ProgressIndicator) + `useBackgroundTasks` 같은 hook 으로 사용자가 실시간 task 진행을 봄.

7. **TaskPacket 구조 부재** — 원본은 블로그의 `TaskPacket { goals, constraints, acceptance_criteria, depends_on, blocks }` 같은 풍부한 구조 자체가 없음. `LocalAgentTask` 는 prompt + agent definition 으로 단순. claw 의 구조화는 **claw 가 추가한 디자인** (원본에 대응하는 것이 없음).

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 코드 규모 | task_registry 335 + team_cron 363 = 698 | tasks/ 2579 + cron/ 1526 + swarm/ 4585 + cron tool 484 + coordinator/teammate 1940 + UI 1500 ≈ 13,000 LOC | 단순화 (18배) |
| Task 종류 | 단일 TaskPacket | LocalAgent / LocalShell / RemoteAgent / LocalMainSession / Dream / InProcessTeammate (6+종) | 단순화 |
| 실제 실행 | in-memory ack 만 | 실 spawn + lifecycle + kill + progress streaming | 누락 |
| Cron 영속성 | in-memory | `.claude/scheduled_tasks.json` + multi-session lock + missed recovery + aging + jitter | 누락 |
| Cron daemon | 없음 | 1초 polling scheduler, lock takeover, file watcher | 누락 |
| Recurring/Durable 분리 | 없음 | `recurring` (반복 여부) × `durable` (재시작 생존) 두 축 | 누락 |
| Cron jitter | 없음 | `cronJitterConfig.ts` — 동시 fire 방지 jitter, max age | 누락 |
| Cron expression | "5필드 cron" 만 | 풀 파서 + `cronToHuman()` 자연어 변환 | 단순화 |
| Team / Swarm | TeamRegistry CRUD 만 | inProcessRunner 1552, permissionSync 928, teamHelpers 683, mailbox 1183 — 진짜 멀티에이전트 | 단순화 |
| Pane backends | 없음 | iTerm + tmux + InProcess pane — 진짜 터미널 멀티플렉서 | 누락 |
| Coordinator | 없음 | `coordinatorMode.ts` — worker 들 오케스트레이션 | 누락 |
| Permission sync | 없음 | leader → follower 권한 동기화 (928 LOC) | 누락 |
| Teammate mailbox | 없음 | 1183 LOC — 에이전트 간 메시지 큐 | 누락 |
| Remote agent | 없음 | `RemoteAgentTask` 855 LOC — WebSocket 원격 에이전트 | 누락 |
| TaskPacket 구조 | goals/constraints/acceptance_criteria/depends_on/blocks 풍부 | 없음 — agent definition + prompt 단순 | **추가** (claw 가 추가한 설계) |
| 7-status lifecycle | Pending→...→Completed/Rejected | 원본은 task 클래스마다 다른 status | 다른 메커니즘 |
| Goal completion_check | 자동 검증 명령 | 없음 | **추가** (claw 가 추가) |
| UI 컴포넌트 | 없음 (registry 만) | 13 components (BackgroundTask, dialogs, progress, status) | 누락 |

## 블로그 보강 제안

블로그가 잘 한 것: `TaskPacket` 의 구조화 인사이트는 강하다. 원본에 없는 **claw 만의 설계** 라는 점을 부각하면 오히려 블로그의 가치가 산다.

1. **Overview 도입부에 양방향 callout** — "TaskPacket 의 풍부한 구조 (Goal/Constraint/Acceptance) 는 claw 가 추가한 설계. 원본은 LocalAgentTask + agent definition 단순. 반대로 원본은 6+ 종 task class, 실 백그라운드 spawn, multi-session cron lock, 진짜 swarm/pane multiplexer 등 인프라가 깊음" — 두 방향 비교가 정확.

2. **TeamCron.tsx 보강 — Cron daemon 차이** — claw 의 in-memory CronRegistry 와 원본의 1초 polling + multi-session lock + missed recovery + jitter + recurring/durable 분리 비교. cron 의 어려운 부분은 거의 다 분산 시스템 문제 (lock, missed task, jitter) 인데 그걸 원본이 어떻게 푸는지가 흥미.

3. **Swarm/Team 신설 섹션** — claw 의 TeamRegistry 단독 은 너무 빈약. 원본의 4585 LOC swarm (inProcessRunner + permissionSync + mailbox + iTerm/tmux backend) 을 한 그림으로. "team 은 단순 그룹핑이 아니라 진짜 멀티에이전트 오케스트레이션" 이라는 점.

4. **Task 종류 비교 표** — LocalAgent / LocalShell / RemoteAgent / Dream / InProcessTeammate 각각 무엇인지. claw 는 task 가 한 종류뿐이라는 단순화 trade-off.

5. **TaskPacket 의 진가는 PolicyEngine 결합** — 블로그가 마지막에 언급한 "PolicyEngine 과 결합" 부분을 강조. 구조화 명세가 단독으로는 빈약해 보일 수 있지만, claw-policy-engine 글과 결합되면 차별화 포인트가 됨.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/tasks/RemoteAgentTask/RemoteAgentTask.tsx` (855)
- `/home/heru/code/claude-analysis/src/tasks/LocalAgentTask/LocalAgentTask.tsx` (682)
- `/home/heru/code/claude-analysis/src/tasks/LocalShellTask/LocalShellTask.tsx` (522)
- `/home/heru/code/claude-analysis/src/tasks/LocalMainSessionTask.ts` (479)
- `/home/heru/code/claude-analysis/src/tasks/DreamTask/DreamTask.ts` (157)
- `/home/heru/code/claude-analysis/src/utils/cronScheduler.ts` (565)
- `/home/heru/code/claude-analysis/src/utils/cronTasks.ts` (458)
- `/home/heru/code/claude-analysis/src/utils/cron.ts` (308)
- `/home/heru/code/claude-analysis/src/utils/cronTasksLock.ts` (195)
- `/home/heru/code/claude-analysis/src/utils/swarm/inProcessRunner.ts` (1552)
- `/home/heru/code/claude-analysis/src/utils/swarm/permissionSync.ts` (928)
- `/home/heru/code/claude-analysis/src/utils/swarm/teamHelpers.ts` (683)
- `/home/heru/code/claude-analysis/src/utils/teammateMailbox.ts` (1183)
- `/home/heru/code/claude-analysis/src/coordinator/coordinatorMode.ts` (369)
- `/home/heru/code/claude-analysis/src/tools/ScheduleCronTool/CronCreateTool.ts` (157)
- `/home/heru/code/claude-analysis/src/components/tasks/*` (13 components)
- `/home/heru/code/claw-code/PARITY.md` Lane 4-6 — "still stop short of a real background scheduler or worker fleet"
