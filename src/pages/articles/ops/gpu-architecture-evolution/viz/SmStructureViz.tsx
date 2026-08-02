/**
 * SM (Streaming Multiprocessor) 구조 — Volta vs Hopper 의 차이.
 */
export default function SmStructureViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SM 구조 — Volta (V100) vs Hopper (H100) 비교</text>

        {/* Volta */}
        <g>
          <rect x={20} y={50} width={330} height={310} rx={8}
            fill="#6366f1" fillOpacity={0.06} stroke="#6366f1" strokeWidth={1.4} />
          <text x={185} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">Volta SM (V100, 2017)</text>

          {/* 4 quadrant */}
          {[0, 1, 2, 3].map((i) => {
            const x = 40 + (i % 2) * 145;
            const y = 90 + Math.floor(i / 2) * 110;
            return (
              <g key={i}>
                <rect x={x} y={y} width={140} height={100} rx={4}
                  fill="#6366f1" fillOpacity={0.08} stroke="#6366f1" strokeWidth={0.6} />
                <text x={x + 70} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1">SM partition {i + 1}</text>
                <text x={x + 6} y={y + 26} fontSize={8} fill="var(--muted-foreground)">• 16 FP32</text>
                <text x={x + 6} y={y + 38} fontSize={8} fill="var(--muted-foreground)">• 8 FP64</text>
                <text x={x + 6} y={y + 50} fontSize={8} fill="var(--muted-foreground)">• 16 INT32</text>
                <text x={x + 6} y={y + 62} fontSize={8} fontWeight={700} fill="#6366f1">• 2 Tensor Core</text>
                <text x={x + 6} y={y + 74} fontSize={8} fill="var(--muted-foreground)">• warp scheduler</text>
                <text x={x + 6} y={y + 86} fontSize={8} fill="var(--muted-foreground)">• L0 inst cache</text>
              </g>
            );
          })}

          {/* shared mem */}
          <rect x={40} y={310} width={290} height={36} rx={4}
            fill="#6366f1" fillOpacity={0.18} stroke="#6366f1" strokeWidth={0.8} />
          <text x={185} y={326} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#6366f1">L1 cache + shared memory (96 KB)</text>
          <text x={185} y={340} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">통합 / softable 분할</text>
        </g>

        {/* Hopper */}
        <g>
          <rect x={370} y={50} width={330} height={310} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={535} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Hopper SM (H100, 2022)</text>

          {[0, 1, 2, 3].map((i) => {
            const x = 390 + (i % 2) * 145;
            const y = 90 + Math.floor(i / 2) * 110;
            return (
              <g key={i}>
                <rect x={x} y={y} width={140} height={100} rx={4}
                  fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
                <text x={x + 70} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">SM partition {i + 1}</text>
                <text x={x + 6} y={y + 26} fontSize={8} fill="var(--muted-foreground)">• 32 FP32 (2x)</text>
                <text x={x + 6} y={y + 38} fontSize={8} fill="var(--muted-foreground)">• 16 FP64 (2x)</text>
                <text x={x + 6} y={y + 50} fontSize={8} fill="var(--muted-foreground)">• 16 INT32</text>
                <text x={x + 6} y={y + 62} fontSize={8} fontWeight={700} fill="#10b981">• 1 Tensor Core (4 gen)</text>
                <text x={x + 6} y={y + 74} fontSize={8} fill="var(--muted-foreground)">+ FP8 + Trans Engine</text>
                <text x={x + 6} y={y + 86} fontSize={8} fill="var(--muted-foreground)">+ async TMA</text>
              </g>
            );
          })}

          {/* shared mem (큰) */}
          <rect x={390} y={310} width={290} height={36} rx={4}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.8} />
          <text x={535} y={326} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">L1 + shared memory (256 KB · 2.6x)</text>
          <text x={535} y={340} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">+ Tensor Memory Accelerator (TMA)</text>
        </g>

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          Hopper 의 같은 SM 이 Volta 의 ~3x throughput — clock 거의 같음, 구조 효율로
        </text>
      </svg>
    </div>
  );
}
