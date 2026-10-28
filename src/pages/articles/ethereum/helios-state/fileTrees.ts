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

export const heliosTree: FileNode = d("helios", [
  d("core", [
    d("src", [
      d("execution", [
        f("proof.rs · account", "helios/core/src/execution/proof.rs", "hl-account-proof"),
        f("proof.rs · storage", "helios/core/src/execution/proof.rs", "hl-storage-proof"),
        f("proof.rs · MPT wrapper", "helios/core/src/execution/proof.rs", "hl-verify-proof"),
        d("providers", [
          f("rpc.rs · get_account", "helios/core/src/execution/providers/rpc.rs", "hl-rpc-account"),
        ]),
        d("cache", [
          f("state.rs · cache identity", "helios/core/src/execution/cache/state.rs", "hl-state-cache"),
        ]),
      ]),
    ]),
  ]),
]);
