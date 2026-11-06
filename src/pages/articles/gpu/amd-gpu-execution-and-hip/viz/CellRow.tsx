/**
 * 번호가 곧 위치인 칸 한 줄입니다. 8칸마다 굵은 눈금을 두어 번호를 어림할 수 있게 합니다.
 * tone이 칸의 뜻을 정합니다. bad는 채우지 않고 빨간 점선 테두리만 두어, 색을 구별하지 못해도 사라진 칸으로 읽힙니다.
 */
export type CellTone = "off" | "soft" | "on" | "hot" | "bad" | "dim";

const TONE: Record<CellTone, string> = {
  off: "bg-transparent",
  soft: "bg-primary/25",
  on: "bg-primary/60",
  hot: "bg-amber-500",
  bad: "bg-transparent border border-dashed border-red-600",
  dim: "bg-muted-foreground/30",
};

export default function CellRow({
  count,
  tone,
  splitAt,
  height = "h-5",
}: {
  count: number;
  tone: (id: number) => CellTone;
  /** 이 번호 앞에 틈을 벌려 묶음 경계를 보입니다. */
  splitAt?: number;
  height?: string;
}) {
  const block = (from: number, to: number) => (
    <div
      className={`grid min-w-0 flex-1 border border-muted-foreground/60 ${height}`}
      style={{ gridTemplateColumns: `repeat(${to - from}, minmax(0, 1fr))`, flexGrow: to - from }}
    >
      {Array.from({ length: to - from }, (_, index) => {
        const id = from + index;
        return <span key={id} className={`${TONE[tone(id)]} ${tone(id) === "bad" || id === from ? "" : id % 8 === 0 ? "border-l border-foreground/70" : tone(id) === "off" ? "border-l border-muted-foreground/20" : "border-l border-background/70"}`} />;
      })}
    </div>
  );
  return splitAt === undefined ? (
    <div className="flex min-w-0">{block(0, count)}</div>
  ) : (
    <div className="flex min-w-0 gap-2">
      {block(0, splitAt)}
      {block(splitAt, count)}
    </div>
  );
}
