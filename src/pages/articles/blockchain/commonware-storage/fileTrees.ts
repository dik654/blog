import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const commonwareStorageTree: FileNode = d('storage/src', [
  f('lib.rs', 'storage/src/lib.rs', 'persistable-trait'),
  d('merkle/mmr', [
    f('mod.rs', 'storage/src/merkle/mmr/mod.rs', 'mmr-family'),
    f('batch.rs', 'storage/src/merkle/mmr/batch.rs', 'mmr-batch'),
    f('proof.rs', 'storage/src/merkle/mmr/proof.rs', 'mmr-proof'),
    f('mem.rs', 'storage/src/merkle/mmr/mem.rs'),
    f('journaled.rs', 'storage/src/merkle/mmr/journaled.rs'),
  ]),
  d('qmdb', [
    f('mod.rs', 'storage/src/qmdb/mod.rs'),
    d('any', [
      f('db.rs', 'storage/src/qmdb/any/db.rs', 'any-db'),
      f('traits.rs', 'storage/src/qmdb/any/traits.rs'),
      f('batch.rs', 'storage/src/qmdb/any/batch.rs'),
    ]),
    d('current', [
      f('db.rs', 'storage/src/qmdb/current/db.rs', 'current-db'),
      f('grafting.rs', 'storage/src/qmdb/current/grafting.rs', 'grafting'),
      f('proof.rs', 'storage/src/qmdb/current/proof.rs', 'current-proof'),
    ]),
  ]),
]);
