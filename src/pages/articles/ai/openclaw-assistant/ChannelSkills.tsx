import { CitationBlock } from '../../../../components/ui/citation';

import { CitationBlock } from '../../../../components/ui/citation';

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
  → 채널별 다른 응답 전략 적용 가능

메시지 처리 6단계:
  1. Channel Ingress — 플랫폼 원시 이벤트 수신
  2. 정규화 & 중복 제거 — MsgContext 구조체로 변환
  3. 접근 제어 — dmPolicy (DM) + groupPolicy (그룹)
  4. 세션 해석 — 적절한 에이전트 세션으로 라우팅
  5. 명령/에이전트 처리 — Pi 에이전트 루프 실행
  6. 응답 전달 — 플랫폼별 리치 메시지로 변환

멀티 에이전트 라우팅:
  채널/계정/피어별로 격리된 에이전트에 라우팅 가능
  → 에이전트마다 독립 워크스페이스 + 세션`}</code>
        </pre>
        <CitationBlock source="OpenClaw — SKILL.md 형식 & ClawHub" citeKey={4} type="code"
          href="https://github.com/anthropics/openclaw">
          <pre className="text-xs overflow-x-auto"><code>{`# SKILL.md 형식 — 스킬 정의
---
name: my-skill
description: "Custom automation skill"
triggers: ["keyword1", "keyword2"]
maxSpawnDepth: 2  # 서브에이전트 깊이 제한
sandbox: docker    # fail-closed 샌드박스
---

# Instructions
Use this skill to...

# ClawHub: 13,729+ 커뮤니티 스킬 마켓플레이스`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">
            SKILL.md는 마크다운 기반 스킬 정의 형식입니다. ClawHub에서 13,729개 이상의
            커뮤니티 스킬을 배포하며, Docker sandbox를 fail-closed로 운영하여 보안을 보장합니다.
          </p>
        </CitationBlock>

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

스킬 구조 (SKILL.md 기반):
  skill/
  ├── SKILL.md         # YAML frontmatter + 마크다운 지침
  └── (선택) 추가 파일

  SKILL.md 예시:
  ---
  name: github-review
  version: 1.0.0
  requirements: [gh CLI]
  ---
  # 지침
  1. gh pr diff 실행...

스킬 우선순위 (높은 순):
  1. <workspace>/skills (에이전트별)
  2. ~/.openclaw/skills (공유/관리)
  3. 번들된 스킬

ClawHub — 커뮤니티 스킬 레지스트리 (13,729+ 스킬):
  openclaw skills install/list/search/update/remove
  → 동적 로드: 설치 후 재시작 없이 다음 턴부터 사용
  → VirusTotal 연동 스킬 스캐닝 (보안)

시스템 프롬프트 통합:
  적격 스킬이 XML 목록으로 시스템 프롬프트에 주입
  → 스킬당 ~24 토큰 (컨텍스트 효율적)

TypeScript 플러그인 (OpenClawPlugin):
  import { OpenClawPlugin } from '@openclaw/sdk';
  → name, version, tools[] 정의
  → 채널, 도구, 라이프사이클 훅 등록 가능
  → MCP 서버도 표준 도구 레이어로 통합`}</code>
        </pre>

        <CitationBlock source="ClawHub — 커뮤니티 스킬 레지스트리" citeKey={4} type="code"
          href="https://github.com/openclaw/clawhub">
          <pre className="text-xs overflow-x-auto"><code>{`# SKILL.md 형식 (스킬의 유일한 필수 파일)
---
name: github-review
version: 1.0.0
requirements: [gh CLI]
---
# 지침
1. gh pr diff 실행...

# ClawHub 레지스트리: 13,729+ 커뮤니티 스킬
openclaw skills install <skill-name>
openclaw skills search <keyword>

# 동적 로드: 설치 후 재시작 없이 다음 턴부터 사용
# VirusTotal 연동 스킬 스캐닝 (보안)
# 시스템 프롬프트 주입: 스킬당 ~24 토큰`}</code></pre>
          <p className="mt-2 text-xs">
            SKILL.md는 YAML frontmatter + 마크다운 지침으로 구성된 선언적 스킬 포맷입니다.
            ClawHub에 등록된 13,729+ 스킬은 동적 로드를 지원하여 설치 즉시 사용 가능하며,
            적격 스킬이 시스템 프롬프트에 XML 목록으로 주입됩니다 (스킬당 약 24 토큰).
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 & 샌드박스</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`서브에이전트 시스템:

스폰: /subagents spawn 또는 sessions_spawn 도구

깊이 제한 (maxSpawnDepth, 기본: 1):
  Depth 0 (메인):    전체 도구 접근, 서브에이전트 스폰 가능
  Depth 1 (오케스트레이터, maxSpawnDepth≥2):
    → sessions_spawn, subagents, sessions_list 접근
  Depth 1 (리프, maxSpawnDepth=1):
    → 세션 도구 없음
  Depth 2 (리프 워커):
    → sessions_spawn 항상 거부 — 더 이상 스폰 불가

안전 제어:
  maxChildrenPerAgent: 5 (기본, 에이전트당 활성 자식 수)
  캐스케이드 중단: 부모 중단 시 모든 자손 자동 중단
  자동 아카이브: archiveAfterMinutes (기본: 60)
  세션 키: subagent:<parentId>:d<depth> (계층 인코딩)

비용 최적화:
  agents.defaults.subagents.model로 서브에이전트에 저가 모델 지정
  → 메인은 고품질, 서브에이전트는 효율적 모델

사용 사례:
  "이 PR을 리뷰하고 테스트도 실행해줘"
  Main Agent:
    → Subagent 1: PR 코드 리뷰
    → Subagent 2: 테스트 실행
    → 결과 종합하여 응답

샌드박스 아키텍처:
  Docker/Podman 기반 격리 실행 환경 (opt-in)

  샌드박스 모드 (agents.defaults.sandbox.mode):
    "all":      모든 세션을 Docker 컨테이너에서 실행
    "non-main": 그룹/채널 세션만 샌드박스, 메인은 호스트
    off (기본): 도구를 호스트에서 직접 실행

  ┌─────────────────────────────────┐
  │ OpenClaw Gateway (호스트)        │
  │   ↓ Docker API                  │
  │ ┌─────────────────────────────┐ │
  │ │ Sandbox Container           │ │
  │ │  - 파일시스템 격리            │ │
  │ │  - 네트워크 격리 (기본 none)  │ │
  │ │  - CPU/메모리 제한            │ │
  │ │  - non-root 사용자 실행      │ │
  │ │  - scope: rw → /workspace   │ │
  │ │           ro → /agent        │ │
  │ └─────────────────────────────┘ │
  └─────────────────────────────────┘

  Fail-closed 설계:
    sandbox 설정인데 런타임 없으면 → 호스트 실행 대신 에러 발생
  Escape hatch:
    tools.elevated로 특정 도구만 호스트에서 실행 허용
  컨테이너 수명:
    24시간 유휴 또는 7일 경과 시 자동 제거
    설정 변경 시 자동 재생성 (5분 내 사용 중이면 유지)`}</code>
        </pre>

        <CitationBlock source="Docker Blog — Run OpenClaw Securely in Docker Sandboxes" citeKey={5} type="paper"
          href="https://docker.com/blog/run-openclaw-securely-in-docker-sandboxes">
          <p className="italic text-foreground/80">
            "Fail-closed design: sandbox 설정인데 Docker 런타임이 없으면 호스트에서 실행하는 대신 에러를 발생시킨다.
            컨테이너는 network:none 기본값으로 생성되며, non-root 사용자로 실행된다."
          </p>
          <p className="mt-2 text-xs">
            OpenClaw 샌드박스는 fail-closed 원칙을 따릅니다. Docker 런타임이 없으면 호스트 실행으로 폴백하지 않고
            명시적으로 에러를 발생시킵니다. 컨테이너는 24시간 유휴 또는 7일 경과 시 자동 제거되며,
            tools.elevated로 특정 도구만 호스트 실행을 허용하는 escape hatch를 제공합니다.
          </p>
        </CitationBlock>

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
