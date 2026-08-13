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

export const rethSyncTree: FileNode = d("reth", [
  d("crates/stages/stages/src", [
    f(
      "pipeline.rs — Pipeline",
      "reth/crates/stages/stages/src/stages/mod.rs",
      "sync-pipeline",
    ),
  ]),
  d("crates/exex/exex/src", [
    f(
      "notification.rs — ExExNotification",
      "reth/crates/exex/exex/src/notification.rs",
      "sync-exex",
    ),
  ]),
]);
