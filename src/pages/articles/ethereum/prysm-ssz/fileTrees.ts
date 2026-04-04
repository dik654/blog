import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('encoding/ssz', [
    f('htrutils.go — PackByChunk()', 'encoding/ssz/htrutils.go', 'ssz-pack'),
    f('htrutils.go — BitwiseMerkleize()', 'encoding/ssz/htrutils.go', 'ssz-merkleize'),
    f('merkleize.go — HashTreeRoot()', 'encoding/ssz/merkleize.go', 'ssz-hash-tree-root'),
    f('merkleize.go — MixInLength()', 'encoding/ssz/merkleize.go', 'ssz-mix-in-length'),
  ]),
]);
