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

export const rethPrecompilesV281Tree: FileNode = dir("reth-v2.8.1 + revm-43.0.3", [
  dir("reth", [
    file("EVM 환경", "reth-v2.8.1/crates/ethereum/evm/src/lib.rs", "evm-env"),
  ]),
  dir("revm-precompile", [
    file("Spec registry", "revm-precompile-43.0.3/src/lib.rs", "registry"),
    file("SHA-256", "revm-precompile-43.0.3/src/hash.rs", "sha256"),
    file("ecRecover", "revm-precompile-43.0.3/src/secp256k1.rs", "ecrecover"),
  ]),
  dir("revm-handler", [
    file("CALL provider", "revm-handler-43.0.3/src/precompile_provider.rs", "provider"),
  ]),
]);
