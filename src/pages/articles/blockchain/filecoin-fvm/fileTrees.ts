import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const fvmTree: FileNode = d('ref-fvm', [
  d('fvm/src', [
    f('fvm.rs — FVM 머신 + Actor 실행', 'fvm/src/fvm.rs', 'fvm-machine'),
  ]),
]);
