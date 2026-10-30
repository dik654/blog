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

export const groth16Tree: FileNode = d("arkworks · groth16 · 8f0904a", [
  d("groth16/tests", [
    f("mimc.rs — circuit", "tests/mimc.rs", "ark-groth16-circuit"),
  ]),
  d("groth16/src", [
    f("prover.rs", "src/prover.rs", "ark-groth16-prover"),
    f("data_structures.rs", "src/data_structures.rs", "ark-groth16-proof"),
    f("verifier.rs", "src/verifier.rs", "ark-groth16-verifier"),
  ]),
]);
