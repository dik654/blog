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

export const vllmTree: FileNode = d("vllm", [
  d("vllm/compilation", [
    f(
      "cuda_graph.py — CUDAGraphWrapper",
      "vllm/vllm/compilation/cuda_graph.py",
      "cudagraph-wrapper-call",
    ),
  ]),
]);
