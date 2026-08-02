/**
 * 네트워크 트래픽 이상 패턴 — baseline vs spike vs slow drain.
 */
export default function TrafficAnomalyViz() {
  const W = 720;
  const H = 360;

  // Baseline pattern (평일 패턴)
  const baseline = Array.from({ length: 48 }).map((_, i) => {
    const t = (i / 48) * 24;
    const business = t > 8 && t < 20 ? 0.7 + Math.sin((t - 14) * 0.5) * 0.2 : 0.15;
    return business + (Math.random() - 0.5) * 0.05;
  });

  // Anomaly: DDoS spike at hour 3
  const spike = baseline.map((v, i) => {
    if (i >= 6 && i <= 10) return Math.min(1.5, v + 1.0 + Math.random() * 0.2);
    return v;
  });

  // Slow drain: gradual increase from hour 18
  const drain = baseline.map((v, i) => {
    if (i >= 36) return v + (i - 36) * 0.05 + Math.random() * 0.05;
    return v;
  });

  const W_inner = 600;
  const H_inner = 80;
  const yBase = 60;

  const renderLine = (data: number[], color: string, y: number) => {
    const pts = data.map((v, i) => {
      const x = 60 + (i / (data.length - 1)) * W_inner;
      const py = y + H_inner - v * H_inner;
      return `${x},${py}`;
    }).join(' ');
    return <polyline points={pts} fill="none" stroke={color} strokeWidth={1.4} />;
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">네트워크 이상 패턴 3 종 — 정상 vs spike vs slow drain</text>

        {/* 차트 1 — baseline */}
        <text x={60} y={48} fontSize={9.5} fontWeight={700} fill="#10b981">정상 — 업무시간 곡선 (8~20시 peak)</text>
        <line x1={60} y1={yBase + H_inner} x2={60 + W_inner} y2={yBase + H_inner} stroke="#94a3b8" strokeWidth={0.4} />
        {renderLine(baseline, '#10b981', yBase)}

        {/* 차트 2 — spike */}
        <text x={60} y={170} fontSize={9.5} fontWeight={700} fill="#ef4444">⚠ DDoS spike — 새벽 3시에 급증 (정상의 5배)</text>
        <line x1={60} y1={yBase + 120 + H_inner} x2={60 + W_inner} y2={yBase + 120 + H_inner} stroke="#94a3b8" strokeWidth={0.4} />
        {renderLine(spike, '#ef4444', yBase + 120)}

        {/* spike 강조 영역 */}
        <rect x={60 + (6 / 47) * W_inner} y={yBase + 120}
          width={((10 - 6) / 47) * W_inner} height={H_inner}
          fill="#ef4444" fillOpacity={0.10} />

        {/* 차트 3 — slow drain */}
        <text x={60} y={290} fontSize={9.5} fontWeight={700} fill="#f59e0b">⚠ Slow drain — 저녁부터 점진 상승 (data exfiltration 의심)</text>
        <line x1={60} y1={yBase + 240 + H_inner} x2={60 + W_inner} y2={yBase + 240 + H_inner} stroke="#94a3b8" strokeWidth={0.4} />
        {renderLine(drain, '#f59e0b', yBase + 240)}

        <rect x={60 + (36 / 47) * W_inner} y={yBase + 240}
          width={((47 - 36) / 47) * W_inner} height={H_inner}
          fill="#f59e0b" fillOpacity={0.10} />

        {/* x-axis */}
        <text x={60} y={H - 5} fontSize={8} fill="var(--muted-foreground)">00:00</text>
        <text x={60 + W_inner / 2} y={H - 5} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">12:00</text>
        <text x={60 + W_inner} y={H - 5} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">23:59</text>
      </svg>
    </div>
  );
}
