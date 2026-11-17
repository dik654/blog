/**
 * 한 축 좌표 0~8을 칸으로 놓고, 맨 위 unit 하나에서 아래층으로 연결선을 거꾸로 따라갑니다.
 * rows[0]은 원본 입력, rows[l]은 l번째 layer이며 d는 그 layer의 dilation입니다(k=3, stride 1).
 * 아래층 연결 좌표 = 위층 좌표 p에 대해 p−d, p, p+d. 원본까지 내려간 좌표 집합이 읽는 칸입니다.
 */
type Row = { label: string; d: number };

const CELLS = 9;
const CW = 30;
const GAP = 4;
const CH = 24;
const X0 = 60;
const PITCH = 54;
const TOP = 8;
const W = 372;

const cx = (i: number) => X0 + i * (CW + GAP) + CW / 2;

const expand = (set: readonly number[], d: number) =>
  [...new Set(set.flatMap((p) => [p - d, p, p + d]))].filter((p) => p >= 0 && p < CELLS).sort((a, b) => a - b);

export default function ReceptiveRows({
  rows,
  topLayer,
  topPos,
  ariaLabel,
}: {
  rows: readonly Row[];
  topLayer: number;
  topPos: number;
  ariaLabel: string;
}) {
  const rowY = (layer: number) => TOP + (rows.length - 1 - layer) * PITCH;
  const inputY = rowY(0);
  const height = inputY + CH + 44;

  // sets[layer] = 맨 위 unit과 연결된 그 layer의 좌표
  const chain = Array.from({ length: topLayer }, (_, k) => topLayer - k).reduce<number[][]>(
    (acc, layer) => [expand(acc[0], rows[layer].d), ...acc],
    [[topPos]],
  );
  const setAt = (layer: number) => (layer <= topLayer ? chain[layer] : []);
  const read = setAt(0);
  const lo = read[0];
  const hi = read[read.length - 1];
  const span = hi - lo + 1;

  const lines = Array.from({ length: topLayer }, (_, k) => topLayer - k).flatMap((layer) =>
    setAt(layer).flatMap((p) =>
      [p - rows[layer].d, p, p + rows[layer].d]
        .filter((c) => c >= 0 && c < CELLS)
        .map((c) => ({ key: `${layer}-${p}-${c}`, x1: cx(p), y1: rowY(layer) + CH, x2: cx(c), y2: rowY(layer - 1) })),
    ),
  );

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={ariaLabel}>
      {lines.map((line) => (
        <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#3b82f6" strokeWidth={1} opacity={0.55} />
      ))}
      {rows.map((row, layer) => {
        const used = layer <= topLayer;
        const set = setAt(layer);
        const y = rowY(layer);
        return (
          <g key={row.label} opacity={used ? 1 : 0.35}>
            <text x={4} y={y + 11} fontSize={14} fontWeight={700} fill="#64748b">
              {row.label}
            </text>
            {layer > 0 && (
              <text x={4} y={y + 26} fontSize={12} fill="#64748b">
                {used ? `d=${row.d}` : "미사용"}
              </text>
            )}
            {Array.from({ length: CELLS }, (_, i) => {
              const isTop = layer === topLayer && i === topPos;
              const inSet = set.includes(i);
              const skipped = layer === 0 && !inSet && i > lo && i < hi;
              return (
                <g key={i}>
                  <rect
                    x={cx(i) - CW / 2}
                    y={y}
                    width={CW}
                    height={CH}
                    rx={4}
                    fill={isTop ? "#3b82f6" : inSet ? "#3b82f6" : "none"}
                    fillOpacity={isTop ? 1 : inSet ? 0.2 : 0}
                    stroke={skipped ? "#dc2626" : inSet || isTop ? "#3b82f6" : "#94a3b8"}
                    strokeWidth={1}
                    strokeDasharray={skipped ? "3 3" : undefined}
                  />
                  {layer === 0 && (
                    <text
                      x={cx(i)}
                      y={y + 16}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={inSet ? 700 : 400}
                      fill={skipped ? "#dc2626" : inSet ? "#3b82f6" : "#94a3b8"}
                    >
                      {skipped ? `×${i}` : i}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      <line x1={cx(lo) - CW / 2} x2={cx(hi) + CW / 2} y1={inputY + CH + 12} y2={inputY + CH + 12} stroke="#3b82f6" strokeWidth={1} />
      <line x1={cx(lo) - CW / 2} x2={cx(lo) - CW / 2} y1={inputY + CH + 7} y2={inputY + CH + 17} stroke="#3b82f6" strokeWidth={1} />
      <line x1={cx(hi) + CW / 2} x2={cx(hi) + CW / 2} y1={inputY + CH + 7} y2={inputY + CH + 17} stroke="#3b82f6" strokeWidth={1} />
      <text x={(cx(lo) + cx(hi)) / 2} y={inputY + CH + 34} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">
        {`span ${span}칸 · 읽는 좌표 ${read.length}개`}
      </text>
    </svg>
  );
}
