import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딜 흐름 개요</h2>
      <p className="text-sm text-muted-foreground mb-4">
        스토리지 딜(온체인 관리)과 리트리벌(오프체인 마이크로페이먼트) 두 축<br />
        Boost가 기존 내장 마켓을 대체하는 독립 마켓 데몬
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Storage + Retrieval ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Storage vs Retrieval Markets</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin 2가지 market:

// Storage Market (on-chain):
// - client → provider deal
// - price: per GiB per epoch
// - duration: 180-540 days
// - on-chain management
// - PublishStorageDeals message
// - collateral required
// - slashing on breach

// Retrieval Market (off-chain):
// - client retrieves data
// - micropayment channels
// - pay-per-byte model
// - no on-chain deals
// - final settlement on-chain
// - provider response to query

// Storage Deal flow:
// 1. Client proposes deal (off-chain)
// 2. Provider accepts (off-chain)
// 3. Client transfers data
// 4. Provider receives + seals
// 5. PublishStorageDeals (on-chain)
// 6. Deal activated
// 7. Provider proves (PoSt)
// 8. Payments over duration
// 9. Deal end → collateral returned

// Retrieval flow:
// 1. Client queries (PayloadCID)
// 2. Provider responds (price)
// 3. Open payment channel
// 4. Provider sends data chunks
// 5. Client signs vouchers
// 6. Close channel → settlement

// Boost (new market daemon):
// - replaces built-in markets
// - graphsync data transfer
// - HTTP/libp2p support
// - async deal processing
// - higher throughput
// - dedicated deamon

// Built-in actors:
// - StorageMarketActor: deals registry
// - VerifiedRegistryActor: FIL+
// - PaymentChannelActor: retrieval

// FIL+ verified deals:
// - 10x reward multiplier
// - notary system
// - public benefit data
// - DataCap allocation`}
        </pre>
        <p className="leading-7">
          2 markets: <strong>Storage (on-chain) + Retrieval (off-chain)</strong>.<br />
          Boost가 새 market daemon (replaces built-in).<br />
          FIL+ verified deals: 10x reward multiplier.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 retrieval은 off-chain인가</strong> — cost efficiency.<br />
          on-chain: 매 byte 비용 + latency.<br />
          off-chain channels: 무료 + fast + final settlement만 on-chain.<br />
          CDN-like user experience 가능.
        </p>
      </div>
    </section>
  );
}
