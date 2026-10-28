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
  d("ethereum", [
    d("src", [
      f("consensus.rs", "helios/ethereum/src/consensus.rs", "hl-fetch"),
    ]),
    d("consensus-core", [
      d("src", [
        f("consensus_core.rs", "helios/ethereum/consensus-core/src/consensus_core.rs", "hl-init"),
      ]),
    ]),
  ]),
]);
