export default function ProviderCompatMatrixViz() {
  // Matrix: features (rows) × providers (columns)
  const providers = [
    { key: 'anthropic', name: 'Anthropic', color: '#f97316' },
    { key: 'openai',    name: 'OpenAI',    color: '#10b981' },
    { key: 'azure',     name: 'Azure',     color: '#3b82f6' },
  ];

  type CellStatus = 'full' | 'none' | 'partial';

  const features: Array<{
    name: string;
    note: string;
    cells: Record<string, CellStatus>;
  }> = [
    {
      name: 'prompt caching',
      note: '명시적 cache_control mark',
      cells: { anthropic: 'full', openai: 'partial', azure: 'partial' },
    },
    {
      name: 'image input',
      note: 'base64 vs URL 형식',
      cells: { anthropic: 'full', openai: 'full', azure: 'full' },
    },
    {
      name: 'thinking blocks',
      note: 'Claude 3.7+ 전용',
      cells: { anthropic: 'full', openai: 'none', azure: 'none' },
    },
    {
      name: 'computer use',
      note: 'Anthropic 전용 tool',
      cells: { anthropic: 'full', openai: 'none', azure: 'none' },
    },
  ];

  const statusColor: Record<CellStatus, { fill: string; text: string; label: string }> = {
    full:    { fill: '#10b981', text: '#10b981', label: '✓' },
    partial: { fill: '#f59e0b', text: '#f59e0b', label: '~' },
    none:    { fill: '#ef4444', text: '#ef4444', label: '✗' },
  };

  const colStart = 200;
  const colWidth = 108;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">프로바이더 기능 매트릭스 — 4 features × 3 providers</text>

        {/* Provider headers */}
        {providers.map((p, pi) => {
          const x = colStart + pi * colWidth;
          return (
            <g key={p.key}>
              <rect x={x} y={44} width={colWidth - 8} height={32} rx={5}
                fill={p.color} fillOpacity={0.15} stroke={p.color} strokeWidth={1.5} />
              <text x={x + (colWidth - 8) / 2} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.color}>
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Feature rows */}
        {features.map((f, fi) => {
          const y = 90 + fi * 62;
          return (
            <g key={fi}>
              {/* Feature name */}
              <rect x={16} y={y} width={180} height={52} rx={5}
                fill="var(--muted)" opacity={0.5} stroke="var(--border)" strokeWidth={0.8} />
              <text x={26} y={y + 19} fontSize={10.5} fontWeight={700} fontFamily="monospace" fill="var(--foreground)">
                {f.name}
              </text>
              <text x={26} y={y + 36} fontSize={9} fill="var(--muted-foreground)">
                {f.note}
              </text>

              {/* Cells */}
              {providers.map((p, pi) => {
                const x = colStart + pi * colWidth;
                const status = f.cells[p.key];
                const s = statusColor[status];
                return (
                  <g key={p.key}>
                    <rect x={x} y={y} width={colWidth - 8} height={52} rx={5}
                      fill={s.fill} fillOpacity={0.12} stroke={s.fill} strokeWidth={1.4} />
                    {/* Status icon */}
                    <circle cx={x + (colWidth - 8) / 2} cy={y + 18} r={12}
                      fill={s.fill} fillOpacity={0.25} stroke={s.fill} strokeWidth={1.5} />
                    <text x={x + (colWidth - 8) / 2} y={y + 23} textAnchor="middle"
                      fontSize={14} fontWeight={700} fill={s.text}>
                      {s.label}
                    </text>
                    {/* Status label */}
                    <text x={x + (colWidth - 8) / 2} y={y + 44} textAnchor="middle"
                      fontSize={9} fontWeight={700} fill={s.text}>
                      {status === 'full' ? '완전 지원' : status === 'partial' ? '부분' : '미지원'}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        <rect x={16} y={336} width={528} height={20} rx={4}
          fill="var(--muted)" opacity={0.4} />
        <text x={26} y={350} fontSize={9.5} fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#10b981">✓ 완전</tspan>
          <tspan> · </tspan>
          <tspan fontWeight={700} fill="#f59e0b">~ 부분</tspan>
          <tspan> · </tspan>
          <tspan fontWeight={700} fill="#ef4444">✗ 미지원</tspan>
          <tspan>   —   claw-code는 "최대공약수" 기능만 사용</tspan>
        </text>
      </svg>
    </div>
  );
}
