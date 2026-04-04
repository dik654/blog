export const PROTOCOLS = [
  {
    name: 'iroh-blobs',
    alpn: 'iroh-blobs/0',
    color: '#6366f1',
    desc: '콘텐츠 주소(Blake3 해시) 기반 블롭 전송. 청크 단위 병렬 다운로드, 부분 검증. BitTorrent와 유사하지만 QUIC 위에서 동작.',
  },
  {
    name: 'iroh-gossip',
    alpn: 'iroh-gossip/0',
    color: '#10b981',
    desc: 'GossipSub 스타일 메시지 브로드캐스트. 주제(topic) 기반 구독. 검증자 알림·이벤트 전파에 활용.',
  },
  {
    name: 'iroh-docs',
    alpn: 'iroh-docs/0',
    color: '#f59e0b',
    desc: '멀티-사용자 키-값 문서 동기화. Automerge CRDT 기반. 오프라인 편집 후 재연결 시 자동 병합.',
  },
];

export const HANDLER_CODE = `pub trait ProtocolHandler: Send + Sync + Debug + 'static {
    // 선택적: Connecting 상태에서 0-RTT 처리 등 고급 기능
    fn on_connecting(&self, connecting: Connecting)
        -> impl Future<Output = Result<Connection>>;

    // 필수: 실제 연결 처리 (별도 tokio 태스크에서 실행)
    fn accept(&self, conn: Connection)
        -> impl Future<Output = Result<()>>;

    // 라우터 종료 시 정리 작업
    fn shutdown(&self) -> impl Future<Output = ()>;
}`;

export const ROUTER_CODE = `// 여러 프로토콜을 하나의 Endpoint에서 처리
let router = Router::builder(endpoint)
    .accept(b"iroh-blobs/0",   BlobProtocol::new())
    .accept(b"iroh-gossip/0",  GossipProtocol::new())
    .accept(b"my-app/1",       MyAppHandler::new())
    .spawn()
    .await?;

// 내부 동작: ALPN 추출 → HashMap 조회 → handler.accept() 호출
// 각 연결은 독립적인 tokio 태스크에서 처리됨`;

export const ECHO_CODE = `#[derive(Debug, Clone)]
struct EchoProtocol;

impl ProtocolHandler for EchoProtocol {
    async fn accept(&self, conn: Connection) -> Result<()> {
        let node_id = conn.remote_node_id()?;
        println!("connected from {node_id}");

        // QUIC 양방향 스트림 수락
        let (mut send, mut recv) = conn.accept_bi().await?;

        // 받은 데이터를 그대로 에코
        let data = recv.read_to_end(1024).await?;
        send.write_all(&data).await?;
        send.finish()?;
        Ok(())
    }
}

// 등록
let router = Router::builder(endpoint)
    .accept(b"echo/0", EchoProtocol)
    .spawn().await?;`;
