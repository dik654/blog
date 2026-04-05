export default function ActivationZooViz() {
  const xMin = -4, xMax = 4, steps = 60;
  const xs: number[] = [];
  for (let i = 0; i <= steps; i++) xs.push(xMin + (i * (xMax - xMin)) / steps);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const tanh = (x: number) => Math.tanh(x);
  const relu = (x: number) => Math.max(0, x);
  const leakyRelu = (x: number) => (x > 0 ? x : 0.1 * x);
  const elu = (x: number) => (x > 0 ? x : Math.exp(x) - 1);
  const gelu = (x: number) =>
    0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
  const swish = (x: number) => x * sigmoid(x);
  const mish = (x: number) => x * Math.tanh(Math.log(1 + Math.exp(x)));

  const fns = [
    { name: 'Sigmoid', fn: sigmoid, color: '#3b82f6', formula: 'σ(x) = 1/(1+e⁻ˣ)', year: '~2000s' },
    { name: 'Tanh',    fn: tanh,    color: '#8b5cf6', formula: 'tanh(x)',         year: '~2000s' },
    { name: 'ReLU',    fn: relu,    color: '#ef4444', formula: 'max(0, x)',       year: '2010~' },
    { name: 'LeakyReLU', fn: leakyRelu, color: '#f59e0b', formula: 'max(0.1x, x)', year: '2013' },
    { name: 'ELU',     fn: elu,     color: '#06b6d4', formula: 'x>0?x:eˣ−1',       year: '2015' },
    { name: 'GELU',    fn: gelu,    color: '#10b981', formula: 'x·Φ(x)',          year: 'Transformer' },
    { name: 'Swish',   fn: swish,   color: '#ec4899', formula: 'x·σ(x)',          year: 'SiLU' },
    { name: 'Mish',    fn: mish,    color: '#14b8a6', formula: 'x·tanh(sp(x))',   year: '2019' },
  ];

  const miniW = 140, miniH = 85, padX = 20, padY = 60, gapX = 16, gapY = 100;
  const cols = 4;

  const miniPlotX = (x: number, ox: number) => ox + 8 + ((x - xMin) / (xMax - xMin)) * (miniW - 16);
  const miniPlotY = (y: number, oy: number) => oy + miniH - 8 - ((y + 1.5) / 3.5) * (miniH - 16);

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 420" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">활성화 함수 도감 — 8가지</text>

        {fns.map((fn, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const ox = padX + col * (miniW + gapX);
          const oy = padY + row * (miniH + gapY);

          const path = xs
            .map((x, j) => `${j === 0 ? 'M' : 'L'} ${miniPlotX(x, ox).toFixed(1)} ${miniPlotY(fn.fn(x), oy).toFixed(1)}`)
            .join(' ');

          return (
            <g key={fn.name}>
              {/* 배경 박스 */}
              <rect x={ox} y={oy} width={miniW} height={miniH} rx={6}
                fill={fn.color} fillOpacity={0.05} stroke={fn.color} strokeWidth={1.2} />
              {/* 축 */}
              <line x1={ox + 8} y1={miniPlotY(0, oy)} x2={ox + miniW - 8} y2={miniPlotY(0, oy)}
                stroke="var(--border)" strokeWidth={0.6} />
              <line x1={miniPlotX(0, ox)} y1={oy + 8} x2={miniPlotX(0, ox)} y2={oy + miniH - 8}
                stroke="var(--border)" strokeWidth={0.6} />
              {/* 곡선 */}
              <path d={path} fill="none" stroke={fn.color} strokeWidth={2} />

              {/* 라벨 */}
              <text x={ox + miniW / 2} y={oy + miniH + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={fn.color}>
                {fn.name}
              </text>
              <text x={ox + miniW / 2} y={oy + miniH + 32} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {fn.formula}
              </text>
              <text x={ox + miniW / 2} y={oy + miniH + 44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" opacity={0.8}>
                {fn.year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
