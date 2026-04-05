import CodePanel from '@/components/ui/code-panel';
import NoiseUpgradeViz from './viz/NoiseUpgradeViz';
import {
  upgradeChainCode, upgradeAnnotations,
  noiseXXCode, noiseAnnotations,
  yamuxCode, yamuxAnnotations,
  quicCode, quicAnnotations,
} from './SecurityData';

export default function Security({ title }: { title?: string }) {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Transport & 보안 계층'}</h2>
      <div className="not-prose mb-8"><NoiseUpgradeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p의 연결은 항상 <strong>Transport → Security → Mux</strong> 순서로 업그레이드됩니다.<br />
          각 단계는 <code>multistream-select</code> 프로토콜로 협상합니다.
        </p>

        <h3>연결 업그레이드 체인</h3>
        <CodePanel title="TCP 연결 업그레이드 과정" code={upgradeChainCode} annotations={upgradeAnnotations} />

        <h3>Noise XX 핸드셰이크</h3>
        <CodePanel title="Noise XX 구현체" code={noiseXXCode} annotations={noiseAnnotations} />

        <h3>Yamux 멀티플렉싱</h3>
        <CodePanel title="Yamux 설정 & 프레임 구조" code={yamuxCode} annotations={yamuxAnnotations} />

        <h3>QUIC Transport</h3>
        <p>
          QUIC은 TLS 1.3과 멀티플렉싱을 내장하고 있어
          Security와 Mux 계층이 불필요합니다.<br />
          libp2p-quic은 quinn 라이브러리 위에 구현됩니다.
        </p>
        <CodePanel title="QUIC Transport" code={quicCode} annotations={quicAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Multistream-Select Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// libp2p의 협상 프로토콜
// 연결 설정 시 어떤 프로토콜 사용할지 결정

// Message format
// length-prefixed protocol name (LP-encoded)
// ex: "/noise/0.1.0"

// Handshake flow
Initiator → Responder: "/multistream/1.0.0"
Responder → Initiator: "/multistream/1.0.0" (OK)

Initiator → Responder: "/noise/0.1.0"
Responder → Initiator: "/noise/0.1.0" (OK, supported)
// OR
Responder → Initiator: "na" (not available)

// If na, initiator tries next
Initiator → Responder: "/plaintext/2.0.0"
// ... etc

// 장점
// ✓ Protocol negotiation inline
// ✓ Forward-compatible (new protocols)
// ✓ No fixed ordering
// ✓ Lazy evaluation (try preferred first)

// 단점
// ✗ Extra RTTs (one per protocol)
// ✗ LP encoding overhead
// ✗ String-based (slow parsing)

// Recent improvement: Protocol Select (2022)
// - Combined protocol negotiation
// - Single RTT
// - Fallback to multistream-select`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Transport Upgrader Pattern</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// libp2p connection stack
//
// ┌──────────────────────┐
// │  Application layer   │  (NetworkBehaviour)
// ├──────────────────────┤
// │  Multiplexer         │  (Yamux, Mplex)
// ├──────────────────────┤
// │  Security            │  (Noise, TLS)
// ├──────────────────────┤
// │  Transport           │  (TCP, QUIC, WebSocket)
// └──────────────────────┘

// Upgrader 역할
// Raw stream → Secure stream → Multiplexed connection

// Example: TCP + Noise + Yamux
1) TCP connection established (raw bytes)
2) multistream-select negotiates "/noise/0.1.0"
3) Noise XX handshake → AEAD encrypted stream
4) multistream-select negotiates "/yamux/1.0.0"
5) Yamux sub-streams opened

// Example: QUIC (integrated)
1) QUIC handshake (TLS 1.3 + UDP)
2) Security + Mux 내장, no upgrade needed
3) QUIC streams == libp2p sub-streams

// Code structure (Rust)
let transport = libp2p::tcp::TcpTransport::new()
    .upgrade(Version::V1)
    .authenticate(noise::NoiseAuthenticated::xx(&keypair))
    .multiplex(yamux::YamuxConfig::default())
    .boxed();

// QUIC 단순 버전
let transport = libp2p::quic::QuicTransport::new(&keypair)
    .boxed();`}</pre>

      </div>
    </section>
  );
}
