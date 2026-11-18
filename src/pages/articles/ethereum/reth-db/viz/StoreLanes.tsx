/**
 * 저장소(행) × 블록 번호(열) 칸. 칸 하나가 "이 저장소가 그 블록의 자료를 갖고 있는가"이다.
 * has = 가짐, ahead = 공개 지점보다 앞선 자료, gap = 있어야 하는데 없음, cut = 잘라 내는 중, none = 없음.
 */
export type Cell = "has" | "ahead" | "gap" | "cut" | "none";

const CELL_STYLE: Record<Cell, { fill: string; border: string; text: string; label: string }> = {
  has: { fill: "#10b98126", border: "#10b981", text: "#047857", label: "있음" },
  ahead: { fill: "#f59e0b26", border: "#f59e0b", text: "#b45309", label: "앞섬" },
  gap: { fill: "transparent", border: "#ef4444", text: "#dc2626", label: "빈칸" },
  cut: { fill: "transparent", border: "#94a3b8", text: "#64748b", label: "제거" },
  none: { fill: "transparent", border: "#cbd5e1", text: "#94a3b8", label: "—" },
};

export interface Lane {
  name: string;
  cells: readonly Cell[];
  tag?: string;
}

export function StoreLanes({
  columns,
  lanes,
  tipIndex,
  tipLabel = "공개 지점",
}: {
  columns: readonly string[];
  lanes: readonly Lane[];
  tipIndex?: number;
  tipLabel?: string;
}) {
  const template = `minmax(5.5rem,1.1fr) repeat(${columns.length}, minmax(0,1fr))`;
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-1" style={{ gridTemplateColumns: template }}>
        <span />
        {columns.map((column, index) => (
          <span key={column} className="text-center font-mono text-[11px] font-bold text-muted-foreground">
            {column}
            {tipIndex !== undefined ? (
              <span className={`block text-[9px] ${index === tipIndex ? "text-primary" : "text-transparent"}`} aria-hidden={index !== tipIndex}>
                ▼ {tipLabel}
              </span>
            ) : null}
          </span>
        ))}
        {lanes.map((lane) => (
          <LaneRow key={lane.name} lane={lane} />
        ))}
      </div>
    </div>
  );
}

function LaneRow({ lane }: { lane: Lane }) {
  return (
    <>
      <span className="flex min-w-0 flex-col justify-center pr-1">
        <span className="break-keep text-xs font-bold leading-4">{lane.name}</span>
        <span className="min-h-4 break-keep text-[10px] leading-4 text-muted-foreground">{lane.tag ?? ""}</span>
      </span>
      {lane.cells.map((cell, index) => {
        const style = CELL_STYLE[cell];
        return (
          <span
            key={index}
            className={`flex h-8 items-center justify-center rounded border text-[10px] font-bold ${cell === "gap" || cell === "cut" ? "border-dashed" : ""}`}
            style={{ backgroundColor: style.fill, borderColor: style.border, color: style.text }}
          >
            {style.label}
          </span>
        );
      })}
    </>
  );
}
