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

export const currentScrollTree: FileNode = directory("zkvm-prover@bf887150", [
  directory("crates/circuits", [
    file("chunk/main.rs", "crates/circuits/chunk-circuit/src/main.rs", "scroll-chunk-guest"),
    file("chunk/circuit.rs", "crates/circuits/chunk-circuit/src/circuit.rs", "scroll-chunk-validate"),
    file("batch/circuit.rs", "crates/circuits/batch-circuit/src/circuit.rs", "scroll-batch-circuit"),
  ]),
  directory("crates/types", [
    file("chunk/execute.rs", "crates/types/chunk/src/scroll/execute.rs", "scroll-chunk-execute"),
    file("base/chunk.rs", "crates/types/base/src/public_inputs/scroll/chunk.rs", "scroll-chunk-public-input"),
    file("circuit/lib.rs", "crates/types/circuit/src/lib.rs", "scroll-aggregation-checks"),
    file("bundle/witness.rs", "crates/types/bundle/src/witness.rs", "scroll-bundle-info"),
    file("task.rs", "crates/types/src/task.rs", "scroll-proving-task"),
  ]),
  directory("crates/verifier", [
    file("verifier.rs", "crates/verifier/src/verifier.rs", "scroll-verifier-binding"),
  ]),
]);
