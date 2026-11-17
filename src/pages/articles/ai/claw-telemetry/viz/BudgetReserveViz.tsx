import TelemetrySceneShell from "./TelemetrySceneShell";

/**
 * 본문 대응: #usage "budget warning과 hard limit을 분리한다".
 * 한도 100, 이미 쓴 80, 동시 요청 두 개, 요청당 예상 최대 20, 실제 15는 모두 설명용 가정입니다.
 * 예약 없음: 80 + 15 + 15 = 110 > 100. 예약: 80 + 20 = 100 → 둘째는 120이라 시작 불가 → 정산 후 95.
 */
const LIMIT = 100;
const SPENT = 80;
const RESERVE = 20;
const ACTUAL = 15;
const MAX = 120;

type Segment = { from: number; to: number; kind: "spent" | "actual" | "reserved" | "over" };
type Req = { state: string; tone: "run" | "blocked" | "done" | "idle" };

const SCENES = [
  {
    label: "예약 없이 동시에 시작",
    summary: "둘 다 80 < 100을 보고 시작",
    segments: [{ from: 0, to: SPENT, kind: "spent" }] as Segment[],
    reqs: [{ state: "80 확인 → 시작", tone: "run" }, { state: "80 확인 → 시작", tone: "run" }] as Req[],
    total: "현재 80",
    note: "두 요청이 거의 동시에 현재 추정 비용 80을 읽습니다. 둘 다 한도 100보다 작다고 판단해 시작합니다. 각자 상대가 곧 쓸 비용을 보지 못합니다.",
  },
  {
    label: "둘 다 끝나면",
    summary: "80 + 15 + 15 = 110 · 한도 초과",
    segments: [
      { from: 0, to: SPENT, kind: "spent" },
      { from: SPENT, to: SPENT + ACTUAL, kind: "actual" },
      { from: SPENT + ACTUAL, to: LIMIT, kind: "actual" },
      { from: LIMIT, to: SPENT + 2 * ACTUAL, kind: "over" },
    ] as Segment[],
    reqs: [{ state: "완료 · 15", tone: "done" }, { state: "완료 · 15", tone: "done" }] as Req[],
    total: "합계 110",
    note: "각 요청이 15씩 쓰고 끝나면 합계는 110입니다. 시작할 때의 검사가 모두 통과했는데도 hard limit을 10 넘었습니다. 경고라면 넘은 뒤 보여 줘도 되지만 차단은 이렇게 하면 지켜지지 않습니다.",
  },
  {
    label: "시작할 때 최대치를 예약",
    summary: "80 + 20 = 100 → 둘째는 120이라 시작 못 함",
    segments: [
      { from: 0, to: SPENT, kind: "spent" },
      { from: SPENT, to: SPENT + RESERVE, kind: "reserved" },
    ] as Segment[],
    reqs: [{ state: "예약 20 → 시작", tone: "run" }, { state: "80 + 20 + 20 = 120 → 시작 못 함", tone: "blocked" }] as Req[],
    total: "사용 80 + 예약 20",
    note: "첫 요청은 예상 최대 비용 20을 먼저 잡아 둡니다. 둘째 요청은 이미 쓴 80과 첫 요청의 예약 20까지 더해 판단하므로 120이 되어 시작하지 못합니다. 거부할지 기다릴지는 정책으로 정합니다.",
  },
  {
    label: "끝나면 실제 usage로 정산",
    summary: "예약 20 해제 · 실제 15 → 95",
    segments: [
      { from: 0, to: SPENT, kind: "spent" },
      { from: SPENT, to: SPENT + ACTUAL, kind: "actual" },
    ] as Segment[],
    reqs: [{ state: "완료 · 실제 15", tone: "done" }, { state: "95 + 20 = 115 → 아직 못 함", tone: "blocked" }] as Req[],
    total: "합계 95",
    note: "첫 요청이 실제로 쓴 15만 남기고 예약 20은 풀어 합계는 95가 됩니다. timeout이나 취소로 usage를 모를 때 예약을 언제 풀지도 미리 정해야 합니다.",
  },
] as const;

const W = 360;
const H = 168;
const LEFT = 8;
const BAR_Y = 34;
const BAR_H = 26;
const sx = (value: number) => LEFT + (value / MAX) * (W - 2 * LEFT);

const SEG_STYLE: Record<Segment["kind"], { fill: string; stroke: string; dash?: string }> = {
  spent: { fill: "#cbd5e1", stroke: "#94a3b8" },
  actual: { fill: "#93c5fd", stroke: "#2563eb" },
  reserved: { fill: "#ffffff", stroke: "#d97706", dash: "3 2" },
  over: { fill: "#fecaca", stroke: "#dc2626" },
};

const REQ_COLOR: Record<Req["tone"], string> = {
  run: "#2563eb",
  blocked: "#dc2626",
  done: "#475569",
  idle: "#94a3b8",
};

export default function BudgetReserveViz() {
  return (
    <TelemetrySceneShell
      eyebrow="HARD LIMIT · 설명용 숫자"
      title="동시 요청은 시작 시점의 검사를 함께 통과해 한도를 넘깁니다"
      description="막대는 누적 추정 비용이고 세로선이 hard limit 100입니다. 회색은 이미 쓴 비용, 파랑은 새로 쓴 비용, 빨강은 한도를 넘은 몫, 주황 점선은 시작할 때 잡아 둔 예약(reserve)입니다. 한도·비용 숫자는 모두 설명용 가정입니다."
      ariaLabel="예약 없이 두 요청이 동시에 시작해 110으로 한도를 넘고, 예약하면 둘째 요청이 막혀 95로 정산되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={16} fontSize={11} fontWeight={700} fill="#334155">누적 추정 비용</text>
            <text x={W - LEFT} y={16} textAnchor="end" fontSize={11} fontWeight={700} fill="#0f172a">{scene.total}</text>
            <rect x={sx(0)} y={BAR_Y} width={sx(MAX) - sx(0)} height={BAR_H} rx={2} fill="#ffffff" stroke="#e2e8f0" strokeWidth={1} />
            {scene.segments.map((segment, index) => {
              const style = SEG_STYLE[segment.kind];
              return (
                <rect
                  key={index}
                  x={sx(segment.from) + 0.5}
                  y={BAR_Y}
                  width={Math.max(sx(segment.to) - sx(segment.from) - 1, 0)}
                  height={BAR_H}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={1}
                  strokeDasharray={style.dash}
                />
              );
            })}
            <line x1={sx(LIMIT)} x2={sx(LIMIT)} y1={BAR_Y - 8} y2={BAR_Y + BAR_H + 8} stroke="#0f172a" strokeWidth={1.25} />
            <text x={sx(LIMIT)} y={BAR_Y + BAR_H + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">한도 100</text>
            <text x={sx(SPENT)} y={BAR_Y + BAR_H + 20} textAnchor="end" fontSize={10} fill="#64748b">80</text>
            <text x={sx(0)} y={BAR_Y + BAR_H + 20} fontSize={10} fill="#94a3b8">0</text>

            {scene.reqs.map((req, index) => {
              const y = 104 + index * 30;
              return (
                <g key={index}>
                  <rect x={LEFT} y={y} width={W - 2 * LEFT} height={24} rx={4} fill="#ffffff" stroke={req.tone === "blocked" ? "#dc2626" : "#e2e8f0"} strokeWidth={1} />
                  <text x={LEFT + 8} y={y + 16} fontSize={10.5} fontWeight={700} fill="#334155">요청 {index + 1}</text>
                  <text x={W - LEFT - 8} y={y + 16} textAnchor="end" fontSize={10.5} fontWeight={700} fill={REQ_COLOR[req.tone]}>{req.state}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
