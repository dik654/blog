import EpidemicViz from './viz/EpidemicViz';

export default function Overview() {
  const models = [
    { name: 'Push', desc: '새 정보를 받으면 즉시 이웃에게 전달', pros: '빠른 전파', c: '#6366f1' },
    { name: 'Pull', desc: '주기적으로 이웃에게 새 정보가 있는지 요청', pros: '대역폭 효율', c: '#10b981' },
    { name: 'Push-Pull', desc: 'Push로 빠르게 퍼뜨리고 Pull로 누락 보완', pros: '속도+신뢰', c: '#f59e0b' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: Epidemic 모델</h2>
      <div className="not-prose mb-8"><EpidemicViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Gossip 프로토콜은 전염병(Epidemic) 확산 모델에서 영감을 받은 분산 통신 방식입니다.<br />
          각 노드가 임의의 이웃에게 정보를 전달하면,
          O(log N) 라운드 만에 네트워크 전체로 정보가 퍼집니다.
        </p>
        <h3>전파 모델</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-6">
        {models.map(m => (
          <div key={m.name} className="rounded-xl border p-4"
            style={{ borderColor: m.c + '40', background: m.c + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.c }}>{m.name}</p>
            <p className="text-sm mt-1 text-foreground/80">{m.desc}</p>
            <p className="text-xs mt-1 text-foreground/50">{m.pros}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          libp2p의 GossipSub은 Push-Pull 모델의 변형입니다.<br />
          Ethereum 합의 레이어, Filecoin, IPFS 등 주요 P2P 시스템이 GossipSub을 사용합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip 프로토콜 수학적 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Epidemic Dissemination 수학
//
// N 노드 네트워크에서 정보 전파:
//
// Push model:
//   각 라운드: 각 감염 노드 → 랜덤 1명에게 전달
//   t 라운드 후 감염 비율:
//     I(t+1) = I(t) + I(t) · (1 - I(t))
//   Convergence: O(log N) rounds
//
// Pull model:
//   각 라운드: 각 미감염 노드 → 랜덤 1명에게 질의
//   t 라운드 후:
//     S(t+1) = S(t) · (1 - I(t))
//   Convergence: O(log N) rounds
//
// Push-Pull:
//   위 둘 결합
//   Convergence: O(log log N) - more robust

// 전파 특성:
//
// 1. Fault Tolerance
//    - 일부 노드 실패해도 전파 계속
//    - 중앙 조정 불필요
//    - Network partition 복원력
//
// 2. Scalability
//    - O(log N) rounds
//    - 각 노드 O(log N) contacts
//    - Network load 균등 분산
//
// 3. Simplicity
//    - 로컬 정보만 필요
//    - No global coordination
//    - 구현 단순

// vs Deterministic Broadcast:
//   - Multicast trees: fast but fragile
//   - Flooding: simple but wasteful
//   - Gossip: balance of both

// 응용:
//   - Blockchain block/tx propagation
//   - DHT membership (SWIM)
//   - Distributed databases (Cassandra, Dynamo)
//   - Failure detection
//   - Configuration updates

// 역사:
//   1987: Clearinghouse (Xerox PARC)
//   1990s: Lazy replication, anti-entropy
//   2002: SWIM protocol
//   2007: Cassandra, Amazon Dynamo
//   2015+: GossipSub (libp2p), Ethereum`}
        </pre>
      </div>
    </section>
  );
}
