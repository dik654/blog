import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const f3Tree: FileNode = d('go-f3', [
  f('f3.go', 'go-f3/f3.go', 'f3-run'),
  f('gpbft.go', 'go-f3/gpbft.go', 'gpbft-run'),
]);
