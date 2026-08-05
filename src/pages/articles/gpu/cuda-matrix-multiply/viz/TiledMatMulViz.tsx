/**
 * 타일링 행렬 곱셈 시각화 — A · B = C 의 타일 단위 진행.
 * 글로벌 메모리 → 공유 메모리 → 부분 내적 → 누적.
 */
export default function TiledMatMulViz() {
  const W = 720;
  const H = 420;
  const cell = 14;
  const tile = 4;

  // C tile 위치 (예: row=2, col=2)
  const cRow = 2;
  const cCol = 2;

  // 행렬 좌표
  const aX = 60;
  const aY = 70;
  const bX = 280;
  const bY = 70;
  const cX = 500;
  const cY = 70;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">타일링 행렬 곱셈 — A · B = C 의 TILE_SIZE × TILE_SIZE 단위 진행</text>

        {/* Matrix A */}
        <text x={aX + (cell * 8) / 2} y={aY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">A (M × N)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isHighlight = r >= cRow * tile && r < (cRow + 1) * tile;
            const isCurrentTile = isHighlight && c >= 0 && c < tile;
            return (
              <rect key={`a-${r}-${c}`} x={aX + c * cell} y={aY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isCurrentTile ? '#3b82f6' : isHighlight ? '#3b82f6' : '#94a3b8'}
                fillOpacity={isCurrentTile ? 0.6 : isHighlight ? 0.18 : 0.08}
                stroke={isHighlight ? '#3b82f6' : '#94a3b8'} strokeWidth={isHighlight ? 0.6 : 0.3} />
            );
          })
        )}
        {/* tile 강조 박스 */}
        <rect x={aX} y={aY + cRow * tile * cell} width={tile * cell} height={tile * cell}
          fill="none" stroke="#3b82f6" strokeWidth={2} />

        {/* Matrix B */}
        <text x={bX + (cell * 8) / 2} y={bY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">B (N × K)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isHighlight = c >= cCol * tile && c < (cCol + 1) * tile;
            const isCurrentTile = isHighlight && r >= 0 && r < tile;
            return (
              <rect key={`b-${r}-${c}`} x={bX + c * cell} y={bY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isCurrentTile ? '#10b981' : isHighlight ? '#10b981' : '#94a3b8'}
                fillOpacity={isCurrentTile ? 0.6 : isHighlight ? 0.18 : 0.08}
                stroke={isHighlight ? '#10b981' : '#94a3b8'} strokeWidth={isHighlight ? 0.6 : 0.3} />
            );
          })
        )}
        <rect x={bX + cCol * tile * cell} y={bY} width={tile * cell} height={tile * cell}
          fill="none" stroke="#10b981" strokeWidth={2} />

        {/* Matrix C */}
        <text x={cX + (cell * 8) / 2} y={cY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">C = A · B (M × K)</text>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const isCTile = r >= cRow * tile && r < (cRow + 1) * tile && c >= cCol * tile && c < (cCol + 1) * tile;
            return (
              <rect key={`c-${r}-${c}`} x={cX + c * cell} y={cY + r * cell}
                width={cell - 1} height={cell - 1} rx={1}
                fill={isCTile ? '#f59e0b' : '#94a3b8'}
                fillOpacity={isCTile ? 0.55 : 0.08}
                stroke={isCTile ? '#f59e0b' : '#94a3b8'} strokeWidth={isCTile ? 0.6 : 0.3} />
            );
          })
        )}
        <rect x={cX + cCol * tile * cell} y={cY + cRow * tile * cell} width={tile * cell} height={tile * cell}
          fill="none" stroke="#f59e0b" strokeWidth={2} />

        {/* 화살표: A tile → C tile, B tile → C tile */}
        <line x1={aX + tile * cell} y1={aY + cRow * tile * cell + (tile * cell) / 2}
          x2={cX + cCol * tile * cell} y2={cY + cRow * tile * cell + (tile * cell) / 2}
          stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5} />
        <line x1={bX + cCol * tile * cell + (tile * cell) / 2} y1={bY + tile * cell}
          x2={cX + cCol * tile * cell + (tile * cell) / 2} y2={cY + cRow * tile * cell}
          stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5} />

        {/* 공유 메모리 단계 */}
        <g>
          <rect x={20} y={230} width={680} height={170} rx={8}
            fill="#8b5cf6" fillOpacity={0.05} stroke="#8b5cf6" strokeWidth={1.2} />
          <text x={W / 2} y={250} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">한 C 타일 (4×4) 계산 절차 — 블록 내 16 thread 협력</text>

          {/* Phase 1 */}
          <rect x={40} y={265} width={200} height={120} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1} />
          <text x={140} y={283} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Phase 1 — Load</text>
          <text x={140} y={300} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">A tile + B tile</text>
          <text x={140} y={314} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ __shared__ memory</text>
          <text x={140} y={335} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">__syncthreads()</text>
          <text x={140} y={355} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모든 thread 로드 완료</text>
          <text x={140} y={372} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">DRAM 200ns 한 번</text>

          {/* arrow */}
          <line x1={250} y1={325} x2={290} y2={325} stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="290,325 284,322 284,328" fill="#94a3b8" />

          {/* Phase 2 */}
          <rect x={300} y={265} width={200} height={120} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1} />
          <text x={400} y={283} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Phase 2 — Compute</text>
          <text x={400} y={300} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">for i in 0..TILE_SIZE</text>
          <text x={400} y={314} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">  sum += tA[y][i] * tB[i][x]</text>
          <text x={400} y={335} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">__syncthreads()</text>
          <text x={400} y={355} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">계산 완료 후 다음 타일</text>
          <text x={400} y={372} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#f59e0b">SRAM 5ns × TILE_SIZE</text>

          {/* arrow */}
          <line x1={510} y1={325} x2={550} y2={325} stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="550,325 544,322 544,328" fill="#94a3b8" />

          {/* loop back */}
          <rect x={560} y={265} width={140} height={120} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={630} y={283} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">다음 K-방향 타일</text>
          <text x={630} y={300} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">A 의 다음 col tile</text>
          <text x={630} y={314} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">B 의 다음 row tile</text>
          <text x={630} y={335} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">N / TILE_SIZE 회 반복</text>
          <text x={630} y={357} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">완료 시 C[r][c] 결정</text>
        </g>

        {/* loop back arrow */}
        <path d={`M 630 385 Q 630 405, 140 405 Q 140 405, 140 385`}
          stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" fill="none" />
        <polygon points="140,385 137,393 143,393" fill="#10b981" />
      </svg>
    </div>
  );
}
