import SceneShell from "./SceneShell";

/**
 * 본문 대응: #performance — L_critical = max(L_data, L_order)는 두 작업이 완전히 겹치는 경우의 예.
 * 후보 A: batch 10, data 120, order 2×40, execute 30 / 후보 B: batch 60, data 50, order 3×40, execute 10.
 * 완전히 겹친다고 가정하면 A = 10 + max(120, 80) + 30 = 160, order 한 단계 감소 → 10 + max(120, 40) + 30 = 160.
 * B = 60 + max(50, 120) + 10 = 190, order 한 단계 감소 → 60 + max(50, 80) + 10 = 150.
 * Queue 500ms를 B의 순차 240ms에 더하면(가정) 740 → order 한 단계 감소 700, 40/740 ≈ 5.4%.
 */
type Lane = { name: string; start: number; len: number; critical: boolean };
type Gantt = { kind: "gantt"; lanes: readonly Lane[]; total: number; formula: string };
type Totals = { kind: "totals"; before: number; after: number };

const LANE_NAMES = ["batch", "data", "order", "execute"] as const;

function gantt(batch: number, data: number, order: number, exec: number, overlap: boolean): Gantt {
  const critical = overlap ? Math.max(data, order) : data + order;
  const orderStart = overlap ? batch : batch + data;
  const execStart = batch + critical;
  const lens = [batch, data, order, exec];
  const starts = [0, batch, orderStart, execStart];
  const crit = [true, overlap ? data >= order : true, overlap ? order >= data : true, true];
  return {
    kind: "gantt",
    lanes: LANE_NAMES.map((name, i) => ({ name, start: starts[i], len: lens[i], critical: crit[i] })),
    total: batch + critical + exec,
    formula: overlap
      ? `${batch} + max(${data}, ${order}) + ${exec} = ${batch + critical + exec}ms`
      : `${batch} + ${data} + ${order} + ${exec} = ${batch + critical + exec}ms`,
  };
}

const VIEWS: readonly (Gantt | Totals)[] = [
  gantt(10, 120, 80, 30, false),
  gantt(10, 120, 80, 30, true),
  gantt(10, 120, 40, 30, true),
  gantt(60, 50, 120, 10, true),
  gantt(60, 50, 80, 10, true),
  { kind: "totals", before: 740, after: 700 },
];

const SCENES = [
  { label: "A · 순서대로", summary: "합계 240ms", note: "후보 A의 네 구간을 앞 구간이 끝난 뒤에 다음 구간이 시작한다고 보면 그대로 더해 240ms입니다." },
  { label: "A · 완전히 겹침", summary: "10 + max(120, 80) + 30 = 160", note: "Data와 order가 완전히 겹친다고 가정하면 둘 중 긴 data 120ms만 critical path(실제로 기다린 경로)에 들어갑니다. Order 80ms는 data 뒤에 숨습니다." },
  { label: "A · order 한 단계 감소", summary: "그대로 160ms", note: "Order를 두 단계에서 한 단계(40ms)로 줄여도 data 120ms가 여전히 더 길어 client가 기다리는 시간은 160ms 그대로입니다. A는 전파 쪽을 먼저 봐야 하는 이유입니다." },
  { label: "B · 완전히 겹침", summary: "60 + max(50, 120) + 10 = 190", note: "후보 B는 order 세 단계 120ms가 data 50ms보다 깁니다. 같은 가정에서 critical path에는 order가 들어가 190ms입니다." },
  { label: "B · order 한 단계 감소", summary: "190 → 150ms", note: "B에서 order를 한 단계 줄이면 80ms로 여전히 data보다 길어 critical path가 40ms 짧아집니다. 같은 조치가 A에서는 효과 0, B에서는 40ms입니다." },
  { label: "Queue 500ms", summary: "740 → 700ms, 약 5.4%", note: "B를 순서대로 잰 240ms에 queue 500ms가 붙었다고 가정하면 client는 740ms를 기다립니다. Order를 한 단계 줄여도 700ms로 40/740, 약 5.4% 줄어드는 데 그칩니다." },
] as const;

const LEFT = 64;
const RIGHT = 344;
const ROW_Y: readonly number[] = [44, 76, 108, 140];

export default function CriticalPathOverlapViz() {
  return (
    <SceneShell
      eyebrow="Critical path"
      title="겹친 구간은 긴 쪽만 기다리므로, 줄일 곳도 긴 쪽입니다"
      description="가로축이 시간(ms)이고 진한 막대가 critical path입니다. 구간 값은 본문 후보 A·B이고, data와 order가 완전히 겹친다는 것과 queue를 붙인 위치는 설명용 가정입니다."
      ariaLabel="후보 A와 B에서 data와 order가 겹칠 때 critical path와 order 단계 감소 효과, queue가 있을 때의 비율"
      scenes={SCENES}
      render={(active) => {
        const view = VIEWS[active];
        if (view.kind === "totals") {
          const max = 800;
          const sx = (ms: number) => LEFT + (ms / max) * (RIGHT - LEFT);
          const rows = [
            { label: "지금", queue: 500, rest: 240, total: view.before, y: 64 },
            { label: "order −1", queue: 500, rest: 200, total: view.after, y: 116 },
          ];
          return (
            <svg viewBox="0 0 360 200" className="mx-auto block h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={10} y={22} fontSize={11} fill="#475569">이 장면만 축 0–800ms</text>
              {rows.map((row) => (
                <g key={row.label}>
                  <text x={LEFT - 6} y={row.y + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">{row.label}</text>
                  <rect x={LEFT} y={row.y} width={sx(row.queue) - LEFT} height={22} fill="#cbd5e1" />
                  <rect x={sx(row.queue)} y={row.y} width={sx(row.queue + row.rest) - sx(row.queue)} height={22} fill="#2563eb" />
                  <text x={LEFT + 6} y={row.y + 15} fontSize={11} fill="#1e293b">queue 500</text>
                  <text x={sx(row.queue + row.rest) + 4} y={row.y + 15} fontSize={11} fontWeight={700} fill="#1e293b">{row.total}</text>
                  <text x={sx(row.queue) + 4} y={row.y + 38} fontSize={10} fill="#2563eb">나머지 {row.rest}</text>
                </g>
              ))}
              <text x={10} y={186} fontSize={12} fontWeight={700} fill="#334155">40 / 740 ≈ 5.4% 감소</text>
            </svg>
          );
        }
        const max = 250;
        const sx = (ms: number) => LEFT + (ms / max) * (RIGHT - LEFT);
        return (
          <svg viewBox="0 0 360 200" className="mx-auto block h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 50, 100, 150, 200, 250].map((tick) => (
              <g key={tick}>
                <line x1={sx(tick)} x2={sx(tick)} y1={34} y2={160} stroke="#e2e8f0" strokeWidth={1} />
                <text x={sx(tick)} y={24} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            {view.lanes.map((lane, i) => (
              <g key={lane.name}>
                <text x={LEFT - 6} y={ROW_Y[i] + 13} textAnchor="end" fontSize={11} fill="#334155">{lane.name}</text>
                <rect
                  x={sx(lane.start)}
                  y={ROW_Y[i]}
                  width={sx(lane.start + lane.len) - sx(lane.start)}
                  height={18}
                  rx={3}
                  fill={lane.critical ? "#2563eb" : "#ffffff"}
                  stroke={lane.critical ? "#2563eb" : "#64748b"}
                  strokeWidth={1}
                  strokeDasharray={lane.critical ? undefined : "4 3"}
                />
                <text
                  x={sx(lane.start + lane.len) + 4}
                  y={ROW_Y[i] + 13}
                  fontSize={10}
                  fill="#334155"
                >
                  {lane.len}
                </text>
              </g>
            ))}
            <line x1={sx(view.total)} x2={sx(view.total)} y1={34} y2={164} stroke="#dc2626" strokeWidth={1.25} />
            <text x={10} y={188} fontSize={12} fontWeight={700} fill="#334155">{view.formula}</text>
          </svg>
        );
      }}
    />
  );
}
