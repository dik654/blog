import httpRs from './codebase/lighthouse/beacon_node/execution_layer/src/engine_api/http.rs?raw';
import serviceRs from './codebase/lighthouse/beacon_node/network/src/service.rs?raw';
import hotColdStoreRs from './codebase/lighthouse/beacon_node/store/src/hot_cold_store.rs?raw';
import syncManagerRs from './codebase/lighthouse/beacon_node/network/src/sync/manager.rs?raw';
import type { CodeRef } from './archCodeRefsTypes';

export const clInfraCodeRefs: Record<string, CodeRef> = {
  'engine-0': {
    path: 'lighthouse/beacon_node/execution_layer/src/engine_api/http.rs',
    code: httpRs,
    lang: 'rust',
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

  'libp2p-0': {
    path: 'lighthouse/beacon_node/network/src/service.rs',
    code: serviceRs,
    lang: 'rust',
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

  'hotcold-0': {
    path: 'lighthouse/beacon_node/store/src/hot_cold_store.rs',
    code: hotColdStoreRs,
    lang: 'rust',
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

  'sync-0': {
    path: 'lighthouse/beacon_node/network/src/sync/manager.rs',
    code: syncManagerRs,
    lang: 'rust',
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
};
