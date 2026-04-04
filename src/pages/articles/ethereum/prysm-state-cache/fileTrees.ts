import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/state/stategen', [
    f('getter.go — StateByRoot()', 'beacon-chain/state/stategen/getter.go', 'state-by-root'),
    f('getter.go — StateBySlot()', 'beacon-chain/state/stategen/getter.go', 'state-by-slot'),
    f('replay.go — ReplayBlocks()', 'beacon-chain/state/stategen/replay.go', 'replay-blocks'),
  ]),
]);
