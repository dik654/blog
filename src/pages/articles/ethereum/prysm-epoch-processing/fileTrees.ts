import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/core/epoch', [
    f('epoch_processing.go — ProcessEpoch()', 'beacon-chain/core/epoch/epoch_processing.go', 'process-epoch'),
    f('epoch_processing.go — Justification', 'beacon-chain/core/epoch/epoch_processing.go', 'process-justification'),
    d('precompute', [
      f('reward_penalty.go — ProcessRewardsAndPenalties()', 'beacon-chain/core/epoch/precompute/reward_penalty.go', 'process-rewards'),
      f('reward_penalty.go — AttestingBalance()', 'beacon-chain/core/epoch/precompute/reward_penalty.go', 'process-slashings'),
    ]),
  ]),
]);
