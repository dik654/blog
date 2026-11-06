# 에이전트 구현 현황 비교 근거 (조사일 2026-11-06)

표기: **[문서]** 공식 문서가 말하는 동작, **[코드]** 조사 시점 코드를 정적으로 읽어 본 동작(실행 검증 아님), **미확인** 확인하지 못한 칸. `[C1]` 같은 번호는 맨 아래 출처 목록을 가리킨다.

## 0. 조사 대상과 상태

| 구현 | 상태 | 조사 기준 | 근거 |
|---|---|---|---|
| Claude Code | 활성. 비공개 소스. 공개 저장소 최상위에는 plugins, examples, scripts 등만 있어 코드 확인 불가 | 최신 릴리스 v2.1.318 (2026-11-04), 문서 기준 | [C0] |
| OpenAI Codex CLI | 활성. 문서 사이트가 `developers.openai.com/codex`에서 `learn.chatgpt.com/docs`로 308 이동 | rust-v0.167.0 (2026-11-06), `7b8d67e` | [X0] |
| Gemini CLI | **활성이지만 역할 축소.** 2026-06-18부터 무료·Google AI Pro/Ultra 접근이 Antigravity CLI로 이동. README가 Code Assist Standard/Enterprise 전용이며 Gemini 4 이상에 최적화되지 않았다고 명시 | v0.67.0 (2026-11-04), `3fd7d26` | [G0] |
| Cursor (agent) | 활성. 비공개 소스, 문서만 확인 | 문서 기준(변경 기록 최신 항목 2026-11-05) | [U0] |
| OpenHands | 활성. **구조 변경:** `OpenHands/OpenHands`는 이제 Agent Canvas(브라우저 클라이언트). 문서가 "에이전트 런타임이나 샌드박스가 아니다"라고 하며 실행은 `OpenHands/software-agent-sdk`의 Agent Server가 맡음. 아래 코드 칸은 SDK 기준 | 앱 v1.36.0, `8756b3b` / SDK v1.60.1, `295b3ba` | [H0] [H1] |
| OpenClaw | 매우 활성. 코딩 CLI보다 메시지 채널 중심 게이트웨이 에이전트라 다른 구현과 전제가 다름 | v2026.11.1 (2026-11-05), `7302f00` | [O0] |
| ultraworkers/claw-code | 활성. 저장소 설명과 README가 "agent-managed exhibit", 박물관 전시물에 가깝다고 규정. Anthropic과 무관함을 명시 | v0.1.11 (2026-11-04), `ab8561d` | [W0] |
| **추가: OpenCode** | 활성. 저장소가 `sst/opencode`에서 `anomalyco/opencode`로 리다이렉트. 현재 문서는 V2 | v2.2.5 (package.json), `7f21b6d` (dev 브랜치) | [P0] |
| **추가: Antigravity CLI** | 활성. 비공개 소스 여부 미확인, 문서만 확인 | 문서 기준(문서에 v2.29 이전 표기가 있음) | [A0] |

추가 이유. OpenCode는 스타 224,859개로 7개 대상 중 OpenClaw를 빼면 어떤 코딩 CLI 저장소보다 많고, Gemini CLI 대신 개인 사용자가 옮겨 가야 하는 Antigravity CLI(`agy`)는 Google이 README에서 지정한 후속 도구다. 검토 후 제외: Cline(71,380, `cline/cline`), goose(56,275, `block/goose`가 `aaif-goose/goose`로 리다이렉트).

스타 수는 2026-11-06 gh api 값이다. Claude Code 154,702, Codex 133,389, Gemini CLI 108,748, OpenHands 92,773, claw-code 194,948, OpenClaw 394,004. 스타는 사용량이 아니라 관심도 지표다.

## 1. 에이전트 루프와 turn 구조

| 구현 | 확인한 사실 | 출처 |
|---|---|---|
| Claude Code | [문서] 한 turn은 모델 출력 한 번과 그 도구 실행. 도구 호출 없는 응답이 나올 때까지 반복. `max_turns`, `max_budget_usd` 기본값은 제한 없음 | [C1] |
| Codex CLI | [코드] `run_turn` 안에서 sampling 요청을 반복하고 `needs_follow_up = model_needs_follow_up \|\| has_pending_input`일 때 계속. 전용 루프 문서는 찾지 못함 | [X1] |
| Gemini CLI | [코드] `client.ts`가 `MAX_TURNS = 100`을 두고, 모델 응답 뒤 `checkNextSpeaker`로 계속 여부를 별도로 판단(설정으로 생략 가능) | [G1] |
| Cursor | [문서] "tools in a loop"라는 개념 설명과 도구 호출 수 제한이 없다는 사실만 공개. turn 경계 정의는 미확인 | [U1] [U2] |
| OpenHands | [문서·코드] `step()` 한 번이 추론 한 주기인 단일 스텝 모델, Agent는 stateless. `max_iteration_per_run` 기본 500, stuck detection 기본 켜짐 | [H2] [H3] |
| OpenClaw | [문서] 세션별로 직렬화된 실행. `agent` RPC는 `runId`를 즉시 반환하고 `agent.wait`로 결과를 기다림. 런타임 교체 가능(`openclaw`, `codex`, `claude-cli`, `copilot`, `muse`) | [O1] [O2] |
| claw-code | [코드] `run_turn`이 도구 호출이 없을 때까지 반복. `max_iterations` 기본 `usize::MAX`, 서브에이전트는 32 | [W1] [W2] |
| OpenCode | [코드] `session/runner/step.ts`가 스텝을 실행하고 스텝 한도를 넘기면 도구를 끈 응답으로 마무리("Tools are disabled after the maximum agent steps") | [P1] |
| Antigravity CLI | 미확인. 실행 모드 문서는 승인 동작만 설명 | [A1] |

## 2. 도구 실행과 셸

| 구현 | 확인한 사실 | 출처 |
|---|---|---|
| Claude Code | [문서] 읽기 전용 도구와 read-only 표시된 MCP 도구는 동시 실행 가능, `Edit`·`Write`·`Bash`는 순차. 커스텀 도구는 `readOnlyHint` 없으면 순차. Bash 출력 기본 30,000자. MCP 도구 스키마는 tool search로 지연 로드 | [C1] [C2] |
| Codex CLI | [코드] 도구별 `supports_parallel_tool_calls`로 RwLock read/write를 나눔. 기본 false지만 `exec_command`와 `write_stdin`은 true, 즉 **셸도 병렬 허용**. MCP는 서버별 opt-in. [문서] `tool_output_token_limit` 설정 | [X2] [X3] [X4] [X5] |
| Gemini CLI | [코드] 연속된 병렬 가능 호출을 묶어 실행. 편집 도구는 제외하고, 모델이 `wait_for_previous`로 순서를 강제할 수 있음. 출력 기본 임계값 40,000자, 초과분은 파일로 저장 | [G2] [G3] [G4] |
| Cursor | [문서] 도구는 파일·검색·웹·셸 등. 일반 도구 병렬 실행 규칙은 미확인, Explore 서브에이전트의 병렬 검색과 Task 다중 호출만 확인 | [U2] [U6] |
| OpenHands | [문서·코드] `tool_concurrency_limit` 기본 1(순차), 실험 기능. 올리면 `declared_resources()`와 ResourceLockManager로 공유 자원을 직렬화. 터미널 출력 상한 30,000 | [H4] [H5] |
| OpenClaw | [문서] `exec`는 파일 변경 가능한 셸로 취급, gateway·sandbox·worker에서 포그라운드·백그라운드 실행. MCP 서버별 병렬 호출 설정 키는 존재. 내장 도구 병렬 규칙은 미확인 | [O3] [O4] |
| claw-code | [코드] `run_turn`이 `pending_tool_uses`를 for 루프로 **순차 실행**. `mvp_tool_specs`로 정적 등록, `ToolSearch` 있음. `maxParallelToolCalls` 파싱 커밋이 이력에 있으나 HEAD의 `rust/crates`에서 그 문자열은 검색되지 않음 | [W1] [W3] |
| OpenCode | [코드] 도구 호출마다 fiber를 띄우고 `Fiber.awaitAll`로 모음. 출력 상한 2,000줄 또는 50 KiB. [문서] Code Mode로 병렬 호출 조합 가능 | [P1] [P2] [P3] |
| Antigravity CLI | [문서] 훅 matcher에 `run_command`가 보임. 병렬·출력 처리 규칙은 미확인 | [A2] |

## 3. 권한과 샌드박스

| 구현 | 승인 모드 | OS 격리 | 네트워크 | 출처 |
|---|---|---|---|---|
| Claude Code | [문서] `default`, `acceptEdits`, `plan`, `auto`(분류기), `dontAsk`, `bypassPermissions`. deny 규칙은 전 모드 적용. v2.1.283부터 대화형 기본 시작 모드가 auto | [문서] macOS Seatbelt, Linux·WSL2 bubblewrap. **네이티브 Windows는 비샌드박스** | [문서] 로컬 프록시가 호스트명을 검사, 허용 목록 초기값 비어 있음. UDP·QUIC·ICMP 불가 | [C3] [C4] [C5] |
| Codex CLI | [문서] sandbox 모드와 `approval_policy` 분리. **`untrusted` 정책은 폐지.** 경계 승인은 별도 리뷰 에이전트(auto-review)에 맡길 수 있음. permission profile은 베타 | [문서·코드] macOS Seatbelt, Linux·WSL2 bubblewrap + seccomp, Windows 네이티브 샌드박스. Landlock은 deprecated 기능 플래그 | [문서] 기본 네트워크 없음. 도메인 규칙은 network proxy를 켜야 강제됨 | [X6] [X7] [X8] [X9] |
| Gemini CLI | [문서] `default`, `auto_edit`, `yolo`, `plan`. TOML 정책 엔진은 우선순위 기반 | [문서] `tools.sandbox`(설정 문서는 "legacy full-process"로 표기): Seatbelt, Docker, Podman, gVisor, LXC, Windows Low Mandatory. 기본 꺼짐. [코드] 도구 단위 관리자(bwrap, Seatbelt, Windows)가 있고 `security.toolSandboxing` 기본 false. **샌드박스 문서에는 bubblewrap 언급이 없어 문서와 코드에 차이** | [문서] Seatbelt 기본 프로필 `permissive-open`은 네트워크 허용, `-proxied` 프로필은 프록시 경유 | [G5] [G6] [G7] [G8] |
| Cursor | [문서] Run Mode: Auto-review(분류기), Allowlist, Run Everything. MCP 도구 호출은 기본 건별 승인 | [문서] macOS Seatbelt, Linux Landlock + seccomp(커널 6.2 이상), Bubblewrap 폴백. Windows는 미확인 | [문서] `sandbox.json`의 `networkPolicy` 기본 deny, 사설망과 클라우드 메타데이터 주소 차단 | [U3] [U4] [U5] |
| OpenHands | [문서·코드] `AlwaysConfirm`, `NeverConfirm`, `ConfirmRisky`(보안 분석기 필요). LLM 분석기 포함 | [문서] OS 프리미티브가 아니라 **작업 공간 단위 격리**: Docker, Apptainer, API 기반, Cloud. 문서는 배포별로 달라진다고 함 | 미확인 | [H6] [H7] [H1] |
| OpenClaw | [문서] 셸 모드 `deny`, `allowlist`, `ask`, `auto`, `full`. 샌드박스·도구 정책·elevated 세 축 분리. 권장은 `auto` | [문서] **기본 꺼짐**. `off`, `non-main`, `all`. 백엔드 Docker, Podman, SSH, OpenShell, Crabbox. 문서 스스로 완전한 경계가 아니라고 함 | [문서] Docker 기본 `network: "none"`, 읽기 전용 루트, `capDrop: ALL` | [O5] [O6] [O7] [O8] |
| claw-code | [문서] `read-only`, `workspace-write`(기본), `danger-full-access`. [코드] enum에 `Prompt`, `Allow`도 있음 | [코드] **Linux `unshare`만.** 그 외 플랫폼은 isolation unavailable로 보고. 컨테이너 감지 포함. 고정 커밋의 변경이 바로 이 경로의 `--map-auto` 폴백 | [코드] `--net`은 opt-in 네임스페이스. 도메인 허용 목록은 미확인 | [W4] [W5] |
| OpenCode | [문서] 규칙은 allow·ask·deny 순서 평가. **기본 정책은 전부 allow**, `.env` 읽기만 ask, 외부 디렉터리도 기본 허용. `--auto`로 자동 승인. Plan 에이전트는 편집 거부 | 문서에서 OS 샌드박스를 찾지 못함. [코드] `packages/core/src`에 bubblewrap·seatbelt·landlock 문자열 없음(다른 패키지 전체는 미확인) | [문서] 프록시 환경 변수 설명뿐, 도구 네트워크 제한은 미확인 | [P4] [P5] [P6] |
| Antigravity CLI | [문서] Deny > Ask > Allow. 프리셋 Request Review, Default, Auto, Turbo | [문서] Linux 네임스페이스, macOS `sandbox-exec`, Windows AppContainer | [문서] 기본 차단, `read_url` 허용 도메인을 아웃바운드 허용 목록에 추가 | [A3] [A4] |

## 4. 컨텍스트 관리와 압축

| 구현 | 확인한 사실 | 출처 |
|---|---|---|
| Claude Code | [문서] 한도 근접 시 자동 요약. 압축 후 루트 CLAUDE.md와 auto memory는 디스크에서 재주입, 파일 최대 5개 재읽기, 스킬 본문은 스킬당 5,000·합계 25,000토큰 한도로 재주입. thrashing 시 자동 압축 중단 | [C6] [C7] |
| Codex CLI | [코드] 모델 제공자가 지원하면 원격 압축 V2, 아니면 인라인 로컬 요약. 사용자 메시지를 최대 20,000토큰까지 보존. [문서] `/compact`, `model_auto_compact_token_limit`, `compact_prompt` | [X10] [X11] [X5] |
| Gemini CLI | [문서·코드] 임계값 기본 0.5, 최근 30% 보존. `<state_snapshot>` 생성 뒤 코드상 별도 "Probe" 검증 단계가 있음. 오래된 도구 응답은 역방향 토큰 예산으로 먼저 자름 | [G9] [G10] |
| Cursor | [문서] `/summarize`(별칭 `/compress`), 관찰용 `preCompact` 훅. 자동 압축 조건과 알고리즘은 미확인 | [U7] [U8] |
| OpenHands | [문서·코드] 기본 `LLMSummarizingCondenser`, `max_size` 기본 240 이벤트, `keep_first` 기본 2. 토큰이 아니라 이벤트 수 기준이 함께 작동, 컨텍스트 오류 시 condensation 요청 | [H8] [H9] |
| OpenClaw | [문서] 요약을 transcript에 저장, 도구 호출·결과 쌍을 유지하도록 경계 이동. 오래된 도구 결과를 별도로 잘라내는 session pruning. 압축 방식을 plugin context engine으로 교체 가능, OpenAI는 서버 측 압축 가능 | [O9] [O10] [O11] |
| claw-code | [코드] 기본 최근 메시지 4개 보존, 추정 10,000토큰 기준. 자동 압축 입력 임계값 100,000토큰. `compact.rs`의 `summarize_messages`에 모델 호출이 보이지 않아 규칙 기반 요약으로 판단. Trident 파이프라인(supersede, collapse, cluster) 별도 | [W6] [W2] [W7] |
| OpenCode | [문서] 자동 압축 기본 켜짐. 전체 대화를 요약 요청에 보내 프롬프트 캐시를 재사용하고 최근 토큰 구간을 유지(문서 그림 15k). [코드] `auto`와 `overflow` 두 경로, 이후 압축은 체크포인트 이후 대화로 갱신 | [P7] [P8] |
| Antigravity CLI | [문서] `/context` 패널이 압축 체크포인트를 표시. 알고리즘과 임계값은 미확인 | [A5] |

## 5. 세션 저장·재개·복구

| 구현 | 확인한 사실 | 출처 |
|---|---|---|
| Claude Code | [문서] `~/.claude/projects/<project>/<session-id>.jsonl`, 기본 30일 보존, 내부 형식은 비공개 계약. `--continue`, `--resume`, `/branch`. 중단된 도구는 재실행하지 않음. `/rewind`는 파일 스냅샷 100개까지, Bash 전용 변경은 미추적 | [C8] [C9] |
| Codex CLI | [코드] `~/.codex/sessions`에 rollout JSONL, SQLite 상태 DB 병행. rollout에서 세션 재구성. [문서] `codex resume`, `codex fork`, `--worktree` | [X12] [X13] [X14] |
| Gemini CLI | [문서·코드] `~/.gemini/tmp/<project_hash>/chats/`, JSONL 기록. `--resume`, 보존 설정. `/rewind`와 `/restore`, 체크포인트는 `~/.gemini/history`의 그림자 Git 저장소 | [G11] [G12] [G13] [G14] |
| Cursor | [문서] `--resume`, `--continue`, `agent ls`. 체크포인트는 로컬 저장, Git과 분리. 저장 위치와 형식, 크래시 복구는 미확인 | [U9] [U10] [U8] |
| OpenHands | [문서·코드] `persistence_dir` 아래 `base_state.json`과 `events` 디렉터리. 같은 ID로 복원. 일시 정지·재개 API 존재 | [H10] [H11] |
| OpenClaw | [문서] **에이전트별 SQLite**에 세션 행과 트리 구조 transcript. 비활성 기록은 압축 JSONL로 콜드 저장 가능. 재시작 시 작업 중이던 루트 세션에 재개 입력을 한 번 보내고 실행을 재생하지는 않음 | [O12] [O13] [O14] |
| claw-code | [코드] `<cwd>/.claw/sessions/<workspace_hash>/`에 JSONL, 256KB 회전, 3개 보관, fork 출처 기록. 6개 실패 시나리오의 자동 복구 레시피. [문서] `--resume latest` | [W8] [W9] [W10] |
| OpenCode | [코드] SQLite 저장, 스텝 시작 시 스냅샷. [문서] `--continue`, `--session`, `/undo`로 대화·파일을 함께 되돌림. CLI 코드에 `fork` 옵션 | [P9] [P1] [P10] [P11] |
| Antigravity CLI | [문서] `agy -c`, 작업 공간별 마지막 대화 캐시 `~/.gemini/antigravity-cli/cache/last_conversations.json`, `/fork`. transcript 저장 형식과 크래시 복구는 미확인 | [A6] [A7] |

## 6. 서브에이전트·멀티에이전트 위임

| 구현 | 확인한 사실 | 출처 |
|---|---|---|
| Claude Code | [문서] 서브에이전트는 메인 아래 **3단계**까지. 포크, worktree 격리, 스크립트형 dynamic workflows, agent view, 실험 기능인 agent teams(기본 꺼짐, 직접 메시지) | [C10] [C11] |
| Codex CLI | [코드] `multi_agent`는 deprecated, `multi_agent_v2`는 stable이나 기본 false. 기본 스레드 6, **깊이 1**. V2에 `send_message`, `followup_task`, `interrupt_agent`. [문서] 서브에이전트 기본 활성, 부모의 샌드박스·승인 상속 | [X15] [X16] [X17] |
| Gemini CLI | [문서] 도구로 노출, 독립 컨텍스트. 내장 Codebase Investigator, CLI Help, Generalist, Browser. `.gemini/agents/*.md`. 원격은 A2A. 깊이 제한은 미확인 | [G15] [G16] |
| Cursor | [문서] 깨끗한 컨텍스트로 시작, foreground·background, 내장 2개(Explore 포함). 서브에이전트별 worktree 또는 클라우드 VM. 조정자가 위임하는 Projects. 깊이 제한은 미확인 | [U6] [U11] |
| OpenHands | [문서] `TaskToolSet`은 **동기·순차**, 재개 가능. ACP로 Claude Code, Gemini CLI 등을 에이전트로 호출. 깊이 제한은 미확인 | [H12] [H13] |
| OpenClaw | [문서] `sessions_spawn`, 기본 격리, thread 바인딩은 fork 기본. **깊이 기본 5(1~5)**, 자식 5, 동시 8. 결과는 announce 체인으로 전달. ACP 에이전트 지원 | [O15] [O16] [O17] |
| claw-code | [코드] `Agent` 도구가 OS 스레드(`clawd-agent-*`)를 띄움. 유형별 도구 허용(Explore, Plan, Verification, general-purpose). Task, Worker, Team, Cron 도구 등록. 깊이 제한은 미확인 | [W11] [W3] |
| OpenCode | [문서] 서브에이전트는 새 컨텍스트, 자식 세션으로 foreground·background. 내장 General은 **추가 서브에이전트 생성 불가**, Explore는 읽기 전용 | [P5] [P12] |
| Antigravity CLI | [문서] 대화 이력 비상속, `branch`면 격리 worktree, 내장 `research` 등. **중첩 최대 10단계** | [A8] |

## 7. 확장 방식

| 구현 | MCP | Skills | Hooks | Plugins | 지시 파일 | 출처 |
|---|---|---|---|---|---|---|
| Claude Code | [문서] stdio, HTTP. tool search | Agent Skills 표준 + 확장 | 33개 이벤트, `command`·`http`·`mcp_tool`·`prompt`·`agent` | 마켓플레이스, 번들 | CLAUDE.md 기본, 저장소의 AGENTS.md도 읽음 | [C12] [C13] [C14] [C15] [C16] |
| Codex CLI | [문서] stdio, Streamable HTTP, OAuth. [코드] 2026-07-28 요청 분기 코드 존재 | `.agents/skills`, agentskills.io | `PreToolUse`, `PostToolUse`, `PreCompact` 등 | 번들·마켓플레이스 | AGENTS.md, AGENTS.override.md, 32 KiB 한도 | [X18] [X19] [X20] [X21] [X22] [X23] |
| Gemini CLI | [문서] stdio, SSE, Streamable HTTP | `.gemini/skills`, `.agents/skills`, agentskills.io | 11개, `command`만. 이름이 고유(`BeforeTool` 등) | extension(`gemini-extension.json`) | GEMINI.md 기본, `context.fileName`으로 AGENTS.md 지정 | [G17] [G18] [G19] [G20] [G21] |
| Cursor | [문서] stdio, SSE, Streamable HTTP. Tools, Prompts, Resources, Roots, Elicitation, Apps | `.agents/skills`, `.cursor/skills`, Claude·Codex 경로 호환 | 19개 확인, command·prompt. Claude Code 훅 로드 가능 | Cursor 형식과 Agent Plugins 표준 | `.cursor/rules/*.mdc`, 중첩 AGENTS.md | [U12] [U13] [U14] [U15] [U16] |
| OpenHands | [문서·코드] fastmcp 기반, OAuth | 확장 AgentSkills + 키워드 트리거 | 6개, exit 2로 차단 | `.plugin/plugin.json`, Claude Code 구조 호환 | AGENTS.md 등 서드파티 파일 로드 | [H14] [H15] [H16] [H17] |
| OpenClaw | [문서] 서버와 클라이언트 양방향. Streamable HTTP, SSE, stdio | AgentSkills, 우선순위 7단계 | 내부 훅(`HOOK.md`)과 타입드 플러그인 훅 분리 | **네이티브 플러그인은 프로세스 내 로드.** Agent Plugins, Codex, Claude, Cursor 번들 호환 | AGENTS.md, SOUL.md, USER.md 등 작업 공간 파일 | [O4] [O18] [O19] [O20] [O21] [O22] [O23] |
| claw-code | [코드] 설정 enum은 stdio, SSE, HTTP, WS, SDK, ManagedProxy지만 `McpServerManager`는 비stdio를 unsupported로 처리. 자체 서버 프로토콜 `2025-03-26` | `.claw`, `.claude`, `.codex`, `.agents`, OpenCode 경로 조회. `/home/bellman/...` 하드코딩 경로 존재 | `PreToolUse`, `PostToolUse`, `PostToolUseFailure` | `.claude-plugin/plugin.json` | CLAUDE.md, CLAW.md, AGENTS.md 등 | [W12] [W13] [W14] [W15] [W16] [W17] |
| OpenCode | [문서·코드] 로컬 stdio, 원격 OAuth. `@modelcontextprotocol/client` 사용 | `.opencode/skills`, `.claude/skills`, `.agents/skills` | 서버 플러그인 안의 런타임 훅. 이름 목록 미확인 | 서버, TUI, GUI 플러그인 | **V2는 AGENTS.md만**, CLAUDE.md 폴백 없음 | [P13] [P14] [P15] [P16] [P17] |
| Antigravity CLI | [문서] stdio, 원격은 Streamable HTTP만 | `.agents/skills`(`.agent/skills` 호환) | `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, `Stop`, `SessionStart` 확인 | `plugin.json`, 마켓플레이스, `agy plugin import gemini` | AGENTS.md 또는 GEMINI.md, 작업 폴더 아래 하위 폴더는 로드 안 함 | [A9] [A10] [A2] [A11] [A12] [A13] |

## 8. MCP 명세

- **현재 버전은 여전히 `2026-07-28`.** 버전 문서가 current로 명시하고, 새 날짜 릴리스나 태그가 없다 [M1] [M2].
- **블로그 기준일 이후 프로토콜 변경 없음.** draft 변경 기록은 비어 있다 [M3]. `schema/2026-07-28`에는 커밋이 없고, `schema/draft/schema.ts`와의 차이는 링크 경로 4줄뿐이다 [M4].
- **명세 문서의 사후 수정은 설명·예제 수준.** 2026-07-28 트리: 구독 완료 결과 설명(07-29), "Serves" 오타(09-22), embedded resource 예제의 annotations 위치(10-28) [M5]. draft에는 아이콘 MIME 설명, safe-integer 설명, CIMD 예제 수정이 추가됐다 [M6].
- **거버넌스와 확장 쪽 변화.** SEP-3392 Extension Lifecycle은 Final, SEP-3398 Release Cycle Updates는 Accepted(2026-10), MCP Server Cards SEP-2127 병합(2026-10-06) [M7] [M8] [M9]. 로드맵은 2026-08-22 갱신 [M10]. Ruby SDK Tier 1 공지(2026-10-30) [M11].
- **글에서 확인할 기존 사실.** 2026-07-28의 주요 변경은 프로토콜 세션과 초기화 핸드셰이크 제거, `server/discover`, `subscriptions/listen`, MRTR, `resultType` 필수 등이다 [M12]. Roots, Sampling, Logging, DCR, HTTP+SSE는 deprecated 목록에 있다 [M13].
- **구현 격차.** Cursor, Gemini CLI, OpenClaw는 deprecated인 SSE 전송 지원을 문서화했고, claw-code 코드의 자체 서버 버전은 `2025-03-26`이다. Codex와 OpenClaw 코드에는 2026-07-28 관련 분기가 보인다. 각 클라이언트의 2026-07-28 완전 준수 여부는 미확인이다.

## 9. claw-code와 OpenClaw 저장소 상태

| 항목 | ultraworkers/claw-code | openclaw/openclaw |
|---|---|---|
| 최근 커밋 | `ab8561d` 2026-11-04T22:01:42Z | `7302f00` 2026-11-06T05:55:35Z |
| 최신 릴리스 | v0.1.11, 2026-11-04 | v2026.11.1, 2026-11-05 |
| 최근 30일 커밋(10-07 이후, committer 기준) | 166개 | 20,151개 |
| 스타·포크 | 194,948 / 107,507 | 394,004 / 82,793 |
| 열린 이슈+PR | 1 | 7,636 |
| 생성일·라이선스 | 2026-03-31, MIT | 2025-11-24, MIT |
| 활동 평가 | 활성이나 **10월 첫 주에 집중.** 주별 142(10-07), 10(10-14), 3(10-21), 11(10-28 이후) | 매우 활성. 11-01 이후만 Vincent Koc 670, RoboClaw 629, Peter Steinberger 414 |

**블로그 고정 커밋 `b71afddae100ced324457337925a694686b8fef2`**
- 날짜: 2026-08-06T11:18:35Z. PR #3280, `--map-auto` 샌드박스 폴백 병합 커밋.
- 그 뒤: compare API 기준 **177 커밋 앞섬, 0 뒤처짐**(변경 파일 96개). 작성자 상위 clawdbot 50, Bellman 47. 작성일 기준 10월이 113개.
- 글에 영향이 큰 변경 규모: `conversation.rs` 1,302줄, `session_settings.rs` 1,285줄, `permissions.rs` 215줄. `compact.rs`는 2줄, `sandbox.rs`는 6줄.
- 설명은 "no human intervention"이지만 다수 작성자 이름이 있고, 사람 작성 여부는 미확인이다. `PARITY.md`의 마지막 갱신일은 2026-04-03이라 최신 상태 근거로 쓰면 안 된다.

## 10. 차이가 가장 큰 곳과 수렴한 곳

**차이가 가장 큰 곳: 3번 권한과 샌드박스.** 기본 태세부터 갈린다.
- 샌드박스 명령의 기본 네트워크 차단이 문서화된 쪽: Codex, Cursor, Antigravity. Claude Code도 샌드박스 내부에서는 허용 목록이 빈 상태로 시작한다.
- 샌드박스가 기본 꺼짐이거나 기본 허용: Gemini CLI(샌드박스 미설정), OpenClaw(`off`), OpenCode(전부 allow).
- 같은 Linux에서도 기술이 네 갈래다: bubblewrap(Claude Code, Codex), Landlock + seccomp(Cursor), `unshare`(claw-code), 컨테이너 단위(OpenHands, OpenClaw).
- Windows: Claude Code는 비샌드박스, Codex와 Gemini CLI는 네이티브 격리.
- 분류기 자동 승인은 Claude Code `auto`, Codex auto-review, Cursor Auto-review, OpenClaw `auto`, Antigravity `Auto`로 번지는 흐름이다. 다만 경계와 동작은 서로 다르다.

**두 번째로 큰 곳: 6번 위임.** 깊이 기본값이 1(Codex), 3(Claude Code), 5(OpenClaw), 10(Antigravity)이고, OpenHands `TaskToolSet`은 동기 순차, OpenCode General은 재위임 금지다. 2번의 셸 병렬도 갈린다. Codex와 OpenCode는 병렬, Claude Code는 Bash 순차, OpenHands는 기본 전부 순차, claw-code는 순차 루프다.

**사실상 수렴한 곳: 7번 확장의 표면.**
- `SKILL.md`: 조사한 9개 전부 지원. 대부분 agentskills.io 또는 `.agents/skills`를 명시.
- AGENTS.md: 9개 모두 사용 가능. 다만 Gemini CLI는 `context.fileName` 설정이 필요하고, Claude Code는 CLAUDE.md가 기본이며, OpenCode V2는 AGENTS.md만 읽어 방향이 반대다.
- MCP: 9개 전부 클라이언트 보유. 지원 전송과 명세 버전은 다르다.
- 훅: 도구 실행 전후 지점은 공통이고 `PreToolUse` 이름을 쓰는 구현이 많다. Gemini CLI(`BeforeTool`)와 Cursor(`preToolUse` 외 셸·MCP 전용 지점)는 다르다. 입출력 형식까지 같은지는 전수 비교하지 않았다.
- 호환 로드: Cursor는 Claude Code 훅, OpenHands와 claw-code는 Claude Code 플러그인 구조, OpenClaw는 Agent Plugins·Codex·Claude·Cursor 번들을 받는다.
- 플러그인: 번들 개념은 공통이나 매니페스트는 통일되지 않았다. 신뢰 모델은 OpenClaw의 프로세스 내 로드처럼 다르다.

**루프의 기본형도 대체로 수렴했다.** "도구 호출이 없을 때까지 반복"이 코드나 문서로 확인된 구현의 공통형이다. 다만 Gemini CLI의 next-speaker 판단, OpenClaw의 Responses `end_turn: false` 처리처럼 종료 조건은 조금씩 다르다. 이는 조사자의 종합 판단이다. 저장 형식은 JSONL(Claude Code, Codex, Gemini CLI, claw-code)과 SQLite(OpenClaw, OpenCode, Codex 병행)로 나뉜다.

## 11. 미확인 범위와 한계

- **코드 검증 불가:** Claude Code, Cursor, Antigravity CLI는 문서만 확인했다.
- **미확인 칸:** Cursor의 turn 정의·일반 도구 병렬·자동 압축 조건·세션 저장 형식·Windows 샌드박스, Antigravity의 루프·도구 병렬·압축 알고리즘·transcript 형식, OpenClaw 내장 도구 병렬 규칙, OpenHands 네트워크 제한, OpenCode 훅 이름, Gemini·Cursor·OpenHands·claw-code의 서브에이전트 깊이 제한.
- **코드 칸은 정적 읽기와 문자열 검색 결과다.** 실행 검증이 아니며, 기능 플래그와 빌드 조건에 따라 실제 동작이 다를 수 있다.
- **"문서에서 찾지 못함"은 부재 증명이 아니다.** 특히 OpenCode OS 샌드박스 부재는 `packages/core/src`와 공개 문서 범위로 한정된다.
- **OpenClaw, Gemini CLI 문서 칸은 저장소 `docs/`를 고정 커밋으로 읽었다.** 게시된 사이트와 약간 다를 수 있다.
- **제외한 근거:** Google 전환 블로그 글은 내용을 확인했으나 README와 일치해 출처로는 README만 썼다. Cursor 샌드박스 블로그는 읽지 않았다.

## 12. 출처

고정 커밋: `CX`=https://github.com/openai/codex/blob/7b8d67e4560e03d1c9a69a59f05ca005edf7e355 / `GM`=https://github.com/google-gemini/gemini-cli/blob/3fd7d263466b9e5d30b2da1ebf85dae956a0fb86 / `OH`=https://github.com/OpenHands/software-agent-sdk/blob/295b3baf71dfac1be028c5b187134ec3eb495346 / `OC`=https://github.com/openclaw/openclaw/blob/7302f00ac3eea8d12f84b3591fb451564a7fed7e / `CL`=https://github.com/ultraworkers/claw-code/blob/ab8561dc378150e9e65868233dd872937aa68299 / `OP`=https://github.com/anomalyco/opencode/blob/7f21b6d19d201de8d67c387ebe4b413b40711a52

### Claude Code
- C0 https://github.com/anthropics/claude-code
- C1 https://code.claude.com/docs/en/agent-sdk/agent-loop.md
- C2 https://code.claude.com/docs/en/tools-reference.md
- C3 https://code.claude.com/docs/en/permission-modes.md
- C4 https://code.claude.com/docs/en/sandboxing.md
- C5 https://code.claude.com/docs/en/how-claude-code-works.md
- C6 https://code.claude.com/docs/en/context-window.md
- C7 https://code.claude.com/docs/en/how-claude-code-works.md#when-context-fills-up
- C8 https://code.claude.com/docs/en/sessions.md
- C9 https://code.claude.com/docs/en/checkpointing.md
- C10 https://code.claude.com/docs/en/sub-agents.md
- C11 https://code.claude.com/docs/en/agents.md
- C12 https://code.claude.com/docs/en/mcp.md
- C13 https://code.claude.com/docs/en/skills.md
- C14 https://code.claude.com/docs/en/hooks.md
- C15 https://code.claude.com/docs/en/plugins/overview.md
- C16 https://code.claude.com/docs/en/memory.md#agents-md

### Codex CLI
- X0 https://github.com/openai/codex/releases/tag/rust-v0.167.0
- X1 `CX`/codex-rs/core/src/session/turn.rs#L216
- X2 `CX`/codex-rs/core/src/tools/parallel.rs#L292
- X3 `CX`/codex-rs/tools/src/tool_executor.rs#L122
- X4 `CX`/codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs#L121
- X5 https://learn.chatgpt.com/docs/config-file/config-reference.md
- X6 https://learn.chatgpt.com/docs/agent-approvals-security.md
- X7 https://learn.chatgpt.com/docs/sandboxing.md
- X8 https://learn.chatgpt.com/docs/sandboxing/auto-review.md , https://learn.chatgpt.com/docs/permissions.md
- X9 `CX`/codex-rs/linux-sandbox/README.md , `CX`/codex-rs/features/src/lib.rs#L1524 , https://learn.chatgpt.com/docs/windows/windows-sandbox.md
- X10 `CX`/codex-rs/core/src/tasks/compact.rs , `CX`/codex-rs/core/src/session/turn.rs#L1722
- X11 `CX`/codex-rs/core/src/compact.rs#L64
- X12 `CX`/codex-rs/rollout/src/recorder.rs
- X13 `CX`/codex-rs/core/src/session/rollout_reconstruction.rs
- X14 https://learn.chatgpt.com/docs/developer-commands.md
- X15 `CX`/codex-rs/features/src/lib.rs#L1635
- X16 `CX`/codex-rs/core/src/config/mod.rs#L268 (L278 depth)
- X17 https://learn.chatgpt.com/docs/agent-configuration/subagents.md
- X18 https://learn.chatgpt.com/docs/extend/mcp.md
- X19 `CX`/codex-rs/rmcp-client/src/rmcp_client.rs#L961
- X20 https://learn.chatgpt.com/docs/build-skills.md
- X21 https://learn.chatgpt.com/docs/hooks.md
- X22 https://learn.chatgpt.com/docs/plugins.md
- X23 https://learn.chatgpt.com/docs/agent-configuration/agents-md.md

### Gemini CLI
- G0 `GM`/README.md
- G1 `GM`/packages/core/src/core/client.ts#L80
- G2 `GM`/packages/core/src/scheduler/scheduler.ts#L519
- G3 `GM`/packages/core/src/utils/tool-utils.ts#L29
- G4 `GM`/packages/core/src/scheduler/tool-executor.ts#L225 , `GM`/packages/core/src/config/config.ts#L487
- G5 `GM`/docs/cli/cli-reference.md
- G6 `GM`/docs/reference/policy-engine.md
- G7 `GM`/docs/cli/sandbox.md
- G8 `GM`/docs/reference/configuration.md#L1777 , `GM`/packages/core/src/sandbox/linux/LinuxSandboxManager.ts
- G9 `GM`/docs/cli/settings.md
- G10 `GM`/packages/core/src/context/chatCompressionService.ts#L269
- G11 `GM`/docs/cli/session-management.md
- G12 `GM`/packages/core/src/services/chatRecordingService.ts
- G13 `GM`/docs/cli/rewind.md
- G14 `GM`/docs/cli/checkpointing.md
- G15 `GM`/docs/core/subagents.md
- G16 `GM`/docs/core/remote-agents.md
- G17 `GM`/docs/tools/mcp-server.md
- G18 `GM`/docs/cli/skills.md
- G19 `GM`/docs/hooks/reference.md
- G20 `GM`/docs/extensions/reference.md
- G21 `GM`/docs/cli/gemini-md.md

### Cursor
- U0 https://cursor.com/changelog
- U1 https://cursor.com/learn/agents.md
- U2 https://cursor.com/docs/agent/overview.md
- U3 https://cursor.com/docs/agent/security/run-modes.md
- U4 https://cursor.com/docs/agent/security.md
- U5 https://cursor.com/docs/reference/sandbox.md
- U6 https://cursor.com/docs/subagents.md
- U7 https://cursor.com/docs/cli/using.md
- U8 https://cursor.com/docs/hooks.md , https://cursor.com/docs/agent/overview.md
- U9 https://cursor.com/docs/cli/reference/parameters.md
- U10 https://cursor.com/docs/cli/headless.md
- U11 https://cursor.com/docs/cloud-agent.md
- U12 https://cursor.com/docs/mcp.md
- U13 https://cursor.com/docs/skills.md
- U14 https://cursor.com/docs/hooks.md
- U15 https://cursor.com/docs/plugins.md
- U16 https://cursor.com/docs/rules.md

### OpenHands
- H0 `OH`/README.md , https://github.com/OpenHands/OpenHands/blob/8756b3be2ea54e3cceed06097b7aa94cfa2b528e/README.md
- H1 https://docs.openhands.dev/openhands/usage/agent-canvas/architecture.md
- H2 https://docs.openhands.dev/sdk/arch/agent.md
- H3 `OH`/openhands-sdk/openhands/sdk/conversation/impl/local_conversation.py#L243
- H4 https://docs.openhands.dev/sdk/guides/parallel-tool-execution.md
- H5 `OH`/openhands-sdk/openhands/sdk/agent/parallel_executor.py , `OH`/openhands-tools/openhands/tools/terminal/constants.py#L18
- H6 https://docs.openhands.dev/sdk/guides/security.md , `OH`/openhands-sdk/openhands/sdk/security/confirmation_policy.py
- H7 https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox.md , https://docs.openhands.dev/sdk/guides/agent-server/apptainer-sandbox.md
- H8 https://docs.openhands.dev/sdk/guides/context-condenser.md
- H9 `OH`/openhands-sdk/openhands/sdk/context/condenser/llm_summarizing_condenser.py#L64 , `OH`/openhands-sdk/openhands/sdk/agent/agent.py#L883
- H10 https://docs.openhands.dev/sdk/guides/convo-persistence.md
- H11 `OH`/openhands-sdk/openhands/sdk/conversation/persistence_const.py , https://docs.openhands.dev/sdk/guides/convo-pause-and-resume.md
- H12 https://docs.openhands.dev/sdk/guides/task-tool-set.md
- H13 https://docs.openhands.dev/sdk/guides/agent-acp.md
- H14 https://docs.openhands.dev/sdk/guides/mcp.md , `OH`/openhands-sdk/pyproject.toml
- H15 https://docs.openhands.dev/sdk/guides/skill.md , `OH`/openhands-sdk/openhands/sdk/skills/skill.py#L637
- H16 https://docs.openhands.dev/sdk/guides/hooks.md , `OH`/openhands-sdk/openhands/sdk/hooks/types.py
- H17 https://docs.openhands.dev/sdk/guides/plugins.md

### OpenClaw
- O0 https://github.com/openclaw/openclaw/releases/tag/v2026.11.1
- O1 `OC`/docs/concepts/agent-loop.md
- O2 `OC`/docs/concepts/agent-runtimes.md
- O3 `OC`/docs/tools/exec.md
- O4 `OC`/docs/tools/mcp.md , `OC`/src/config/schema.labels.ts#L471
- O5 `OC`/docs/tools/permission-modes.md
- O6 `OC`/docs/gateway/sandbox-vs-tool-policy-vs-elevated.md
- O7 `OC`/docs/gateway/sandboxing.md , `OC`/docs/gateway/sandboxing/modes-scope-and-backend.md
- O8 `OC`/docs/gateway/sandboxing/docker-backend.md#L13
- O9 `OC`/docs/concepts/compaction.md
- O10 `OC`/docs/concepts/session-pruning.md
- O11 `OC`/docs/concepts/context-engine.md
- O12 `OC`/docs/reference/session-management-compaction/store.md
- O13 `OC`/docs/reference/session-management-compaction/maintenance.md
- O14 `OC`/docs/gateway/restart-recovery.md
- O15 `OC`/docs/tools/subagents/nesting.md
- O16 `OC`/docs/tools/subagents/tool-reference.md
- O17 `OC`/docs/tools/acp-agents.md
- O18 `OC`/docs/cli/mcp.md
- O19 `OC`/docs/tools/skills.md
- O20 `OC`/docs/automation/hooks.md , `OC`/docs/plugins/hooks.md
- O21 `OC`/docs/plugins/architecture.md
- O22 `OC`/docs/plugins/bundles.md
- O23 `OC`/docs/concepts/agent-workspace.md

### claw-code
- W0 `CL`/README.md
- W1 `CL`/rust/crates/runtime/src/conversation.rs#L573 (L698 순차 루프)
- W2 `CL`/rust/crates/tools/src/lib.rs#L4259 , `CL`/rust/crates/runtime/src/conversation.rs#L22
- W3 `CL`/rust/crates/tools/src/lib.rs#L484
- W4 `CL`/USAGE.md#L212 , `CL`/rust/crates/runtime/src/permissions.rs#L12
- W5 `CL`/rust/crates/runtime/src/sandbox.rs#L168 (L215, L236)
- W6 `CL`/rust/crates/runtime/src/compact.rs#L10 (L203)
- W7 `CL`/rust/crates/runtime/src/trident.rs
- W8 `CL`/rust/crates/runtime/src/session.rs#L14 , `CL`/rust/crates/runtime/src/session_control.rs
- W9 `CL`/rust/crates/runtime/src/recovery_recipes.rs
- W10 `CL`/USAGE.md#L552
- W11 `CL`/rust/crates/tools/src/lib.rs#L4347 (L4428)
- W12 `CL`/rust/crates/runtime/src/config.rs#L308 , `CL`/rust/crates/runtime/src/mcp_stdio.rs#L531 , `CL`/rust/crates/runtime/src/mcp_server.rs#L33
- W13 `CL`/rust/crates/tools/src/lib.rs#L4051 (L4067)
- W14 `CL`/rust/crates/runtime/src/hooks.rs#L23
- W15 `CL`/rust/crates/plugins/src/lib.rs#L24
- W16 `CL`/rust/crates/runtime/src/prompt.rs#L355
- W17 https://github.com/ultraworkers/claw-code/compare/b71afddae100ced324457337925a694686b8fef2...main

### OpenCode
- P0 https://github.com/anomalyco/opencode , https://opencode.ai/llms.txt
- P1 `OP`/packages/core/src/session/runner/step.ts#L74 (L120-L155)
- P2 `OP`/packages/core/src/tool-output.ts#L13
- P3 https://opencode.ai/v2/docs/tools/
- P4 https://opencode.ai/v2/docs/permissions/
- P5 https://opencode.ai/v2/docs/agents/
- P6 https://opencode.ai/v2/docs/network/
- P7 https://opencode.ai/v2/docs/compaction/
- P8 `OP`/packages/core/src/session/compaction.ts#L60
- P9 `OP`/packages/core/src/database/database.ts#L74
- P10 https://opencode.ai/v2/docs/cli/commands/ , `OP`/packages/cli/src/mini.ts#L16
- P11 https://opencode.ai/v2/docs/snapshots/
- P12 `OP`/packages/core/src/tool/plugin/subagent.ts
- P13 https://opencode.ai/v2/docs/mcp-servers/ , `OP`/packages/core/src/mcp/client.ts#L28
- P14 https://opencode.ai/v2/docs/skills/
- P15 https://opencode.ai/v2/docs/build/plugins/server/
- P16 https://opencode.ai/v2/docs/build/plugins/
- P17 https://opencode.ai/v2/docs/instructions/

### Antigravity CLI
- A0 https://antigravity.google/llms.txt , https://antigravity.google/product/antigravity-cli
- A1 https://antigravity.google/docs/cli/modes
- A2 https://antigravity.google/docs/hooks
- A3 https://antigravity.google/docs/permissions
- A4 https://antigravity.google/docs/sandbox
- A5 https://antigravity.google/docs/cli/commands/context
- A6 https://antigravity.google/docs/cli/conversations
- A7 https://antigravity.google/docs/cli/commands/resume
- A8 https://antigravity.google/docs/subagents
- A9 https://antigravity.google/docs/mcp
- A10 https://antigravity.google/docs/skills
- A11 https://antigravity.google/docs/plugins
- A12 https://antigravity.google/docs/cli/gcli-migration
- A13 https://antigravity.google/docs/rules

### MCP
- M1 https://modelcontextprotocol.io/specification/versioning
- M2 https://github.com/modelcontextprotocol/modelcontextprotocol/releases
- M3 https://modelcontextprotocol.io/specification/draft/changelog
- M4 https://github.com/modelcontextprotocol/modelcontextprotocol/commits/main/schema/2026-07-28
- M5 https://github.com/modelcontextprotocol/modelcontextprotocol/commits/main/docs/specification/2026-07-28
- M6 https://github.com/modelcontextprotocol/modelcontextprotocol/commits/main/docs/specification/draft
- M7 https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/3392-extension-lifecycle.md
- M8 https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/3398-release-cycle-updates.md
- M9 https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2127-mcp-server-cards.md
- M10 https://modelcontextprotocol.io/development/roadmap.md
- M11 https://blog.modelcontextprotocol.io/posts/ruby-sdk-tier-1/ (날짜 사실 확인용)
- M12 https://modelcontextprotocol.io/specification/2026-07-28/changelog.md
- M13 https://modelcontextprotocol.io/specification/2026-07-28/deprecated.md

## 13. 재확인 메모

이 문서는 2026-11-06 조사 기록이며 시간이 지나면 낡는다. 권한·샌드박스 칸은 `ai/agent-approval-and-sandbox`를 쓰면서 원문과 다시 대조했고, Antigravity의 Windows 샌드박스 칸을 위와 같이 고쳤다. 다른 칸은 글에 쓰기 전에 다시 대조한다.
