import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/rpc/.../validator', [
    f('proposer.go — GetBlock()', 'beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go', 'get-block'),
    f('proposer.go — attestations', 'beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go', 'aggregate-attestations'),
  ]),
  d('beacon-chain/core/helpers', [
    f('committee.go — ComputeProposerIndex()', 'beacon-chain/core/helpers/committee.go', 'compute-proposer'),
  ]),
]);
