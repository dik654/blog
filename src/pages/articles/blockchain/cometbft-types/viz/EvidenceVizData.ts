export const C = { err: '#ef4444', vote: '#f59e0b', ok: '#10b981' };

export const STEPS = [
  {
    label: 'DuplicateVoteEvidence — 이중 투표 증거 구조체',
    body: 'VoteA, VoteB: 같은 H/R/Type에서 다른 BlockID',
  },
  {
    label: 'Verify() — 비잔틴 증거 검증 흐름',
    body: '1. VoteA.Height == VoteB.Height 확인',
  },
  {
    label: 'EvidenceData → Block.Evidence에 포함',
    body: 'EvidenceList: 여러 증거를 담는 배열',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'evidence-struct', 1: 'evidence-verify', 2: 'evidence-struct',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'evidence.go — DuplicateVoteEvidence',
  1: 'evidence.go — Verify()',
  2: 'evidence.go — EvidenceData.Hash()',
};
