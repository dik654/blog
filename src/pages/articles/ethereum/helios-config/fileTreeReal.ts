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

export const heliosConfigRealTree: FileNode = d("helios · v0.12.0 · 2af9b418", [
  d("ethereum/src", [
    d("config", [
      f("mod.rs · 입력 병합", "helios@v0.12.0/ethereum/src/config/mod.rs", "helios-config-merge"),
      f("networks.rs · network profile", "helios@v0.12.0/ethereum/src/config/networks.rs", "helios-network"),
      f("checkpoints.rs · fallback plurality", "helios@v0.12.0/ethereum/src/config/checkpoints.rs", "helios-checkpoint-fallback"),
    ]),
    f("builder.rs · client 조립", "helios@v0.12.0/ethereum/src/builder.rs", "helios-builder"),
    f("database.rs · FileDB", "helios@v0.12.0/ethereum/src/database.rs", "helios-filedb"),
    f("consensus.rs · checkpoint와 sync", "helios@v0.12.0/ethereum/src/consensus.rs", "helios-checkpoint-select"),
    f("consensus.rs · checkpoint age", "helios@v0.12.0/ethereum/src/consensus.rs", "helios-checkpoint-age"),
  ]),
  d("core/src/client", [
    f("mod.rs · JSON-RPC 시작", "helios@v0.12.0/core/src/client/mod.rs", "helios-client-new"),
    f("node.rs · wait_synced", "helios@v0.12.0/core/src/client/node.rs", "helios-wait-synced"),
  ]),
]);
