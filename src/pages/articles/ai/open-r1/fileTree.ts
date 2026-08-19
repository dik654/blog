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

export const openR1Tree: FileNode = d("open-r1", [
  d("src/open_r1", [
    f(
      "rewards.py — accuracy · format · get_reward_funcs",
      "open-r1/src/open_r1/rewards.py",
      "open-r1-rewards",
    ),
  ]),
]);

export const trlTree: FileNode = d("trl", [
  d("trl/trainer", [
    f(
      "grpo_trainer.py — advantage · clipped loss",
      "trl/trl/trainer/grpo_trainer.py",
      "grpo-advantage",
    ),
  ]),
]);
