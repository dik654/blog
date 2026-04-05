export default function ReservesViz() {
  const reserveBreakdown = [
    { label: 'Treasury Bills', value: 80, color: '#10b981' },
    { label: 'Cash', value: 10, color: '#3b82f6' },
    { label: 'Repo', value: 5, color: '#8b5cf6' },
    { label: 'Direct T-bills', value: 5, color: '#f59e0b' },
  ];

  let cumulativeWidth = 0;
  const barWidth = 400;
  const startX = 40;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">USDC Reserves 구성 ($60B 기준)</text>

        {/* Stack bar */}
        {reserveBreakdown.map((r, i) => {
          const w = (r.value / 100) * barWidth;
          const x = startX + cumulativeWidth;
          cumulativeWidth += w;
          return (
            <g key={r.label}>
              <rect x={x} y={50} width={w} height={40}
                fill={r.color} opacity={0.8} />
              <text x={x + w / 2} y={75} textAnchor="middle" fontSize={9} fontWeight={700}
                fill="white">{r.value}%</text>
            </g>
          );
        })}

        {/* 라벨 */}
        <g transform="translate(40, 110)">
          {reserveBreakdown.map((r, i) => (
            <g key={r.label} transform={`translate(${i * 105}, 0)`}>
              <rect x={0} y={0} width={10} height={10} fill={r.color} rx={1} />
              <text x={15} y={9} fontSize={8} fontWeight={600} fill="var(--foreground)">{r.label}</text>
            </g>
          ))}
        </g>

        {/* 감사 정보 */}
        <rect x={40} y={150} width={400} height={70} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">투명성 메커니즘</text>

        <g transform="translate(55, 180)">
          <text x={0} y={10} fontSize={8} fontWeight={600} fill="#10b981">Monthly Attestation:</text>
          <text x={115} y={10} fontSize={8} fill="var(--muted-foreground)">Deloitte / Grant Thornton</text>

          <text x={0} y={24} fontSize={8} fontWeight={600} fill="#3b82f6">Public Reports:</text>
          <text x={115} y={24} fontSize={8} fill="var(--muted-foreground)">circle.com/transparency</text>

          <text x={240} y={10} fontSize={8} fontWeight={600} fill="#8b5cf6">BlackRock USDXX:</text>
          <text x={335} y={10} fontSize={8} fill="var(--muted-foreground)">SEC-regulated MMF</text>

          <text x={240} y={24} fontSize={8} fontWeight={600} fill="#f59e0b">Banking Partners:</text>
          <text x={335} y={24} fontSize={8} fill="var(--muted-foreground)">4+ 분산 (SVB 이후)</text>
        </g>
      </svg>
    </div>
  );
}
