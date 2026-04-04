import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethRpcTree: FileNode = d('reth', [
  d('crates/rpc/rpc/src/eth/api', [
    f('server.rs — EthApiServer trait', 'reth/crates/rpc/rpc/src/eth/api/server.rs', 'rpc-eth-api'),
  ]),
  d('crates/rpc/rpc-engine-api/src', [
    f('engine_api.rs — EngineApi', 'reth/crates/rpc/rpc-engine-api/src/engine_api.rs', 'rpc-engine-api'),
  ]),
]);
