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

export const commonwareStorageTree: FileNode = d("storage/src", [
  d("merkle/mmr", [
    f("mod.rs", "storage/src/merkle/mmr/mod.rs", "mmr-family"),
  ]),
  d("qmdb", [
    d("any", [
      f("mod.rs", "storage/src/qmdb/any/mod.rs", "qmdb-lifecycle"),
    ]),
    d("current", [
      f("db.rs", "storage/src/qmdb/current/db.rs", "qmdb-durability"),
      f("proof/mod.rs", "storage/src/qmdb/current/proof/mod.rs", "current-proof"),
    ]),
    f("batch_chain.rs", "storage/src/qmdb/batch_chain.rs", "qmdb-stale"),
  ]),
]);
