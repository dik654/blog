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

export const mixtureOfExpertsTree: FileNode = d("transformers", [
  d("models/mixtral", [
    f(
      "modeling_mixtral.py",
      "transformers/models/mixtral/modeling_mixtral.py",
      "router-topk",
    ),
  ]),
]);
