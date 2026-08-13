import ContextViz from "./viz/ContextViz";
import P2PStackViz from "./viz/P2PStackViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prysm P2P는 discovery·connection·gossip을 계층으로 나눈다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 libp2p 스택 초기화부터 피어 탐색, 연결 관리, 메시지
          전파까지를 코드 수준으로 추적한다.
        </p>

        {/* ── libp2p 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          libp2p — 모듈식 P2P 네트워킹 프레임워크
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              libp2p — Protocol Labs의 P2P 네트워킹 프레임워크
            </p>
            <p className="text-sm text-foreground/80 mb-2">
              Polkadot, Filecoin, IPFS 등이 채택한 범용 프레임워크.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Transport</span> — TCP, QUIC,
                WebSocket, WebRTC
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Multiplexer</span> — yamux, mplex
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Security</span> — Noise, TLS
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Discovery</span> — Kademlia DHT,
                mDNS, Rendezvous
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">PubSub</span> — GossipSub, FloodSub
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Messaging</span> — Kademlia, Bitswap
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Ethereum 2.0 스펙 채택 (EIP-3403)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Transport</span> — TCP(필수),
                QUIC(선택)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Multiplexer</span> — yamux(필수),
                mplex(선택)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Security</span> — Noise(필수)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">Discovery</span> — Discv5(별도 UDP)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">PubSub</span> — GossipSub 1.1
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-orange-500 mb-1">
                devp2p (EL)
              </p>
              <p className="text-sm text-foreground/80">
                이더리움 전용. RLPx TCP transport. 각 클라이언트가 직접 구현.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">
                libp2p (CL)
              </p>
              <p className="text-sm text-foreground/80">
                범용 P2P 프레임워크. 5개 언어 구현체 재사용. Filecoin 등과 공유.
              </p>
            </div>
          </div>
          <p className="text-xs text-foreground/60">
            Prysm이 <code>libp2p-go</code>를 사용하는 이유 — Go 공식 구현 +
            Ethereum Foundation 권장 + GossipSub/Discv5 모두 지원.
          </p>
        </div>
        <p>
          Libp2p는 transport, stream multiplexer, secure channel, identity와 discovery를 조합하는 modular P2P framework입니다. Ethereum consensus networking은 이 ecosystem을 사용하되 mandatory protocol ID, encoding과 GossipSub parameter를 별도 specification으로 고정하므로 Prysm·Lighthouse·Teku 같은 서로 다른 language implementation이 상호 운용할 수 있습니다.
        </p>

        {/* ── Prysm 네트워크 스택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Prysm의 P2P 스택 초기화
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              beacon-chain/p2p/service.go — <code>Service</code> 구조체
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <code>host: libp2phost.Host</code> — libp2p host (connection
                pool)
              </span>
              <span>
                <code>pubsub: *pubsub.PubSub</code> — GossipSub 인스턴스
              </span>
              <span>
                <code>dv5Listener: discover.UDPv5</code> — Discv5 discovery
              </span>
              <span>
                <code>peers: *peers.Status</code> — 피어 평판 추적
              </span>
              <span>
                <code>privateKey: crypto.PrivKey</code> — 노드 아이덴티티 키
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>NewService()</code> — 초기화 4단계
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  아이덴티티 키 로드(또는 생성) — <code>privateKey(cfg)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  libp2p host 생성 —{" "}
                  <code>
                    libp2p.New(Identity, Transport(tcp), Security(noise),
                    Muxer(yamux), ConnectionGater, ResourceManager)
                  </code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  GossipSub 설정 —{" "}
                  <code>
                    pubsub.NewGossipSub(ctx, host, StrictSign, PeerScore,
                    MaxMessageSize)
                  </code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  Discv5 시작 — <code>startDiscv5(privKey, cfg)</code> (UDP 기반
                  Kademlia 변형)
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Prysm startup은 libp2p host, GossipSub와 discv5 discovery를 연결합니다. Host가 authenticated connection과 stream을 관리하고 GossipSub가 consensus topic mesh를 운용하며 discv5는 dial할 후보 ENR을 찾습니다. 세 모듈은 역할이 다르지만 peer identity와 subnet duty 같은 정보를 주고받으며 하나의 service로 동작합니다.
        </p>

        {/* ── libp2p 구성 요소 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          주요 구성 요소 4가지
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">
                1. Transport (TCP)
              </p>
              <p className="text-sm text-foreground/80">
                <code>libp2p-tcp-transport</code> — 표준 TCP, 포트 9000 기본.
                QUIC 선택적(포트 9001).
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">
                2. Security (Noise)
              </p>
              <p className="text-sm text-foreground/80">
                Noise protocol(IK pattern). Diffie-Hellman 기반 session key.
                Forward secrecy 제공. TLS보다 경량.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-purple-500 mb-1">
                3. Multiplexer (yamux)
              </p>
              <p className="text-sm text-foreground/80">
                단일 TCP 연결에서 다중 스트림. 스트림당 독립 flow control.
                Ethereum 2.0 필수.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-orange-500 mb-1">
                4. Peer Identity (Peer ID)
              </p>
              <p className="text-sm text-foreground/80">
                <code>secp256k1</code> 공개키 해시 + multibase
                인코딩(base58btc). 예: <code>16Uiu2HAmQ6tV...</code>
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              프로토콜 문자열 (identify에 전달)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground/70 font-mono">
              <span>/eth2/beacon_chain/req/status/1/</span>
              <span>/eth2/beacon_chain/req/ping/1/</span>
              <span>/eth2/beacon_chain/req/metadata/2/</span>
              <span>/eth2/beacon_chain/req/goodbye/1/</span>
              <span>/eth2/beacon_chain/req/beacon_blocks_by_range/2/</span>
              <span>/eth2/beacon_chain/req/beacon_blocks_by_root/2/</span>
              <span>/meshsub/1.1.0 (GossipSub)</span>
            </div>
          </div>
        </div>
        <p>
          Transport, security, multiplexer와 identity는 libp2p에서 교체 가능한 component이지만 Ethereum node가 임의 조합만 지원해도 되는 것은 아닙니다. Consensus networking specification이 interoperability에 필요한 protocol과 encoding을 정하고, client는 그 mandatory set 위에 선택적 transport를 추가합니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <P2PStackViz />
      </div>
    </section>
  );
}
