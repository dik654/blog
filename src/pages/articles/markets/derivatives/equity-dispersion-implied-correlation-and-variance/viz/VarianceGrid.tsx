/**
 * 두 종목 지수 분산을 2×2 칸으로 펼친 그림. 칸 (i, j) = 비중i × 비중j × 변동성i × 변동성j × 상관.
 * 대각선 두 칸은 각 종목 자신의 몫, 엇갈린 두 칸은 함께 움직임의 몫(교차항의 절반씩)입니다.
 * 칸을 채운 높이는 0.01을 가득으로 둔 같은 축입니다. 값을 모르는 칸(null)은 채우지 않고 점선으로 둡니다.
 */
export function VarianceGrid({
  diag,
  cross,
  crossLabel,
  dimDiag = false,
  diagLabel,
}: {
  diag: number | null;
  cross: number | null;
  crossLabel: string;
  dimDiag?: boolean;
  diagLabel: string;
}) {
  const full = 0.01;
  const cell = (key: string, value: number | null, label: string, kind: "diag" | "cross", dim: boolean) => {
    const known = value !== null;
    const fill = known ? Math.min(1, value / full) * 100 : 0;
    const color = kind === "diag" ? "#64748b" : "#2563eb";
    return (
      <div
        key={key}
        className={`relative h-20 min-w-0 overflow-hidden rounded-md border ${known ? "border-border" : "border-dashed border-muted-foreground/60"}`}
        style={{ opacity: dim ? 0.35 : 1 }}
      >
        <div className="absolute inset-x-0 bottom-0 transition-[height] duration-300 motion-reduce:transition-none" style={{ height: `${fill}%`, backgroundColor: color, opacity: 0.22 }} />
        <div className="relative flex h-full flex-col items-center justify-center px-1 text-center">
          <span className="font-mono text-sm font-bold">{known ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "?"}</span>
          <span className="text-[11px] leading-4 text-muted-foreground">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-2">
      <span />
      <span className="text-center text-xs font-semibold text-muted-foreground">종목 A</span>
      <span className="text-center text-xs font-semibold text-muted-foreground">종목 B</span>
      <span className="self-center text-xs font-semibold text-muted-foreground">A</span>
      {cell("aa", diag, diagLabel, "diag", dimDiag)}
      {cell("ab", cross, crossLabel, "cross", false)}
      <span className="self-center text-xs font-semibold text-muted-foreground">B</span>
      {cell("ba", cross, crossLabel, "cross", false)}
      {cell("bb", diag, diagLabel, "diag", dimDiag)}
    </div>
  );
}

export interface TotalSegment {
  key: string;
  label: string;
  value: number;
  /** null이면 크기만 알고 내용은 아직 나누지 않은 칸(점선). */
  color: string | null;
}

/** 분산 합계를 0~0.04 축 위의 쌓인 막대로 보여 줍니다. */
export function VarianceTotalBar({ segments }: { segments: readonly TotalSegment[] }) {
  const axis = 0.04;
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
        <span>0</span>
        <span>지수 분산 축</span>
        <span>0.04</span>
      </div>
      <div className="flex h-8 w-full overflow-hidden rounded-md border border-border bg-muted/30">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className={`flex h-full items-center justify-center whitespace-nowrap px-0.5 text-[11px] font-semibold ${segment.color ? "text-white" : "border-x border-dashed border-muted-foreground text-foreground"}`}
            style={{ width: `${(segment.value / axis) * 100}%`, backgroundColor: segment.color ?? "transparent" }}
          >
            {segment.label}
          </div>
        ))}
      </div>
    </div>
  );
}
