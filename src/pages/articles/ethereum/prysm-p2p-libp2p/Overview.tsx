import ContextViz from './viz/ContextViz';
import P2PStackViz from './viz/P2PStackViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">libp2p 스택 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 libp2p 스택 초기화부터 피어 탐색, 연결 관리, 메시지 전파까지를 코드 수준으로 추적한다.
        </p>

        {/* ── libp2p 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">libp2p — 모듈식 P2P 네트워킹 프레임워크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p: Protocol Labs의 P2P 네트워킹 프레임워크
// Polkadot, Filecoin, IPFS 등이 채택

// 모듈 구성:
// Transport: TCP, QUIC, WebSocket, WebRTC
// Multiplexer: yamux, mplex
// Security: Noise, TLS
// Discovery: Kademlia DHT, mDNS, Rendezvous
// PubSub: GossipSub, FloodSub
// Messaging: Kademlia, Bitswap, ...

// Ethereum 2.0 스펙 채택 (EIP-3403):
// - Transport: TCP (mandatory), QUIC (optional)
// - Multiplexer: yamux (mandatory), mplex (optional)
// - Security: Noise (mandatory)
// - Discovery: Discv5 (별도 UDP 프로토콜)
// - PubSub: GossipSub 1.1

// libp2p vs Ethereum 1 devp2p 비교:
// devp2p (EL):
//   - 이더리움 전용
//   - RLPx TCP transport
//   - 직접 구현 필요 (각 클라이언트마다)
// libp2p (CL):
//   - 범용 P2P 프레임워크
//   - 5개 언어 구현체 재사용
//   - 다른 프로토콜(Filecoin 등)과 공유

// Prysm이 libp2p-go를 사용하는 이유:
// - Go 공식 구현, 잘 유지보수됨
// - Ethereum Foundation 권장
// - GossipSub, Discv5 모두 지원`}
        </pre>
        <p className="leading-7">
          libp2p는 <strong>모듈식 P2P 프레임워크</strong> — Transport/Mux/Security/Discovery를 교체 가능.<br />
          Ethereum 2.0이 libp2p 채택 → IPFS, Filecoin과 공유 생태계 구축.<br />
          Prysm(Go), Lighthouse(Rust), Teku(Java) 모두 동일 프로토콜로 상호운용.
        </p>

        {/* ── Prysm 네트워크 스택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm의 P2P 스택 초기화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// beacon-chain/p2p/service.go

type Service struct {
    host libp2phost.Host           // libp2p host (connection pool)
    pubsub *pubsub.PubSub          // GossipSub instance
    dv5Listener discover.UDPv5     // Discv5 discovery
    peers *peers.Status            // peer reputation tracking
    privateKey crypto.PrivKey      // node's identity key
    config *Config
}

func NewService(ctx context.Context, cfg *Config) (*Service, error) {
    // 1. 아이덴티티 키 로드 (또는 생성)
    privKey, err := privateKey(cfg)

    // 2. libp2p host 생성
    host, err := libp2p.New(
        libp2p.Identity(privKey),
        libp2p.ListenAddrStrings(cfg.TCPAddr...),
        libp2p.Transport(tcp.NewTCPTransport),
        libp2p.Security(noise.ID, noise.New),      // encrypted
        libp2p.Muxer(yamux.ID, yamux.DefaultTransport),
        libp2p.ConnectionGater(s.gater),           // peer filtering
        libp2p.ResourceManager(s.rmgr),            // DoS protection
    )

    // 3. GossipSub 설정
    pubsub, err := pubsub.NewGossipSub(
        ctx, host,
        pubsub.WithMessageSignaturePolicy(pubsub.StrictSign),
        pubsub.WithPeerScore(peerScoreParams, peerScoreThresholds),
        pubsub.WithMaxMessageSize(GOSSIP_MAX_SIZE),
    )

    // 4. Discv5 시작 (UDP 기반 kademlia 변형)
    dv5Listener, err := startDiscv5(privKey, cfg)

    return &Service{host, pubsub, dv5Listener, ...}, nil
}`}
        </pre>
        <p className="leading-7">
          P2P 서비스 초기화 = <strong>host + pubsub + discv5</strong> 3단계.<br />
          host가 TCP 연결 관리, pubsub이 메시지 전파, discv5가 피어 탐색.<br />
          각 모듈이 독립적 — libp2p의 모듈성 그대로 활용.
        </p>

        {/* ── libp2p 구성 요소 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 구성 요소 4가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Transport Layer (TCP)
// - libp2p-tcp-transport
// - 표준 TCP, 포트 9000 (기본)
// - QUIC 지원 선택적 (포트 9001)

// 2. Security Layer (Noise)
// - Noise protocol (IK pattern)
// - Diffie-Hellman 기반 session key
// - Forward secrecy 제공
// - TLS보다 경량

// 3. Multiplexer (yamux)
// - 단일 TCP 연결에서 다중 스트림
// - 스트림당 독립 flow control
// - Ethereum 2.0 필수 프로토콜

// 4. Peer Identity (Peer ID)
// - 노드의 secp256k1 공개키 해시
// - multibase 인코딩 (base58btc)
// - 예: 16Uiu2HAmQ6tVfw3zRcQv...
// - 노드 식별 + Discv5 주소

// 프로토콜 문자열 (identify에 전달):
// /eth2/beacon_chain/req/status/1/
// /eth2/beacon_chain/req/ping/1/
// /eth2/beacon_chain/req/metadata/2/
// /eth2/beacon_chain/req/goodbye/1/
// /eth2/beacon_chain/req/beacon_blocks_by_range/2/
// /eth2/beacon_chain/req/beacon_blocks_by_root/2/
// /meshsub/1.1.0 (GossipSub)`}
        </pre>
        <p className="leading-7">
          libp2p 스택 = <strong>Transport + Security + Multiplexer + Identity</strong>.<br />
          각 계층이 독립적 교체 가능 → 미래 프로토콜 업그레이드 용이.<br />
          Ethereum consensus specs가 각 계층의 의무 프로토콜 지정.
        </p>
      </div>
      <div className="not-prose mt-6"><P2PStackViz /></div>
    </section>
  );
}
