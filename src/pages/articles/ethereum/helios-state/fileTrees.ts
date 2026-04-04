import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const heliosTree: FileNode = d('helios', [
  d('execution', [
    d('src', [
      f('proof.rs', 'helios/execution/src/proof.rs', 'hl-account-proof'),
    ]),
  ]),
]);
