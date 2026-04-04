export const C = {
  propose: '#6366f1', prevote: '#f59e0b',
  precommit: '#10b981', commit: '#0ea5e9', err: '#ef4444',
};

export const STEPS = [
  {
    label: 'enterNewRound — 라운드 초기화',
    body: '제안자 회전 + 투표 리셋 → enterPropose 즉시 호출',
  },
  {
    label: 'enterPropose — 제안자 판별',
    body: '제안자는 블록 생성·서명·전파, 비제안자는 타임아웃 대기 → enterPrevote',
  },
  {
    label: 'enterPrevote — Lock or 제안 블록 투표',
    body: 'LockedBlock이면 Lock 블록에 prevote, 없으면 검증 후 투표 (무효 시 nil)',
  },
  {
    label: 'enterPrecommit — polka(2/3+ prevote) 분기',
    body: 'Polka for block → Lock → precommit, Polka for nil → Lock 해제 → nil',
  },
  {
    label: 'enterCommit — 2/3+ precommit → 확정',
    body: '2/3+ precommit 확인 → SaveBlock → ABCI ApplyBlock → 다음 높이',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'enter-new-round', 1: 'enter-propose', 2: 'enter-prevote',
  3: 'enter-precommit', 4: 'enter-commit',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'state.go — enterNewRound()', 1: 'state.go — enterPropose()',
  2: 'state.go — defaultDoPrevote()', 3: 'state.go — enterPrecommit()',
  4: 'state.go — enterCommit() + finalizeCommit()',
};
