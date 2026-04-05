import { codeRefs } from './codeRefs';
import ApplyBlockViz from './viz/ApplyBlockViz';
import type { CodeRef } from '@/components/code/types';

export default function ExecuteBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execute-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ApplyBlock 내부 (ABCI 호출 순서)</h2>
      <div className="not-prose mb-8">
        <ApplyBlockViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── ApplyBlock 전체 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ApplyBlock 전체 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/state/execution.go
// 합의 엔진이 +2/3 precommit 확인 후 호출하는 최종 실행 함수

func (e *BlockExecutor) ApplyBlock(
    state State,
    blockID BlockID,
    block *Block,
) (State, error) {
    // Step 1: ValidateBlock (위 섹션 참조)
    if err := ValidateBlock(state, block); err != nil {
        return state, ErrInvalidBlock(err)
    }
    fail.Fail() // 크래시 주입 지점 1

    // Step 2: ABCI FinalizeBlock
    abciResponse, err := execBlockOnProxyApp(
        e.logger,
        e.proxyApp,
        block,
        e.store,
        state.InitialHeight,
    )
    if err != nil {
        return state, ErrProxyAppConn(err)
    }
    fail.Fail() // 크래시 주입 지점 2

    // Step 3: Save ABCI responses
    if err := e.store.SaveABCIResponses(block.Height, abciResponse); err != nil {
        return state, err
    }
    fail.Fail() // 크래시 주입 지점 3

    // Step 4: Update state
    state, err = updateState(state, blockID, &block.Header, abciResponse, validatorUpdates)
    if err != nil {
        return state, err
    }
    fail.Fail() // 크래시 주입 지점 4

    // Step 5: Commit (app.Commit + mempool.Update)
    appHash, retainHeight, err := e.Commit(state, block, abciResponse.TxResults)
    if err != nil {
        return state, err
    }
    fail.Fail() // 크래시 주입 지점 5

    // Step 6: Update mempool (remove committed TX)
    e.mempool.Update(...)
    fail.Fail() // 크래시 주입 지점 6

    // Step 7: Update app hash
    state.AppHash = appHash
    if err := e.store.Save(state); err != nil {
        return state, err
    }
    fail.Fail() // 크래시 주입 지점 7

    // Step 8: Fire events
    fireEvents(e.logger, e.eventBus, block, blockID, abciResponse, validatorUpdates)

    // Step 9: Prune old state (optional)
    if retainHeight > 0 {
        e.pruneBlockStore(retainHeight)
    }

    return state, nil
}

// fail.Fail() 주입:
// - 테스트 모드에서 각 단계 사이 crash 시뮬레이션
// - 재시작 후 각 상태에서 복구 가능한지 검증
// - production에서는 no-op`}
        </pre>
        <p className="leading-7">
          ApplyBlock이 <strong>9단계 순차 실행</strong>.<br />
          각 단계 사이에 fail.Fail() 주입 지점 → crash recovery 테스트.<br />
          ValidateBlock → ABCI → State → Commit → Events → Prune.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 ApplyBlock이 전체 상태 전이를 집약</strong> — 검증, ABCI 실행, 상태 갱신, DB 저장이 모두 이 함수 안에 있음.<br />
          fail.Fail() 크래시 주입 지점 — 각 단계 사이에서 크래시가 발생해도 복구 가능함을 검증.
        </p>
      </div>
    </section>
  );
}
