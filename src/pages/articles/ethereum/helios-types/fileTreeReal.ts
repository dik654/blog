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

export const heliosTypesRealTree: FileNode = d("helios-0.11.1", [
  d("ethereum/src/rpc", [
    f("http_rpc.rs · JSON transport", "helios-0.11.1/ethereum/src/rpc/http_rpc.rs · excerpts", "helios-json-decode"),
  ]),
  d("ethereum/consensus-core/src", [
    f("types/mod.rs · fork variants", "helios-0.11.1/ethereum/consensus-core/src/types/mod.rs · excerpts", "helios-fork-types"),
    f("proof.rs · Merkle fold", "helios-0.11.1/ethereum/consensus-core/src/proof.rs · excerpts", "helios-proof-fold"),
    f("consensus_core.rs · validation", "helios-0.11.1/ethereum/consensus-core/src/consensus_core.rs · verify_generic_update excerpt", "helios-update-verify"),
  ]),
]);
