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

export const circomTree: FileNode = d("circom v2.2.3 · ad44e91", [
  f(
    "ast.rs:360–365",
    "program_structure/src/abstract_syntax_tree/ast.rs",
    "assign-op",
  ),
  f(
    "execute.rs:450–478",
    "constraint_generation/src/execute.rs",
    "assignment-branch",
  ),
  f(
    "execute.rs:650–658",
    "constraint_generation/src/execute.rs",
    "constraint-equality",
  ),
]);
