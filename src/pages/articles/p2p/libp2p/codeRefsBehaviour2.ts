import type { CodeRef } from '@/components/code/types';

const FROM_SWARM = `pub enum FromSwarm<'a> {
    ConnectionEstablished(ConnectionEstablished<'a>),
    ConnectionClosed(ConnectionClosed<'a>),
    AddressChange(AddressChange<'a>),
    DialFailure(DialFailure<'a>),
    ListenFailure(ListenFailure<'a>),
    NewListener(NewListener),
    NewListenAddr(NewListenAddr<'a>),
    ExpiredListenAddr(ExpiredListenAddr<'a>),
    ListenerError(ListenerError<'a>),
    ListenerClosed(ListenerClosed<'a>),
    NewExternalAddrCandidate(NewExternalAddrCandidate<'a>),
    ExternalAddrConfirmed(ExternalAddrConfirmed<'a>),
    ExternalAddrExpired(ExternalAddrExpired<'a>),
    NewExternalAddrOfPeer(NewExternalAddrOfPeer<'a>),
}

pub struct ConnectionEstablished<'a> {
    pub peer_id: PeerId,
    pub connection_id: ConnectionId,
    pub endpoint: &'a ConnectedPoint,
    pub failed_addresses: &'a [Multiaddr],
    pub other_established: usize,
}

pub struct ConnectionClosed<'a> {
    pub peer_id: PeerId,
    pub connection_id: ConnectionId,
    pub endpoint: &'a ConnectedPoint,
    pub cause: Option<&'a ConnectionError>,
    pub remaining_established: usize,
}`;

const CONNECTION_HANDLER = `pub trait ConnectionHandler: Send + 'static {
    /// Behaviour → Handler 메시지 타입
    type FromBehaviour: fmt::Debug + Send + 'static;
    /// Handler → Behaviour 메시지 타입
    type ToBehaviour: fmt::Debug + Send + 'static;
    type InboundProtocol: InboundUpgradeSend;
    type OutboundProtocol: OutboundUpgradeSend;
    type InboundOpenInfo: Send + 'static;
    type OutboundOpenInfo: Send + 'static;

    /// 인바운드 서브스트림에 적용할 프로토콜 협상 업그레이드
    fn listen_protocol(
        &self,
    ) -> SubstreamProtocol<Self::InboundProtocol, Self::InboundOpenInfo>;

    fn connection_keep_alive(&self) -> bool { false }

    /// Stream::poll()과 동일한 패턴
    fn poll(
        &mut self, cx: &mut Context<'_>,
    ) -> Poll<ConnectionHandlerEvent<
        Self::OutboundProtocol, Self::OutboundOpenInfo, Self::ToBehaviour
    >>;

    /// NetworkBehaviour에서 보낸 이벤트 수신
    fn on_behaviour_event(&mut self, _event: Self::FromBehaviour);

    fn on_connection_event(&mut self, event: ConnectionEvent<
        Self::InboundProtocol, Self::OutboundProtocol,
        Self::InboundOpenInfo, Self::OutboundOpenInfo,
    >);
}`;

const TO_SWARM = `pub enum ToSwarm<TOutEvent, TInEvent> {
    GenerateEvent(TOutEvent),
    Dial { opts: DialOpts },
    ListenOn { opts: ListenOpts },
    RemoveListener { id: ListenerId },
    NotifyHandler { peer_id: PeerId, handler: NotifyHandler, event: TInEvent },
    NewExternalAddrCandidate(Multiaddr),
    ExternalAddrConfirmed(Multiaddr),
    ExternalAddrExpired(Multiaddr),
    CloseConnection { peer_id: PeerId, connection: CloseConnection },
    NewExternalAddrOfPeer { peer_id: PeerId, address: Multiaddr },
}`;

export const behaviourCodeRefs2: Record<string, CodeRef> = {
  'to-swarm': {
    path: 'swarm/src/behaviour.rs — ToSwarm 커맨드',
    code: TO_SWARM, lang: 'rust', highlight: [1, 12],
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'GenerateEvent — 사용자에게 이벤트 반환' },
      { lines: [3, 3], color: 'emerald', note: 'Dial — 새 피어 연결 요청' },
      { lines: [6, 6], color: 'amber', note: 'NotifyHandler — 특정 연결 핸들러에 메시지 전달' },
      { lines: [10, 10], color: 'violet', note: 'CloseConnection — 연결 종료 명령' },
    ],
    desc: 'ToSwarm은 Behaviour→Swarm 방향의 커맨드입니다. poll()에서 반환하면 Swarm이 handle_behaviour_event()로 처리합니다.',
  },
  'from-swarm': {
    path: 'swarm/src/behaviour.rs — FromSwarm 이벤트',
    code: FROM_SWARM,
    lang: 'rust',
    highlight: [1, 34],
    annotations: [
      { lines: [4, 4], color: 'sky', note: 'ConnectionEstablished — 연결 수립 시 피어/주소 정보' },
      { lines: [5, 5], color: 'emerald', note: 'ConnectionClosed — 종료 원인과 남은 연결 수' },
      { lines: [7, 8], color: 'amber', note: 'DialFailure/ListenFailure — 연결 실패 처리' },
      { lines: [14, 16], color: 'violet', note: '외부 주소 후보/확인/만료 — NAT 탐지에 사용' },
    ],
    desc: `FromSwarm은 Swarm→Behaviour 방향의 이벤트입니다. ConnectionEstablished/Closed로 연결 생명주기를 추적하고, 구조체에 peer_id, connection_id, endpoint 컨텍스트가 포함됩니다.`,
  },
  'connection-handler': {
    path: 'swarm/src/handler.rs — ConnectionHandler 트레이트',
    code: CONNECTION_HANDLER,
    lang: 'rust',
    highlight: [1, 32],
    annotations: [
      { lines: [3, 9], color: 'sky', note: '연관 타입 — Behaviour↔Handler 메시지 + 프로토콜 업그레이드' },
      { lines: [12, 14], color: 'emerald', note: 'listen_protocol — 인바운드 서브스트림 협상 프로토콜' },
      { lines: [18, 23], color: 'amber', note: 'ConnectionHandlerEvent 반환 — Handler→Behaviour 명령' },
      { lines: [26, 26], color: 'violet', note: 'on_behaviour_event — Behaviour에서 Handler로 메시지 수신' },
    ],
    desc: `ConnectionHandler는 개별 연결 위에서 프로토콜 로직을 실행합니다. FromBehaviour/ToBehaviour로 양방향 메시지를 교환하고, poll()은 ConnectionHandlerEvent로 Behaviour에 이벤트를 전달합니다.`,
  },
};
