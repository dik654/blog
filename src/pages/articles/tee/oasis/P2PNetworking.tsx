import P2PNetworkingViz from './viz/P2PNetworkingViz';
import PeerDiscoveryViz from './viz/PeerDiscoveryViz';

export default function P2PNetworking() {
  return (
    <section id="p2p-networking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>libp2p</strong> 기반 모듈러 네트워킹 스택<br />
          <strong>GossipSub</strong>(메시 기반 pub/sub)로 Commitment·Tx 전파<br />
          <strong>Peer Manager</strong>가 연결 풀 관리, <strong>Sentry 노드</strong>가 검증인을 DDoS로부터 보호<br />
          <strong>2가지 네트워크 분리</strong>: Consensus P2P + Runtime P2P (per-ParaTime)
        </p>
      </div>

      <P2PNetworkingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">libp2p 스택 구성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/p2p/p2p.go

// libp2p 호스트 초기화
host := libp2p.New(
    // Transport
    libp2p.Transport(tcp.NewTCPTransport),
    libp2p.Transport(quic.NewTransport),

    // Security
    libp2p.Security(noise.ID, noise.New),

    // Muxer
    libp2p.Muxer(yamux.ID, yamux.DefaultTransport),

    // Identity
    libp2p.Identity(privKey),        // Ed25519 node key

    // Listen addresses
    libp2p.ListenAddrStrings(
        "/ip4/0.0.0.0/tcp/26656",
        "/ip4/0.0.0.0/udp/26656/quic-v1",
    ),

    // NAT traversal
    libp2p.EnableNATService(),
    libp2p.EnableRelay(),
    libp2p.EnableHolePunching(),
)

// Gossipsub 설정
gossipsub := pubsub.NewGossipSub(ctx, host,
    pubsub.WithFloodPublish(true),
    pubsub.WithMessageSignaturePolicy(pubsub.StrictSign),
    pubsub.WithPeerExchange(true),
)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gossipsub 토픽 — 메시지 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">토픽</th>
                <th className="border border-border px-3 py-2 text-left">메시지</th>
                <th className="border border-border px-3 py-2 text-left">네트워크</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/consensus/tx</code></td>
                <td className="border border-border px-3 py-2">합의 트랜잭션 mempool</td>
                <td className="border border-border px-3 py-2">Consensus</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/consensus/block</code></td>
                <td className="border border-border px-3 py-2">제안 블록</td>
                <td className="border border-border px-3 py-2">Consensus</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/commit</code></td>
                <td className="border border-border px-3 py-2">Executor commitment</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/tx</code></td>
                <td className="border border-border px-3 py-2">Runtime 트랜잭션 pool</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/proposal</code></td>
                <td className="border border-border px-3 py-2">배치 제안</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">피어 발견 메커니즘</h3>
      </div>
      <PeerDiscoveryViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// 4단계 피어 발견 파이프라인

// 1) Bootstrap nodes (seed)
bootstrapPeers := []string{
    "/dnsaddr/bootstrap.oasis.dev/p2p/12D3Koo...",
    "/dnsaddr/bootstrap-1.oasis.dev/p2p/12D3Koo...",
    // ...
}
for _, addr := range bootstrapPeers {
    host.Connect(addr)
}

// 2) Registry-based discovery
// Consensus에 등록된 노드 리스트 쿼리
nodes := registry.GetNodes(latestEpoch)
for _, n := range nodes {
    if n.HasRole(runtimeID) {
        host.Connect(n.P2PAddress)
    }
}

// 3) Kademlia DHT
// libp2p-kad-dht로 peer 주소 분산 저장
// Peer ID로 multiaddr 조회
dht.FindPeer(ctx, targetPeerID)

// 4) Peer Exchange (GossipSub)
// Mesh 안 피어들이 서로 교환
// Peer Scoring으로 nefarious peer 차단`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sentry Architecture — 검증인 보호</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Sentry = 검증인 앞단 프록시 노드

// 네트워크 토폴로지
Internet
  ↓
Sentry Node 1, 2, 3  (공개 IP, P2P 브로드캐스트)
  ↓ (private network)
Validator Node       (비공개 IP, sentry에만 연결)

// config.yaml (sentry)
sentry:
  enabled: true
  upstream_addresses:
    - "<validator_pubkey>@<validator_ip>:26656"

// config.yaml (validator)
p2p:
  parent_node:
    # sentry만 신뢰
    private_peer_ids:
      - <sentry_1_pubkey>
      - <sentry_2_pubkey>

// 효과
// - DDoS 공격 시 sentry만 영향받음
// - 검증인 IP 외부 노출 안 됨
// - Sentry 1개 다운돼도 다른 sentry로 대체`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Per-ParaTime P2P 분리</p>
          <p>
            <strong>왜 분리했나</strong>:<br />
            - 각 ParaTime은 독립된 tx pool 보유<br />
            - ParaTime별 boostrap·topology 구성<br />
            - 악성 ParaTime의 gossip spam이 다른 ParaTime에 전파 차단
          </p>
          <p className="mt-2">
            <strong>비용</strong>:<br />
            ✗ 노드당 n개 libp2p 호스트 운영<br />
            ✗ Peer discovery 중복<br />
            ✗ 메모리·소켓 사용량 증가
          </p>
          <p className="mt-2">
            <strong>trade-off 수용</strong>: 격리 이점이 오버헤드 상회<br />
            - 멀티 ParaTime 아키텍처의 핵심 보안 속성<br />
            - Cosmos IBC relayer와 유사한 분리 원칙
          </p>
        </div>

      </div>
    </section>
  );
}
