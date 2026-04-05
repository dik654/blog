import CodePanel from '@/components/ui/code-panel';
import NoiseXXHandshakeViz from './viz/NoiseXXHandshakeViz';
import {
  noisePayloadCode, noisePayloadAnnotations,
  keyExchangeCode, keyExchangeAnnotations,
} from './SecurityLayerData';

export default function SecurityLayer({ title }: { title?: string }) {
  return (
    <section id="security-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '보안 계층: Noise 프로토콜'}</h2>
      <div className="not-prose mb-8"><NoiseXXHandshakeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p — <strong>Noise Framework</strong> XX 패턴으로 보안 채널 수립<br />
          X.509 인증서 없이 공개키 기반 신원 인증 +
          전방향 비밀(Forward Secrecy) 달성
        </p>

        <h3>신원 바인딩 Payload</h3>
        <p>
          Noise 핸드셰이크 중 libp2p Ed25519 키로
          DH 공개키 서명 — DH 키교환과 PeerId 인증을 동시 수행
        </p>
        <CodePanel title="Noise 핸드셰이크 Payload" code={noisePayloadCode}
          annotations={noisePayloadAnnotations} />

        <h3>X25519 키 교환 상세</h3>
        <p>
          XX 패턴 — 총 3번의 DH 연산(ee, es, se) 수행<br />
          양방향 인증 + 전방향 비밀 동시 달성
        </p>
        <CodePanel title="X25519 DH 키 교환" code={keyExchangeCode}
          annotations={keyExchangeAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Noise Protocol Framework</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Noise Framework (2016, Trevor Perrin)
// 암호 프로토콜 구성 블록
// Signal, WireGuard, libp2p 등 사용

// Noise Patterns
// Notation: Initiator → Responder
// N: no static key, K: known static, X: transmitted static

// Patterns
// NN: zero-key (no auth, no identity)
// NK: server knows client has key
// KN: client knows server has key
// KK: mutual known (pre-shared)
// XX: mutually transmitted (most flexible)
// IX: Immediate (fewer RTTs)

// libp2p uses Noise_XX_25519_ChaChaPoly_SHA256
// - XX: mutual identity exchange
// - 25519: X25519 Diffie-Hellman
// - ChaChaPoly: ChaCha20-Poly1305 AEAD
// - SHA256: hash function

// XX Handshake (3 messages)
// Msg 1: → e
//   Initiator sends ephemeral key
// Msg 2: ← e, ee, s, es
//   Responder sends e, computes ee, sends s, computes es
// Msg 3: → s, se
//   Initiator sends s, computes se

// DH operations
// ee: initiator ephemeral × responder ephemeral
// es: initiator ephemeral × responder static
// se: initiator static × responder ephemeral
// ss: not used in XX

// Result
// - Mutual authentication
// - Forward secrecy (ephemeral keys)
// - 1.5 RTT (faster than TLS 1.2)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">libp2p Peer Identity Binding</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// libp2p의 핵심: PeerId == identity
// PeerId = hash(libp2p pubkey)
// - Ed25519, RSA, or Secp256k1 key
// - Multihash encoded

// Noise payload에 libp2p signature 포함
// 목적: Noise static key를 libp2p key에 바인딩

// Handshake flow
// 1) Generate Noise static keypair (X25519)
// 2) Sign Noise static pubkey with libp2p key
// 3) Send signed identity + libp2p pubkey in handshake

// Signature verification
// receiver:
//   extract libp2p_pubkey from payload
//   compute peer_id = hash(libp2p_pubkey)
//   verify signature matches libp2p_pubkey on noise_static_pubkey
//   If valid: peer_id authenticated

// Why this design?
// - libp2p keys used for long-term identity
// - Noise keys used for handshake only
// - Separation = flexibility
//   (upgrade crypto without changing identity)
// - Compatible with multiple key types

// Security
// ✓ PeerId can't be spoofed
// ✓ Session keys forward-secret
// ✓ No static CA needed
// ✓ Works over any transport`}</pre>

      </div>
    </section>
  );
}
