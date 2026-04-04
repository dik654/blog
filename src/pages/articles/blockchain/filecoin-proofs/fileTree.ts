import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const filProofsTree: FileNode = d('rust-fil-proofs', [
  d('filecoin-proofs/src/api', [
    f('seal.rs', 'filecoin-proofs/src/api/seal.rs', 'seal-pc1'),
    f('window_post.rs', 'filecoin-proofs/src/api/window_post.rs', 'window-post'),
  ]),
  d('storage-proofs-porep/src/stacked/vanilla', [
    f('graph.rs', 'storage-proofs-porep/src/stacked/vanilla/graph.rs', 'stacked-graph'),
    f('params.rs', 'storage-proofs-porep/src/stacked/vanilla/params.rs'),
  ]),
  d('storage-proofs-post/src/fallback', [
    f('vanilla.rs', 'storage-proofs-post/src/fallback/vanilla.rs', 'fallback-vanilla'),
  ]),
]);
