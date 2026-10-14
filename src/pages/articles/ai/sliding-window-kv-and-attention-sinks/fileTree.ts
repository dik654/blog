import type { FileNode } from "@/components/code/types";

export const swaTrees: Record<string, FileNode> = {
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/v1/core/single_type_kv_cache_manager.py", path: "vllm/vllm/v1/core/single_type_kv_cache_manager.py", type: "file", codeKey: "skipped-tokens" },
      { name: "vllm/model_executor/layers/attention/static_sink_attention.py", path: "vllm/vllm/model_executor/layers/attention/static_sink_attention.py", type: "file", codeKey: "static-sink-table" },
      { name: "vllm/model_executor/models/gpt_oss.py", path: "vllm/vllm/model_executor/models/gpt_oss.py", type: "file", codeKey: "gpt-oss-sinks" },
    ],
  },
  "tensorrt-llm": {
    name: "tensorrt-llm",
    type: "dir",
    children: [
      { name: "cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp", path: "tensorrt-llm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp", type: "file", codeKey: "trt-detach" },
      { name: "tensorrt_llm/llmapi/llm_args.py", path: "tensorrt-llm/tensorrt_llm/llmapi/llm_args.py", type: "file", codeKey: "trt-sink-deprecated" },
    ],
  },
};
