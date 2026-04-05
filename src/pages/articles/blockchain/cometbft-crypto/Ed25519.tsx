import { codeRefs } from './codeRefs';
import SignVerifyViz from './viz/SignVerifyViz';
import type { CodeRef } from '@/components/code/types';

export default function Ed25519({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ed25519 서명 & 검증</h2>
      <div className="not-prose mb-8">
        <SignVerifyViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Ed25519 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Ed25519 — Edwards 곡선 서명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ed25519 (RFC 8032)
// Daniel J. Bernstein et al. 설계

// Curve25519 기반 twisted Edwards 곡선:
// -x^2 + y^2 = 1 + d*x^2*y^2
// 256-bit prime field, cofactor 8
// ~128-bit 보안 수준

// Key/Signature 크기:
// PrivateKey: 32 bytes (seed)
// PublicKey: 32 bytes (compressed point)
// Signature: 64 bytes (r + s)

// CometBFT의 Ed25519:
// cometbft/crypto/ed25519/ed25519.go

type PubKey []byte  // 32 bytes
type PrivKey []byte // 64 bytes (32-byte seed + 32-byte pubkey cache)

// Address 유도 (20 bytes):
func (pubKey PubKey) Address() Address {
    return Address(tmhash.SumTruncated(pubKey))
    // SHA256(pubkey)[:20]
}

// 서명:
func (privKey PrivKey) Sign(msg []byte) ([]byte, error) {
    return ed25519.Sign(privKey.Bytes(), msg), nil
    // Go 표준 crypto/ed25519 사용
}

// 검증:
func (pubKey PubKey) VerifySignature(msg, sig []byte) bool {
    if len(sig) != ed25519.SignatureSize { return false }
    return ed25519.Verify(pubKey.Bytes(), msg, sig)
}

// 내부 구현:
// - Go 표준: crypto/ed25519 (x/crypto 기반)
// - Assembly 최적화 (amd64, arm64)
// - constant-time 연산 (side-channel 방어)`}
        </pre>
        <p className="leading-7">
          CometBFT가 <strong>Ed25519 (Go 표준)</strong> 사용.<br />
          32 bytes pubkey + 64 bytes signature + 20 bytes address.<br />
          Go assembly 최적화 → 빠른 서명/검증.
        </p>

        {/* ── Batch Verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Verification — 투표 일괄 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ed25519 batch verification (RFC 8032 Section 8.2)
// N 서명을 단일 연산으로 검증

// 배치 검증 수학:
// 단일: e(G, sig) == e(pubkey, H(msg))
// 배치: e(G, sum(z_i * sig_i)) == e(G, sum(z_i * s_i))
//       (random z_i coefficient로 합산)

// 성능 (crypto/ed25519/batch):
// - 단일 verify: ~60μs
// - 배치 100개: ~1.5ms (60배 가속)
// - 배치 1000개: ~14ms (~400배 가속)

// CometBFT 사용처:
// 1. Vote batch verification
// 한 라운드에 100+ validators 투표 수집
// 모두 같은 높이/타입이면 배치 가능
//
// 2. PartSetHeader.Verify
// 블록 파트들의 서명 배치 검증
//
// 3. Commit verification
// LastCommit의 모든 Vote 일괄 검증

// 주의사항:
// - 배치 검증 실패 → 어떤 서명이 문제인지 모름
// - fallback: 개별 검증으로 bad signature 찾기
// - strict subgroup check 필요 (small subgroup attack)

// Go 구현 예시:
import "crypto/ed25519"

func batchVerify(pubkeys [][]byte, msgs [][]byte, sigs [][]byte) bool {
    // Go 1.23+ batch API
    return ed25519.VerifyBatch(pubkeys, msgs, sigs)
}`}
        </pre>
        <p className="leading-7">
          Ed25519 <strong>batch verification</strong>이 핵심 성능 강점.<br />
          100 서명 배치 = 단일 60배 가속.<br />
          Vote/Commit 집계 검증에 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Ed25519 vs secp256k1</strong> — 이더리움은 secp256k1이지만 CometBFT는 Ed25519를 선택.<br />
          검증 속도 ~2배, batch verification 지원. 합의 라운드마다 수십 투표를 처리하는 BFT에 최적.
        </p>
      </div>
    </section>
  );
}
