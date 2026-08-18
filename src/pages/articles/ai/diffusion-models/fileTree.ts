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

export const diffusionModelsTree: FileNode = d("diffusers", [
  d("schedulers", [
    f(
      "scheduling_ddpm.py",
      "diffusers/schedulers/scheduling_ddpm.py",
      "add-noise",
    ),
  ]),
]);
