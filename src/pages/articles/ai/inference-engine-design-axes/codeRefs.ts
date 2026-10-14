import type { CodeRef } from "@/components/code/types";
import vllmConfig from "./codebase/vllm/vllm/config/vllm.py?raw";
import vllmCache from "../tensorrt-llm-kv-cache-and-kernels/codebase/vllm/vllm/config/cache.py?raw";
import trtArgs from "../tensorrt-llm-kv-cache-and-kernels/codebase/trtllm/tensorrt_llm/llmapi/llm_args.py?raw";
import sglangEnv from "../sglang-runtime-anatomy/codebase/sglang/python/sglang/srt/environ.py?raw";
import sglangScheduler from "../sglang-runtime-anatomy/codebase/sglang/python/sglang/srt/managers/scheduler.py?raw";
import llamaKv from "../llama-cpp-local-inference/codebase/llama.cpp/src/llama-kv-cache.cpp?raw";
import vllmCuda from "../attention-kernel-anatomy-and-backends/codebase/vllm/vllm/platforms/cuda.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "vllm-block-size": {
    path: "vllm/vllm/config/cache.py",
    highlight: [47, 47],
    desc: "vLLM은 따로 정하지 않으면 block 하나에 16 token을 담습니다.",
    annotations: [{ lines: [264, 268], color: "sky", note: "사용자가 block_size를 주지 않았을 때만 기본값 16을 씁니다. 500 token은 block 32개가 됩니다." }],
    code: vllmCache,
    lang: "python",
  },
  "trt-defaults": {
    path: "trtllm/tensorrt_llm/llmapi/llm_args.py",
    highlight: [4122, 4124],
    desc: "TensorRT-LLM의 기본 수용 정책은 끝까지 예약하는 GUARANTEED_NO_EVICT입니다.",
    annotations: [
      { lines: [4122, 4124], color: "sky", note: "출력 상한까지 block을 미리 셉니다. 3절 요청은 38 block을 잡습니다." },
      { lines: [4723, 4724], color: "sky", note: "block 하나는 32 token입니다. 이 block은 모든 층의 K·V를 함께 담습니다." },
      { lines: [6222, 6225], color: "sky", note: "attention backend 기본값도 자체 구현인 TRTLLM입니다." },
    ],
    code: trtArgs,
    lang: "python",
  },
  "sglang-ratio": {
    path: "sglang/python/sglang/srt/environ.py",
    highlight: [597, 601],
    desc: "SGLang이 아직 만들지 않은 출력을 셀 때 쓰는 비율의 기본값입니다.",
    annotations: [{ lines: [597, 601], color: "sky", note: "초기 0.7, 하한은 0.7×0.14=0.098, 600 step에 걸쳐 내려갑니다. 출력 상한은 4,096에서 자릅니다." }],
    code: sglangEnv,
    lang: "python",
  },
  "llama-n-kv": {
    path: "llama.cpp/src/llama-kv-cache.cpp",
    highlight: [1282, 1296],
    desc: "attention이 읽을 cell 범위를 256 단위로 올립니다.",
    annotations: [{ lines: [1282, 1296], color: "sky", note: "앞에서부터 쓴 마지막 cell이 500이면 512칸을 읽습니다. 다른 대화의 cell은 mask가 지웁니다." }],
    code: llamaKv,
    lang: "c",
  },
  "vllm-async": {
    path: "vllm/vllm/config/vllm.py",
    highlight: [1095, 1143],
    desc: "맞지 않는 옵션이 없으면 vLLM도 비동기 scheduling을 기본으로 켭니다.",
    annotations: [{ lines: [1095, 1143], color: "sky", note: "pooling 모델, 일부 speculative decoding, 지원하지 않는 실행기에서만 끄고 나머지는 True로 둡니다." }],
    code: vllmConfig,
    lang: "python",
  },
  "sglang-overlap": {
    path: "sglang/python/sglang/srt/managers/scheduler.py",
    highlight: [1975, 2034],
    desc: "다음 batch를 GPU에 넣은 뒤 앞 batch의 결과를 처리합니다.",
    annotations: [{ lines: [2021, 2034], color: "sky", note: "run_batch로 이번 batch를 띄운 다음 pop_and_process가 한 step 앞의 결과를 처리합니다. 결과가 한 step 늦게 읽힙니다." }],
    code: sglangScheduler,
    lang: "python",
  },
  "vllm-backend-priority": {
    path: "vllm/vllm/platforms/cuda.py",
    highlight: [143, 159],
    desc: "Blackwell(SM100)에서 vLLM은 FlashInfer를 먼저 고릅니다.",
    annotations: [{ lines: [143, 152], color: "sky", note: "주석이 말하듯 SM100에서는 FlashInfer를 통해 TRTLLM causal attention을 씁니다. 다른 GPU에서는 FlashAttention이 먼저입니다." }],
    code: vllmCuda,
    lang: "python",
  },
};
