import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({ name, type: "file", path, codeKey });
const dir = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const rethNetworkV281Tree: FileNode = dir("reth-v2.8.1", [
  dir("network/session", [
    file("Identity와 세션 승격", "crates/net/network/src/session/mod.rs", "session-auth"),
    file("Version 협상 통합 테스트", "crates/net/network/tests/it/session.rs", "session-test"),
  ]),
  dir("eth-wire", [
    file("Capability 교집합", "crates/net/eth-wire/src/capability.rs", "capability"),
    file("ETH Status handshake", "crates/net/eth-wire/src/handshake.rs", "status"),
  ]),
]);
