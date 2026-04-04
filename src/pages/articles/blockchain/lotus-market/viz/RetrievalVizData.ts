export const C = {
  query: '#8b5cf6', data: '#10b981', pay: '#f59e0b', err: '#ef4444',
};

export const STEP_REFS: Record<number, string> = {
  0: 'retrieval', 1: 'retrieval', 2: 'retrieval',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'provider.go L21 — GetPieceInfoFromCid()',
  1: 'provider.go L28 — QueryResponse 가격 계산',
  2: 'provider.go — Payment Channel 전송',
};

export const STEPS = [
  {
    label: 'HandleQuery: 데이터 존재 확인',
    body: 'PayloadCID로 PieceStore에서 조각(Piece) 위치 조회',
  },
  {
    label: '가격 응답: 바이트당 가격 + unseal',
    body: 'QueryResponseAvailable + Size + PricePerByte + UnsealPrice',
  },
  {
    label: 'Payment Channel로 데이터 전송',
    body: '오프체인 마이크로페이먼트 → 온체인 확인 불필요',
  },
];
