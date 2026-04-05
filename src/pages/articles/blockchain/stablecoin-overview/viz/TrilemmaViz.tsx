export default function TrilemmaViz() {
  // 삼각형 중심과 꼭짓점
  const cx = 240;
  const cy = 150;
  const r = 90;

  const top = { x: cx, y: cy - r };
  const bottomLeft = { x: cx - r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) };
  const bottomRight = { x: cx + r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Stablecoin Trilemma — 3개 중 2개만</text>

        {/* 삼각형 */}
        <polygon
          points={`${top.x},${top.y} ${bottomLeft.x},${bottomLeft.y} ${bottomRight.x},${bottomRight.y}`}
          fill="var(--muted)" opacity={0.1}
          stroke="var(--foreground)" strokeWidth={1} />

        {/* 꼭짓점 라벨 */}
        <text x={top.x} y={top.y - 10} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#10b981">탈중앙화</text>

        <text x={bottomLeft.x - 10} y={bottomLeft.y + 15} textAnchor="end" fontSize={11} fontWeight={700}
          fill="#3b82f6">자본 효율</text>

        <text x={bottomRight.x + 10} y={bottomRight.y + 15} textAnchor="start" fontSize={11} fontWeight={700}
          fill="#f59e0b">안정성</text>

        {/* 실제 스테이블코인 위치 */}
        {/* USDC/USDT: 자본효율 + 안정성, 탈중앙화 X */}
        <circle cx={cx} cy={bottomLeft.y - 20} r={6} fill="#3b82f6" />
        <text x={cx} y={bottomLeft.y - 5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          USDC / USDT
        </text>
        <text x={cx} y={bottomLeft.y + 6} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          (중앙화)
        </text>

        {/* DAI: 탈중앙 + 안정성, 자본효율 X */}
        <circle cx={cx + 35} cy={cy - 20} r={6} fill="#f59e0b" />
        <text x={cx + 65} y={cy - 17} fontSize={9} fontWeight={700} fill="#f59e0b">DAI</text>
        <text x={cx + 65} y={cy - 5} fontSize={7} fill="var(--muted-foreground)">
          (150%+ 과담보)
        </text>

        {/* UST: 탈중앙 + 자본효율, 안정성 X (실패) */}
        <circle cx={cx - 35} cy={cy - 20} r={6} fill="#ef4444" />
        <text x={cx - 65} y={cy - 17} textAnchor="end" fontSize={9} fontWeight={700} fill="#ef4444">UST</text>
        <text x={cx - 65} y={cy - 5} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
          (붕괴 2022)
        </text>

        {/* 하단 설명 */}
        <text x={240} y={260} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          각 스테이블코인은 3 속성 중 2개만 달성 — 완벽한 스테이블 부재
        </text>
      </svg>
    </div>
  );
}
