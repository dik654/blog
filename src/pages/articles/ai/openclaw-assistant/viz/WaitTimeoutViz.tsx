import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-resources "agent.wait의 기본 대기 시간 안에 결과가 없으면…".
 * 위 줄 = 실행(runtime), 아래 줄 = 기다림(agent.wait). 가로 길이는 순서만 보이는 설명용이며 실제 시간 비율이 아닙니다.
 */
const W = 360;
const H = 168;
const X0 = 70;
const X1 = 344;
const RUN_Y = 46;
const WAIT_Y = 108;
const BAR_H = 22;

type Bar = { from: number; to: number; label: string; tone: "run" | "wait" | "timeout" | "done" | "stop" };

const SCENES = [
  {
    label: "접수",
    summary: "runId 즉시 반환",
    run: [{ from: 0, to: 0.3, label: "실행 중", tone: "run" }],
    wait: [],
    note: "agent RPC는 실행이 끝날 때까지 연결을 붙잡지 않고 runId와 acceptedAt을 바로 돌려줍니다. 위 줄의 실행은 그 뒤에도 이어집니다.",
  },
  {
    label: "첫 wait 만료",
    summary: "status: timeout · 실행은 계속",
    run: [{ from: 0, to: 0.62, label: "실행 중", tone: "run" }],
    wait: [{ from: 0.08, to: 0.52, label: "대기 → timeout", tone: "timeout" }],
    note: "기본 대기 시간 안에 결과가 없으면 agent.wait는 status: timeout만 돌려줄 수 있습니다. 끝난 것은 아래 줄의 기다림뿐이고 위 줄의 실행은 멈추지 않았습니다.",
  },
  {
    label: "같은 runId로 다시",
    summary: "terminal outcome 확인",
    run: [{ from: 0, to: 0.82, label: "실행 → 종료", tone: "done" }],
    wait: [
      { from: 0.08, to: 0.52, label: "대기 → timeout", tone: "timeout" },
      { from: 0.56, to: 0.82, label: "결과", tone: "done" },
    ],
    note: "같은 runId로 다시 기다리면 실행이 끝난 뒤 terminal outcome을 받습니다. 새 실행을 접수한 것이 아니라 같은 실행을 다시 조회한 것입니다.",
  },
  {
    label: "실행이 끝나는 경우",
    summary: "예산 초과 · 명시적 취소",
    run: [{ from: 0, to: 0.46, label: "실행 종료", tone: "stop" }],
    wait: [],
    note: "Runtime의 실행 예산 초과나 명시적 취소는 위 줄의 실행 자체를 끝냅니다. 기다림만 끝나는 wait timeout과는 별도 상태입니다.",
  },
] as const satisfies readonly { label: string; summary: string; run: readonly Bar[]; wait: readonly Bar[]; note: string }[];

const FILL: Record<Bar["tone"], { fill: string; stroke: string; text: string; dash?: string }> = {
  run: { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  wait: { fill: "#f1f5f9", stroke: "#64748b", text: "#334155" },
  timeout: { fill: "#fef3c7", stroke: "#d97706", text: "#78350f", dash: "4 3" },
  done: { fill: "#dcfce7", stroke: "#16a34a", text: "#14532d" },
  stop: { fill: "#fee2e2", stroke: "#dc2626", text: "#7f1d1d" },
};

const px = (t: number) => X0 + t * (X1 - X0);

function Lane({ bars, y }: { bars: readonly Bar[]; y: number }) {
  return (
    <>
      {bars.map((bar) => {
        const style = FILL[bar.tone];
        const width = px(bar.to) - px(bar.from);
        return (
          <g key={`${bar.from}-${bar.label}`}>
            <rect x={px(bar.from)} y={y - BAR_H / 2} width={width} height={BAR_H} rx={4} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
            <text x={px(bar.from) + width / 2} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={style.text}>{bar.label}</text>
          </g>
        );
      })}
    </>
  );
}

export default function WaitTimeoutViz() {
  return (
    <SceneShell
      eyebrow="실행 시계 · 대기 시계"
      title="wait timeout은 기다림만 끝내고 실행은 끝내지 않습니다"
      description="위 줄은 runtime의 실행, 아래 줄은 agent.wait의 기다림입니다. 막대 길이는 순서만 보이려는 설명용이며 실제 시간 비율이 아닙니다."
      ariaLabel="agent.wait timeout과 실제 실행 종료를 두 줄로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={RUN_Y + 4} fontSize={11} fontWeight={700} fill="#64748b">실행</text>
            <text x={8} y={WAIT_Y + 4} fontSize={11} fontWeight={700} fill="#64748b">agent.wait</text>
            <line x1={X0} x2={X1} y1={RUN_Y} y2={RUN_Y} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={WAIT_Y} y2={WAIT_Y} stroke="#cbd5e1" strokeWidth={1} />
            <Lane bars={scene.run} y={RUN_Y} />
            <Lane bars={scene.wait} y={WAIT_Y} />
            <line x1={X0} x2={X0} y1={20} y2={WAIT_Y + 18} stroke="#2563eb" strokeWidth={1} />
            <text x={X0} y={14} textAnchor="start" fontSize={10} fontWeight={700} fill="#2563eb">접수 (runId)</text>
            <line x1={X0} x2={X1} y1={H - 14} y2={H - 14} stroke="#94a3b8" strokeWidth={1} />
            <text x={X1} y={H - 2} textAnchor="end" fontSize={10} fill="#64748b">시간 →</text>
          </svg>
        );
      }}
    />
  );
}
