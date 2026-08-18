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

export const vllmServingTree: FileNode = d("vllm", [
  d("v1/core/sched", [
    f(
      "scheduler.py",
      "vllm/v1/core/sched/scheduler.py",
      "schedule-resource-feasibility",
    ),
  ]),
]);
