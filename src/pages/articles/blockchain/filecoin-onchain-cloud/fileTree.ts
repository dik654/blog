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

export const filecoinServicesTree: FileNode = d("filecoin-services", [
  d("service_contracts/src", [
    d("storage", [
      f(
        "FWSSStorage.sol — dataset·period state",
        "filecoin-services/service_contracts/src/storage/FWSSStorage.sol",
        "dataset-info",
      ),
    ]),
    d("modules", [
      f(
        "FWSSProvingModule.sol — proof·payment validation",
        "filecoin-services/service_contracts/src/modules/FWSSProvingModule.sol",
        "period-state",
      ),
    ]),
  ]),
]);

export const filecoinPayTree: FileNode = d("filecoin-pay", [
  d("src", [
    f(
      "FilecoinPayV1.sol — rail·validator settlement",
      "filecoin-pay/src/FilecoinPayV1.sol",
      "rail-settle",
    ),
  ]),
]);

export const synapseSdkTree: FileNode = d("synapse-sdk", [
  d("packages/synapse-sdk/src/storage", [
    f(
      "manager.ts — store·pull·commit",
      "synapse-sdk/packages/synapse-sdk/src/storage/manager.ts",
      "sdk-upload",
    ),
  ]),
]);
