export default function AmplificationViz() {
  const origin = { x: 50, y: 200 };
  const scale = 20;

  // 3가지 A값으로 곡선 생성 (x+y = D=10 기준)
  const curves = [
    { A: 10, color: '#ef4444', label: 'A=10 (약함)' },
    { A: 100, color: '#f59e0b', label: 'A=100 (중간)' },
    { A: 1000, color: '#10b981', label: 'A=1000 (강함)' },
  ];

  const generateCurve = (A: number) => {
    const points: [number, number][] = [];
    for (let x = 0.5; x <= 9.5; x += 0.1) {
      const dist = Math.abs(x - 5) / 5;
      const csY = 10 - x;
      const cpY = 25 / x;
      // A 클수록 CS weight ↑
      const weight = Math.pow(dist, 2 + Math.log(A + 1) / 3);
      const y = csY * (1 - weight) + cpY * weight;
      if (y >= 0 && y <= 10) points.push([x, y]);
    }
    return points;
  };

  const toPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${origin.x + x * scale} ${origin.y - y * scale}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">증폭 계수 A의 효과</text>

        {/* 축 */}
        <line x1={origin.x} y1={origin.y} x2={origin.x + 10 * scale} y2={origin.y}
          stroke="var(--foreground)" strokeWidth={1} />
        <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - 10 * scale}
          stroke="var(--foreground)" strokeWidth={1} />

        {/* 그리드 */}
        {[0, 2, 4, 6, 8, 10].map(v => (
          <g key={`g-${v}`}>
            <line x1={origin.x + v * scale} y1={origin.y - 10 * scale} x2={origin.x + v * scale} y2={origin.y}
              stroke="var(--border)" strokeWidth={0.3} opacity={0.3} />
            <text x={origin.x + v * scale} y={origin.y + 12} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}

        {/* 균형점 */}
        <circle cx={origin.x + 5 * scale} cy={origin.y - 5 * scale} r={3} fill="#f59e0b" />

        {/* 곡선들 */}
        {curves.map(curve => (
          <path key={curve.A}
            d={toPath(generateCurve(curve.A))}
            stroke={curve.color}
            strokeWidth={2}
            fill="none" />
        ))}

        {/* 범례 */}
        <g transform="translate(290, 50)">
          <rect x={0} y={0} width={170} height={70} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          {curves.map((curve, i) => (
            <g key={curve.A} transform={`translate(8, ${15 + i * 18})`}>
              <line x1={0} y1={0} x2={25} y2={0} stroke={curve.color} strokeWidth={2.5} />
              <text x={30} y={3} fontSize={8} fontWeight={600} fill={curve.color}>{curve.label}</text>
            </g>
          ))}
        </g>

        <text x={140} y={225} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">A 클수록 균형 근처에서 더 평평 → 슬리피지 ↓</text>
      </svg>
    </div>
  );
}
