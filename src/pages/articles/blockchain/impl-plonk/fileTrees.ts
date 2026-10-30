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

export const plonkTree: FileNode = d("dusk-network · plonk · v0.22.1 · b83aba4", [
  f("이 글의 MulCircuit fixture", "examples/mul_trace.rs", "plonk-mul-fixture"),
  d("src", [
    f("compiler.rs — compile·preprocess", "src/compiler.rs", "dusk-plonk-compiler"),
    d("compiler", [
      f("prover.rs — V3 prove_inner", "src/compiler/prover.rs", "dusk-plonk-prover"),
      f("verifier.rs — public API", "src/compiler/verifier.rs"),
    ]),
    d("proof_system", [
      f("proof.rs — Proof·V3 verify", "src/proof_system/proof.rs", "dusk-plonk-proof"),
      f("quotient_poly.rs", "src/proof_system/quotient_poly.rs"),
      f("linearization_poly.rs", "src/proof_system/linearization_poly.rs"),
    ]),
    f("composer.rs — circuit rows", "src/composer.rs"),
    f("transcript.rs — Fiat–Shamir labels", "src/transcript.rs"),
  ]),
]);
