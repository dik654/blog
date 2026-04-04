export const piSDKCode = `Pi SDK 패키지 의존성:

@mariozechner/pi-ai
  → 핵심 LLM 추상화: Model, streamSimple, 메시지 타입
  → 프로바이더 API (OpenAI, Anthropic, Google 등)
  → 모델 독립적 인터페이스

@mariozechner/pi-agent-core
  → 에이전트 루프: 도구 실행, AgentMessage 타입
  → 도구 정의 & 실행 프레임워크
  → 에이전트 상태 관리

@mariozechner/pi-coding-agent
  → 상위 SDK: createAgentSession, SessionManager
  → AuthStorage, ModelRegistry
  → 내장 도구 (파일 편집, 셸 실행 등)
  → Claude Code와 유사한 코딩 에이전트 기능

@mariozechner/pi-tui
  → 터미널 UI 컴포넌트
  → OpenClaw 로컬 TUI 모드에서 사용

의존성 흐름:
  pi-ai → pi-agent-core → pi-coding-agent
                               ↑
                          OpenClaw이 임베드

도구 어댑터 레이어:
  pi-agent-core의 AgentTool ≠ pi-coding-agent의 ToolDefinition
  → pi-tool-definition-adapter.ts의 toToolDefinitions()로 브릿지
  → OpenClaw 정책 필터링, 샌드박스 통합 유지

기본 도구 커스터마이징:
  Pi 기본:   codingTools (read, bash, edit, write)
  OpenClaw:  bash → exec/process로 교체
             read/edit/write → 샌드박스 경로 정책 적용
             + messaging, browser, canvas, sessions, cron, gateway 도구 추가`;

export const piSDKAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'pi-ai — LLM 추상화 레이어' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'pi-agent-core — 에이전트 루프' },
  { lines: [13, 17] as [number, number], color: 'amber' as const, note: 'pi-coding-agent — 상위 SDK' },
  { lines: [28, 31] as [number, number], color: 'violet' as const, note: '어댑터 레이어 — 인터페이스 브릿지' },
];
