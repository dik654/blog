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

export const momentumOptimizerTree: FileNode = d("torch", [
  d("optim", [f("sgd.py", "torch/optim/sgd.py", "velocity-update")]),
]);
