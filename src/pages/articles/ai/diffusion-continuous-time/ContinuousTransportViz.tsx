import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "정방향 확산",
  "무작위 역경로",
  "결정적 역경로",
  "호출 비용",
] as const;
const NOTES = [
  "정방향 SDE는 평균 이동과 브라운 운동을 더해 데이터 분포를 잡음 쪽으로 퍼뜨립니다.",
  "역방향 SDE는 점수로 평균 방향을 고치면서도 매 순간 무작위 항을 남깁니다.",
  "Probability-flow ODE는 같은 시간별 분포를 목표로 하되 한 초기점에 결정적 경로를 줍니다.",
  "실제 실행에서는 유한한 solver step과 신경망 호출 횟수 NFE가 오차와 지연을 정합니다.",
] as const;

export default function ContinuousTransportViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="확률분포 전송"
      title="같은 잡음 분포에서 무작위 경로와 결정적 경로를 나눕니다"
      description="점수는 밀도가 높아지는 방향을 알려 주고, 동역학은 그 방향을 무작위 평균 이동이나 결정적 속도로 사용합니다."
      note="같은 시간별 분포를 만든다고 각 표본이 같은 경로로 움직이는 것은 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="continuous-transport-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="reverse SDE probability flow ODE 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
        <div className="space-y-3 md:hidden">
          <Cloud label="데이터 분포" dots="● ●  ●" active={a === 0} />
          <MobileArrow text="정방향 평균 이동 + 브라운 잡음" />
          <Cloud label="마지막 잡음" dots="·  · ·  ·" active={a <= 1} />
          <div className="grid grid-cols-2 gap-3">
            <Cloud label="역방향 SDE" dots="무작위 경로" active={a === 1} />
            <Cloud label="흐름 ODE" dots="결정적 경로" active={a === 2} />
          </div>
          <MobileArrow text="유한 solver가 학습한 장을 호출" />
          <Cloud label="호출 장부" dots="단계 수 ≠ 호출 수" active={a === 3} />
        </div>
        <svg
          viewBox="0 0 840 350"
          className="hidden h-auto w-full md:block"
          aria-label="data cloud와 noise cloud 사이 SDE ODE transport"
        >
          <CloudSvg cx={110} cy={175} label="데이터" active={a === 0 || a >= 1} />
          <CloudSvg cx={420} cy={175} label="잡음 기준분포" active={a <= 1} />
          <CloudSvg cx={730} cy={95} label="역방향 SDE" active={a === 1} />
          <CloudSvg cx={730} cy={255} label="흐름 ODE" active={a === 2} />
          <Curve
            d="M175 165 C255 75 330 95 355 145"
            color="#64748b"
            active={a === 0}
            label="정방향 + 브라운 잡음"
            x={270}
            y={80}
          />
          <Curve
            d="M485 150 C570 50 640 55 675 90"
            color="#f97316"
            active={a === 1}
            label="점수로 고친 무작위 경로"
            x={585}
            y={48}
          />
          <Curve
            d="M485 205 C565 300 640 290 675 260"
            color="#0ea5e9"
            active={a === 2}
            label="결정적 속도"
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
            신경망 호출 수 → NFE
          </text>
        </svg>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
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
