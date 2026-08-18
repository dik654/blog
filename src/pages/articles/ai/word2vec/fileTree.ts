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

export const word2vecTree: FileNode = d("torch", [
  d("nn/modules", [
    f("sparse.py", "torch/nn/modules/sparse.py", "onehot-as-gather"),
  ]),
]);
