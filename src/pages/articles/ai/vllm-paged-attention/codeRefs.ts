import type { CodeRef } from "@/components/code/types";
import blockPoolPy from "./codebase/vllm/v1/core/block_pool.py?raw";
import kvCacheUtilsPy from "./codebase/vllm/v1/core/kv_cache_utils.py?raw";
import singleTypeKvCacheManagerPy from "./codebase/vllm/v1/core/single_type_kv_cache_manager.py?raw";
export const codeRefs: Record<string, CodeRef> = {
"ref-count-eviction": {
  "path": "vllm/v1/core/block_pool.py",
  "lang": "python", "code": blockPoolPy,
  "highlight": [
    702,
    742
  ],
  "desc": "vLLM v0.27.1 고정 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 원문입니다. 본문 사례의 값과 단순화한 전제를 실제 분기와 대조합니다.",
  "annotations": [
    {
      "lines": [
        647,
        668
      ],
      "color": "sky",
      "note": "용량을 먼저 검사하고 옛 hash를 제거한 뒤 ref를 올립니다."
    },
    {
      "lines": [
        702,
        715
      ],
      "color": "emerald",
      "note": "touch가 free 목록에서 꺼내 ref를 늘립니다."
    },
    {
      "lines": [
        719,
        742
      ],
      "color": "amber",
      "note": "hash 없는 반환 block은 앞에, hash 있는 block은 뒤에 둡니다."
    },
    {
      "lines": [
        744,
        762
      ],
      "color": "violet",
      "note": "ref가 남아 있어도 hash 조회 항목은 지울 수 있습니다. 물리 공간 반환과 다릅니다."
    }
  ]
},
"block-hash-chain": {
  "path": "vllm/v1/core/kv_cache_utils.py",
  "lang": "python", "code": kvCacheUtilsPy,
  "highlight": [
    596,
    624
  ],
  "desc": "vLLM v0.27.1 고정 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 원문입니다. 본문 사례의 값과 단순화한 전제를 실제 분기와 대조합니다.",
  "annotations": [
    {
      "lines": [
        95,
        114
      ],
      "color": "sky",
      "note": "NONE_HASH는 설정 seed 또는 임의 byte로 초기화합니다."
    },
    {
      "lines": [
        596,
        624
      ],
      "color": "emerald",
      "note": "부모 hash, 현재 token tuple, extra key가 다음 hash의 입력입니다."
    }
  ]
},
"block-demand": {
  "path": "vllm/v1/core/single_type_kv_cache_manager.py",
  "lang": "python", "code": singleTypeKvCacheManagerPy,
  "highlight": [
    178,
    230
  ],
  "desc": "vLLM v0.27.1 고정 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 원문입니다. 본문 사례의 값과 단순화한 전제를 실제 분기와 대조합니다.",
  "annotations": [
    {
      "lines": [
        178,
        200
      ],
      "color": "sky",
      "note": "진행 요청 A는 ceil(38/16)−3=0, 이어 ceil(49/16)−3=1입니다."
    },
    {
      "lines": [
        202,
        230
      ],
      "color": "emerald",
      "note": "신규 hit, 건너뛴 구간, ref=0 hit, partial-hit CoW 예약이 추가됩니다."
    }
  ]
},
"partial-hit-cow": {
  "path": "vllm/v1/core/single_type_kv_cache_manager.py",
  "lang": "python", "code": singleTypeKvCacheManagerPy,
  "highlight": [
    348,
    357
  ],
  "desc": "vLLM v0.27.1 고정 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 원문입니다. 본문 사례의 값과 단순화한 전제를 실제 분기와 대조합니다.",
  "annotations": [
    {
      "lines": [
        132,
        142
      ],
      "color": "sky",
      "note": "재사용 경계가 physical block 중간에 있는지 검사합니다."
    },
    {
      "lines": [
        348,
        357
      ],
      "color": "emerald",
      "note": "공유 tail을 새 CoW block으로 돌립니다."
    },
    {
      "lines": [
        405,
        426
      ],
      "color": "amber",
      "note": "복사가 끝날 때까지 source와 destination을 보유하고 destination ref를 추가합니다."
    },
    {
      "lines": [
        914,
        919
      ],
      "color": "violet",
      "note": "sliding-window 경로는 partial hit 미지원 조건을 명시합니다."
    }
  ]
},
};
