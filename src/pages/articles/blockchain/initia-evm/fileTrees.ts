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

export const minievm: FileNode = d("minievm · v1.2.19", [
  d("jsonrpc/backend", [
    f("tx.go", "minievm/jsonrpc/backend/tx.go", "rpc-ingress"),
  ]),
  d("app/ante", [
    f("sequence.go", "minievm/app/ante/sequence.go", "ante-sequence"),
  ]),
  d("dependency · initia-cosmos-sdk", [
    f(
      "baseapp/baseapp.go",
      "initia-cosmos-sdk/baseapp/baseapp.go",
      "baseapp-ante-commit",
    ),
  ]),
  d("x/evm", [
    d("types", [
      f("txutils.go", "minievm/x/evm/types/txutils.go", "ethereum-envelope"),
    ]),
    d("keeper", [
      f(
        "msg_server.go",
        "minievm/x/evm/keeper/msg_server.go",
        "sequence-reconcile",
      ),
      f("context.go", "minievm/x/evm/keeper/context.go", "evm-call"),
      f("context.go · dispatch", "minievm/x/evm/keeper/context.go", "dispatch-message"),
    ]),
    d("state", [
      f("snapshot.go", "minievm/x/evm/state/snapshot.go", "state-snapshot"),
    ]),
    d("precompiles/cosmos", [
      f(
        "contract.go",
        "minievm/x/evm/precompiles/cosmos/contract.go",
        "precompile-queue",
      ),
    ]),
  ]),
]);
