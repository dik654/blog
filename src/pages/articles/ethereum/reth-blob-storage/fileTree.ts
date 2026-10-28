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

export const rethBlobStorageTree: FileNode = dir("reth v2.8.1", [
  dir("crates/transaction-pool/src", [
    dir("blobstore", [
      file("mod.rs · contract", "reth-v2.8.1/transaction-pool/blobstore/mod.rs", "store-contract"),
      file("disk.rs · storage path", "reth-v2.8.1/transaction-pool/blobstore/disk.rs", "disk-path"),
      file("tracker.rs · finality", "reth-v2.8.1/transaction-pool/blobstore/tracker.rs", "finality-cleanup"),
    ]),
    dir("pool", [
      file("mod.rs · state boundary", "reth-v2.8.1/transaction-pool/pool/mod.rs", "pool-boundary"),
      file("maintain.rs · cleanup loop", "reth-v2.8.1/transaction-pool/maintain.rs", "finality-cleanup"),
    ]),
  ]),
]);
