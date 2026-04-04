import type { CodeRef } from '@/components/code/types';

const TCP_TRANSPORT = `impl<T> libp2p_core::Transport for Transport<T>
where T: Provider + Send + 'static,
{
    type Output = T::Stream;
    type Error = io::Error;
    type Dial = Pin<Box<dyn Future<Output = io::Result<T::Stream>> + Send>>;

    fn listen_on(&mut self, id: ListenerId, addr: Multiaddr)
        -> Result<(), TransportError<Self::Error>>
    {
        let socket_addr = multiaddr_to_socketaddr(addr.clone())
            .map_err(|_| TransportError::MultiaddrNotSupported(addr))?;
        let listener = self.do_listen(id, socket_addr)
            .map_err(TransportError::Other)?;
        self.listeners.push(listener);
        Ok(())
    }

    fn dial(&mut self, addr: Multiaddr, opts: DialOpts)
        -> Result<Self::Dial, TransportError<Self::Error>>
    {
        let socket_addr = multiaddr_to_socketaddr(addr.clone())?;
        let socket = self.config
            .create_socket(socket_addr, opts.port_use)
            .map_err(TransportError::Other)?;

        // 포트 재사용: 리스닝 소켓 주소로 바인드 시도
        let bind_addr = match self.port_reuse.local_dial_addr(&socket_addr.ip()) {
            Some(addr) if opts.port_use == PortUse::Reuse => Some(addr),
            _ => None,
        };

        Ok(async move {
            if let Some(bind_addr) = bind_addr {
                socket.bind(&bind_addr.into())?;
            }
            match (socket.connect(&socket_addr.into()), bind_addr) {
                (Ok(()), _) => {},
                (Err(e), _) if e.raw_os_error() == Some(libc::EINPROGRESS) => {},
                // 바인드 주소 사용 불가 → 새 포트로 재시도
                (Err(e), Some(_)) if e.kind() == AddrNotAvailable => {
                    let socket = local_config.create_socket(socket_addr, PortUse::New)?;
                    socket.connect(&socket_addr.into())?;
                }
                (Err(e), _) => return Err(e),
            };
            T::new_stream(socket.into()).await
        }.boxed())
    }
}`;

const TCP_CREATE_SOCKET = `fn create_socket(&self, socket_addr: SocketAddr, port_use: PortUse)
    -> io::Result<Socket>
{
    let socket = Socket::new(
        Domain::for_address(socket_addr), Type::STREAM,
        Some(socket2::Protocol::TCP),
    )?;
    if socket_addr.is_ipv6() { socket.set_only_v6(true)?; }
    if let Some(ttl) = self.ttl { socket.set_ttl_v4(ttl)?; }

    socket.set_tcp_nodelay(self.nodelay)?;   // Nagle 알고리즘 비활성화
    socket.set_reuse_address(true)?;         // SO_REUSEADDR — 재시작 시 빠른 바인드

    #[cfg(unix)]
    if port_use == PortUse::Reuse {
        socket.set_reuse_port(true)?;        // SO_REUSEPORT — 홀펀칭용
    }

    socket.set_nonblocking(true)?;
    Ok(socket)
}`;

export const transportCodeRefs2: Record<string, CodeRef> = {
  'tcp-transport': {
    path: 'transports/tcp/src/lib.rs — impl Transport for Transport<T>',
    code: TCP_TRANSPORT,
    lang: 'rust',
    highlight: [1, 52],
    annotations: [
      { lines: [11, 19], color: 'sky', note: 'listen_on — Multiaddr→SocketAddr 변환 후 리스닝' },
      { lines: [22, 28], color: 'emerald', note: 'dial — 소켓 생성 + 포트 재사용 판단' },
      { lines: [31, 34], color: 'amber', note: '포트 재사용 — NAT 홀펀칭 시 리스닝 포트로 바인드' },
    ],
    desc: `TCP Transport 구현입니다. listen_on은 Multiaddr→SocketAddr 변환 후 OS 리스너 생성, dial은 포트 재사용을 시도하되 실패 시 새 포트로 폴백합니다. EINPROGRESS는 비동기 connect의 정상 응답입니다.`,
  },
  'tcp-socket': {
    path: 'transports/tcp/src/lib.rs — create_socket()',
    code: TCP_CREATE_SOCKET,
    lang: 'rust',
    highlight: [1, 23],
    annotations: [
      { lines: [14, 14], color: 'sky', note: 'SO_REUSEADDR — TIME_WAIT 소켓 재바인드 허용' },
      { lines: [13, 13], color: 'emerald', note: 'TCP_NODELAY — P2P 메시지의 지연 최소화' },
    ],
    desc: `소켓 생성 옵션입니다. TCP_NODELAY로 Nagle을 끄고, SO_REUSEADDR로 재시작 시 즉시 바인드, SO_REUSEPORT(Unix)로 NAT 홀펀칭용 포트 공유를 허용합니다.`,
  },
};
