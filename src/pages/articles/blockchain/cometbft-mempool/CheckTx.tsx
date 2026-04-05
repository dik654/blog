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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/mempool/clist_mempool.go
func (m *CListMempool) CheckTx(
    tx types.Tx,
    cb func(*abci.ResponseCheckTx),
    txInfo TxInfo,
) error {
    // 1. 크기 체크
    if len(tx) > m.config.MaxTxBytes {
        return ErrTxTooLarge
    }

    // 2. 중복 체크 (cache)
    if !m.cache.Push(tx) {
        // 이미 봤음 → skip
        return ErrTxInCache
    }

    // 3. PreCheck (app-specific, optional)
    if m.preCheck != nil {
        if err := m.preCheck(tx); err != nil {
            m.cache.Remove(tx)
            return ErrPreCheck{err}
        }
    }

    // 4. ABCI CheckTx 호출 (app validation)
    m.proxyMtx.Lock()
    defer m.proxyMtx.Unlock()

    reqRes := m.proxyAppConn.CheckTxAsync(&abci.RequestCheckTx{
        Tx:   tx,
        Type: abci.CheckTxType_New,
    })

    reqRes.SetCallback(func(res *abci.Response) {
        r := res.GetCheckTx()

        if r.Code == abci.CodeTypeOK {
            // 유효 → mempool에 추가
            m.addTx(&mempoolTx{
                height: m.height,
                gasWanted: r.GasWanted,
                tx: tx,
            })
            m.notifyTxsAvailable()
        } else {
            // 무효 → cache에서 제거 + reject
            m.cache.Remove(tx)
        }

        // user callback
        if cb != nil { cb(r) }
    })

    return nil
}

// PreCheck 사용 예 (Cosmos SDK):
// - tx 크기 < max
// - gas < max_gas
// - min_gas_price 체크
// - 기본 signature format 검증

// PostCheck:
// - gas_used <= gas_wanted 보장
// - tx order (nonce) 체크`}
        </pre>
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
