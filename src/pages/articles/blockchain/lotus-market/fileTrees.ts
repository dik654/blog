import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const marketTree: FileNode = d('lotus/markets', [
  d('storageadapter', [f('provider.go', 'lotus/markets/storageadapter/provider.go', 'storage-deal')]),
  d('retrievaladapter', [f('provider.go', 'lotus/markets/retrievaladapter/provider.go', 'retrieval')]),
]);
