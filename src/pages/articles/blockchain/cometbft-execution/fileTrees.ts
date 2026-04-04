import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftExecutionTree: FileNode = d('cometbft', [
  d('state', [
    f('execution.go — BlockExecutor.ApplyBlock()', 'state/execution.go', 'apply-block'),
    f('execution.go — BlockExecutor struct', 'state/execution.go', 'block-executor'),
    f('validation.go — validateBlock()', 'state/validation.go', 'validate-block'),
  ]),
]);
