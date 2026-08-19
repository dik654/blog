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

export const litellmTree: FileNode = d("litellm", [
  f("router.py — _pre_call_checks", "litellm/litellm/router.py", "pre-call-checks"),
  d("router_utils", [
    f(
      "get_retry_from_policy.py",
      "litellm/litellm/router_utils/get_retry_from_policy.py",
      "retry-policy",
    ),
  ]),
]);
