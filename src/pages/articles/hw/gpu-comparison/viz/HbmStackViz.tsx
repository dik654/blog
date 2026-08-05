/**
 * HBM 3D 스택 vs GDDR PCB 트레이스 비교.
 */
export default function HbmStackViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">HBM 3D 스택 vs GDDR PCB 배치 — 대역폭 차이의 본질</text>

        {/* HBM 측 */}
        <g>
          <rect x={20} y={50} width={330} height={290} rx={8}
            fill="#10b981" fillOpacity={0.04} stroke="#10b981" strokeWidth={1.4} />
          <text x={185} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">HBM3/3e — GPU die 옆 stack</text>

          {/* 패키지 substrate */}
          <rect x={50} y={210} width={270} height={20} rx={2}
            fill="#94a3b8" fillOpacity={0.25} stroke="#94a3b8" strokeWidth={0.5} />
          <text x={185} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">interposer (silicon)</text>

          {/* GPU die */}
          <rect x={130} y={170} width={110} height={40} rx={3}
            fill="#10b981" fillOpacity={0.5} stroke="#10b981" strokeWidth={1.4} />
          <text x={185} y={194} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">GPU die</text>

          {/* HBM stack 좌 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`hl-${i}`} x={60} y={170 - i * 8} width={60} height={7} rx={1}
              fill="#10b981" fillOpacity={0.45 - i * 0.04} stroke="#10b981" strokeWidth={0.5} />
          ))}
          <text x={90} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">HBM stack</text>
          <text x={90} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">8 die × 24 GB</text>

          {/* HBM stack 우 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`hr-${i}`} x={250} y={170 - i * 8} width={60} height={7} rx={1}
              fill="#10b981" fillOpacity={0.45 - i * 0.04} stroke="#10b981" strokeWidth={0.5} />
          ))}
          <text x={280} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">HBM stack</text>
          <text x={280} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">8 die × 24 GB</text>

          {/* TSV 라인 (수직 vias) */}
          {[0, 15, 30, 45].map((dx) => (
            <line key={`tsv-l-${dx}`} x1={70 + dx} y1={170} x2={70 + dx} y2={130}
              stroke="#10b981" strokeWidth={0.4} opacity={0.7} />
          ))}
          {[0, 15, 30, 45].map((dx) => (
            <line key={`tsv-r-${dx}`} x1={260 + dx} y1={170} x2={260 + dx} y2={130}
              stroke="#10b981" strokeWidth={0.4} opacity={0.7} />
          ))}

          {/* 1024-bit 라벨 */}
          <text x={185} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">1024-bit interface (per stack)</text>

          {/* spec */}
          <rect x={50} y={250} width={270} height={70} rx={4}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={0.6} />
          <text x={185} y={268} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">spec (H200 / B200)</text>
          <text x={60} y={283} fontSize={9} fill="var(--muted-foreground)">• 대역폭: 4.8 ~ 8 TB/s</text>
          <text x={60} y={297} fontSize={9} fill="var(--muted-foreground)">• capacity: 141 ~ 192 GB / GPU</text>
          <text x={60} y={311} fontSize={9} fill="var(--muted-foreground)">• 가격: GPU BOM 의 큰 비중 (HBM 만 ~$2K)</text>
        </g>

        {/* GDDR 측 */}
        <g>
          <rect x={370} y={50} width={330} height={290} rx={8}
            fill="#f59e0b" fillOpacity={0.04} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={535} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">GDDR6X / GDDR7 — PCB trace</text>

          {/* PCB */}
          <rect x={400} y={170} width={270} height={60} rx={3}
            fill="#94a3b8" fillOpacity={0.20} stroke="#94a3b8" strokeWidth={0.5} />
          <text x={535} y={226} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">PCB (graphics card)</text>

          {/* GPU die center */}
          <rect x={485} y={185} width={100} height={30} rx={3}
            fill="#f59e0b" fillOpacity={0.5} stroke="#f59e0b" strokeWidth={1.2} />
          <text x={535} y={205} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">GPU die</text>

          {/* GDDR 칩 8개 (외곽) */}
          {[
            { x: 400, y: 130, label: 'G' },
            { x: 440, y: 130, label: 'G' },
            { x: 480, y: 130, label: 'G' },
            { x: 520, y: 130, label: 'G' },
            { x: 560, y: 130, label: 'G' },
            { x: 600, y: 130, label: 'G' },
            { x: 640, y: 130, label: 'G' },
            { x: 410, y: 240, label: 'G' },
          ].map((c, i) => (
            <g key={`g-${i}`}>
              <rect x={c.x} y={c.y} width={28} height={20} rx={2}
                fill="#f59e0b" fillOpacity={0.35} stroke="#f59e0b" strokeWidth={0.6} />
              <text x={c.x + 14} y={c.y + 14} textAnchor="middle" fontSize={8} fill="#f59e0b">{c.label}</text>
            </g>
          ))}

          {/* 트레이스 (긴 거리) */}
          {[414, 454, 494, 534, 574, 614, 654].map((cx, i) => (
            <line key={`tr-${i}`} x1={cx} y1={150} x2={500 + (i - 3) * 12} y2={185}
              stroke="#f59e0b" strokeWidth={0.4} opacity={0.5} strokeDasharray="2 1" />
          ))}

          <text x={535} y={166} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">32-bit × 8 칩 = 256-bit bus</text>

          {/* spec */}
          <rect x={400} y={250} width={270} height={70} rx={4}
            fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={0.6} />
          <text x={535} y={268} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">spec (RTX 5090)</text>
          <text x={410} y={283} fontSize={9} fill="var(--muted-foreground)">• 대역폭: 1.0 ~ 1.8 TB/s</text>
          <text x={410} y={297} fontSize={9} fill="var(--muted-foreground)">• capacity: 24 ~ 32 GB / GPU</text>
          <text x={410} y={311} fontSize={9} fill="var(--muted-foreground)">• 가격: 컨슈머 가격대 (HBM 의 ~10%)</text>
        </g>
      </svg>
    </div>
  );
}
