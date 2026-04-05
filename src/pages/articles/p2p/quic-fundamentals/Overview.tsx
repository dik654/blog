import QUICStackViz from './viz/QUICStackViz';

export default function Overview() {
  const features = [
    { metric: '0-RTT', desc: '첫 패킷 데이터', note: '이전 연결 세션 재사용' },
    { metric: 'UDP', desc: '전송 계층', note: 'TCP HOL blocking 제거' },
    { metric: 'TLS 1.3', desc: '내장 암호화', note: '핸드셰이크와 통합' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: UDP 기반 전송</h2>
      <div className="not-prose mb-8"><QUICStackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          QUIC는 Google이 설계하고 IETF가 RFC 9000으로 표준화한 전송 프로토콜입니다.<br />
          UDP 위에서 동작하며, TCP+TLS가 제공하는 기능을 단일 프로토콜로 통합합니다.<br />
          HTTP/3의 기반이자 P2P 네트워킹의 핵심 전송 계층입니다.
        </p>
        <h3>TCP의 한계</h3>
        <p className="leading-7">
          TCP는 단일 바이트 스트림이므로 하나의 패킷 손실이 모든 데이터를 차단합니다.<br />
          이를 <strong>Head-of-Line(HOL) blocking</strong>이라 합니다.<br />
          QUIC는 독립 스트림을 제공해 손실된 스트림만 차단됩니다.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
        {features.map(({ metric, desc, note }) => (
          <div key={desc} className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-center">
            <p className="text-2xl font-mono font-bold text-sky-400">{metric}</p>
            <p className="text-sm font-medium mt-1">{desc}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{note}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          iroh에서는 quinn 크레이트로 QUIC 연결을 구성합니다.<br />
          libp2p에서는 libp2p-quic 모듈이 QUIC 전송을 제공합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCP vs QUIC</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">TCP + TLS</th>
                <th className="border border-border px-3 py-2 text-left">QUIC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">전송 프로토콜</td>
                <td className="border border-border px-3 py-2">TCP (OS 커널)</td>
                <td className="border border-border px-3 py-2">UDP (userspace)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Handshake RTT</td>
                <td className="border border-border px-3 py-2">3 RTT (TCP+TLS)</td>
                <td className="border border-border px-3 py-2">1 RTT (0-RTT 가능)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">HOL blocking</td>
                <td className="border border-border px-3 py-2">Yes (byte stream)</td>
                <td className="border border-border px-3 py-2">No (independent streams)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Connection migration</td>
                <td className="border border-border px-3 py-2">No (IP:Port에 결속)</td>
                <td className="border border-border px-3 py-2">Yes (Connection ID)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Middlebox 호환</td>
                <td className="border border-border px-3 py-2">Well-known</td>
                <td className="border border-border px-3 py-2">일부 차단</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">CPU 비용</td>
                <td className="border border-border px-3 py-2">Lower (kernel accel)</td>
                <td className="border border-border px-3 py-2">Higher (userspace crypto)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">0-RTT Connection Resumption</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 기존 TCP+TLS 1.2 handshake
// Total: 3 RTT
//
// 1) TCP SYN → SYN-ACK → ACK (1 RTT)
// 2) TLS ClientHello → ServerHello (1 RTT)
// 3) TLS Finished → Finished (1 RTT)
// → First data byte: ~3 RTT

// TLS 1.3 (TCP+TLS)
// Total: 2 RTT
//
// 1) TCP: 1 RTT
// 2) TLS: 1 RTT (combined)
// → First data: ~2 RTT

// QUIC (first connection)
// Total: 1 RTT
//
// 1) Initial (contains ClientHello)
// 2) Handshake + 0-RTT data possible
// → First data: 1 RTT

// QUIC 0-RTT (resumed connection)
// Total: 0 RTT
//
// Client sends data with first packet!
// Using cached session parameters
// → First data: immediately

// Trade-off
// ✗ 0-RTT data is vulnerable to replay
// ✗ Only safe for idempotent requests
// ✓ Huge latency improvement`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Connection Migration</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// TCP connection = (src_ip, src_port, dst_ip, dst_port)
// 4-tuple 변경 시 connection reset

// 문제 시나리오
// - Mobile device: WiFi → 4G switch
// - NAT rebinding (port change)
// - IP rotation (VPN)
// - Load balancer IP change

// TCP 결과: connection broken, 재연결 필요

// QUIC Connection ID
// - Independent of IP/port
// - 64-bit or 128-bit random ID
// - Server assigns, client uses

// Migration flow
// 1) Client connected via WiFi (IP_1)
// 2) WiFi disconnects, 4G connects (IP_2)
// 3) Client sends packet from IP_2 with same Connection ID
// 4) Server: "IP 변경됐네, path validation 필요"
// 5) PATH_CHALLENGE → PATH_RESPONSE
// 6) Continue seamlessly

// 효과
// - Mobile app: no reconnection
// - Streaming: no buffering spike
// - Real-time: no state loss

// libp2p QUIC
// - PeerId = stable identity
// - Connection survives network changes
// - NAT-friendly`}</pre>

      </div>
    </section>
  );
}
