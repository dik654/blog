import type { CodeRef } from '@/components/code/types';

export const derivationStageRefs: Record<string, CodeRef> = {
  'l1-traversal': {
    path: 'optimism/op-node/rollup/derive/l1_traversal.go — AdvanceL1Block()',
    lang: 'go',
    highlight: [1, 10],
    desc: 'L1 블록을 한 칸씩 전진시키는 함수. L1 reorg도 감지한다.\n핵심: 다음 블록의 ParentHash가 현재 블록 Hash와 일치하지 않으면 reorg.\nreorg 감지 시 ResetError를 반환해 전체 파이프라인을 리셋한다.',
    code: `func (l1t *L1Traversal) AdvanceL1Block(ctx context.Context) error {
    origin := l1t.block
    nextL1Origin, err := l1t.l1Blocks.L1BlockRefByNumber(ctx, origin.Number+1)
    if errors.Is(err, ethereum.NotFound) {
        return io.EOF
    }
    if l1t.block.Hash != nextL1Origin.ParentHash {
        return NewResetError(fmt.Errorf("detected L1 reorg from %s to %s",
            l1t.block, nextL1Origin))
    }
    _, receipts, _ := l1t.l1Blocks.FetchReceipts(ctx, nextL1Origin.Hash)
    UpdateSystemConfigWithL1Receipts(&l1t.sysCfg, receipts, l1t.cfg, nextL1Origin.Time)
    l1t.block = nextL1Origin
    l1t.done = false
    return nil
}`,
  },
  'channel-bank': {
    path: 'optimism/op-node/rollup/derive/channel_bank.go — IngestFrame()',
    lang: 'go',
    highlight: [1, 8],
    desc: 'ChannelBank은 프레임을 채널로 조립하는 스테이지.\n왜 ChannelBank인가? 하나의 채널이 여러 L1 트랜잭션에 걸쳐 프레임으로 분할될 수 있다.\ntimeout 초과 채널은 무시하고, 완성된 채널만 다음 스테이지로 전달.',
    code: `func (cb *ChannelBank) IngestFrame(f Frame) {
    currentCh, ok := cb.channels[f.ID]
    if !ok {
        currentCh = NewChannel(f.ID, origin, false)
        cb.channels[f.ID] = currentCh
        cb.channelQueue = append(cb.channelQueue, f.ID)
    }
    if currentCh.OpenBlockNumber()+cb.spec.ChannelTimeout(origin.Time) < origin.Number {
        log.Warn("channel is timed out, ignore frame")
        return
    }
    currentCh.AddFrame(f, origin)
    cb.prune()
}`,
  },
  'attributes-queue': {
    path: 'optimism/op-node/rollup/derive/attributes_queue.go — createNextAttributes()',
    lang: 'go',
    highlight: [1, 8],
    desc: '배치를 PayloadAttributes로 변환하는 최종 스테이지.\nNoTxPool=true로 설정 — 검증 모드에서는 tx pool을 사용하지 않는다.\n왜? 블록 도출이 결정론적이어야 하므로 외부 트랜잭션을 섞으면 안 됨.',
    code: `func (aq *AttributesQueue) createNextAttributes(ctx context.Context,
    batch *SingularBatch, l2SafeHead eth.L2BlockRef,
) (*eth.PayloadAttributes, error) {
    if batch.ParentHash != l2SafeHead.Hash {
        return nil, NewResetError(fmt.Errorf("bad parent hash"))
    }
    attrs, _ := aq.builder.PreparePayloadAttributes(fetchCtx, l2SafeHead, batch.Epoch())
    attrs.NoTxPool = true
    attrs.Transactions = append(attrs.Transactions, batch.Transactions...)
    return attrs, nil
}`,
  },
};
