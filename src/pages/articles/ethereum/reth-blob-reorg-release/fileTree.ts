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

export const rethBlobReorgReleaseTree: FileNode = dir("reth v2.8.1", [
  dir("crates/transaction-pool/src", [
    file(
      "maintain.rs · reorg",
      "reth-v2.8.1/transaction-pool/maintain.rs#reorg",
      "reorg-maintain",
    ),
    file(
      "maintain.rs · finality",
      "reth-v2.8.1/transaction-pool/maintain.rs#finality",
      "finality-maintain",
    ),
    dir("blobstore", [
      file(
        "tracker.rs",
        "reth-v2.8.1/transaction-pool/blobstore/tracker.rs",
        "tracker",
      ),
    ]),
    dir("validate", [
      file(
        "eth.rs · missing sidecar",
        "reth-v2.8.1/transaction-pool/validate/eth.rs",
        "validate-missing",
      ),
    ]),
  ]),
]);
