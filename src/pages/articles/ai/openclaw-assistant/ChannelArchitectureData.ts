export const channelCode = `채널 시스템:

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
  → 에이전트마다 독립 워크스페이스 + 세션`;

export const channelAnnotations = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: '내장 채널 6종' },
  { lines: [11, 17] as [number, number], color: 'emerald' as const, note: '확장 채널 — 플러그인' },
  { lines: [34, 41] as [number, number], color: 'amber' as const, note: '메시지 처리 6단계 파이프라인' },
];
