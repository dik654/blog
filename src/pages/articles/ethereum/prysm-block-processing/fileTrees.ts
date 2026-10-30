import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("beacon-chain/blockchain", [
    f("receive_block.go · 병렬 검증", "beacon-chain/blockchain/receive_block.go", "parallel-validation"),
    f("execution_engine.go · Engine status", "beacon-chain/blockchain/execution_engine.go", "engine-status"),
    f("process_block.go · 후보 등록", "beacon-chain/blockchain/process_block.go", "candidate-admission"),
  ]),
  d("beacon-chain/core/transition", [
    f("transition_no_verify_sig.go · root", "beacon-chain/core/transition/transition_no_verify_sig.go", "transition-root"),
    f("transition_no_verify_sig.go · handlers", "beacon-chain/core/transition/transition_no_verify_sig.go", "ordered-handlers"),
    f("electra.go · operations", "beacon-chain/core/transition/electra.go", "electra-operations"),
  ]),
  d("beacon-chain/execution", [
    f("engine_jsonrpc.go · method/status", "beacon-chain/execution/engine_jsonrpc.go", "engine-method-status"),
  ]),
]);
