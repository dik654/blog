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

export const rethMevTree: FileNode = d("mev-boost", [
  d("server", [
    f("get_header.go", "mev-boost/server/get_header.go", "process-bid"),
    f("get_payload.go", "mev-boost/server/get_payload.go", "get-payload-timeout"),
  ]),
]);

export const rbuilderTree: FileNode = d("rbuilder", [
  d("crates/rbuilder/src/provider", [
    f(
      "reth_prov.rs",
      "rbuilder/crates/rbuilder/src/provider/reth_prov.rs",
      "rbuilder-reth-provider",
    ),
  ]),
]);
