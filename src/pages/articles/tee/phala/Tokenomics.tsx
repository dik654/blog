import TokenomicsViz from './viz/TokenomicsViz';

export default function Tokenomics({ title }: { title?: string }) {
  const mechanics = [
    {
      name: 'PHA 스테이킹',
      color: '#8b5cf6',
      desc: '워커 운영자가 PHA를 스테이킹하여 네트워크에 참여. 슬래싱 조건으로 악의적 행동 방지.',
    },
    {
      name: '컴퓨트 보상',
      color: '#10b981',
      desc: '워커가 TEE 컴퓨팅 작업을 처리하면 PHA 보상 지급. 처리량에 비례하여 분배.',
    },
    {
      name: 'StakePool',
      color: '#f59e0b',
      desc: '위임 스테이킹 풀. 사용자가 PHA를 위임하고 워커 운영자가 관리. 수익 자동 분배.',
    },
    {
      name: '가치 약속(V)',
      color: '#ef4444',
      desc: '워커의 성능 점수(V)가 보상 배분 기준. CPU 성능, 가동 시간, 응답성으로 산출.',
    },
  ];

  return (
    <section id="tokenomics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '토크노믹스 (PHA)'}</h2>
      <div className="not-prose mb-8">
        <TokenomicsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Phala Network의 토큰 <strong>PHA</strong>는 TEE 컴퓨팅 네트워크의 인센티브 메커니즘입니다.<br />
          워커 운영자는 PHA를 스테이킹하고, 컴퓨팅 작업을 처리하여 보상을 받습니다.<br />
          가치 약속(V) 시스템으로 성능 기반 공정 분배를 실현합니다.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {mechanics.map(m => (
          <div key={m.name} className="rounded-xl border p-4"
            style={{ borderColor: m.color + '40', background: m.color + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.name}</p>
            <p className="text-sm mt-2 text-foreground/80 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
