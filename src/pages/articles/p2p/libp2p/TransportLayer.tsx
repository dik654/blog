import CodePanel from '@/components/ui/code-panel';
import TransportUpgradeViz from './viz/TransportUpgradeViz';
import {
  transportTraitCode, transportTraitAnnotations,
  transportComparison, upgradeCode, upgradeAnnotations,
} from './TransportLayerData';

export default function TransportLayer({ title }: { title?: string }) {
  return (
    <section id="transport" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Transport 계층'}</h2>
      <div className="not-prose mb-8"><TransportUpgradeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transport 트레이트는 libp2p의 <strong>네트워크 추상화 경계</strong>입니다.<br />
          TCP, QUIC, WebSocket, WebRTC를 동일한 인터페이스로 다룰 수 있습니다.
        </p>
        <h3>Transport 트레이트</h3>
        <CodePanel title="Transport 트레이트 정의" code={transportTraitCode}
          annotations={transportTraitAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>Transport 비교</h3>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['Transport', 'Multiaddr', 'Security', 'Mux', 'Latency'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transportComparison.map(t => (
              <tr key={t.transport} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold" style={{ color: t.color }}>
                  {t.transport}
                </td>
                <td className="py-2 px-3 font-mono text-foreground/50">{t.proto}</td>
                <td className="py-2 px-3 text-foreground/70">{t.security}</td>
                <td className="py-2 px-3 text-foreground/70">{t.mux}</td>
                <td className="py-2 px-3 text-foreground/60">{t.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>연결 업그레이드 과정</h3>
        <CodePanel title="TCP 연결 업그레이드 상세" code={upgradeCode}
          annotations={upgradeAnnotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Transport 옵션 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p Transport Options
//
// 1. TCP
//    Multiaddr: /ip4/1.2.3.4/tcp/4001
//    - 가장 기본
//    - 방화벽 친화적 (대부분 허용)
//    - Security: Noise or TLS (별도 upgrade)
//    - Mux: Yamux or Mplex
//    - Latency: ~50-200ms (handshake 포함)
//
// 2. QUIC
//    Multiaddr: /ip4/1.2.3.4/udp/4001/quic-v1
//    - UDP 기반
//    - Security + Mux 내장 (TLS 1.3)
//    - 0-RTT resumption
//    - Latency: ~0-1 RTT
//    - Mobile friendly (connection migration)
//
// 3. WebSocket
//    Multiaddr: /ip4/1.2.3.4/tcp/443/wss
//    - 브라우저 호환
//    - TLS + WSS (secure)
//    - HTTP upgrade → websocket
//    - 방화벽 쉽게 통과 (port 443)
//
// 4. WebTransport
//    Multiaddr: /ip4/1.2.3.4/udp/4001/webtransport
//    - Modern 브라우저
//    - QUIC 기반
//    - Uni/Bi-directional streams
//    - 2023+ 표준
//
// 5. WebRTC
//    - NAT traversal 내장 (ICE)
//    - 브라우저 peer-to-peer
//    - SCTP over DTLS
//    - 복잡한 setup

// Connection Upgrade 흐름 (TCP):
//
//   1. TCP socket 수립
//   2. multistream-select: security 선택
//      /noise or /tls
//   3. Noise/TLS handshake
//   4. multistream-select: mux 선택
//      /yamux/1.0.0 or /mplex/6.7.0
//   5. Yamux/Mplex 초기화
//   6. 이제 upgrade 완료
//   7. Protocol negotiation (per stream)
//
//   각 upgrade = 1 RTT
//   TCP + Noise + Yamux = ~3 RTT
//
// QUIC은 단축:
//   1. QUIC handshake (TLS 1.3 포함)
//   2. 끝 (security + mux 내장)
//   → 0-1 RTT

// 실무 선택:
//   일반 서버: TCP + Noise + Yamux (proven)
//   고성능: QUIC (새로운 표준)
//   브라우저: WebSocket, WebTransport
//   Mobile: QUIC (connection migration)

// Multiaddress 조합 예:
//   /ip4/1.2.3.4/tcp/4001/p2p/QmID
//   /dns4/example.com/tcp/443/wss/p2p/QmID
//   /ip6/::1/udp/4001/quic-v1/p2p/QmID
//   /ip4/127.0.0.1/tcp/4001/p2p/QmID1/p2p-circuit/p2p/QmID2`}
        </pre>
      </div>
    </section>
  );
}
