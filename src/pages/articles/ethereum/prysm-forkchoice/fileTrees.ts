import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/forkchoice/doubly-linked-tree', [
    f('store.go — ForkChoiceStore + InsertNode', 'forkchoice/doubly-linked-tree/store.go', 'fc-store'),
    f('store.go — InsertNode()', 'forkchoice/doubly-linked-tree/store.go', 'fc-insert'),
    f('forkchoice.go — ProcessAttestation()', 'forkchoice/doubly-linked-tree/forkchoice.go', 'fc-process-attest'),
    f('forkchoice.go — computeHead()', 'forkchoice/doubly-linked-tree/forkchoice.go', 'fc-head'),
  ]),
]);
