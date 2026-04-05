import SimplexBFTViz from './viz/SimplexBFTViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex 프로토콜 & BFT 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Simplex — Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 합의 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong>
        </p>
        <p className="leading-7">
          4가지 핵심 혁신으로 기존 프로토콜의 한계를 돌파:
          <br />
          <strong>① 즉시 View 전환</strong> — Cert(k,x) 수집 즉시 view k+1로 이동. View-change 전송 불가
          <br />
          <strong>② No-Commit 증명</strong> — n-f View-change = 해당 view에서 결정 없었음 증명
          <br />
          <strong>③ 리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거
          <br />
          <strong>④ 짧은 Timeout</strong> — 6Δ → 3Δ 단축
        </p>
        <p className="leading-7">
          Commonware 구현: <code>consensus::simplex</code>(기본) + <code>consensus::threshold_simplex</code>(VRF+BLS)
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexBFTViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Simplex BFT 프로토콜 역사</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Simplex BFT Protocol
//
// Paper: "Simplex Consensus: A Simple and Fast Consensus Protocol"
// Authors: Benjamin Y. Chan, Rafael Pass
// Venue: Theory of Cryptography Conference (TCC) 2023
// Link: eprint.iacr.org/2023/463
//
// Key claim:
//   "Simpler than HotStuff"
//   "Faster than existing protocols"
//   "Maintains linear view-change complexity"

// BFT Consensus Evolution:
//
//   1999: PBFT (Castro & Liskov)
//     First practical async BFT
//     3-phase protocol
//     O(n^2) view-change complexity
//     Stable under f < n/3 faults
//
//   2014: Tendermint (Kwon, Buchman)
//     2-phase (prevote + precommit)
//     Production in Cosmos
//     O(n^2) view-change
//     Gossip-based message propagation
//
//   2018: HotStuff (Yin et al.)
//     3-phase + responsive leader
//     O(n) view-change (linearization!)
//     Used in DiemBFT, Libra
//     Complex pipelining
//
//   2023: Simplex (Chan, Pass)
//     2-phase + instant view switch
//     O(n) view-change
//     Shorter timeouts (3Δ vs 6Δ)
//     Simpler proofs

// Simplex's 4 innovations:
//
//   Innovation 1: Instant view transition
//     Upon seeing Cert(view=k, val=x):
//       → Immediately transition to view k+1
//       → NO waiting for timeout
//       → NO explicit "view-change" message phase
//
//   Innovation 2: "No-commit" evidence
//     If view-change happens with n-f votes:
//       Proves no block was committed in that view
//       Safety preserved via this proof
//
//   Innovation 3: No leader wait time
//     HotStuff: leader waits 2Δ for quorum
//     Simplex: leader proposes immediately on entering view
//     Optimistic responsiveness
//
//   Innovation 4: Short timeouts
//     HotStuff: 6Δ timeout per view
//     Simplex: 3Δ timeout per view
//     Faster view progression under byzantine leaders

// Protocol structure:
//
//   Round / View structure:
//     view v: leader L_v proposes
//     Validators vote (notarize)
//     If 2f+1 notarize: view advances
//     Else: timeout -> nullify -> next view
//
//   Messages:
//     Propose(v, parent_cert, payload)
//     Notarize(v, digest)   [vote for proposal]
//     Nullify(v)            [skip to next view]
//     Finalize(v, digest)   [finalize block]

// Safety and liveness:
//
//   Safety: No two conflicting blocks finalized
//     Enforced by: quorum intersection
//     f < n/3 Byzantine tolerance
//
//   Liveness: Under synchrony, progress eventually
//     Honest leader always completes view in 3Δ
//     Byzantine leader detected in 3Δ
//     f+1 consecutive honest leaders → finalization

// Commonware implementations:
//
//   consensus::simplex:
//     Basic variant with individual signatures
//     O(n) certificate size
//     Each validator's signature separately
//
//   consensus::threshold_simplex:
//     BLS threshold signatures + VRF
//     O(1) certificate size (96 bytes)
//     DKG-based group key
//     Light-client friendly

// Why Simplex matters:
//   Simpler codebase than HotStuff
//   Formal verification feasible
//   Fast finality (3Δ worst case)
//   Modular design for commonware
//
// Production use:
//   - Commonware toolkit default consensus
//   - Research reference implementations
//   - Academic exploration of simpler BFT

// Performance expectations:
//   Block time: ~Δ (network delay)
//   Finality: 3Δ (1 round)
//   View change: 3Δ (timeout + nullify + propose)
//
//   With Δ = 100ms:
//     Block time: ~100ms
//     Finality: ~300ms
//     View change: ~300ms`}
        </pre>
      </div>
    </section>
  );
}
