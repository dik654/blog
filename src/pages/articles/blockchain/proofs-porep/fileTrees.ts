import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const porepTree: FileNode = d('rust-fil-proofs', [
  d('filecoin-proofs/src/api', [
    f('seal.rs — PC1/PC2/C2 봉인 API', 'filecoin-proofs/src/api/seal.rs', 'seal-porep'),
  ]),
]);
