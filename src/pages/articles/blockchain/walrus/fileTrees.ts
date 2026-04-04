import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const walrusTree: FileNode = d('walrus-core/src', [
  f('bft.rs', 'walrus-core/src/bft.rs', 'walrus-bft'),
  d('encoding', [
    f('blob_encoding.rs', 'walrus-core/src/encoding/blob_encoding.rs', 'walrus-blob-encoding'),
    f('config.rs', 'walrus-core/src/encoding/config.rs', 'walrus-config'),
    f('slivers.rs', 'walrus-core/src/encoding/slivers.rs', 'walrus-slivers'),
  ]),
]);
