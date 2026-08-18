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

export const eip4844BlobFeeTree: FileNode = d("reth", [
  d("crates/primitives-traits/src", [
    f("eip4844.rs", "reth/crates/primitives-traits/src/eip4844.rs", "calc-excess-blob-gas"),
  ]),
]);
