export const C = {
  header: '#6366f1',
  commit: '#10b981',
  evidence: '#f59e0b',
  proposer: '#8b5cf6',
  err: '#ef4444',
};

export const STEPS = [
  {
    label: '① 헤더 검증 — ChainID · Height · LastBlockID',
    body: 'ChainID 불일치 → 다른 체인의 블록 차단',
  },
  {
    label: '② LastCommit 서명 검증 (2/3+)',
    body: 'VerifyCommitLightTrusting(state.LastValidators, block.LastCommit)',
  },
  {
    label: '③ Evidence 유효기간 검증',
    body: 'ev.Height() + MaxAgeNumBlocks < block.Height → 만료',
  },
  {
    label: '④ Proposer 검증',
    body: 'state.Validators.HasAddress(block.ProposerAddress)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'validate-block', 1: 'validate-block',
  2: 'validate-block', 3: 'validate-block',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'validation.go — 헤더 검증',
  1: 'validation.go — LastCommit 서명',
  2: 'validation.go — Evidence 유효기간',
  3: 'validation.go — Proposer 확인',
};
