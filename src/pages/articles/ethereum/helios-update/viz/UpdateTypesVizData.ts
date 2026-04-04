export const C = {
  optimistic: '#6366f1', finality: '#10b981',
};

export const STEPS = [
  {
    label: 'OptimisticUpdate: 최신 헤더 (미확정)',
    body: '매 슬롯(12초)마다 수신.\nfinalized가 아닌 최신 헤더 — 빠르지만 reorg 가능.',
  },
  {
    label: 'FinalityUpdate: 확정 헤더 (되돌릴 수 없음)',
    body: 'finalized 체크포인트가 갱신될 때 수신.\n2/3 검증자 투표 → 영구적으로 확정.',
  },
];
