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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/mempool/mempool.go
type Mempool interface {
    CheckTx(tx Tx, callback func(*abci.ResponseCheckTx), txInfo TxInfo) error
    RemoveTxByKey(txKey TxKey) error
    ReapMaxBytesMaxGas(maxBytes, maxGas int64) types.Txs
    ReapMaxTxs(max int) types.Txs
    Lock()
    Unlock()
    Update(height int64, txs Txs, deliverTxResponses []*abci.ExecTxResult,
           newPreFn PreCheckFunc, newPostFn PostCheckFunc) error
    FlushAppConn() error
    Flush()
    TxsAvailable() <-chan struct{}
    EnableTxsAvailable()
    SetTxRemovedCallback(cb func(txKey TxKey))
    Size() int
    SizeBytes() int64
}

// 2가지 구현체 (v1.0 기준):

// 1. CListMempool (기본)
//    - concurrent linked list
//    - FIFO ordering
//    - 중복 제거 via cache
//    - Gossip friendly

// 2. CAT (Content-Addressed TxPool, v0.38+)
//    - deterministic ordering
//    - priority-based (일부 chain)
//    - 실험적

// 왜 Mempool interface?
// - 다른 구현체 교체 가능
// - 테스트 용이 (MockMempool)
// - 앱별 최적화 (Cosmos SDK의 priority mempool)

// Flow:
// TX 수신 → CheckTx (ABCI) → CListMempool.addTx()
// → Gossip to peers → Block inclusion (PrepareProposal)
// → Post-commit cleanup (Update)`}
        </pre>
        <p className="leading-7">
          Mempool은 <strong>interface 기반 추상화</strong>.<br />
          CListMempool(기본) + CAT(실험) → 앱별 선택 가능.<br />
          CheckTx → addTx → Gossip → Block → cleanup 5단계 flow.
        </p>
      </div>
    </section>
  );
}
