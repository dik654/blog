import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const stateTree: FileNode = d('lotus', [
  d('chain/state', [f('statetree.go', 'lotus/chain/state/statetree.go', 'state-tree')]),
]);

export const hamtTree: FileNode = d('go-hamt-ipld', [
  f('hamt.go', 'go-hamt-ipld/hamt.go', 'hamt-find'),
]);
