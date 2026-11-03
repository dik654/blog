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

export const prysmTree: FileNode = d("prysm", [
  d("beacon-chain/p2p", [
    f(
      "discovery.go — filterPeer()",
      "beacon-chain/p2p/discovery.go",
      "discovery-filter",
    ),
    f(
      "service.go — connectWithPeer()",
      "beacon-chain/p2p/service.go",
      "connect-peer",
    ),
    f(
      "handshake.go — AddConnectionHandler()",
      "beacon-chain/p2p/handshake.go",
      "connection-handler",
    ),
    d("peers/scorers", [
      f(
        "service.go — weights",
        "beacon-chain/p2p/peers/scorers/service.go",
        "score-weights",
      ),
      f(
        "service.go — ScoreNoLock()",
        "beacon-chain/p2p/peers/scorers/service.go",
        "peer-score",
      ),
      f(
        "bad_responses.go — Decay()",
        "beacon-chain/p2p/peers/scorers/bad_responses.go",
        "score-decay",
      ),
    ]),
  ]),
  d("beacon-chain/sync", [
    f(
      "rpc_status.go — validateStatusMessage()",
      "beacon-chain/sync/rpc_status.go",
      "status-validation",
    ),
  ]),
]);
