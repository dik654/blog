import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const sp1RealTree: FileNode = d("sp1", [
  d("examples/fibonacci/program/src", [
    f("main.rs — read n, commit n·a·b", "sp1/examples/fibonacci/program/src/main.rs", "sp1-fibonacci"),
  ]),
  d("crates/core/executor/src", [
    f("program.rs — ELF→Program", "sp1/crates/core/executor/src/program.rs", "sp1-program"),
    f("record.rs — ExecutionRecord", "sp1/crates/core/executor/src/record.rs", "sp1-record"),
  ]),
  d("crates/prover/src", [
    f("verify.rs — shard continuity", "sp1/crates/prover/src/verify.rs", "sp1-core-verify"),
  ]),
  d("crates/sdk/src", [
    f("proof.rs — proof modes·receipt", "sp1/crates/sdk/src/proof.rs", "sp1-proof"),
    f("prover.rs — lifecycle·verification", "sp1/crates/sdk/src/prover.rs", "sp1-prover"),
  ]),
  d("slop/crates/tensor/src", [
    f("inner.rs — shape length checks", "sp1/slop/crates/tensor/src/inner.rs", "sp1-tensor-shape"),
  ]),
]);
