import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "forward SDE",
  "reverse SDE",
  "flow ODE",
  "solver budget",
] as const;

export default function ContinuousTransportViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated probability transport"
      title="같은 noise cloud에서 출발해 random path와 deterministic path를 분리한다"
      description="Score는 density가 많은 방향을 알려 주고, dynamics는 그 방향을 stochastic drift 또는 deterministic velocity로 사용합니다."
      note="같은 time marginal은 같은 particle path를 뜻하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="reverse SDE probability flow ODE 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="space-y-3 md:hidden">
          <Cloud label="data cloud" dots="● ●  ●" active={a === 0} />
          <MobileArrow text="forward drift + Brownian noise" />
          <Cloud label="terminal noise" dots="·  · ·  ·" active={a <= 1} />
          <div className="grid grid-cols-2 gap-3">
            <Cloud label="reverse SDE" dots="random paths" active={a === 1} />
            <Cloud label="flow ODE" dots="fixed paths" active={a === 2} />
          </div>
          <MobileArrow text="finite solver가 learned field를 호출" />
          <Cloud label="NFE ledger" dots="steps ≠ calls" active={a === 3} />
        </div>
        <svg
          viewBox="0 0 840 350"
          className="hidden h-auto w-full md:block"
          aria-label="data cloud와 noise cloud 사이 SDE ODE transport"
        >
          <CloudSvg cx={110} cy={175} label="data" active={a === 0 || a >= 1} />
          <CloudSvg cx={420} cy={175} label="noise prior" active={a <= 1} />
          <CloudSvg cx={730} cy={95} label="reverse SDE" active={a === 1} />
          <CloudSvg cx={730} cy={255} label="flow ODE" active={a === 2} />
          <Curve
            d="M175 165 C255 75 330 95 355 145"
            color="#64748b"
            active={a === 0}
            label="forward + Brownian"
            x={270}
            y={80}
          />
          <Curve
            d="M485 150 C570 50 640 55 675 90"
            color="#f97316"
            active={a === 1}
            label="score-corrected random path"
            x={585}
            y={48}
          />
          <Curve
            d="M485 205 C565 300 640 290 675 260"
            color="#0ea5e9"
            active={a === 2}
            label="deterministic velocity"
            x={585}
            y={320}
          />
          <rect
            x="330"
            y="285"
            width="180"
            height="45"
            rx="8"
            fill={a === 3 ? "#eff6ff" : "var(--background)"}
            stroke={a === 3 ? "#2563eb" : "currentColor"}
            strokeOpacity={a === 3 ? 1 : 0.25}
            strokeWidth="1.1"
          />
          <text
            x="420"
            y="313"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="currentColor"
          >
            solver calls → NFE
          </text>
        </svg>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
function Cloud({
  label,
  dots,
  active,
}: {
  label: string;
  dots: string;
  active: boolean;
}) {
  return (
    <div
      className={`border px-4 py-4 text-center ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}
    >
      <p className="font-black">{label}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{dots}</p>
    </div>
  );
}
function MobileArrow({ text }: { text: string }) {
  return <p className="text-center text-xs font-bold text-primary">↓ {text}</p>;
}
function CloudSvg({
  cx,
  cy,
  label,
  active,
}: {
  cx: number;
  cy: number;
  label: string;
  active: boolean;
}) {
  const pts = [
    [0, 0],
    [-28, -20],
    [32, -18],
    [-36, 24],
    [25, 27],
    [2, -34],
  ];
  return (
    <g opacity={active ? 1 : 0.3}>
      {pts.map(([dx, dy], i) => (
        <circle
          key={i}
          cx={cx + dx}
          cy={cy + dy}
          r="5"
          fill={active ? "#2563eb" : "#94a3b8"}
        />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r="58"
        fill="none"
        stroke={active ? "#2563eb" : "currentColor"}
        strokeOpacity={active ? 1 : 0.25}
        strokeWidth="1.1"
      />
      <text
        x={cx}
        y={cy + 85}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="currentColor"
      >
        {label}
      </text>
    </g>
  );
}
function Curve({
  d,
  color,
  active,
  label,
  x,
  y,
}: {
  d: string;
  color: string;
  active: boolean;
  label: string;
  x: number;
  y: number;
}) {
  return (
    <g opacity={active ? 1 : 0.12}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="7 5"
      />
      <text x={x} y={y} textAnchor="middle" fontSize="11" fill={color}>
        {label}
      </text>
    </g>
  );
}
