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

export const ganTree: FileNode = d("pytorch-examples", [
  d("dcgan", [
    f("main.py", "pytorch-examples/dcgan/main.py", "minimax-training-loop"),
  ]),
]);
