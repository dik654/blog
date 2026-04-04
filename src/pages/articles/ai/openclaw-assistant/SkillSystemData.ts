export const skillSystemCode = `스킬 = OpenClaw의 플러그인 시스템

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
  → MCP 서버도 표준 도구 레이어로 통합`;

export const skillSystemAnnotations = [
  { lines: [3, 15] as [number, number], color: 'sky' as const, note: '내장 스킬 디렉토리' },
  { lines: [17, 29] as [number, number], color: 'emerald' as const, note: 'SKILL.md 기반 선언적 포맷' },
  { lines: [36, 39] as [number, number], color: 'amber' as const, note: 'ClawHub — 13,729+ 커뮤니티 스킬' },
];
