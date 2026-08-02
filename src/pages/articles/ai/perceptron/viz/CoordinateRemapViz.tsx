export default function CoordinateRemapViz() {
  // 원본 XOR 입력 → h-공간 좌표
  // h1 = ReLU(x1+x2-0.5), h2 = ReLU(x1+x2-1.5)
  const points = [
    { x1: 0, x2: 0, h1: 0, h2: 0, y: 0, color: '#ef4444', label: '(0,0)→0' },
    { x1: 0, x2: 1, h1: 0.5, h2: 0, y: 1, color: '#10b981', label: '(0,1)→1' },
    { x1: 1, x2: 0, h1: 0.5, h2: 0, y: 1, color: '#10b981', label: '(1,0)→1' },
    { x1: 1, x2: 1, h1: 1.5, h2: 0.5, y: 0, color: '#ef4444', label: '(1,1)→0' },
  ];

  // 좌표 스케일 (플롯 영역)
  const scaleX = (v: number, originX: number) => originX + v * 100;
  const scaleY = (v: number, originY: number) => originY - v * 70;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 300" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">은닉층 = 좌표 재배치</text>

        {/* ───── 좌: 원본 입력 공간 ───── */}
        <text x={140} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          원본 입력 공간 (x₁, x₂)
        </text>
        <text x={140} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">
          직선 하나로 분리 불가
        </text>

        {/* 축 */}
        <line x1={70} y1={220} x2={220} y2={220} stroke="var(--border)" strokeWidth={1.2} />
        <line x1={70} y1={220} x2={70} y2={90} stroke="var(--border)" strokeWidth={1.2} />
        <text x={228} y={224} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">x₁</text>
        <text x={64} y={86} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">x₂</text>
        <text x={64} y={224} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">0</text>
        <text x={64} y={152} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">1</text>
        <text x={70} y={236} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">0</text>
        <text x={170} y={236} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">1</text>

        {/* 어떤 직선을 그어도 안 됨 시도선 */}
        <line x1={70} y1={188} x2={210} y2={102} stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
        <line x1={70} y1={102} x2={210} y2={188} stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />

        {/* 점들 */}
        {points.map((p, i) => {
          const cx = scaleX(p.x1, 70);
          const cy = scaleY(p.x2, 220);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={9} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={2.5} />
              <text x={cx + 13} y={cy - 7} fontSize={11} fontWeight={600} fill={p.color}>{p.label}</text>
            </g>
          );
        })}

        {/* ───── 화살표 ───── */}
        <defs>
          <marker id="cr-arr" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <path d="M0,0 L9,5 L0,10" fill="#8b5cf6" />
          </marker>
        </defs>
        <line x1={270} y1={155} x2={360} y2={155} stroke="#8b5cf6" strokeWidth={2.5} markerEnd="url(#cr-arr)" />
        <text x={315} y={140} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">은닉층</text>
        <text x={315} y={175} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#8b5cf6">ReLU 2뉴런</text>

        {/* ───── 우: h-공간 ───── */}
        <text x={500} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          h-공간 (h₁, h₂)
        </text>
        <text x={500} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">
          직선 하나로 분리 가능 ✓
        </text>

        {/* 축 */}
        <line x1={395} y1={220} x2={585} y2={220} stroke="var(--border)" strokeWidth={1.2} />
        <line x1={395} y1={220} x2={395} y2={90} stroke="var(--border)" strokeWidth={1.2} />
        <text x={594} y={224} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">h₁</text>
        <text x={389} y={86} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">h₂</text>
        <text x={389} y={224} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">0</text>
        <text x={389} y={184} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">0.5</text>
        <text x={395} y={236} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">0</text>
        <text x={475} y={236} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">0.5</text>
        <text x={565} y={236} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">1.5</text>

        {/* 분리선: h₂ = h₁/3 − 0.1 (−h₁ + 3h₂ + 0.3 = 0) — Green 아래, Red 위 */}
        <line x1={429} y1={220} x2={585} y2={147} stroke="#10b981" strokeWidth={2.5} />
        <text x={470} y={162} fontSize={11} fontWeight={700} fill="#10b981" textAnchor="middle">결정 경계</text>

        {/* h-공간 점들. 두 양성 샘플은 같은 은닉 좌표를 공유한다. */}
        {points.map((p, i) => {
          const cx = 395 + (p.h1 / 1.5) * 170;
          const cy = 220 - (p.h2 / 0.5) * 80;

          if (i === 2) return null;

          if (i === 1) {
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={12} fill="none" stroke={p.color} strokeWidth={1.5} strokeDasharray="3 2" />
                <circle cx={cx} cy={cy} r={8} fill={p.color} fillOpacity={0.35} stroke={p.color} strokeWidth={2.5} />
                <text x={cx + 15} y={cy - 18} fontSize={11} fontWeight={600} fill={p.color}>(0,1)→1</text>
                <text x={cx + 15} y={cy - 5} fontSize={11} fontWeight={600} fill={p.color}>(1,0)→1</text>
              </g>
            );
          }

          const isRightEdge = i === points.length - 1;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={9} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={2.5} />
              <text
                x={cx + (isRightEdge ? -13 : 13)}
                y={cy - 7}
                textAnchor={isRightEdge ? 'end' : 'start'}
                fontSize={11}
                fontWeight={600}
                fill={p.color}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        <text x={320} y={282} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">
          (0,1)과 (1,0)이 같은 h-좌표로 매핑 — 원본 공간에선 불가능했던 분리가 h-공간에선 단순해짐
        </text>
      </svg>
    </div>
  );
}
