import type { CodeRef } from '@/components/code/types';

export const connectionRefs: Record<string, CodeRef> = {
  'connection-struct': {
    path: 'iroh/iroh/src/endpoint/connection.rs',
    lang: 'rust',
    highlight: [1, 5],
    desc: 'Connection은 타입 상태 패턴(typestate)으로 연결 생명주기를 컴파일 타임에 추적합니다.\nHandshakeCompleted 상태에서만 데이터 송수신이 가능합니다.',
    code: `pub struct Connection<State: ConnectionState = HandshakeCompleted> {
    inner: noq::Connection,
    data: State::Data,  // 상태별 데이터
}

// 세 가지 연결 상태 — 컴파일 타임 추적
pub struct HandshakeCompleted;  // TLS 핸드셰이크 완료
pub struct IncomingZeroRtt;     // 수신 측 0-RTT
pub struct OutgoingZeroRtt;     // 송신 측 0-RTT

// 핸드셰이크 완료 후 보유하는 정보
struct HandshakeCompletedData {
    info: StaticInfo,       // EndpointId + ALPN
    paths: PathWatchable,   // 경로 변경 감시자
}

struct StaticInfo {
    endpoint_id: EndpointId,  // 원격 피어 공개키
    alpn: Vec<u8>,            // 협상된 프로토콜
}`,
    annotations: [
      { lines: [1, 4] as [number, number], color: 'sky' as const, note: 'Connection<State>: 타입 상태 패턴' },
      { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '세 가지 상태 마커 타입' },
      { lines: [12, 15] as [number, number], color: 'amber' as const, note: '핸드셰이크 후 데이터: 피어 ID + 경로 감시' },
    ],
  },
  'incoming-addr': {
    path: 'iroh/iroh/src/endpoint/connection.rs',
    lang: 'rust',
    highlight: [1, 10],
    desc: 'IncomingAddr는 수신 연결의 원격 주소 타입입니다.\nIP 직접 연결, Relay 경유, Custom 전송 세 가지를 구분합니다.',
    code: `/// 수신 연결의 원격 주소
pub enum IncomingAddr {
    /// 직접 IP 연결
    Ip(SocketAddr),
    /// Relay 경유 연결
    Relay {
        url: RelayUrl,
        endpoint_id: EndpointId,
    },
    /// 사용자 정의 전송
    Custom(CustomAddr),
}

// TransportAddr로의 변환 — Socket 계층에서 사용
impl From<IncomingAddr> for TransportAddr {
    fn from(addr: IncomingAddr) -> Self {
        match addr {
            IncomingAddr::Ip(addr) => Self::Ip(addr),
            IncomingAddr::Relay { url, .. } => Self::Relay(url),
            IncomingAddr::Custom(addr) => Self::Custom(addr),
        }
    }
}`,
    annotations: [
      { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'IP: NAT 통과 후 직접 UDP' },
      { lines: [5, 9] as [number, number], color: 'emerald' as const, note: 'Relay: URL + 상대방 EndpointId' },
      { lines: [10, 11] as [number, number], color: 'amber' as const, note: 'Custom: 확장 전송 계층' },
    ],
  },
};
