import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const methods = [
  { fn: 'listen_protocol()', desc: '인바운드 서브스트림에 적용할 프로토콜을 광고한다. SubstreamProtocol을 반환.' },
  { fn: 'poll()', desc: 'ConnectionHandlerEvent를 반환. OutboundSubstreamRequest 또는 NotifyBehaviour.' },
  { fn: 'on_behaviour_event()', desc: 'Behaviour가 NotifyHandler로 보낸 메시지를 수신한다.' },
  { fn: 'on_connection_event()', desc: '서브스트림 협상 완료(FullyNegotiated) 또는 실패 이벤트를 처리.' },
];

const negotiationSteps = [
  'Handler가 poll()에서 OutboundSubstreamRequest 반환',
  'Swarm이 Muxer에서 새 서브스트림 할당',
  'multistream-select로 프로토콜 협상 (/ipfs/kad/1.0.0 등)',
  'FullyNegotiatedOutbound 이벤트가 on_connection_event()로 전달',
  'Handler가 협상된 스트림 위에서 프로토콜 I/O 시작',
];

export default function HandlerTrait({ title, onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="handler-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'ConnectionHandler 트레이트'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ConnectionHandler</strong>는 개별 연결(피어 1명)에 대한 프로토콜 핸들러다.<br />
          Behaviour가 연결 <em>전체</em>를 관리하면, Handler는 연결 <em>하나</em>를 관리한다.
        </p>

        <h3>핵심 메서드</h3>
      </div>

      <div className="space-y-2 mt-3">
        {methods.map((m, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border px-4 py-2.5">
            <span className="font-mono text-xs text-emerald-500 mt-0.5 shrink-0">{i + 1}</span>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground/90">{m.fn}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>서브스트림 협상 흐름</h3>
        <p>
          Handler가 새 아웃바운드 스트림을 요청하면, Swarm이 Muxer(멀티플렉서)를 통해 스트림을 할당하고
          multistream-select 프로토콜로 양측이 합의한다.
        </p>
      </div>

      <div className="space-y-1.5 mt-3">
        {negotiationSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5 text-sm">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/15 text-violet-500 text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-foreground/75">{step}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>유휴 연결 관리</h3>
        <p>
          <code>connection_keep_alive()</code>가 <code>false</code>를 반환하면 유휴 연결은 자동 종료된다.<br />
          Kademlia Handler는 쿼리 진행 중에만 <code>true</code>를 반환하고,
          쿼리가 끝나면 <code>false</code>로 전환해 리소스를 해제한다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('connection-handler', codeRefs['connection-handler'])} />
          <CodeViewButton onClick={() => onCodeRef('swarm-event', codeRefs['swarm-event'])} />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ConnectionHandler 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ConnectionHandler Trait (Rust)
//
// pub trait ConnectionHandler: Send + 'static {
//     type FromBehaviour: Send + 'static;
//     type ToBehaviour: Send + 'static;
//     type InboundProtocol: InboundUpgradeSend;
//     type OutboundProtocol: OutboundUpgradeSend;
//     type InboundOpenInfo: Send + 'static;
//     type OutboundOpenInfo: Send + 'static;
//
//     // Advertise 지원 프로토콜
//     fn listen_protocol(&self) -> SubstreamProtocol<
//         Self::InboundProtocol,
//         Self::InboundOpenInfo
//     >;
//
//     // 메인 이벤트 루프
//     fn poll(&mut self, cx: &mut Context<'_>)
//         -> Poll<ConnectionHandlerEvent<
//             Self::OutboundProtocol,
//             Self::OutboundOpenInfo,
//             Self::ToBehaviour,
//         >>;
//
//     // Behaviour 이벤트 수신
//     fn on_behaviour_event(&mut self, event: Self::FromBehaviour);
//
//     // Substream 협상 완료/실패 알림
//     fn on_connection_event(
//         &mut self,
//         event: ConnectionEvent<
//             Self::InboundProtocol,
//             Self::OutboundProtocol,
//             Self::InboundOpenInfo,
//             Self::OutboundOpenInfo,
//         >,
//     );
// }

// Handler vs Behaviour:
//
//   Behaviour:
//     - 모든 peer 관리 (global state)
//     - Protocol logic (Kademlia routing, etc.)
//     - Event coordination
//
//   Handler:
//     - 1 peer per connection (local state)
//     - Substream I/O
//     - Protocol-specific framing
//     - Keep-alive decision

// Per-connection example:
//
//   Kademlia로 1000 peers 연결 시:
//     1 Kademlia Behaviour
//     1000 Kademlia ConnectionHandler instances
//
//     Behaviour = routing table, queries
//     Handler = per-peer RPC state

// Substream Negotiation Flow:
//
//   Handler → OutboundSubstreamRequest
//     protocol: "/ipfs/kad/1.0.0"
//
//   Connection::poll():
//     muxer.poll_outbound() → raw stream
//     multistream-select("/ipfs/kad/1.0.0")
//
//   On success:
//     FullyNegotiatedOutbound event
//     Handler gets negotiated stream
//
//   Handler.on_connection_event(FullyNegotiated):
//     start protocol I/O
//     read/write framed messages

// Keep-Alive:
//   connection_keep_alive(): bool
//   true → 유지
//   false → idle timeout 후 close
//
//   Kademlia: query 진행 중만 true
//   Identify: 항상 false (one-shot)
//   GossipSub: mesh peer면 true`}
        </pre>
      </div>
    </section>
  );
}
