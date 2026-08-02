/**
 * Naive matMul — 한 thread = 한 C[i][j] · A row 전체 + B col 전체 글로벌 로드.
 * 중복 로드의 시각화 (같은 A row 가 K thread 에 의해 중복 읽힘).
 */
export default function NaiveMatMulViz() {
  const W = 720;
  const H = 360;
  const cell = 18;

  const aX = 60;
  const aY = 60;
  const bX = 280;
  const bY = 60;
  const cX = 500;
  const cY = 60;

  const targetRow = 2;
  const targetCol = 3;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Naive matMul — 한 thread 가 A row + B col 을 글로벌 메모리에서 직접 읽음</text>

        {/* A — row 강조 */}
        <text x={aX + cell * 4} y={aY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">A (글로벌)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isRow = r === targetRow;
            return (
              <rect key={`a-${r}-${c}`} x={aX + c * cell} y={aY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isRow ? '#3b82f6' : '#94a3b8'}
                fillOpacity={isRow ? 0.55 : 0.08}
                stroke={isRow ? '#3b82f6' : '#94a3b8'} strokeWidth={isRow ? 1 : 0.3} />
            );
          })
        )}
        <text x={aX - 8} y={aY + targetRow * cell + cell / 2 + 3} textAnchor="end" fontSize={9} fontWeight={700} fill="#3b82f6">row {targetRow}</text>

        {/* B — col 강조 */}
        <text x={bX + cell * 4} y={bY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">B (글로벌)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isCol = c === targetCol;
            return (
              <rect key={`b-${r}-${c}`} x={bX + c * cell} y={bY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isCol ? '#10b981' : '#94a3b8'}
                fillOpacity={isCol ? 0.55 : 0.08}
                stroke={isCol ? '#10b981' : '#94a3b8'} strokeWidth={isCol ? 1 : 0.3} />
            );
          })
        )}
        <text x={bX + targetCol * cell + cell / 2} y={bY + 11} textAnchor="middle" fontSize={8} fontWeight={700} fill="white">col {targetCol}</text>

        {/* C — 한 셀 강조 */}
        <text x={cX + cell * 4} y={cY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">C (출력)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isTarget = r === targetRow && c === targetCol;
            return (
              <rect key={`c-${r}-${c}`} x={cX + c * cell} y={cY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isTarget ? '#f59e0b' : '#94a3b8'}
                fillOpacity={isTarget ? 0.7 : 0.08}
                stroke={isTarget ? '#f59e0b' : '#94a3b8'} strokeWidth={isTarget ? 1.4 : 0.3} />
            );
          })
        )}

        {/* thread label */}
        <g>
          <rect x={cX + targetCol * cell - 50} y={cY + targetRow * cell + 28} width={120} height={20} rx={3}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={0.6} />
          <text x={cX + targetCol * cell + 10} y={cY + targetRow * cell + 42} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">thread (2,3)</text>
        </g>

        {/* 중복 로드 */}
        <g>
          <rect x={20} y={230} width={680} height={120} rx={8}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.2} />
          <text x={W / 2} y={250} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">⚠ 문제 — A row 와 B col 중복 글로벌 로드</text>
          <text x={W / 2} y={270} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">C 한 row 의 K thread 가 모두 같은 A row 를 글로벌 메모리에서 따로 읽음 → A 한 원소 K 번 로드</text>
          <text x={W / 2} y={285} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">B 한 원소도 M 번 로드. 전체 = 2MKN 글로벌 로드 (M=K=N=1024 → 2 × 10^9 회)</text>

          <text x={W / 2} y={310} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">결과 — 글로벌 메모리 대역폭 (900 GB/s) 이 연산 (30 TFLOPS) 보다 먼저 포화</text>
          <text x={W / 2} y={328} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">해결 — 타일링 + __shared__ memory 로 글로벌 로드 TILE_SIZE 배 감소</text>
        </g>
      </svg>
    </div>
  );
}
