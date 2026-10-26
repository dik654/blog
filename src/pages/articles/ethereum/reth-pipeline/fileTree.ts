import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey?: string): FileNode => ({
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

export const rethPipelineTree: FileNode = directory("reth", [
  directory("crates/stages/api/src", [
    file("stage.rs", "reth/crates/stages/api/src/stage.rs", "next-block-range"),
    file("pipeline/mod.rs", "reth/crates/stages/api/src/pipeline/mod.rs", "execute-commit"),
  ]),
]);
