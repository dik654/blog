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

export const sp1RealTree: FileNode = d("sp1", [
  d("crates/core/executor/src", [
    f("program.rs — Program struct", "sp1/crates/core/executor/src/program.rs", "sp1-program"),
    f(
      "record.rs — ExecutionRecord · split()",
      "sp1/crates/core/executor/src/record.rs",
      "sp1-record",
    ),
  ]),
  d("crates/sdk/src", [
    f(
      "proof.rs — SP1ProofWithPublicValues",
      "sp1/crates/sdk/src/proof.rs",
      "sp1-proof",
    ),
    f("prover.rs — Prover trait", "sp1/crates/sdk/src/prover.rs", "sp1-prover"),
  ]),
]);
