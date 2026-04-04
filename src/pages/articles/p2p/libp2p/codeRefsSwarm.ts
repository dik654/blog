import type { CodeRef } from '@/components/code/types';

export const swarmCodeRefs: Record<string, CodeRef> = {
  'swarm-struct': {
    path: 'swarm/src/lib.rs — Swarm<TBehaviour> 구조체',
    lang: 'rust',
    highlight: [1, 32],
    desc: 'Swarm은 transport·pool·behaviour 세 계층을 하나로 묶는 중앙 조율자입니다.',
    code: `pub struct Swarm<TBehaviour>
where
    TBehaviour: NetworkBehaviour,
{
    /// [\`Transport\`] for dialing remote peers and listening for incoming connection.
    transport: transport::Boxed<(PeerId, StreamMuxerBox)>,

    /// The nodes currently active.
    pool: Pool<THandler<TBehaviour>>,

    /// The local peer ID.
    local_peer_id: PeerId,

    /// Handles which nodes to connect to and how to handle the events sent back by the protocol
    /// handlers.
    behaviour: TBehaviour,

    /// List of protocols that the behaviour says it supports.
    supported_protocols: SmallVec<[Vec<u8>; 16]>,

    confirmed_external_addr: HashSet<Multiaddr>,

    /// Multiaddresses that our listeners are listening on,
    listened_addrs: HashMap<ListenerId, SmallVec<[Multiaddr; 1]>>,

    /// Pending event to be delivered to connection handlers
    /// (or dropped if the peer disconnected) before the \`behaviour\`
    /// can be polled again.
    pending_handler_event: Option<(PeerId, PendingNotifyHandler, THandlerInEvent<TBehaviour>)>,

    pending_swarm_events: VecDeque<SwarmEvent<TBehaviour::ToSwarm>>,
}`,
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'transport — TCP/QUIC 다이얼·리슨 담당' },
      { lines: [8, 9], color: 'emerald', note: 'pool — 활성 연결·핸들러 풀' },
      { lines: [14, 16], color: 'amber', note: 'behaviour — 프로토콜 로직 (DHT, PubSub 등)' },
      { lines: [27, 30], color: 'violet', note: 'pending — backpressure 처리용 대기 이벤트' },
    ],
  },
  'poll-next-event': {
    path: 'swarm/src/lib.rs — poll_next_event()',
    lang: 'rust',
    highlight: [1, 81],
    desc: '세 계층을 우선순위대로 폴링하는 핵심 이벤트 루프입니다.',
    code: `fn poll_next_event(
    mut self: Pin<&mut Self>,
    cx: &mut Context<'_>,
) -> Poll<SwarmEvent<TBehaviour::ToSwarm>> {
    let this = &mut *self;

    // This loop polls the components below in a prioritized order.
    //
    // 1. [\`NetworkBehaviour\`]
    // 2. Connection [\`Pool\`]
    // 3. [\`ListenersStream\`]
    //
    // (1) is polled before (2) to prioritize local work over work coming from a remote.
    //
    // (2) is polled before (3) to prioritize existing connections
    // over upgrading new incoming connections.
    loop {
        if let Some(swarm_event) = this.pending_swarm_events.pop_front() {
            return Poll::Ready(swarm_event);
        }

        match this.pending_handler_event.take() {
            Some((peer_id, handler, event)) => match handler {
                PendingNotifyHandler::One(conn_id) => {
                    match this.pool.get_established(conn_id) {
                        Some(conn) => match notify_one(conn, event, cx) {
                            None => continue,
                            Some(event) => {
                                this.pending_handler_event = Some((peer_id, handler, event));
                            }
                        },
                        None => continue,
                    }
                }
                PendingNotifyHandler::Any(ids) => {
                    match notify_any::<_, TBehaviour>(ids, &mut this.pool, event, cx) {
                        None => continue,
                        Some((event, ids)) => {
                            let handler = PendingNotifyHandler::Any(ids);
                            this.pending_handler_event = Some((peer_id, handler, event));
                        }
                    }
                }
            },
            // No pending event. Allow the [\`NetworkBehaviour\`] to make progress.
            None => match this.behaviour.poll(cx) {
                Poll::Pending => {}
                Poll::Ready(behaviour_event) => {
                    this.handle_behaviour_event(behaviour_event);

                    continue;
                }
            },
        }

        // Poll the known peers.
        match this.pool.poll(cx) {
            Poll::Pending => {}
            Poll::Ready(pool_event) => {
                this.handle_pool_event(pool_event);
                continue;
            }
        }

        // Poll the listener(s) for new connections.
        match Pin::new(&mut this.transport).poll(cx) {
            Poll::Pending => {}
            Poll::Ready(transport_event) => {
                this.handle_transport_event(transport_event);
                continue;
            }
        }

        return Poll::Pending;
    }
}`,
    annotations: [
      { lines: [7, 16], color: 'sky', note: '로컬 우선 → 기존 연결 → 새 연결' },
      { lines: [47, 56], color: 'emerald', note: '1순위: Behaviour 폴링' },
      { lines: [59, 65], color: 'amber', note: '2순위: 연결 풀 폴링' },
      { lines: [68, 74], color: 'violet', note: '3순위: Transport 폴링' },
    ],
  },
};
