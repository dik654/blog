import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('bin/reth/src', [
    f('main.rs — CLI 진입점', 'bin/reth/src/main.rs', 'cli-main'),
  ]),
  d('crates/node/builder/src/builder', [
    f('mod.rs — NodeBuilder struct', 'crates/node/builder/src/builder/mod.rs', 'builder-struct'),
    f('mod.rs — node() 메서드', 'crates/node/builder/src/builder/mod.rs', 'builder-node'),
    f('states.rs — 상태 전이', 'crates/node/builder/src/builder/states.rs', 'builder-states'),
    f('states.rs — WithComponents', 'crates/node/builder/src/builder/states.rs', 'builder-final'),
  ]),
  d('crates/node/builder/src/components', [
    f('mod.rs — NodeComponents trait', 'crates/node/builder/src/components/mod.rs', 'node-components'),
    f('mod.rs — Components struct', 'crates/node/builder/src/components/mod.rs', 'components-struct'),
  ]),
]);
