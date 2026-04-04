export const mechanisms = [
  {
    name: 'mDNS',
    color: '#10b981',
    scope: 'LAN',
    desc: '멀티캐스트 DNS로 로컬 네트워크에서 피어 자동 발견. 부트스트랩 불필요.',
    proto: '224.0.0.251:5353 (IPv4) / ff02::fb (IPv6)',
    latency: '수 ms',
  },
  {
    name: 'Kademlia DHT',
    color: '#6366f1',
    scope: 'WAN',
    desc: 'FIND_NODE RPC로 O(log N) 홉 만에 피어 조회. 부트스트랩 노드 필요.',
    proto: '/ipfs/kad/1.0.0',
    latency: '수백 ms (여러 홉)',
  },
  {
    name: 'Rendezvous',
    color: '#f59e0b',
    scope: 'WAN',
    desc: '중앙 Rendezvous 서버에 네임스페이스 기반 등록/조회. DHT보다 단순.',
    proto: '/rendezvous/1.0.0',
    latency: '수십 ms',
  },
  {
    name: 'Bootstrap',
    color: '#8b5cf6',
    scope: 'WAN',
    desc: '하드코딩된 부트스트랩 노드 목록. 최초 연결 시 사용, 이후 DHT로 전환.',
    proto: 'Multiaddr 목록 (config)',
    latency: '1 RTT',
  },
];

export const mdnsCode = `// mDNS 피어 발견 구현
let mdns = mdns::tokio::Behaviour::new(
    mdns::Config::default(), // TTL: 300s, 질의 간격: 5min
    peer_id,
)?;

// mDNS 동작:
// 1. 가입: _p2p._udp.local 서비스 등록
// 2. 질의: PTR 레코드로 피어 목록 요청
// 3. 응답: TXT 레코드에 PeerId + Multiaddr 포함
// 4. 만료: TTL 경과 시 ExpiredAddr 이벤트

// 이벤트 처리
match event {
    mdns::Event::Discovered(peers) => {
        for (peer_id, addr) in peers {
            swarm.add_peer_address(peer_id, addr);
        }
    }
    mdns::Event::Expired(peers) => { /* 피어 제거 */ }
}`;

export const mdnsAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'mDNS Behaviour 생성' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: 'mDNS 동작 과정' },
  { lines: [13, 20] as [number, number], color: 'amber' as const, note: '발견/만료 이벤트 처리' },
];

export const kadDiscoveryCode = `// Kademlia DHT 피어 발견
let mut kad = kad::Behaviour::new(peer_id, MemoryStore::new(peer_id));

// 부트스트랩: 알려진 노드에 FIND_NODE(자신) 실행
// → 라우팅 테이블 초기 채우기
kad.bootstrap()?;

// 주기적 랜덤 조회: 라우팅 테이블 신선도 유지
// → 랜덤 PeerId로 FIND_NODE 실행
// → 경로상의 새로운 피어 발견

// Provider 레코드로 콘텐츠 발견:
// kad.start_providing(key)?;     // "이 CID 보유" 등록
// kad.get_providers(key);        // CID 보유 피어 조회`;

export const kadDiscoveryAnnotations = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'Kademlia Behaviour 생성' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: 'bootstrap() — 라우팅 테이블 초기화' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: 'Provider 레코드 (콘텐츠 발견)' },
];
