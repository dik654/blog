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

export const vllmSpecDecodeTree: FileNode = d("vllm", [
  d("v1/sample", [
    f(
      "rejection_sampler.py",
      "vllm/v1/sample/rejection_sampler.py",
      "rejection-test",
    ),
  ]),
]);
