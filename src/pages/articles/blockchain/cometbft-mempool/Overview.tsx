import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멤풀 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT 멤풀은 합의 전 TX를 수집·검증·보관하는 버퍼.<br />
          CListMempool의 자료구조, CheckTx 검증, Recheck 재검증을 코드 수준으로 추적한다.
        </p>

        {/* ── Mempool interface ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mempool interface & 구현체</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Mempool interface 핵심 메서드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">CheckTx(tx, callback, txInfo) error</code> — TX 검증</li>
              <li><code className="text-xs">RemoveTxByKey(txKey) error</code> — TX 제거</li>
              <li><code className="text-xs">ReapMaxBytesMaxGas(maxBytes, maxGas) Txs</code> — 블록 제안용</li>
              <li><code className="text-xs">Update(height, txs, results, preFn, postFn) error</code> — 블록 후 정리</li>
              <li><code className="text-xs">TxsAvailable() &lt;-chan struct{}</code> — TX 도착 알림</li>
              <li><code className="text-xs">Size() int</code> / <code className="text-xs">SizeBytes() int64</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">왜 interface 추상화?</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>다른 구현체 교체 가능</li>
              <li>테스트 용이 (<code className="text-xs">MockMempool</code>)</li>
              <li>앱별 최적화 (Cosmos SDK의 priority mempool)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">CListMempool (기본)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>concurrent linked list 기반</li>
              <li>FIFO ordering</li>
              <li>중복 제거 via cache</li>
              <li>Gossip friendly</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">CAT (v0.38+, 실험적)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Content-Addressed TxPool</li>
              <li>deterministic ordering</li>
              <li>priority-based (일부 chain)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">전체 Flow</div>
            <div className="text-sm text-muted-foreground">
              TX 수신 → <code className="text-xs">CheckTx</code> (ABCI) → <code className="text-xs">addTx()</code> → Gossip to peers → Block inclusion (<code className="text-xs">PrepareProposal</code>) → Post-commit cleanup (<code className="text-xs">Update</code>)
            </div>
          </div>
        </div>
        <p className="leading-7">
          Mempool은 <strong>interface 기반 추상화</strong>.<br />
          CListMempool(기본) + CAT(실험) → 앱별 선택 가능.<br />
          CheckTx → addTx → Gossip → Block → cleanup 5단계 flow.
        </p>
      </div>
    </section>
  );
}
