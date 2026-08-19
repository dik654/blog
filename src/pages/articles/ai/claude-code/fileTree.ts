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

export const claudeCodeTree: FileNode = d("claude-code", [
  d("examples/hooks", [
    f(
      "bash_command_validator_example.py",
      "claude-code/examples/hooks/bash_command_validator_example.py",
      "bash-validator-hook",
    ),
  ]),
  d("plugins/hookify/hooks", [
    f(
      "pretooluse.py",
      "claude-code/plugins/hookify/hooks/pretooluse.py",
      "hookify-pretooluse",
    ),
  ]),
]);
