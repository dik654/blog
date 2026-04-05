import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ApplyBlock 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BlockExecutor.ApplyBlock()은 합의 결과를 실제 상태 전이에 반영하는 유일한 진입점입니다.<br />
          이 아티클에서는 ValidateBlock → FinalizeBlock → Commit → SaveState 전체 호출 체인을 추적합니다.
        </p>

        {/* ── BlockExecutor ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockExecutor — 상태 전이의 중심</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/state/execution.go
type BlockExecutor struct {
    store Store             // state.db
    proxyApp proxy.AppConnConsensus  // ABCI connection

    // 이벤트 발행
    eventBus types.BlockEventPublisher

    // evidence
    evpool EvidencePool

    // Mempool
    mempool mempool.Mempool

    // 메트릭
    metrics *Metrics

    logger log.Logger
}

// ApplyBlock 핵심 메서드:
func (e *BlockExecutor) ApplyBlock(
    state State,
    blockID types.BlockID,
    block *types.Block,
) (State, error) {
    // 1. Block validation
    if err := ValidateBlock(state, block); err != nil {
        return state, ErrInvalidBlock(err)
    }

    // 2. ABCI FinalizeBlock 호출
    abciResponse, err := e.proxyApp.FinalizeBlock(...)

    // 3. State update
    state, err = updateState(state, blockID, &block.Header, abciResponse, validatorUpdates)

    // 4. Commit + state save
    appHash, err := e.Commit(state, block, abciResponse.TxResults)

    // 5. Events publish
    fireEvents(e.logger, e.eventBus, block, abciResponse, validatorUpdates)

    return state, nil
}

// 5단계 → 블록 1개의 전체 lifecycle
// 각 단계가 실패하면 특정 error 반환
// BlockExecutor는 모든 블록 처리의 "single source of truth"`}
        </pre>
        <p className="leading-7">
          BlockExecutor가 <strong>block application의 central 컴포넌트</strong>.<br />
          ApplyBlock() 5단계로 validation → ABCI → state → commit → events.<br />
          모든 block 처리의 single entry point.
        </p>
      </div>
    </section>
  );
}
