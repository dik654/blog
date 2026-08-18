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

export const rethBlobStorageTree: FileNode = d("reth", [
  d("crates/transaction-pool/src/blobstore", [
    f("mod.rs", "reth/crates/transaction-pool/src/blobstore/mod.rs", "blobstore-trait"),
    f("disk.rs", "reth/crates/transaction-pool/src/blobstore/disk.rs", "disk-blobstore"),
    f("disk_inner.rs", "reth/crates/transaction-pool/src/blobstore/disk_inner.rs", "disk-inner-ops"),
    f("mem.rs", "reth/crates/transaction-pool/src/blobstore/mem.rs", "mem-blobstore"),
  ]),
]);
