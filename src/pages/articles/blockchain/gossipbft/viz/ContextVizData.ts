export const C = { ec: '#f59e0b', f3: '#6366f1', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: 'EC(Expected Consensus)의 느린 확정',
    body: 'Filecoin의 EC는 확률적 합의 — 최종성에 900 에폭 필요',
  },
  {
    label: 'GossiPBFT(F3) 추가',
    body: 'EC가 블록을 생산, F3가 빠르게 확정',
  },
  {
    label: '2/3+ 스토리지 파워 투표',
    body: 'PBFT의 투표를 gossip으로 전파',
  },
  {
    label: '결과: 7.5시간 → 수 분 확정',
    body: 'F3는 수 분 내에 체인을 확정 — 대시보드에서 실시간 확정 블록 확인 가능',
  },
];
