import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const METHODS = [
  { name: 'listen_on()', desc: 'ListenerId + Multiaddr → 리스닝 시작', color: '#10b981' },
  { name: 'dial()', desc: 'Multiaddr + DialOpts → Dial Future 반환', color: '#f59e0b' },
  { name: 'poll()', desc: 'TransportEvent (Incoming, NewAddress 등) 반환', color: '#8b5cf6' },
];

const COMPARE = [
  { transport: 'TCP', upgrade: 'Security + Mux 별도 업그레이드 필요', steps: 3, color: '#ef4444' },
  { transport: 'QUIC', upgrade: 'TLS 1.3 + 스트림 다중화 내장', steps: 1, color: '#06b6d4' },
];

export default function TransportTrait({ onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="transport-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Transport 트레이트 추상화</h2>

      {/* 핵심 메서드 3개 시각화 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">Transport 핵심 메서드</p>
        <div className="flex flex-col gap-2">
          {METHODS.map((m, i) => (
            <motion.div key={m.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: m.color + '40', background: m.color + '08' }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: m.color }}>{m.name}</span>
              <span className="text-xs text-foreground/60">{m.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transport 트레이트는 libp2p의 가장 아래 추상화 계층이다.<br />
          역할은 단순하다. <strong>주소를 받아 연결을 만든다.</strong>
        </p>
        <p>
          TCP, QUIC, WebSocket 전부 이 트레이트를 구현한다.<br />
          Swarm 입장에서는 어떤 물리 계층인지 몰라도 된다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])} />
            <CodeViewButton onClick={() => onCodeRef('transport-event', codeRefs['transport-event'])} />
            <CodeViewButton onClick={() => onCodeRef('tcp-transport', codeRefs['tcp-transport'])} />
          </div>
        )}

        <h3>왜 Future가 아니라 poll()인가?</h3>
        <p>
          Transport에 async fn이 아닌 <code>poll()</code>을 쓴 이유가 있다.<br />
          Swarm은 <strong>단일 루프</strong>에서 여러 Transport를 직접 폴링한다.<br />
          Future라면 각각 spawn해야 한다. poll이면 spawn 없이 순차 폴링이 가능하다.
        </p>
      </div>

      {/* TCP vs QUIC 비교 */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-3">TCP vs QUIC 업그레이드 차이</p>
        <div className="flex flex-col gap-2">
          {COMPARE.map(c => (
            <div key={c.transport}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: c.color + '40', background: c.color + '08' }}>
              <span className="text-xs font-mono font-bold w-12"
                style={{ color: c.color }}>{c.transport}</span>
              <span className="text-xs text-foreground/60 flex-1">{c.upgrade}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: c.color + '15', color: c.color }}>
                {c.steps === 1 ? '1단계 완료' : `${c.steps}단계 필요`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>
          TCP는 Output이 <code>(PeerId, StreamMuxerBox)</code>까지 가려면
          Security(Noise) + Mux(Yamux) 업그레이드가 필요하다.<br />
          QUIC는 TLS 1.3과 스트림 다중화가 내장이라 Transport 하나로 완료된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Transport Trait 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Transport Trait (libp2p-core)
//
// pub trait Transport {
//     // Output type after successful connection
//     type Output;
//
//     // Error type
//     type Error: Error + Send + Sync + 'static;
//
//     // Listener stream
//     type ListenerUpgrade: Future<Output = Result<Self::Output, Self::Error>>;
//
//     // Dial future
//     type Dial: Future<Output = Result<Self::Output, Self::Error>>;
//
//     // Start listening on address
//     fn listen_on(
//         &mut self,
//         id: ListenerId,
//         addr: Multiaddr,
//     ) -> Result<(), TransportError<Self::Error>>;
//
//     // Remove listener
//     fn remove_listener(&mut self, id: ListenerId) -> bool;
//
//     // Dial peer at address
//     fn dial(
//         &mut self,
//         addr: Multiaddr,
//         opts: DialOpts,
//     ) -> Result<Self::Dial, TransportError<Self::Error>>;
//
//     // Poll for events
//     fn poll(
//         self: Pin<&mut Self>,
//         cx: &mut Context<'_>,
//     ) -> Poll<TransportEvent<Self::ListenerUpgrade, Self::Error>>;
// }

// TransportEvent:
//   Incoming {
//     listener_id,
//     upgrade,        // Future<Output = Connection>
//     local_addr,
//     send_back_addr,
//   }
//   NewAddress { listener_id, listen_addr }
//   AddressExpired { listener_id, listen_addr }
//   ListenerClosed { listener_id, reason }
//   ListenerError { listener_id, error }

// Transport 조합 (combinator pattern):
//
//   tcp::Transport                   // TCP only
//     .upgrade(Version::V1)           // Upgrade layer
//     .authenticate(noise)            // + Security
//     .multiplex(yamux)               // + Mux
//     .timeout(20s)                   // + Timeout
//     .boxed()                        // Type erasure
//
// 최종 output: (PeerId, StreamMuxerBox)

// OrTransport (여러 Transport 조합):
//   tcp.or_transport(websocket)
//     .or_transport(quic)
//   → 각 Multiaddr에 맞는 transport 선택

// MemoryTransport:
//   테스트용 in-memory transport
//   Multiaddr: /memory/<channel_id>
//   네트워크 없이 peer 통신

// DnsConfig:
//   DNS 이름 → IP 변환
//   /dns4/example.com/tcp/4001 지원
//   Fresh resolution per connection

// 주요 구현 (Rust):
//   libp2p-tcp (TCP)
//   libp2p-quic (QUIC)
//   libp2p-websocket (WS)
//   libp2p-webtransport (QUIC-based)
//   libp2p-memory-connection-limits
//   libp2p-dns`}
        </pre>
      </div>
    </section>
  );
}
