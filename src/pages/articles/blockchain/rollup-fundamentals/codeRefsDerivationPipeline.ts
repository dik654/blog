import type { CodeRef } from '@/components/code/types';

export const derivationPipelineRefs: Record<string, CodeRef> = {
  'pipeline-struct': {
    path: 'optimism/op-node/rollup/derive/pipeline.go — DerivationPipeline',
    lang: 'go',
    highlight: [1, 8],
    desc: 'DerivationPipeline은 L1 데이터를 L2 블록 입력으로 변환하는 핵심 구조체.\nstages 배열에 파이프라인 단계들이 순서대로 저장되며, traversal이 L1 블록을 순회하고 attrib이 최종 PayloadAttributes를 생성한다.',
    code: `type DerivationPipeline struct {
    log       log.Logger
    rollupCfg *rollup.Config
    l1Fetcher L1Fetcher
    altDA     AltDAInputFetcher
    l2        L2Source
    resetting int
    stages    []ResettableStage
    traversal l1TraversalStage
    attrib    *AttributesQueue
    origin    eth.L1BlockRef
}`,
  },
  'pipeline-new': {
    path: 'optimism/op-node/rollup/derive/pipeline.go — NewDerivationPipeline()',
    lang: 'go',
    highlight: [3, 12],
    desc: '파이프라인 생성 함수. 각 스테이지가 풀(pull) 방식으로 연결된다.\nL1Traversal → L1Retrieval → FrameQueue → ChannelMux → ChannelInReader → BatchMux → AttributesQueue\n왜 pull 방식인가? 각 단계가 필요할 때만 이전 단계에서 데이터를 가져오므로 메모리 효율적.',
    code: `func NewDerivationPipeline(log log.Logger, rollupCfg *rollup.Config,
    depSet DependencySet, l1Fetcher L1Fetcher, l1Blobs L1BlobsFetcher,
    altDA AltDAInputFetcher, l2Source L2Source, metrics Metrics,
    managedBySupervisor bool, l1ChainConfig *params.ChainConfig,
) *DerivationPipeline {
    l1Traversal = NewL1Traversal(log, rollupCfg, l1Fetcher)
    dataSrc := NewDataSourceFactory(log, rollupCfg, l1Fetcher, l1Blobs, altDA)
    l1Src := NewL1Retrieval(log, dataSrc, l1Traversal)
    frameQueue := NewFrameQueue(log, rollupCfg, l1Src)
    channelMux := NewChannelMux(log, spec, frameQueue, metrics)
    chInReader := NewChannelInReader(rollupCfg, log, channelMux, metrics)
    batchMux := NewBatchMux(log, rollupCfg, chInReader, l2Source)
    attrBuilder := NewFetchingAttributesBuilder(rollupCfg, l1ChainConfig,
        depSet, l1Fetcher, l2Source)
    attributesQueue := NewAttributesQueue(log, rollupCfg, attrBuilder, batchMux)
    stages := []ResettableStage{l1Traversal, l1Src, altDA,
        frameQueue, channelMux, chInReader, batchMux, attributesQueue}
    return &DerivationPipeline{stages: stages, traversal: l1Traversal, attrib: attributesQueue}
}`,
  },
  'pipeline-step': {
    path: 'optimism/op-node/rollup/derive/pipeline.go — Step()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'Step은 파이프라인의 핵심 루프. 반복 호출하여 L2 블록 속성을 도출한다.\nio.EOF 반환 시 새 L1 데이터 대기 중. nil 반환 시 계속 호출해야 함.\n왜 한 번에 안 하나? L1 블록이 점진적으로 도착하므로 이벤트 드리븐 방식이 자연스럽다.',
    code: `func (dp *DerivationPipeline) Step(ctx context.Context,
    pendingSafeHead eth.L2BlockRef,
) (outAttrib *AttributesWithParent, outErr error) {
    if dp.resetting < len(dp.stages) {
        if !dp.engineIsReset {
            return nil, NewResetError(ErrEngineResetReq)
        }
        if err := dp.stages[dp.resetting].Reset(ctx, dp.origin, dp.resetSysConfig); err == io.EOF {
            dp.resetting += 1
            return nil, nil
        }
    }
    if attrib, err := dp.attrib.NextAttributes(ctx, pendingSafeHead); err == nil {
        return attrib, nil
    } else if err == io.EOF {
        return nil, dp.traversal.AdvanceL1Block(ctx)
    }
}`,
  },
};
