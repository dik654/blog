import NATTypesViz from './viz/NATTypesViz';

export default function Overview() {
  const types = [
    { name: 'Full Cone', desc: '외부 어디서든 매핑 주소로 접근 가능', difficulty: '쉬움', c: '#10b981' },
    { name: 'Restricted Cone', desc: '내부가 먼저 보낸 IP만 접근 가능', difficulty: '보통', c: '#f59e0b' },
    { name: 'Port Restricted', desc: '내부가 보낸 IP+포트만 접근 가능', difficulty: '어려움', c: '#ef4444' },
    { name: 'Symmetric', desc: '목적지마다 다른 매핑. 가장 까다로움', difficulty: '매우 어려움', c: '#8b5cf6' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: NAT 유형</h2>
      <div className="not-prose mb-8"><NATTypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NAT(Network Address Translation)는 사설 IP를 공인 IP로 변환하는 네트워크 장치입니다.<br />
          P2P 통신에서 가장 큰 장벽입니다.<br />
          두 피어가 모두 NAT 뒤에 있으면 직접 연결이 불가능합니다.
        </p>
        <h3>NAT 유형별 특성</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-6">
        {types.map(t => (
          <div key={t.name} className="rounded-xl border p-4"
            style={{ borderColor: t.c + '40', background: t.c + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: t.c }}>{t.name}</p>
            <p className="text-sm mt-1 text-foreground/80">{t.desc}</p>
            <p className="text-xs mt-1 text-foreground/50">홀 펀칭 난이도: {t.difficulty}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          iroh에서는 STUN + DERP 릴레이로 NAT를 통과합니다.<br />
          libp2p에서는 AutoNAT + Circuit Relay v2 + DCUtR 조합을 사용합니다.
        </p>
      </div>
    </section>
  );
}
