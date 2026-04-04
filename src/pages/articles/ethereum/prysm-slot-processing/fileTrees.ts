import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/core/transition', [
    f('transition.go — ProcessSlots()', 'beacon-chain/core/transition/transition.go', 'process-slots'),
    f('transition.go — ProcessSlot()', 'beacon-chain/core/transition/transition.go', 'process-slot'),
  ]),
]);
