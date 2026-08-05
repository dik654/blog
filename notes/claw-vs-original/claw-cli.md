# claw-cli vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 CLI 를 **rusty-claude-cli ~10K LOC + clap derive + REPL 루프 + 6 subcommand** 로 설명한다.

- main(): 인자 파싱 → 로깅 → 서브명령 분기
- 6 subcommand: Run / Resume / ListSessions / Init / Config / Version
- CliArgs flags: `--read-only`, `--dangerously-skip-permissions`, `--model`, `--provider`, `--verbose`
- REPL: prompt input → command parse (slash 분기) → query engine → render
- Slash commands, terminal rendering, project initialization

## 원본 Claude Code 실제 동작

원본 CLI 는 **다단 entrypoint + Ink/React 터미널 UI + print mode + structured IO + 5 transport + 100+ slash commands** 로 ~12,500 LOC entry alone, plus components.

### Entrypoint chain

```
cli.tsx (302) — 빠른 부트스트랩
  → init.ts (340) — env, OAuth, LSP, 정책 초기화
    → main.tsx (4683) — 텔레메트리, 서비스 init
      → setup.ts (477) — worktree, 훅, 권한 검증
        → REPL (Ink/React 화면)
```

### `src/cli/` 모듈

| 파일 | LOC | 역할 |
|---|---|---|
| `print.ts` | 5594 | Print mode (`-p` flag) — 비대화형 batch 모드, structured output, ndjson stream |
| `structuredIO.ts` | 859 | structured input/output (JSON streaming, NDJSON) |
| `remoteIO.ts` | 255 | 원격 터미널 I/O |
| `transports/` | 6 files | CCR client, Hybrid, SerialBatchEventUploader, SSE, WebSocket, WorkerStateUploader, transportUtils |
| `handlers/` | 6 files | agents, auth, autoMode, mcp, plugins, util — `claude agents/auth/...` subcommand |
| `update.ts` | ? | self-update |
| `exit.ts` | ? | exit handling |

### 100+ Slash Commands

`src/commands/` 에 101 디렉토리 — 각 슬래시 명령:
- `/help`, `/clear`, `/compact`, `/resume`, `/session`, `/permissions`, `/mcp`, `/plugin`, `/agents`, `/cron`, `/skill`, `/config`, `/cost`, `/feedback`, `/login`, `/logout`, `/exit`, `/upgrade`, `/doctor`, `/diagnose`, `/init`, `/rename`, `/release-notes`, `/status`, `/install-github-app`, ...

claw 의 슬래시 명령 수는 훨씬 적음 (코드 보면 ~20개).

### 핵심 차이

1. **Print mode (-p)** — `claude -p "prompt"` 로 비대화형 실행, stdout 으로 답 출력. SDK/스크립트 통합용. 5594 LOC. claw 에 거의 없음.
2. **Structured IO** — `--output-format json` / `--input-format stream-json` 으로 JSON streaming. NDJSON 으로 외부 프로세스 파이프 연결. 859 LOC.
3. **Multiple transports** — WebSocket, SSE, HybridTransport, CCR client (Claude Code Remote), batch uploader. claw 는 단일 stdio.
4. **Ink/React terminal UI** — 4683 LOC main.tsx 가 React Ink 컴포넌트 트리. claw 는 자체 ratatui 같은 단순 렌더.
5. **Subcommand handlers** — `claude agents/auth/autoMode/mcp/plugins/...` 풀 subcommand 트리. claw 는 6 subcommand.
6. **OAuth init** — init.ts 가 OAuth 토큰 refresh, claude.ai 로그인 flow.
7. **Setup phase** — worktree validation, hook config 검증, permission setup, 정책 적용 — 별도 477 LOC phase.
8. **`claude mcp serve`** — Claude 자체를 MCP 서버로 expose (mcp.ts entrypoint).
9. **CLI handlers의 깊이** — agents.ts (built-in agents 관리), auth.ts (OAuth flow), autoMode.ts (auto mode 토글), plugins.ts (plugin install/list).
10. **100+ slash command** vs claw ~20.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| Entry chain | main 단일 | cli → init → main → setup 4단 (~5800 LOC) | 단순화 |
| Print mode | 없음 | -p flag, 5594 LOC | 누락 |
| Structured IO | 없음 | JSON streaming, NDJSON (859) | 누락 |
| Transports | stdio | WebSocket / SSE / Hybrid / CCR / batch (6 files) | 누락 |
| Terminal UI | 단순 | Ink/React 4683 LOC main.tsx | 다른 메커니즘 |
| Subcommand 수 | 6 | 6+ subcommand handler + 풀 트리 | 단순화 |
| Slash command 수 | ~20 | 101 디렉토리 | 단순화 |
| OAuth init | 없음 | claude.ai OAuth + token refresh | 누락 |
| `claude mcp serve` | 없음 | Claude as MCP server | 누락 |
| Self-update | ? | update.ts | ? |
| Auto mode toggle | 없음 | autoMode.ts handler | 누락 |

## 보강 제안

- "claw cli 는 RPL + clap 으로 단순화. 원본은 Ink/React 4683 LOC + Print mode 5594 LOC + 100+ slash" Overview callout
- Print mode 한 단락 — SDK/스크립트 통합 핵심
- Slash command 표 — 누락된 것 (특히 /doctor, /diagnose, /cost, /upgrade, /install-github-app)

## 참조 파일

- `/home/heru/code/claude-analysis/src/entrypoints/cli.tsx` (302), `init.ts` (340)
- `/home/heru/code/claude-analysis/src/main.tsx` (4683)
- `/home/heru/code/claude-analysis/src/setup.ts` (477)
- `/home/heru/code/claude-analysis/src/cli/print.ts` (5594, print mode)
- `/home/heru/code/claude-analysis/src/cli/structuredIO.ts` (859)
- `/home/heru/code/claude-analysis/src/cli/handlers/*` (agents/auth/autoMode/mcp/plugins/util)
- `/home/heru/code/claude-analysis/src/cli/transports/*` (6 transports)
- `/home/heru/code/claude-analysis/src/commands/` (101 dirs)
