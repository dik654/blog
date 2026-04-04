export const agentLoopCode = `Claude Code 에이전트 루프:

사용자 입력
    ↓
┌─→ Claude API 호출 (메시지 + 도구 정의)
│       ↓
│   Claude 응답 분석
│       ↓
│   텍스트 응답? ──→ 사용자에게 출력 ──→ 대기
│       │
│   도구 호출? ──→ 권한 확인 ──→ 도구 실행 ──→ 결과를 메시지에 추가
│       │                                         │
│       └─────────────────────────────────────────┘
│           (다시 Claude API 호출)

핵심 특성:
  1. 자율적 다단계 실행: 평균 21.2회 독립 도구 호출/요청
  2. 컨텍스트 윈도우: ~200K 토큰 (시스템 오버헤드 후 ~160-170K 사용 가능)
  3. 병렬 도구 호출: 독립적인 도구는 동시에 실행 가능
  4. 서브에이전트: 최대 7개 동시 실행 (각각 독립 200K 컨텍스트)

세션 저장:
  ~/.claude/projects/<project>/sessions/<id>/ (JSONL 형식)
  claude -c: 최근 세션 이어서
  claude --resume <id>: 특정 세션 복원
  claude --fork-session: 세션 분기 (원본 유지)`;

export const agentLoopAnnotations = [
  { lines: [5, 14] as [number, number], color: 'sky' as const, note: 'API 호출 → 응답 분석 → 도구 실행 루프' },
  { lines: [16, 20] as [number, number], color: 'emerald' as const, note: '핵심 특성 4가지' },
  { lines: [22, 26] as [number, number], color: 'amber' as const, note: '세션 영속성 — JSONL 저장' },
];
