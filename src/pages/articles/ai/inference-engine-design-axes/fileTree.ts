import type { FileNode } from "@/components/code/types";

export const engineTrees: Record<string, FileNode> = {
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/config/cache.py", path: "vllm/vllm/config/cache.py", type: "file", codeKey: "vllm-block-size" },
      { name: "vllm/config/vllm.py", path: "vllm/vllm/config/vllm.py", type: "file", codeKey: "vllm-async" },
      { name: "vllm/platforms/cuda.py", path: "vllm/vllm/platforms/cuda.py", type: "file", codeKey: "vllm-backend-priority" },
    ],
  },
  trtllm: {
    name: "trtllm",
    type: "dir",
    children: [{ name: "tensorrt_llm/llmapi/llm_args.py", path: "trtllm/tensorrt_llm/llmapi/llm_args.py", type: "file", codeKey: "trt-defaults" }],
  },
  sglang: {
    name: "sglang",
    type: "dir",
    children: [
      { name: "python/sglang/srt/environ.py", path: "sglang/python/sglang/srt/environ.py", type: "file", codeKey: "sglang-ratio" },
      { name: "python/sglang/srt/managers/scheduler.py", path: "sglang/python/sglang/srt/managers/scheduler.py", type: "file", codeKey: "sglang-overlap" },
    ],
  },
  "llama.cpp": {
    name: "llama.cpp",
    type: "dir",
    children: [{ name: "src/llama-kv-cache.cpp", path: "llama.cpp/src/llama-kv-cache.cpp", type: "file", codeKey: "llama-n-kv" }],
  },
};
