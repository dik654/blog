import type { FileNode } from "@/components/code/types";

export const multimodalTrees: Record<string, FileNode> = {
  transformers: {
    name: "transformers",
    type: "dir",
    children: [
      { name: "models/qwen2_vl/image_processing_qwen2_vl.py", path: "transformers/src/transformers/models/qwen2_vl/image_processing_qwen2_vl.py", type: "file", codeKey: "smart-resize" },
      { name: "models/qwen2_5_vl/processing_qwen2_5_vl.py", path: "transformers/src/transformers/models/qwen2_5_vl/processing_qwen2_5_vl.py", type: "file", codeKey: "placeholder-repeat" },
    ],
  },
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/v1/core/encoder_cache_manager.py", path: "vllm/vllm/v1/core/encoder_cache_manager.py", type: "file", codeKey: "ec-hit" },
      { name: "vllm/v1/core/sched/scheduler.py", path: "vllm/vllm/v1/core/sched/scheduler.py", type: "file", codeKey: "sched-encoder-items" },
      { name: "vllm/v1/core/kv_cache_utils.py", path: "vllm/vllm/v1/core/kv_cache_utils.py", type: "file", codeKey: "mm-extra-keys" },
      { name: "vllm/config/scheduler.py", path: "vllm/vllm/config/scheduler.py", type: "file", codeKey: "sched-config" },
      { name: "vllm/config/multimodal.py", path: "vllm/vllm/config/multimodal.py", type: "file", codeKey: "processor-cache-config" },
    ],
  },
  sglang: {
    name: "sglang",
    type: "dir",
    children: [
      { name: "python/sglang/srt/mem_cache/multimodal_cache.py", path: "sglang/python/sglang/srt/mem_cache/multimodal_cache.py", type: "file", codeKey: "sglang-static-cache" },
    ],
  },
};
