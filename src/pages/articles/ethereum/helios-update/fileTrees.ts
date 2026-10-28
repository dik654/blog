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
    d("consensus-core", [
      d("src", [
        f(
          "consensus_core.rs · Store 적용",
          "helios/ethereum/consensus-core/src/consensus_core.rs",
          "hl-apply-update",
        ),
        f(
          "consensus_core.rs · 후보 선택",
          "helios/ethereum/consensus-core/src/consensus_core.rs",
          "hl-best-update",
        ),
        f(
          "consensus_core.rs · force update",
          "helios/ethereum/consensus-core/src/consensus_core.rs",
          "hl-force-update",
        ),
      ]),
    ]),
  ]),
]);
