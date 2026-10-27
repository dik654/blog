import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

export const rethBlobAdmissionTree: FileNode = {
  name: "reth v2.8.1",
  type: "dir",
  children: [
    {
      name: "crates/transaction-pool/src",
      type: "dir",
      children: [
        {
          name: "validate",
          type: "dir",
          children: [
            file("eth.rs · 전체 경로", "reth-v2.8.1/transaction-pool/validate/eth.rs", "validation-path"),
            file("eth.rs · stateless", "reth-v2.8.1/transaction-pool/validate/eth.rs", "stateless"),
            file("eth.rs · Blob", "reth-v2.8.1/transaction-pool/validate/eth.rs", "blob-validation"),
            file("mod.rs · outcomes", "reth-v2.8.1/transaction-pool/validate/mod.rs", "outcomes"),
          ],
        },
        file("pool/mod.rs · insertion", "reth-v2.8.1/transaction-pool/pool/mod.rs", "pool-insertion"),
      ],
    },
  ],
};
