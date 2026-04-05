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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/mempool/clist_mempool.go
type CListMempool struct {
    mtx          sync.RWMutex
    config       *config.MempoolConfig
    proxyAppConn proxy.AppConnMempool

    txs          *clist.CList           // 주 mempool (concurrent list)
    recheckCursor *clist.CElement        // recheck 진행 위치
    recheckEnd   *clist.CElement         // recheck 끝 위치

    // Lookup (O(1) 검색)
    txsMap       *sync.Map              // TxKey → *CElement
    cache        txCache                // 최근 TX hash cache

    // 통계
    height       int64
    txBytes      int64
    txsAvailable chan struct{}          // Available notifier
    notifiedTxsAvailable bool
}

// clist.CList: concurrent linked list
// - Lock-free Push/Iter (일부)
// - Front()/Back()/Remove() 지원
// - NextWait() → element 없으면 block (CPU 낭비 없음)

// 왜 CList?
// Go slice 사용 시:
// - 중간 삭제: O(n) (shift)
// - 순회 중 수정 불가 (panic)
//
// CList 사용 시:
// - 중간 삭제: O(1) (pointer 조정)
// - 순회 중 안전한 수정 (iterator 방식)
// - 메모리 지역성 낮음 (trade-off)

// 핵심 연산:
// - addTx(tx): txs.PushBack + txsMap 업데이트
// - removeTx(key): txsMap → CElement → txs.Remove
// - reap(max): FIFO 순서로 max개 반환`}
        </pre>
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
