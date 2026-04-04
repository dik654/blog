import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethEip1559Tree: FileNode = d('reth', [
  d('crates/primitives-traits/src', [
    f('eip1559.rs', 'reth/crates/primitives-traits/src/eip1559.rs', 'calc-base-fee'),
    f('tx.rs', 'reth/crates/primitives-traits/src/tx.rs', 'effective-tip'),
  ]),
]);
