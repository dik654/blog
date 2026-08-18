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

export const normalizingFlowsTree: FileNode = d("torch", [
  d("distributions", [
    f("transforms.py", "torch/distributions/transforms.py", "affine-inverse-jacobian"),
    f(
      "transformed_distribution.py",
      "torch/distributions/transformed_distribution.py",
      "change-of-variables-logprob",
    ),
  ]),
]);
