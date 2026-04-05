export default function TickViz() {
  const ticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const tickWidth = 50;
  const startX = 50;
  const baseY = 170;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 280" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Tick — 가격 이산화 (P = 1.0001^i)</text>

        {/* 축 */}
        <line x1={30} y1={baseY} x2={490} y2={baseY} stroke="var(--foreground)" strokeWidth={1} />

        {/* LP 구간 하이라이트 */}
        <rect x={startX + 2 * tickWidth - 4} y={baseY - 56} width={4 * tickWidth + 8} height={48}
          fill="#10b981" opacity={0.15} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" rx={4} />
        <text x={startX + 4 * tickWidth} y={baseY - 66} textAnchor="middle" fontSize={11}
          fill="#10b981" fontWeight={700}>LP 유동성 구간 [-2, +2]</text>

        {/* tick 마커 */}
        {ticks.map(tick => {
          const x = startX + (tick + 4) * tickWidth;
          const p = Math.pow(1.0001, tick).toFixed(4);
          return (
            <g key={tick}>
              <line x1={x} y1={baseY - 10} x2={x} y2={baseY + 10}
                stroke="var(--foreground)" strokeWidth={1} />
              <text x={x} y={baseY + 28} textAnchor="middle" fontSize={10}
                fontWeight={700} fill="var(--foreground)">i={tick}</text>
              <text x={x} y={baseY + 44} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{p}</text>
            </g>
          );
        })}

        {/* 중심점 하이라이트 */}
        <circle cx={startX + 4 * tickWidth} cy={baseY} r={6} fill="#f59e0b" stroke="var(--card)" strokeWidth={2} />
        <text x={startX + 4 * tickWidth} y={baseY - 26} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="#f59e0b">현재 tick</text>

        {/* 설명 */}
        <text x={260} y={84} textAnchor="middle" fontSize={11} fontWeight={600}
          fill="var(--foreground)">1 tick = 0.01% 가격 변화 (1 basis point)</text>

        {/* 범위 */}
        <rect x={30} y={230} width={460} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={250} textAnchor="middle" fontSize={10}
          fill="var(--foreground)">범위: <tspan fontWeight={700}>-887,272 ~ 887,272</tspan></text>
        <text x={260} y={266} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">최소 가격 2e-39 ~ 최대 가격 3e38 (어떤 토큰 페어도 수용)</text>
      </svg>
    </div>
  );
}
