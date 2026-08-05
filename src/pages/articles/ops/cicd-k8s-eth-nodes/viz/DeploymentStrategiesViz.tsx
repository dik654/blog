/**
 * 4 종 배포 전략 — Recreate · Rolling · Blue/Green · Canary 비교.
 */
export default function DeploymentStrategiesViz() {
  const W = 720;
  const H = 380;
  const colW = 160;
  const gap = 16;
  const startX = (W - 4 * colW - 3 * gap) / 2;

  const strategies = [
    { name: 'Recreate', color: '#94a3b8', traffic: 'all-or-nothing', downtime: '있음', rollback: '느림', cost: '1x', best: '단순 / 짧은 다운 OK' },
    { name: 'Rolling', color: '#3b82f6', traffic: '점진 교체', downtime: '없음 (이론)', rollback: '점진', cost: '1x + maxSurge', best: 'K8s 기본' },
    { name: 'Blue/Green', color: '#10b981', traffic: 'switch toggle', downtime: '없음', rollback: '즉시', cost: '2x', best: '즉시 롤백 우선' },
    { name: 'Canary', color: '#f59e0b', traffic: '1% → 50% → 100%', downtime: '없음', rollback: '자동 SLI', cost: '1x + canary', best: '점진 검증' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">배포 전략 4 종 — 다운타임 vs 롤백 속도 vs 비용</text>

        {strategies.map((s, i) => {
          const x = startX + i * (colW + gap);
          return (
            <g key={s.name}>
              {/* 헤더 */}
              <rect x={x} y={50} width={colW} height={36} rx={6}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1.4} />
              <text x={x + colW / 2} y={73} textAnchor="middle" fontSize={12} fontWeight={700}
                fill={s.color}>{s.name}</text>

              {/* 시각 표현 — traffic shift */}
              <g>
                <rect x={x + 12} y={100} width={colW - 24} height={60} rx={4}
                  fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={0.6} />
                {/* 옛 버전 */}
                <rect x={x + 16}
                  y={i === 0 ? 100 : i === 1 ? 110 : i === 2 ? 110 : 110}
                  width={i === 0 ? colW - 32 : i === 1 ? (colW - 32) * 0.4 : i === 2 ? (colW - 32) * 0.5 : (colW - 32) * 0.7}
                  height={i === 0 ? 0 : 40} rx={2}
                  fill="#9ca3af" fillOpacity={0.3} />
                <text x={x + 28} y={i === 0 ? 130 : 134} fontSize={8} fill="#475569">old</text>
                {/* 새 버전 */}
                {i > 0 && (
                  <>
                    <rect x={x + 16 + (i === 1 ? (colW - 32) * 0.4 : i === 2 ? (colW - 32) * 0.5 : (colW - 32) * 0.7)}
                      y={110}
                      width={i === 1 ? (colW - 32) * 0.6 : i === 2 ? (colW - 32) * 0.5 : (colW - 32) * 0.3}
                      height={40} rx={2}
                      fill={s.color} fillOpacity={0.5} />
                    <text x={x + colW - 32} y={134} textAnchor="end" fontSize={8} fill={s.color} fontWeight={700}>new</text>
                  </>
                )}
                {i === 0 && (
                  <>
                    <rect x={x + 16} y={110} width={colW - 32} height={40} rx={2}
                      fill={s.color} fillOpacity={0.5} />
                    <text x={x + colW - 32} y={134} textAnchor="end" fontSize={8} fill={s.color} fontWeight={700}>new</text>
                  </>
                )}
              </g>

              {/* 속성 표 */}
              <text x={x + 8} y={185} fontSize={9} fontWeight={600} fill="var(--foreground)">트래픽:</text>
              <text x={x + colW - 8} y={185} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">{s.traffic}</text>
              <line x1={x} y1={193} x2={x + colW} y2={193} stroke="#94a3b8" strokeWidth={0.4} opacity={0.3} />

              <text x={x + 8} y={208} fontSize={9} fontWeight={600} fill="var(--foreground)">다운타임:</text>
              <text x={x + colW - 8} y={208} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">{s.downtime}</text>
              <line x1={x} y1={216} x2={x + colW} y2={216} stroke="#94a3b8" strokeWidth={0.4} opacity={0.3} />

              <text x={x + 8} y={231} fontSize={9} fontWeight={600} fill="var(--foreground)">롤백:</text>
              <text x={x + colW - 8} y={231} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">{s.rollback}</text>
              <line x1={x} y1={239} x2={x + colW} y2={239} stroke="#94a3b8" strokeWidth={0.4} opacity={0.3} />

              <text x={x + 8} y={254} fontSize={9} fontWeight={600} fill="var(--foreground)">비용:</text>
              <text x={x + colW - 8} y={254} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">{s.cost}</text>

              {/* 적합 */}
              <rect x={x} y={290} width={colW} height={50} rx={4}
                fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.6} />
              <text x={x + colW / 2} y={308} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>적합</text>
              <text x={x + colW / 2} y={324} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.best}</text>
            </g>
          );
        })}

        <text x={W / 2} y={365} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          K8s 기본 = Rolling / Argo Rollouts · Flagger 가 Canary · Blue/Green 자동화
        </text>
      </svg>
    </div>
  );
}
