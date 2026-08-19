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

export const nagTree: FileNode = d("nag", [
  d("nag", [
    f(
      "attention_nag.py — NAGAttnProcessor2_0",
      "nag/nag/attention_nag.py",
      "nag-guidance-branch",
    ),
  ]),
]);
