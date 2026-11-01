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

export const fvmTree: FileNode = d("ref-fvm", [
  d("fvm/src", [
    f(
      "executor/default.rs — message 적용·receipt·gas",
      "fvm/src/executor/default.rs",
      "fvm-machine",
    ),
    f(
      "executor/mod.rs — execute_message와 flush",
      "fvm/src/executor/mod.rs",
      "fvm-flush",
    ),
  ]),
]);
