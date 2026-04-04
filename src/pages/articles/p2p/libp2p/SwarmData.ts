export const networkBehaviourCode = `pub trait NetworkBehaviour: 'static {
    type ConnectionHandler: ConnectionHandler;
    type ToSwarm: Send + 'static; // 상위 앱에게 보낼 이벤트

    // 인바운드 연결이 수립됐을 때 호출
    fn handle_established_inbound_connection(
        &mut self,
        connection_id: ConnectionId,
        peer: PeerId,
        local_addr: &Multiaddr,
        remote_addr: &Multiaddr,
    ) -> Result<THandler<Self>, ConnectionDenied>;

    // Swarm에서 발생한 이벤트 처리 (연결/단절/주소 등)
    fn on_swarm_event(&mut self, event: FromSwarm);

    // 프로토콜 동작 폴링 (이벤트 발생 시 Wake)
    fn poll(
        &mut self,
        cx: &mut Context<'_>,
    ) -> Poll<ToSwarm<Self::ToSwarm, THandlerInEvent<Self>>>;
}`;

export const deriveCode = `#[derive(NetworkBehaviour)]
struct MyBehaviour {
    kademlia: kad::Behaviour<MemoryStore>,
    gossipsub: gossipsub::Behaviour,
    identify: identify::Behaviour,
    autonat: autonat::Behaviour,
    dcutr: dcutr::Behaviour,
}
// → 매크로가 각 필드의 이벤트를 enum MyBehaviourEvent로 통합

// 이벤트 처리
loop {
    match swarm.select_next_some().await {
        SwarmEvent::Behaviour(MyBehaviourEvent::Kademlia(e)) => { /* DHT */ }
        SwarmEvent::Behaviour(MyBehaviourEvent::Gossipsub(e)) => { /* pub/sub */ }
        SwarmEvent::NewListenAddr { address, .. } => {
            println!("Listening on {address}");
        }
        SwarmEvent::ConnectionEstablished { peer_id, .. } => {
            println!("Connected to {peer_id}");
        }
        _ => {}
    }
}`;

export const connectionHandlerCode = `pub trait ConnectionHandler: Send + 'static {
    type FromBehaviour: fmt::Debug + Send + 'static; // Behaviour → Handler
    type ToBehaviour: fmt::Debug + Send + 'static;   // Handler → Behaviour
    type InboundProtocol: InboundUpgrade<NegotiatedSubstream>;
    type OutboundProtocol: OutboundUpgrade<NegotiatedSubstream>;

    // 지원하는 inbound 프로토콜 목록
    fn listen_protocol(&self) -> SubstreamProtocol<Self::InboundProtocol, ()>;

    // 연결 폴링: 스트림 열기/닫기, 이벤트 발생
    fn poll(
        &mut self,
        cx: &mut Context<'_>,
    ) -> Poll<ConnectionHandlerEvent<...>>;

    // Behaviour로부터 명령 수신
    fn on_behaviour_event(&mut self, event: Self::FromBehaviour);
}`;

export const eventFlowSteps = [
  'Transport: TCP/QUIC 연결 수락',
  'Swarm: Security + Mux 업그레이드 실행',
  'Swarm: NetworkBehaviour.handle_established_inbound_connection() 호출',
  'Handler: listen_protocol()로 지원 프로토콜 광고',
  'Handler: 스트림 협상 완료 → 프로토콜 동작 시작',
  'NetworkBehaviour.poll(): 이벤트 생성 → ToSwarm 반환',
  '애플리케이션: swarm.select_next_some() 처리',
];
