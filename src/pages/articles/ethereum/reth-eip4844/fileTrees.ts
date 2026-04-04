import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethEip4844Tree: FileNode = d('reth', [
  d('crates/primitives-traits/src', [
    f('eip4844.rs', 'reth/crates/primitives-traits/src/eip4844.rs', 'blob-gas'),
  ]),
  d('crates/transaction-pool/src', [
    d('blobstore', [
      f('mod.rs', 'reth/crates/transaction-pool/src/blobstore/mod.rs', 'blobstore-trait'),
      f('blob.rs', 'reth/crates/transaction-pool/src/blobstore/blob.rs', 'blob-validate'),
      f('disk.rs', 'reth/crates/transaction-pool/src/blobstore/disk.rs', 'disk-blobstore'),
      f('disk_inner.rs', 'reth/crates/transaction-pool/src/blobstore/disk_inner.rs', 'disk-inner-ops'),
      f('mem.rs', 'reth/crates/transaction-pool/src/blobstore/mem.rs', 'mem-blobstore'),
      f('tracker.rs', 'reth/crates/transaction-pool/src/blobstore/tracker.rs', 'canon-tracker'),
    ]),
    d('validate', [
      f('eth.rs', 'reth/crates/transaction-pool/src/validate/eth.rs', 'tx-validate-stateless'),
    ]),
  ]),
  d('crates/consensus/common/src', [
    f('validation.rs', 'reth/crates/consensus/common/src/validation.rs', 'header-blob-gas'),
  ]),
]);
