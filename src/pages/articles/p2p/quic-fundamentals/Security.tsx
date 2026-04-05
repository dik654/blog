import SecurityViz from './viz/SecurityViz';
import CodePanel from '@/components/ui/code-panel';

const tlsCode = `// QUIC의 TLS 1.3 통합 (RFC 9001)
// QUIC는 TLS 1.3을 "내장"합니다.
// TLS 핸드셰이크 메시지 → QUIC CRYPTO 프레임으로 전송

// 암호화 수준 (Encryption Level):
//   Initial   — 연결 시작 (HKDF-based 키)
//   Handshake — TLS 핸드셰이크 진행 중
//   1-RTT     — 핸드셰이크 완료 후 데이터
//   0-RTT     — PSK 기반 조기 데이터

// 패킷 보호:
//   Header Protection — 패킷 번호 암호화 (트래픽 분석 방어)
//   Payload Encryption — AEAD (AES-128-GCM 또는 ChaCha20-Poly1305)
//   Key Update         — 주기적 키 갱신으로 forward secrecy 강화`;

const tlsAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 3], color: 'sky', note: 'TLS를 별도 계층이 아닌 QUIC에 내장' },
  { lines: [5, 9], color: 'emerald', note: '4단계 암호화 수준' },
  { lines: [11, 14], color: 'amber', note: '헤더 + 페이로드 이중 보호' },
];

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보안: TLS 1.3 내장</h2>
      <div className="not-prose mb-8"><SecurityViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          QUIC는 TLS 1.3을 별도 계층이 아닌 프로토콜에 직접 통합합니다.<br />
          모든 QUIC 패킷은 Initial 패킷을 포함해 암호화됩니다.<br />
          평문 전송은 불가능합니다.
        </p>
        <CodePanel title="QUIC TLS 1.3 보안 구조" code={tlsCode}
          annotations={tlsAnnotations} />
        <p className="leading-7">
          iroh에서는 rustls 기반 TLS 1.3을 사용합니다.
          libp2p-quic에서도 quinn+rustls 조합으로 QUIC 보안을 제공합니다.<br />
          두 프로젝트 모두 자체 서명 인증서와 피어 ID 기반 인증을 지원합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">QUIC Packet Protection</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// QUIC Packet Format & Encryption
//
// Packet Structure:
//   ┌────────────────────────┐
//   │ Header (일부 암호화됨) │  ← Header Protection
//   ├────────────────────────┤
//   │ Packet Number         │  ← Header Protection
//   ├────────────────────────┤
//   │ Frames (Payload)      │  ← AEAD Encryption
//   │ + Auth Tag (16 bytes) │
//   └────────────────────────┘

// Two Layers of Protection:
//
// 1. Payload AEAD (body)
//    Algorithm: AES-128-GCM / ChaCha20-Poly1305
//    Key: derived from TLS 1.3
//    Nonce: packet_number XOR iv
//    AAD: header bytes
//
// 2. Header Protection
//    Encrypts: Packet Number + flags
//    Why? Packet number in plaintext
//         → Traffic analysis
//         → Reveals connection pattern
//    Algorithm: AES-ECB (simple sample)

// Encryption Levels (RFC 9001):
//
//   Initial:   HKDF from version-specific salt
//     first packet, includes ClientHello
//     attacker can recover (not secret)
//     purpose: DoS 방어
//
//   Handshake: TLS handshake keys
//     handshake messages
//
//   1-RTT:     Application data keys
//     normal data after handshake
//
//   0-RTT:     PSK-derived keys
//     early data resumption

// Key Update:
//   주기적 key rotation
//   old_key → new_key via HKDF
//   Packet header flag signals update
//   Forward secrecy 강화

// Connection ID:
//   Source + Destination CID
//   8-20 bytes (variable)
//   Connection migration 지원
//   NAT rebinding 시 유지

// 보안 속성:
//   ✓ Confidentiality (full encryption)
//   ✓ Integrity (AEAD tag)
//   ✓ Forward secrecy (ephemeral keys)
//   ✓ Anti-replay (packet numbers)
//   ✓ Identity hiding (header protection)

// 암호 스위트:
//   TLS_AES_128_GCM_SHA256 (기본)
//   TLS_AES_256_GCM_SHA384
//   TLS_CHACHA20_POLY1305_SHA256
//   TLS_AES_128_CCM_SHA256 (optional)

// Post-quantum 준비:
//   Kyber-hybrid handshake 연구 중
//   Google 실험 (2023)
//   IETF draft 작업 중`}
        </pre>
      </div>
    </section>
  );
}
