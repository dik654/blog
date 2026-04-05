import FilecoinViz from './viz/FilecoinViz';

export default function FilecoinIntegration() {
  return (
    <section id="filecoin-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 연동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Filecoin은 DRAND를 핵심 외부 의존성으로 사용.<br />
          블록 추첨, 저장 증명 챌린지, 타이밍 동기화 모두 DRAND 랜덤에 의존
        </p>
      </div>
      <div className="not-prose"><FilecoinViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DRAND ↔ Filecoin Integration</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DRAND Integration in Filecoin:

// Usage in Filecoin:

// 1. Leader Election (Sortition):
// - VRF input includes DRAND
// - prevents pre-computation
// - unbiasable leader selection
// - per-epoch new randomness

// 2. Challenge Generation:
// - WindowPoSt challenges
// - WinningPoSt challenges
// - PoRep seed challenges
// - all use DRAND

// 3. Randomness Types:
// - ChainRand: chain-derived
// - BeaconRand: DRAND-derived
// - Filecoin uses both

// 4. Epoch Synchronization:
// - DRAND period: 3s
// - Filecoin epoch: 30s
// - 10 DRAND rounds per epoch
// - beacon round = epoch * 10

// Integration code:
// rand, err := beacon.BeaconGetEntry(ctx, round)
// - fetches DRAND entry
// - caches locally
// - verifies against public key
// - uses for challenges

// Lotus beacon client:
// - HTTP client to drand API
// - caches recent entries
// - automatic chain verification
// - fallback to multiple endpoints

// Caching strategy:
// - pre-fetch upcoming rounds
// - store in local DB
// - serve from cache
// - refresh on demand

// Failure scenarios:
// - DRAND unavailable:
//   - Filecoin halts consensus
//   - critical dependency
//   - uses last known round
//   - wait for recovery
//
// - DRAND compromise:
//   - unlikely (threshold)
//   - would affect Filecoin
//   - monitor operator health

// Privacy consideration:
// - clients leak interest (which epoch)
// - mitigated by public API
// - batch fetches possible

// Alternatives considered:
// - on-chain VRF only
// - commit-reveal randomness
// - RANDAO-style
// - Filecoin chose DRAND (2020)

// Filecoin 1.0 upgrade (2020):
// - integrated DRAND
// - replaced previous randomness
// - network-wide coordination
// - successful migration

// 2024 state:
// - stable integration
// - no major incidents
// - strong dependency
// - ~180+ validators trust DRAND`}
        </pre>
        <p className="leading-7">
          Filecoin ↔ DRAND: <strong>leader election + challenge generation</strong>.<br />
          10 DRAND rounds per Filecoin epoch (30s).<br />
          critical dependency — DRAND 장애 시 Filecoin halt.
        </p>
      </div>
    </section>
  );
}
