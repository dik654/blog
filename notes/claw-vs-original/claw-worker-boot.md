# claw-worker-boot vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 worker boot 를 **WorkerStatus 8단계 상태머신 + TrustResolver + Misdelivery handling + Observe** 로 설명한다.

- 8 status: Idle / Launching / TrustResolving / Ready / Running / Stopping / Stopped / Error
- TrustResolver — worker 권한 결정
- Misdelivery — 잘못 배달된 메시지 처리
- Observe — worker 상태 모니터링

## 원본 Claude Code 실제 동작

원본은 **swarm/inProcessRunner (1552 LOC) + spawnInProcess (328) + spawnUtils (146) + reconnection (119) + teammateInit (129) + permissionSync (928) + teammateMailbox (1183)** 등 swarm sub-system 전체.

### 핵심 모듈 (subagent-orchestration 글과 중복)

| 파일 | LOC | 역할 |
|---|---|---|
| `utils/swarm/inProcessRunner.ts` | 1552 | in-process worker 실행 (lifecycle, message routing) |
| `utils/swarm/spawnInProcess.ts` | 328 | spawn |
| `utils/swarm/spawnUtils.ts` | 146 | spawn 유틸 |
| `utils/swarm/teammateInit.ts` | 129 | teammate 초기화 (claw 의 worker boot 와 가장 가까움) |
| `utils/swarm/reconnection.ts` | 119 | 재연결 |
| `utils/swarm/permissionSync.ts` | 928 | 권한 sync (claw 의 TrustResolver 와 가장 가까움) |
| `utils/teammateMailbox.ts` | 1183 | 메시지 큐 (claw 의 Misdelivery 처리에 가까움) |
| `utils/swarm/backends/*` | ~10 files | iTerm/tmux/InProcess pane backends |

### 핵심 차이

1. **WorkerStatus 8 단계** — 원본은 명시 status enum 보다는 inProcessRunner 의 implicit state 관리. claw 의 명시 상태머신은 깔끔.

2. **TrustResolver** — claw 가 추가한 컨셉. 원본의 permissionSync (928 LOC) 가 가장 가깝지만 leader → follower 권한 sync 가 핵심.

3. **Misdelivery handling** — 원본의 teammateMailbox (1183 LOC) 가 메시지 큐 + dead letter handling. claw 의 Misdelivery 와 같은 의도.

4. **Observe** — 원본은 BackgroundTaskStatus / RemoteSessionProgress / ShellProgress 같은 UI 컴포넌트 다수.

5. **Pane backend** — 원본은 iTerm/tmux 로 진짜 별도 터미널 pane 에 worker 띄움. claw 는 in-process.

6. **Reconnection** — 원본은 119 LOC reconnection 모듈 — pane 죽으면 재 spawn + layout 복구.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | worker boot 모듈 ~수백 | swarm/spawn/teammate 합쳐 ~4500 LOC | 단순화 |
| Status 명시 | 8 enum 명확 | inProcessRunner 의 implicit state | claw 가 깔끔 (정리) |
| TrustResolver | 별도 모듈 | permissionSync 928 LOC (leader → follower) | 다른 메커니즘 |
| Misdelivery | 명시 처리 | teammateMailbox dead letter | 다른 메커니즘 |
| Pane backend | in-process | iTerm/tmux 별도 pane | 누락 |
| Reconnection | 별도 모듈? | 119 LOC + layout 복구 | 단순화 |
| In-process runner | 단일 worker 모델 | 1552 LOC inProcessRunner — message routing, lifecycle | 단순화 |

## 보강 제안

- "claw 의 8-state WorkerStatus 는 명시 상태머신 — 원본의 implicit state 보다 깔끔. 단 pane backend (iTerm/tmux), permissionSync (928 LOC), teammateMailbox (1183 LOC) 같은 깊은 인프라는 누락" Overview callout
- WorkerStatus 명시화는 claw 의 디자인 strength (강조)
- subagent-orchestration 글과 cross-link

## 참조 파일

- `/home/heru/code/claude-analysis/src/utils/swarm/inProcessRunner.ts` (1552)
- `/home/heru/code/claude-analysis/src/utils/swarm/spawnInProcess.ts` (328)
- `/home/heru/code/claude-analysis/src/utils/swarm/teammateInit.ts` (129, claw 의 worker boot 와 가장 유사)
- `/home/heru/code/claude-analysis/src/utils/swarm/permissionSync.ts` (928)
- `/home/heru/code/claude-analysis/src/utils/teammateMailbox.ts` (1183)
- `/home/heru/code/claude-analysis/src/utils/swarm/reconnection.ts` (119)
- `/home/heru/code/claude-analysis/src/utils/swarm/backends/*` (iTerm/tmux/InProcess)
