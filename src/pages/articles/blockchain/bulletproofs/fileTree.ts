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

export const bulletproofsTree: FileNode = d("bulletproofs @ be67b6d", [
  f("generators.rs:29–53", "src/generators.rs", "pedersen-gens"),
  f(
    "inner_product_proof.rs:18–24",
    "src/inner_product_proof.rs",
    "ipa-struct",
  ),
  f(
    "inner_product_proof.rs:75–141",
    "src/inner_product_proof.rs",
    "ipa-first-round",
  ),
]);
