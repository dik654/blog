export default function PiIntegration() {
  return (
    <section id="pi-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pi SDK 통합 & 에이전트 세션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Pi SDK 패키지 구조</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Pi SDK 패키지 의존성:

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
             + messaging, browser, canvas, sessions, cron, gateway 도구 추가`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">임베디드 에이전트 실행</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`OpenClaw의 Pi 임베딩 방식:

일반적 접근 (subprocess):
  OpenClaw → spawn("pi-agent") → stdin/stdout → 결과 파싱
  → 프로세스 간 통신 오버헤드, 제한된 제어

OpenClaw 접근 (embedded):
  OpenClaw → import { createAgentSession } from 'pi-coding-agent'
           → 직접 인스턴스화 & 이벤트 구독
  → 완전한 라이프사이클 제어

세션 라이프사이클:
  1. createAgentSession(config)
     → 모델 선택, 시스템 프롬프트, 도구 설정

  2. 메시지 수신 시:
     runEmbeddedPiAgent({
       message,
       sessionManager,
       tools: [...builtInTools, ...openClawTools],
       systemPrompt: buildSystemPrompt(channel, context)
     })

  3. 이벤트 구독 (subscribeEmbeddedPiSession):
     → onBlockReply: 텍스트 스트리밍 → 채널에 전달
     → onToolCall: 도구 실행 상태 표시
     → onComplete: 최종 응답 전송

  4. 세션 영속성:
     → SessionManager가 대화 히스토리 파일로 관리
     → ~/.openclaw/sessions/{sessionId}.jsonl (JSONL 형식)
     → 브랜칭 & 컴팩션 지원
     → 채널/DM별 독립 세션

이벤트 스트림 흐름:
  agent_start → turn_start → message_start
    → text_delta... (스트리밍)
    → tool_execution_start → update → end
  → message_end → turn_end → agent_end

에이전트 루프 (pi-agent-core):
  의도적으로 최소화된 설계:
  LLM 스트리밍 → 도구 호출 확인 (없으면 중단)
    → 도구 순차 실행 → 결과를 컨텍스트에 추가 → 반복
  → 명시적 태스크 플래너나 DAG 없음 — LLM이 워크플로우 주도`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">멀티 프로바이더 & 페일오버</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Auth Profile 시스템:

여러 AI 프로바이더를 동시 지원:
  Profile 1: OpenAI GPT-4o (API 키)
  Profile 2: Anthropic Claude (OAuth)
  Profile 3: Google Gemini (API 키)
  Profile 4: Ollama (로컬, 무료)

자동 페일오버 설정:
  {
    "model": {
      "primary": "anthropic/claude-opus-4-6",
      "fallbacks": ["anthropic/claude-sonnet-4-5",
                     "openai/gpt-5", "google/gemini-2-pro"]
    }
  }
  → Rate limit, 장애, 타임아웃 시 자동으로 다음 모델 시도
  → channels.modelByChannel로 채널별 다른 모델 지정 가능

쿨다운 관리:
  실패한 프로파일은 일정 시간 쿨다운
  → 자동 만료 후 다시 활성화
  → 무한 재시도 방지

프로바이더별 인증:
  Anthropic: API 키 인증 (권장)
  OpenAI:    OPENAI_API_KEY 환경 변수
  Gemini:    키 로테이션 (GEMINI_API_KEYS, KEY_1, KEY_2)
             + Google CLI 로그인 → auth-profiles.json 저장
  Ollama:    자동 감지 (127.0.0.1:11434/v1, 인증 불필요)

Model Catalog:
  각 프로바이더의 사용 가능 모델 자동 발견
  확장 카탈로그: GLM-5, MiniMax M2.5, Kimi K2.5, Grok 등
  → 사용자가 models.json으로 커스텀 설정 가능`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">커스텀 도구 주입</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`OpenClaw이 Pi 에이전트에 추가하는 도구:

Pi 내장 도구 (코딩 에이전트):
  Read, Write, Edit, Bash, Glob, Grep 등
  → Claude Code와 유사한 파일/셸 도구

OpenClaw 전용 도구:
  messaging  — 채널로 메시지 전송
  camera     — 디바이스 카메라 캡처 (macOS/iOS)
  canvas     — 라이브 Canvas 렌더링
  subagent   — 서브에이전트 스폰
  session    — 세션 관리 (목록, 전환, 종료)
  pdf        — PDF 처리
  media      — 이미지/오디오/비디오 처리

도구 정책:
  createOpenClawCodingTools()로 통합
  → Pi 도구와 OpenClaw 도구를 결합
  → 채널별 도구 허용/차단 정책 적용
  → 샌드박스 환경에 따른 경로 정책`}</code>
        </pre>
      </div>
    </section>
  );
}
