# claw vs 원본 Claude Code — 비교 노트 인덱스

블로그(이직용 지식베이스, `/home/heru/code/blog/src/pages/articles/ai/claw-*.tsx`)는 claw-code(Rust 포팅) 분석. 이 디렉토리는 각 글의 서술과 원본 Claude Code(`/home/heru/code/claude-analysis/src/`) 실 코드를 비교한 자료.

작업 일자: 2026-05-05
참조 PARITY: `/home/heru/code/claw-code/PARITY.md`
원본 코드 출처: 2026-03-31 npm `.map` 유출 복원, 1902 TypeScript files

## 우선순위 1-7 (깊은 분석)

| # | 파일 | 차이 심각도 | 한 줄 요약 |
|---|---|---|---|
| 1 | [claw-compaction.md](./claw-compaction.md) | **major** | claw=결정론 Rust 코드, 원본=`queryModelWithStreaming` LLM 호출 + 9 섹션 프롬프트 + 4단 fallback (SessionMemory/reactive/micro/traditional) + Pre/Post compact hooks + 압축 후 파일/스킬 재주입 + circuit breaker. **본질적 메커니즘 차이** |
| 2 | [claw-bash.md](./claw-bash.md) | **major** | claw=283 LOC 단일 모듈, 원본=24,500 LOC 18+ submodule. tree-sitter+custom AST parser, 명령어별 safe-flag 화이트리스트 (git/gh/ripgrep/pyright/docker/fd 각각), sed 표현식 파싱, exit-code semantic per command, ShellSnapshot, sandbox 정책 정반대 (read-only 만 sandbox vs claw 의 단순 wrap) |
| 3 | [claw-mcp.md](./claw-mcp.md) | **major** | claw=406 LOC registry bridge, 원본=16,500 LOC. 5 transport (stdio+SSE+StreamableHTTP+WebSocket(mTLS)+InProcess), OAuth 2.0 풀스택 (DCR+PKCE+token refresh, 2465 LOC), elicitation/sampling/notification, server approval UX, reconnection, plugin → MCP `.mcpb` bundle, MCP Skills, internal MCP servers (claude-in-chrome, computerUse), `claude mcp serve` |
| 4 | [claw-task-team.md](./claw-task-team.md) | **major** | claw=698 LOC in-memory registry, 원본=13,000 LOC. 6+ task class (LocalAgent/LocalShell/RemoteAgent/Dream/InProcessTeammate), 실 spawn, multi-session cron lock + missed recovery + jitter + recurring/durable, swarm 4585 LOC (inProcessRunner + permissionSync + teamHelpers + mailbox), iTerm/tmux pane backend, coordinator. claw 의 TaskPacket 풍부 구조는 **원본에 없는 추가 설계** (양방향 차이) |
| 5 | [claw-permissions.md](./claw-permissions.md) | **major** | claw=3 mode + 340 LOC PermissionEnforcer, 원본=12,000 LOC. 5+ external mode (default/acceptEdits/bypassPermissions/dontAsk/plan + auto/bubble), YoloClassifier (LLM 기반 권한, 1495 LOC, 2-stage), 8 rule source, rule DSL `Bash(git diff:*)` 파서, plan mode (도구 차단), permission explainer (riskLevel + reasoning), shadowed rule detection, bypass killswitch (enterprise), denial tracking |
| 6 | [claw-tool-system.md](./claw-tool-system.md) | **major** | claw=40 ToolSpec + 단일 match dispatch, 원본=42 dir / 50,800 LOC. 도구마다 buildTool 객체 (15+ field: outputSchema/isEnabled/dynamic prompt/render functions/per-tool perms/searchHint/maxResultSize/getPath), AgentTool 6072 LOC sub-system (forkSubagent/runAgent/resumeAgent/agentMemory/.claude/agents/loadDir), EnterWorktree/ExitWorktree, claw 의 stub 인정 (AskUser/RemoteTrigger/TestingPermission) |
| 7 | [claw-hooks.md](./claw-hooks.md) | **major** | claw=3 event (PreTool/PostTool/UserPromptSubmit), 원본=28 event + 13,765 LOC. PostToolUseFailure/Notification/SessionStart/End/Setup/Stop/SubagentStart/Stop/PreCompact/PostCompact/PermissionRequest/Denied/TeammateIdle/TaskCreated/Completed/Elicitation/ConfigChange/WorktreeCreate/Remove/InstructionsLoaded/CwdChanged/FileChanged. 4 transport (shell + agent LLM + HTTP webhook + prompt inject), AsyncHookRegistry, hook event broadcasting, SSRF guard, frontmatter/skill 자동 등록 |

## 우선순위 8-20 (간략)

| # | 파일 | 차이 심각도 | 한 줄 요약 |
|---|---|---|---|
| 8 | [claw-session.md](./claw-session.md) | medium | claw=in-memory only, 원본=jsonl transcript 영속 + `/resume` + ResumeConversation UI + SessionMemory (LLM 자동 메모리 추출 495 LOC) + bridge/direct-connect/remote 4 종 + LLM 자동 session naming + compact boundary marker + reAppendSessionMetadata. claw 의 fork/merge 는 **추가 설계** |
| 9 | [claw-config.md](./claw-config.md) | medium | claw=3 source (system/user/project), 원본=5+ source (+ localSettings + flagSettings + policySettings) + MDM (OS-managed enterprise policy 527 LOC) + hot reload + ConfigChange hook + schema 검증 1148 + 265 + 164 LOC + plugin-only policy |
| 10 | [claw-cli.md](./claw-cli.md) | medium | claw=clap derive + 6 subcommand + 단순 REPL, 원본=cli→init→main→setup 4단 entry (~5800 LOC) + Print mode (-p) 5594 LOC + structured IO (NDJSON/JSON streaming) 859 + 6 transport + Ink/React 4683 LOC + 100+ slash commands |
| 11 | [claw-api-client.md](./claw-api-client.md) | medium | claw=Anthropic/OpenAI/xAI, 원본=Anthropic+Bedrock+Vertex+Azure+Grove (방향 다름: claw=multi-provider, 원본=multi-cloud enterprise) + retry policy 822 LOC + cache break detection 727 LOC + Files API + admin/quota/overage/ingress/firstTokenDate. claw 의 ProviderClient trait 추상화는 **claw 가 추가** |
| 12 | [claw-file-ops.md](./claw-file-ops.md) | medium | claw=file_ops.rs 744 LOC, 원본=4,194 LOC across 5+ tool dirs. 이미지/PDF 읽기 (imageProcessor), notebook cell-level edit, FileEditTool 1812 LOC (replace_all/multi-edit/dry-run diff UI/encoding 자동/매칭 algo), atomic write, grep chunking, per-tool prompt |
| 13 | [claw-plugin.md](./claw-plugin.md) | **major** | claw=PluginKind 3 + manifest, 원본=22,227 LOC 44 모듈. Anthropic 공식 marketplace + 사용자 marketplace + zip cache + 서명 검증 (903) + autoupdate + blocklist + flagging + dependency resolver + MCP `.mcpb` bundle + LSP integration + 4 entity (agents/commands/hooks/output-styles vs claw 의 tool/hook/context) + telemetry + headless install |
| 14 | [claw-policy-engine.md](./claw-policy-engine.md) | **claw 추가 설계** | 원본에 PolicyEngine 자체가 없음. 자율 자동화 / Lane / GreenContract / Rule DSL 모두 **claw 가 추가** — 원본의 cron + sub-agent + hook 조합으로 흉내 가능하지만 별도 엔진은 없음. 면접 차별점 |
| 15 | [claw-recovery.md](./claw-recovery.md) | **claw 추가 설계** | 원본에 RecoveryEngine 없음. PolicyEngine 위 sub-system. 원본의 가장 가까운 것은 withRetry.ts (822 LOC, transient retry only) 와 LSP/MCP reconnection. claw 의 recipe DSL + StaleBranch detector + escalation 은 **claw 추가** |
| 16 | [claw-subagent-orchestration.md](./claw-subagent-orchestration.md) | **major** | claw=AgentTool + worktree isolation + TeamLead/Workers, 원본=13,000 LOC sub-system (AgentTool 6072 + LocalAgentTask 682 + RemoteAgentTask 855 + swarm 4585 + coordinator 369 + teammateMailbox 1183). 사용자 정의 agent (`.claude/agents/` markdown frontmatter) 누락, agent memory 누락, iTerm/tmux pane backend 누락, remote agent (다른 머신 WebSocket) 누락, color manager 누락 |
| 17 | [claw-telemetry.md](./claw-telemetry.md) | medium | claw=TelemetrySink + 10 event + Exporter, 원본=8,155 LOC. Datadog APM, Bigquery exporter (BQ 운영 데이터 사례), Perfetto tracing, OpenTelemetry instrumentation, Statsig/Growthbook feature flag 통합, sinkKillswitch (회사/사용자 telemetry off), per-plugin telemetry, 메타데이터 973 LOC (browser/OS/terminal/model/IDE detection) |
| 18 | [claw-worker-boot.md](./claw-worker-boot.md) | medium | claw=8-state WorkerStatus 명시 + TrustResolver + Misdelivery, 원본=swarm/spawn/teammate ~4500 LOC implicit state. claw 의 명시 상태머신은 **정리/strength**. 원본은 permissionSync 928 + teammateMailbox 1183 + iTerm/tmux pane backend + reconnection + layout 복구 |
| 19 | [claw-overview.md](./claw-overview.md) | meta | claw=9 Cargo crates + Python parity engine + 9-lane checkpoint + Mock parity harness, 원본=1902 TS files + Bun + React/Ink + Anthropic/Bedrock/Vertex/Azure/Grove. 9 lane 별 단순화 비율 1/30 ~ 1/86. claw 의 추가 설계 (PolicyEngine/Recovery/TaskPacket 구조화/WorkerStatus 명시) 와 Python parity engine (원본 부재) |
| 20 | [openclaw-assistant.md](./openclaw-assistant.md) | n/a | OpenClaw 는 별도 프로젝트 (Pi Coding Agent SDK 임베드 다중 채널 어시스턴트). claw-code 직접 비교 대상 아님. 원본의 가장 가까운 패턴은 `entrypoints/sdk/` + `bridge/` + `server/createDirectConnectSession.ts`. 원본은 메시징 채널 통합 없음 |

## 차이 종류 통계

- **major (본질 차이 / 누락 깊음 / 단순화 비율 큼)**: 8개 — compaction, bash, mcp, task-team, permissions, tool-system, hooks, plugin, subagent-orchestration
- **medium (단순화 + 일부 누락, 핵심 동작은 유사)**: 7개 — session, config, cli, api-client, file-ops, telemetry, worker-boot
- **claw 추가 설계 (원본에 대응 없음)**: 2개 — policy-engine, recovery
- **meta (전체 비교)**: 1개 — overview
- **별도 프로젝트**: 1개 — openclaw-assistant
- **부분적 추가 설계** (위 카테고리에도 포함): TaskPacket 구조화 (task-team), Fork/merge (session), ProviderClient trait (api-client), WorkerStatus 명시 (worker-boot)

## 공통 패턴

블로그 전반의 보강 권장 사항:

1. **각 글 Overview 에 "원본과의 의도적 차이" callout** 추가 — claw 의 단순화는 trade-off, 원본의 깊이는 운영 데이터 기반
2. **claw 가 추가한 설계 부각** — PolicyEngine, Recovery, TaskPacket, ProviderClient trait, WorkerStatus 명시 등은 **claw 의 strength**. 원본에 없는 것이 약점이 아니라 차별점
3. **PARITY.md 인용 적극 활용** — "Still limited" / "branch-only" 같은 honest 표현은 claw 자체가 자가 인정한 trade-off
4. **운영 데이터 사례 추가** — 원본의 "BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272)" 같은 코멘트는 면접에서 "왜 이게 필요해?" 답이 됨
5. **단순 LOC 비교가 아니라 메커니즘 본질 차이 강조** — bash 의 tree-sitter AST vs first-word match, compaction 의 LLM vs 결정론, MCP 의 5 transport vs stdio-only

## 한계 / 후속 작업

이 비교는 정적 코드 분석 기반. 다음은 추가 검증 가치 있음:

- 실제 동작 비교 (claw 와 Claude Code 같은 프롬프트로 돌려서 결과 차이)
- 토큰 효율 비교 (claw 결정론 압축 vs LLM 압축의 정보 보존도)
- 성능 비교 (Rust vs TS 실측 latency)
- 원본의 features (KAIROS, REACTIVE_COMPACT, TRANSCRIPT_CLASSIFIER, MCP_SKILLS 등) 활성 시 동작 차이
