import type { CodeRef } from '@/components/code/types';
import blockPoolPy from './codebase/vllm/v1/core/block_pool.py?raw';
import kvCacheCoordPy from './codebase/vllm/v1/core/kv_cache_coordinator.py?raw';
import kvCacheMgrPy from './codebase/vllm/v1/core/kv_cache_manager.py?raw';

export const blockPoolCodeRefs: Record<string, CodeRef> = {
  'block-pool': {
    path: 'vllm/v1/core/block_pool.py',
    code: blockPoolPy,
    lang: 'python',
    highlight: [129, 210],
    annotations: [
      { lines: [129, 146], color: 'sky',     note: 'BlockPool — KVCacheBlock 관리의 최하위 레이어' },
      { lines: [161, 167], color: 'emerald', note: 'blocks: 모든 GPU 블록 목록 + FreeKVCacheBlockQueue(이중 연결 리스트)' },
      { lines: [170, 176], color: 'amber',   note: 'cached_block_hash_to_block — Prefix Caching용 해시→블록 매핑' },
      { lines: [183, 208], color: 'violet',  note: 'get_cached_block() — 해시로 캐시 히트 검색' },
    ],
    desc:
`문제: 수천 개의 KV 캐시 블록을 빠르게 할당/해제하려면?

해결: BlockPool은 이중 연결 리스트(FreeKVCacheBlockQueue)로 free 블록을 관리합니다.
할당은 popleft() O(1), 해제는 append_n() O(n).
Prefix Caching 시 해시→블록 매핑(BlockHashToBlockMap)으로 O(1) 캐시 히트 검색.
ref_cnt > 0인 블록은 해제해도 eviction 후보로만 이동합니다.`,
  },

  'block-pool-free': {
    path: 'vllm/v1/core/block_pool.py',
    code: blockPoolPy,
    lang: 'python',
    highlight: [409, 490],
    annotations: [
      { lines: [409, 423], color: 'sky',     note: 'free_blocks() — ref_cnt 감소 후 0이면 free 큐에 반환' },
      { lines: [444, 477], color: 'emerald', note: 'reset_prefix_cache() — RLHF 등에서 전체 캐시 초기화' },
      { lines: [479, 485], color: 'amber',   note: 'get_num_free_blocks() — free 큐 크기 반환' },
    ],
    desc:
`문제: 블록 해제 시 Prefix Cache와 어떻게 조율할까요?

해결: free_blocks()는 ref_cnt를 감소시키되, 0이 된 블록만 free 큐에 추가합니다.
Prefix Caching이 활성화되면 해제된 블록도 해시를 유지하여 eviction 후보로 남깁니다.
새 블록 할당 시 free 큐에서 eviction 후보를 먼저 재활용합니다.`,
  },

  'kv-coordinator': {
    path: 'vllm/v1/core/kv_cache_coordinator.py',
    code: kvCacheCoordPy,
    lang: 'python',
    highlight: [28, 100],
    annotations: [
      { lines: [28, 44], color: 'sky',     note: 'KVCacheCoordinator — 여러 KV 캐시 그룹 간 조율' },
      { lines: [49, 55], color: 'emerald', note: 'BlockPool 생성 — 단일 풀에서 모든 그룹 블록 관리' },
      { lines: [59, 69], color: 'amber',   note: 'single_type_managers — 그룹별 매니저 (FullAttn, SlidingWindow 등)' },
      { lines: [71, 99], color: 'violet',  note: 'get_num_blocks_to_allocate() — 각 그룹별 필요 블록 수 합산' },
    ],
    desc:
`문제: GQA, MQA 등 다양한 어텐션 타입이 섞이면 블록 관리가 복잡해집니다.

해결: KVCacheCoordinator는 "KV 캐시 그룹" 개념으로 추상화합니다.
단일 BlockPool을 공유하되, 각 그룹(FullAttention, SlidingWindow 등)은
독립적인 SingleTypeKVCacheManager를 통해 블록을 요청합니다.
할당 시 모든 그룹의 필요량을 합산하여 한 번에 가용성을 판단합니다.`,
  },

  'kv-mgr-allocate': {
    path: 'vllm/v1/core/kv_cache_manager.py',
    code: kvCacheMgrPy,
    lang: 'python',
    highlight: [257, 340],
    annotations: [
      { lines: [257, 267], color: 'sky',     note: 'allocate_slots() — 새 토큰에 필요한 블록 할당' },
      { lines: [289, 321], color: 'emerald', note: '블록 레이아웃 다이어그램 — comp/new_comp/ext_comp/new/lookahead' },
      { lines: [327, 335], color: 'amber',   note: '3단계: 불필요 해제 → prefix 처리 → 신규 할당' },
    ],
    desc:
`문제: Prefix Caching + Spec Decode + P/D 분리까지 고려한 블록 할당은?

해결: allocate_slots()는 토큰을 5개 구간으로 나누어 관리합니다.
① computed — 이미 계산된 블록 (필요 없으면 해제)
② new_computed — 새로 캐시 히트한 블록 (ref_cnt 증가)
③ external — KV Connector로 외부에서 전달받은 블록
④ new — 실제 계산할 새 토큰용 블록
⑤ lookahead — Spec Decode용 추가 블록`,
  },
};
