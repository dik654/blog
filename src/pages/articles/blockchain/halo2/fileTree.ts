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

export const halo2Tree: FileNode = d("zcash/halo2 @ 3442dd3", [
  d("halo2_proofs", [
    d("examples", [
      f("simple-example.rs:76–117", "halo2_proofs/examples/simple-example.rs", "simple-gate"),
      f("simple-example.rs:185–230", "halo2_proofs/examples/simple-example.rs", "simple-mul-expose"),
      f("simple-example.rs:305–337", "halo2_proofs/examples/simple-example.rs", "simple-mock"),
    ]),
    d("src/plonk", [
      f("prover.rs:30–59", "halo2_proofs/src/plonk/prover.rs", "create-proof"),
      f("verifier.rs:69–88", "halo2_proofs/src/plonk/verifier.rs", "verify-proof"),
    ]),
  ]),
]);
