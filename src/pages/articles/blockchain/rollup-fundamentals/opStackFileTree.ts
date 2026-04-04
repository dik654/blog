import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const opStackTree: FileNode = d('optimism', [
  d('op-node/rollup', [
    f('output_root.go', 'optimism/op-node/rollup/output_root.go', 'output-root'),
    d('derive', [
      f('pipeline.go — DerivationPipeline', 'optimism/op-node/rollup/derive/pipeline.go — DerivationPipeline', 'pipeline-struct'),
      f('pipeline.go — NewDerivationPipeline()', 'optimism/op-node/rollup/derive/pipeline.go — NewDerivationPipeline()', 'pipeline-new'),
      f('pipeline.go — Step()', 'optimism/op-node/rollup/derive/pipeline.go — Step()', 'pipeline-step'),
      f('l1_traversal.go — AdvanceL1Block()', 'optimism/op-node/rollup/derive/l1_traversal.go — AdvanceL1Block()', 'l1-traversal'),
      f('channel_bank.go — IngestFrame()', 'optimism/op-node/rollup/derive/channel_bank.go — IngestFrame()', 'channel-bank'),
      f('attributes_queue.go — createNextAttributes()', 'optimism/op-node/rollup/derive/attributes_queue.go — createNextAttributes()', 'attributes-queue'),
    ]),
  ]),
  d('op-batcher/batcher', [
    f('driver.go — BatchSubmitter', 'optimism/op-batcher/batcher/driver.go — BatchSubmitter', 'batch-submitter'),
    f('channel_manager.go — channelManager', 'optimism/op-batcher/batcher/channel_manager.go — channelManager', 'channel-manager'),
    f('channel_manager.go — AddL2Block()', 'optimism/op-batcher/batcher/channel_manager.go — AddL2Block()', 'add-l2-block'),
    f('channel_manager.go — TxData()', 'optimism/op-batcher/batcher/channel_manager.go — TxData()', 'tx-data'),
    f('channel_manager.go — processBlocks()', 'optimism/op-batcher/batcher/channel_manager.go — processBlocks()', 'process-blocks'),
  ]),
  d('op-challenger/game/fault/types', [
    f('types.go — Claim', 'optimism/op-challenger/game/fault/types/types.go — Claim', 'claim-struct'),
    f('position.go — Position', 'optimism/op-challenger/game/fault/types/position.go — Position', 'position'),
    f('game.go — Game interface', 'optimism/op-challenger/game/fault/types/game.go — Game interface', 'game-state'),
  ]),
]);
