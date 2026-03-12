// Lighthouse
import dutiesServiceRs from './codebase/lighthouse/validator_client/validator_services/src/duties_service.rs?raw';
import validatorStoreRs from './codebase/lighthouse/validator_client/validator_store/src/lib.rs?raw';
import gossipMethodsRs from './codebase/lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs?raw';
import beaconChainRs from './codebase/lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs?raw';
import httpRs from './codebase/lighthouse/beacon_node/execution_layer/src/engine_api/http.rs?raw';
import serviceRs from './codebase/lighthouse/beacon_node/network/src/service.rs?raw';
import hotColdStoreRs from './codebase/lighthouse/beacon_node/store/src/hot_cold_store.rs?raw';
import syncManagerRs from './codebase/lighthouse/beacon_node/network/src/sync/manager.rs?raw';

// Reth
import engineTreeRs from './codebase/reth/crates/engine/tree/src/tree/mod.rs?raw';
import sessionActiveRs from './codebase/reth/crates/net/network/src/session/active.rs?raw';
import transactionsMgrRs from './codebase/reth/crates/net/network/src/transactions/mod.rs?raw';
import sendRawTxRs from './codebase/reth/crates/rpc/rpc/src/eth/helpers/transaction.rs?raw';
import dbProviderRs from './codebase/reth/crates/storage/provider/src/providers/database/provider.rs?raw';
import rpcBuilderRs from './codebase/reth/crates/rpc/rpc-builder/src/lib.rs?raw';
import callRs from './codebase/reth/crates/rpc/rpc/src/eth/helpers/call.rs?raw';

export interface LineNote {
  lines: [number, number];
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose';
  note: string;
}

export interface CodeRef {
  path: string;
  code: string;
  highlight: [number, number]; // 1-indexed
  desc?: string;               // 한글 코드 해설
  annotations?: LineNote[];    // 라인별 구간 설명
}

export const codeRefs: Record<string, CodeRef> = {

  /* ── Validator ──────────────────────────────────────────────── */
  'validator-0': {
    path: 'lighthouse/validator_client/validator_services/src/duties_service.rs',
    code: dutiesServiceRs,
    highlight: [1516, 1615],
    annotations: [
      { lines: [1516, 1529], color: 'sky',     note: '함수 진입 · 타이머 시작 · 현재 슬롯/epoch 계산' },
      { lines: [1530, 1565], color: 'emerald', note: '비콘 노드에 GET /validator/duties/proposer/{epoch} 조회 (first_success 폴백)' },
      { lines: [1566, 1615], color: 'amber',   note: '응답 파싱 · 내 pubkey만 필터 · proposers 맵에 캐싱 · 추가 알림 발송' },
    ],
    desc:
`문제: 수백 명의 검증자가 매 epoch마다 어느 슬롯에 블록을 제안해야 하는지 알아야 합니다. 매번 상태 트리 전체를 읽어 계산하면 너무 느립니다.

해결: poll_beacon_proposers() 는 비콘 노드에 GET /eth/v1/validator/duties/proposer/{epoch} 를 호출해 epoch 전체의 제안자 목록을 한 번에 받아옵니다. 내가 관리하는 pubkey가 포함된 슬롯만 로컬 proposers 맵에 캐싱해 두고, 해당 슬롯이 오면 즉시 BlockService에 알립니다.

하이라이트 구간: 비콘 노드 fallback 조회 → 결과 필터링 → proposers 맵에 삽입 흐름`,
  },

  'validator-3': {
    path: 'lighthouse/validator_client/validator_store/src/lib.rs',
    code: validatorStoreRs,
    highlight: [99, 104],
    annotations: [
      { lines: [99, 104], color: 'sky', note: 'sign_block 트레이트 메서드 — 슬래싱 보호 포함 BLS 서명의 인터페이스 정의' },
    ],
    desc:
`문제: 같은 검증자 키가 실수로 두 노드에서 동시에 실행되면 동일 슬롯에 서로 다른 블록에 서명하게 됩니다. 이를 이중 서명(Double Signing)이라 하며 탐지 시 스테이킹한 ETH 일부가 강제 소각되는 슬래싱 패널티를 받습니다.

해결: ValidatorStore 트레이트의 sign_block() 메서드는 반드시 슬래싱 보호 DB를 거치도록 설계되어 있습니다. 구현체는 서명 전에 이전 서명 이력을 확인하고, 충돌이 없을 때만 BLS12-381 서명을 실행합니다.

BLS12-381이란: 타원 곡선 기반 서명 방식으로, 여러 검증자의 서명을 하나로 집계(Aggregation)할 수 있어 비콘 체인이 수천 개의 어테스테이션을 효율적으로 처리할 수 있습니다.

하이라이트 구간: sign_block 트레이트 메서드 시그니처 — 슬래싱 보호를 포함한 블록 서명의 계약을 정의합니다`,
  },

  /* ── BeaconChain ────────────────────────────────────────────── */
  'beacon-0': {
    path: 'lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs',
    code: gossipMethodsRs,
    highlight: [1145, 1193],
    annotations: [
      { lines: [1145, 1152], color: 'sky',     note: 'tracing 계측 어노테이션 — 분산 추적 span 생성, 부모 없이 독립 실행' },
      { lines: [1153, 1162], color: 'emerald', note: 'process_gossip_block 함수 진입 · 블록 루트는 아직 미계산(field::Empty)' },
      { lines: [1163, 1193], color: 'amber',   note: 'unverified_block 1차 검증 → duplicate_cache로 중복 방지 → verified_block 처리' },
    ],
    desc:
`문제: P2P 네트워크를 통해 gossip으로 수신한 블록은 중복일 수도 있고, 이미 finalized(확정)된 과거 블록일 수도 있습니다. 이런 블록을 검증 없이 처리하면 CPU와 I/O가 낭비됩니다.

finalized란: 비콘 체인에서 2/3 이상의 검증자가 어테스테이션한 체크포인트로 영구적으로 확정된 블록입니다. 더 이상 fork choice가 바뀔 수 없으므로 재처리할 필요가 없습니다.

해결: process_gossip_block() 은 두 가지 빠른 필터를 먼저 통과시킵니다.
① finalized epoch 이하의 슬롯 → 즉시 무시
② 이미 DB에 있는 블록 루트 → 즉시 무시
두 필터를 통과한 블록만 process_gossip_unverified_block() 으로 넘어가 전체 검증을 수행합니다.

하이라이트 구간: process_gossip_block → process_gossip_unverified_block 호출 흐름`,
  },

  'beacon-1': {
    path: 'lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs',
    code: beaconChainRs,
    highlight: [3348, 3415],
    annotations: [
      { lines: [3348, 3368], color: 'sky',     note: '함수 시그니처 · seen_timestamp 기록 · Prometheus 카운터 증가' },
      { lines: [3369, 3395], color: 'emerald', note: 'into_execution_pending_block — BLS 배치 검증 + 상태 전이 준비, publish_fn 호출' },
      { lines: [3396, 3415], color: 'amber',   note: 'into_executed_block — EL에 엔진 페이로드 전달, 실패 시 DA 캐시에서 제거' },
    ],
    desc:
`문제: gossip으로 받은 블록의 유효성을 어떻게 효율적으로 검증하고 저장할까요? 어테스테이션·제안자 서명을 하나씩 검증하면 너무 느리고, EVM 실행까지 직렬로 수행하면 다음 블록 처리가 지연됩니다.

해결: process_block() 은 다음 순서로 처리합니다.
① BLS 서명 배치 검증 — 블록 내 모든 어테스테이션·제안자 서명을 하나의 배치로 묶어 검증 (개별 대비 ~10배 빠름)
② into_execution_pending_block() — 상태 전이 준비 (예치금·randao·슬래싱 처리)
③ into_executed_block() — EL(Reth)에 engine_newPayloadV3로 EVM 실행 위임
④ HotColdDB에 블록 + 상태 저장
⑤ fork choice 트리 갱신 — 이 블록의 어테스테이션 가중치 반영

하이라이트 구간: process_block 진입점 → execution_pending 변환 시작`,
  },

  /* ── Engine API (JWT) ───────────────────────────────────────── */
  'engine-0': {
    path: 'lighthouse/beacon_node/execution_layer/src/engine_api/http.rs',
    code: httpRs,
    highlight: [655, 666],
    annotations: [
      { lines: [655, 660], color: 'sky',   note: 'HTTP POST 요청 빌드 — URL, timeout, Content-Type, JSON body 설정' },
      { lines: [661, 664], color: 'amber', note: 'auth 존재 시 generate_token() 호출 → Authorization: Bearer 헤더 첨부' },
      { lines: [665, 666], color: 'emerald', note: '요청 전송 · 응답 JSON 파싱 · HTTP 오류 상태 확인' },
    ],
    desc:
`문제: CL(Lighthouse)과 EL(Reth)은 별도 프로세스로 실행됩니다. Engine API(HTTP JSON-RPC)가 외부에 노출되면 공격자가 가짜 엔진 요청을 보내 EL을 조작할 수 있습니다.

해결: CL과 EL이 동일한 32바이트 비밀키(jwt-secret)를 파일로 공유합니다. CL은 매 요청마다 이 비밀키로 HS256 JWT 토큰을 생성하고 Authorization: Bearer <token> 헤더에 첨부합니다. EL은 토큰을 검증하고, 현재 시각과 ±60초 이내가 아니면 요청을 거부합니다.

하이라이트 구간: auth.generate_token() 호출 → bearer_auth 헤더 첨부 — 인증 토큰이 실제로 요청에 붙는 지점`,
  },

  /* ── EngineTree ─────────────────────────────────────────────── */
  'engine-tree-0': {
    path: 'reth/crates/engine/tree/src/tree/mod.rs',
    code: engineTreeRs,
    highlight: [592, 655],
    annotations: [
      { lines: [592, 629], color: 'sky',     note: '함수 진입 · 타이밍 시작 · 페이로드 레이아웃 검증 (가스 한도, 버전드 해시 등)' },
      { lines: [630, 645], color: 'emerald', note: '잘못된 조상 블록 확인 · backfill 상태에 따라 insert/buffer 분기' },
      { lines: [646, 655], color: 'amber',   note: '처리 결과 확인 · sync 타깃 헤드면 canonical 체인에 등록' },
    ],
    desc:
`문제: CL이 보낸 실행 페이로드를 EVM으로 실행하고 stateRoot를 검증한 뒤 디스크에 저장하는 작업이 모두 완료될 때까지 CL에 응답을 못 보내면 다음 블록 처리가 지연됩니다.

SparseStateTrie란: 전체 상태 트리를 재계산하는 대신, EVM 실행으로 변경된 계정·스토리지 노드만 선택적으로 해싱해 stateRoot를 구하는 방식입니다. 변경이 적을수록 훨씬 빠릅니다.

PersistenceService란: MDBX 디스크 저장을 비동기 태스크로 분리한 서비스입니다. EL은 블록을 인메모리 트리에 보관하고 즉시 VALID를 반환한 뒤, 백그라운드에서 디스크에 씁니다.

해결: on_new_payload() 는 페이로드 검증 → 중복 확인 → EVM 실행 → 인메모리 트리 삽입 순서로 처리하고, 디스크 저장은 PersistenceService에 위임해 응답을 블로킹하지 않습니다.

하이라이트 구간: on_new_payload 진입 → 중복 확인 → 동기/비동기 처리 분기`,
  },

  /* ── DevP2P ─────────────────────────────────────────────────── */
  'devp2p-0': {
    path: 'reth/crates/net/network/src/session/active.rs',
    code: sessionActiveRs,
    highlight: [218, 260],
    annotations: [
      { lines: [218, 222], color: 'rose',    note: 'Status 메시지 거부 — 핸드셰이크 완료 후 재수신은 프로토콜 위반(BadMessage)' },
      { lines: [223, 241], color: 'sky',     note: '블록 관련 브로드캐스트 — NewBlockHashes, NewBlock, 트랜잭션 해시/데이터' },
      { lines: [242, 260], color: 'emerald', note: '요청/응답 페어 — GetBlockHeaders ↔ BlockHeaders, GetBlockBodies ↔ BlockBodies' },
    ],
    desc:
`문제: 이더리움 DevP2P 프로토콜에서 두 노드가 처음 연결되면 Status 메시지로 체인 정보를 교환하는 핸드셰이크를 수행합니다. 이 과정에서 다른 chainId이거나 다른 genesis 해시를 가진 노드는 차단해야 합니다.

핸드셰이크 완료 후: Status 메시지는 핸드셰이크 단계에서만 유효합니다. ActiveSession은 이미 핸드셰이크가 끝난 세션을 나타내므로, 이후에 다시 Status 메시지가 오면 프로토콜 위반으로 간주하고 BadMessage를 반환합니다.

해결: EthMessage::Status(_) 분기가 EthHandshakeError::StatusNotInHandshake 오류로 즉시 처리합니다. 이후 match 분기들은 실제 데이터 교환 — 블록 헤더 요청/응답, 트랜잭션 전파 등을 처리합니다.

하이라이트 구간: EthMessage 디스패치 시작 — Status 가드 → 블록/트랜잭션 메시지 라우팅`,
  },

  /* ── TxPool ─────────────────────────────────────────────────── */
  'txpool-0': {
    path: 'reth/crates/net/network/src/transactions/mod.rs',
    code: transactionsMgrRs,
    highlight: [578, 640],
    annotations: [
      { lines: [578, 589], color: 'sky',     note: '함수 진입 · 초기 동기화 중이거나 tx gossip 비활성화면 즉시 반환' },
      { lines: [590, 627], color: 'emerald', note: '피어 세션 조회 · 중복 해시 카운트 · seen_transactions 집합 갱신' },
      { lines: [628, 640], color: 'amber',   note: '이미 본 해시 지표 기록 · report_already_seen으로 피어 평판 감점' },
    ],
    desc:
`문제: 트랜잭션 전체(수 KB)를 먼저 전송하면 이미 가지고 있는 tx를 중복 수신합니다. 인기 있는 tx는 수십 개 피어에서 동시에 오기 때문에 대역폭이 크게 낭비됩니다.

해결: eth/68 프로토콜의 NewPooledTransactionHashes 메시지 — tx 해시(32바이트)만 먼저 공유합니다. on_new_pooled_transaction_hashes() 는 수신한 해시 목록을 훑어 이미 풀에 있는 것을 제외하고, 없는 것만 GetPooledTransactions 요청으로 실제 데이터를 요청합니다.

부가 로직: 피어가 이미 알고 있다고 표시된 tx의 해시를 다시 보내면 report_already_seen() 으로 피어 평판을 낮춥니다. 초기 동기화 중(is_initially_syncing)이거나 tx gossip이 비활성화된 경우는 즉시 반환합니다.

하이라이트 구간: on_new_pooled_transaction_hashes 진입 → 동기화 상태 확인 → 피어 세션 조회 → 중복 해시 카운트`,
  },

  'txpool-1': {
    path: 'reth/crates/rpc/rpc/src/eth/helpers/transaction.rs',
    code: sendRawTxRs,
    highlight: [23, 80],
    annotations: [
      { lines: [23, 37], color: 'sky',     note: 'EthTransactions impl 시작 — signers, send_raw_transaction_sync_timeout 위임' },
      { lines: [39, 80], color: 'emerald', note: 'send_transaction — WithEncoded<Recovered<PoolPooledTx>> 수신 · blob 사이드카 업캐스팅 처리' },
    ],
    desc:
`문제: 사용자가 eth_sendRawTransaction 으로 서명된 트랜잭션을 제출할 때, RLP 인코딩 오류·서명 불량·nonce 불일치·잔액 부족 등 다양한 오류가 있을 수 있습니다.

해결: EthTransactions 트레이트 구현체는 send_transaction() 메서드를 통해 처리합니다.
① WithEncoded<Recovered<PoolPooledTx>> — RLP 디코드 + ecrecover로 서명자 주소 복구
② Pool::Transaction::from_pooled() — 풀이 요구하는 형태로 변환 (nonce·잔액·maxFee 검사)
③ pool.add_transaction() — TransactionPool에 제출 → nonce 연속이면 Pending, gap이 있으면 Queued 서브풀에 분류

하이라이트 구간: EthTransactions impl 블록 — signers(), send_raw_transaction_sync_timeout(), send_transaction() 메서드 위임 체인`,
  },

  /* ── LibP2P ─────────────────────────────────────────────────── */
  'libp2p-0': {
    path: 'lighthouse/beacon_node/network/src/service.rs',
    code: serviceRs,
    highlight: [674, 720],
    annotations: [
      { lines: [674, 678], color: 'sky',     note: 'SubscribeCoreTopics 수신 · 이미 구독 중이면 즉시 반환' },
      { lines: [679, 693], color: 'violet',  note: 'shutdown_after_sync 플래그 — 동기화 완료 후 종료 요청 처리' },
      { lines: [694, 713], color: 'emerald', note: '현재 포크의 core 토픽 목록 구성 · fork_digest별로 gossipsub.subscribe() 호출' },
      { lines: [714, 720], color: 'amber',   note: 'subscribe_all_subnets 옵션 — 전체 어테스테이션 서브넷 구독 (연구/테스트용)' },
    ],
    desc:
`문제: 비콘 체인의 블록·어테스테이션 같은 메시지를 모든 노드에 직접 보내면 O(n²) 트래픽이 발생합니다. 수천 개의 노드가 있는 네트워크에서는 불가능합니다.

해결: Gossipsub — 토픽 기반 pub/sub 프로토콜. 각 노드는 관심 있는 토픽만 구독하고, 메시지를 받으면 일부 피어에게만 재전파합니다. NetworkMessage::SubscribeCoreTopics 수신 시 core_topics_to_subscribe() 로 현재 포크(Capella/Deneb…)에 맞는 토픽 목록을 구하고, required_gossip_fork_digests() 로 구한 fork digest와 조합해 "/eth2/{fork_digest}/{topic}/ssz_snappy" 형태의 토픽을 gossipsub에 등록합니다.

fork digest란: 현재 포크를 구별하는 4바이트 값으로, 다른 포크 노드의 메시지가 섞이지 않도록 토픽 이름에 포함됩니다.

하이라이트 구간: SubscribeCoreTopics 핸들러 — 토픽 목록 구성 → libp2p gossipsub.subscribe() 호출`,
  },

  /* ── HotColdDB ───────────────────────────────────────────────── */
  'hotcold-0': {
    path: 'lighthouse/beacon_node/store/src/hot_cold_store.rs',
    code: hotColdStoreRs,
    highlight: [52, 115],
    annotations: [
      { lines: [52, 73],  color: 'sky',     note: 'HotColdDB 구조체 — split(경계 슬롯), hot_db, cold_db, blobs_db 핵심 필드' },
      { lines: [74, 89],  color: 'emerald', note: '캐시 레이어 — block_cache(LRU), state_cache, historic_state_cache(API용)' },
      { lines: [108, 115],color: 'amber',   note: 'BlockCache.put_block — 인메모리 LRU 캐시에 블록 삽입 (최근 N개만 유지)' },
    ],
    desc:
`문제: 비콘 체인의 전체 히스토리는 수백 GB에 달합니다. 모든 데이터를 동일한 방식으로 저장하면 최근 블록 조회도 느려지고 저장 공간도 비효율적으로 낭비됩니다.

해결: HotColdDB — 2계층 저장소 구조
· hot_db (Hot): 최근 약 64 epoch(약 7시간)의 블록·상태. BeaconNodeBackend(LevelDB 계열). 잦은 랜덤 읽기에 최적화되어 있습니다.
· cold_db (Cold): finalized된 전체 히스토리. Freezer(순차 파일). 불변(append-only)이며 압축 저장됩니다.
· blobs_db: EIP-4844 blob 사이드카 전용 저장소(Deneb 이후).
· split: Hot/Cold 경계 슬롯 번호. 이 슬롯 이하는 Cold, 이상은 Hot에 있습니다.

새 블록은 Hot에 먼저 기록되고, finalize 이후 split을 넘어간 블록은 migrate_to_cold() 가 Cold로 이동시킵니다.

하이라이트 구간: HotColdDB 구조체 정의 — hot_db, cold_db, blobs_db, split, state_cache 필드`,
  },

  /* ── Sync ────────────────────────────────────────────────────── */
  'sync-0': {
    path: 'lighthouse/beacon_node/network/src/sync/manager.rs',
    code: syncManagerRs,
    highlight: [600, 660],
    annotations: [
      { lines: [600, 605], color: 'sky',     note: 'update_sync_state 진입 · range_sync.state() 조회 — 오류면 crit 로그 후 반환' },
      { lines: [606, 633], color: 'emerald', note: 'RangeSync 없을 때 — 헤드와 현재 슬롯 차이, 앞선 피어 유무로 상태 판정' },
      { lines: [634, 660], color: 'amber',   note: 'Backfill sync 확인 · Synced → BackFillSyncing 전환 · 네트워크 글로벌 상태 갱신' },
    ],
    desc:
`문제: 노드가 재시작하거나 오프라인 상태였을 때 체인 헤드까지 따라잡아야 합니다. 뒤처진 정도에 따라 최적 전략이 다릅니다.

해결: update_sync_state() 는 range_sync.state() 결과에 따라 SyncState를 자동으로 결정합니다.
· RangeSync 진행 중 → SyncingHead 또는 SyncingFinalized: 수십~수천 개 블록을 배치(batch)로 대량 다운로드합니다.
· RangeSync 없음 + 앞선 피어 있음 → SyncTransition: 개별 누락 블록을 lookup으로 요청합니다.
· RangeSync 없음 + 동기화 완료 → Synced: gossip으로 실시간 수신만 합니다.
· 피어 없음 → Stalled: 대기합니다.

Backfill Sync: Synced 상태에서도 과거 히스토리(고대 블록)가 부족하면 backfill_sync.start() 로 역방향 다운로드를 시작합니다.

하이라이트 구간: update_sync_state → range_sync.state() 확인 → SyncState 분기 결정`,
  },

  /* ── Storage ─────────────────────────────────────────────────── */
  'storage-0': {
    path: 'reth/crates/storage/provider/src/providers/database/provider.rs',
    code: dbProviderRs,
    highlight: [3459, 3490],
    annotations: [
      { lines: [3459, 3464], color: 'sky',     note: 'insert_block 진입 · 블록 번호 추출 (이후 body indices 조회에 사용)' },
      { lines: [3465, 3481], color: 'emerald', note: 'ExecutedBlock 래핑 (영수증·상태 비어있음) · save_blocks(BlocksOnly) 위임' },
      { lines: [3482, 3490], color: 'amber',   note: 'block_body_indices 조회 · 없으면 BlockBodyIndicesNotFound 오류 반환' },
    ],
    desc:
`문제: 블록 헤더·트랜잭션·영수증·상태를 빠르게 저장하고 O(log n) 시간에 조회해야 합니다. 일반 파일 I/O는 너무 느립니다.

해결: Reth는 MDBX(Memory-Mapped B-Tree Database)를 사용합니다. 파일을 메모리에 직접 매핑(mmap)해 페이지 단위로 읽고 쓰므로 시스템 콜 없이 디스크 I/O가 가능합니다.

insert_block() 은 블록을 ExecutedBlock 으로 래핑해 save_blocks(SaveBlocksMode::BlocksOnly) 에 위임합니다. BlocksOnly 모드는 영수증·상태·trie 계산을 건너뛰고 블록 헤더와 바디만 기록합니다.

테이블 구조: BlockBodyIndices(블록 번호 → tx 범위 인덱스), TransactionBlocks(tx 번호 → 블록 번호), StaticFiles(트랜잭션 실제 데이터, 별도 파일).

하이라이트 구간: insert_block → ExecutedBlock 래핑 → save_blocks 위임 → block_body_indices 반환`,
  },

  /* ── RPC ─────────────────────────────────────────────────────── */
  'rpc-0': {
    path: 'reth/crates/rpc/rpc-builder/src/lib.rs',
    code: rpcBuilderRs,
    highlight: [116, 175],
    annotations: [
      { lines: [116, 139], color: 'sky',     note: 'RpcModuleBuilder 구조체 — Provider, Pool, Network, EvmConfig 등 의존성 필드' },
      { lines: [140, 175], color: 'emerald', note: '의존성 주입 메서드 체인 — with_provider, with_pool 등으로 빌더 패턴 구성' },
    ],
    desc:
`문제: eth_getBalance, eth_call, eth_sendRawTransaction, debug_traceTransaction 등 수십 개의 RPC 메서드를 체계적으로 등록하고 HTTP/WebSocket 두 트랜스포트로 동시에 서빙해야 합니다.

해결: RpcModuleBuilder — 네임스페이스별 API 모듈을 조립하는 빌더 패턴입니다.
· Provider, Pool, Network, EvmConfig 등 의존성을 제네릭 파라미터로 주입받습니다.
· build() 를 호출하면 TransportRpcModules 를 반환하고, 각 모듈은 jsonrpsee의 RpcModule에 merge() 로 등록됩니다.
· RpcServerConfig 가 HTTP(8545)·WebSocket(8546)·IPC 세 가지 트랜스포트를 동시에 서빙할 수 있습니다.

jsonrpsee란: Rust용 JSON-RPC 2.0 서버/클라이언트 라이브러리로, 비동기 핸들러와 미들웨어를 지원합니다.

하이라이트 구간: RpcModuleBuilder 구조체 정의 — provider, network, pool, evm_config 의존성 필드`,
  },

  'rpc-2': {
    path: 'reth/crates/rpc/rpc/src/eth/helpers/call.rs',
    code: callRs,
    highlight: [1, 47],
    annotations: [
      { lines: [11, 17],  color: 'sky',     note: 'EthCall impl — eth_call, eth_estimateGas RPC 핸들러. 본문 없음 = 트레이트 기본 구현 사용' },
      { lines: [19, 38],  color: 'emerald', note: 'Call impl — call_gas_limit, max_simulate_blocks, evm_memory_limit 설정 위임' },
      { lines: [41, 47],  color: 'amber',   note: 'EstimateCall impl — 가스 이진 탐색 로직. 본문 없음 = 트레이트 기본 구현 사용' },
    ],
    desc:
`문제: eth_call 은 트랜잭션을 실제로 전송하지 않고 EVM 실행 결과(반환값, 가스 소비량)만 확인하고 싶을 때 사용합니다. EVM을 실행하면 잔액·스토리지가 변경되므로 상태를 격리해야 합니다.

해결: EthCall, Call, EstimateCall 트레이트 위임 구조입니다.
· EthCall: eth_call, eth_estimateGas 등 외부 RPC 핸들러 트레이트
· Call: 내부 EVM 실행 로직 — CacheDB(읽기는 스냅샷, 쓰기는 메모리에만)를 씌워 실행하고 상태 변경을 버립니다.
· EstimateCall: 이진 탐색으로 최소 gasLimit을 찾는 로직

EthApi<N, Rpc> 가 세 트레이트를 모두 구현하고, 실제 로직은 reth_rpc_eth_api crate의 기본 구현에 위임합니다. 이 파일은 Reth 특화 파라미터 바인딩만 담당합니다.

하이라이트 구간: EthCall, Call, EstimateCall impl — 전체 파일이 트레이트 위임 구조`,
  },

};
