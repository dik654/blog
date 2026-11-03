import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const dir = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const stablecoinTree: FileNode = dir(
  "stablecoin-evm @ fc85788",
  [
    dir("contracts/v1", [
      file("FiatTokenV1.sol — mint", "contracts/v1/FiatTokenV1.sol", "fiat-token-mint"),
      file("FiatTokenV1.sol — burn", "contracts/v1/FiatTokenV1.sol", "fiat-token-burn"),
    ]),
  ],
);

export const cctpTree: FileNode = dir("evm-cctp-contracts @ a92a2b4", [
  dir("src/v2", [
    file("TokenMessengerV2.sol — source burn", "src/v2/TokenMessengerV2.sol", "cctp-deposit-burn"),
    file("MessageTransmitterV2.sol — receive", "src/v2/MessageTransmitterV2.sol", "cctp-receive"),
    file("MessageTransmitterV2.sol — validate", "src/v2/MessageTransmitterV2.sol", "cctp-validate"),
    file("TokenMessengerV2.sol — destination mint", "src/v2/TokenMessengerV2.sol", "cctp-mint-destination"),
  ]),
]);
