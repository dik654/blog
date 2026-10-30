import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const commonwareTree: FileNode = d("commonware-v2026.9.0", [
  d("examples/bridge/src/bin", [
    f("validator wiring excerpt", "validator.rs", "bridge-wiring"),
  ]),
  d("examples/bridge/src/application", [
    f("propose excerpt", "actor.rs · Message::Propose", "bridge-propose"),
    f("verify·report excerpt", "actor.rs · Message::Verify·Report", "bridge-verify-report"),
  ]),
]);
