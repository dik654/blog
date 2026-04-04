import type { FlowNode } from './FlowDiagram';

/* ── libp2p-0: gossipsub subscribe ───────────────────────────── */
/* ── hotcold-0: HotColdDB ────────────────────────────────────── */
export const libp2pHotcoldFlowData: Record<string, FlowNode[]> = {
  'libp2p-0': [
    {
      id: 'lp0-1', fn: 'handle(NetworkMessage::SubscribeCoreTopics)',
      desc: '초기화 또는 포크 전환 시 core 토픽 구독 요청 처리',
      color: 'sky', codeRefKey: 'libp2p-0',
      detail: 'NetworkService의 메시지 루프에서 SubscribeCoreTopics 이벤트를 받으면 이 분기가 실행됩니다.',
      children: [
        {
          id: 'lp0-1-1', fn: 'already_subscribed() → return',
          desc: '이미 모든 토픽을 구독 중이면 즉시 반환',
          color: 'slate', codeRefKey: 'libp2p-0',
        },
        {
          id: 'lp0-1-2', fn: 'core_topics_to_subscribe(fork)',
          desc: '현재 포크(Capella/Deneb 등)에 맞는 토픽 목록 계산',
          color: 'emerald', codeRefKey: 'libp2p-0',
          detail: '포크마다 지원하는 토픽이 다릅니다. Deneb에서는 blob_sidecar_{0..5} 토픽이 추가됩니다.',
        },
        {
          id: 'lp0-1-3', fn: 'required_gossip_fork_digests()',
          desc: 'fork digest 목록 조회 — 과거/현재/미래 포크 포함 가능',
          color: 'amber', codeRefKey: 'libp2p-0',
          detail: 'fork digest = SHA256(genesis_validators_root, fork_version)[:4]. 동일 토픽이라도 포크마다 다른 digest를 가져 다른 포크 노드 메시지가 섞이지 않습니다.',
        },
        {
          id: 'lp0-1-4', fn: 'gossipsub.subscribe("/eth2/{digest}/{topic}/ssz_snappy")',
          desc: '최종 토픽 문자열 생성 + libp2p gossipsub 구독 등록',
          color: 'violet', codeRefKey: 'beacon-0',
          detail: '토픽 예시: /eth2/b5303f2a/beacon_block/ssz_snappy. ssz_snappy: SimpleSerialize + Snappy 압축 인코딩입니다. 구독 후 beacon_block 토픽 메시지는 process_gossip_block()으로 전달됩니다.',
        },
        {
          id: 'lp0-1-5', fn: 'subscribe_all_attestation_subnets() [옵션]',
          desc: '전체 어테스테이션 서브넷 구독 — 연구/테스트 목적',
          color: 'rose', codeRefKey: 'libp2p-0',
          detail: '일반 노드는 일부 서브넷만 구독합니다. subscribe_all_subnets 플래그가 켜진 경우 모든 64개 서브넷을 구독합니다.',
        },
      ],
    },
  ],

  'hotcold-0': [
    {
      id: 'hc0-1', fn: 'HotColdDB (저장소 구조)', desc: '두 계층으로 나뉜 비콘 체인 저장소 개요',
      color: 'sky', codeRefKey: 'hotcold-0',
      detail: 'split 슬롯을 기준으로 Hot(최근)/Cold(확정) DB를 분리해 읽기 속도와 저장 효율을 동시에 최적화합니다.',
      children: [
        {
          id: 'hc0-1-1', fn: 'hot_db.put_block(block, state)',
          desc: 'Hot DB(LevelDB 계열) — 최근 64 epoch 블록·상태 저장',
          color: 'emerald', codeRefKey: 'hotcold-0',
          detail: '잦은 랜덤 읽기·쓰기에 최적화된 LevelDB 계열 B-Tree입니다. gossip 블록이 도착하면 즉시 여기에 저장됩니다.',
          children: [
            {
              id: 'hc0-1-1-1', fn: 'block_cache.put_block(block_root, block)',
              desc: 'LRU 인메모리 캐시 갱신 — 디스크보다 빠른 최근 블록 조회',
              color: 'amber', codeRefKey: 'hotcold-0',
              detail: '최근 N개 블록을 메모리에 캐싱합니다. fork choice 계산 시 수십 번 블록을 조회하는데, 캐시 히트율이 매우 높습니다.',
            },
          ],
        },
        {
          id: 'hc0-1-2', fn: 'cold_db.put_block(block)',
          desc: 'Cold DB(Freezer) — finalized 블록·상태를 순차 압축 파일로 저장',
          color: 'violet', codeRefKey: 'hotcold-0',
          detail: '불변(append-only) 파일로 저장합니다. zstd 압축을 적용해 디스크 사용량을 줄입니다. 읽기 전용이므로 잠금이 필요 없습니다.',
        },
        {
          id: 'hc0-1-3', fn: 'migrate_to_cold()',
          desc: 'split 슬롯 넘은 블록을 Hot → Cold로 이동',
          color: 'slate', codeRefKey: 'hotcold-0',
          detail: '백그라운드 태스크가 주기적으로 실행합니다. Hot DB 공간이 부족해지지 않도록 오래된 데이터를 Cold로 옮깁니다.',
        },
        {
          id: 'hc0-1-4', fn: 'blobs_db.put_blob_sidecar(blob)',
          desc: 'EIP-4844 blob 사이드카 전용 저장소 (Deneb 이후)',
          color: 'rose', codeRefKey: 'hotcold-0',
          detail: 'blob은 약 4096 field elements(~128KB)로 구성됩니다. 비콘 노드는 최소 4096 epoch(약 18일)간 보관하고 이후 삭제할 수 있습니다(data availability sampling 이후).',
        },
      ],
    },
  ],
};
