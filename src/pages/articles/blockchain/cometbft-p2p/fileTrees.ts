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

export const cometbftP2PTree: FileNode = d("cometbft @ 0880b4d3", [
  d("p2p", [
    d("conn", [
      f("connection.go — queue · scheduler · framing", "p2p/conn/connection.go", "send-queue"),
    ]),
    f("transport.go — SecretConnection · NodeInfo handshake", "p2p/transport.go", "transport-handshake"),
    f("switch.go — channel owner · peer lifecycle", "p2p/switch.go", "channel-owner"),
    f("peer.go — Envelope marshal · Reactor dispatch", "p2p/peer.go", "receive-dispatch"),
    f("base_reactor.go — Reactor interface", "p2p/base_reactor.go", "channel-owner"),
  ]),
  d("mempool", [
    f("reactor.go — channel 0x30 · Receive · CheckTx", "mempool/reactor.go", "mempool-receive"),
  ]),
]);
