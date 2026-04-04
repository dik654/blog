export const C = {
  vote: '#6366f1', threshold: '#f59e0b',
  transition: '#10b981', evidence: '#ef4444', timer: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'tryAddVote — 투표 추가 + 이중 투표 감지',
    body: '서명 검증 + 집계, 이중 투표 감지 시 EvidencePool 신고 (자신이면 panic)',
  },
  {
    label: 'addVote — Prevote +2/3 감지',
    body: '2/3 Any → timeoutPrevote 스케줄, Polka 달성 → enterPrecommit',
  },
  {
    label: 'addVote — Precommit +2/3 감지',
    body: '2/3 Any → timeoutPrecommit, 2/3 Majority + 블록 해시 → enterCommit',
  },
  {
    label: 'ValidBlock 갱신 (미래 라운드 Polka)',
    body: 'Prevote 2/3가 특정 블록에 수렴 → ValidBlock 갱신, 다음 라운드에서 재사용',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'try-add-vote', 1: 'add-vote', 2: 'add-vote', 3: 'add-vote',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'state.go — tryAddVote()', 1: 'state.go — addVote() — Prevote 경로',
  2: 'state.go — addVote() — Precommit 경로', 3: 'state.go — addVote() — ValidBlock',
};
