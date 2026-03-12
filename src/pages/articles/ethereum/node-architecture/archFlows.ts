export interface FlowStep { desc: string; modules: string[] }
export interface Flow { title: string; steps: FlowStep[] }

export const flows: Record<string, Flow> = {
  validator: { title: '블록 제안 흐름', steps: [
    { desc: '슬롯 할당 수신, 제안자 키 확인', modules: ['validator'] },
    { desc: 'BeaconChain에 블록 템플릿 요청', modules: ['validator', 'beacon'] },
    { desc: 'EL에서 최적 tx 페이로드 빌드', modules: ['beacon', 'engine', 'engine-tree', 'txpool'] },
    { desc: '슬래싱 방지 DB 확인 후 BLS 서명', modules: ['validator'] },
    { desc: 'Gossipsub으로 서명 블록 전파', modules: ['beacon', 'sync', 'libp2p'] },
  ]},
  beacon: { title: '블록 수신 및 처리 흐름', steps: [
    { desc: 'Gossipsub에서 블록 수신 후 SyncManager에 전달', modules: ['libp2p', 'sync'] },
    { desc: 'process_block() — 서명·슬롯·상태 전환 검증', modules: ['beacon'] },
    { desc: 'engine_newPayload() — EL에 실행 페이로드 전달', modules: ['beacon', 'engine', 'engine-tree'] },
    { desc: 'EVM 실행 완료 후 VALID 응답 수신', modules: ['engine-tree', 'engine', 'beacon'] },
    { desc: 'fork_choice() — canonical head 갱신', modules: ['beacon'] },
    { desc: '상태·블록 HotColdDB에 기록', modules: ['beacon', 'hotcold'] },
  ]},
  hotcold: { title: '상태 저장 흐름', steps: [
    { desc: 'BeaconChain이 새 비콘 상태를 Hot DB(LevelDB)에 기록', modules: ['beacon', 'hotcold'] },
    { desc: '최근 ~64 epoch는 Hot DB에서 빠른 접근 유지', modules: ['hotcold'] },
    { desc: '확정 체크포인트 이후 블록을 Cold Freezer로 이동', modules: ['hotcold'] },
    { desc: 'EIP-4844 블롭은 Blobs DB에 별도 보관 (4096 슬롯 TTL)', modules: ['hotcold'] },
  ]},
  sync: { title: 'Range Sync 흐름', steps: [
    { desc: '새 피어 연결, 헤드 슬롯 비교 후 Range 계획 수립', modules: ['sync', 'libp2p'] },
    { desc: 'libp2p Req/Resp로 배치 블록 요청·수신', modules: ['sync', 'libp2p'] },
    { desc: '수신 블록을 순서대로 BeaconChain에 제출', modules: ['sync', 'beacon'] },
    { desc: '헤드 도달 후 Backfill로 과거 히스토리 역방향 채우기', modules: ['sync', 'hotcold'] },
  ]},
  libp2p: { title: '블록 전파 흐름', steps: [
    { desc: 'beacon_block Gossipsub 토픽 구독', modules: ['libp2p'] },
    { desc: '새 블록 수신 → SyncManager에 전달', modules: ['libp2p', 'sync'] },
    { desc: 'Discv5 ENR 탐색으로 새 피어 발견 및 연결', modules: ['libp2p'] },
    { desc: '어테스테이션 서브넷으로 집계 결과 전파', modules: ['libp2p', 'beacon'] },
  ]},
  engine: { title: 'JWT 인증 통신 흐름', steps: [
    { desc: 'CL: 공유 --jwt-secret 파일로 HS256 JWT 생성 (exp = now + 5s)', modules: ['beacon'] },
    { desc: 'HTTP POST http://127.0.0.1:8551 — Authorization: Bearer <token>', modules: ['engine'] },
    { desc: 'EL: 서명 검증 + exp ±5초 이내 확인 후 RPC 핸들러 호출', modules: ['engine', 'engine-tree'] },
    { desc: 'engine_newPayloadV3: EVM 실행 및 상태 루트 계산', modules: ['engine-tree'] },
    { desc: 'VALID / INVALID / SYNCING 상태 코드 응답', modules: ['engine-tree', 'engine', 'beacon'] },
  ]},
  'engine-tree': { title: '실행 페이로드 처리 흐름', steps: [
    { desc: 'on_new_payload() — Engine API에서 페이로드 수신', modules: ['engine-tree', 'engine'] },
    { desc: 'PayloadProcessor: 트랜잭션 EVM 순차 실행', modules: ['engine-tree'] },
    { desc: 'SparseStateTrie: 상태 루트 병렬 계산', modules: ['engine-tree'] },
    { desc: 'PersistenceService: 확정 블록 Storage에 비동기 기록', modules: ['engine-tree', 'storage'] },
    { desc: 'CL에 VALID 응답, 다음 fork_choice 수신 대기', modules: ['engine-tree', 'engine', 'beacon'] },
  ]},
  txpool: { title: 'tx 수집 → 페이로드 빌드 흐름', steps: [
    { desc: 'devp2p에서 tx 해시 공지 수신, 검증 후 Pending 풀 추가', modules: ['txpool', 'devp2p'] },
    { desc: 'eth_sendRawTransaction으로 RPC에서 직접 제출', modules: ['txpool', 'rpc'] },
    { desc: 'forkchoiceUpdated attrs 수신 → best_transactions() 선별', modules: ['txpool', 'engine-tree'] },
    { desc: '블록 확정 후 포함 tx 제거, Queued → Pending 승격', modules: ['txpool', 'engine-tree'] },
  ]},
  storage: { title: '3계층 상태 조회 흐름', steps: [
    { desc: '최근 ~64블록: CanonicalInMemoryState (메모리, O(1))', modules: ['storage', 'engine-tree'] },
    { desc: '확정 블록·상태: DatabaseProvider MDBX (디스크 B+Tree)', modules: ['storage'] },
    { desc: '불변 히스토리: StaticFileProvider (메모리맵)', modules: ['storage'] },
    { desc: 'RPC 상태 조회 → 3계층 순서로 탐색 후 JSON 반환', modules: ['storage', 'rpc'] },
  ]},
  devp2p: { title: 'P2P 블록·tx 전파 흐름', steps: [
    { desc: 'discv4/discv5로 피어 탐색, eth/68 프로토콜 핸드셰이크', modules: ['devp2p'] },
    { desc: 'NewBlock 메시지로 새 블록 브로드캐스트', modules: ['devp2p', 'engine-tree'] },
    { desc: 'NewPooledTransactionHashes 공지 → 요청·전달', modules: ['devp2p', 'txpool'] },
    { desc: '피어 스코어링, 불량 피어 차단 및 교체', modules: ['devp2p'] },
  ]},
  rpc: { title: 'eth_call 처리 흐름', steps: [
    { desc: 'HTTP/WS JSON-RPC 요청 파싱', modules: ['rpc'] },
    { desc: 'Storage에서 요청 블록 번호의 상태 조회', modules: ['rpc', 'storage'] },
    { desc: 'EVM 실행 시뮬레이션 (상태 변경 없음)', modules: ['rpc'] },
    { desc: 'JSON 결과 직렬화 후 응답', modules: ['rpc'] },
  ]},
};
