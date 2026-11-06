/**
 * 평균 분산을 펼친 B×B 칸. 칸 하나 = 두 자리의 편차 곱의 평균.
 * 대각선은 분산, 그 밖은 공분산(섞인 항)이다. 표시 크기는 B와 관계없이 고정한다.
 */
export default function CovCells({ size, diagonal, off, mark = false }: { size: number; diagonal: string; off: string; mark?: boolean }) {
  const area = 216;
  const pad = 22;
  const cell = area / size;
  const showText = size <= 4;
  const offLive = off !== "0";
  return (
    <div className="mx-auto w-[200px] max-w-full sm:w-[260px]">
    <svg viewBox={`0 0 ${area + pad + 4} ${area + pad + 4}`} className="block h-auto w-full" role="img" aria-label={`${size}×${size} 칸, 대각선 ${diagonal}, 나머지 ${off}`}>
      {showText &&
        Array.from({ length: size }, (_, i) => (
          <g key={i}>
            <text x={pad + cell * i + cell / 2} y={14} textAnchor="middle" fontSize={11} fill="#64748b">Z{i + 1}</text>
            <text x={10} y={pad + cell * i + cell / 2 + 4} textAnchor="middle" fontSize={11} fill="#64748b">Z{i + 1}</text>
          </g>
        ))}
      {Array.from({ length: size * size }, (_, k) => {
        const r = Math.floor(k / size);
        const c = k % size;
        const on = r === c;
        const lit = on || offLive;
        const fill = on ? "#2563eb" : off.startsWith("−") ? "#dc2626" : "#2563eb";
        return (
          <g key={k}>
            <rect x={pad + c * cell} y={pad + r * cell} width={cell} height={cell} fill={lit ? fill : "#94a3b8"} fillOpacity={lit ? (on || !off.startsWith("−") ? 0.3 : 0.18) : 0.06} stroke="#94a3b8" strokeWidth={size > 8 ? 0.4 : 1} />
            {showText && (
              <text x={pad + c * cell + cell / 2} y={pad + r * cell + cell / 2 + 5} textAnchor="middle" fontSize={size === 2 ? 18 : 14} fontWeight={lit ? 700 : 400} fill={lit ? (!on && off.startsWith("−") ? "#dc2626" : "#2563eb") : "#94a3b8"}>
                {on ? diagonal : off}
              </text>
            )}
          </g>
        );
      })}
      {mark && <rect x={pad} y={pad} width={area} height={area} fill="none" stroke="#64748b" strokeWidth={1} />}
    </svg>
    </div>
  );
}
