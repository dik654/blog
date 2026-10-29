import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({ name, type: "file", path, codeKey });
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const rethSyncV281Tree: FileNode = dir("reth-v2.8.1", [
  dir("engine/tree", [
    file("Head 누락과 경로 선택", "crates/engine/tree/src/tree/mod.rs", "engine-path"),
    file("Backfill 단독 writer", "crates/engine/tree/src/backfill.rs + tree/mod.rs", "backfill-control"),
  ]),
  dir("stages/api", [
    file("Pipeline 실행과 unwind", "crates/stages/api/src/pipeline/mod.rs", "pipeline"),
  ]),
]);
