import { codeRefs } from './codeRefs';
import CListViz from './viz/CListViz';
import type { CodeRef } from '@/components/code/types';

export default function CList({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="clist" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CListMempool 이중 연결 리스트</h2>
      <div className="not-prose mb-8">
        <CListViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── CListMempool 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">CListMempool 구조체</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">CListMempool 핵심 필드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">txs *clist.CList</code> — 주 mempool (concurrent list)</li>
              <li><code className="text-xs">recheckCursor/recheckEnd *CElement</code> — recheck 진행/끝 위치</li>
              <li><code className="text-xs">txsMap *sync.Map</code> — TxKey → *CElement (O(1) 검색)</li>
              <li><code className="text-xs">cache txCache</code> — 최근 TX hash cache</li>
              <li><code className="text-xs">proxyAppConn</code> — ABCI 앱 연결</li>
              <li><code className="text-xs">txsAvailable chan struct{}</code> — TX 도착 알림</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">핵심 연산</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">addTx(tx)</code> — <code className="text-xs">txs.PushBack</code> + txsMap 업데이트</li>
              <li><code className="text-xs">removeTx(key)</code> — txsMap → CElement → <code className="text-xs">txs.Remove</code></li>
              <li><code className="text-xs">reap(max)</code> — FIFO 순서로 max개 반환</li>
              <li><code className="text-xs">NextWait()</code> — element 없으면 block (CPU 낭비 없음)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Go slice 사용 시 문제</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>중간 삭제: <code className="text-xs">O(n)</code> (shift)</li>
              <li>순회 중 수정 불가 (panic)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">CList 사용 시</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>중간 삭제: <code className="text-xs">O(1)</code> (pointer 조정)</li>
              <li>순회 중 안전한 수정 (iterator 방식)</li>
              <li>trade-off: 메모리 지역성 낮음</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          CListMempool은 <strong>concurrent linked list 기반</strong>.<br />
          O(1) 삽입/삭제 + O(1) map 조회 combined.<br />
          Go slice의 중간 삭제 O(n) 문제 해결.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 CList를 쓰는 이유</strong> — Go slice 중간 삭제 O(n).<br />
          멤풀은 블록마다 수백~수천 TX를 한꺼번에 제거해야 하므로 O(1) linked list 필수.<br />
          txByKey map으로 O(1) 조회 보장, NextWaitChan()으로 CPU 낭비 없이 대기.
        </p>
      </div>
    </section>
  );
}
