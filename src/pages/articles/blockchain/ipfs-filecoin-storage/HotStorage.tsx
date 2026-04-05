import HotStorageViz from './viz/HotStorageViz';

export default function HotStorage() {
  return (
    <section id="hot-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 핫 스토리지 &amp; Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Cold(PoRep 봉인, 접근 느림) → Hot(PDP, 즉시 접근) 진화.<br />
          Boost가 HTTP 기반 검색, DDO(Direct Data Onboarding), PDP 온체인 증명을 통합
        </p>
      </div>
      <div className="not-prose"><HotStorageViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Hot Storage Evolution</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Hot Storage 진화:

// Phase 1 (2020-2022): Cold Only
// - PoRep sealing required
// - 3-6h seal time
// - unsealing required for retrieval
// - long-term archival only

// Phase 2 (2022-2023): Saturn CDN
// - decentralized CDN layer
// - cached IPFS content
// - HTTP retrieval
// - no storage proofs
// - trust-based

// Phase 3 (2023-2024): Boost
// - independent market daemon
// - HTTP deal protocol
// - GraphSync data transfer
// - DDO (Direct Data Onboarding)
// - better miner experience

// Phase 4 (2024+): PDP + Hot Storage
// - PDP proofs (no sealing)
// - Storacha platform
// - Onchain Cloud
// - immediate retrieval
// - trustless hot storage

// Boost features:
// - HTTP based markets
// - async deal processing
// - high throughput
// - DDO: direct onboarding
// - scalable SP infrastructure

// DDO (Direct Data Onboarding):
// - skip Lotus markets
// - direct SP interaction
// - faster onboarding
// - SP-specific flow

// Phase 5 (2025+): Full Platform
// - FIL+ integration
// - enterprise features
// - global edge network
// - competitive with AWS S3

// Price evolution:
// - Cold: $0.50-2/TiB/year
// - Hot (Storacha): $5.99/TB/month
// - Retrieval: bandwidth-based
// - Competitive with Web2

// Retrieval latency:
// - Cold (unseal): hours
// - Boost: minutes
// - Saturn cache: seconds
// - Hot (PDP): milliseconds

// Adoption:
// - 2022: mostly cold
// - 2023: Boost adoption grows
// - 2024: hot storage launch
// - 2025+: majority hot expected

// Economic model:
// - storage competition
// - multiple tiers
// - different SLAs
// - market-driven pricing`}
        </pre>
        <p className="leading-7">
          Evolution: <strong>Cold → Saturn → Boost → Hot+PDP → Full Platform</strong>.<br />
          retrieval: hours → minutes → seconds → milliseconds.<br />
          2024-2025: Filecoin이 AWS S3 대안으로 성숙.
        </p>
      </div>
    </section>
  );
}
