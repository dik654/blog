import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const lotusTree: FileNode = d('lotus/chain', [
  d('consensus/filcns', [
    f('filecoin.go', 'lotus/chain/consensus/filcns/filecoin.go', 'lotus-filecoin-ec'),
    f('weight.go', 'lotus/chain/consensus/filcns/weight.go', 'lotus-weight'),
    f('mine.go', 'lotus/chain/consensus/filcns/mine.go', 'lotus-mine'),
  ]),
  d('store', [
    f('store.go', 'lotus/chain/store/store.go', 'lotus-chainstore'),
  ]),
  d('stmgr', [
    f('stmgr.go', 'lotus/chain/stmgr/stmgr.go', 'lotus-statemgr'),
  ]),
]);
