import CryptoP2PViz from './viz/CryptoP2PViz';

export default function CryptoP2P() {
  return (
    <section id="crypto-p2p" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 & P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>cryptography::bls12381</strong> — BLS12-381 타원 곡선 기반 암호화 프리미티브
          <br />
          DKG(분산 키 생성, 보드리스 공유 분배) → Threshold Signatures(임계 서명, O(1) 96 bytes)
          <br />
          Resharing으로 검증자 세트 변경 대응 — Epoch 기반 키 리셰어링
        </p>
        <p className="leading-7">
          3가지 서명 스킴 지원:
          <br />
          <strong>ed25519</strong> — 빠른 서명/검증, 배치 검증 지원. 일반 용도
          <br />
          <strong>bls12381</strong> — 서명 집계, 임계 서명. 합의·크로스체인 검증에 핵심
          <br />
          <strong>secp256r1</strong> — NIST P-256, HSM 호환. 엔터프라이즈 환경
        </p>
        <p className="leading-7">
          <strong>p2p::authenticated</strong> — ECIES 암호화 연결 + 서명 기반 피어 인증 + 멀티플렉싱(다중 채널)
          <br />
          Blocker 인터페이스로 악의적 피어 차단 · 동적 피어 관리 · 네트워크 파티션 복구
          <br />
          <strong>p2p::simulated</strong> — 결정론적 시뮬레이션을 위한 가상 네트워크
        </p>
      </div>
      <div className="not-prose mb-8"><CryptoP2PViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BLS12-381 Threshold Signatures</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// BLS (Boneh-Lynn-Shacham) signatures
// Named after 3 cryptographers

// Properties
// - Deterministic (no randomness)
// - Short signatures (48 bytes)
// - Aggregation: n sigs → 1 sig
// - Threshold: t-of-n signing

// Signature aggregation
// σ_agg = σ_1 + σ_2 + ... + σ_n  (단순 group addition)
// verify_agg(σ_agg, pk_1+pk_2+...+pk_n, message) == true

// Threshold signature (t-of-n)
// 1) Distributed Key Generation (DKG)
//    - n parties generate shares of private key
//    - No single party knows full key
// 2) Signing
//    - Each party creates partial signature
//    - t parties combine → valid signature
// 3) Verification
//    - Standard BLS verification
//    - Verifier doesn't know who signed

// Use cases
// - Ethereum 2.0 validator signatures
// - Randomness beacons (drand)
// - Cross-chain bridges
// - Consensus aggregation

// Performance
// - Signature: 48 bytes (G1)
// - Public key: 96 bytes (G2)
// - Verification: 3 pairings (~2ms)
// - Aggregation: O(n) point additions
// - DKG setup: O(n²) interactive`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">P2P Authenticated Network</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// p2p::authenticated module

pub struct AuthenticatedPeer {
    peer_id: PublicKey,       // Ed25519 pubkey = identity
    secret_key: SecretKey,
    session_key: Option<SessionKey>,  // ECDH derived
    channels: HashMap<ChannelId, ChannelState>,
}

// Connection handshake
// 1) TCP connect
// 2) ECDH key exchange
// 3) Identity verification (signed challenge)
// 4) Session key derivation (ChaCha20-Poly1305)
// 5) Channel setup (multiplexing)

// Channel design
// - Logical streams over single TCP connection
// - Per-channel flow control
// - Ordered delivery per channel
// - Independent backpressure

// Message encryption
// - AEAD per message
// - Nonce = sequence number (replay 방어)
// - 16-byte auth tag

// Blocker interface
pub trait Blocker: Send + Sync {
    fn should_block(&self, peer: &PeerId) -> bool;
    fn on_misbehavior(&mut self, peer: &PeerId, kind: Misbehavior);
}

// 사용 예
// - Peer reputation tracking
// - Automated banning
// - Rate limiting
// - Allowlist/blocklist

// Network partitions
// - Node가 peer 연결 끊기
// - Reconnection with backoff
// - Gossip rediscovery
// - Eventual consistency`}</pre>

      </div>
    </section>
  );
}
