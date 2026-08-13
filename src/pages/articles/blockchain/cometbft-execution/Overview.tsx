import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ApplyBlock은 합의 결과를 application state로 반영한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BlockExecutor.ApplyBlock()은 합의 결과를 실제 상태 전이에 반영하는
          중심 진입점입니다. 이 아티클에서는 ValidateBlock → FinalizeBlock →
          SaveState 전체 호출 체인을 추적합니다.
        </p>

        {/* ── BlockExecutor ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlockExecutor — 상태 전이의 중심
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          cometbft/state/execution.go
        </p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <code>BlockExecutor</code> 구조체
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">store Store</code> — state.db
              </li>
              <li>
                <code className="text-xs">proxyApp AppConnConsensus</code> —
                ABCI 연결
              </li>
              <li>
                <code className="text-xs">eventBus BlockEventPublisher</code> —
                이벤트 발행
              </li>
              <li>
                <code className="text-xs">evpool EvidencePool</code> — 악의 행위
                증거
              </li>
              <li>
                <code className="text-xs">mempool Mempool</code> — TX 풀
              </li>
              <li>
                <code className="text-xs">metrics *Metrics</code> — 모니터링
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <code>ApplyBlock</code> 5단계 흐름
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                <code className="text-xs">ValidateBlock(state, block)</code> —
                블록 검증
              </li>
              <li>
                <code className="text-xs">proxyApp.FinalizeBlock(...)</code> —
                ABCI 실행
              </li>
              <li>
                <code className="text-xs">updateState(...)</code> — 상태 갱신
              </li>
              <li>
                <code className="text-xs">Commit(state, block, txResults)</code>{" "}
                — 디스크 저장
              </li>
              <li>
                <code className="text-xs">fireEvents(...)</code> — 이벤트 발행
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              각 단계 실패 시 특정 error 반환 — single source of truth
            </p>
          </div>
        </div>

        <p className="leading-7">
          BlockExecutor는 <strong>block application의 중심 컴포넌트</strong>다.
          ApplyBlock이 validation, ABCI execution, state update, commit, event의
          순서를 조율해 합의 결과와 application state가 같은 height를 유지하게
          한다.
        </p>
      </div>
    </section>
  );
}
