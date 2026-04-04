import type { CodeRef } from '@/components/code/types';

export const endpointRefs: Record<string, CodeRef> = {
  'endpoint-struct': {
    path: 'iroh/iroh/src/endpoint.rs',
    lang: 'rust',
    highlight: [1, 3],
    desc: 'Endpoint는 iroh의 최상위 API입니다.\nArc<EndpointInner>를 감싸는 cheaply-cloneable 핸들로,\n내부에 QUIC 엔드포인트·소켓·TLS 설정·런타임을 모두 보유합니다.',
    code: `pub struct Endpoint {
    inner: Arc<EndpointInner>,
}

// EndpointInner: 실제 상태를 보유하는 내부 구조체
pub(crate) struct EndpointInner {
    #[deref(forward)]
    sock: Arc<Socket>,          // MagicSock (UDP+Relay 통합 소켓)
    actor_task: Mutex<Option<AbortOnDropHandle<()>>>,
    actor_sender: mpsc::Sender<ActorMessage>,
    endpoint: noq::Endpoint,    // QUIC 엔드포인트 (noq = quinn fork)
    runtime: Arc<Runtime>,
    pub(crate) static_config: StaticConfig,
}

pub(crate) struct StaticConfig {
    pub(crate) tls_config: tls::TlsConfig,        // Ed25519 기반 TLS
    pub(crate) transport_config: QuicTransportConfig,
    pub(crate) keylog: bool,
}`,
    annotations: [
      { lines: [1, 3] as [number, number], color: 'sky' as const, note: 'Endpoint: Arc로 감싼 cheaply-cloneable 핸들' },
      { lines: [6, 15] as [number, number], color: 'emerald' as const, note: 'EndpointInner: Socket + noq::Endpoint + Runtime' },
      { lines: [17, 21] as [number, number], color: 'amber' as const, note: 'StaticConfig: Ed25519 TLS 설정' },
    ],
  },
  'endpoint-connect': {
    path: 'iroh/iroh/src/endpoint.rs',
    lang: 'rust',
    highlight: [1, 10],
    desc: 'connect()는 원격 Endpoint에 연결을 시작합니다.\nEndpointAddr(= EndpointId + 선택적 주소)와 ALPN 프로토콜을 받아\nQUIC 연결을 수립합니다. 주소 해석은 AddressLookup 시스템이 자동 처리합니다.',
    code: `pub async fn connect(
    &self,
    endpoint_addr: impl Into<EndpointAddr>,
    alpn: &[u8],
) -> Result<Connection, ConnectError> {
    let endpoint_addr = endpoint_addr.into();
    let remote = endpoint_addr.id;
    let connecting = self
        .connect_with_opts(endpoint_addr, alpn, Default::default())
        .await?;
    let conn = connecting.await?;  // TLS 핸드셰이크 완료 대기
    Ok(conn)
}

// connect_with_opts 내부 핵심 흐름:
// 1. hooks.before_connect() — 연결 전 검증
// 2. resolve_remote() — AddressLookup으로 주소 해석
// 3. tls_config.make_client_config() — Ed25519 클라이언트 TLS 설정
// 4. noq_endpoint().connect_with() — QUIC 연결 시작
let mapped_addr = self.inner.resolve_remote(endpoint_addr).await??;
let dest_addr = mapped_addr.private_socket_addr();
let server_name = &tls::name::encode(endpoint_id);
let connect = self.inner.noq_endpoint()
    .connect_with(client_config, dest_addr, server_name)?;
Ok(Connecting::new(connect, self.clone(), endpoint_id))`,
    annotations: [
      { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'connect(): EndpointAddr + ALPN으로 연결' },
      { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'connect_with_opts → TLS 핸드셰이크 대기' },
      { lines: [20, 24] as [number, number], color: 'amber' as const, note: '내부: 주소 해석 → TLS 설정 → QUIC 연결' },
    ],
  },
};
