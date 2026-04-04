import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/execution', [
    f('engine_client.go — NewPayload()', 'execution/engine_client.go', 'engine-new-payload'),
    f('engine_client.go — ForkchoiceUpdated()', 'execution/engine_client.go', 'engine-forkchoice'),
    f('engine_client.go — GetPayload()', 'execution/engine_client.go', 'engine-get-payload'),
  ]),
  d('beacon-chain/blockchain', [
    f('process_block.go — notifyNewPayload()', 'blockchain/process_block.go', 'notify-new-payload'),
  ]),
]);
