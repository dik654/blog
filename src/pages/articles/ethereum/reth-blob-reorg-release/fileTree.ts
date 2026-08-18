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

export const rethBlobReorgReleaseTree: FileNode = d("reth", [
  d("crates/transaction-pool/src", [
    d("blobstore", [
      f("tracker.rs", "reth/crates/transaction-pool/src/blobstore/tracker.rs", "canon-tracker"),
    ]),
    d("validate", [
      f("eth.rs", "reth/crates/transaction-pool/src/validate/eth.rs", "reinsert-sidecar-check"),
    ]),
  ]),
  d("crates/consensus/common/src", [
    f("validation.rs", "reth/crates/consensus/common/src/validation.rs", "header-blob-gas"),
  ]),
]);
