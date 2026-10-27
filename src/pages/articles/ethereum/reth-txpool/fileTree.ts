import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
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

export const rethTxpoolV281Tree: FileNode = dir("reth-v2.8.1", [
  dir("crates/transaction-pool/src", [
    file("ordering.rs", "reth-v2.8.1/crates/transaction-pool/src/ordering.rs", "ordering-policy"),
    file("maintain.rs", "reth-v2.8.1/crates/transaction-pool/src/maintain.rs", "reorg-reinjection"),
    dir("validate", [
      file("eth.rs", "reth-v2.8.1/crates/transaction-pool/src/validate/eth.rs", "validation-pipeline"),
    ]),
    dir("pool", [
      file("add.rs", "reth-v2.8.1/crates/transaction-pool/src/pool/add.rs", "validation-outcome"),
      file("state.rs", "reth-v2.8.1/crates/transaction-pool/src/pool/state.rs", "subpool-state"),
      file("best.rs", "reth-v2.8.1/crates/transaction-pool/src/pool/best.rs", "sender-head-order"),
    ]),
  ]),
]);
