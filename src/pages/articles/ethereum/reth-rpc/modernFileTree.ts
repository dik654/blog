import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const dir = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const rethRpcV281Tree: FileNode = dir("reth-v2.8.1", [
  dir("crates/rpc/rpc-builder/src", [
    file("config.rs · 공개/인증 server 분리", "reth-v2.8.1/crates/rpc/rpc-builder/src/config.rs", "rpc-config"),
    file("auth.rs · JWT before dispatch", "reth-v2.8.1/crates/rpc/rpc-builder/src/auth.rs", "auth-server"),
  ]),
  dir("crates/rpc/rpc-eth-api/src", [
    file("core.rs · eth_getBalance handler", "reth-v2.8.1/crates/rpc/rpc-eth-api/src/core.rs", "eth-balance"),
    file("helpers/state.rs · state view 선택", "reth-v2.8.1/crates/rpc/rpc-eth-api/src/helpers/state.rs", "state-view"),
  ]),
  dir("crates/rpc/rpc-engine-api/src", [
    file("engine_api.rs · newPayloadV4", "reth-v2.8.1/crates/rpc/rpc-engine-api/src/engine_api.rs", "engine-new-payload"),
  ]),
]);
