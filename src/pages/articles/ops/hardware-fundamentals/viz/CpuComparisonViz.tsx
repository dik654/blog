/**
 * Intel Xeon vs AMD EPYC — 세대별 코어 / 캐시 / 메모리 / TDP 비교.
 */
export default function CpuComparisonViz() {
  const W = 720;
  const H = 380;

  const intel = [
    { gen: 'Sapphire Rapids (4th)', cores: 60, l3: '112 MB', mem: 'DDR5-4800 8ch', tdp: '350W', y: 70 },
    { gen: 'Emerald Rapids (5th)', cores: 64, l3: '320 MB', mem: 'DDR5-5600 8ch', tdp: '350W', y: 105 },
    { gen: 'Granite Rapids (6th)', cores: 128, l3: '480 MB', mem: 'DDR5-6400 12ch · MRDIMM', tdp: '500W', y: 140 },
    { gen: 'Sierra Forest (E-core)', cores: 288, l3: '108 MB', mem: 'DDR5-6400 12ch', tdp: '500W', y: 175 },
  ];

  const amd = [
    { gen: 'Genoa (4th, Zen 4)', cores: 96, l3: '384 MB', mem: 'DDR5-4800 12ch', tdp: '360W', y: 235 },
    { gen: 'Bergamo (Zen 4c)', cores: 128, l3: '256 MB', mem: 'DDR5-4800 12ch', tdp: '360W', y: 270 },
    { gen: 'Turin (5th, Zen 5)', cores: 192, l3: '512 MB', mem: 'DDR5-6400 12ch', tdp: '500W', y: 305 },
    { gen: 'Turin Dense (Zen 5c)', cores: 192, l3: '768 MB · 3D V-Cache', mem: 'DDR5-6400 12ch', tdp: '500W', y: 340 },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">서버 CPU 세대 비교 — Intel Xeon vs AMD EPYC (2024~2025)</text>

        {/* Intel header */}
        <rect x={20} y={42} width={680} height={24} rx={4}
          fill="#0071c5" fillOpacity={0.18} stroke="#0071c5" strokeWidth={1} />
        <text x={32} y={59} fontSize={11} fontWeight={700} fill="#0071c5">Intel Xeon — Performance core 우선, Sierra Forest 만 efficiency core</text>

        {intel.map((c) => (
          <g key={c.gen}>
            <rect x={20} y={c.y} width={680} height={28} rx={3}
              fill="#0071c5" fillOpacity={0.06} stroke="#0071c5" strokeWidth={0.6} />
            <text x={32} y={c.y + 18} fontSize={10} fontWeight={700} fill="#0071c5">{c.gen}</text>
            <text x={250} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">{c.cores} cores</text>
            <text x={345} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">L3 {c.l3}</text>
            <text x={460} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">{c.mem}</text>
            <text x={685} y={c.y + 18} textAnchor="end" fontSize={9.5} fontWeight={600} fill="var(--muted-foreground)">{c.tdp}</text>
          </g>
        ))}

        {/* AMD header */}
        <rect x={20} y={207} width={680} height={24} rx={4}
          fill="#ed1c24" fillOpacity={0.18} stroke="#ed1c24" strokeWidth={1} />
        <text x={32} y={224} fontSize={11} fontWeight={700} fill="#ed1c24">AMD EPYC — chiplet 디자인, 코어 밀도 우위, 3D V-Cache 옵션</text>

        {amd.map((c) => (
          <g key={c.gen}>
            <rect x={20} y={c.y} width={680} height={28} rx={3}
              fill="#ed1c24" fillOpacity={0.06} stroke="#ed1c24" strokeWidth={0.6} />
            <text x={32} y={c.y + 18} fontSize={10} fontWeight={700} fill="#ed1c24">{c.gen}</text>
            <text x={250} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">{c.cores} cores</text>
            <text x={345} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">L3 {c.l3}</text>
            <text x={460} y={c.y + 18} fontSize={9.5} fill="var(--muted-foreground)">{c.mem}</text>
            <text x={685} y={c.y + 18} textAnchor="end" fontSize={9.5} fontWeight={600} fill="var(--muted-foreground)">{c.tdp}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
