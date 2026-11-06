const TONES = {
  base: "#64748b",
  secret: "#d97706",
  public: "#2563eb",
  ok: "#16a34a",
  bad: "#dc2626",
} as const;


/** 세로 칸으로 그리는 2차원 벡터. */
export function ColumnVector({ x, y, values, name, tone = "base" }: { x: number; y: number; values: readonly number[]; name: string; tone?: keyof typeof TONES }) {
  const color = TONES[tone];
  return (
    <g>
      <text x={x + 15} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{name}</text>
      {values.map((value, i) => (
        <g key={i}>
          <rect x={x} y={y + i * 26} width={30} height={26} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} />
          <text x={x + 15} y={y + i * 26 + 18} textAnchor="middle" fontSize={13} fontFamily="monospace" className="fill-foreground">{value}</text>
        </g>
      ))}
    </g>
  );
}

/** 공개 표 A. 두 행 [2,3]·[4,1]을 칸으로 그립니다. */
export function PublicTable({ x, y }: { x: number; y: number }) {
  const rows = [[2, 3], [4, 1]];
  return (
    <g>
      <text x={x + 28} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={TONES.public}>A</text>
      {rows.map((row, r) =>
        row.map((value, c) => (
          <g key={`${r}-${c}`}>
            <rect x={x + c * 28} y={y + r * 26} width={28} height={26} fill={TONES.public} fillOpacity={0.1} stroke={TONES.public} strokeWidth={1} />
            <text x={x + c * 28 + 14} y={y + r * 26 + 18} textAnchor="middle" fontSize={13} fontFamily="monospace" className="fill-foreground">{value}</text>
          </g>
        )),
      )}
    </g>
  );
}

/** 이름과 값이 위아래로 있는 값 상자. */
export function ValueBox({ x, y, w, name, value, tone = "base", h = 44 }: { x: number; y: number; w: number; name: string; value: string; tone?: keyof typeof TONES; h?: number }) {
  const color = TONES[tone];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={11} fill={color}>{name}</text>
      <text x={x + w / 2} y={y + 35} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="monospace" className="fill-foreground">{value}</text>
    </g>
  );
}

/** 벡터나 값 사이의 연산 기호. */
export function Op({ x, y, children }: { x: number; y: number; children: string }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={15} fontWeight={700} fill={TONES.base}>{children}</text>;
}
