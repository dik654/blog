import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const cometbftStateTree: FileNode = d("cometbft @ 0880b4d3", [
  d("consensus", [
    f("state.go — block 원본 저장", "consensus/state.go", "persistence-order"),
    f("replay.go — height guards", "consensus/replay.go", "replay-guards"),
    f("replay.go — recovery decision", "consensus/replay.go", "replay-decision"),
  ]),
  d("state", [
    f("state.go — State snapshot", "state/state.go", "state-struct"),
    f("execution.go — persistence order", "state/execution.go", "persistence-order"),
    f("store.go — FinalizeBlock receipt", "state/store.go", "finalize-receipt"),
  ]),
  d("statesync", [f("syncer.go — snapshot verification", "statesync/syncer.go", "state-sync-verify")]),
]);
