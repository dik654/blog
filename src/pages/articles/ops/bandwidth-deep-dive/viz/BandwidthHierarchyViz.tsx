/**
 * 시스템 bandwidth 계층 — L1 cache · L2 · HBM · DDR · NVLink · PCIe · Ethernet · HDD.
 */
export default function BandwidthHierarchyViz() {
  const W = 720;
  const H = 420;

  const tiers = [
    { name: 'L1 cache', bw: 8000, lat: '~1 ns', color: '#ef4444', desc: 'CPU/GPU core 안 SRAM' },
    { name: 'L2 cache', bw: 3000, lat: '~3 ns', color: '#f59e0b', desc: 'core 그룹 공유 SRAM' },
    { name: 'L3 cache', bw: 800, lat: '~10 ns', color: '#eab308', desc: '소켓 / die 공유' },
    { name: 'HBM3 (GPU)', bw: 3350, lat: '~150 ns', color: '#10b981', desc: 'GPU die 옆 stack' },
    { name: 'GDDR6X (consumer)', bw: 1000, lat: '~200 ns', color: '#06b6d4', desc: '컨슈머 GPU PCB' },
    { name: 'DDR5 12 ch', bw: 480, lat: '~80 ns', color: '#3b82f6', desc: '서버 system RAM' },
    { name: 'NVLink 4.0', bw: 900, lat: '~1 μs', color: '#8b5cf6', desc: 'GPU-to-GPU 직결' },
    { name: 'PCIe 5.0 x16', bw: 64, lat: '~1 μs', color: '#a855f7', desc: 'CPU ↔ device' },
    { name: 'InfiniBand 400', bw: 50, lat: '~5 μs', color: '#ec4899', desc: '노드 ↔ 노드 (RDMA)' },
    { name: '100 GbE', bw: 12.5, lat: '~10 μs', color: '#f43f5e', desc: '데이터센터 표준' },
    { name: 'NVMe PCIe 5', bw: 14, lat: '~50 μs', color: '#94a3b8', desc: '엔터프라이즈 SSD' },
    { name: 'HDD SATA', bw: 0.25, lat: '~10 ms', color: '#64748b', desc: 'cold archive' },
  ];

  const maxBw = 8000;
  const itemH = 26;
  const yStart = 50;

  // log scale for bar
  const logScale = (v: number) => Math.max(0, (Math.log10(v + 0.01) - Math.log10(0.1)) / (Math.log10(maxBw) - Math.log10(0.1)));

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Bandwidth 계층 — log scale (GB/s) · 4 자릿수 차이</text>

        {/* legends */}
        <text x={20} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">계층</text>
        <text x={170} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">대역폭 (GB/s)</text>
        <text x={300} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">latency</text>
        <text x={380} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">상대 막대 (log)</text>

        {tiers.map((t, i) => {
          const y = yStart + i * (itemH + 3);
          const barW = logScale(t.bw) * 280;
          return (
            <g key={t.name}>
              <text x={20} y={y + 17} fontSize={10} fontWeight={700} fill={t.color}>{t.name}</text>
              <text x={170} y={y + 17} fontSize={9.5} fill={t.color} fontWeight={600}>
                {t.bw >= 1 ? `${t.bw.toLocaleString()}` : t.bw}
              </text>
              <text x={300} y={y + 17} fontSize={9} fill="var(--muted-foreground)">{t.lat}</text>
              <rect x={380} y={y + 4} width={Math.max(2, barW)} height={itemH - 8} rx={2}
                fill={t.color} fillOpacity={0.55} stroke={t.color} strokeWidth={0.6} />
              <text x={380 + Math.max(barW, 4) + 6} y={y + 17} fontSize={8.5} fill="var(--muted-foreground)" fontStyle="italic">
                {t.desc}
              </text>
            </g>
          );
        })}

        <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          가장 빠른 SRAM (8 TB/s) 과 HDD (0.25 GB/s) 의 차이는 32,000 배 — 데이터 위치 = 성능
        </text>
      </svg>
    </div>
  );
}
