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

export const reverseModeAutodiffTree: FileNode = d("pytorch-docs", [
  f(
    "extending_autograd.py",
    "pytorch-docs/extending_autograd.py",
    "linear-forward",
  ),
]);
