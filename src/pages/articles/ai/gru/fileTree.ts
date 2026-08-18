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

export const gruTree: FileNode = d("torch", [
  d("nn/modules", [f("rnn.py", "torch/nn/modules/rnn.py", "gate-formula")]),
]);
