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

export const commonwareBroadcastTree: FileNode = d("commonware v2026.9.0", [
  d("actor/src", [
    f("lib.rs — Feedback", "actor/src/lib.rs", "broadcast-contract"),
  ]),
  d("broadcast/src", [
    f("lib.rs — Broadcaster", "broadcast/src/lib.rs", "broadcast-contract"),
    d("buffered", [
      f("ingress.rs — Mailbox", "broadcast/src/buffered/ingress.rs", "buffered-ingress"),
      f("engine.rs — event loop", "broadcast/src/buffered/engine.rs", "buffered-engine"),
      f("engine.rs — cache", "broadcast/src/buffered/engine.rs", "buffered-cache"),
    ]),
  ]),
]);
