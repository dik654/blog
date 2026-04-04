import type { CodeRef } from '@/components/code/types';

const TRANSPORT_TRAIT = `pub trait Transport {
    /// 연결 수립 결과 — 보통 (PeerId, StreamMuxerBox)
    type Output;
    /// 연결 과정에서 발생한 에러
    type Error: Error;

    /// 인바운드 연결의 비동기 후처리 (프로토콜 업그레이드)
    type ListenerUpgrade: Future<Output = Result<Self::Output, Self::Error>>;
    /// 아웃바운드 연결의 비동기 후처리
    type Dial: Future<Output = Result<Self::Output, Self::Error>>;

    /// 주어진 Multiaddr에서 인바운드 연결 대기 시작
    fn listen_on(
        &mut self,
        id: ListenerId,
        addr: Multiaddr,
    ) -> Result<(), TransportError<Self::Error>>;

    /// 리스너 제거. 존재했으면 true 반환
    fn remove_listener(&mut self, id: ListenerId) -> bool;

    /// 원격 Multiaddr로 아웃바운드 연결 시도
    fn dial(
        &mut self,
        addr: Multiaddr,
        opts: DialOpts,
    ) -> Result<Self::Dial, TransportError<Self::Error>>;

    /// 이벤트 폴링 — Incoming, NewAddress, AddressExpired 등
    fn poll(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<TransportEvent<Self::ListenerUpgrade, Self::Error>>;

    fn boxed(self) -> boxed::Boxed<Self::Output>
    where Self: Sized + Send + Unpin + 'static { ... }
    fn map<F, O>(self, f: F) -> map::Map<Self, F> { ... }
    fn upgrade(self, version: upgrade::Version) -> Upgrade<Self> { ... }
}`;

const TRANSPORT_EVENT = `pub enum TransportEvent<TUpgr, TErr> {
    /// 새 주소에서 리스닝 시작
    NewAddress { listener_id: ListenerId, listen_addr: Multiaddr },

    /// 주소 만료 — 더 이상 해당 주소에서 수신 불가
    AddressExpired { listener_id: ListenerId, listen_addr: Multiaddr },

    /// 인바운드 연결 수신
    Incoming {
        listener_id: ListenerId,
        upgrade: TUpgr,           // 프로토콜 업그레이드 Future
        local_addr: Multiaddr,
        send_back_addr: Multiaddr, // 클라이언트 응답 주소
    },

    /// 리스너 닫힘 — Ok(()) 또는 에러
    ListenerClosed { listener_id: ListenerId, reason: Result<(), TErr> },

    /// 리스너 에러 — 정보성, 계속 폴링됨
    ListenerError { listener_id: ListenerId, error: TErr },
}`;

export const transportCodeRefs: Record<string, CodeRef> = {
  'transport-trait': {
    path: 'core/src/transport.rs — Transport 트레이트',
    code: TRANSPORT_TRAIT,
    lang: 'rust',
    highlight: [1, 42],
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'Output/Error — 연결 결과와 에러 타입' },
      { lines: [15, 19], color: 'emerald', note: 'listen_on — Multiaddr 파싱 후 리스닝 시작' },
      { lines: [25, 29], color: 'amber', note: 'dial — 아웃바운드 연결, DialOpts로 포트 재사용 제어' },
      { lines: [32, 36], color: 'violet', note: 'poll — 비동기 이벤트 루프 진입점' },
    ],
    desc: `Transport 트레이트는 물리적 연결을 추상화합니다. TCP, QUIC, WebSocket 등이 구현하고, Noise + Yamux 업그레이드 후 Swarm에 전달됩니다. Output은 보통 (PeerId, StreamMuxerBox)입니다.`,
  },
  'transport-event': {
    path: 'core/src/transport.rs — TransportEvent',
    code: TRANSPORT_EVENT,
    lang: 'rust',
    highlight: [1, 18],
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'NewAddress — OS가 할당한 실제 주소 보고' },
      { lines: [8, 13], color: 'emerald', note: 'Incoming — 새 연결, upgrade Future로 후처리' },
      { lines: [16, 16], color: 'amber', note: 'ListenerClosed — 정상 종료 vs 에러 구분' },
    ],
    desc: `Transport::poll()이 반환하는 이벤트 열거형입니다. Incoming의 upgrade Future가 resolve되면 인증된 스트림을 얻고, NewAddress/AddressExpired로 동적 주소 변화를 추적합니다.`,
  },
};
