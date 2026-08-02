/**
 * NVIDIA GPU 아키텍처 timeline — Volta → Turing → Ampere → Ada / Hopper → Blackwell.
 */
export default function ArchTimelineViz() {
  const W = 720;
  const H = 420;

  const archs = [
    { name: 'Volta', year: 2017, gpu: 'V100', proc: 'TSMC 12nm', tensor: '1st gen', innov: '첫 Tensor Core (FP16)', color: '#6366f1' },
    { name: 'Turing', year: 2018, gpu: 'T4 / RTX 20', proc: 'TSMC 12nm', tensor: '2nd gen', innov: 'INT8/INT4 + 첫 RT Core', color: '#8b5cf6' },
    { name: 'Ampere', year: 2020, gpu: 'A100 / RTX 30', proc: 'TSMC 7nm / SS 8nm', tensor: '3rd gen', innov: 'TF32 · BF16 · MIG · Sparsity', color: '#3b82f6' },
    { name: 'Hopper', year: 2022, gpu: 'H100 (DC only)', proc: 'TSMC 4N', tensor: '4th gen', innov: 'FP8 Transformer Engine · DPX · Confidential', color: '#10b981' },
    { name: 'Ada Lovelace', year: 2022, gpu: 'RTX 40 (consumer)', proc: 'TSMC 4N', tensor: '4th gen', innov: 'DLSS 3 · AV1 · 큰 L2', color: '#06b6d4' },
    { name: 'Blackwell', year: 2024, gpu: 'B100/B200 / RTX 50', proc: 'TSMC 4NP', tensor: '5th gen', innov: 'FP4 · dual-die · NVLink 5', color: '#f59e0b' },
    { name: 'Rubin', year: 2026, gpu: '(예정)', proc: 'TSMC 3nm 추정', tensor: '6th gen', innov: 'HBM4 · NVLink 6 · 새 메모리 hierarchy', color: '#ec4899' },
  ];

  const itemH = 45;
  const yStart = 60;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">NVIDIA GPU 아키텍처 timeline — Volta (2017) → Rubin (2026)</text>

        {/* 헤더 */}
        <text x={20} y={48} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">아키텍처 / 연도</text>
        <text x={210} y={48} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">대표 GPU</text>
        <text x={350} y={48} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">공정 / Tensor</text>
        <text x={520} y={48} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">핵심 혁신</text>

        {archs.map((a, i) => {
          const y = yStart + i * (itemH + 4);
          return (
            <g key={a.name}>
              {/* 색 띠 */}
              <rect x={20} y={y} width={680} height={itemH} rx={5}
                fill={a.color} fillOpacity={0.06} stroke={a.color} strokeWidth={0.8} />
              {/* 아키텍처 이름 */}
              <text x={32} y={y + 18} fontSize={11} fontWeight={700} fill={a.color}>{a.name}</text>
              <text x={32} y={y + 34} fontSize={9} fill="var(--muted-foreground)">{a.year}년</text>
              {/* GPU */}
              <text x={210} y={y + 18} fontSize={10} fontWeight={600} fill={a.color}>{a.gpu}</text>
              {/* 공정 / Tensor */}
              <text x={350} y={y + 18} fontSize={9.5} fill="var(--muted-foreground)">{a.proc}</text>
              <text x={350} y={y + 34} fontSize={9} fill={a.color} fontWeight={600}>Tensor Core {a.tensor}</text>
              {/* 혁신 */}
              <text x={520} y={y + 22} fontSize={9} fontWeight={600} fill={a.color}>{a.innov}</text>
            </g>
          );
        })}

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          Hopper 부터 DC / Consumer 가 분리 — Ada Lovelace 는 같은 4N 공정의 컨슈머용 (Tensor Core 도 같은 세대)
        </text>
      </svg>
    </div>
  );
}
