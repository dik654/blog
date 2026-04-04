import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/forkchoice/doubly-linked-tree', [
    f('store.go — UpdateJustifiedCheckpoint()', 'forkchoice/store.go', 'update-justified'),
    f('store.go — Prune()', 'forkchoice/store.go', 'prune-finalized'),
  ]),
  d('beacon-chain/core/epoch', [
    f('epoch_processing.go — ProcessJustificationAndFinalization()', 'core/epoch/epoch_processing.go', 'weak-subjectivity'),
  ]),
]);
