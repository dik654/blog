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
      </div>
    </section>
  );
}
