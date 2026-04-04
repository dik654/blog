export const C = {
  propose: '#6366f1', prevote: '#f59e0b',
  precommit: '#10b981', err: '#ef4444', wal: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'handleTimeout — 타임아웃 디스패치',
    body: 'Propose→enterPrevote, PrevoteWait→enterPrecommit, PrecommitWait→enterNewRound',
  },
  {
    label: 'Linear Backoff — 라운드별 타임아웃 증가',
    body: 'TimeoutPropose + round×Delta로 선형 증가 — 네트워크 불안정 시 점진적 대기',
  },
  {
    label: 'WAL 기반 크래시 복구',
    body: '자신의 투표는 WriteSync로 디스크 확정 — 크래시 후 WAL 리플레이로 복구',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'handle-timeout', 1: 'handle-timeout', 2: 'receive-routine',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'state.go — handleTimeout()', 1: 'state.go — config.Propose(round)',
  2: 'state.go — WAL WriteSync',
};
