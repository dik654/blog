export default function ActivationCompareViz() {
  const xMin = -4, xMax = 4, steps = 80;
  const xs: number[] = [];
  for (let i = 0; i <= steps; i++) xs.push(xMin + (i * (xMax - xMin)) / steps);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const tanh = (x: number) => Math.tanh(x);
  const relu = (x: number) => Math.max(0, x);
  const gelu = (x: number) =>
    0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));

  // x ∈ [-4,4] → [70, 560], y ∈ [-1.5, 2] → [210, 60]
  const plotX = (x: number) => 70 + ((x - xMin) / (xMax - xMin)) * 490;
  const plotY = (y: number) => 210 - ((y + 1.5) / 3.5) * 150;

  const pathOf = (fn: (x: number) => number) =>
    xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${plotX(x).toFixed(1)} ${plotY(fn(x)).toFixed(1)}`).join(' ');

  const functions = [
    { name: 'sigmoid', path: pathOf(sigmoid), color: '#3b82f6', range: '[0, 1]', issue: '기울기 소실' },
    { name: 'tanh',    path: pathOf(tanh),    color: '#8b5cf6', range: '[-1, 1]', issue: '기울기 소실' },
    { name: 'ReLU',    path: pathOf(relu),    color: '#ef4444', range: '[0, ∞)', issue: 'dying ReLU' },
    { name: 'GELU',    path: pathOf(gelu),    color: '#10b981', range: '≈ x (x≫0)', issue: '계산 비용' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 330" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">활성화 함수 비교</text>

        {/* 축 */}
        <line x1={70} y1={plotY(0)} x2={560} y2={plotY(0)} stroke="var(--border)" strokeWidth={1} />
        <line x1={plotX(0)} y1={60} x2={plotX(0)} y2={210} stroke="var(--border)" strokeWidth={1} />

        <text x={568} y={plotY(0) + 4} fontSize={12} fontWeight={600} fill="var(--muted-foreground)">x</text>
        <text x={plotX(0) - 6} y={54} fontSize={12} fontWeight={600} fill="var(--muted-foreground)" textAnchor="end">f(x)</text>

        {/* y 눈금 */}
        {[-1, 0, 1, 2].map((v) => (
          <g key={v}>
            <line x1={66} y1={plotY(v)} x2={74} y2={plotY(v)} stroke="var(--border)" strokeWidth={1} />
            <text x={62} y={plotY(v) + 4} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">{v}</text>
          </g>
        ))}
        {/* x 눈금 */}
        {[-4, -2, 0, 2, 4].map((v) => (
          <g key={v}>
            <line x1={plotX(v)} y1={plotY(0) - 4} x2={plotX(v)} y2={plotY(0) + 4} stroke="var(--border)" strokeWidth={1} />
            {v !== 0 && <text x={plotX(v)} y={plotY(0) + 16} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">{v}</text>}
          </g>
        ))}

        {/* 곡선들 */}
        {functions.map((fn) => (
          <path key={fn.name} d={fn.path} fill="none" stroke={fn.color} strokeWidth={2.5} opacity={0.9} />
        ))}

        {/* 범례 */}
        {functions.map((fn, i) => {
          const x = 60 + i * 145;
          return (
            <g key={fn.name}>
              <line x1={x} y1={248} x2={x + 26} y2={248} stroke={fn.color} strokeWidth={3} />
              <text x={x + 32} y={253} fontSize={13} fontWeight={700} fill={fn.color}>{fn.name}</text>
              <text x={x} y={274} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">범위: {fn.range}</text>
              <text x={x} y={290} fontSize={10} fill="var(--muted-foreground)">단점: {fn.issue}</text>
            </g>
          );
        })}

        <text x={320} y={318} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">현대 표준: CNN·MLP는 ReLU, Transformer는 GELU</text>
      </svg>
    </div>
  );
}
