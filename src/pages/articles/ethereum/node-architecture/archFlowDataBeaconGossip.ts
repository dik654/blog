import type { FlowNode } from './FlowDiagram';

/* ── beacon-0: process_gossip_block ──────────────────────────── */
export const beaconGossipFlowData: Record<string, FlowNode[]> = {
  'beacon-0': [
    {
      id: 'b0-1', fn: 'process_gossip_block(peer_id, block)', desc: 'gossip으로 수신한 블록 처리 진입점 — 빠른 필터 적용',
      color: 'sky', codeRefKey: 'beacon-0',
      detail: 'libp2p gossipsub에서 beacon_block 토픽 메시지를 수신하면 호출됩니다.',
      children: [
        {
          id: 'b0-1-1', fn: 'block.slot <= finalized_slot → 무시',
          desc: 'finalized 이하 슬롯 — 이미 확정된 블록이므로 즉시 드롭',
          color: 'slate',
          detail: 'finalized 체크포인트 아래는 더 이상 재처리가 불가능합니다. 이 블록들을 처리하면 CPU 낭비이고 fork choice에 영향도 없습니다.',
        },
        {
          id: 'b0-1-2', fn: 'duplicate_cache.check(block_root)',
          desc: '중복 블록 캐시 확인 — 이미 처리 중이거나 완료된 블록 제거',
          color: 'amber',
          detail: 'gossip 네트워크에서 같은 블록이 여러 피어에게서 동시에 올 수 있습니다. 중복 캐시는 동일 블록 루트를 두 번 처리하지 않도록 막습니다.',
        },
        {
          id: 'b0-1-3', fn: 'process_gossip_unverified_block(block)',
          desc: '두 필터를 통과한 블록만 전체 검증 진행',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: '이 단계부터는 CPU 집약적인 BLS 검증·상태 전이가 시작됩니다.',
          children: [
            {
              id: 'b0-1-3-1', fn: 'GossipVerifiedBlock::new(block)',
              desc: '1차 gossip 검증 — 제안자 서명·슬롯 범위·포크 버전 확인',
              color: 'sky', codeRefKey: 'beacon-0',
              detail: 'gossip 레이어 규칙(EIP-2124 libp2p 스펙): 올바른 fork_digest, 슬롯이 현재 ±2 슬롯 이내, 제안자 서명 유효성을 빠르게 확인합니다.',
            },
            {
              id: 'b0-1-3-2', fn: 'beacon_chain.process_block(verified_block)',
              desc: '전체 블록 처리 — BLS 배치 검증 + 상태 전이 + EL 실행',
              color: 'violet',
              codeRefKey: 'beacon-1',
              detail: '↗ 소스 클릭: BLS 배치 검증 → EL engine_newPayloadV3 → HotColdDB 저장 → fork choice 갱신 전체 흐름을 코드로 확인할 수 있습니다.',
            },
          ],
        },
      ],
    },
  ],
};
