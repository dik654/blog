export const STEPS = [
  {
    label: '① 노드 발견',
    color: '#6366f1',
    desc: 'NodeId(Ed25519 공개키)로 피어 탐색',
    detail: [
      'DNS: _iroh.{domain} TXT 레코드 조회',
      'PKARR: 공개키 → BitTorrent DHT 레코드',
      'Relay 서버: 기본 릴레이 노드 목록',
      'Local: mDNS로 LAN 내 즉시 발견',
    ],
  },
  {
    label: '② 홀 펀칭',
    color: '#10b981',
    desc: 'QUIC + STUN으로 NAT 통과',
    detail: [
      'MagicSock: QUIC 소켓 추상화',
      'STUN으로 공개 IP:Port 확인',
      'UDP 홀 펀칭 (동시 연결 시도)',
      '실패 시 Relay 서버 경유 폴백',
    ],
  },
  {
    label: '③ QUIC 연결',
    color: '#f59e0b',
    desc: 'TLS 1.3 + ALPN으로 암호화 채널',
    detail: [
      'NodeId로 서버 인증 (자체 CA)',
      'ALPN: "/iroh/alpn/1" 등 프로토콜 협상',
      '다중 스트림 멀티플렉싱',
      '연결 마이그레이션 (네트워크 전환)',
    ],
  },
  {
    label: '④ 프로토콜',
    color: '#8b5cf6',
    desc: 'QUIC 스트림 위에서 Blob / Gossip 실행',
    detail: [
      'BlobProtocol: Verified Streaming (Hash로 검증)',
      'Gossip: topic별 pub-sub',
      'Router: ConnectionHandler trait 구현',
      'Endpoint::accept() → accept_bi()',
    ],
  },
];
