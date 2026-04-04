import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/db/kv', [
    f('kv.go — NewKVStore()', 'beacon-chain/db/kv/kv.go', 'kv-store'),
    f('blocks.go — SaveBlock()', 'beacon-chain/db/kv/blocks.go', 'save-block'),
    f('blocks.go — Block()', 'beacon-chain/db/kv/blocks.go', 'get-block'),
    f('state.go — SaveState()', 'beacon-chain/db/kv/state.go', 'save-state'),
  ]),
]);
