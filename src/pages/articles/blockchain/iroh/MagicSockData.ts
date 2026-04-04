export const NODE_MAP_CODE = `// QUIC 레이어는 이 가상 주소로 패킷 전송
struct NodeIdMappedAddr(SocketAddr); // 100.64.0.0/10 범위 가상 IP

// NodeMap: NodeId ↔ 실제 경로 매핑 테이블 (내부적으로 Vec 인덱스 사용)
struct NodeMapInner {
    by_node_key: HashMap<NodeId, usize>,
    by_ip_port: HashMap<IpPort, usize>,
    by_quic_mapped_addr: HashMap<NodeIdMappedAddr, usize>,
}

struct NodeState {
    node_id: NodeId,
    relay_url: Option<RelayUrl>,     // relay 경로
    direct_addrs: AddrSet,           // UDP 직접 주소 목록
    best_addr: Option<AddrLatency>,  // 현재 최선 직접 주소
}`;

export const NODE_MAP_ANNOTATIONS = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '가상 주소 매핑' },
  { lines: [4, 9] as [number, number], color: 'emerald' as const, note: '3중 인덱스 매핑 테이블' },
  { lines: [11, 16] as [number, number], color: 'amber' as const, note: '노드 상태 & 경로 정보' },
];

export const TRANSPORTS_CODE = `struct Transports {
    ip: Vec<IpTransport>,       // IPv4 + IPv6 소켓
    relay: Vec<RelayTransport>, // relay WebSocket 연결들
    poll_recv_counter: AtomicUsize, // 라운드로빈 카운터
}

// 소켓 바인딩: 선호 포트 시도 → 실패 시 포트 0(임의 포트)
fn bind_with_fallback(addr: SocketAddr) -> io::Result<UdpSocket> {
    UdpSocket::bind_full(addr)
        .or_else(|_| UdpSocket::bind_full(addr.with_port(0)))
}`;

export const TRANSPORTS_ANNOTATIONS = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: '전송 계층 통합 구조체' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '포트 바인딩 폴백' },
];
