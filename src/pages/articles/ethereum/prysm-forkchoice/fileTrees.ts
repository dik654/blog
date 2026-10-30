import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("beacon-chain/forkchoice/doubly-linked-tree", [
    f("types.go — ForkChoice·Store", "forkchoice/doubly-linked-tree/types.go", "forkchoice-owners"),
    f("types.go — Node·Vote", "forkchoice/doubly-linked-tree/types.go", "forkchoice-node-vote"),
    f("forkchoice.go — ProcessAttestation", "forkchoice/doubly-linked-tree/forkchoice.go", "forkchoice-attestation"),
    f("forkchoice.go — updateBalances", "forkchoice/doubly-linked-tree/forkchoice.go", "forkchoice-balance"),
    f("store.go — proposer boost gate", "forkchoice/doubly-linked-tree/store.go", "forkchoice-boost-gate"),
    f("proposer_boost.go — score apply", "forkchoice/doubly-linked-tree/proposer_boost.go", "forkchoice-boost-score"),
    f("on_tick.go — NewSlot", "forkchoice/doubly-linked-tree/on_tick.go", "forkchoice-new-slot"),
    f("gloas.go — subtree weight", "forkchoice/doubly-linked-tree/gloas.go", "forkchoice-weight"),
    f("gloas.go — best descendant", "forkchoice/doubly-linked-tree/gloas.go", "forkchoice-best"),
    f("forkchoice.go — Head order", "forkchoice/doubly-linked-tree/forkchoice.go", "forkchoice-head-order"),
    f("store.go — head result", "forkchoice/doubly-linked-tree/store.go", "forkchoice-store-head"),
  ]),
]);
