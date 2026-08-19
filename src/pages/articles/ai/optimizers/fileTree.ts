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

export const transformersTree: FileNode = d("transformers", [
  d("src/transformers/loss", [
    f(
      "loss_utils.py — fixed_cross_entropy",
      "transformers/src/transformers/loss/loss_utils.py",
      "ga-fixed-cross-entropy",
    ),
  ]),
  d("src/transformers", [
    f(
      "trainer.py — get_batch_samples",
      "transformers/src/transformers/trainer.py",
      "ga-num-items-in-batch",
    ),
  ]),
]);
