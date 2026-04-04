import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethPayloadTree: FileNode = d('reth', [
  d('crates/payload/basic/src', [
    f('builder.rs', 'reth/crates/payload/basic/src/builder.rs', 'build-payload'),
  ]),
  d('crates/engine/tree/src', [
    f('engine.rs', 'reth/crates/engine/tree/src/engine.rs', 'forkchoice-updated'),
  ]),
]);
