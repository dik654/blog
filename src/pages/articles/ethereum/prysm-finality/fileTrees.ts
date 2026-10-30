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

export const prysmTree: FileNode = d("prysm v7.3.1 · 96d418cd", [
  d("beacon-chain/core/epoch/precompute", [
    f("justification_finalization.go — bits", "core/epoch/precompute/justification_finalization.go", "finality-bits"),
    f("justification_finalization.go — checkpoints", "core/epoch/precompute/justification_finalization.go", "finality-checkpoints"),
    f("justification_finalization.go — state write", "core/epoch/precompute/justification_finalization.go", "finality-state-write"),
  ]),
  d("beacon-chain/forkchoice/doubly-linked-tree", [
    f("forkchoice.go + store.go — finalized prune", "forkchoice/doubly-linked-tree/finality", "forkchoice-finality-prune"),
  ]),
  d("beacon-chain/blockchain", [
    f("weak_subjectivity_checks.go — verifier", "blockchain/weak_subjectivity_checks.go", "weak-subjectivity-verifier"),
  ]),
]);
