export interface MessagePair {
  id: string;
  request: string;
  response: string;
  purpose: string;
  details: string;
  color: string;
}

export const ETH_MESSAGES: MessagePair[] = [
  {
    id: 'headers',
    request: 'GetBlockHeaders',
    response: 'BlockHeaders',
    purpose: '블록 헤더 동기화',
    details: '시작 해시/번호 + 수량 + 간격을 지정하여 헤더를 요청한다. 동기화 초기에 대량 사용. reverse 플래그로 역순 요청도 가능.',
    color: '#6366f1',
  },
  {
    id: 'bodies',
    request: 'GetBlockBodies',
    response: 'BlockBodies',
    purpose: '블록 바디 다운로드',
    details: '헤더의 해시 목록으로 바디(트랜잭션 + 엉클)를 요청한다. 하나의 응답에 최대 1024개 바디. 대역폭 제한을 위해 청크 단위로 요청.',
    color: '#0ea5e9',
  },
  {
    id: 'pooled-tx',
    request: 'GetPooledTransactions',
    response: 'PooledTransactions',
    purpose: 'TX 풀 데이터 요청',
    details: 'eth/68에서 NewPooledTransactionHashes가 해시+타입+크기를 포함하므로, 수신 측이 대형 TX를 건너뛰고 필요한 것만 선택 요청 가능.',
    color: '#10b981',
  },
  {
    id: 'receipts',
    request: 'GetReceipts',
    response: 'Receipts',
    purpose: '영수증 조회',
    details: '블록 해시로 해당 블록의 모든 트랜잭션 영수증을 요청한다. 로그, 가스 사용량, 상태 코드를 포함. Snap Sync에서 사용.',
    color: '#f59e0b',
  },
];

export interface BroadcastType {
  name: string;
  desc: string;
}

export const BROADCAST_TYPES: BroadcastType[] = [
  { name: 'NewBlockHashes', desc: '새 블록의 해시와 번호만 전파 (경량)' },
  { name: 'NewBlock', desc: '전체 블록을 sqrt(peers)개 피어에만 전송 (대역폭 절약)' },
  { name: 'Transactions', desc: '전체 TX 데이터를 전파 (로컬 TX 우선)' },
  { name: 'NewPooledTransactionHashes68', desc: '해시 + 타입 + 크기 전파 (eth/68)' },
];
