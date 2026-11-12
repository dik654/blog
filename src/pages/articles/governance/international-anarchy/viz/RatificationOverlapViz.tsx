import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #limits ProgressiveDetail — 두 수준 게임의 비준 가능 범위 겹침.
 * A국 의회 2~4척, B국 연립정부 3~5척 → 합의 가능 3~4척. 2척은 B국, 5척은 A국에서 부결.
 * A국이 2척만, B국이 5척만 받아들이면 겹침이 없다. 모든 범위는 본문의 가상 값.
 */
type Range = readonly [number, number];

interface Scene {
  label: string;
  summary: string;
  a: Range | null;
  b: Range | null;
  overlap: Range | null;
  ceiling: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "A국 의회가 받는 범위",
    summary: "2~4척",
    a: [2, 4],
    b: null,
    overlap: null,
    ceiling: false,
    note: "비준은 대표가 서명한 합의를 국내 의회 등이 받아들여 발효시키는 절차입니다. A국 의회는 순찰선 상한 2~4척만 받아들인다고 가정합니다.",
  },
  {
    label: "B국 연립정부의 범위를 겹칩니다",
    summary: "합의 가능 3~4척",
    a: [2, 4],
    b: [3, 5],
    overlap: [3, 4],
    ceiling: false,
    note: "B국은 3~5척만 받아들입니다. 두 막대가 함께 덮는 3~4척만 양쪽 국내를 모두 통과합니다. 2척은 B국 국내에서, 5척은 A국 국내에서 부결됩니다.",
  },
  {
    label: "손이 묶인 사실이 협상력이 됩니다",
    summary: "B국은 4척 아래로",
    a: [2, 4],
    b: [3, 5],
    overlap: [3, 4],
    ceiling: true,
    note: "A국 대표가 “4척을 넘으면 의회가 부결한다”는 말을 믿게 만들면 B국은 4척 아래로 움직여야 합니다. 국내 제약이 바깥 협상에서 지렛대가 될 수 있습니다.",
  },
  {
    label: "범위가 맞닿지 않으면",
    summary: "겹침 없음 · 합의 불가",
    a: [2, 2],
    b: [5, 5],
    overlap: null,
    ceiling: false,
    note: "A국이 2척만, B국이 5척만 받아들이면 겹치는 구간이 없어 합의 자체가 불가능합니다. 좁은 비준 범위는 상대의 양보를 끌어낼 수도 있지만, 서로 맞닿지 않으면 협상을 끝내 버립니다.",
  },
];

const MIN = 1;
const MAX = 6;
const TICKS: readonly number[] = [2, 3, 4, 5];
const pos = (value: number) => ((value - MIN) / (MAX - MIN)) * 100;

function Track({ label, range, color }: { label: string; range: Range | null; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="text-xs font-bold sm:text-sm">{label}</span>
      <div className="relative h-7 min-w-0 rounded-sm bg-muted/40">
        {range && (
          <div
            className="absolute top-1 bottom-1 rounded-sm border"
            style={{
              left: `calc(${pos(range[0])}% - 6px)`,
              width: `calc(${pos(range[1]) - pos(range[0])}% + 12px)`,
              borderColor: color,
              backgroundColor: `${color}33`,
            }}
          />
        )}
        {range && (
          <span
            className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm px-1 font-mono text-xs font-bold ${
              range[0] === range[1] ? "" : "-translate-x-1/2"
            }`}
            style={
              range[0] !== range[1]
                ? { left: `${(pos(range[0]) + pos(range[1])) / 2}%` }
                : pos(range[0]) > 50
                  ? { right: `calc(${100 - pos(range[0])}% + 10px)` }
                  : { left: `calc(${pos(range[0])}% + 10px)` }
            }
          >
            {range[0] === range[1] ? `${range[0]}척만` : `${range[0]}~${range[1]}척`}
          </span>
        )}
      </div>
    </div>
  );
}

function Picture({ scene }: { scene: Scene }) {
  return (
    <div className="min-w-0 space-y-3">
      <Track label="A국 의회" range={scene.a} color="#2563eb" />
      <Track label="B국 연립정부" range={scene.b} color="#d97706" />
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
        <span className="text-xs font-bold text-primary sm:text-sm">합의 가능</span>
        <div className="relative h-7 min-w-0 rounded-sm border border-dashed border-border">
          {scene.overlap && (
            <div
              className="absolute top-1 bottom-1 rounded-sm"
              style={{
                left: `calc(${pos(scene.overlap[0])}% - 6px)`,
                width: `calc(${pos(scene.overlap[1]) - pos(scene.overlap[0])}% + 12px)`,
                backgroundColor: "#16a34a",
              }}
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">
            {scene.overlap ? (
              <span className="rounded-sm bg-background px-1">{`${scene.overlap[0]}~${scene.overlap[1]}척`}</span>
            ) : scene.b ? (
              "겹침 없음"
            ) : (
              "B국 범위를 보기 전"
            )}
          </span>
          {scene.ceiling && (
            <div
              className="absolute -top-[4.75rem] bottom-0 border-l border-red-600"
              style={{ left: `calc(${pos(4)}% + 6px)` }}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
        <span className="text-[11px] text-muted-foreground">순찰선 상한</span>
        <div className="relative h-5 min-w-0">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 font-mono text-[11px] text-muted-foreground"
              style={{ left: `${pos(tick)}%` }}
            >
              {tick}척
            </span>
          ))}
        </div>
      </div>
      <p className={`min-h-5 text-xs font-bold ${scene.ceiling ? "text-red-700 dark:text-red-400" : "invisible"}`}>
        빨간 선: A국 대표가 내세운 “4척을 넘으면 부결” 경계
      </p>
    </div>
  );
}

export default function RatificationOverlapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="두 수준 게임"
      title="두 나라 국내에서 통과할 범위가 겹쳐야 합의가 됩니다"
      description="막대는 각 나라 국내에서 받아들이는 순찰선 상한의 범위입니다. 본문의 설명용 가상 값을 그대로 씁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="A국과 B국의 비준 가능 범위와 겹침"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-5"
          scenes={SCENES.map((scene) => (
            <Picture key={scene.label} scene={scene} />
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
