import type { CodeRef } from "@/components/code/types";
import singleType from "./codebase/vllm/vllm/v1/core/single_type_kv_cache_manager.py?raw";
import staticSink from "./codebase/vllm/vllm/model_executor/layers/attention/static_sink_attention.py?raw";
import gptOss from "./codebase/vllm/vllm/model_executor/models/gpt_oss.py?raw";
import trtKv from "./codebase/tensorrt-llm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp?raw";
import trtArgs from "./codebase/tensorrt-llm/tensorrt_llm/llmapi/llm_args.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "skipped-tokens": {
    path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py",
    highlight: [1057, 1083],
    desc: "SlidingWindowManager가 다음 token의 창 밖 token 수를 세는 식입니다.",
    annotations: [
      { lines: [1064, 1075], color: "sky", note: "원문 주석의 예도 W = 4, 계산 7개에서 0~3을 건너뜁니다. 이 글의 W = 8, n = 12에서는 12 − 8 + 1 = 5입니다." },
      { lines: [1083, 1083], color: "amber", note: "n − W + 1을 0 아래로 내려가지 않게 자릅니다. 창 안쪽이면 0이라 아무것도 돌려주지 않습니다." },
    ],
    code: singleType,
    lang: "python",
  },
  "remove-skipped": {
    path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py",
    highlight: [595, 659],
    desc: "건너뛸 token을 block 수로 내리고 앞쪽 block을 null block으로 바꿔 pool에 돌려줍니다.",
    annotations: [
      { lines: [645, 651], color: "sky", note: "full attention은 기본 구현이 0을 돌려주므로 요청이 끝나기 전에는 block을 돌려주지 않습니다." },
      { lines: [652, 659], color: "amber", note: "건너뛸 token 5개 ÷ block 4 = 1이라 block 하나만 돌려줍니다. 나머지 1 token은 block 안에 남은 다른 창 안 token과 함께 남습니다." },
      { lines: [613, 620], color: "violet", note: "뒤에서부터 null block을 만나면 멈춥니다. 이미 돌려준 block을 다시 세지 않습니다." },
    ],
    code: singleType,
    lang: "python",
  },
  "swa-no-cascade": {
    path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py",
    highlight: [1085, 1092],
    desc: "창 밖 block이 null block으로 바뀌므로 공통 prefix 개수를 full 층처럼 세지 않습니다.",
    annotations: [
      { lines: [1086, 1092], color: "sky", note: "SWA 층은 공유 prefix가 있어도 0을 돌려줍니다. 앞부분이 이미 null block이라 참조 수로 공유를 판단할 수 없기 때문입니다." },
    ],
    code: singleType,
    lang: "python",
  },
  "rswa-gap": {
    path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py",
    highlight: [832, 875],
    desc: "prompt 앞부분은 남기고 prompt 끝과 decode 창 사이의 가운데만 돌려주는 R-SWA 관리자입니다.",
    annotations: [
      { lines: [853, 859], color: "sky", note: "돌려줄 범위는 prompt 끝 block 다음부터 현재 창 시작 전까지입니다. 앞을 남기고 가운데를 비운다는 점에서 sink + window와 같은 모양입니다." },
      { lines: [867, 875], color: "amber", note: "prompt 100, block 16, 창 64, 계산 500이면 7번 block부터 27번 block 앞까지 20개를 돌려줍니다." },
    ],
    code: singleType,
    lang: "python",
  },
  "sink-manager": {
    path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py",
    highlight: [1810, 1833],
    desc: "모델이 주는 고정 sink K·V를 위해 pool에서 block을 한 번 떼어 두는 관리자입니다.",
    annotations: [
      { lines: [1830, 1833], color: "sky", note: "sink 길이는 block 크기의 배수여야 합니다. 16 token sink면 block 하나를 free queue에서 꺼내 모든 요청이 함께 씁니다." },
    ],
    code: singleType,
    lang: "python",
  },
  "static-sink-table": {
    path: "vllm/vllm/model_executor/layers/attention/static_sink_attention.py",
    highlight: [80, 104],
    desc: "요청마다 block table 앞에 sink block을 끼워 넣고 길이를 sink 길이만큼 늘립니다.",
    annotations: [
      { lines: [86, 94], color: "sky", note: "seq_lens에 sink_len을 더합니다. attention kernel은 sink를 앞쪽 token처럼 읽습니다." },
      { lines: [95, 101], color: "amber", note: "sink block 뒤에 원래 block table을 이어 붙입니다. 요청의 KV는 그대로 두고 주소 목록만 바꿉니다." },
    ],
    code: staticSink,
    lang: "python",
  },
  "static-sink-populate": {
    path: "vllm/vllm/model_executor/layers/attention/static_sink_attention.py",
    highlight: [196, 213],
    desc: "sink K·V를 cache에 한 번만 써 둡니다.",
    annotations: [
      { lines: [197, 212], color: "sky", note: "slot 번호 block_size부터 sink_len개, 곧 두 번째 block부터 sink K·V를 씁니다. 쓴 뒤에는 sink_populated를 True로 바꿔 다시 쓰지 않습니다." },
    ],
    code: staticSink,
    lang: "python",
  },
  "gpt-oss-sinks": {
    path: "vllm/vllm/model_executor/models/gpt_oss.py",
    highlight: [111, 168],
    desc: "gpt-oss는 head마다 학습한 sink 값 하나를 두고, 짝수 층에만 창을 겁니다.",
    annotations: [
      { lines: [111, 113], color: "sky", note: "sink는 KV에 저장되는 token이 아니라 query head마다 하나인 학습된 값입니다. softmax 분모에 더해집니다." },
      { lines: [157, 168], color: "amber", note: "layer_idx가 짝수인 층만 sliding_window를 받습니다. 24층이면 12층이 창 128입니다." },
    ],
    code: gptOss,
    lang: "python",
  },
  "rope-before-cache": {
    path: "vllm/vllm/model_executor/models/gpt_oss.py",
    highlight: [172, 179],
    desc: "RoPE를 key에 먼저 적용한 뒤 attention 층에 넘기므로 cache에는 회전한 key가 들어갑니다.",
    annotations: [
      { lines: [176, 177], color: "sky", note: "원래 위치로 회전한 key가 저장됩니다. StreamingLLM처럼 cache 안 위치로 다시 회전하려면 회전 전 key가 필요하므로 이 경로로는 할 수 없습니다." },
    ],
    code: gptOss,
    lang: "python",
  },
  "trt-adjust": {
    path: "tensorrt-llm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp",
    highlight: [2274, 2290],
    desc: "TensorRT-LLM은 창보다 block 하나만큼 더 쌓였을 때 맨 앞 block을 뗍니다.",
    annotations: [
      { lines: [2276, 2284], color: "sky", note: "기준은 W + tokensPerBlock입니다. W = 128, block 32이면 160 token이 될 때 떼어 128~159 token을 쥡니다." },
      { lines: [2286, 2290], color: "amber", note: "새 block은 마지막 token이 block 경계를 넘을 때 하나씩 할당합니다." },
    ],
    code: trtKv,
    lang: "c",
  },
  "trt-detach": {
    path: "tensorrt-llm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp",
    highlight: [3677, 3737],
    desc: "창 밖 block을 placeholder로 바꾸고 참조가 0이면 eviction queue에 넣습니다.",
    annotations: [
      { lines: [3680, 3683], color: "sky", note: "원문 주석: StreamingLLM은 지원하지 않으므로 창 밖 block은 항상 0번째 block입니다. sink를 남기는 경로가 없습니다." },
      { lines: [3703, 3726], color: "amber", note: "바로 지우지 않고 우선순위를 유지한 채 free queue로 보냅니다. 다른 요청이 같은 prefix를 아직 참조하면 남습니다." },
    ],
    code: trtKv,
    lang: "c",
  },
  "trt-sink-deprecated": {
    path: "tensorrt-llm/tensorrt_llm/llmapi/llm_args.py",
    highlight: [4601, 4607],
    desc: "예전 StreamingLLM 설정 sink_token_length는 PyTorch backend에서 무시됩니다.",
    annotations: [
      { lines: [4603, 4607], color: "sky", note: "값을 주어도 효과가 없고 executor에 닿기 전에 버려진다고 적혀 있습니다." },
    ],
    code: trtArgs,
    lang: "python",
  },
};
