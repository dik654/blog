import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SwarmEventViz from './viz/SwarmEventViz';

const POLL_ORDER = [
  { priority: '1순위', target: 'behaviour.poll()', reason: '로컬 작업 우선 처리', color: '#6366f1' },
  { priority: '2순위', target: 'pool.poll()', reason: '기존 연결 유지 우선', color: '#10b981' },
  { priority: '3순위', target: 'transport.poll()', reason: '새 연결은 마지막', color: '#8b5cf6' },
];

const HANDLER_STEPS = [
  'Behaviour → ToSwarm::NotifyHandler 반환',
  'Swarm → pending_handler_event에 저장',
  '다음 루프: 해당 연결에 이벤트 전달',
  '전달 완료까지 Behaviour 폴링 중지',
];

export default function SwarmLoop({ onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="swarm-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swarm 이벤트 루프</h2>

      <div className="not-prose mb-8"><SwarmEventViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>Swarm::poll_next_event()</code>는 libp2p의 심장이다.<br />
          하나의 <code>loop {'{}'}</code> 안에서 세 컴포넌트를 <strong>우선순위 순</strong>으로 폴링한다.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 my-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">poll_next_event 우선순위</p>
        <div className="flex flex-col gap-2">
          {POLL_ORDER.map((p, i) => (
            <motion.div key={p.target}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: p.color + '40', background: p.color + '08' }}>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                style={{ background: p.color + '20', color: p.color }}>{p.priority}</span>
              <span className="text-xs font-mono font-bold"
                style={{ color: p.color }}>{p.target}</span>
              <span className="text-xs text-foreground/50">{p.reason}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 우선순위가 중요한 이유가 있다.<br />
          Behaviour가 Dial 요청을 내면 <strong>즉시 처리</strong>되어야 한다.<br />
          외부에서 오는 새 연결 수락은 늦어도 괜찮다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('poll-next-event', codeRefs['poll-next-event'])} />
            <CodeViewButton onClick={() => onCodeRef('swarm-struct', codeRefs['swarm-struct'])} />
            <CodeViewButton onClick={() => onCodeRef('swarm-dial', codeRefs['swarm-dial'])} />
          </div>
        )}

        <h3>pending_handler_event 전달</h3>
        <p>
          Behaviour가 <code>NotifyHandler</code>를 반환하면 바로 전달되지 않는다.<br />
          다음 루프에서 해당 연결을 찾아 이벤트를 넘긴다.<br />
          전달 완료까지 Behaviour 폴링은 <strong>중지</strong>된다.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 my-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">NotifyHandler 전달 흐름</p>
        <div className="flex flex-col gap-1.5">
          {HANDLER_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <span className="font-mono text-foreground/30 mt-0.5 w-4 shrink-0">{i + 1}</span>
              <span className="text-foreground/70">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>handle_behaviour_event 분기</h3>
        <p>
          Behaviour가 반환하는 <code>ToSwarm</code> 커맨드를 처리한다.
          <code>GenerateEvent</code>면 사용자에게 반환.
          <code>Dial</code>이면 <code>transport.dial()</code> 호출.
          <code>NotifyHandler</code>면 pending에 저장한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Swarm 구조와 이벤트 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p Swarm Architecture
//
// pub struct Swarm<TBehaviour: NetworkBehaviour> {
//     // Transport 조합 (TCP, QUIC 등)
//     transport: Box<dyn Transport>,
//
//     // Network behaviour (app logic)
//     behaviour: TBehaviour,
//
//     // Connection pool (per-peer connections)
//     pool: Pool<THandler>,
//
//     // Listener set
//     listeners: SmallVec<[Listener; 8]>,
//
//     // Local identity
//     local_peer_id: PeerId,
//
//     // Pending events
//     pending_event: Option<PendingEvent>,
//     pending_swarm_events: VecDeque<SwarmEvent<...>>,
// }

// poll_next_event() 구현:
//
// fn poll_next_event(self: Pin<&mut Self>,
//                    cx: &mut Context<'_>)
//     -> Poll<SwarmEvent<...>>
// {
//     loop {
//         // Pending events 먼저
//         if let Some(ev) = self.pending_swarm_events.pop_front() {
//             return Poll::Ready(ev);
//         }
//
//         // Delayed handler notification
//         if let Some((peer_id, handler_id, event)) =
//             self.pending_event.take()
//         {
//             match self.pool.send_to(peer_id, handler_id, event) {
//                 Ok(()) => {},
//                 Err(event) => {
//                     // re-store for later
//                     self.pending_event = Some((peer_id, handler_id, event));
//                     // Can't poll behaviour yet
//                     continue_behaviour_poll = false;
//                 }
//             }
//         }
//
//         // 1. Behaviour (highest priority)
//         if continue_behaviour_poll {
//             match self.behaviour.poll(cx) {
//                 Poll::Ready(to_swarm) => {
//                     return handle_behaviour_event(to_swarm);
//                 }
//                 Poll::Pending => {}
//             }
//         }
//
//         // 2. Pool (existing connections)
//         match self.pool.poll(cx) {
//             Poll::Ready(pool_event) => {
//                 return handle_pool_event(pool_event);
//             }
//             Poll::Pending => {}
//         }
//
//         // 3. Transport (new incoming connections)
//         match self.transport.poll(cx) {
//             Poll::Ready(t_event) => {
//                 return handle_transport_event(t_event);
//             }
//             Poll::Pending => {}
//         }
//
//         return Poll::Pending;
//     }
// }

// SwarmEvent 타입:
//   Behaviour(TBehaviour::ToSwarm)
//   ConnectionEstablished { peer_id, endpoint, ... }
//   ConnectionClosed { peer_id, cause }
//   IncomingConnection { local_addr, send_back_addr }
//   IncomingConnectionError { ... }
//   OutgoingConnectionError { ... }
//   NewListenAddr { listener_id, address }
//   ExpiredListenAddr { listener_id, address }
//   Dialing { peer_id, connection_id }
//   ListenerClosed { ... }
//   ListenerError { ... }`}
        </pre>
      </div>
    </section>
  );
}
