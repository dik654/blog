export default function ModelPricingViz() {
  const models = [
    { name: 'Opus 4.6',   color: '#8b5cf6', prices: { input: 15.0, output: 75.0, cCreate: 18.75, cRead: 1.5 } },
    { name: 'Sonnet 4.6', color: '#3b82f6', prices: { input: 3.0,  output: 15.0, cCreate: 3.75,  cRead: 0.3 } },
    { name: 'Haiku 4.5',  color: '#10b981', prices: { input: 1.0,  output: 5.0,  cCreate: 1.25,  cRead: 0.1 } },
    { name: 'GPT-4o',     color: '#f59e0b', prices: { input: 2.5,  output: 10.0, cCreate: 2.5,   cRead: 1.25 } },
  ];

  const dims: Array<{ key: keyof typeof models[0]['prices']; label: string }> = [
    { key: 'input',   label: 'Input' },
    { key: 'output',  label: 'Output' },
    { key: 'cCreate', label: 'Cache create' },
    { key: 'cRead',   label: 'Cache read' },
  ];

  const maxPrice = 75;
  const chartX = 130;
  const chartW = 360;
  const groupH = 78;
  const barH = 14;

  const scale = (v: number) => (v / maxPrice) * chartW;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">모델별 단가 — USD per 1M tokens</text>

        {/* X-axis */}
        <text x={chartX} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0</text>
        <text x={chartX + scale(15)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">15</text>
        <text x={chartX + scale(30)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">30</text>
        <text x={chartX + scale(45)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">45</text>
        <text x={chartX + scale(60)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">60</text>
        <text x={chartX + scale(75)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">75 USD</text>

        {/* Grid lines */}
        {[15, 30, 45, 60, 75].map((g) => (
          <line key={g} x1={chartX + scale(g)} y1={50} x2={chartX + scale(g)} y2={50 + models.length * groupH}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
        ))}

        {/* Grouped bars */}
        {models.map((m, mi) => {
          const gy = 54 + mi * groupH;
          return (
            <g key={m.name}>
              {/* Model name */}
              <text x={chartX - 10} y={gy + 20} textAnchor="end" fontSize={11} fontWeight={700} fill={m.color}>
                {m.name}
              </text>
              {/* Model color stripe */}
              <rect x={chartX - 6} y={gy + 2} width={3} height={groupH - 6} fill={m.color} rx={1} />
              {/* 4 bars for 4 price dimensions */}
              {dims.map((d, di) => {
                const price = m.prices[d.key];
                const w = Math.max(scale(price), 1.5);
                const y = gy + 2 + di * (barH + 1);
                return (
                  <g key={d.key}>
                    {/* Dimension label (first model only) */}
                    {mi === 0 && (
                      <text x={chartX - 10} y={y + 10} textAnchor="end" fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)" opacity={0}>
                        {d.label}
                      </text>
                    )}
                    <rect x={chartX} y={y} width={w} height={barH} rx={2}
                      fill={m.color} fillOpacity={di === 0 ? 0.85 : di === 1 ? 0.65 : di === 2 ? 0.45 : 0.25}
                      stroke={m.color} strokeWidth={0.5} />
                    {/* Price label */}
                    <text x={chartX + w + 4} y={y + 11} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={m.color}>
                      ${price}
                    </text>
                    {/* Dimension badge inside/next to bar */}
                    {w > 40 ? (
                      <text x={chartX + 4} y={y + 11} fontSize={8} fontWeight={700} fill="#fff">
                        {d.label}
                      </text>
                    ) : (
                      <text x={chartX + w + 34} y={y + 11} fontSize={8} fill="var(--muted-foreground)">
                        {d.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Insights at bottom */}
        <rect x={24} y={372} width={512} height={24} rx={4}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={34} y={388} fontSize={9.5} fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="var(--foreground)">Claude 패턴:</tspan> output = input × 5 ·
          cache_create = input × 1.25 · cache_read = input × 0.1 (90% 절감)
        </text>
      </svg>
    </div>
  );
}
