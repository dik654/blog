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

export const seq2seqTree: FileNode = d("pytorch-tutorials", [
  d("intermediate_source", [
    f(
      "seq2seq_translation_tutorial.py",
      "pytorch-tutorials/intermediate_source/seq2seq_translation_tutorial.py",
      "encoder-handoff",
    ),
  ]),
]);
