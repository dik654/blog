import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const heliosTree: FileNode = d('helios', [
  d('consensus', [
    d('src', [
      f('update.rs', 'helios/consensus/src/update.rs', 'hl-validate'),
    ]),
  ]),
]);
