export default function ReLUTruthTableViz() {
  const rows = [
    { x1: 0, x2: 0, sum: 0,   h1: 0,   h2: 0,   y: 0,   xor: 0, correct: true },
    { x1: 0, x2: 1, sum: 1,   h1: 0.5, h2: 0,   y: 0.5, xor: 1, correct: true },
    { x1: 1, x2: 0, sum: 1,   h1: 0.5, h2: 0,   y: 0.5, xor: 1, correct: true },
    { x1: 1, x2: 1, sum: 2,   h1: 1.5, h2: 0.5, y: 0.5, xor: 0, correct: false },
  ];

  const colX = [60, 115, 185, 275, 375, 465, 555];
  const headers = ['x₁', 'x₂', 'x₁+x₂', 'h₁=ReLU(·−0.5)', 'h₂=ReLU(·−1.5)', 'y=h₁−2h₂', 'XOR 정답'];
  const rowH = 42;
  const headerY = 70;
  const firstRowY = 100;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 320" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">ReLU 2뉴런으로 XOR 구성 — 계산 추적</text>

        {/* 수식 */}
        <text x={320} y={48} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="var(--muted-foreground)">
          h₁ = ReLU(x₁+x₂ − 0.5),  h₂ = ReLU(x₁+x₂ − 1.5),  y = h₁ − 2·h₂
        </text>

        {/* 테이블 헤더 */}
        {headers.map((h, i) => (
          <text key={i} x={colX[i]} y={headerY} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">{h}</text>
        ))}
        <line x1={20} y1={headerY + 8} x2={620} y2={headerY + 8} stroke="var(--border)" strokeWidth={1.2} />

        {/* 행들 */}
        {rows.map((r, i) => {
          const y = firstRowY + i * rowH;
          const rowColor = r.correct ? '#10b981' : '#f59e0b';
          return (
            <g key={i}>
              {/* 교대 행 배경 */}
              {i % 2 === 0 && (
                <rect x={20} y={y - 18} width={600} height={rowH} fill="var(--muted)" opacity={0.15} />
              )}

              <text x={colX[0]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="var(--foreground)">{r.x1}</text>
              <text x={colX[1]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="var(--foreground)">{r.x2}</text>
              <text x={colX[2]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="var(--muted-foreground)">{r.sum}</text>

              {/* h1 */}
              <text x={colX[3]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="#3b82f6" fontWeight={600}>
                {r.h1}
              </text>
              <text x={colX[3]} y={y + 14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ={r.sum}−0.5→{r.h1 === 0 ? 'clip' : 'ok'}
              </text>

              {/* h2 */}
              <text x={colX[4]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fill="#8b5cf6" fontWeight={600}>
                {r.h2}
              </text>
              <text x={colX[4]} y={y + 14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ={r.sum}−1.5→{r.h2 === 0 ? 'clip' : 'ok'}
              </text>

              {/* y 결과 */}
              <rect x={colX[5] - 32} y={y - 15} width={64} height={22} rx={4}
                fill={rowColor} fillOpacity={0.15} stroke={rowColor} strokeWidth={1.2} />
              <text x={colX[5]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={700} fill={rowColor}>
                {r.y}
              </text>

              {/* XOR 정답 */}
              <text x={colX[6]} y={y} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
                {r.xor}
              </text>
            </g>
          );
        })}

        {/* 하단 인사이트 */}
        <line x1={20} y1={278} x2={620} y2={278} stroke="var(--border)" strokeWidth={1.2} />
        <text x={320} y={298} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          (1,1)에서 y=0.5 (XOR 정답 0과 불일치)
        </text>
        <text x={320} y={314} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
          y를 그대로 쓰지 않고 임계값 0.25 기준 분류하면 XOR 구현 — 실제 학습에선 출력층 가중치/편향으로 자동 조정
        </text>
      </svg>
    </div>
  );
}
