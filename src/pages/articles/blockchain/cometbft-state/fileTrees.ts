import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftStateTree: FileNode = d('cometbft', [
  d('state', [
    f('state.go — State struct', 'state/state.go', 'state-struct'),
    f('store.go — Store interface', 'state/store.go', 'state-store'),
  ]),
  d('store', [
    f('store.go — BlockStore struct', 'store/store.go', 'block-store'),
    f('store.go — SaveBlock()', 'store/store.go', 'block-save'),
  ]),
  d('evidence', [
    f('pool.go — Pool struct', 'evidence/pool.go', 'evidence-pool'),
    f('pool.go — AddEvidence()', 'evidence/pool.go', 'evidence-add'),
    f('pool.go — Update()', 'evidence/pool.go', 'evidence-update'),
  ]),
]);
