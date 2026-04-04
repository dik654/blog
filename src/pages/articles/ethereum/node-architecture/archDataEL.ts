import type { Module } from './archData';

export const elModules: Record<string, Module> = {
  'engine-tree': {
    label: 'EngineTree', layer: 'el',
    role: 'EVM 실행 + fork-choice 상태 관리',
    fns: [
      { sig: 'on_new_payload()', desc: 'Engine API 수신 후 EVM 실행 및 상태 루트 계산' },
      { sig: 'on_forkchoice_updated()', desc: 'canonical head 변경, 확정 블록 Storage 기록' },
      { sig: 'get_payload()', desc: 'TxPool에서 최적 tx 선별하여 페이로드 반환' },
    ],
    links: [
      { target: 'engine', via: 'Engine API', dir: '←' },
      { target: 'storage', via: '직접 읽기/쓰기', dir: '↔',
        msgs: ['commit_block(SealedBlock, ExecutionOutcome) →', 'get_block(hash) → SealedBlock', 'historical_state_at(block_num) → State'] },
      { target: 'txpool', via: 'PayloadBuilder', dir: '←',
        msgs: ['best_transactions(BaseFeeConfig) → BestTransactions', 'remove_transactions(included_hashes) →'] },
    ],
  },
  txpool: {
    label: 'TxPool', layer: 'el',
    role: '가스 가격순 tx 분류 및 최적 선별',
    fns: [
      { sig: 'add_transaction()', desc: '유효성 검증 후 Pending/Queued/Basefee/Blob 서브풀 배치' },
      { sig: 'best_transactions()', desc: '가스 가격순 정렬된 최적 tx 이터레이터 반환' },
      { sig: 'remove_transactions()', desc: '블록 확정 후 포함된 tx 제거' },
    ],
    links: [
      { target: 'devp2p', via: 'tx 전파/수신', dir: '↔',
        msgs: ['NewPooledTransactionHashes(tx_hashes)', 'GetPooledTransactions(hashes) →', 'PooledTransactions(txs) ←'] },
      { target: 'engine-tree', via: 'PayloadBuilder', dir: '→' },
      { target: 'rpc', via: 'eth_sendRawTransaction', dir: '←' },
    ],
  },
  storage: {
    label: 'Storage (3-tier)', layer: 'el',
    role: 'RAM→MDBX→StaticFile 3단계 조회',
    fns: [
      { sig: 'get_block()', desc: 'CanonicalInMemoryState → MDBX → StaticFile 순 조회' },
      { sig: 'historical_state_at()', desc: '특정 블록 번호의 과거 상태 재구성' },
      { sig: 'commit_block()', desc: '확정 블록을 MDBX에 쓰고 StaticFile에 이동' },
    ],
    links: [
      { target: 'engine-tree', via: '직접 읽기/쓰기', dir: '↔' },
      { target: 'rpc', via: '상태/블록 조회', dir: '←',
        msgs: ['eth_getBlockByHash/Number → SealedBlock', 'eth_getBalance / eth_getCode → state', 'eth_getLogs(filter) → Log[]'] },
    ],
  },
  devp2p: {
    label: 'devp2p', layer: 'el',
    role: 'eth/68 블록·tx 브로드캐스트',
    fns: [
      { sig: 'announce_block()', desc: 'eth/68 NewBlock 메시지로 새 블록 브로드캐스트' },
      { sig: 'get_block_bodies()', desc: '피어에게 블록 바디 배치 요청 (HeadersSync)' },
      { sig: 'send_transactions()', desc: 'tx 해시 공유 후 요청하는 피어에 전달' },
    ],
    links: [
      { target: 'txpool', via: 'tx 전파/수신', dir: '↔' },
      { target: 'engine-tree', via: 'new block 전달', dir: '→' },
    ],
  },
  rpc: {
    label: 'RPC', layer: 'el',
    role: 'eth_* JSON-RPC 사용자 요청 처리',
    fns: [
      { sig: 'eth_sendRawTransaction()', desc: '서명된 tx를 디코딩 후 TxPool에 추가' },
      { sig: 'eth_getBlockByHash()', desc: 'Storage에서 블록·트랜잭션 조회 후 JSON 반환' },
      { sig: 'eth_call()', desc: '상태 변경 없이 EVM 실행 시뮬레이션' },
    ],
    links: [
      { target: 'storage', via: '상태/블록 조회', dir: '→' },
      { target: 'txpool', via: 'tx 제출/조회', dir: '↔',
        msgs: ['eth_sendRawTransaction(signed_tx) →', 'eth_getTransactionByHash(hash) →', 'txpool_content() → pending/queued'] },
    ],
  },
};
