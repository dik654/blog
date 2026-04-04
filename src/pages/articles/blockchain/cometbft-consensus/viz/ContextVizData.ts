export const C = { propose: '#6366f1', prevote: '#f59e0b', precommit: '#10b981', err: '#ef4444', commit: '#0ea5e9' };

export const STEPS = [
  {
    label: '왜 합의 엔진이 필요한가',
    body: 'N개 노드가 동일한 블록 순서에 합의 — 불일치 시 체인 분기·이중 지불',
  },
  {
    label: '문제: 네트워크 지연 + 악의적 노드',
    body: '네트워크 지연 + 최대 1/3 비잔틴 노드 → 3단계 투표로 안전 확정',
  },
  {
    label: 'Propose → Prevote → Precommit',
    body: 'Propose → 2/3+ prevote(polka) → 2/3+ precommit → 단일 슬롯 확정',
  },
  {
    label: 'receiveRoutine — 합의의 심장',
    body: 'peerMsgQueue/internalMsgQueue/timeoutTicker 3개 채널의 for-select 루프',
  },
  {
    label: '라운드 상태 머신 (5단계)',
    body: 'NewRound→Propose→Prevote→Precommit→Commit — 2/3+ 투표 또는 타임아웃으로 전이',
  },
];
