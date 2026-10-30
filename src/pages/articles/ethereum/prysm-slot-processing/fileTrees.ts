import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm v7.3.1", [
  d("beacon-chain/core/transition", [
    f("transition.go — ProcessSlot", "beacon-chain/core/transition/transition.go", "process-slot"),
    f("transition.go — ProcessSlotsCore", "beacon-chain/core/transition/transition.go", "process-slots-core"),
    f("skip_slot_cache.go", "beacon-chain/core/transition/skip_slot_cache.go", "skip-slot-cache"),
    f("skip_slot_cache_test.go", "beacon-chain/core/transition/skip_slot_cache_test.go", "skip-slot-cache-test"),
  ]),
]);
