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

export const gemminiPeMacDataflowTree: FileNode = d("gemmini", [
  d("src/main/scala/gemmini", [
    f("PE.scala", "gemmini/PE.scala", "mac-unit"),
  ]),
]);
