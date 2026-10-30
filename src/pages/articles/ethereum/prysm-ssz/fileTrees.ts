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

export const prysmTree: FileNode = d("prysm", [
  d("encoding/ssz", [
    f("merkleize.go — MerkleizeListSSZ()", "encoding/ssz/merkleize.go", "ssz-list-root"),
    d("query", [
      f("generalized_index.go", "encoding/ssz/query/generalized_index.go", "ssz-gindex"),
    ]),
  ]),
  d("methodical-ssz@932cc738", [
    d("ssz", [
      f("marshal.go · unmarshal.go — offset", "ssz/marshal.go", "ssz-offset"),
    ]),
  ]),
]);
