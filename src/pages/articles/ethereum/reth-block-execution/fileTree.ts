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

export const rethBlockExecutionV281Tree: FileNode = directory("source snapshots", [
  directory("reth v2.8.1", [
    file("execute.rs", "reth/crates/evm/evm/src/execute.rs", "execute-one"),
    file("lib.rs", "reth/crates/ethereum/evm/src/lib.rs", "evm-config"),
    file("execute output.rs", "reth/crates/evm/execution-types/src/execute.rs", "execution-output"),
    file("validation.rs", "reth/crates/ethereum/consensus/src/validation.rs", "post-execution-validation"),
  ]),
  directory("revm-database 43.0.1", [
    file("bundle state.rs", "revm-database-43.0.1/src/states", "bundle-state"),
  ]),
]);
