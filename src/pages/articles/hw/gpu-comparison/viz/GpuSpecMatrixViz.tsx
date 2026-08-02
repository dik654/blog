/**
 * GPU 4 종 비교 — RTX 4090 vs 5090 vs A100 vs H100 spec matrix.
 */
export default function GpuSpecMatrixViz() {
  const W = 720;
  const H = 380;

  const gpus = [
    { name: 'RTX 4090', mem: '24 GB GDDR6X', bw: '1.0 TB/s', tdp: '450W', fp16: '660 TFLOPS', nvlink: 'X', color: '#f59e0b' },
    { name: 'RTX 5090', mem: '32 GB GDDR7', bw: '1.79 TB/s', tdp: '575W', fp16: '~838 TFLOPS', nvlink: 'X', color: '#ec4899' },
    { name: 'A100 80GB', mem: '80 GB HBM2e', bw: '2.0 TB/s', tdp: '400W', fp16: '312 TFLOPS', nvlink: 'O (NVLink 3)', color: '#3b82f6' },
    { name: 'H100 SXM5', mem: '80 GB HBM3', bw: '3.35 TB/s', tdp: '700W', fp16: '989 TFLOPS', nvlink: 'O (NVLink 4)', color: '#10b981' },
  ];

  const rowH = 40;
  const colW = 165;
  const startX = (W - 4 * colW) / 2;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">GPU 4 종 비교 — Consumer (4090/5090) vs Datacenter (A100/H100)</text>

        {/* 헤더 */}
        {gpus.map((g, i) => (
          <g key={g.name}>
            <rect x={startX + i * colW} y={45} width={colW - 4} height={36} rx={5}
              fill={g.color} fillOpacity={0.20} stroke={g.color} strokeWidth={1.2} />
            <text x={startX + i * colW + (colW - 4) / 2} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={g.color}>{g.name}</text>
          </g>
        ))}

        {/* 메모리 */}
        {gpus.map((g, i) => {
          const x = startX + i * colW;
          return (
            <g key={g.name + 'mem'}>
              <rect x={x} y={90} width={colW - 4} height={rowH} rx={4}
                fill={g.color} fillOpacity={0.05} stroke={g.color} strokeWidth={0.6} />
              <text x={x + 8} y={105} fontSize={9} fontWeight={600} fill={g.color}>메모리</text>
              <text x={x + 8} y={123} fontSize={9.5} fill="var(--muted-foreground)">{g.mem}</text>
            </g>
          );
        })}

        {/* bandwidth */}
        {gpus.map((g, i) => {
          const x = startX + i * colW;
          return (
            <g key={g.name + 'bw'}>
              <rect x={x} y={134} width={colW - 4} height={rowH} rx={4}
                fill={g.color} fillOpacity={0.05} stroke={g.color} strokeWidth={0.6} />
              <text x={x + 8} y={149} fontSize={9} fontWeight={600} fill={g.color}>대역폭</text>
              <text x={x + 8} y={167} fontSize={9.5} fill="var(--muted-foreground)">{g.bw}</text>
            </g>
          );
        })}

        {/* TDP */}
        {gpus.map((g, i) => {
          const x = startX + i * colW;
          return (
            <g key={g.name + 'tdp'}>
              <rect x={x} y={178} width={colW - 4} height={rowH} rx={4}
                fill={g.color} fillOpacity={0.05} stroke={g.color} strokeWidth={0.6} />
              <text x={x + 8} y={193} fontSize={9} fontWeight={600} fill={g.color}>TDP</text>
              <text x={x + 8} y={211} fontSize={9.5} fill="var(--muted-foreground)">{g.tdp}</text>
            </g>
          );
        })}

        {/* FP16 */}
        {gpus.map((g, i) => {
          const x = startX + i * colW;
          return (
            <g key={g.name + 'fp16'}>
              <rect x={x} y={222} width={colW - 4} height={rowH} rx={4}
                fill={g.color} fillOpacity={0.05} stroke={g.color} strokeWidth={0.6} />
              <text x={x + 8} y={237} fontSize={9} fontWeight={600} fill={g.color}>FP16 Tensor</text>
              <text x={x + 8} y={255} fontSize={9.5} fill="var(--muted-foreground)">{g.fp16}</text>
            </g>
          );
        })}

        {/* NVLink */}
        {gpus.map((g, i) => {
          const x = startX + i * colW;
          return (
            <g key={g.name + 'nv'}>
              <rect x={x} y={266} width={colW - 4} height={rowH} rx={4}
                fill={g.color} fillOpacity={0.05} stroke={g.color} strokeWidth={0.6} />
              <text x={x + 8} y={281} fontSize={9} fontWeight={600} fill={g.color}>NVLink</text>
              <text x={x + 8} y={299} fontSize={9.5} fill="var(--muted-foreground)">{g.nvlink}</text>
            </g>
          );
        })}

        <text x={W / 2} y={335} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          Consumer = 단일 GPU 추론 / Filecoin C2 / 게이밍 · DC = 학습 / 멀티 GPU 추론
        </text>
        <text x={W / 2} y={352} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          ECC · NVLink · DC 보증 · cooling spec — DC GPU 의 결정적 차이
        </text>
      </svg>
    </div>
  );
}
