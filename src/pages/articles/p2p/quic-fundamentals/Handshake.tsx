import HandshakeViz from './viz/HandshakeViz';
import CodePanel from '@/components/ui/code-panel';

const handshakeCode = `// QUIC 1-RTT 핸드셰이크 (RFC 9001)
Client                          Server
  |--- Initial (ClientHello) --->|   // CRYPTO 프레임에 TLS ClientHello
  |<-- Initial (ServerHello) ----|   // ServerHello + EncryptedExtensions
  |<-- Handshake (Cert, Fin) ----|   // 서버 인증서 + Finished
  |--- Handshake (Finished) ---->|   // 클라이언트 Finished
  |<======= 1-RTT 완료 ========>|   // 양방향 암호화 데이터 전송 가능

// 0-RTT 재연결 (이전 세션 PSK 사용)
Client                          Server
  |--- Initial + 0-RTT Data --->|   // PSK로 즉시 데이터 전송
  |<-- Initial + Handshake -----|   // 서버 응답
  |<======= 0-RTT 완료 ========>|   // 첫 패킷부터 데이터 포함`;

const handshakeAnnotations: { lines: [number, number]; color: 'sky' | 'emerald'; note: string }[] = [
  { lines: [2, 6], color: 'sky', note: '1-RTT: TLS 핸드셰이크와 QUIC 통합' },
  { lines: [9, 12], color: 'emerald', note: '0-RTT: PSK로 첫 패킷부터 데이터' },
];

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핸드셰이크: 0-RTT & 1-RTT</h2>
      <div className="not-prose mb-8"><HandshakeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          QUIC는 TLS 1.3 핸드셰이크를 전송 계층 핸드셰이크와 통합합니다.<br />
          TCP+TLS는 최소 2 RTT가 필요하지만, QUIC는 <strong>1-RTT</strong>에 완료합니다.<br />
          이전 연결의 PSK(Pre-Shared Key)가 있으면 <strong>0-RTT</strong>도 가능합니다.
        </p>
        <h3>0-RTT의 보안 고려사항</h3>
        <p className="leading-7">
          0-RTT 데이터는 재전송 공격(replay attack)에 취약합니다.<br />
          서버는 0-RTT 데이터를 <strong>멱등(idempotent)</strong> 요청에만 허용해야 합니다.<br />
          QUIC 구현체는 anti-replay 토큰으로 이를 완화합니다.
        </p>
        <CodePanel title="QUIC 핸드셰이크 흐름" code={handshakeCode}
          annotations={handshakeAnnotations} />
      </div>
    </section>
  );
}
