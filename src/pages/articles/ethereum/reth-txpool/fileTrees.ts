import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTxpoolTree: FileNode = d('reth', [
  d('crates/transaction-pool/src', [
    f('pool.rs', 'reth/crates/transaction-pool/src/pool.rs', 'pool-add'),
    f('validate.rs', 'reth/crates/transaction-pool/src/validate.rs', 'tx-validator'),
    f('ordering.rs', 'reth/crates/transaction-pool/src/ordering.rs', 'tx-ordering'),
  ]),
]);
