export const moduleRoles = [
  { name: 'libp2p-core', color: '#6366f1', role: '핵심 트레이트: Transport, StreamMuxer, PeerId, Multiaddr 정의' },
  { name: 'libp2p-swarm', color: '#10b981', role: '이벤트 루프. Behaviour ↔ Transport 중재, 연결 풀 관리' },
  { name: 'libp2p-identity', color: '#f59e0b', role: 'Ed25519/Secp256k1 키 쌍, PeerId 생성·검증' },
  { name: 'libp2p-noise', color: '#ec4899', role: 'Noise XX 핸드셰이크, X25519 DH + 신원 바인딩' },
  { name: 'libp2p-yamux', color: '#8b5cf6', role: 'Yamux 스트림 멀티플렉서. 단일 연결 → 다수 논리 스트림' },
  { name: 'libp2p-tcp', color: '#ef4444', role: 'TCP Transport 구현. tokio/async-std 런타임 지원' },
  { name: 'libp2p-quic', color: '#06b6d4', role: 'QUIC Transport. quinn 기반, TLS 1.3 + Mux 내장' },
  { name: 'libp2p-kad', color: '#a855f7', role: 'Kademlia DHT. Provider/Peer 레코드 저장·조회' },
  { name: 'libp2p-gossipsub', color: '#14b8a6', role: 'GossipSub pub/sub. 메시 네트워크 + 점수 기반 필터링' },
];

export const dataFlowCode = `// 데이터 흐름: 외부 패킷 → 애플리케이션 이벤트
//
// [Network]
//   ↓ TCP/QUIC 패킷
// [Transport]           ← libp2p-tcp / libp2p-quic
//   ↓ Raw connection
// [Security]            ← libp2p-noise (XX 핸드셰이크)
//   ↓ Encrypted + Authenticated
// [StreamMuxer]         ← libp2p-yamux
//   ↓ Logical streams
// [Swarm]               ← libp2p-swarm
//   ↓ on_swarm_event() / poll()
// [NetworkBehaviour]    ← libp2p-kad, gossipsub, ...
//   ↓ ToSwarm<Event>
// [Application]         ← swarm.select_next_some()`;

export const dataFlowAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'Transport — TCP/QUIC raw 연결' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'Security + Mux — 암호화·스트림 분할' },
  { lines: [10, 13] as [number, number], color: 'amber' as const, note: 'Swarm → Behaviour → App 이벤트 전파' },
];

export const depGraphCode = `// 크레이트 의존성 그래프 (Cargo.toml)
//
// libp2p (facade)
//   ├── libp2p-core         (Transport, PeerId, Multiaddr)
//   ├── libp2p-swarm        (Swarm, NetworkBehaviour)
//   │     └── libp2p-core
//   ├── libp2p-identity     (Keypair, PeerId)
//   ├── libp2p-noise        (Security)
//   │     └── libp2p-core
//   ├── libp2p-yamux        (StreamMuxer)
//   │     └── libp2p-core
//   ├── libp2p-tcp          (Transport impl)
//   │     └── libp2p-core
//   ├── libp2p-quic         (Transport impl)
//   │     └── libp2p-core
//   └── Protocols:
//         libp2p-kad, libp2p-gossipsub, libp2p-identify,
//         libp2p-autonat, libp2p-dcutr, libp2p-relay`;

export const depGraphAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: 'core + swarm — 핵심 추상화' },
  { lines: [8, 15] as [number, number], color: 'emerald' as const, note: 'Security·Mux·Transport 구현체' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '프로토콜 크레이트 (선택적)' },
];
