export const subAgentCode = `서브에이전트 시스템:

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
    → 결과 종합하여 응답`;

export const subAgentAnnotations = [
  { lines: [5, 12] as [number, number], color: 'sky' as const, note: '깊이 기반 권한 제어' },
  { lines: [14, 18] as [number, number], color: 'emerald' as const, note: '안전 제어 — 캐스케이드 중단' },
  { lines: [20, 22] as [number, number], color: 'amber' as const, note: '비용 최적화 전략' },
];

export const sandboxCode = `샌드박스 아키텍처:
  Docker/Podman 기반 격리 실행 환경 (opt-in)

  샌드박스 모드 (agents.defaults.sandbox.mode):
    "all":      모든 세션을 Docker 컨테이너에서 실행
    "non-main": 그룹/채널 세션만 샌드박스, 메인은 호스트
    off (기본): 도구를 호스트에서 직접 실행

  Fail-closed 설계:
    sandbox 설정인데 런타임 없으면 → 호스트 실행 대신 에러 발생
  Escape hatch:
    tools.elevated로 특정 도구만 호스트에서 실행 허용
  컨테이너 수명:
    24시간 유휴 또는 7일 경과 시 자동 제거
    설정 변경 시 자동 재생성 (5분 내 사용 중이면 유지)`;

export const sandboxAnnotations = [
  { lines: [4, 7] as [number, number], color: 'sky' as const, note: '3가지 샌드박스 모드' },
  { lines: [9, 10] as [number, number], color: 'rose' as const, note: 'Fail-closed — 안전 우선 설계' },
  { lines: [13, 15] as [number, number], color: 'emerald' as const, note: '컨테이너 자동 관리' },
];
