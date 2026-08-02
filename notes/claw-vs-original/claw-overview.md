# claw-overview vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 claw-code 를 **9 Cargo crates + Python parity engine + 9-lane checkpoint + Mock parity harness** 로 설명한다.

- 9 crates: api / commands / compat-harness / mock-anthropic-service / plugins / runtime / rusty-claude-cli / telemetry / tools
- runtime 이 ~40% LOC (대화 상태 + 도구 디스패치 + 권한 + 세션)
- Python parity engine: 37 files / ~1700 LOC
- 9-lane: bash validation / CI / file-tool / TaskRegistry / Task wiring / Team+Cron / MCP lifecycle / LSP / Permission enforcement
- Mock parity harness: 10 scenarios, 19 captured /v1/messages

## 원본 Claude Code 실제 동작

원본 Claude Code:
- **1902 TypeScript files** (claude-analysis 카운트)
- **TS + React + Ink** UI 프레임워크
- 단일 npm package + Bun runtime
- 모듈 구조: `commands/` (101 dirs) + `services/` + `tools/` (42 dirs) + `utils/` + `hooks/` (104 React hooks) + `components/` + `tasks/` + `swarm/` + `coordinator/` + `entrypoints/` + `cli/` + `bridge/` + `server/` + `plugins/` + `skills/` + `screens/` + `assistant/` + `bootstrap/` + `migrations/` + `outputStyles/` + `keybindings/` + `memdir/` + `moreright/` + `ink/` + `native-ts/` + `schemas/` + 등

### 주요 비교

| 항목 | claw | 원본 |
|---|---|---|
| 언어 | Rust + Python parity | TypeScript |
| Runtime | Cargo workspace 9 crates | Bun |
| UI | (자체 simpler) | Ink + React |
| 코드 규모 | 48,599 Rust LOC + 1700 Python | 1902 TS files (~150K+ LOC 추정) |
| Provider | Anthropic / OpenAI / xAI | Anthropic / Bedrock / Vertex / Azure / Grove |
| 설계 동기 | "런타임 동작 분리·재현, 프레임워크 종속 없이 시스템 언어로" | 1st-party CLI |
| 출처 | npm .map 유출 (2026-03-31) → OmX clean-room → Rust port | Anthropic 공식 |

### 9-lane vs 원본 코드 규모

PARITY 의 9 lane 으로 추가된 LOC 와 원본의 대응 영역:

| Lane | claw 추가 LOC | 원본 대응 LOC |
|---|---|---|
| 1. Bash validation | +1004 | tools/BashTool 14,400 + utils/bash 10,100 = 24,500 |
| 2. CI fix | +22 | n/a |
| 3. File-tool | +195 | tools/FileReadTool/FileEditTool/FileWriteTool/GlobTool/GrepTool 4,194 |
| 4. TaskRegistry | +336 | tasks/ 2,579 + UI 13 components |
| 5. Task wiring | +79 | (위와 같이) |
| 6. Team+Cron | +441 | swarm/ 4,585 + cron 1,526 + tools/ScheduleCronTool 484 |
| 7. MCP lifecycle | +491 | services/mcp 12,310 + UI/utils/tools 4,000 |
| 8. LSP client | +461 | services/lsp + utils/lsp ~? (확인 필요) |
| 9. Permission enforcement | +357 | utils/permissions 9,409 + types 442 |

### 핵심 차이 요약

- **언어 / runtime / UI 프레임워크 전부 다름** — Rust+Cargo vs TS+Bun+React+Ink
- **단순화 비율** — 원본 대비 claw 는 영역별 1/30 ~ 1/86 코드 규모
- **추가 설계** — claw 는 PolicyEngine + Recovery + Lane (자율 자동화) 같은 컨셉 추가
- **Multi-provider 방향 다름** — claw=OpenAI 호환, 원본=enterprise 멀티 클라우드
- **배포 모델** — claw=cargo workspace, 원본=npm package + Bun

## 보강 제안

- "claw-code 는 의도적 reimagination — 원본의 프레임워크 종속을 벗고 시스템 언어로 정수만 추출. PARITY.md 가 그 trade-off 를 honest 하게 추적" Overview 강화
- 9-lane vs 원본 LOC 비교 표 (위) — 단순화 비율이 명확
- claw 만의 추가 설계 (PolicyEngine, Recovery, TaskPacket 구조화, WorkerStatus 명시) 부각
- Python parity engine 의 역할 강조 — 원본에 없는 자기검증 메커니즘

## 참조 파일

- `/home/heru/code/claude-analysis/Index.md` — 1902 file MOC
- `/home/heru/code/claude-analysis/Stats_Report.md`
- `/home/heru/code/claude-analysis/Directory_Structure.md`
- `/home/heru/code/claw-code/PARITY.md` (9 lane 전체)
- `/home/heru/code/claw-code/PHILOSOPHY.md`
