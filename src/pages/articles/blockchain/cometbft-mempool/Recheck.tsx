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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록 Commit 직후 mempool 갱신
func (m *CListMempool) Update(
    height int64,
    txs types.Txs,
    deliverTxResponses []*abci.ExecTxResult,
    preCheck PreCheckFunc,
    postCheck PostCheckFunc,
) error {
    m.height = height
    m.notifiedTxsAvailable = false

    // 1. PreCheck/PostCheck 함수 업데이트
    if preCheck != nil { m.preCheck = preCheck }
    if postCheck != nil { m.postCheck = postCheck }

    // 2. 블록에 포함된 TX 제거
    for i, tx := range txs {
        if deliverTxResponses[i].Code == abci.CodeTypeOK {
            // 성공한 TX는 cache에 유지 (중복 방지)
            m.cache.Push(tx)
        } else {
            // 실패한 TX는 cache에서 제거
            m.cache.Remove(tx)
        }
        m.removeTx(tx)  // mempool에서 제거
    }

    // 3. 남은 TX recheck (상태 변경 반영)
    if m.config.Recheck {
        m.recheckTxs()
    }

    return nil
}

// recheckTxs 상세:
func (m *CListMempool) recheckTxs() {
    // mempool의 모든 TX에 대해 CheckTx 재호출
    // 이미 컨텍스트가 변경된 app에서 재검증
    for e := m.txs.Front(); e != nil; e = e.Next() {
        memTx := e.Value.(*mempoolTx)

        m.proxyAppConn.CheckTxAsync(&abci.RequestCheckTx{
            Tx: memTx.tx,
            Type: abci.CheckTxType_Recheck,  // recheck flag
        })
        // 실패 시 callback에서 자동 제거
    }
}

// Recheck가 필수인 이유:
// 블록 N에서 TX(A→B, 10 ETH) 실행 완료
// A의 balance: 100 → 90 ETH
//
// mempool에 있는 다른 TX(A→C, 95 ETH)는?
// - 이전에는 유효 (balance 100)
// - 지금은 잔고 부족 (balance 90)
// - Recheck로 제거 필요
//
// Recheck 없으면:
// - 다음 블록에 포함
// - FinalizeBlock에서 실패
// - block에 "실패한 TX" 포함 (자원 낭비)
// - proposer가 나쁜 block 만듦`}
        </pre>
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
