import type { Article } from "../types";

export const p2pArticles2: Article[] = [
  /* ── IPFS / Content Addressing ── */
  {
    slug: "kubo",
    title: "Kubo: CID에서 provider·Bitswap·pin/GC까지",
    subcategory: "p2p-ipfs",
    sections: [
      { id: "overview", title: "한 파일이 이동하는 전체 경로" },
      { id: "routing-bitswap", title: "provider 후보와 block 수신" },
      { id: "pinning-gc", title: "pin과 GC 보존 경계" },
      { id: "release", title: "gateway·실패·release gate" },
    ],
    component: () => import("@/pages/articles/p2p/kubo"),
  },

  /* ── libp2p ── */
  {
    slug: "libp2p",
    title: "rust-libp2p Swarm 아키텍처: 코드 추적",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "개요 & Swarm 중심 설계" },
      { id: "transport-trait", title: "Transport 트레이트 추상화" },
      { id: "swarm-loop", title: "Swarm 이벤트 루프" },
      { id: "behaviour-trait", title: "NetworkBehaviour 트레이트" },
      { id: "handler-trait", title: "ConnectionHandler 트레이트" },
      { id: "connection-poll", title: "Connection::poll() 상태 머신" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p"),
  },
  {
    slug: "libp2p-tcp",
    title: "libp2p-tcp: TCP Transport 구현 코드 분석",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "TCP Transport 개요" },
      { id: "socket-creation", title: "소켓 생성: create_socket()" },
      { id: "dial-listen", title: "dial() & listen_on()" },
      { id: "upgrade-chain", title: "업그레이드 체인" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-tcp"),
  },
  {
    slug: "libp2p-quic",
    title: "rust-libp2p QUIC: PeerId 인증부터 stream까지",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "QUIC가 통합하는 경계" },
      { id: "identity-stream", title: "PeerId 인증과 stream" },
      { id: "hole-punching", title: "socket reuse와 hole punch" },
      { id: "release", title: "flow control·실패·release gate" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-quic"),
  },
  {
    slug: "libp2p-noise",
    title: "libp2p-noise: Noise XX 핸드셰이크 구현 코드 분석",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "Noise XX 프로토콜 개요" },
      { id: "keypair-signing", title: "AuthenticKeypair & 서명" },
      { id: "handshake-flow", title: "XX 3라운드 핸드셰이크" },
      { id: "finish-verify", title: "finish() 검증 & 전환" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-noise"),
  },
  {
    slug: "libp2p-yamux",
    title: "rust-libp2p Yamux: stream credit·backpressure·failure scope",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "한 secure connection을 여러 stream으로" },
      { id: "stream-credit", title: "stream credit와 backpressure" },
      { id: "inbound-buffer", title: "inbound buffer와 version 경계" },
      { id: "release", title: "stream/connection 실패와 release" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-yamux"),
  },
  {
    slug: "libp2p-gossipsub",
    title: "rust-libp2p GossipSub: publish·heartbeat·peer score",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "파일이 아니라 CID를 알린다" },
      { id: "publish-heartbeat", title: "publish cache와 heartbeat" },
      { id: "peer-scoring", title: "local peer score" },
      { id: "release", title: "validation·retry·release gate" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-gossipsub"),
  },

  /* ── BitTorrent ── */
  {
    slug: "bittorrent",
    title: "BitTorrent 아키텍처",
    subcategory: "p2p-bittorrent",
    sections: [
      { id: "overview", title: "개요" },
      { id: "architecture", title: "아키텍처" },
    ],
    component: () => import("@/pages/articles/filecoin/bittorrent"),
  },
  {
    slug: "rqbit",
    title: "rqbit: peer 후보부터 piece hash·range stream까지",
    subcategory: "p2p-bittorrent",
    sections: [
      { id: "overview", title: "torrent를 받는 전체 경로" },
      { id: "peer-piece", title: "peer queue와 in-flight piece" },
      { id: "piece-verify", title: "piece hash admission" },
      { id: "range-release", title: "range stream·restart·release" },
    ],
    component: () => import("@/pages/articles/p2p/rqbit"),
  },

  /* ── Iroh ── */
  {
    slug: "iroh",
    title: "Iroh: EndpointAddr·ALPN·direct/relay 경로 선택",
    subcategory: "p2p-iroh",
    sections: [
      { id: "overview", title: "콘텐츠 찾기와 endpoint 연결의 경계" },
      { id: "endpoint-alpn", title: "EndpointAddr와 ALPN" },
      { id: "path-selection", title: "direct·relay 경로 선택" },
      { id: "release", title: "실패·재시도·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/iroh"),
  },
];
