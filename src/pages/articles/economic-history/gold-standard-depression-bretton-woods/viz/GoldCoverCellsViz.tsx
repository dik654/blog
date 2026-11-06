import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #case — 금 100, 통화 500, 약속 5:1에서 국외 순지급 20이 두 번 나가는 가정.
 * 칸 하나 = 금 1과 그 금으로 바꿔 줄 통화 5. 한 줄 = 금 20. 통화 500은 그대로 둡니다.
 */
const SCENES = [
  { label: "처음", gold: 100, summary: "금 100 · 금 1당 통화 5", note: "통화 500을 5씩 묶으면 100칸이고 칸마다 금 1이 받칩니다. 통화를 전부 들고 와도 약속대로 바꿔 줄 수 있습니다." },
  { label: "20 유출", gold: 80, summary: "금 80 · 금 1당 통화 6.25", note: "금이 한 줄 나가도 통화가 500이면 칸 수는 그대로입니다. 500÷80=6.25이고, 5:1로 바꿔 줄 수 있는 통화는 80×5=400까지입니다. 나머지 100 뒤에는 금이 없습니다." },
  { label: "20 한 번 더", gold: 60, summary: "금 60 · 금 1당 통화 약 8.33", note: "같은 유출이 또 나면 500÷60≈8.33입니다. 5:1로 바꿔 줄 수 있는 통화는 60×5=300까지이고 200 뒤에는 금이 없습니다. 비율 5:1은 그대로인데 약속의 여유만 줄었습니다." },
] as const;

const COLS = 20;
const ROWS = 5;
const CELL = 11.5;
const GAP = 1.5;
const ROW_H = 20;
const ROW_GAP = 5;
const TOP = 4;
const GRID_W = COLS * (CELL + GAP) - GAP;
const W = 320;
const H = TOP + ROWS * (ROW_H + ROW_GAP) - ROW_GAP + 4;

const GOLD = "#d97706";
const EMPTY = "#94a3b8";

export default function GoldCoverCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const gold = SCENES[active].gold;

  return (
    <VizFrame
      eyebrow="준비자산 칸 세기"
      title="금이 나가도 통화 칸은 그대로 남습니다"
      description="금 20이 나가면 통화 500을 받치는 칸이 몇 개 남을까요? 채운 칸은 금이 받치는 통화 5, 점선 칸은 금이 빠진 통화 5입니다. 한 줄이 금 20입니다."
      note="새 차입이 없고 통화량이 500으로 그대로라고 가정한 설명용 숫자입니다. 실제 금본위제가 언제나 고정 준비율로 움직였다는 뜻은 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="금 100에서 20씩 빠질 때 통화 500을 받치는 칸이 줄어드는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: ROWS }, (_, row) => {
            const y = TOP + row * (ROW_H + ROW_GAP);
            return (
              <g key={row}>
                {Array.from({ length: COLS }, (_, col) => (
                  <rect
                    key={col}
                    x={col * (CELL + GAP)}
                    y={y}
                    width={CELL}
                    height={ROW_H}
                    rx={1.5}
                    fill={row < gold / 20 ? GOLD : "none"}
                    stroke={row < gold / 20 ? GOLD : EMPTY}
                    strokeWidth={0.75}
                    strokeDasharray={row < gold / 20 ? undefined : "2 2"}
                  />
                ))}
                {row >= gold / 20 && (
                  <text x={GRID_W + 8} y={y + 15} fontSize={13} fontWeight={700} fill="#64748b">금 −20</text>
                )}
              </g>
            );
          })}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
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
