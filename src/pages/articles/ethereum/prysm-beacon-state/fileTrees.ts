import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/state/state-native', [
    f('beacon_state.go — BeaconState', 'beacon-chain/state/state-native/beacon_state.go', 'beacon-state-struct'),
    f('beacon_state.go — NewBeaconState()', 'beacon-chain/state/state-native/beacon_state.go', 'state-copy'),
    f('hasher.go — HashTreeRoot()', 'beacon-chain/state/state-native/hasher.go', 'hash-tree-root'),
    f('hasher.go — recomputeFieldTrie()', 'beacon-chain/state/state-native/hasher.go', 'field-trie-recompute'),
  ]),
]);
