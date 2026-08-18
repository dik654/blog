import type { CodeRef } from "@/components/code/types";
import blockPoolPy from "./codebase/vllm/v1/core/block_pool.py?raw";
import kvCacheUtilsPy from "./codebase/vllm/v1/core/kv_cache_utils.py?raw";
import singleTypeKvCacheManagerPy from "./codebase/vllm/v1/core/single_type_kv_cache_manager.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "ref-count-eviction": {
    path: "vllm/v1/core/block_pool.py",
    code: blockPoolPy,
    lang: "python",
    highlight: [6, 36],
    desc: "문제: 여러 request가 같은 block을 참조할 때, 언제 그 block 내용을 안전하게 덮어써도 되는지 정해야 합니다.\n\n해결: touch()는 참조가 생기면 ref_cnt를 올리고 free queue에서 빼며, free_blocks()는 참조가 사라져 ref_cnt가 0이 될 때만 다시 free queue로 되돌립니다.",
    annotations: [
      { lines: [12, 15], color: "sky", note: "다른 request가 같은 block을 hit하면 ref_cnt+1, free 후보에서 제외" },
      { lines: [24, 27], color: "emerald", note: "article의 evictable(b) ⟹ ref(b)=0 — ref_cnt가 정확히 0이 될 때만 free_block_queue로 되돌림" },
      { lines: [33, 36], color: "amber", note: "Hash 없는(cache 재사용 불가) block을 먼저 evict 순서 앞쪽에 둠" },
    ],
  },
  "block-hash-chain": {
    path: "vllm/v1/core/kv_cache_utils.py",
    code: kvCacheUtilsPy,
    lang: "python",
    highlight: [4, 30],
    desc: "문제: 같은 token block이 다른 위치·다른 adapter의 KV와 섞이지 않도록 cache key를 만들어야 합니다.\n\n해결: parent block hash, 현재 block의 token ID tuple, extra key(LoRA·multimodal 등)를 한 튜플로 묶어 해싱합니다.",
    annotations: [
      { lines: [22, 23], color: "sky", note: "첫 block은 고정 sentinel을 parent hash로 사용" },
      { lines: [25, 30], color: "emerald", note: "H_i=Hash(H_{i-1}, x_i, e_i) — 세 요소를 한 튜플로 묶어 해싱" },
    ],
  },
  "block-demand": {
    path: "vllm/v1/core/single_type_kv_cache_manager.py",
    code: singleTypeKvCacheManagerPy,
    lang: "python",
    highlight: [8, 29],
    desc: "문제: 이번 iteration에 계산할 token을 안전하게 담으려면 free pool에서 block을 몇 개 더 가져와야 하는지 정해야 합니다.\n\n해결: 보존해야 할 전체 token 위치를 block 수로 올림(cdiv)한 뒤, 이미 이 request가 가진 block 수를 빼고 0 이하는 자릅니다.",
    annotations: [
      { lines: [23, 24], color: "sky", note: "ceil((computed+new+look)/B) — cdiv는 올림 나눗셈" },
      { lines: [25, 26], color: "emerald", note: "m^owned — 이미 연결된 block 수" },
      { lines: [28, 29], color: "amber", note: "m^alloc = max(0, ceil(...) - m^owned)" },
    ],
  },
};
