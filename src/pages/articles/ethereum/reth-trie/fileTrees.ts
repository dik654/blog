import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTrieTree: FileNode = d('reth', [
  d('crates/trie/trie/src', [
    f('prefix_set.rs — PrefixSet', 'reth/crates/trie/trie/src/prefix_set.rs', 'prefix-set'),
    f('state_root.rs — StateRoot', 'reth/crates/trie/trie/src/state_root.rs', 'state-root'),
  ]),
]);
