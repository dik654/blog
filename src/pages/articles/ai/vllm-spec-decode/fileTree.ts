import type { FileNode } from "@/components/code/types";
export const vllmSpecDecodeTree: FileNode = {
  "name": "vllm",
  "type": "dir",
  "children": [
    {
      "name": "rejection_sampler.py",
      "path": "vllm/v1/sample/rejection_sampler.py",
      "type": "file",
      "codeKey": "rejection-test"
    },
    {
      "name": "scheduler.py",
      "path": "vllm/v1/core/sched/scheduler.py",
      "type": "file",
      "codeKey": "rollback"
    },
    {
      "name": "speculative.py",
      "path": "vllm/config/speculative.py",
      "type": "file",
      "codeKey": "sampling-config"
    },
    {
      "name": "gpu_model_runner.py",
      "path": "vllm/v1/worker/gpu_model_runner.py",
      "type": "file",
      "codeKey": "metadata"
    },
    {
      "name": "utils.py",
      "path": "vllm/v1/spec_decode/dynamic/utils.py",
      "type": "file",
      "codeKey": "dynamic-table"
    }
  ]
};
