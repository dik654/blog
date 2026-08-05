/**
 * GPU 계층 — DC (H100/H200/B200/MI300X) vs Pro vs Consumer (RTX).
 */
export default function GpuTierViz() {
  const W = 720;
  const H = 380;

  const tiers = [
    {
      name: 'Datacenter (Hopper · Blackwell · Instinct)',
      color: '#76b900',
      models: [
        { n: 'H100 SXM5', mem: '80 GB HBM3', bw: '3.35 TB/s', tdp: '700W', use: 'LLM 학습/추론' },
        { n: 'H200', mem: '141 GB HBM3e', bw: '4.8 TB/s', tdp: '700W', use: 'LLM (대형)' },
        { n: 'B200', mem: '192 GB HBM3e', bw: '8 TB/s', tdp: '1000W', use: 'GPT-5급 학습' },
        { n: 'MI300X (AMD)', mem: '192 GB HBM3', bw: '5.3 TB/s', tdp: '750W', use: 'LLM 추론 비용효율' },
      ],
      y: 50,
    },
    {
      name: 'Workstation Pro (RTX 6000 Ada · L40S)',
      color: '#3b82f6',
      models: [
        { n: 'RTX 6000 Ada', mem: '48 GB GDDR6', bw: '960 GB/s', tdp: '300W', use: 'AI 워크스테이션 · 추론' },
        { n: 'L40S', mem: '48 GB GDDR6', bw: '864 GB/s', tdp: '350W', use: 'DC 추론 · graphics' },
      ],
      y: 175,
    },
    {
      name: 'Consumer (GeForce RTX)',
      color: '#f59e0b',
      models: [
        { n: 'RTX 4090', mem: '24 GB GDDR6X', bw: '1008 GB/s', tdp: '450W', use: 'Filecoin PC2/C2 · 소규모 추론' },
        { n: 'RTX 5090', mem: '32 GB GDDR7', bw: '1792 GB/s', tdp: '575W', use: '소비자 최강 · 추론 가성비' },
      ],
      y: 270,
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">NVIDIA · AMD GPU 3 계층 — Memory · Bandwidth · TDP</text>

        {tiers.map((tier) => (
          <g key={tier.name}>
            {/* tier 헤더 */}
            <rect x={20} y={tier.y} width={680} height={22} rx={4}
              fill={tier.color} fillOpacity={0.18} stroke={tier.color} strokeWidth={1} />
            <text x={32} y={tier.y + 16} fontSize={11} fontWeight={700} fill={tier.color}>{tier.name}</text>

            {tier.models.map((m, i) => {
              const y = tier.y + 28 + i * 24;
              return (
                <g key={m.n}>
                  <rect x={20} y={y} width={680} height={22} rx={3}
                    fill={tier.color} fillOpacity={0.05} stroke={tier.color} strokeWidth={0.6} />
                  <text x={32} y={y + 15} fontSize={10} fontWeight={700} fill={tier.color}>{m.n}</text>
                  <text x={170} y={y + 15} fontSize={9.5} fill="var(--muted-foreground)">{m.mem}</text>
                  <text x={295} y={y + 15} fontSize={9.5} fill="var(--muted-foreground)">{m.bw}</text>
                  <text x={395} y={y + 15} fontSize={9.5} fill="var(--muted-foreground)">{m.tdp}</text>
                  <text x={685} y={y + 15} textAnchor="end" fontSize={9.5} fontStyle="italic" fill="var(--muted-foreground)">{m.use}</text>
                </g>
              );
            })}
          </g>
        ))}

        <text x={W / 2} y={365} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          DC GPU 는 NVLink + SXM 모듈 · Consumer 는 PCIe 단독 · Pro 는 둘 다 가능
        </text>
      </svg>
    </div>
  );
}
