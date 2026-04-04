import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('reth-exex', [
    f('ExExNotification enum', 'reth-exex/src/notification.rs', 'exex-notification'),
    f('ExExContext struct', 'reth-exex/src/context.rs', 'exex-context'),
    f('ExExManager (fan-out)', 'reth-exex/src/manager.rs', 'exex-manager'),
  ]),
  d('examples', [
    f('인덱서 ExEx 예제', 'reth-exex/examples/indexer.rs', 'exex-example'),
  ]),
]);
