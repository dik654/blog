import CodePanel from '@/components/ui/code-panel';
import DiscoveryMechanismViz from './viz/DiscoveryMechanismViz';
import {
  mechanisms, mdnsCode, mdnsAnnotations,
  kadDiscoveryCode, kadDiscoveryAnnotations,
} from './DiscoveryData';

export default function Discovery({ title }: { title?: string }) {
  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '피어 발견: mDNS, Kademlia, Rendezvous'}</h2>
      <div className="not-prose mb-8"><DiscoveryMechanismViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          피어 발견은 네트워크 참여의 첫 단계입니다.<br />
          libp2p는 <strong>LAN 자동 발견</strong>(mDNS), <strong>분산 조회</strong>(Kademlia),
          <strong>중앙 등록</strong>(Rendezvous), <strong>부트스트랩</strong>을 조합하여 사용합니다.
        </p>
      </div>

      <div className="space-y-1.5 mt-4">
        {mechanisms.map(m => (
          <div key={m.name} className="rounded-lg border p-3"
            style={{ borderColor: m.color + '30', background: m.color + '06' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold w-28" style={{ color: m.color }}>{m.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border"
                style={{ borderColor: m.color + '40', color: m.color }}>{m.scope}</span>
              <span className="text-[10px] font-mono text-foreground/40 ml-auto">{m.latency}</span>
            </div>
            <p className="text-xs text-foreground/65 mt-1.5">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>mDNS 구현</h3>
        <CodePanel title="mDNS 피어 발견" code={mdnsCode} annotations={mdnsAnnotations} />

        <h3>Kademlia DHT 발견</h3>
        <CodePanel title="Kademlia 피어 발견" code={kadDiscoveryCode}
          annotations={kadDiscoveryAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Discovery Mechanism 조합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 전형적 libp2p node discovery 전략

// Startup sequence
// 1) Bootstrap peers (hard-coded)
//    - Known reliable nodes
//    - Multiaddr list in config
//    - 예: IPFS bootstrap nodes

// 2) mDNS on local network
//    - LAN의 다른 libp2p 노드 자동 발견
//    - Dev environment 유용
//    - UDP multicast 224.0.0.251:5353

// 3) Kademlia DHT
//    - Bootstrap하여 random peers 발견
//    - Provider records (content routing)
//    - O(log n) lookup

// 4) PubSub Peer Exchange (optional)
//    - gossipsub v1.1 feature
//    - Mesh 내 peers 공유
//    - Bandwidth 효율

// 5) Rendezvous (optional)
//    - Named point of discovery
//    - Topic-based registration
//    - App-specific peers

// 각 메커니즘 trade-off
//                  mDNS    Kad-DHT  Bootstrap
// Scope            LAN     Global   Fixed
// Setup            Auto    Complex  Manual
// Overhead         Low     Medium   Zero
// Censorship       No      Hard     Easy

// 실전 예시 (IPFS)
// - 5+ bootstrap nodes initially
// - Kademlia DHT for content/peers
// - mDNS for dev workflows
// - Rendezvous for private networks`}</pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">피어 발견 기법 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Peer Discovery Mechanisms
//
// 1. mDNS (Multicast DNS)
//    RFC 6762 기반
//    용도: LAN 내 zero-config discovery
//
//    동작:
//      UDP multicast 224.0.0.251:5353
//      "_p2p._udp.local" service query
//      각 노드가 자기 multiaddr broadcast
//
//    특징:
//      - 자동 설정 (no bootstrap)
//      - LAN만 (multicast 범위)
//      - Dev environment 친화
//      - 방화벽 차단 가능
//
// 2. Kademlia DHT
//    Global P2P network
//
//    동작:
//      iterative FIND_NODE lookup
//      random walk discovery
//      Provider records (content)
//
//    특징:
//      - Global 규모
//      - 중앙 서버 불필요
//      - O(log n) lookup
//      - Bootstrap peers 필요
//
// 3. Rendezvous Protocol
//    Named meeting points
//
//    동작:
//      Rendezvous server에 "나 여기 있어" REGISTER
//      다른 노드가 "X 찾아줘" DISCOVER
//      Server가 매칭
//
//    특징:
//      - 중앙 서버 필요 (rendezvous)
//      - Topic-based
//      - App-specific peers
//      - Private networks에 유용
//
// 4. Bootstrap Nodes
//    Hard-coded reliable peers
//
//    동작:
//      config에 multiaddr list
//      첫 연결에 사용
//      다른 peers의 entry point
//
//    특징:
//      - 가장 간단
//      - 중앙화 (vendor 지정)
//      - DHT 시작점으로 필수
//
// 5. Peer Exchange (PEX)
//    Existing peers share their peers
//
//    동작:
//      연결된 peer에게 "peer list 줘"
//      transitive discovery
//
//    특징:
//      - Organic spreading
//      - DHT 보완
//      - GossipSub v1.1 내장

// libp2p Discovery Behaviours:
//   libp2p-mdns
//   libp2p-kad (Kademlia)
//   libp2p-rendezvous
//   libp2p-relay (relay-based)
//   libp2p-autonat (NAT detection)

// 실전 조합 (Ethereum 2.0):
//   discv5 for validator discovery
//   GossipSub PX for mesh peers
//   ENR-based peer filtering
//
// 실전 조합 (IPFS):
//   Bootstrap → Kademlia → mDNS
//   Dynamic reroll periodic`}
        </pre>
      </div>
    </section>
  );
}
