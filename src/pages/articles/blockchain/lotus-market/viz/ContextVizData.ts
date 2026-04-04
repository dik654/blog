export const C = {
  deal: '#6366f1', data: '#10b981',
  chain: '#f59e0b', err: '#ef4444', ret: '#8b5cf6',
};

export const STEP_REFS: Record<number, string> = {
  0: 'storage-deal', 1: 'storage-deal',
  2: 'retrieval', 3: 'storage-deal',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'provider.go — Provider 구조체',
  1: 'provider.go L18 — HandleDealProposal()',
  2: 'provider.go L17 — HandleQuery()',
  3: 'provider.go L35 — PublishDeal()',
};

export const STEPS = [
  {
    label: '분산 스토리지 마켓',
    body: '클라이언트: 데이터 저장 요청 — Storage Provider: 공간 제공 + 봉인 + 증명',
  },
  {
    label: '스토리지 딜 흐름',
    body: 'HandleDealProposal: 제안 검증(가격/기간/콜래터럴)',
  },
  {
    label: '리트리벌 마켓 (오프체인)',
    body: 'HandleQuery: PayloadCID → PieceStore에서 위치 조회',
  },
  {
    label: 'Boost: 독립 마켓 데몬',
    body: '기존 lotus-miner 내장 마켓 → Boost로 분리',
  },
];
