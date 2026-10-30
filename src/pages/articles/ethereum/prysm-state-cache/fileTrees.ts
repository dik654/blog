import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm v7.3.1", [
  d("beacon-chain/state/stategen", [
    f("getter.go · lookup ladder", "beacon-chain/state/stategen/getter.go", "lookup-ladder"),
    f("getter.go · DB or replay", "beacon-chain/state/stategen/getter.go", "db-or-replay"),
    f("getter.go · summary and ancestor", "beacon-chain/state/stategen/getter.go", "summary-and-ancestor"),
    f("hot_state_cache.go", "beacon-chain/state/stategen/hot_state_cache.go", "hot-copy-boundary"),
    f("epoch_boundary_state_cache.go", "beacon-chain/state/stategen/epoch_boundary_state_cache.go", "epoch-cache"),
    f("replay.go", "beacon-chain/state/stategen/replay.go", "replay"),
    f("setter.go", "beacon-chain/state/stategen/setter.go", "save-boundary"),
  ]),
  d("beacon-chain/db/kv", [
    f("blocks.go · ancestry order", "beacon-chain/db/kv/blocks.go", "ancestry-order"),
  ]),
  d("beacon-chain/core/transition", [
    f("transition_no_verify_sig.go", "beacon-chain/core/transition/transition_no_verify_sig.go", "replay-trust"),
  ]),
]);
