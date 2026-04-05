import ApplicationsViz from './viz/ApplicationsViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응용: DRAND, Irys, Ethereum</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          "시간의 증명"이 필요한 모든 곳에 적용.<br />
          핵심 가정: 병렬화 불가능한 순차 연산 = 실제 시간이 흘렀다는 물리적 보장
        </p>
      </div>
      <div className="not-prose"><ApplicationsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VDF Applications 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VDF 응용 사례:

// 1. DRAND (Randomness Beacon):
// - collect validator contributions
// - combine via threshold signatures
// - VDF delays output
// - attackers can't bias
// - 3s period beacon

// 2. Chia (PoSpace + PoTime):
// - plots (storage)
// - proofs of space
// - VDF adds time delay
// - consensus via combined
// - "time lords" compute VDF

// 3. Ethereum (considered):
// - RANDAO + VDF
// - unbiasable randomness
// - leader election
// - not yet implemented

// 4. Filecoin (historical):
// - considered for EC
// - time-binding sortition
// - not deployed (DRAND used instead)

// 5. Irys (Arweave):
// - time-stamping
// - ordered data
// - permaweb anchoring

// 6. Time-lock Encryption:
// - encrypted message
// - only decryptable after T time
// - useful for auctions, voting
// - commit-reveal schemes

// 7. Proof-of-Delay:
// - mixnet latency proofs
// - DDoS mitigation
// - rate limiting

// Design patterns:
//
// Pattern 1: Beacon + VDF
// - random beacon → input
// - VDF processes → output
// - attackers can't bias
// - unpredictable
//
// Pattern 2: VDF-based leader election
// - validators submit contributions
// - combined + VDF
// - winner determined fairly
// - can't grind
//
// Pattern 3: Time-lock
// - encrypt with time parameter
// - decryption requires VDF
// - guaranteed delay

// VDF Alliance:
// - research consortium
// - Ethereum Foundation
// - Protocol Labs
// - Chia
// - goal: efficient VDF standard

// ASIC development:
// - FPGAs first
// - custom ASICs coming
// - VDF Hardware Competition
// - 10-100x speedup factors

// Trade-offs:
// - hardware: cheap VDF = attackers
// - too expensive: no decentralized
// - balance needed
// - ASIC equalizes playing field

// Future:
// - standardized hardware
// - democratized access
// - Ethereum integration (eventually)
// - quantum considerations`}
        </pre>
        <p className="leading-7">
          VDF 응용: <strong>DRAND beacons, Chia, time-lock encryption</strong>.<br />
          VDF Alliance research, ASIC acceleration.<br />
          Ethereum도 RANDAO + VDF 고려 중.
        </p>
      </div>
    </section>
  );
}
