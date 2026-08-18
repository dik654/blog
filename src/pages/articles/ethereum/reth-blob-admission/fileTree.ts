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

export const rethBlobAdmissionTree: FileNode = d("reth", [
  d("crates/transaction-pool/src", [
    d("validate", [
      f("eth.rs", "reth/crates/transaction-pool/src/validate/eth.rs", "tx-validate-stateless"),
    ]),
    d("blobstore", [
      f("blob.rs", "reth/crates/transaction-pool/src/blobstore/blob.rs", "blob-validate"),
    ]),
  ]),
]);
