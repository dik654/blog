import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const beaconKitTree: FileNode = d('beacon-kit', [
  d('beacon/blockchain', [
    f('service.go', 'beacon-kit/beacon/blockchain/service.go', 'bk-service'),
    f('process_proposal.go', 'beacon-kit/beacon/blockchain/process_proposal.go', 'bk-process-proposal'),
    f('finalize_block.go', 'beacon-kit/beacon/blockchain/finalize_block.go', 'bk-finalize-block'),
  ]),
  d('beacon/validator', [
    f('block_builder.go', 'beacon-kit/beacon/validator/block_builder.go', 'bk-block-builder'),
  ]),
  d('state-transition/core', [
    f('state_processor.go', 'beacon-kit/state-transition/core/state_processor.go', 'bk-state-processor'),
  ]),
]);
