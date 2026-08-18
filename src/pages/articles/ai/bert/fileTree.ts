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

export const bertTree: FileNode = d("transformers", [
  f("masking_utils.py", "transformers/masking_utils.py", "padding-mask-rule"),
  d("models/bert", [
    f(
      "modeling_bert.py",
      "transformers/models/bert/modeling_bert.py",
      "visible-key-attention",
    ),
  ]),
]);
