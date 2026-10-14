import type { FileNode } from "@/components/code/types";

export const engineTrees: Record<string, FileNode> = {
  trtllm: {
    name: "trtllm",
    type: "dir",
    children: [
      { name: "cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp", path: "trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp", type: "file", codeKey: "trt-no-evict" },
      { name: "cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp", path: "trtllm/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp", type: "file", codeKey: "trt-remaining-blocks" },
      { name: "cpp/include/tensorrt_llm/batch_manager/kvCacheManager.h", path: "trtllm/cpp/include/tensorrt_llm/batch_manager/kvCacheManager.h", type: "file", codeKey: "trt-pool-meta" },
      { name: "cpp/include/tensorrt_llm/batch_manager/llmRequest.h", path: "trtllm/cpp/include/tensorrt_llm/batch_manager/llmRequest.h", type: "file", codeKey: "trt-pause-recompute" },
      { name: "cpp/tensorrt_llm/batch_manager/evictionPolicy.cpp", path: "trtllm/cpp/tensorrt_llm/batch_manager/evictionPolicy.cpp", type: "file", codeKey: "trt-priority-evict" },
      { name: "cpp/tensorrt_llm/common/attentionOp.cpp", path: "trtllm/cpp/tensorrt_llm/common/attentionOp.cpp", type: "file", codeKey: "trt-fused-preprocess" },
      { name: "cpp/kernels/xqa/mha.cu", path: "trtllm/cpp/kernels/xqa/mha.cu", type: "file", codeKey: "trt-xqa-tile" },
      { name: "cpp/kernels/xqa/defines.h", path: "trtllm/cpp/kernels/xqa/defines.h", type: "file", codeKey: "trt-xqa-defines" },
      { name: "tensorrt_llm/llmapi/llm_args.py", path: "trtllm/tensorrt_llm/llmapi/llm_args.py", type: "file", codeKey: "trt-defaults" },
    ],
  },
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/v1/core/sched/scheduler.py", path: "vllm/vllm/v1/core/sched/scheduler.py", type: "file", codeKey: "vllm-preempt" },
      { name: "vllm/v1/attention/backends/flash_attn.py", path: "vllm/vllm/v1/attention/backends/flash_attn.py", type: "file", codeKey: "vllm-kv-shape" },
      { name: "vllm/v1/worker/kv_connector_model_runner_mixin.py", path: "vllm/vllm/v1/worker/kv_connector_model_runner_mixin.py", type: "file", codeKey: "vllm-uniform-layout" },
      { name: "vllm/config/cache.py", path: "vllm/vllm/config/cache.py", type: "file", codeKey: "vllm-block-size" },
    ],
  },
};
