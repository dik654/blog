import type { CodeRef } from '@/components/code/types';

export const batcherDriverRefs: Record<string, CodeRef> = {
  'batch-submitter': {
    path: 'optimism/op-batcher/batcher/driver.go — BatchSubmitter',
    lang: 'go',
    highlight: [1, 8],
    desc: 'BatchSubmitter는 L2 블록을 L1에 제출하는 서비스.\nchannelMgr가 블록을 채널로 묶고 프레임으로 분할한다.\npublishSignal 채널로 배치 제출 시점을 제어.',
    code: `type BatchSubmitter struct {
    DriverSetup
    wg          *sync.WaitGroup
    shutdownCtx context.Context
    mutex       sync.Mutex
    running     bool
    channelMgr  *channelManager
    prevCurrentL1 eth.L1BlockRef
    throttleController *throttler.ThrottleController
    publishSignal chan pubInfo
}`,
  },
  'channel-manager': {
    path: 'optimism/op-batcher/batcher/channel_manager.go — channelManager',
    lang: 'go',
    highlight: [1, 10],
    desc: 'channelManager는 L2 블록을 채널로 변환하는 핵심 구조체.\nblocks 큐에 미확정 블록을 저장하고, blockCursor로 채널에 추가할 다음 블록을 추적.\n왜 단일 채널? 동시에 여러 채널을 만들면 L1 가스 낭비. 하나씩 완성 후 다음.',
    code: `type channelManager struct {
    log         log.Logger
    metr        metrics.Metricer
    cfgProvider ChannelConfigProvider
    rollupCfg   *rollup.Config
    outFactory  ChannelOutFactory
    blocks      queue.Queue[SizedBlock]  // 미확정 L2 블록 큐
    blockCursor int                       // 다음 채널에 넣을 블록 인덱스
    l1OriginLastSubmittedChannel eth.BlockID
    tip         common.Hash               // reorg 감지용
    currentChannel *channel
    channelQueue   []*channel
    txChannels     map[string]*channel
}`,
  },
};
