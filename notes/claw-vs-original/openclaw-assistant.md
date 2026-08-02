# openclaw-assistant vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 OpenClaw 를 **개인용 AI 어시스턴트** 로 설명한다 — claw-code 와 다른 별도 프로젝트.

- WhatsApp/Telegram/Slack/Discord 등 다양한 채널에서 동일 어시스턴트
- 핵심 엔진: **Pi Coding Agent SDK** 임베드 (claw 가 아님)
- 단일 Node.js Gateway (WebSocket :18789)
- 3 클라이언트 종류: Operator (CLI/TUI), Node (macOS/iOS app), WebChat
- 채널 정규화, 세션 관리, 메모리 영속, 스킬, 보안

## 원본 Claude Code 와의 관계

OpenClaw 는 **claw-code 와 직접 비교 대상이 아님** — Pi Coding Agent SDK 를 임베드한 별도 어시스턴트. 원본 Claude Code 와도 직접 대응하지 않음.

원본 Claude Code 의 가장 가까운 대응:
- **`entrypoints/sdk/`** — Claude Code 를 SDK 로 사용 (다른 앱이 임베드 가능)
- **`server/createDirectConnectSession.ts`** — WebSocket direct connect (OpenClaw Gateway 와 유사 패턴)
- **`bridge/`** — `sessionRunner.ts`, `createSession.ts`, `codeSessionApi.ts` — Claude 를 외부에서 호출하는 bridge

원본은 메시징 채널 (WhatsApp/Telegram 등) 통합이 없다. CLI/IDE/SDK 위주.

## 비교 의미

이 글은 "claw-code 자체" 가 아니라 "claw 생태계의 응용 사례" — OpenClaw 가 Pi SDK (claw 의 다른 이름?) 를 어떻게 임베드해서 다중 채널 어시스턴트를 만드는지.

원본 Claude Code 에 대응하는 비교는 어색하므로, 이 글의 주제는:
- **다중 채널 정규화** — WhatsApp/Telegram/Slack 메시지를 통일 형식으로
- **Gateway 패턴** — 단일 프로세스가 모든 클라이언트 다중화
- **메모리 영속** — claw 의 in-memory 와 다르게 영속 store
- **스킬 시스템** — 외부 확장
- **보안** — 토큰/JWT/디바이스 페어링

## 보강 제안

- 글 도입에 "OpenClaw 는 claw-code 의 직접 비교 대상이 아니라, Pi SDK 임베딩 응용. 원본 Claude Code 의 SDK/bridge entrypoint 와 유사한 임베딩 시나리오 사례" 한 단락
- 원본의 `bridge/` + `entrypoints/sdk/` 와 비교 — 둘 다 Claude 를 외부에서 임베드하는 방법
- 원본은 메시징 채널 통합 없음 — OpenClaw 가 그 gap 을 채우는 응용

## 참조 파일

- 원본 측 임베딩 패턴: `/home/heru/code/claude-analysis/src/entrypoints/sdk/`
- `/home/heru/code/claude-analysis/src/bridge/sessionRunner.ts`, `createSession.ts`, `codeSessionApi.ts`
- `/home/heru/code/claude-analysis/src/server/createDirectConnectSession.ts`
