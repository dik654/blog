export default function ChannelSkills() {
  return (
    <section id="channel-skills" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">채널 시스템 & 스킬</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">채널 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`채널 시스템:

내장 채널 (src/):
  ├── telegram/     # Telegram Bot API
  ├── discord/      # Discord Bot
  ├── slack/        # Slack App
  ├── signal/       # Signal Messenger
  ├── imessage/     # iMessage (macOS)
  └── web/          # WhatsApp Web

확장 채널 (extensions/):
  ├── msteams/      # Microsoft Teams
  ├── matrix/       # Matrix Protocol
  ├── zalo/         # Zalo Messenger
  ├── voice-call/   # 음성 통화
  ├── bluebubbles/  # BlueBubbles (iMessage 대안)
  └── ...

채널 공통 인터페이스:
  interface Channel {
    name: string;
    onMessage(msg): void;     // 메시지 수신
    sendMessage(to, text): void; // 메시지 발신
    sendMedia(to, media): void;  // 미디어 전송
  }

메시지 흐름:
  채널 → 정규화 → 라우팅 → Pi 에이전트 실행 → 응답 → 채널

라우팅 규칙:
  DM:   1:1 대화, 항상 응답
  그룹: 멘션 또는 트리거 단어로 활성화
  → 채널별 다른 응답 전략 적용 가능`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">스킬 시스템</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`스킬 = OpenClaw의 플러그인 시스템

내장 스킬 (skills/):
  ├── coding-agent/     # 코딩 에이전트
  ├── github/           # GitHub 통합
  ├── notion/           # Notion API
  ├── obsidian/         # Obsidian 노트
  ├── spotify-player/   # Spotify 재생
  ├── weather/          # 날씨 정보
  ├── slack/            # Slack 통합
  ├── openai-whisper/   # 음성→텍스트
  ├── openai-image-gen/ # 이미지 생성
  ├── canvas/           # 라이브 Canvas
  ├── 1password/        # 비밀번호 관리
  └── ...

스킬 설치:
  openclaw skill install <name>
  → npm 패키지로 설치
  → Clawhub에서 커뮤니티 스킬 검색

스킬 구조:
  skill/
  ├── package.json     # 의존성
  ├── skill.json       # 메타데이터 (이름, 설명, 트리거)
  └── index.ts         # 진입점 (도구 정의 & 핸들러)

스킬이 제공하는 것:
  1. 추가 도구 (에이전트가 사용)
  2. 커스텀 명령어 (/명령)
  3. 자동 트리거 (이벤트 기반)
  4. UI 컴포넌트 (Canvas에 렌더링)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 & 샌드박스</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`서브에이전트 시스템:

Main Agent → Subagent 스폰
  → 독립 세션으로 실행
  → 깊이 제한 (무한 재귀 방지)
  → 타임아웃 관리
  → 결과를 Main Agent에 반환

사용 사례:
  "이 PR을 리뷰하고 테스트도 실행해줘"
  Main Agent:
    → Subagent 1: PR 코드 리뷰
    → Subagent 2: 테스트 실행
    → 결과 종합하여 응답

샌드박스 아키텍처:
  Docker/Podman 기반 격리 실행 환경

  ┌─────────────────────────────────┐
  │ OpenClaw Gateway (호스트)        │
  │   ↓ Docker API                  │
  │ ┌─────────────────────────────┐ │
  │ │ Sandbox Container           │ │
  │ │  - 격리된 파일 시스템         │ │
  │ │  - 제한된 네트워크 접근       │ │
  │ │  - 시간 제한 (timeout)       │ │
  │ │  - 리소스 제한 (CPU, 메모리)  │ │
  │ │  → 코드 실행, 파일 편집      │ │
  │ └─────────────────────────────┘ │
  └─────────────────────────────────┘

→ 사용자 코드를 안전하게 실행
→ 호스트 시스템 보호`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (openclaw 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`openclaw/
├── src/
│   ├── agents/              # Pi 에이전트 통합
│   │   ├── pi-embedded-runner/  # 에이전트 실행기
│   │   ├── pi-embedded-subscribe.ts  # 이벤트 구독
│   │   ├── pi-tools.ts         # 도구 정의
│   │   ├── model-auth.ts       # 인증 프로파일
│   │   ├── model-catalog.ts    # 모델 카탈로그
│   │   └── subagent-registry.ts # 서브에이전트 관리
│   ├── channels/            # 채널 공통 로직
│   ├── gateway/             # Gateway 서버
│   ├── cli/                 # CLI 인터페이스
│   ├── commands/            # 명령어 처리
│   ├── skills/              # 스킬 엔진
│   ├── sandbox/             # 샌드박스 관리
│   └── context-engine/      # 컨텍스트 관리
├── skills/                  # 내장 스킬
├── extensions/              # 채널 확장
├── packages/
│   ├── clawdbot/            # Discord 봇
│   └── moltbot/             # 보조 봇
└── docs/                    # 문서`}</code>
        </pre>
      </div>
    </section>
  );
}
