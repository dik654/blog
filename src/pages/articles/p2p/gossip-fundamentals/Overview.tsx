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
    </section>
  );
}
