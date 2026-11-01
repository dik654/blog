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

export const ipcTree: FileNode = d("ipc", [
  d("fendermint/vm/topdown/src/finality", [
    f(
      "null.rs — proposal height·hash 검사",
      "fendermint/vm/topdown/src/finality/null.rs",
      "ipc-finality-provider",
    ),
  ]),
  d("contracts/contracts/gateway/router", [
    f(
      "CheckpointingFacet.sol — verified checkpoint commit",
      "contracts/contracts/gateway/router/CheckpointingFacet.sol",
      "ipc-subnet",
    ),
    f(
      "TopDownFinalityFacet.sol — parent finality 호출 경계",
      "contracts/contracts/gateway/router/TopDownFinalityFacet.sol",
      "ipc-finality",
    ),
  ]),
  d("contracts/contracts/lib", [
    f(
      "LibGateway.sol — height guard와 storage transition",
      "contracts/contracts/lib/LibGateway.sol",
      "ipc-finality-storage",
    ),
  ]),
]);
