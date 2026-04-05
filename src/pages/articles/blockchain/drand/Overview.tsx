import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DRAND 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          DRAND(Distributed Randomness Beacon) — 여러 노드가 협력하여 편향 불가능한 랜덤을 생성하는 프로토콜.<br />
          League of Entropy: Cloudflare, EPFL, Protocol Labs 등이 운영하는 실제 분산 비콘
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DRAND 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DRAND (Distributed Randomness Beacon):

// Architecture:
// - multiple operator nodes
// - threshold signature scheme
// - BLS-based
// - 3-second period

// League of Entropy operators (2024):
// - Cloudflare
// - Protocol Labs
// - EPFL
// - UCL
// - University of Chile
// - Kudelski Security
// - Emerald Onion
// - 10+ additional

// Threshold: t of n
// - need t signatures to combine
// - t = 2n/3 + 1 typically
// - 16-20 total members
// - bias impossible (< t malicious)

// Guarantees:
// - unpredictable (pre-round)
// - unbiasable (after round starts)
// - publicly verifiable
// - continuous output (3s period)
// - no single point of failure

// Beacon chain:
// - each round: new random value
// - signed with threshold BLS
// - verifiable against public key
// - chain of rounds

// Use cases:
// - blockchain leader election
// - lotteries / raffles
// - cryptographic protocols
// - zero-knowledge setup ceremonies
// - distributed applications

// Blockchain integration:
// - Filecoin: EC sortition (primary)
// - Celo: leader election
// - Polkadot: BABE consensus
// - zkSync: SNARK randomness
// - many more

// Security:
// - BLS signature unforgeability
// - t of n threshold (economic)
// - operator diversity
// - off-chain coordination
// - forward secrecy

// Output format:
// - 32-byte hash
// - reproducible
// - deterministic from public key
// - per-round random

// Infrastructure:
// - public APIs (drand.cloudflare.com)
// - open source (drand/drand)
// - decentralized operators
// - no gatekeeper

// History:
// - 2019: DRAND mainnet
// - 2020: Filecoin integration
// - 2022: operator expansion
// - 2024: production stability`}
        </pre>
        <p className="leading-7">
          DRAND: <strong>distributed randomness beacon, 3s period</strong>.<br />
          10+ operators (Cloudflare, Protocol Labs, ...).<br />
          BLS threshold signatures, publicly verifiable.
        </p>
      </div>
    </section>
  );
}
