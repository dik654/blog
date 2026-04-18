import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '계층형 — Orchestrator가 Worker를 지휘한다',
    body: 'Orchestrator Agent가 작업을 분해하고 적절한 Worker에게 위임한다. Worker 간 직접 통신 없이 Orchestrator를 경유한다. 장점: 흐름 제어 명확. 단점: Orchestrator 병목.',
  },
  {
    label: '수평형 — Peer-to-peer 자유 통신',
    body: '모든 에이전트가 동등한 권한으로 메시지를 주고받는다. 장점: 유연하고 분산적. 단점: 대화 발산 위험, 종료 조건 필요.',
  },
  {
    label: '파이프라인형 — 순차 처리 체인',
    body: 'Agent A 출력 → Agent B 입력 → Agent C 입력. 데이터 변환 흐름에 적합. 장점: 디버그 용이. 단점: 피드백 루프 부재.',
  },
  {
    label: '선택 기준 — 복잡도와 제어 수준',
    body: '독립 작업 분배 → 계층형. 논의·토론 필요 → 수평형. 데이터 변환 파이프라인 → 파이프라인형. 제조 현장: 대부분 계층형이 적합(책임 명확).',
  },
];

export const ORCH_WORKERS = [
  { label: 'RAG', color: '#6366f1' },
  { label: 'Analyze', color: '#10b981' },
  { label: 'Report', color: '#f59e0b' },
];

export const TRADEOFFS = [
  { pattern: '계층형', control: 0.9, flexibility: 0.4, complexity: 0.5 },
  { pattern: '수평형', control: 0.3, flexibility: 0.9, complexity: 0.8 },
  { pattern: '파이프라인', control: 0.7, flexibility: 0.3, complexity: 0.3 },
];
