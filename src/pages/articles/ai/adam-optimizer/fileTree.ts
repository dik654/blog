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

export const adamOptimizerTree: FileNode = d("torch", [
  d("optim", [f("adam.py", "torch/optim/adam.py", "moment-update")]),
]);
