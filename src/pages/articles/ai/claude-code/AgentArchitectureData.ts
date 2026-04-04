export const subAgentCode = `서브에이전트 아키텍처:

Main Agent (사용자 대화)
├── Agent("Explore") — 코드베이스 탐색 전문
│   도구: Read, Glob, Grep, Bash(읽기), WebFetch, WebSearch
│   용도: 파일 검색, 패턴 매칭, 코드 이해
│
├── Agent("Plan") — 구현 계획 설계
│   도구: Read, Glob, Grep, Bash(읽기), WebFetch, WebSearch
│   용도: 아키텍처 분석, 구현 전략 수립
│
├── Agent("general-purpose") — 범용 작업
│   도구: 전체 도구 세트
│   용도: 복잡한 멀티스텝 작업 자율 수행
│
└── 사용자 정의 에이전트
    .claude/agents/my-agent.md 파일로 정의

병렬 실행:
  Main Agent가 독립적인 서브에이전트를 동시에 실행
  예) 3개 파일을 동시에 탐색:
    Agent 1: "src/auth/ 인증 로직 분석"
    Agent 2: "src/api/ API 엔드포인트 분석"
    Agent 3: "tests/ 테스트 구조 파악"
  → 결과를 Main Agent가 종합하여 응답

백그라운드 에이전트:
  run_in_background=true로 비동기 실행
  → Main Agent는 다른 작업 계속 진행
  → 완료 시 자동 알림

제약:
  - 서브에이전트는 자신의 서브에이전트를 생성 불가 (무한 재귀 방지)
  - 부모 ↔ 자식 통신: 프롬프트 문자열 → 최종 메시지 반환만
  - 최대 7개 동시 실행 → 3개 × 200K = 600K 토큰 컨텍스트 활용`;

export const subAgentAnnotations = [
  { lines: [3, 17] as [number, number], color: 'sky' as const, note: '에이전트 유형별 역할 분리' },
  { lines: [19, 25] as [number, number], color: 'emerald' as const, note: '병렬 탐색으로 속도 향상' },
  { lines: [31, 33] as [number, number], color: 'amber' as const, note: '재귀 방지 + 동시 실행 제한' },
];
