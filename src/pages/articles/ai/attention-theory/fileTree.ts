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

export const attentionTheoryTree: FileNode = d("torch", [
  d("nn", [f("functional.py", "torch/nn/functional.py", "qkv-projection")]),
]);
