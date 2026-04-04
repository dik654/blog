import type { CodeRef } from '@/components/code/types';

const QUIC_TRANSPORT = `#[derive(Debug)]
pub struct GenTransport<P: Provider> {
    quinn_config: QuinnConfig,
    handshake_timeout: Duration,
    support_draft_29: bool,
    listeners: SelectAll<Listener<P>>,
    dialer: HashMap<SocketFamily, quinn::Endpoint>,
    waker: Option<Waker>,
    hole_punch_attempts: HashMap<SocketAddr, oneshot::Sender<Connecting>>,
}

impl<P: Provider> Transport for GenTransport<P> {
    type Output = (PeerId, Connection);
    type Error = Error;
    type ListenerUpgrade = Connecting;
    type Dial = BoxFuture<'static, Result<Self::Output, Self::Error>>;

    fn dial(&mut self, addr: Multiaddr, dial_opts: DialOpts)
        -> Result<Self::Dial, TransportError<Self::Error>>
    {
        let (socket_addr, version, peer_id) =
            self.remote_multiaddr_to_socketaddr(addr.clone(), true)?;

        match (dial_opts.role, dial_opts.port_use) {
            (Endpoint::Dialer, _) | (Endpoint::Listener, PortUse::Reuse) => {
                let endpoint = if let Some(listener) = dial_opts.port_use
                    .eq(&PortUse::Reuse)
                    .then(|| self.eligible_listener(&socket_addr))
                    .flatten()
                { listener.endpoint.clone() }
                else { /* dialer HashMap fallback */ };

                Ok(Box::pin(async move {
                    let connecting = endpoint
                        .connect_with(client_config, socket_addr, "l")
                        .map_err(ConnectError)?;
                    Connecting::new(connecting, handshake_timeout).await
                }))
            }
            (Endpoint::Listener, _) => {
                // Hole punching mode
                let hole_puncher = hole_puncher::<P>(socket, socket_addr, timeout);
                let (sender, receiver) = oneshot::channel();
                self.hole_punch_attempts.entry(socket_addr).or_insert(sender);

                Ok(Box::pin(async move {
                    match select(receiver, hole_puncher).await {
                        Either::Left((msg, _)) => msg.expect("sender alive").await,
                        Either::Right((err, _)) => Err(err),
                    }
                }))
            }
        }
    }
}`;

export const quicCodeRefs: Record<string, CodeRef> = {
  'quic-transport': {
    path: 'transports/quic/src/transport.rs — GenTransport',
    code: QUIC_TRANSPORT,
    lang: 'rust',
    highlight: [1, 55],
    annotations: [
      { lines: [2, 11], color: 'sky', note: 'GenTransport — quinn 기반 QUIC Transport 구조체' },
      { lines: [14, 18], color: 'emerald', note: 'Output = (PeerId, Connection) — Mux 내장이라 별도 업그레이드 불필요' },
      { lines: [26, 39], color: 'amber', note: 'Dialer 모드 — eligible_listener() → connect_with()' },
      { lines: [41, 52], color: 'violet', note: 'Listener 모드 — hole_puncher + oneshot 채널 레이스' },
    ],
    desc: `QUIC Transport 구현입니다. TCP와 달리 Noise/Yamux 업그레이드 없이 바로 (PeerId, Connection)을 반환합니다. dial()은 Dialer 모드와 Listener(홀펀칭) 모드 두 가지 분기를 가집니다.`,
  },
};
