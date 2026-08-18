import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const d = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const vllmSchedulerTree: FileNode = d("vllm", [
  d("v1", [
    f("request.py", "vllm/v1/request.py", "priority-ordering"),
    d("core/sched", [
      f(
        "scheduler.py",
        "vllm/v1/core/sched/scheduler.py",
        "preempt-chunk",
      ),
      f(
        "request_queue.py",
        "vllm/v1/core/sched/request_queue.py",
        "priority-queue",
      ),
    ]),
  ]),
]);
