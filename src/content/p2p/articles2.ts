import type { Article } from '../types';

export const p2pArticles2: Article[] = [
  /* ── IPFS / Content Addressing ── */
  {
    slug: 'kubo',
    title: 'IPFS Kubo: Go 구현체 아키텍처 (Bitswap, DHT, Gateway)',
    subcategory: 'p2p-ipfs',
    sections: [
      { id: 'overview', title: 'Kubo 개요' },
      { id: 'bitswap', title: 'Bitswap 프로토콜' },
      { id: 'content-routing', title: 'Content Routing' },
      { id: 'pinning-gc', title: 'Pinning & GC' },
      { id: 'gateway', title: 'Gateway' },
      { id: 'config', title: '설정' },
    ],
    component: () => import('@/pages/articles/p2p/kubo'),
  },

  /* ── libp2p ── */
  {
    slug: 'libp2p',
    title: 'rust-libp2p Swarm 아키텍처: 코드 추적',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: '개요 & Swarm 중심 설계' },
      { id: 'transport-trait', title: 'Transport 트레이트 추상화' },
      { id: 'swarm-loop', title: 'Swarm 이벤트 루프' },
      { id: 'behaviour-trait', title: 'NetworkBehaviour 트레이트' },
      { id: 'handler-trait', title: 'ConnectionHandler 트레이트' },
      { id: 'connection-poll', title: 'Connection::poll() 상태 머신' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p'),
  },
  {
    slug: 'libp2p-tcp',
    title: 'libp2p-tcp: TCP Transport 구현 코드 분석',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: 'TCP Transport 개요' },
      { id: 'socket-creation', title: '소켓 생성: create_socket()' },
      { id: 'dial-listen', title: 'dial() & listen_on()' },
      { id: 'upgrade-chain', title: '업그레이드 체인' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p-tcp'),
  },
  {
    slug: 'libp2p-quic',
    title: 'libp2p-quic: QUIC Transport 구현 코드 분석',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: 'QUIC vs TCP' },
      { id: 'quinn-integration', title: 'quinn 통합' },
      { id: 'dial-mechanism', title: 'dial() 두 모드' },
      { id: 'hole-punching', title: 'QUIC 홀 펀칭' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p-quic'),
  },
  {
    slug: 'libp2p-noise',
    title: 'libp2p-noise: Noise XX 핸드셰이크 구현 코드 분석',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: 'Noise XX 프로토콜 개요' },
      { id: 'keypair-signing', title: 'AuthenticKeypair & 서명' },
      { id: 'handshake-flow', title: 'XX 3라운드 핸드셰이크' },
      { id: 'finish-verify', title: 'finish() 검증 & 전환' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p-noise'),
  },
  {
    slug: 'libp2p-yamux',
    title: 'libp2p-yamux: Yamux 멀티플렉싱 구현 코드 분석',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: 'Yamux 멀티플렉싱 개요' },
      { id: 'stream-muxer', title: 'StreamMuxer 구현' },
      { id: 'dual-version', title: '이중 버전 지원' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p-yamux'),
  },
  {
    slug: 'libp2p-gossipsub',
    title: 'libp2p-gossipsub: GossipSub 프로토콜 구현 코드 분석',
    subcategory: 'p2p-libp2p',
    sections: [
      { id: 'overview', title: 'GossipSub 프로토콜 개요' },
      { id: 'publish-flow', title: 'publish() 코드 추적' },
      { id: 'heartbeat', title: 'heartbeat() 유지보수' },
      { id: 'peer-scoring', title: '피어 스코어링' },
    ],
    component: () => import('@/pages/articles/p2p/libp2p-gossipsub'),
  },

  /* ── BitTorrent ── */
  {
    slug: 'bittorrent',
    title: 'BitTorrent 아키텍처',
    subcategory: 'p2p-bittorrent',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'architecture', title: '아키텍처' },
    ],
    component: () => import('@/pages/articles/filecoin/bittorrent'),
  },
  {
    slug: 'rqbit',
    title: 'rqbit: Rust BitTorrent 클라이언트 아키텍처',
    subcategory: 'p2p-bittorrent',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'torrent-parsing', title: 'Torrent 파싱' },
      { id: 'piece-management', title: '피스 관리' },
      { id: 'dht-impl', title: 'DHT 구현' },
      { id: 'peer-connection', title: '피어 연결' },
      { id: 'file-io', title: '파일 I/O' },
    ],
    component: () => import('@/pages/articles/p2p/rqbit'),
  },

  /* ── Iroh ── */
  {
    slug: 'iroh',
    title: 'iroh: P2P QUIC 연결 라이브러리',
    subcategory: 'p2p-iroh',
    sections: [
      { id: 'overview', title: '개요 & 핵심 아키텍처' },
      { id: 'networking', title: 'QUIC & Hole Punching' },
      { id: 'magicsock', title: 'MagicSock — 스마트 라우팅' },
      { id: 'discovery', title: '노드 발견 (Discovery)' },
      { id: 'protocols', title: '상위 프로토콜 시스템' },
    ],
    component: () => import('@/pages/articles/blockchain/iroh'),
  },
];
