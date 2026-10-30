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

export const cometbftTree: FileNode = d("cometbft", [
  d("v0.40.0 전체 경로", [
    f(
      "mempool/clist_mempool.go — CheckTx()",
      "cometbft/mempool/clist_mempool.go — CheckTx()",
      "cometbft-checktx-v040",
    ),
    f(
      "consensus/state.go — enterCommit()",
      "cometbft/consensus/state.go — enterCommit()",
      "cometbft-entercommit-v040",
    ),
    f(
      "state/execution.go — applyBlock()",
      "cometbft/state/execution.go — applyBlock()",
      "cometbft-applycommit-v040",
    ),
  ]),
  d("consensus", [
    f(
      "state.go — enterPropose()",
      "cometbft/consensus/state.go — enterPropose()",
      "enter-propose",
    ),
    f(
      "state.go — enterPrevote()",
      "cometbft/consensus/state.go — enterPrevote()",
      "enter-prevote",
    ),
    f(
      "state.go — enterPrecommit()",
      "cometbft/consensus/state.go — enterPrecommit()",
      "enter-precommit",
    ),
    f(
      "state.go — finalizeCommit()",
      "cometbft/consensus/state.go — finalizeCommit()",
      "finalize-commit",
    ),
    f(
      "state.go — receiveRoutine()",
      "cometbft/consensus/state.go — receiveRoutine()",
      "receive-routine",
    ),
    f(
      "state.go — handleMsg()",
      "cometbft/consensus/state.go — handleMsg()",
      "handle-msg",
    ),
  ]),
  d("p2p", [
    f(
      "reactor.go — gossipRoutine()",
      "cometbft/consensus/reactor.go — gossipDataRoutine()",
      "gossip-data",
    ),
  ]),
  d("internal", [
    f(
      "state.go — runLoop()",
      "cometbft/consensus/state.go — 메인 루프",
      "main-loop",
    ),
  ]),
]);
