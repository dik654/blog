export const protocols = [
  {
    name: 'libp2p-kad',
    purpose: 'Kademlia DHT',
    color: '#6366f1',
    desc: 'Provider 레코드 저장/조회, Peer 주소 조회. IPFS CID 라우팅의 핵심.',
    proto: '/ipfs/kad/1.0.0',
  },
  {
    name: 'libp2p-gossipsub',
    purpose: 'Pub/Sub 메시징',
    color: '#10b981',
    desc: '토픽 기반 메시지 브로드캐스트. Ethereum 2.0 BeaconChain attestation 전파.',
    proto: '/meshsub/1.1.0',
  },
  {
    name: 'libp2p-identify',
    purpose: '피어 정보 교환',
    color: '#f59e0b',
    desc: '연결 직후 프로토콜 목록, 주소, 에이전트 버전 교환. 라우팅 테이블 업데이트에 활용.',
    proto: '/ipfs/identify/1.0.0',
  },
  {
    name: 'libp2p-autonat',
    purpose: 'NAT 타입 탐지',
    color: '#8b5cf6',
    desc: '다른 노드에게 자신에게 dial-back 요청 → 외부에서 접근 가능한지 판별.',
    proto: '/libp2p/autonat/1.0.0',
  },
  {
    name: 'libp2p-dcutr',
    purpose: 'Hole Punching',
    color: '#ec4899',
    desc: 'Direct Connection Upgrade through Relay. Relay를 통해 연결 후 직접 연결로 업그레이드.',
    proto: '/libp2p/dcutr/1.0.0',
  },
];

export const gossipsubCode = `// GossipSub 설정
let gossipsub_config = gossipsub::ConfigBuilder::default()
    .heartbeat_interval(Duration::from_secs(10))
    .validation_mode(ValidationMode::Strict) // 서명 필수
    .mesh_n(6)         // 메시 피어 목표 수
    .mesh_n_low(5)     // 최소 메시 피어
    .mesh_n_high(12)   // 최대 메시 피어
    .gossip_lazy(6)    // IHAVE 전송 대상 수
    .build()?;

let gossipsub = gossipsub::Behaviour::new(
    MessageAuthenticity::Signed(keypair), gossipsub_config)?;

// 토픽 구독
let topic = gossipsub::IdentTopic::new("eth2/attestation");
gossipsub.subscribe(&topic)?;

// 메시지 발행
gossipsub.publish(topic, b"hello network")?;`;

export const holePunchingCode = `// NAT 뒤 두 피어 A, B가 직접 연결하는 과정:

// 1. A와 B 모두 중계 서버(R)에 연결
// /p2p-circuit/p2p/12D3KooWRelay → /p2p/12D3KooWB (중계)

// 2. A → B: Connect 메시지 (DCUtR)
// A가 자신의 관찰된 외부 주소 전송

// 3. B → A: Connect 응답 + 자신의 외부 주소

// 4. 동시 dial (Simultaneous Open)
// A → B, B → A 동시에 UDP/TCP 연결 시도
// NAT 테이블에 반대쪽 패킷이 도착하기 전에 홀 생성

// 5. 직접 연결 성공 → 중계 연결 닫기
// 지연: Relay(~100ms) → Direct(<10ms)`;
