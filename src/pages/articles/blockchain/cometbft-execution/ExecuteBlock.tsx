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
        <p className="text-xs text-muted-foreground mb-3">cometbft/state/execution.go — +2/3 precommit 확인 후 호출하는 최종 실행 함수</p>

        <div className="not-prose mb-4">
          <div className="rounded-lg border bg-card p-4 mb-3">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2"><code>ApplyBlock</code> 9단계 순차 실행</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">1. ValidateBlock</p>
                <p className="text-xs">블록 검증 (12단계)</p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #1</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">2. FinalizeBlock</p>
                <p className="text-xs"><code className="text-[10px]">execBlockOnProxyApp</code> ABCI 호출</p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #2</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">3. Save ABCI responses</p>
                <p className="text-xs"><code className="text-[10px]">store.SaveABCIResponses</code></p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #3</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">4. Update state</p>
                <p className="text-xs"><code className="text-[10px]">updateState(...)</code></p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #4</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">5. Commit</p>
                <p className="text-xs">app.Commit + mempool.Update</p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #5</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">6. Mempool Update</p>
                <p className="text-xs">committed TX 제거</p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #6</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">7. Save AppHash</p>
                <p className="text-xs"><code className="text-[10px]">store.Save(state)</code></p>
                <p className="text-[10px] text-amber-500 mt-1">fail.Fail() #7</p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">8. Fire events</p>
                <p className="text-xs"><code className="text-[10px]">fireEvents(...)</code></p>
              </div>
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">9. Prune (optional)</p>
                <p className="text-xs"><code className="text-[10px]">pruneBlockStore</code> if retainHeight &gt; 0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">fail.Fail() 크래시 주입</p>
            <p className="text-xs text-muted-foreground">테스트 모드에서 각 단계 사이 crash 시뮬레이션 — 재시작 후 복구 가능한지 검증. production에서는 no-op.</p>
          </div>
        </div>

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
