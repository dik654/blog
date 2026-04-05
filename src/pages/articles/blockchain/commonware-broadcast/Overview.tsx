import ArchLayerViz from './viz/ArchLayerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기존 브로드캐스트 문제 & 설계 목표</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 블록체인: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          대역폭 낭비(중복 전송) · 리더 병목(단일 노드 의존) · 리더 비응답 시 전체 지연
        </p>
        <p className="leading-7">
          Commonware의 접근: <strong>합의와 전파를 완전 분리</strong>
          <br />
          3계층 — <code>Broadcaster</code> trait(전파 추상화) → <code>ordered_broadcast</code>(인증서 체인) → <code>Zoda</code>(DA 샤딩)
        </p>
      </div>
      <div className="not-prose mb-8"><ArchLayerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Commonware Broadcast 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Commonware Broadcast Architecture
//
// Project:
//   commonware (github.com/commonwarexyz)
//   Rust toolkit for building blockchain infrastructure
//   Modular primitives: P2P, consensus, storage, crypto
//
// Problem with traditional broadcast:
//
//   Leader-based model:
//     Proposer generates block (e.g. 1 MB)
//     Must send 1 MB to ALL N validators
//     Total bandwidth at proposer: N * 1 MB
//     Bandwidth bottleneck scales with N
//
//   Issues:
//     - Leader bandwidth bottleneck
//     - Redundant transmissions
//     - Leader failure = missed slot
//     - Straggler effect (slow leader stalls)
//
//   Alternative (erasure-coded):
//     Reed-Solomon code block into N shards
//     Each validator sends 1/N * block size
//     Total bandwidth: distributed
//     But: shards need to be assembled
//
// Commonware philosophy:
//
//   "Separate broadcast from consensus entirely"
//
//   Consensus orders opaque identifiers (tips)
//   Broadcast handles data propagation
//   Independent scalability
//
//   Inspired by:
//     Narwhal/Bullshark DAG consensus
//     Celestia DA layer
//     EigenDA
//     Availability proofs

// Three-layer architecture:
//
//   Layer 1: Broadcaster trait (abstraction)
//     Minimal interface for message propagation
//     Hides implementation details
//     Pluggable engines
//
//   Layer 2: ordered_broadcast (certificate chains)
//     Multiple sequencers per chain
//     Height-indexed data
//     Quorum certificates for each height
//     Establishes causal ordering
//
//   Layer 3: Zoda (DA with erasure coding)
//     Reed-Solomon encoded blocks
//     Merkle-committed shards
//     Proof of availability
//     1-of-n honest shard holder sufficient

// Modules in commonware-broadcast:
//
//   broadcast/
//     src/
//       lib.rs                  // Broadcaster trait
//       buffered/
//         engine.rs             // general buffered engine
//       ordered_broadcast/
//         engine.rs             // main engine
//         ack_manager.rs        // partial sig aggregation
//         tip_manager.rs        // tip tracking per sequencer
//         types.rs              // Chunk, Node, Certificate, etc.
//       zoda/
//         scheme.rs             // Scheme trait + ZODA impl
//         validating_scheme.rs  // validation helper
//         phased_scheme.rs      // Strong/Weak sharding

// Key design decisions:
//
//   1) Trait-based: Broadcaster trait allows multiple engines
//   2) Async-first: oneshot channels for response delivery
//   3) Buffered: messages queued, flushed under network policy
//   4) Content-addressed: certificates reference data by hash
//   5) Epoch-based: signatures accept within epoch windows

// Comparison with other systems:
//
//   Narwhal (Mysten):
//     DAG-based broadcast
//     Mempool separation
//     Similar philosophy
//
//   Sui Consensus:
//     Bullshark on Narwhal DAG
//     Production version of DAG consensus
//
//   Celestia DA:
//     Reed-Solomon coded blobs
//     Light client sampling
//     Standalone DA layer
//
//   Commonware:
//     Modular library (not standalone chain)
//     Builds primitives for others
//     Rust-first, performance-focused

// Use cases:
//   - Custom L1 designs
//   - Rollup sequencers
//   - DA layers
//   - Any system needing ordered broadcast`}
        </pre>
      </div>
    </section>
  );
}
