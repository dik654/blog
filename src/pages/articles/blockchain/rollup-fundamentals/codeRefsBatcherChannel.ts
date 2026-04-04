import type { CodeRef } from '@/components/code/types';

export const batcherChannelRefs: Record<string, CodeRef> = {
  'add-l2-block': {
    path: 'optimism/op-batcher/batcher/channel_manager.go — AddL2Block()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'L2 블록을 배처 내부 큐에 추가하는 함수.\ntip(마지막 블록 해시)과 새 블록의 ParentHash를 비교해 reorg을 감지.\nreorg 발생 시 ErrReorg를 반환해 배처 상태를 초기화.',
    code: `func (s *channelManager) AddL2Block(block *types.Block) error {
    if s.tip != (common.Hash{}) && s.tip != block.ParentHash() {
        return ErrReorg
    }
    b := ToSizedBlock(block)
    s.metr.RecordL2BlockInPendingQueue(b.RawSize(), b.EstimatedDABytes())
    s.blocks.Enqueue(b)
    s.tip = block.Hash()
    return nil
}`,
  },
  'tx-data': {
    path: 'optimism/op-batcher/batcher/channel_manager.go — TxData()',
    lang: 'go',
    highlight: [1, 8],
    desc: 'L1에 제출할 다음 트랜잭션 데이터를 반환.\nDA 타입(calldata vs blob)을 동적으로 전환할 수 있다.\n왜 동적 전환? L1 가스 가격 변동에 따라 최적 DA를 선택해 비용 절감.',
    code: `func (s *channelManager) TxData(l1Head eth.BlockID,
    isThrottling bool, pi pubInfo,
) (txData, error) {
    channel, err := s.getReadyChannel(l1Head, pi)
    if !channel.noneSubmitted() {
        return s.nextTxData(channel)
    }
    newCfg := s.cfgProvider.ChannelConfig(isThrottling)
    if newCfg.UseBlobs != s.defaultCfg.UseBlobs {
        s.handleChannelInvalidated(channel)
        s.defaultCfg = newCfg
        channel, _ = s.getReadyChannel(l1Head, pi)
    }
    return s.nextTxData(channel)
}`,
  },
  'process-blocks': {
    path: 'optimism/op-batcher/batcher/channel_manager.go — processBlocks()',
    lang: 'go',
    highlight: [1, 8],
    desc: '블록 큐에서 현재 채널로 블록을 추가하는 함수.\n채널이 가득 차거나 큐가 비면 중단.\n왜 한 번에 안 보내나? 채널 크기를 최대한 채워야 L1 가스 효율이 높다.',
    code: `func (s *channelManager) processBlocks() error {
    var blocksAdded int
    for i := s.blockCursor; ; i++ {
        block, ok := s.blocks.PeekN(i)
        if !ok { break }
        l1info, err := s.currentChannel.AddBlock(block)
        if errors.As(err, &_chFullErr) {
            break
        }
        blocksAdded += 1
        if s.currentChannel.IsFull() { break }
    }
    s.blockCursor += blocksAdded
    return nil
}`,
  },
};
