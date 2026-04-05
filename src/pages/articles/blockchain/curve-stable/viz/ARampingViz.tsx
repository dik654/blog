export default function ARampingViz() {
  const events = [
    { time: 't=0', A: 2000, label: '정상 (3pool)', color: '#10b981' },
    { time: 'UST 디페그', A: 2000, label: '초기 대응 시작', color: '#f59e0b' },
    { time: '+24h', A: 200, label: '위기 모드', color: '#ef4444' },
    { time: '+48h', A: 50, label: 'CP로 전환', color: '#ef4444' },
    { time: '+72h', A: 5, label: '유동성 보호', color: '#991b1b' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">ramp_A() — Terra UST 위기 당시 실제 대응</text>

        <text x={260} y={42} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">2022년 5월, 4pool A를 2000 → 5로 단계적 하향</text>

        {/* A 값 로그 차트 */}
        <line x1={60} y1={230} x2={490} y2={230} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={60} y1={80} x2={60} y2={230} stroke="var(--foreground)" strokeWidth={1} />

        {/* Y축 (log) */}
        {[1, 10, 100, 1000, 5000].map(v => {
          const y = 230 - (Math.log10(v) / Math.log10(5000)) * 150;
          return (
            <g key={v}>
              <line x1={56} y1={y} x2={490} y2={y} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={52} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {v}
              </text>
            </g>
          );
        })}

        {/* A 값 그리기 (각 이벤트) */}
        {events.map((e, i) => {
          const x = 80 + (i / (events.length - 1)) * 400;
          const y = 230 - (Math.log10(e.A) / Math.log10(5000)) * 150;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={5} fill={e.color} stroke="var(--card)" strokeWidth={1.5} />
              {i < events.length - 1 && (
                <line x1={x + 5} y1={y}
                  x2={80 + ((i + 1) / (events.length - 1)) * 400 - 5}
                  y2={230 - (Math.log10(events[i + 1].A) / Math.log10(5000)) * 150}
                  stroke="#ef4444" strokeWidth={2} />
              )}
              <text x={x} y={y - 10} textAnchor="middle" fontSize={10} fontWeight={700} fill={e.color}>
                A={e.A}
              </text>
              <text x={x} y={248} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
                {e.time}
              </text>
              <text x={x} y={260} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                {e.label}
              </text>
            </g>
          );
        })}

        {/* 안전장치 */}
        <rect x={20} y={276} width={480} height={42} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={32} y={293} fontSize={10} fontWeight={700} fill="var(--foreground)">안전 장치:</text>
        <text x={105} y={293} fontSize={10} fill="var(--muted-foreground)">
          최대 10배 변경 (1회) · MIN_RAMP_TIME 86400초 간격 · 선형 보간
        </text>
        <text x={32} y={310} fontSize={9} fontStyle="italic" fill="#ef4444">
          교훈: A 조정을 미리 준비해야 한다 — "페그는 영원하지 않다"
        </text>
      </svg>
    </div>
  );
}
