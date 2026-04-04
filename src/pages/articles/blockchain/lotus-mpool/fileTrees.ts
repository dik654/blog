import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const mpoolTree: FileNode = d('lotus/chain', [
  d('messagepool', [f('messagepool.go', 'lotus/chain/messagepool/messagepool.go', 'mpool-add')]),
]);
