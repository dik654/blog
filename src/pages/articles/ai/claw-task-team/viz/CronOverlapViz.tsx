import SceneShell from "./SceneShell";

/**
 * 본문 대응: #team-cron "이전 run이 끝나지 않았을 때의 동작을 정한다".
 * 가정: 매시 정각 schedule, 한 run은 90분, replace의 cancel·cleanup 확인 10분, 병렬 상한 2.
 * 축은 00:45~03:00(분 45~180). run 1 = 01:00~02:30, 02:00 회차가 겹친다.
 */
const W = 360;
const H = 168;
const LEFT = 58;
const RIGHT = 12;
const T0 = 45;
const T1 = 180;
const x = (minute: number) => LEFT + ((minute - T0) / (T1 - T0)) * (W - LEFT - RIGHT);
const RUN1_Y = 40;
const RUN2_Y = 92;
const BAR_H = 22;
const AXIS_Y = 136;

const fmt = (minute: number) => `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;

type Seg = { from: number; to: number; kind: "run" | "wait" | "cleanup"; text: string };

const SCENES = [
  {
    label: "겹침",
    summary: "02:00 회차 · run 1은 02:30까지",
    run1: [{ from: 60, to: 150, kind: "run", text: "run 1 (90분)" }],
    run2: [],
    mark: "?",
    note: "실행 시간(가정 90분)이 schedule 간격(1시간)보다 깁니다. 02:00 회차가 왔을 때 01:00 run은 아직 30분이 남아 있습니다. 이때 무엇을 할지 job마다 정해 둬야 합니다.",
  },
  {
    label: "skip",
    summary: "02:00 회차를 만들지 않음",
    run1: [{ from: 60, to: 150, kind: "run", text: "run 1" }],
    run2: [],
    mark: "✗ 건너뜀",
    note: "겹친 회차는 task를 만들지 않습니다. 다음 회차인 03:00에 다시 판단합니다.",
  },
  {
    label: "queue",
    summary: "기다렸다가 02:30에 시작",
    run1: [{ from: 60, to: 150, kind: "run", text: "run 1" }],
    run2: [
      { from: 120, to: 150, kind: "wait", text: "대기" },
      { from: 150, to: 180, kind: "run", text: "run 2 →" },
    ],
    mark: "",
    note: "02:00 회차는 task로 만들어 줄을 세우고, run 1이 끝난 02:30에 시작합니다.",
  },
  {
    label: "replace",
    summary: "정리 확인 뒤에만 시작",
    run1: [
      { from: 60, to: 120, kind: "run", text: "run 1" },
      { from: 120, to: 130, kind: "cleanup", text: "" },
    ],
    run2: [{ from: 130, to: 180, kind: "run", text: "run 2 →" }],
    mark: "",
    note: "02:00에 run 1의 cancellation을 요청하고, cancellation과 cleanup이 확인된 뒤(가정 02:10)에야 run 2를 시작합니다. 정리 확인 전에 새 run을 시작하지 않습니다.",
  },
  {
    label: "제한된 병렬",
    summary: "상한 2개(가정)까지 동시 실행",
    run1: [{ from: 60, to: 150, kind: "run", text: "run 1" }],
    run2: [{ from: 120, to: 180, kind: "run", text: "run 2 →" }],
    mark: "",
    note: "정해 둔 상한 안에서는 02:00 회차도 바로 시작해 두 run이 함께 돕니다. 상한 2개는 그림을 위한 가정입니다.",
  },
] as const satisfies readonly { label: string; summary: string; run1: readonly Seg[]; run2: readonly Seg[]; mark: string; note: string }[];

function Bar({ seg, y }: { seg: Seg; y: number }) {
  const x1 = x(seg.from);
  const width = x(seg.to) - x1;
  const fill = seg.kind === "run" ? "#2563eb" : "none";
  const stroke = seg.kind === "run" ? "#2563eb" : seg.kind === "wait" ? "#64748b" : "#d97706";
  return (
    <g>
      <rect x={x1} y={y} width={width} height={BAR_H} rx={3} fill={fill} fillOpacity={0.85} stroke={stroke} strokeWidth={1} strokeDasharray={seg.kind === "run" ? undefined : "3 3"} />
      {seg.text && (
        <text x={x1 + width / 2} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill={seg.kind === "run" ? "#ffffff" : "#64748b"}>
          {seg.text}
        </text>
      )}
    </g>
  );
}

export default function CronOverlapViz() {
  return (
    <SceneShell
      eyebrow="overlap 정책"
      title="이전 run이 남아 있을 때 다음 회차를 어떻게 다루나"
      description="가로축은 시각입니다. 매시 정각 schedule에 한 run이 90분 걸린다고 가정했고, 아래 줄은 02:00 회차가 만드는 run 2입니다."
      ariaLabel="실행 시간이 schedule 간격보다 긴 job의 skip, queue, replace, 제한된 병렬 정책 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const run1: readonly Seg[] = scene.run1;
        const run2: readonly Seg[] = scene.run2;
        const cleanup = run1.find((seg) => seg.kind === "cleanup");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={RUN1_Y + BAR_H / 2 + 4} fontSize={12} fill="#64748b">01:00 회차</text>
            <text x={4} y={RUN2_Y + BAR_H / 2 + 4} fontSize={12} fill="#64748b">02:00 회차</text>
            {[60, 120].map((minute) => (
              <line key={minute} x1={x(minute)} x2={x(minute)} y1={20} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
            ))}
            {run1.map((seg) => <Bar key={`${seg.kind}-${seg.from}`} seg={seg} y={RUN1_Y} />)}
            {run2.map((seg) => <Bar key={`${seg.kind}-${seg.from}`} seg={seg} y={RUN2_Y} />)}
            {cleanup && (
              <text x={x(cleanup.from)} y={RUN1_Y - 6} fontSize={11} fill="#b45309">cancel·cleanup 확인</text>
            )}
            {scene.mark && (
              <text x={x(120) + 6} y={RUN2_Y + BAR_H / 2 + 4} fontSize={12} fontWeight={700} fill={scene.mark === "?" ? "#64748b" : "#dc2626"}>
                {scene.mark}
              </text>
            )}
            <line x1={LEFT} x2={W - RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[60, 120, 150, 180].map((minute) => (
              <text key={minute} x={x(minute)} y={AXIS_Y + 16} textAnchor={minute === 180 ? "end" : "middle"} fontSize={11} fill="#64748b">
                {fmt(minute)}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
