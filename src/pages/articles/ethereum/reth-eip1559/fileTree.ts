import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const dir = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const rethEip1559V281Tree: FileNode = dir("source snapshots", [
  dir("reth-v2.8.1", [
    file("chainspec/api.rs", "reth-v2.8.1/crates/chainspec/src/api.rs", "chain-params"),
    file(
      "consensus/validation.rs",
      "reth-v2.8.1/crates/consensus/common/src/validation.rs",
      "header-validation",
    ),
    file(
      "evm + transaction-pool consumers",
      "reth-v2.8.1/crates/{ethereum/evm,transaction-pool}/src",
      "shared-consumers",
    ),
  ]),
  dir("alloy-v2.5.0", [
    file(
      "eips/eip1559/helpers.rs",
      "alloy-v2.5.0/crates/eips/src/eip1559/helpers.rs",
      "base-fee-calculation",
    ),
    file(
      "consensus/transaction/mod.rs",
      "alloy-v2.5.0/crates/consensus/src/transaction/mod.rs",
      "effective-tip",
    ),
  ]),
]);
