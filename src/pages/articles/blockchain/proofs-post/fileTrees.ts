import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const postTree: FileNode = d('rust-fil-proofs', [
  d('filecoin-proofs/src/api', [
    f('post.rs — WindowPoSt & WinningPoSt', 'filecoin-proofs/src/api/post.rs', 'post-main'),
  ]),
]);
