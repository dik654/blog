import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("beacon-chain/execution", [
    f("newPayload excerpt", "execution/engine_jsonrpc.go", "engine-new-payload"),
    f("forkchoiceUpdated excerpt", "execution/engine_jsonrpc.go", "engine-forkchoice"),
    f("getPayload excerpt", "execution/engine_jsonrpc.go", "engine-get-payload"),
  ]),
  d("beacon-chain/blockchain", [
    f("status·pruning excerpts", "blockchain/execution_engine.go", "execution-status"),
  ]),
  d("beacon-chain/rpc/prysm/v1alpha1/validator", [
    f("proposal build excerpts", "validator/proposer_execution_payload.go", "proposal-build"),
  ]),
]);
