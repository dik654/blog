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

export const resnetTree: FileNode = d("torchvision", [
  d("models", [
    f("resnet.py", "torchvision/models/resnet.py", "block-forward"),
  ]),
]);
