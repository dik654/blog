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

export const cometbftConsensusTree: FileNode = d("cometbft", [
  d("consensus", [
    f("state.go — queue owner · receiveRoutine", "consensus/state.go @ 0880b4d3", "receive-routine"),
    f("state.go — stale timeout · handleTimeout", "consensus/state.go @ 0880b4d3", "handle-timeout"),
    f("state.go — round · proposer 교체", "consensus/state.go @ 0880b4d3", "enter-new-round"),
    f("state.go — block 또는 nil prevote", "consensus/state.go @ 0880b4d3", "enter-prevote"),
    f("state.go — POL · lock · precommit", "consensus/state.go @ 0880b4d3", "enter-precommit"),
    f("state.go — commit · block parts", "consensus/state.go @ 0880b4d3", "enter-commit"),
    f("state.go — vote power와 state transition", "consensus/state.go @ 0880b4d3", "add-vote"),
    f("state.go — conflicting vote evidence", "consensus/state.go @ 0880b4d3", "try-add-vote"),
  ]),
]);
