import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const dir = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const rethExExV281Tree: FileNode = dir("reth-v2.8.1", [
  dir("crates/exex/types/src", [
    file("notification.rs · commit/reorg/revert", "reth-v2.8.1/crates/exex/types/src/notification.rs", "exex-notification"),
  ]),
  dir("crates/exex/exex/src", [
    file("context.rs + manager.rs · 전달 경계", "reth-v2.8.1/crates/exex/exex/src/context.rs + manager.rs", "manager-delivery"),
    file("event.rs + manager.rs · 완료와 WAL", "reth-v2.8.1/crates/exex/exex/src/event.rs + manager.rs", "finished-height"),
    file("notifications.rs · 재시작과 backfill", "reth-v2.8.1/crates/exex/exex/src/notifications.rs", "restart-catchup"),
  ]),
]);
