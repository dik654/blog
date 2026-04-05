import DigitalSigViz from './viz/DigitalSigViz';

export default function DigitalSignature() {
  return (
    <section id="digital-signature" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디지털 서명: ECDSA, EdDSA, BLS</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          메시지 무결성과 발신자 인증을 동시에 보장하는 서명 알고리즘 비교.
        </p>
      </div>
      <div className="not-prose"><DigitalSigViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">디지털 서명 알고리즘 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Digital Signature Algorithms
//
// ┌────────┬─────────────┬─────────┬──────────┬──────────┐
// │ 알고리즘│ 기반 문제  │ 키 크기 │ 서명 크기│ 사용처   │
// ├────────┼─────────────┼─────────┼──────────┼──────────┤
// │ RSA    │ Factoring   │ 3072+   │ 384 B    │ 전통적   │
// │ ECDSA  │ ECDLP       │ 256 bit │ 64-72 B  │ BTC, ETH │
// │ EdDSA  │ ECDLP       │ 256 bit │ 64 B     │ 현대 표준│
// │ BLS    │ Pairing     │ 256 bit │ 48 B     │ ETH 2.0  │
// │ Schnorr│ ECDLP       │ 256 bit │ 64 B     │ BTC (TR) │
// └────────┴─────────────┴─────────┴──────────┴──────────┘

// ECDSA (Elliptic Curve Digital Signature Algorithm)
//
// 서명 생성:
//   1. k = 랜덤 (nonce)
//   2. R = k·G, r = R.x mod n
//   3. s = k^(-1) · (hash(m) + r·priv) mod n
//   4. signature = (r, s)
//
// 검증:
//   1. u1 = hash(m) · s^(-1) mod n
//   2. u2 = r · s^(-1) mod n
//   3. R' = u1·G + u2·pub
//   4. r == R'.x ?
//
// 주의: nonce k 재사용 시 private key 노출!
//   (Sony PS3 해킹 사례)

// Ed25519 (EdDSA, Curve25519)
//
// 장점:
//   - Deterministic (k 재사용 문제 없음)
//   - Faster (batch verification)
//   - Stronger security guarantees
//   - Simpler implementation
//
// 서명:
//   r = SHA512(privkey || m)
//   R = r·G
//   S = r + SHA512(R || pub || m) · priv
//   signature = (R, S)

// BLS (Boneh-Lynn-Shacham)
//
// 특징:
//   - 짧은 서명 (48 bytes)
//   - Signature aggregation 가능
//   - Pairing 기반
//
// 집계 (Aggregation):
//   sig_agg = sig_1 · sig_2 · ... · sig_n
//   → 수천 서명을 하나로
//   → Ethereum 2.0 validator signatures
//   → Polygon, Dfinity 등

// Schnorr Signatures
//
// 장점:
//   - 선형성 (linearity) → 집계 쉬움
//   - MuSig 프로토콜 (multi-sig)
//   - Taproot (Bitcoin BIP-340)
//
// 서명:
//   R = k·G
//   s = k + hash(R || pub || m) · priv
//   signature = (R, s)

// 블록체인 별 사용:
//   Bitcoin:  ECDSA (legacy) + Schnorr (Taproot)
//   Ethereum: ECDSA (legacy) + BLS (consensus)
//   Solana:   Ed25519
//   Cosmos:   Ed25519
//   Polkadot: sr25519 (Schnorr variant)`}
        </pre>
      </div>
    </section>
  );
}
