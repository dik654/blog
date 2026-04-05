import RetrievalViz from './viz/RetrievalViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Retrieval({ onCodeRef }: Props) {
  return (
    <section id="retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리트리벌 — HandleQuery() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        PayloadCID로 PieceStore 조회 → 가격 응답 → Payment Channel 전송<br />
        오프체인 마이크로페이먼트 — 최종 정산만 온체인
      </p>
      <div className="not-prose mb-8">
        <RetrievalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Retrieval Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Retrieval Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Retrieval Protocol 단계:

// 1. Discovery:
//    - client: Query(PayloadCID)
//    - providers respond: price + availability
//    - indexer node 사용 (content routing)

// 2. QueryAsk:
//    type QueryAsk struct {
//        Size: uint64
//        PaymentInterval: uint64 (per byte threshold)
//        PaymentIntervalIncrease: uint64
//        PricePerByte: BigInt
//        UnsealPrice: BigInt
//    }

// 3. Deal Proposal:
//    client agrees to price
//    proposes retrieval deal
//    payment channel address shared

// 4. Payment Channel:
//    - create channel (on-chain)
//    - initial voucher
//    - client funds it
//    - provider verifies

// 5. Data Transfer:
//    - graphsync protocol
//    - chunk-by-chunk
//    - unixfs traversal
//    - typical chunk: 1 MB
//
// 6. Vouchers:
//    - after each payment interval
//    - client signs increment voucher
//    - provider redeems at channel end
//
// 7. Settlement:
//    - provider submits final voucher
//    - channel closes
//    - funds transferred

// Micropayment Channels:
// - PaymentChannelActor (on-chain)
// - off-chain voucher signing
// - cumulative payment tracking
// - dispute resolution on-chain

// Benefits:
// - no per-chunk gas cost
// - fast UX
// - CDN-like experience
// - scalable

// Boost retrieval:
// - HTTP transport
// - IPNI (InterPlanetary Network Indexer)
// - libp2p transport
// - multiple protocols supported

// Economic model:
// - price per byte
// - unseal fee (if not cached)
// - provider sets price
// - market competition

// IPNI (IPNI.io):
// - centralized indexer
// - content routing
// - "who has X CID"
// - fast lookups
// - multiple providers aggregation

// Current state (2024):
// - Boost widely deployed
// - HTTP retrieval standard
// - IPNI as primary discovery
// - 수십 PiB retrieval 처리`}
        </pre>
        <p className="leading-7">
          Retrieval: <strong>Query → Deal → PaymentChannel → Transfer → Voucher</strong>.<br />
          off-chain micropayments + on-chain settlement.<br />
          IPNI가 content discovery, Boost가 modern market daemon.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 payment channel인가</strong> — micropayment economics.<br />
          {'직접 on-chain: 매 TX 수수료 > 데이터 비용.'}<br />
          payment channel: batch N TXs → 1 on-chain settlement.<br />
          amortize gas cost → micropayments 경제적 viable.
        </p>
      </div>
    </section>
  );
}
