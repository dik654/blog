import type { FileNode } from "@/components/code/types";

export const sglangRuntimeTrees: Record<string, FileNode> = {
  sglang: {
    name: "sglang",
    type: "dir",
    children: [
      { name: "srt/mem_cache/memory_pool.py", path: "sglang/python/sglang/srt/mem_cache/memory_pool.py", type: "file", codeKey: "req-to-token" },
      { name: "srt/mem_cache/prefill_budget.py", path: "sglang/python/sglang/srt/mem_cache/prefill_budget.py", type: "file", codeKey: "prefill-budget" },
      { name: "srt/managers/schedule_policy.py", path: "sglang/python/sglang/srt/managers/schedule_policy.py", type: "file", codeKey: "new-request-charge" },
      { name: "srt/managers/scheduler_components/new_token_ratio_tracker.py", path: "sglang/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py", type: "file", codeKey: "ratio-tracker" },
      { name: "srt/environ.py", path: "sglang/python/sglang/srt/environ.py", type: "file", codeKey: "ratio-env" },
      { name: "srt/managers/schedule_batch.py", path: "sglang/python/sglang/srt/managers/schedule_batch.py", type: "file", codeKey: "retract-decode" },
      { name: "srt/managers/scheduler.py", path: "sglang/python/sglang/srt/managers/scheduler.py", type: "file", codeKey: "overlap-loop" },
      { name: "srt/managers/overlap_utils.py", path: "sglang/python/sglang/srt/managers/overlap_utils.py", type: "file", codeKey: "future-map" },
    ],
  },
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/v1/core/sched/scheduler.py", path: "vllm/vllm/v1/core/sched/scheduler.py", type: "file", codeKey: "vllm-preempt" },
    ],
  },
};
