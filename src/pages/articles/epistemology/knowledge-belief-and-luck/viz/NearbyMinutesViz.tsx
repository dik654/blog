import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 실제 시각을 1분씩 바꾸면 정상 시계의 바늘은 따라가고 멈춘 시계의 바늘은 12:00에 머문다.
 * 가로 = 실제 시각, 세로 = 바늘이 가리키는 시각. 단위는 12시 정각에서 떨어진 분입니다.
 */
const SCENES = [
  { label: "정상 시계", summary: "바늘이 시각을 따라감", note: "실제 시각이 1분 가면 바늘도 1분 갑니다. 그래서 점이 대각선 위에 놓이고, 이 대각선 위의 점은 곧 맞는 표시입니다." },
  { label: "멈춘 시계", summary: "바늘이 12:00에 머묾", note: "실제 시각이 무엇이든 바늘은 12:00입니다. 민아의 판단은 현재 시각이 아니라 이 바늘을 따라갑니다." },
  { label: "12시 정각", summary: "두 선이 만나는 한 점", note: "이 순간에는 믿음도 있고, 참이고, 평소 믿을 이유가 있는 시계를 봤으니 어느 정도의 정당화도 있습니다." },
  { label: "1분 앞뒤", summary: "11:59도 12:01도 틀림", note: "조금만 일찍이나 늦게 봐도 멈춘 시계는 12:00이라 틀립니다. 가까운 경우에도 쉽게 틀리지 않는가를 묻는 이 검사가 안전성의 한 직관입니다." },
] as const;

const W = 340;
const H = 280;
const LEFT = 58;
const RIGHT = 12;
const TOP = 14;
const BOTTOM = 48;
const RANGE = 1.4;

const px = (minute: number) => LEFT + ((minute + RANGE) / (2 * RANGE)) * (W - LEFT - RIGHT);
const py = (minute: number) => TOP + ((RANGE - minute) / (2 * RANGE)) * (H - TOP - BOTTOM);

const NORMAL = "#2563eb";
const STOPPED = "#d97706";
const WRONG = "#dc2626";
const TICKS = [
  { minute: -1, label: "11:59" },
  { minute: 0, label: "12:00" },
  { minute: 1, label: "12:01" },
] as const;

export default function NearbyMinutesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="가까운 경우"
      title="실제 시각을 1분씩 바꾸면 멈춘 바늘은 한 점에서만 맞습니다"
      description="가로는 실제 시각, 세로는 바늘이 가리키는 시각입니다. 민아가 12시에 시계를 본 사례입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실제 시각에 따른 정상 시계와 멈춘 시계의 표시를 비교하는 그래프"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {TICKS.map(({ minute, label }) => (
            <g key={minute}>
              <line x1={px(minute)} x2={px(minute)} y1={TOP} y2={H - BOTTOM} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
              <line x1={LEFT} x2={W - RIGHT} y1={py(minute)} y2={py(minute)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
              <text x={px(minute)} y={H - BOTTOM + 18} textAnchor="middle" fontSize={13} fill="#64748b">{label}</text>
              <text x={LEFT - 6} y={py(minute) + 5} textAnchor="end" fontSize={13} fill="#64748b">{label}</text>
            </g>
          ))}
          <text x={(LEFT + W - RIGHT) / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">실제 시각</text>
          <text x={LEFT + 4} y={TOP + 14} fontSize={13} fontWeight={700} fill="#64748b">바늘 표시</text>

          <line x1={px(-RANGE)} x2={px(RANGE)} y1={py(-RANGE)} y2={py(RANGE)} stroke={NORMAL} strokeWidth={1.25} opacity={active === 1 ? 0.45 : 1} />
          <text x={px(0.72)} y={py(1.22)} textAnchor="end" fontSize={13} fontWeight={700} fill={NORMAL}>정상 시계</text>
          {active === 0 && TICKS.map(({ minute }) => <circle key={minute} cx={px(minute)} cy={py(minute)} r={3.5} fill={NORMAL} />)}

          {active >= 1 && (
            <g>
              <line x1={px(-RANGE)} x2={px(RANGE)} y1={py(0)} y2={py(0)} stroke={STOPPED} strokeWidth={1.25} />
              <text x={px(RANGE) - 2} y={py(0) + 18} textAnchor="end" fontSize={13} fontWeight={700} fill={STOPPED}>멈춘 시계</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <circle cx={px(0)} cy={py(0)} r={5} fill="#ffffff" stroke={STOPPED} strokeWidth={1.25} />
              <circle cx={px(0)} cy={py(0)} r={2.5} fill={NORMAL} />
              <text x={px(0) + 9} y={py(0) + 20} fontSize={13} fontWeight={700} fill={NORMAL}>둘 다 맞음</text>
            </g>
          )}
          {active === 3 && [-1, 1].map((minute) => (
            <g key={minute}>
              <line x1={px(minute)} x2={px(minute)} y1={py(0)} y2={py(minute)} stroke={WRONG} strokeWidth={1} />
              <circle cx={px(minute)} cy={py(0)} r={4} fill={WRONG} />
              <circle cx={px(minute)} cy={py(minute)} r={3.5} fill={NORMAL} />
              <text x={px(minute) + (minute < 0 ? 7 : -7)} y={py(0) + (minute < 0 ? 22 : -12)} textAnchor={minute < 0 ? "start" : "end"} fontSize={13} fontWeight={700} fill={WRONG}>틀림</text>
            </g>
          ))}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
