import ECComparisonViz from './viz/ECComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        RS vs Fountain vs LDPC 비교
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          MDS(최적) vs Rateless vs Near-MDS &mdash; 코드 유형별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ECComparisonViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EC 코드 비교 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Erasure Coding 3가지 비교:

// 1. Reed-Solomon (MDS):
// Properties:
// - MDS (Maximum Distance Separable)
// - any k of n pieces
// - optimal redundancy
// - polynomial-based
//
// Performance:
// - encode: O(nk) or O(n log n)
// - decode: O(k^2) or O(k log k)
// - field ops (GF)
//
// Use cases:
// - storage systems
// - blockchain DA
// - CD/DVD
// - satellite comms
//
// Libraries:
// - ISA-L (Intel)
// - leopard (GoLang)
// - klauspost/reedsolomon
// - cauchy-rs (Rust)

// 2. Fountain Codes (Rateless):
// Properties:
// - rateless (n arbitrary)
// - slight over-reception needed
// - k(1+ε) pieces to decode
// - ε ≈ 0.05-0.1

// Performance:
// - encode: O(n log k)
// - decode: O(k log k)
// - XOR operations
// - simpler than RS

// Types:
// - LT codes (Luby Transform)
// - Raptor codes (more efficient)
// - RaptorQ (RFC 6330)

// Use cases:
// - network broadcast
// - streaming
// - flexible rate transmission

// 3. LDPC (Low-Density Parity-Check):
// Properties:
// - Near-MDS
// - iterative decoding
// - parity-check matrix
// - sparse graph representation

// Performance:
// - decode: O(n) iterative
// - very fast hardware
// - optimized for specific n

// Use cases:
// - 5G (3GPP LDPC)
// - Wi-Fi (802.11n+)
// - 10G Ethernet
// - NAND flash ECC

// 비교 테이블:
// ┌─────────┬────────┬────────┬────────┐
// │   Code  │   MDS  │ Speed  │ Complex│
// ├─────────┼────────┼────────┼────────┤
// │   RS    │  Yes   │ Medium │  Low   │
// │ Fountain│  No    │  Fast  │ Medium │
// │  LDPC   │ Near   │ Fast+  │  High  │
// └─────────┴────────┴────────┴────────┘

// 선택 기준:
// - optimal redundancy: RS
// - unknown channel: Fountain
// - speed critical: LDPC
// - blockchain: RS (provable)`}
        </pre>
        <p className="leading-7">
          3 code types: <strong>RS (MDS), Fountain (rateless), LDPC (near-MDS)</strong>.<br />
          RS: blockchain 표준 (provable).<br />
          Fountain: streaming, LDPC: 5G/Wi-Fi hardware.
        </p>
      </div>
    </section>
  );
}
