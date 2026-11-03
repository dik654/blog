import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const directory = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const currentRisc0Tree: FileNode = directory("risc0@164c64bb", [
  directory("examples/hello-world", [
    file("guest/main.rs", "examples/hello-world/methods/guest/src/main.rs", "risc0-hello-guest"),
    file("host/lib.rs", "examples/hello-world/src/lib.rs", "risc0-hello-host"),
    file("host/main.rs", "examples/hello-world/src/main.rs", "risc0-hello-verify"),
  ]),
  directory("risc0/zkvm/src", [
    file("receipt.rs · shape", "risc0/zkvm/src/receipt.rs", "risc0-receipt-shape"),
    file("receipt.rs · verify", "risc0/zkvm/src/receipt.rs", "risc0-receipt-verify"),
    file("receipt.rs · integrity", "risc0/zkvm/src/receipt.rs", "risc0-integrity-boundary"),
    file("claim/receipt.rs", "risc0/zkvm/src/claim/receipt.rs", "risc0-receipt-claim"),
    file("receipt/composite.rs", "risc0/zkvm/src/receipt/composite.rs", "risc0-composite-chain"),
    file("host/prove_info.rs", "risc0/zkvm/src/host/prove_info.rs", "risc0-session-stats"),
  ]),
]);
