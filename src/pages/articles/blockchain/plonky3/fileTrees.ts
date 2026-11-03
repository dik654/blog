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

export const plonky3Tree: FileNode = directory("Plonky3@0d803737", [
  directory("uni-stark/tests", [
    file("fib_air.rs · AIR+trace", "Plonky3/uni-stark/tests/fib_air.rs", "p3-fib-air"),
    file("fib_air.rs · config", "Plonky3/uni-stark/tests/fib_air.rs", "p3-fib-config"),
    file("fib_air.rs · prove+verify", "Plonky3/uni-stark/tests/fib_air.rs", "p3-fib-success"),
    file("fib_air.rs · mismatch", "Plonky3/uni-stark/tests/fib_air.rs", "p3-public-mismatch"),
  ]),
  directory("uni-stark/src", [
    file("config.rs", "Plonky3/uni-stark/src/config.rs", "p3-generic-config"),
    file("prover.rs", "Plonky3/uni-stark/src/prover.rs", "p3-prove-pipeline"),
    file("proof.rs", "Plonky3/uni-stark/src/proof.rs", "p3-proof-shape"),
    file("verifier.rs · transcript", "Plonky3/uni-stark/src/verifier.rs", "p3-verify-transcript"),
    file("verifier.rs · AIR", "Plonky3/uni-stark/src/verifier.rs", "p3-verify-air"),
  ]),
]);
