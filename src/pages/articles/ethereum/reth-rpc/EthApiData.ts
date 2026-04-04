export interface EthMethod {
  id: string;
  name: string;
  category: string;
  desc: string;
  flow: string;
  color: string;
}

export const ETH_METHODS: EthMethod[] = [
  {
    id: 'get-balance',
    name: 'eth_getBalance',
    category: '상태 조회',
    desc: '계정 잔액을 조회한다.',
    flow: 'StateProvider.account(address) → balance 필드 반환',
    color: '#6366f1',
  },
  {
    id: 'call',
    name: 'eth_call',
    category: 'EVM 시뮬레이션',
    desc: '상태를 변경하지 않는 읽기 전용 EVM 호출. 컨트랙트 view 함수 호출에 사용.',
    flow: 'StateProvider 위에 revm 임시 실행 → 결과만 반환, DB 기록 없음',
    color: '#0ea5e9',
  },
  {
    id: 'send-raw-tx',
    name: 'eth_sendRawTransaction',
    category: 'TX 제출',
    desc: '서명된 트랜잭션을 노드에 제출한다. txpool에 추가되고 피어에 전파.',
    flow: 'RLP 디코딩 → 서명 검증 → txpool.add → 피어 브로드캐스트',
    color: '#10b981',
  },
  {
    id: 'get-logs',
    name: 'eth_getLogs',
    category: '로그 검색',
    desc: '블록 범위와 토픽 필터로 이벤트 로그를 검색한다.',
    flow: 'bloom filter로 블록 선별 → 매칭 TX 영수증에서 로그 추출',
    color: '#f59e0b',
  },
  {
    id: 'estimate-gas',
    name: 'eth_estimateGas',
    category: '가스 추정',
    desc: '트랜잭션 실행에 필요한 가스량을 추정한다.',
    flow: 'binary search로 최소 가스 탐색 — revm 반복 실행으로 성공하는 최솟값 도출',
    color: '#ec4899',
  },
];
