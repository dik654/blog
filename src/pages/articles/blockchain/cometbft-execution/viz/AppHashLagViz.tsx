import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #validate-block — B41 Header의 AppHash는 실행 전 A40, B41 실행 결과 A41은 B42 Header에 들어간다.
 * 위 줄 = Block Header, 아래 줄 = 그 높이까지 실행한 상태(C·X). 대각선 = commitment가 다음 Header로 옮겨 가는 길.
 */
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

type Part = "c40" | "b41" | "link41" | "exec" | "c41" | "link42" | "b42";

const SCENES: readonly { label: string; summary: string; on: readonly Part[]; note: string }[] = [
  {
    label: "실행 전 상태는 A40",
    summary: "C40.AppHash = A40",
    on: ["c40"],
    note: "아래 줄은 그 높이까지 실행을 마친 상태입니다. B41을 실행하기 전 application은 X40이고, 그 commitment A40을 CometBFT State C40도 기억합니다.",
  },
  {
    label: "B41 Header는 A40을 싣습니다",
    summary: "B41.AppHash = C40.AppHash = A40",
    on: ["c40", "link41", "b41"],
    note: "validateBlock은 B41의 height가 40 + 1인지, B41 Header의 AppHash가 C40이 기억하는 A40과 같은지 대조합니다. B41 Header 칸에는 A41이 아니라 A40이 들어갑니다.",
  },
  {
    label: "B41을 실행해야 A41이 나옵니다",
    summary: "FinalizeBlock(X40, B41) → A41",
    on: ["c40", "b41", "exec", "c41"],
    note: "검증을 통과한 B41을 X40 위에 실행해 결과 R41과 A41을 얻습니다. C41의 AppHash는 application Commit이 성공한 뒤에야 A41로 채워집니다.",
  },
  {
    label: "A41은 다음 B42 Header로",
    summary: "B42.AppHash = C41.AppHash = A41",
    on: ["c41", "link42", "b42"],
    note: "A41은 다음 B42 Header에 들어갑니다. B42를 검사할 때도 같은 규칙으로 B42 Header의 AppHash를 C41이 기억하는 A41과 대조합니다. Header의 AppHash는 직전 높이까지 실행한 결과를 가리킵니다.",
  },
];

function Box({
  x,
  y,
  title,
  value,
  on,
}: {
  x: number;
  y: number;
  title: string;
  value: string;
  on: boolean;
}) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect
        x={x}
        y={y}
        width="88"
        height="48"
        rx="8"
        fill={on ? "#2563eb1a" : "none"}
        stroke={on ? ACCENT : MUTED}
        strokeWidth={on ? 1.25 : 1}
      />
      <text x={x + 44} y={y + 20} textAnchor="middle" className="fill-foreground text-[10px] font-bold">
        {title}
      </text>
      <text x={x + 44} y={y + 37} textAnchor="middle" className="fill-foreground font-mono text-[10px]">
        {value}
      </text>
    </g>
  );
}

function Link({ d, on, label, lx, ly }: { d: string; on: boolean; label?: string; lx?: number; ly?: number }) {
  return (
    <g opacity={on ? 1 : 0.25}>
      <path d={d} fill="none" stroke={on ? ACCENT : MUTED} strokeWidth={on ? 1.25 : 1} markerEnd={on ? "url(#apphash-lag-on)" : "url(#apphash-lag-off)"} />
      {label ? (
        <text x={lx} y={ly} textAnchor="middle" className="fill-muted-foreground text-[9px]">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Diagram({ on }: { on: readonly Part[] }) {
  const is = (part: Part) => on.includes(part);
  const cols = [26, 126, 226];
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="Block Header의 AppHash가 직전 높이까지의 실행 결과를 가리키는 계단 구조" className="mx-auto block h-auto w-full max-w-[25rem]">
      <defs>
        <marker id="apphash-lag-on" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={ACCENT} />
        </marker>
        <marker id="apphash-lag-off" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={MUTED} />
        </marker>
      </defs>
      {["h40", "h41", "h42"].map((label, index) => (
        <g key={label}>
          <text x={cols[index] + 44} y="12" textAnchor="middle" className="fill-muted-foreground font-mono text-[10px] font-bold">
            {label}
          </text>
          <line x1={cols[index] + 44} y1="18" x2={cols[index] + 44} y2="24" stroke={MUTED} strokeWidth="1" />
        </g>
      ))}
      <text x="8" y="40" className="fill-muted-foreground text-[9px]">
        Header
      </text>
      <text x="8" y="206" className="fill-muted-foreground text-[9px]">
        실행한 상태
      </text>

      <Box x={cols[1]} y={30} title="B41 Header" value="AppHash A40" on={is("b41")} />
      <Box x={cols[2]} y={30} title="B42 Header" value="AppHash A41" on={is("b42")} />
      <Box x={cols[0]} y={140} title="C40 · X40" value="AppHash A40" on={is("c40")} />
      <Box x={cols[1]} y={140} title="C41 · X41" value="AppHash A41" on={is("c41")} />

      <Link d={`M${cols[0] + 70} 138 L${cols[1] + 22} 82`} on={is("link41")} label="A40 →" lx={cols[0] + 64} ly={108} />
      <Link d={`M${cols[1] + 44} 80 L${cols[1] + 44} 136`} on={is("exec")} label="실행" lx={cols[1] + 62} ly={112} />
      <Link d={`M${cols[1] + 70} 138 L${cols[2] + 22} 82`} on={is("link42")} label="A41 →" lx={cols[1] + 124} ly={120} />
    </svg>
  );
}

export default function AppHashLagViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((item) => item.label);

  return (
    <VizFrame
      eyebrow="AppHash의 높이 차이"
      title="Header의 AppHash는 직전 높이까지의 실행 결과입니다"
      description="AppHash는 application state를 요약한 commitment입니다. 위 줄은 Block Header, 아래 줄은 그 높이까지 실행을 마친 CometBFT State(C)와 application state(X)입니다."
      note="B41·C40·X40·A40은 본문의 설명용 이름입니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="A40이 B41 Header로, A41이 B42 Header로 옮겨 가는 네 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-xs font-bold text-primary sm:text-sm">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Diagram on={SCENES[scenes.active].on} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
