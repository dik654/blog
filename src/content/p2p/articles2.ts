import type { Article } from "../types";

export const p2pArticles2: Article[] = [
  /* ── IPFS / Content Addressing ── */
  {
    slug: "kubo",
    title: "Kubo: CID에서 provider·Bitswap·pin/GC까지",
    subcategory: "p2p-ipfs",
    sections: [
      { id: "overview", title: "CID A에서 A·B·C 보존까지" },
      { id: "routing-bitswap", title: "local miss·provider·retrieval" },
      { id: "pinning-gc", title: "A·B·C·D·E로 보는 pin과 GC" },
      { id: "release", title: "raw block·CAR·release gate" },
    ],
    component: () => import("@/pages/articles/p2p/kubo"),
  },

  /* ── libp2p ── */
  {
    slug: "libp2p",
    title: "rust-libp2p: 주소에서 protocol event까지",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "Bob에게 Ping 하나 보내기" },
      { id: "transport-trait", title: "주소를 lazy dial future로" },
      { id: "swarm-loop", title: "command와 event의 왕복" },
      { id: "behaviour-trait", title: "peer 전체 상태의 주인" },
      { id: "handler-trait", title: "connection 42 상태의 주인" },
      { id: "connection-poll", title: "100ms를 단계별로 추적하기" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p"),
  },
  {
    slug: "libp2p-tcp",
    title: "libp2p TCP: 주소에서 Swarm-ready 연결까지",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "TCP가 책임지는 마지막 지점" },
      { id: "socket-creation", title: "option과 port reuse의 실제 의미" },
      { id: "dial-listen", title: "lazy dial과 listener event" },
      { id: "upgrade-chain", title: "28.4ms와 49.4ms를 구별하기" },
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
    title: "libp2p Noise: XX에서 PeerId와 secure I/O까지",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "Channel key와 identity key의 차이" },
      { id: "keypair-signing", title: "Observed PeerId를 만드는 서명" },
      { id: "handshake-flow", title: "XX 세 message의 책임" },
      { id: "finish-verify", title: "65,535와 64,511을 구별하기" },
    ],
    component: () => import("@/pages/articles/p2p/libp2p-noise"),
  },
  {
    slug: "libp2p-yamux",
    title: "rust-libp2p Yamux: 독립 stream과 공유 connection",
    subcategory: "p2p-libp2p",
    sections: [
      { id: "overview", title: "한 secure connection을 여러 stream으로" },
      { id: "stream-open", title: "SYN·ACK와 stream open" },
      { id: "stream-credit", title: "stream credit와 backpressure" },
      { id: "connection-poll", title: "독립 stream과 공유 socket" },
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
    title: "BitTorrent: block으로 받고 piece로 믿는 이유",
    subcategory: "p2p-bittorrent",
    sections: [
      { id: "overview", title: "한 문장 답과 고정 사례" },
      { id: "peer-discovery", title: "주소 후보와 handshake" },
      { id: "piece-verify", title: "block 요청과 piece 검증" },
      { id: "release", title: "승인·재시도·운영 경계" },
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
    title: "Iroh: 주소 후보에서 인증 연결·payload 검증까지",
    subcategory: "p2p-iroh",
    sections: [
      { id: "overview", title: "연결 영수증과 payload 영수증" },
      { id: "endpoint-alpn", title: "EndpointAddr·Connecting·ALPN" },
      { id: "path-selection", title: "relay→IPv4→IPv6 선택 장부" },
      { id: "release", title: "경계별 실패·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/iroh"),
  },
];
