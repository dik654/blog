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

export const heliosConfigRealTree: FileNode = d("helios", [
  d("ethereum/src", [
    d("config", [
      f("mod.rs — Config::from_file()", "helios/ethereum/src/config/mod.rs", "helios-config-merge"),
      f("networks.rs — Network · mainnet()", "helios/ethereum/src/config/networks.rs", "helios-network"),
    ]),
    f("builder.rs — EthereumClientBuilder::build()", "helios/ethereum/src/builder.rs", "helios-builder"),
    f("database.rs — FileDB", "helios/ethereum/src/database.rs", "helios-filedb"),
  ]),
]);
