export interface Link { target: string; via: string; dir: '→' | '←' | '↔'; msgs?: string[] }
export interface Fn { sig: string; desc: string }
export interface Module {
  label: string;
  layer: 'cl' | 'el' | 'api';
  role: string;
  fns: Fn[];
  links: Link[];
  notes?: string[];
}

export const modules: Record<string, Module> = {
  validator: {
    label: 'Validator Client', layer: 'cl',
    role: '슬래싱 방지 BLS 서명 전담',
    fns: [
      { sig: 'sign_block()', desc: '슬래싱 방지 DB 확인 후 BLS 서명' },
      { sig: 'sign_attestation()', desc: '할당된 슬롯에서 어테스테이션 서명' },
      { sig: 'subscribe_to_subnet()', desc: '어테스테이션 집계용 서브넷 구독' },
    ],
    links: [
      { target: 'beacon', via: 'Beacon API (HTTP)', dir: '→',
        msgs: ['GET /validator/duties/proposer → ProposerDuties[]', 'GET /validator/attestation_data → AttestationData', 'POST /beacon/blocks ← SignedBeaconBlock'] },
    ],
  },
  beacon: {
    label: 'BeaconChain', layer: 'cl',
    role: 'LMD-GHOST fork choice + 상태 전환',
    fns: [
      { sig: 'process_block()', desc: '블록 서명·슬롯·상태 전환 검증' },
      { sig: 'fork_choice()', desc: 'LMD-GHOST + FFG로 canonical head 결정' },
      { sig: 'process_attestation()', desc: 'OperationPool에 어테스테이션 추가·집계' },
    ],
    links: [
      { target: 'validator', via: 'ValidatorAPI', dir: '←' },
      { target: 'hotcold', via: '직접 호출', dir: '↔',
        msgs: ['put_block(SignedBeaconBlock) →', 'get_state(slot) → BeaconState', 'freeze_to_cold(finalized_blocks) →'] },
      { target: 'sync', via: 'tokio channel', dir: '↔',
        msgs: ['SyncMessage::AddPeer(peer_id, sync_info)', 'SyncMessage::BlocksProcessed([blocks])', 'ProcessBlock(signed_block) →'] },
      { target: 'engine', via: 'Engine API', dir: '→' },
    ],
  },
  hotcold: {
    label: 'HotColdDB', layer: 'cl',
    role: '최근(Hot) / 확정(Cold) 비콘 상태 저장',
    fns: [
      { sig: 'put_block()', desc: '최근 블록을 Hot DB(LevelDB)에 저장' },
      { sig: 'get_state()', desc: '슬롯 번호로 비콘 상태 조회' },
      { sig: 'freeze_to_cold()', desc: '확정 블록을 Cold Freezer로 이동' },
    ],
    links: [
      { target: 'beacon', via: '직접 호출', dir: '↔' },
    ],
  },
  sync: {
    label: 'SyncManager', layer: 'cl',
    role: 'Range · Backfill · Lookup 동기화',
    fns: [
      { sig: 'add_peer()', desc: '새 피어 sync 상태 등록 및 range 계획 수립' },
      { sig: 'process_sync_message()', desc: 'Range/Backfill/Lookup 동기화 상태 전환' },
      { sig: 'range_sync_block()', desc: '피어에서 배치 블록 요청 후 BeaconChain 제출' },
    ],
    links: [
      { target: 'libp2p', via: 'tokio channel', dir: '↔',
        msgs: ['BlocksByRangeReq { start_slot, count } →', 'BlocksByRangeResp([SignedBeaconBlock]) ←', 'BlobsByRangeReq / BlobsByRangeResp'] },
      { target: 'beacon', via: 'block 제출', dir: '→' },
    ],
  },
  libp2p: {
    label: 'libp2p', layer: 'cl',
    role: 'Gossipsub 전파 + Discv5 피어 탐색',
    fns: [
      { sig: 'publish(topic, msg)', desc: 'Gossipsub 토픽으로 블록·어테스테이션 전파' },
      { sig: 'send_request(peer)', desc: 'Req/Resp 프로토콜로 블록 개별 요청' },
      { sig: 'discover_peers()', desc: 'Discv5 ENR 탐색으로 새 피어 발견' },
    ],
    links: [
      { target: 'sync', via: 'tokio channel', dir: '↔' },
    ],
  },
  engine: {
    label: 'Engine API (JWT)', layer: 'api',
    role: 'CL ↔ EL 실행 페이로드 교환 채널',
    fns: [
      { sig: 'engine_newPayloadV3(payload)', desc: 'CL→EL: 실행 페이로드 전달·검증·EVM 실행 요청' },
      { sig: 'engine_forkchoiceUpdatedV3(fcu, attrs?)', desc: 'CL→EL: canonical head 갱신, attrs 있으면 payload 빌드 시작' },
      { sig: 'engine_getPayloadV4(payload_id)', desc: 'CL←EL: 빌드 완료된 페이로드 + EIP-4844 블롭 수신' },
    ],
    links: [
      { target: 'beacon', via: 'HTTP POST', dir: '←' },
      { target: 'engine-tree', via: 'HTTP POST', dir: '→' },
    ],
    notes: [
      '양쪽 노드가 동일한 --jwt-secret 파일을 공유',
      'CL이 매 요청마다 HS256 JWT 생성 → Authorization: Bearer <token>',
      'EL은 exp 클레임 기준 ±5초 이내 토큰만 수락',
      '기본 엔드포인트: http://127.0.0.1:8551 (로컬 전용)',
    ],
  },
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
