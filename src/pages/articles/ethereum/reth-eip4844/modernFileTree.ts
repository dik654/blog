import type { FileNode } from "@/components/code/types";

export const alloyEip4844Tree: FileNode = {
  name: "alloy-v2.5.0",
  type: "dir",
  children: [
    {
      name: "crates/consensus/src/transaction",
      type: "dir",
      children: [
        {
          name: "eip4844.rs",
          type: "file",
          path: "alloy-v2.5.0/crates/consensus/src/transaction/eip4844.rs",
          codeKey: "transaction-fields",
        },
        {
          name: "eip4844_sidecar.rs",
          type: "file",
          path: "alloy-v2.5.0/crates/consensus/src/transaction/eip4844_sidecar.rs",
          codeKey: "alloy-sidecar-variant",
        },
      ],
    },
    {
      name: "crates/eips/src/eip4844",
      type: "dir",
      children: [
        {
          name: "sidecar.rs",
          type: "file",
          path: "alloy-v2.5.0/crates/eips/src/eip4844/sidecar.rs",
          codeKey: "sidecar-binding",
        },
        {
          name: "mod.rs",
          type: "file",
          path: "alloy-v2.5.0/crates/eips/src/eip4844/mod.rs",
          codeKey: "versioned-hash",
        },
      ],
    },
  ],
};

export const rethEip4844Tree: FileNode = {
  name: "reth-v2.8.1",
  type: "dir",
  children: [
    {
      name: "crates/transaction-pool/src/validate",
      type: "dir",
      children: [
        {
          name: "eth.rs",
          type: "file",
          path: "reth-v2.8.1/crates/transaction-pool/src/validate/eth.rs",
          codeKey: "reth-delegation",
        },
      ],
    },
  ],
};
