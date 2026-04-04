import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/core/blocks', [
    f('block_operations.go — ProcessOperations()', 'beacon-chain/core/blocks/block_operations.go', 'process-operations'),
  ]),
  d('beacon-chain/blockchain', [
    f('process_block.go — onBlock()', 'beacon-chain/blockchain/process_block.go', 'on-block'),
    f('process_block.go — validateExecutionOnBlock()', 'beacon-chain/blockchain/process_block.go', 'validate-execution'),
  ]),
]);
