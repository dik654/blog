/** 이 글의 시간표 Viz가 함께 쓰는 Gantt 그림입니다. 칸 하나가 1 ms이고, now까지 시작한 구간만 보여 줍니다. */
export interface LaneSegment {
  from: number;
  to: number;
  kind: "run" | "wait" | "sleep" | "over" | "span";
  label: string;
  showAt?: number;
}

export interface Lane {
  name: string;
  segments: readonly LaneSegment[];
}

const LABEL_X = 60;
const RIGHT_X = 372;
const TOP = 24;
const ROW = 34;
const BAR = 26;

const FILL: Record<LaneSegment["kind"], string> = { run: "#2563eb", wait: "none", sleep: "none", over: "#dc2626", span: "#94a3b8" };
const TEXT: Record<LaneSegment["kind"], string> = { run: "#ffffff", wait: "#64748b", sleep: "#64748b", over: "#ffffff", span: "#0f172a" };

export default function TaskLanes({ lanes, maxT, now, deadlineLane, ariaLabel }: { lanes: readonly Lane[]; maxT: number; now: number; deadlineLane: number; ariaLabel: string }) {
  const unit = (RIGHT_X - LABEL_X) / maxT;
  const xOf = (t: number) => LABEL_X + t * unit;
  const bottom = TOP + lanes.length * ROW;
  return (
    <svg viewBox={`0 0 380 ${bottom + 22}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={ariaLabel}>
      {Array.from({ length: maxT + 1 }, (_, t) => (
        <g key={t}>
          <line x1={xOf(t)} x2={xOf(t)} y1={TOP - 4} y2={bottom} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
          <text x={xOf(t)} y={bottom + 15} textAnchor="middle" fontSize={12} fill="#64748b">{t}</text>
        </g>
      ))}
      {lanes.map((lane, row) => {
        const y = TOP + row * ROW;
        return (
          <g key={lane.name}>
            <text x={LABEL_X - 6} y={y + BAR / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">{lane.name}</text>
            {lane.segments.filter((seg) => seg.from <= now && (seg.showAt === undefined || seg.showAt <= now)).map((seg) => {
              const current = seg.from === now || seg.showAt === now;
              const outlined = seg.kind === "wait" || seg.kind === "sleep";
              return (
                <g key={`${seg.from}-${seg.label}`} opacity={current ? 1 : 0.6}>
                  <rect x={xOf(seg.from) + 1} y={y} width={(seg.to - seg.from) * unit - 2} height={BAR} rx={3} fill={FILL[seg.kind]} stroke={outlined ? "#64748b" : "none"} strokeWidth={1} strokeDasharray={seg.kind === "sleep" ? "3 2" : undefined} />
                  <text x={xOf((seg.from + seg.to) / 2)} y={y + BAR / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT[seg.kind]}>{seg.label}</text>
                </g>
              );
            })}
          </g>
        );
      })}
      <line x1={xOf(4)} x2={xOf(4)} y1={TOP + deadlineLane * ROW - 6} y2={TOP + deadlineLane * ROW + BAR + 4} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
      <text x={xOf(4)} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">센서 마감 4 ms</text>
      <line x1={xOf(4)} x2={xOf(4)} y1={16} y2={TOP + deadlineLane * ROW - 6} stroke="#dc2626" strokeWidth={1} strokeDasharray="1 3" />
    </svg>
  );
}
