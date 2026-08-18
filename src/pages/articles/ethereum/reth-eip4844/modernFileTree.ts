import type { FileNode } from "@/components/code/types";

export const modernRethEip4844Tree: FileNode = {
  name: "reth",
  type: "dir",
  children: [
    {
      name: "crates/transaction-pool/src/blobstore",
      type: "dir",
      children: [
        {
          name: "blob.rs",
          type: "file",
          path: "reth/crates/transaction-pool/src/blobstore/blob.rs",
          codeKey: "versioned-hash-check",
        },
      ],
    },
  ],
};
