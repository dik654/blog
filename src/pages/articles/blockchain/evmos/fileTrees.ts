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

export const evmosSources: FileNode = d("Evmos · v20.0.0 · eca13ef2", [
  d("rpc/backend", [
    f("call_tx.go", "evmos/rpc/backend/call_tx.go", "rpc-broadcast"),
  ]),
  d("app/ante", [
    f("ante.go", "evmos/app/ante/ante.go", "ante-route"),
    d("evm", [
      f("mono.go", "evmos/app/ante/evm/mono.go", "ante-fee-nonce"),
    ]),
  ]),
  d("x/evm", [
    d("keeper", [
      f("state_transition.go", "evmos/x/evm/keeper/state_transition.go", "apply-transaction"),
    ]),
    d("statedb", [
      f("statedb.go", "evmos/x/evm/statedb/statedb.go", "statedb-commit"),
    ]),
  ]),
  d("x/erc20", [
    f("ibc_middleware.go", "evmos/x/erc20/ibc_middleware.go", "ibc-callback"),
  ]),
]);
