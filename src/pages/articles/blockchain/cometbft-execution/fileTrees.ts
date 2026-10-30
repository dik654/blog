import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const directory = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const cometbftExecutionTree: FileNode = directory("cometbft · 0880b4d3", [
  directory("state", [
    file("validation.go · validateBlock", "state/validation.go", "validate-block"),
    file("execution.go · ApplyBlock", "state/execution.go", "apply-block"),
    file("execution.go · Commit", "state/execution.go", "commit-order"),
    file("execution.go · updateState", "state/execution.go", "update-state"),
  ]),
  directory("consensus", [
    file("replay.go · height decision", "consensus/replay.go", "replay-decision"),
  ]),
]);
