import type { CodeRef } from "@/components/code/types";
import trtCapacity from "./codebase/trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp?raw";
import trtKvManager from "./codebase/trtllm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp?raw";
import trtKvHeader from "./codebase/trtllm/cpp/include/tensorrt_llm/batch_manager/kvCacheManager.h?raw";
import trtLlmRequest from "./codebase/trtllm/cpp/include/tensorrt_llm/batch_manager/llmRequest.h?raw";
import trtEviction from "./codebase/trtllm/cpp/tensorrt_llm/batch_manager/evictionPolicy.cpp?raw";
import trtAttentionOp from "./codebase/trtllm/cpp/tensorrt_llm/common/attentionOp.cpp?raw";
import trtXqaMha from "./codebase/trtllm/cpp/kernels/xqa/mha.cu?raw";
import trtXqaDefines from "./codebase/trtllm/cpp/kernels/xqa/defines.h?raw";
import trtLlmArgs from "./codebase/trtllm/tensorrt_llm/llmapi/llm_args.py?raw";
import vllmFlashAttn from "./codebase/vllm/vllm/v1/attention/backends/flash_attn.py?raw";
import vllmScheduler from "./codebase/vllm/vllm/v1/core/sched/scheduler.py?raw";
import vllmConnectorMixin from "./codebase/vllm/vllm/v1/worker/kv_connector_model_runner_mixin.py?raw";
import vllmCacheConfig from "./codebase/vllm/vllm/config/cache.py?raw";

const TRT_CAPACITY = "trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp";
const TRT_KV = "trtllm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp";

export const codeRefs: Record<string, CodeRef> = {
  "trt-no-evict": {
    path: TRT_CAPACITY,
    code: trtCapacity,
    lang: "c",
    highlight: [222, 451],
    desc: "GUARANTEED_NO_EVICT는 이미 실행 중인 요청의 남은 block부터 떼어 둔 뒤 새 요청을 받습니다.",
    annotations: [
      {
        lines: [283, 296],
        color: "sky",
        note: "생성 중인 요청은 enoughAvailableBlocks로 끝까지 필요한 block을 먼저 예약합니다. 4개가 38씩 152 block을 잡습니다.",
      },
      {
        lines: [407, 447],
        color: "amber",
        note: "새 요청도 같은 계산을 통과해야 들어옵니다. 다섯째 요청은 38이 필요한데 8 block만 남아 여기서 break합니다.",
      },
    ],
  },
  "trt-remaining-blocks": {
    path: TRT_KV,
    code: trtKvManager,
    lang: "c",
    highlight: [3492, 3603],
    desc: "프롬프트와 max_new_tokens를 더한 길이로 끝까지 필요한 block 수를 셉니다.",
    annotations: [
      {
        lines: [3530, 3535],
        color: "sky",
        note: "prompt 200은 200÷32를 내린 6 block, 전체 1,200은 올림해 38 block, 생성 몫은 32 block입니다.",
      },
      {
        lines: [3596, 3600],
        color: "amber",
        note: "아직 할당이 0이면 6+32=38을 돌려줍니다. 실제로 300 token에서 끝나도 예약은 max_new_tokens 기준입니다.",
      },
    ],
  },
  "trt-one-step": {
    path: TRT_KV,
    code: trtKvManager,
    lang: "c",
    highlight: [3403, 3490],
    desc: "MAX_UTILIZATION은 이번 한 step에 새로 필요한 block만 셉니다.",
    annotations: [
      {
        lines: [3458, 3487],
        color: "sky",
        note: "생성 중인 요청은 다음 token이 block 경계를 넘을 때만 1 block이 필요합니다. 32 token마다 한 번입니다.",
      },
    ],
  },
  "trt-pause": {
    path: TRT_CAPACITY,
    code: trtCapacity,
    lang: "c",
    highlight: [590, 620],
    desc: "한 step 예약이 실패하면 가장 늦게 시작한 요청을 pause해 block을 돌려받습니다.",
    annotations: [
      {
        lines: [598, 610],
        color: "rose",
        note: "schedulingRemoveSequence로 그 요청의 block을 비운 셈 치고 다시 시도합니다. vLLM의 running.pop()과 같은 방향입니다.",
      },
    ],
  },
  "trt-pause-recompute": {
    path: "trtllm/cpp/include/tensorrt_llm/batch_manager/llmRequest.h",
    code: trtLlmRequest,
    lang: "c",
    highlight: [772, 830],
    desc: "pause된 요청은 이미 만든 token을 프롬프트에 붙여 처음부터 다시 계산합니다.",
    annotations: [
      {
        lines: [793, 799],
        color: "amber",
        note: "beam 1이면 새 프롬프트 길이는 200+150=350입니다. 150 token을 생성한 뒤 멈춘 요청은 350 token의 KV를 다시 만듭니다.",
      },
    ],
  },
  "vllm-preempt": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    code: vllmScheduler,
    lang: "python",
    highlight: [575, 630],
    desc: "vLLM은 이번 step에 쓸 slot만 allocate_slots로 받고, 실패하면 running 끝의 요청을 선점합니다.",
    annotations: [
      {
        lines: [576, 586],
        color: "sky",
        note: "num_new_tokens만큼만 자리를 구합니다. 끝까지의 길이는 묻지 않습니다.",
      },
      {
        lines: [614, 622],
        color: "rose",
        note: "FCFS 정책에서는 running.pop()으로 가장 늦게 들어온 요청을 내보냅니다.",
      },
    ],
  },
  "vllm-preempt-reset": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    code: vllmScheduler,
    lang: "python",
    highlight: [1274, 1294],
    desc: "선점된 요청은 block을 반납하고 계산한 token 수를 0으로 되돌립니다.",
    annotations: [
      {
        lines: [1290, 1294],
        color: "amber",
        note: "num_computed_tokens = 0이므로 다시 들어올 때 지금까지의 프롬프트와 생성분을 다시 계산합니다. prefix cache에 남은 block이 있으면 그만큼은 건너뜁니다.",
      },
    ],
  },
  "trt-pool-shape": {
    path: TRT_KV,
    code: trtKvManager,
    lang: "c",
    highlight: [1091, 1099],
    desc: "주 pool tensor의 첫 축이 block 번호이고 그 안에 모든 층이 들어갑니다.",
    annotations: [
      {
        lines: [1091, 1093],
        color: "sky",
        note: "attention pool은 {numBlocks, numLayers, kvFactor, blockSize}입니다. block 하나를 고르면 80층의 K·V가 이어진 한 덩어리입니다.",
      },
    ],
  },
  "trt-pool-meta": {
    path: "trtllm/cpp/include/tensorrt_llm/batch_manager/kvCacheManager.h",
    code: trtKvHeader,
    lang: "c",
    highlight: [784, 827],
    desc: "pool마다 층 수와 KV head 수, block당 token 수를 붙여 둡니다.",
    annotations: [
      {
        lines: [816, 816],
        color: "sky",
        note: "blockSize = numKvHeads × sizePerHead × tokensPerBlock = 8×128×32 = 32,768 원소, FP16으로 64 KiB입니다.",
      },
      {
        lines: [794, 796],
        color: "amber",
        note: "primary는 GPU, secondary는 offload용 느린 메모리입니다. 같은 block 번호 체계를 씁니다.",
      },
    ],
  },
  "vllm-kv-shape": {
    path: "vllm/vllm/v1/attention/backends/flash_attn.py",
    code: vllmFlashAttn,
    lang: "python",
    highlight: [134, 170],
    desc: "vLLM FlashAttention backend는 층 하나의 cache shape만 정합니다.",
    annotations: [
      {
        lines: [141, 144],
        color: "sky",
        note: "층마다 (num_blocks, num_kv_heads, block_size, 2×head_size) tensor 하나입니다. 16 token block 하나가 층당 64 KiB입니다.",
      },
      {
        lines: [154, 156],
        color: "amber",
        note: "num_layers 축이 들어간 stride는 include_num_layers_dimension일 때만 씁니다.",
      },
    ],
  },
  "vllm-uniform-layout": {
    path: "vllm/vllm/v1/worker/kv_connector_model_runner_mixin.py",
    code: vllmConnectorMixin,
    lang: "python",
    highlight: [115, 145],
    desc: "모든 층을 block 단위로 붙이는 배치는 KV connector가 원할 때만 고릅니다.",
    annotations: [
      {
        lines: [125, 132],
        color: "sky",
        note: "group이 하나이고, connector가 cross-layer block을 원하고, backend가 block stride로 읽을 때 세 조건을 모두 만족해야 합니다.",
      },
    ],
  },
  "vllm-block-size": {
    path: "vllm/vllm/config/cache.py",
    code: vllmCacheConfig,
    lang: "python",
    highlight: [44, 52],
    desc: "vLLM의 기본 block 크기는 16 token입니다.",
    annotations: [{ lines: [47, 47], color: "sky", note: "DEFAULT_BLOCK_SIZE = 16. backend가 다른 크기를 요구하면 바뀔 수 있습니다." }],
  },
  "trt-defaults": {
    path: "trtllm/tensorrt_llm/llmapi/llm_args.py",
    code: trtLlmArgs,
    lang: "python",
    highlight: [4121, 4125],
    desc: "LLM API의 capacity scheduler 기본값은 GUARANTEED_NO_EVICT입니다.",
    annotations: [{ lines: [4122, 4124], color: "sky", note: "설정하지 않으면 끝까지 예약하는 정책으로 시작합니다." }],
  },
  "trt-partial-defaults": {
    path: "trtllm/tensorrt_llm/llmapi/llm_args.py",
    code: trtLlmArgs,
    lang: "python",
    highlight: [4658, 4667],
    desc: "부분 재사용과 복사 재사용은 둘 다 기본으로 켜져 있습니다.",
    annotations: [
      { lines: [4658, 4661], color: "sky", note: "enable_partial_reuse=True" },
      { lines: [4662, 4666], color: "amber", note: "copy_on_partial_reuse=True: 다른 요청이 쓰는 block이면 일치한 token만 새 block에 복사합니다." },
    ],
  },
  "trt-partial-match": {
    path: TRT_KV,
    code: trtKvManager,
    lang: "c",
    highlight: [366, 405],
    desc: "정확히 같은 block을 먼저 찾고, 없으면 앞부분만 같은 block을 긴 순서로 찾습니다.",
    annotations: [
      { lines: [374, 385], color: "sky", note: "32 token이 모두 같으면 그대로 공유합니다." },
      {
        lines: [387, 402],
        color: "amber",
        note: "20 token만 같으면 부분 일치입니다. 복사 재사용이 꺼져 있으면 아무도 안 쓰는 leaf block만 넘겨받을 수 있습니다.",
      },
    ],
  },
  "trt-priority-evict": {
    path: "trtllm/cpp/tensorrt_llm/batch_manager/evictionPolicy.cpp",
    code: trtEviction,
    lang: "c",
    highlight: [140, 161],
    desc: "빈 block이 필요하면 가장 낮은 우선순위 queue의 맨 앞부터 꺼냅니다.",
    annotations: [
      { lines: [144, 150], color: "sky", note: "우선순위 0 queue부터 훑습니다. 같은 queue 안에서는 먼저 놓인 block, 곧 가장 오래 안 쓴 block이 먼저입니다." },
      {
        lines: [155, 157],
        color: "amber",
        note: "주 메모리에서 꺼낸 block이 기준 이상 우선순위이면 호스트로 내립니다. 우선순위 10 block은 기준 30 아래라 그냥 버립니다.",
      },
    ],
  },
  "trt-offload-default": {
    path: "trtllm/cpp/tensorrt_llm/batch_manager/evictionPolicy.cpp",
    code: trtEviction,
    lang: "c",
    highlight: [29, 35],
    desc: "C++ 기본 offload 하한은 30입니다.",
    annotations: [
      {
        lines: [34, 34],
        color: "rose",
        note: "문서는 35 미만을 내리지 않는다고 적지만 이 고정 원문은 30 이상을 내립니다. 기본 우선순위 35인 block은 어느 쪽이든 내려갑니다.",
      },
    ],
  },
  "trt-fused-preprocess": {
    path: "trtllm/cpp/tensorrt_llm/common/attentionOp.cpp",
    code: trtAttentionOp,
    lang: "c",
    highlight: [1832, 1898],
    desc: "context 단계 전처리 한 번에 bias·RoPE·KV 쓰기·양자화 출력 자리를 모두 넘깁니다.",
    annotations: [
      { lines: [1838, 1841], color: "sky", note: "양자화된 QKV 출력, KV cache 버퍼, block scale 버퍼를 같은 parameter에 담습니다." },
      { lines: [1855, 1856], color: "amber", note: "RoPE 계수도 같은 전처리 kernel로 들어갑니다." },
    ],
  },
  "trt-generation-dispatch": {
    path: "trtllm/cpp/tensorrt_llm/common/attentionOp.cpp",
    code: trtAttentionOp,
    lang: "c",
    highlight: [2603, 2646],
    desc: "생성 단계는 XQA를 먼저 시도하고 조건이 안 맞으면 masked MHA로 내려갑니다.",
    annotations: [
      { lines: [2607, 2611], color: "sky", note: "shouldUse가 head 묶음·dtype·page 크기를 보고 XQA 사용 여부를 정합니다." },
      { lines: [2642, 2646], color: "amber", note: "선택되지 않으면 아래의 masked MHA 경로를 이어서 실행합니다." },
    ],
  },
  "trt-xqa-tile": {
    path: "trtllm/cpp/kernels/xqa/mha.cu",
    code: trtXqaMha,
    lang: "c",
    highlight: [60, 84],
    desc: "XQA의 한 warp tile은 KV head 하나를 공유하는 query head 묶음을 행으로 씁니다.",
    annotations: [
      { lines: [74, 74], color: "sky", note: "유효 행 = headGrpSize × beamWidth = 8×1 = 8입니다." },
      { lines: [76, 76], color: "amber", note: "warpTile.y는 16의 배수로 올림해 16행입니다. 8행은 빈 자리로 남습니다." },
    ],
  },
  "trt-xqa-defines": {
    path: "trtllm/cpp/kernels/xqa/defines.h",
    code: trtXqaDefines,
    lang: "c",
    highlight: [26, 34],
    desc: "XQA는 head 묶음 크기와 page 크기를 compile time 상수로 고정한 kernel입니다.",
    annotations: [
      { lines: [31, 33], color: "sky", note: "HEAD_GRP_SIZE 기본 8: KV head 하나당 query head 8개입니다." },
    ],
  },
  "trt-xqa-page": {
    path: "trtllm/cpp/kernels/xqa/defines.h",
    code: trtXqaDefines,
    lang: "c",
    highlight: [94, 112],
    desc: "page 크기와 KV 배치 형식도 kernel마다 정해집니다.",
    annotations: [
      { lines: [96, 97], color: "sky", note: "TOKENS_PER_PAGE 기본 32. 0이면 연속 KV입니다." },
      { lines: [105, 110], color: "amber", note: "PAGED_KV_CACHE_LAYOUT=1은 vLLM·SGLang 식의 분리된 K·V pool 배치를 읽습니다." },
    ],
  },
  "vllm-kv-write": {
    path: "vllm/vllm/v1/attention/backends/flash_attn.py",
    code: vllmFlashAttn,
    lang: "python",
    highlight: [1098, 1132],
    desc: "vLLM은 KV 쓰기를 별도 reshape_and_cache_flash 호출로 합니다.",
    annotations: [
      { lines: [1123, 1132], color: "sky", note: "이미 RoPE가 적용된 key·value를 slot_mapping 위치에 흩어 씁니다. attention kernel과는 다른 호출입니다." },
    ],
  },
  "vllm-fa-call": {
    path: "vllm/vllm/v1/attention/backends/flash_attn.py",
    code: vllmFlashAttn,
    lang: "python",
    highlight: [1041, 1067],
    desc: "attention 자체는 외부 FlashAttention의 varlen 함수에 block_table을 넘겨 실행합니다.",
    annotations: [
      { lines: [1054, 1054], color: "sky", note: "block_table로 층별 cache tensor의 16 token page를 찾아 읽습니다." },
    ],
  },
};
