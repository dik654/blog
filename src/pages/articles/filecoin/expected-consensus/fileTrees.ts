import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const ecTree: FileNode = d('lotus/chain/consensus/filcns', [
  f('filecoin.go', 'lotus/chain/consensus/filcns/filecoin.go', 'ec-validate'),
  f('weight.go', 'lotus/chain/consensus/filcns/weight.go', 'ec-weight'),
  f('mine.go', 'lotus/chain/consensus/filcns/mine.go', 'ec-create'),
]);
