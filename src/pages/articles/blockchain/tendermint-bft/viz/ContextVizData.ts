export const C = { pbft: '#6366f1', tm: '#10b981', lock: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: 'PBFT의 O(n²) 문제',
    body: 'PBFT O(n²) 통신 + O(n³) View Change — 블록체인에 비효율적',
  },
  {
    label: 'Tendermint 간소화',
    body: 'Propose→Prevote→Precommit→Commit 라운드 기반 투표로 View Change 단순화',
  },
  {
    label: '3단계 투표 + 잠금',
    body: '+2/3 Prevote로 Polka 형성 → 블록 잠금 → Safety 보장',
  },
  {
    label: '단일 슬롯 확정성',
    body: 'Tendermint는 1 라운드에서 즉시 확정 — reorg 없음',
  },
];
