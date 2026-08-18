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

export const cnnTree: FileNode = d("torch", [
  d("nn/modules", [
    f("fold.py", "torch/nn/modules/fold.py", "conv-as-matmul"),
    f("conv.py", "torch/nn/modules/conv.py", "output-shape-spec"),
  ]),
]);
