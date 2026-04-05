import ProtocolViz from './viz/ProtocolViz';

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS 임계값 서명 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BLS 임계값 서명(t-of-n) 기반. 결정론적 성질 덕분에 같은 입력에 대해 유일한 서명 존재
        </p>
      </div>
      <div className="not-prose"><ProtocolViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BLS Threshold Signature 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS Threshold Signature:

// Setup phase:
// 1. n operators
// 2. Distributed Key Generation (DKG)
// 3. each has secret share s_i
// 4. public key PK = Σ PK_i
// 5. threshold t = 2n/3 + 1

// Per-round protocol:
// Round r:
// 1. message m_r = "drand" || round_r
// 2. each operator i signs:
//    σ_i = s_i * H(m_r)
// 3. broadcast σ_i to peers
// 4. collect t signatures
// 5. combine: σ = Σ λ_i * σ_i
//    (Lagrange coefficients)
// 6. verify: e(σ, g) = e(H(m_r), PK)
// 7. publish (round_r, σ)

// Deterministic property:
// - same m_r → same σ
// - no operator can pick favorable
// - t operators agree or fail
// - no biasability

// Output derivation:
// randomness = SHA-256(σ)
// - 32 bytes
// - unpredictable until round
// - reproducible from σ

// Chain property:
// - each round tied to previous
// - prev_signature included in msg
// - continuous verification
// - forward-only

// Message format:
// struct Beacon {
//   round: uint64
//   signature: [96]byte     // BLS sig
//   previous_signature: [96]byte
//   randomness: [32]byte    // derived
// }

// Verification (client):
// 1. receive beacon
// 2. reconstruct m_r = round || prev_sig
// 3. verify BLS: e(sig, g) = e(H(m_r), PK)
// 4. verify randomness = SHA-256(sig)
// 5. check chain integrity

// Performance:
// - signing: <100ms per operator
// - aggregation: <50ms
// - verification: ~10ms
// - total period: 3 seconds
// - ~25K beacons per day

// Security:
// - BLS sig unforgeable
// - threshold security
// - operator independence
// - public audit trail

// Attack scenarios:
// - compromised < t operators: safe
// - DDoS t operators: liveness halt
// - coordination attack: economic/legal

// Client API:
// - HTTP: /public/latest
// - /public/{round}
// - gRPC: streaming beacons
// - WebSocket: real-time`}
        </pre>
        <p className="leading-7">
          BLS threshold: <strong>t of n signatures → unique combined sig</strong>.<br />
          deterministic, unbiasable, publicly verifiable.<br />
          3s period, chain of rounds, ~25K beacons/day.
        </p>
      </div>
    </section>
  );
}
