export const toolCatalogCode = `Claude Code 도구 카탈로그:

파일 시스템:
  Read       — 파일 읽기 (이미지, PDF, Jupyter 지원)
  Write      — 파일 생성/덮어쓰기
  Edit       — 정확한 문자열 치환으로 파일 수정
  Glob       — 파일 패턴 검색 (**/*.tsx 등)
  Grep       — ripgrep 기반 코드 내용 검색

실행:
  Bash       — 셸 명령 실행 (빌드, 테스트, git 등)
  NotebookEdit — Jupyter 노트북 셀 편집

연구:
  WebSearch  — 웹 검색
  WebFetch   — URL 내용 가져오기 & AI 처리

협업:
  Agent      — 서브에이전트 실행
  TodoWrite  — 작업 목록 관리
  AskUserQuestion — 사용자에게 질문

확장:
  Skill      — 슬래시 명령 실행 (/commit, /review-pr 등)
  MCP 도구   — MCP 서버에서 제공하는 도구`;

export const toolCatalogAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '파일 시스템 도구 5종' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: '실행 도구 — Bash + Notebook' },
  { lines: [18, 21] as [number, number], color: 'amber' as const, note: '협업 도구 — 에이전트 & 사용자 질문' },
];

export const permissionModelCode = `3단계 권한 모드:

1. Ask (기본):
   모든 도구 호출에 사용자 승인 필요
2. Auto-Allow:
   지정된 도구만 자동 허용, 나머지는 승인 필요
3. YOLO (자동):
   대부분 도구를 자동 허용
   → 파괴적 명령에 대한 최소 안전장치는 유지

OS 수준 샌드박싱:
  macOS: Seatbelt (v1.0.20부터 기본 활성화)
  Linux: bubblewrap (bwrap) 기반 격리
  → 샌드박싱으로 권한 프롬프트 84% 감소`;

export const permissionAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'Ask — 모든 호출 승인 필요' },
  { lines: [7, 9] as [number, number], color: 'amber' as const, note: 'YOLO — 자동 허용 모드' },
  { lines: [11, 14] as [number, number], color: 'emerald' as const, note: 'OS 샌드박싱으로 안전성 확보' },
];
