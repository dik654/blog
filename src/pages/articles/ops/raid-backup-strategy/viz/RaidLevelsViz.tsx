/**
 * RAID 레벨 비교 — RAID0/1/5/6/10/Z2/Z3 의 disk layout · 용량 · 내구성.
 */
export default function RaidLevelsViz() {
  const W = 720;
  const H = 460;

  const levels = [
    {
      name: 'RAID 0 (stripe)', color: '#ef4444',
      desc: '병렬 분산 · 무 parity', cap: 'N × disk', tolerance: '0', useCase: 'sealing scratch · cache', y: 50,
    },
    {
      name: 'RAID 1 (mirror)', color: '#f59e0b',
      desc: '동일 복제 (2 → 1)', cap: 'N / 2', tolerance: 'N/2', useCase: '부팅 디스크 · DB log', y: 105,
    },
    {
      name: 'RAID 5 (parity 1)', color: '#10b981',
      desc: 'stripe + 단일 parity', cap: 'N − 1', tolerance: '1', useCase: '소규모 (위험: rebuild fail)', y: 160,
    },
    {
      name: 'RAID 6 / Z2 (parity 2)', color: '#3b82f6',
      desc: 'stripe + 이중 parity', cap: 'N − 2', tolerance: '2', useCase: 'Filecoin sealed sector · 대용량 archive', y: 215,
    },
    {
      name: 'Z3 (parity 3)', color: '#8b5cf6',
      desc: 'stripe + 삼중 parity', cap: 'N − 3', tolerance: '3', useCase: '극대용량 + URE 위험 (HDD 22TB+)', y: 270,
    },
    {
      name: 'RAID 10 (stripe + mirror)', color: '#ec4899',
      desc: 'mirror 조합 후 stripe', cap: 'N / 2', tolerance: 'mirror 별 1', useCase: 'DB · 고성능 + 안정성', y: 325,
    },
    {
      name: 'erasure coding (4+2 등)', color: '#06b6d4',
      desc: '분산 parity (Reed-Solomon)', cap: '~k/(k+m)', tolerance: 'm', useCase: 'Ceph · MinIO · 객체 스토리지', y: 380,
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">RAID 레벨 비교 — 용량 · 내구성 · 용도</text>

        {/* 헤더 */}
        <text x={32} y={44} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">RAID 종류</text>
        <text x={300} y={44} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">용량</text>
        <text x={400} y={44} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">내구성 (동시 fail OK)</text>
        <text x={550} y={44} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">표준 용도</text>

        {levels.map((l) => (
          <g key={l.name}>
            <rect x={20} y={l.y} width={680} height={48} rx={5}
              fill={l.color} fillOpacity={0.06} stroke={l.color} strokeWidth={0.8} />
            <text x={32} y={l.y + 18} fontSize={10} fontWeight={700} fill={l.color}>{l.name}</text>
            <text x={32} y={l.y + 32} fontSize={8.5} fill="var(--muted-foreground)">{l.desc}</text>
            <text x={300} y={l.y + 25} fontSize={9.5} fontWeight={600} fill={l.color}>{l.cap}</text>
            <text x={400} y={l.y + 25} fontSize={9.5} fontWeight={600} fill={l.color}>{l.tolerance}</text>
            <text x={550} y={l.y + 25} fontSize={9} fill="var(--muted-foreground)">{l.useCase}</text>
          </g>
        ))}

        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          18 TB+ HDD 의 URE (10^14 bit) 고려하면 RAID5 rebuild 중 추가 fail 위험 — RAIDZ2 가 표준
        </text>
      </svg>
    </div>
  );
}
