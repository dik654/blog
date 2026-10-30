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

export const commonwareP2PTree: FileNode = d("commonware v2026.9.0", [
  d("cryptography/src", [
    f("handshake.rs — Syn·SynAck·Ack", "cryptography/src/handshake.rs", "handshake-flow"),
  ]),
  d("stream/src", [
    f("encrypted.rs — bouncer·session", "stream/src/encrypted.rs", "encrypted-listener"),
  ]),
  d("p2p/src/authenticated", [
    f("channels.rs — register·Receiver", "p2p/src/authenticated/channels.rs", "channel-registration"),
    d("router", [
      f("ingress.rs · actor.rs", "p2p/src/authenticated/router", "delivery-path"),
    ]),
    d("lookup/actors/peer", [
      f("actor.rs — decode·inbox", "p2p/src/authenticated/lookup/actors/peer/actor.rs", "delivery-path"),
    ]),
  ]),
]);
