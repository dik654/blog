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

export const omniTree: FileNode = d("omni", [
  d("octane/evmengine/keeper", [
    f("abci.go", "octane/evmengine/keeper/abci.go", "prepare-payload"),
    f("keeper.go", "octane/evmengine/keeper/keeper.go", "verify-payload-envelope"),
    f("proposal_server.go", "octane/evmengine/keeper/proposal_server.go", "process-candidate"),
    f("msg_server.go", "octane/evmengine/keeper/msg_server.go", "finalize-payload"),
    f("events.go", "octane/evmengine/keeper/events.go"),
  ]),
  d("lib/ethclient", [
    f("engineclient.go", "lib/ethclient/engineclient.go", "engine-status"),
  ]),
]);
