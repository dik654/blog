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

export const vaeTree: FileNode = d("pytorch-examples", [
  d("vae", [f("main.py", "pytorch-examples/vae/main.py", "reparam-and-loss")]),
]);
