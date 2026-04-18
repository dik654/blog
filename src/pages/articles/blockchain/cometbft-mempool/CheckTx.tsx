import { codeRefs } from './codeRefs';
import CheckTxFlowViz from './viz/CheckTxFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function CheckTx({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checktx" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CheckTx → ABCI 검증</h2>
      <div className="not-prose mb-8">
        <CheckTxFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── CheckTx 흐름 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">CheckTx 전체 흐름</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">CheckTx 5단계 흐름</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1. 크기 체크</strong> — <code className="text-xs">len(tx) &gt; MaxTxBytes</code> → <code className="text-xs">ErrTxTooLarge</code></p>
              <p><strong>2. 중복 체크</strong> — <code className="text-xs">cache.Push(tx)</code> 실패 → <code className="text-xs">ErrTxInCache</code></p>
              <p><strong>3. PreCheck</strong> — app-specific 필터 (실패 시 cache에서 제거)</p>
              <p><strong>4. ABCI CheckTx</strong> — <code className="text-xs">proxyMtx.Lock()</code> 직렬화 후 <code className="text-xs">CheckTxAsync(Type_New)</code></p>
              <p><strong>5. Callback</strong> — <code className="text-xs">Code == OK</code> → <code className="text-xs">addTx()</code> + <code className="text-xs">notifyTxsAvailable()</code> / 무효 → cache 제거</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">PreCheck 사용 예 (Cosmos SDK)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>tx 크기 &lt; max</li>
              <li>gas &lt; max_gas</li>
              <li>min_gas_price 체크</li>
              <li>기본 signature format 검증</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">PostCheck</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">gas_used &lt;= gas_wanted</code> 보장</li>
              <li>tx order (nonce) 체크</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          CheckTx가 <strong>5단계 검증</strong>.<br />
          size → cache → PreCheck → ABCI → addTx.<br />
          PreCheck/PostCheck로 app-specific 빠른 필터링.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 proxyMtx의 역할</strong> — CheckTx는 MempoolReactor.Receive, RPC 핸들러 등 여러 고루틴에서 동시 호출 가능.<br />
          proxyMtx.Lock()으로 ABCI 호출을 직렬화하여 앱의 CheckTx가 순서대로 처리되도록 보장.
        </p>
      </div>
    </section>
  );
}
