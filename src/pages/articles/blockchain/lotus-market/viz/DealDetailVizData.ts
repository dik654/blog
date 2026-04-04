export const C = {
  deal: '#6366f1', data: '#10b981', chain: '#f59e0b', ret: '#8b5cf6',
};

export const STEP_REFS: Record<number, string> = {
  0: 'storage-deal', 1: 'storage-deal', 2: 'storage-deal',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'provider.go L22 — validateProposal()',
  1: 'provider.go L26 — transferData() + AddPiece',
  2: 'provider.go L35 — PublishDeal()',
};

export const STEPS = [
  {
    label: '딜 제안 & 검증',
    body: 'HandleDealProposal() 진입',
  },
  {
    label: '데이터 전송 → 섹터 봉인',
    body: 'transferData(): GraphSync/HTTP로 클라이언트에서 수신',
  },
  {
    label: '온체인 활성화 & 정산',
    body: 'PublishDeal(): PublishStorageDeals 메시지 제출',
  },
];
