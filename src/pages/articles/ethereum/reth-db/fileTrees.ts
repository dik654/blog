import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethDbTree: FileNode = d('reth', [
  d('crates/storage/db/src', [
    f('tables/mod.rs — tables! 매크로', 'reth/crates/storage/db/src/tables/mod.rs', 'db-tables'),
  ]),
  d('crates/storage/db-api/src', [
    f('cursor.rs — DbCursorRO/RW', 'reth/crates/storage/db-api/src/cursor.rs', 'db-cursor'),
  ]),
  d('crates/storage/provider/src/providers', [
    f('static_file/mod.rs — StaticFileProvider', 'reth/crates/storage/provider/src/providers/static_file/mod.rs', 'db-static-file'),
  ]),
]);
