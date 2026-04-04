import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const suiTree: FileNode = d('sui/consensus', [
  d('core/src', [
    f('block.rs', 'sui/consensus/core/src/block.rs', 'sui-block'),
    f('core.rs', 'sui/consensus/core/src/core.rs', 'sui-core'),
    f('base_committer.rs', 'sui/consensus/core/src/base_committer.rs', 'sui-committer'),
    f('linearizer.rs', 'sui/consensus/core/src/linearizer.rs', 'sui-linearizer'),
    f('dag_state.rs', 'sui/consensus/core/src/dag_state.rs', 'sui-dag-state'),
  ]),
]);
