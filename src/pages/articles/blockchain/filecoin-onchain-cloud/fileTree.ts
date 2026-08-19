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
    f(
      "FilecoinWarmStorageService.sol — DataSetInfo",
      "filecoin-services/service_contracts/src/FilecoinWarmStorageService.sol",
      "dataset-info",
    ),
  ]),
]);

export const filecoinPayTree: FileNode = d("filecoin-pay", [
  d("src", [
    f(
      "FilecoinPayV1.sol — Rail·settleRail",
      "filecoin-pay/src/FilecoinPayV1.sol",
      "rail-settle",
    ),
  ]),
]);
