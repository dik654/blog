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

export const cometbftMempoolTree: FileNode = d("cometbft @ 0880b4d3", [
  d("mempool", [
    f("clist_mempool.go — CheckTx gates", "mempool/clist_mempool.go", "checktx-gates"),
    f("clist_mempool.go — callback admission", "mempool/clist_mempool.go", "callback-admission"),
    f("clist_mempool.go — reap · signal", "mempool/clist_mempool.go", "reap-signal"),
    f("clist_mempool.go — Update · recheck", "mempool/clist_mempool.go", "update-recheck"),
  ]),
  d("state", [
    f("execution.go — Commit · async Update", "state/execution.go", "commit-update"),
  ]),
]);
