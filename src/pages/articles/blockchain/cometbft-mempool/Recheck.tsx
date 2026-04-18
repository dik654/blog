import { codeRefs } from './codeRefs';
import RecheckViz from './viz/RecheckViz';
import type { CodeRef } from '@/components/code/types';

export default function Recheck({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="recheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Recheck & 블록 후 정리</h2>
      <div className="not-prose mb-8">
        <RecheckViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Update 메서드 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Mempool.Update — 블록 커밋 후 정리</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Update() 3단계 흐름</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1. PreCheck/PostCheck 갱신</strong> — 새 높이에 맞춘 필터 함수 교체</p>
              <p><strong>2. 블록 TX 제거</strong> — 성공 TX → cache 유지 (중복 방지) / 실패 TX → cache 제거 / 모두 <code className="text-xs">removeTx(tx)</code></p>
              <p><strong>3. Recheck</strong> — <code className="text-xs">config.Recheck</code> true면 <code className="text-xs">recheckTxs()</code> 호출</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">recheckTxs() 동작</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>mempool 전체 TX 순회 (<code className="text-xs">txs.Front()</code> → <code className="text-xs">Next()</code>)</p>
              <p>각 TX에 <code className="text-xs">CheckTxAsync(Type_Recheck)</code> 호출</p>
              <p>실패 시 callback에서 자동 제거</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Recheck가 필수인 이유</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>블록 N: TX(A→B, 10 ETH) 실행 → A 잔고 100→90</p>
              <p>mempool의 TX(A→C, 95 ETH) — 이전엔 유효, 지금은 잔고 부족</p>
              <p>Recheck 없으면 → 다음 블록 포함 → <code className="text-xs">FinalizeBlock</code> 실패</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Recheck</strong>가 mempool 상태 일관성 유지.<br />
          블록 커밋 후 남은 TX 재검증 → 무효 TX 제거.<br />
          app state 변경이 mempool에 전파 → 다음 block에 유효 TX만.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Recheck가 필수인 이유</strong> — 블록 커밋으로 nonce, 잔고가 변경됨.<br />
          이전에 유효했던 TX가 무효화될 수 있고, 그대로 블록에 넣으면 FinalizeBlock에서 실패.
        </p>
      </div>
    </section>
  );
}
