import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm v7.3.1", [
  d("beacon-chain/core", [
    d("transition", [
      f("transition.go — fork dispatch", "beacon-chain/core/transition/transition.go", "process-epoch-dispatch"),
    ]),
    d("fulu", [
      f("transition.go — Fulu + lookahead", "beacon-chain/core/fulu/transition.go", "process-epoch-fulu"),
    ]),
    d("electra", [
      f("transition.go — ordered pipeline", "beacon-chain/core/electra/transition.go", "process-epoch-electra"),
      f("deposits.go — pending queue", "beacon-chain/core/electra/deposits.go", "process-pending-deposits"),
    ]),
    d("epoch/precompute", [
      f("justification_finalization.go", "beacon-chain/core/epoch/precompute/justification_finalization.go", "process-justification"),
    ]),
    d("altair", [
      f("epoch_precompute.go — rewards", "beacon-chain/core/altair/epoch_precompute.go", "process-rewards"),
      f("epoch_spec.go — participation rotation", "beacon-chain/core/altair/epoch_spec.go", "process-participation-rotation"),
    ]),
  ]),
]);
