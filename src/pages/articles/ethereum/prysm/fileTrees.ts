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

export const prysmTree: FileNode = dir("prysm-v7.3.1", [
  dir("beacon-chain", [
    dir("node", [
      file(
        "node.go · start/close",
        "beacon-chain/node/node.go",
        "node-lifecycle",
      ),
    ]),
    dir("blockchain", [
      file(
        "receive_block.go · one block",
        "beacon-chain/blockchain/receive_block.go",
        "block-lifecycle",
      ),
    ]),
  ]),
  dir("validator/client", [
    file(
      "attest.go · sign/submit",
      "validator/client/attest.go",
      "validator-attestation",
    ),
  ]),
]);
