import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const novaTree: FileNode = d('nova/src', [
  d('nova', [
    f('mod.rs', 'nova/src/nova/mod.rs', 'nova-prove-step'),
    f('nifs.rs', 'nova/src/nova/nifs.rs', 'nova-nifs-prove'),
  ]),
  d('r1cs', [
    f('mod.rs', 'nova/src/r1cs/mod.rs', 'nova-r1cs'),
  ]),
  d('spartan', [
    f('mod.rs', 'nova/src/spartan/mod.rs', 'nova-spartan'),
  ]),
]);
