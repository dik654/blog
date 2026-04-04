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
      </div>
    </section>
  );
}
