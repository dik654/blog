/**
 * 3·7절의 네 구획 A·B·C·D와 표식 P(연못)·T(나무)·R(길)을 그리는 평면도입니다.
 * 배치는 관계가 후보를 줄이는 모습을 보이려는 가정이며, 본문은 실제 배치를 정하지 않습니다.
 */
export type PlotId = "A" | "B" | "C" | "D";
export type PlotState = "open" | "out" | "chosen";

const PLOTS: readonly { id: PlotId; x: number; y: number }[] = [
  { id: "A", x: 16, y: 16 },
  { id: "B", x: 214, y: 16 },
  { id: "C", x: 16, y: 132 },
  { id: "D", x: 214, y: 132 },
];
const PLOT_W = 130;
const PLOT_H = 82;
const POND_X = 180;
const POND_Y = 57;
const POND_R = 20;

function Tree({ x, y, ghost = false }: { x: number; y: number; ghost?: boolean }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y + 6} y2={y + 18} stroke={ghost ? "#94a3b8" : "#15803d"} strokeWidth={1.25} strokeDasharray={ghost ? "2 2" : undefined} />
      <circle cx={x} cy={y} r={9} fill={ghost ? "none" : "#16a34a"} fillOpacity={ghost ? 0 : 0.55} stroke={ghost ? "#94a3b8" : "#15803d"} strokeWidth={1} strokeDasharray={ghost ? "2 2" : undefined} />
      <text x={x + 14} y={y + 4} fontSize={11} fontWeight={700} fill={ghost ? "#94a3b8" : "#15803d"}>
        {ghost ? "기록상 T" : "T"}
      </text>
    </g>
  );
}

export default function PlotMap({
  states,
  marks = {},
  treeIn,
  ghostTreeIn,
  eastLine = false,
  tag,
  ariaLabel,
}: {
  states: Readonly<Record<PlotId, PlotState>>;
  marks?: Partial<Record<PlotId, string>>;
  treeIn: "B" | "D";
  ghostTreeIn?: "B";
  eastLine?: boolean;
  tag?: string;
  ariaLabel: string;
}) {
  const treeY = treeIn === "B" ? 50 : 166;
  return (
    <svg viewBox="0 0 360 230" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={ariaLabel}>
      <rect x={8} y={104} width={344} height={22} fill="#94a3b8" fillOpacity={0.3} />
      <text x={16} y={119} fontSize={11} fontWeight={700} fill="#64748b">길 R</text>
      {PLOTS.map((plot) => {
        const state = states[plot.id];
        const stroke = state === "chosen" ? "#2563eb" : state === "out" ? "#cbd5e1" : "#64748b";
        return (
          <g key={plot.id}>
            <rect
              x={plot.x}
              y={plot.y}
              width={PLOT_W}
              height={PLOT_H}
              rx={6}
              fill={state === "chosen" ? "#2563eb" : "#94a3b8"}
              fillOpacity={state === "chosen" ? 0.14 : state === "out" ? 0.08 : 0}
              stroke={stroke}
              strokeWidth={state === "chosen" ? 1.25 : 1}
              strokeDasharray={state === "open" ? "4 3" : undefined}
            />
            <text x={plot.x + 10} y={plot.y + 22} fontSize={16} fontWeight={700} fill={state === "out" ? "#94a3b8" : state === "chosen" ? "#2563eb" : "#475569"}>
              {plot.id}
            </text>
            {marks[plot.id] ? (
              <text x={plot.x + 10} y={plot.y + 42} fontSize={12} fill="#64748b">{marks[plot.id]}</text>
            ) : null}
          </g>
        );
      })}
      <circle cx={POND_X} cy={POND_Y} r={POND_R} fill="#3b82f6" fillOpacity={0.3} stroke="#2563eb" strokeWidth={1} />
      <text x={POND_X} y={POND_Y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1d4ed8">P</text>
      <text x={POND_X} y={POND_Y + POND_R + 13} textAnchor="middle" fontSize={10} fill="#64748b">연못</text>
      {eastLine ? (
        <g>
          <line x1={POND_X + POND_R} x2={POND_X + POND_R} y1={10} y2={222} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
          <text x={POND_X + POND_R + 4} y={228} fontSize={10} fill="#2563eb">P의 동쪽 →</text>
        </g>
      ) : null}
      {ghostTreeIn ? <Tree x={280} y={50} ghost /> : null}
      <Tree x={280} y={treeY} />
      {tag ? (
        <g>
          <rect x={222} y={74} width={84} height={18} rx={4} fill="#2563eb" />
          <text x={264} y={87} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ffffff">{tag}</text>
        </g>
      ) : null}
    </svg>
  );
}
