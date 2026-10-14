import type { FileNode } from "@/components/code/types";

export const adapterTrees: Record<string, FileNode> = {
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/config/lora.py", path: "vllm/vllm/config/lora.py", type: "file", codeKey: "lora-config" },
      { name: "vllm/lora/layers/base_linear.py", path: "vllm/vllm/lora/layers/base_linear.py", type: "file", codeKey: "stacked-slots" },
      { name: "vllm/lora/model_manager.py", path: "vllm/vllm/lora/model_manager.py", type: "file", codeKey: "slot-activate" },
      { name: "vllm/lora/worker_manager.py", path: "vllm/vllm/lora/worker_manager.py", type: "file", codeKey: "worker-load" },
      { name: "vllm/lora/punica_wrapper/punica_gpu.py", path: "vllm/vllm/lora/punica_wrapper/punica_gpu.py", type: "file", codeKey: "shrink-expand" },
      { name: "vllm/lora/ops/triton_ops/lora_kernel_metadata.py", path: "vllm/vllm/lora/ops/triton_ops/lora_kernel_metadata.py", type: "file", codeKey: "segment-metadata" },
      { name: "vllm/lora/ops/triton_ops/lora_shrink_op.py", path: "vllm/vllm/lora/ops/triton_ops/lora_shrink_op.py", type: "file", codeKey: "shrink-kernel" },
      { name: "vllm/v1/core/sched/scheduler.py", path: "vllm/vllm/v1/core/sched/scheduler.py", type: "file", codeKey: "max-loras-skip" },
      { name: "vllm/v1/core/kv_cache_utils.py", path: "vllm/vllm/v1/core/kv_cache_utils.py", type: "file", codeKey: "cache-key" },
    ],
  },
  trtllm: {
    name: "trtllm",
    type: "dir",
    children: [
      { name: "cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp", path: "trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp", type: "file", codeKey: "peft-claim" },
      { name: "tensorrt_llm/_torch/pyexecutor/llm_request.py", path: "trtllm/tensorrt_llm/_torch/pyexecutor/llm_request.py", type: "file", codeKey: "prompt-table" },
    ],
  },
};
