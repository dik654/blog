export const C = { ev: '#f59e0b', ok: '#10b981', err: '#ef4444', block: '#6366f1' };

export const STEPS = [
  {
    label: 'EvidencePool — 비잔틴 증거 수집',
    body: '이중 투표(DuplicateVoteEvidence):',
  },
  {
    label: 'AddEvidence → verify → 풀 추가',
    body: '① 이미 pending/committed인지 확인',
  },
  {
    label: 'PendingEvidence → 블록 포함 → 슬래싱',
    body: '제안자가 블록 생성 시 PendingEvidence(maxBytes) 호출',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'evidence-pool', 1: 'evidence-add', 2: 'evidence-update',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'pool.go — Pool struct',
  1: 'pool.go — AddEvidence()',
  2: 'pool.go — Update + PendingEvidence',
};
