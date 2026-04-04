import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethBlockExecTree: FileNode = d('reth', [
  d('crates/evm/src', [
    f('executor.rs', 'reth/crates/evm/src/executor.rs', 'block-executor'),
  ]),
  d('crates/revm/src', [
    f('evm_config.rs', 'reth/crates/revm/src/evm_config.rs', 'evm-config'),
  ]),
]);
