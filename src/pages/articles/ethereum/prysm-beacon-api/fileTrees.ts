import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/rpc', [
    f('service.go — Start()', 'beacon-chain/rpc/service.go', 'rpc-start'),
    f('service.go — registerServices()', 'beacon-chain/rpc/service.go', 'register-services'),
    d('eth/beacon', [
      f('handlers.go — GetBlockV2()', 'rpc/eth/beacon/handlers.go', 'get-block-v2'),
      f('handlers.go — GetStateV2()', 'rpc/eth/beacon/handlers.go', 'get-state-v2'),
    ]),
  ]),
]);
