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

export const zkHashTree: FileNode = d("arkworks · crypto-primitives · 7816710", [
  d("crypto-primitives/src/merkle_tree", [
    f("mod.rs — Config", "merkle_tree/mod.rs", "ark-merkle-config"),
    f("mod.rs — Path::verify", "merkle_tree/mod.rs", "ark-merkle-verify"),
    f("mod.rs — child order", "merkle_tree/mod.rs", "ark-merkle-order"),
  ]),
  d("crypto-primitives/src/sponge/poseidon", [
    f("mod.rs — permutation", "sponge/poseidon/mod.rs", "ark-poseidon-permute"),
  ]),
]);
