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

export const prysmTree: FileNode = d("prysm", [
  d("beacon-chain", [
    d("sync", [
      d("checkpoint", [
        f(
          "api.go · checkpoint origin",
          "beacon-chain/sync/checkpoint/api.go",
          "checkpoint-origin",
        ),
      ]),
      d("initial-sync", [
        f(
          "round_robin.go · two phases",
          "beacon-chain/sync/initial-sync/round_robin.go",
          "two-phase-sync",
        ),
        f(
          "blocks_queue.go · range FSM",
          "beacon-chain/sync/initial-sync/blocks_queue.go",
          "queue-state-machine",
        ),
        f(
          "blocks_queue.go · ordered send",
          "beacon-chain/sync/initial-sync/blocks_queue.go",
          "ordered-range-send",
        ),
        f(
          "round_robin.go · receiver owner",
          "beacon-chain/sync/initial-sync/round_robin.go",
          "receiver-owner",
        ),
        f(
          "service.go · completion gate",
          "beacon-chain/sync/initial-sync/service.go",
          "initial-sync-handoff",
        ),
      ]),
      f(
        "validate_beacon_blocks.go · sync gate",
        "beacon-chain/sync/validate_beacon_blocks.go",
        "gossip-sync-gate",
      ),
    ]),
  ]),
]);
