import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm v7.3.1", [
  d("beacon-chain/db/kv", [
    f("kv.go · Store와 buckets", "beacon-chain/db/kv/kv.go", "kv-store"),
    f("blocks.go · prepareBlockBatch", "beacon-chain/db/kv/blocks.go", "prepare-block-batch"),
    f("blocks.go · SaveROBlocks", "beacon-chain/db/kv/blocks.go", "save-block-batch"),
    f("blocks.go · BlockRootsBySlot", "beacon-chain/db/kv/blocks.go", "read-block-roots-by-slot"),
    f("state.go · SaveStates", "beacon-chain/db/kv/state.go", "save-states"),
    f("checkpoint.go · SaveFinalizedCheckpoint", "beacon-chain/db/kv/checkpoint.go", "save-finalized-checkpoint"),
    f("blocks.go · DeleteHistoricalDataBeforeSlot", "beacon-chain/db/kv/blocks.go", "delete-history"),
  ]),
]);
