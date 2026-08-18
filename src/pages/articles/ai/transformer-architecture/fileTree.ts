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

export const transformerArchitectureTree: FileNode = d("torch", [
  d("nn", [
    f("functional.py", "torch/nn/functional.py", "sdpa-formula"),
    d("modules", [
      f(
        "transformer.py",
        "torch/nn/modules/transformer.py",
        "block-forward",
      ),
    ]),
  ]),
]);
