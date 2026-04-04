import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/sync', [
    d('initial-sync', [
      f('round_robin.go — roundRobinSync()', 'beacon-chain/sync/initial-sync/round_robin.go', 'round-robin-sync'),
    ]),
    f('rpc_beacon_blocks_by_range.go', 'beacon-chain/sync/rpc_beacon_blocks_by_range.go', 'blocks-by-range-handler'),
  ]),
]);
