import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("Prysm v7.3.1 · Beacon APIs v4.0.0", [
  d("beacon-chain/rpc", [
    f("service.go · transport registration", "beacon-chain/rpc/service.go", "service-wiring"),
    f("endpoints.go · route and metrics", "beacon-chain/rpc/endpoints.go", "rest-route"),
    d("eth/beacon", [
      f("handlers_state.go · GetStateRoot", "beacon-chain/rpc/eth/beacon/handlers_state.go", "state-root-handler"),
    ]),
    d("lookup", [
      f("stater.go · State and StateRoot", "beacon-chain/rpc/lookup/stater.go", "state-id-resolution"),
    ]),
    d("eth/helpers", [
      f("sync.go + block_root.go", "beacon-chain/rpc/eth/helpers", "metadata"),
    ]),
    d("eth/shared", [
      f("errors.go", "beacon-chain/rpc/eth/shared/errors.go", "error-mapping"),
    ]),
  ]),
  d("beacon-APIs v4.0.0", [
    f("states/root.yaml", "apis/beacon/states/root.yaml", "openapi-contract"),
  ]),
]);
