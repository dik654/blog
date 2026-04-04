import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const chainTree: FileNode = d('lotus/chain', [
  d('sync', [f('sync.go', 'lotus/chain/sync/sync.go', 'chain-sync')]),
  d('stmgr', [f('stmgr.go', 'lotus/chain/stmgr/stmgr.go', 'state-apply')]),
]);
