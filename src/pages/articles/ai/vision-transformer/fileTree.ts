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

export const visionTransformerTree: FileNode = d("torchvision", [
  d("models", [
    f(
      "vision_transformer.py",
      "torchvision/models/vision_transformer.py",
      "conv-as-patch-proj",
    ),
  ]),
]);
