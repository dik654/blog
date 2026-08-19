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

export const heliosTypesRealTree: FileNode = d("helios", [
  d("ethereum/consensus-core/src/types", [
    f(
      "mod.rs — LightClientStore/Header/SyncAggregate/Update",
      "helios/ethereum/consensus-core/src/types/mod.rs",
      "helios-header-root",
    ),
  ]),
]);
