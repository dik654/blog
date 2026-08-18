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

export const vllmPagedAttentionTree: FileNode = d("vllm", [
  d("v1/core", [
    f("block_pool.py", "vllm/v1/core/block_pool.py", "ref-count-eviction"),
    f(
      "kv_cache_utils.py",
      "vllm/v1/core/kv_cache_utils.py",
      "block-hash-chain",
    ),
    f(
      "single_type_kv_cache_manager.py",
      "vllm/v1/core/single_type_kv_cache_manager.py",
      "block-demand",
    ),
  ]),
]);
