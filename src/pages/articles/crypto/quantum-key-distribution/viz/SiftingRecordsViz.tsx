import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { SIGNAL_RECORDS } from "./signalRecords";

/**
 * 본문 대응: #case — 12개 기록이 8개, 6개로 줄어드는 과정.
 * 칸 하나 = 신호 하나. 방향 비교 → 검사 공개 → 남은 6비트 대조 순서로 칸을 지웁니다.
 */
const SCENES = [
  { label: "12개 기록", count: "12개", note: "신호마다 A와 B가 각자 방향을 고르고 값을 적었습니다. 아직 서로의 방향을 모릅니다." },
  { label: "방향 비교", count: "12개 → 8개", note: "방향이 다른 3, 6, 9, 11번을 지웁니다. 9번은 값이 우연히 같지만 방향이 달라 함께 버립니다." },
  { label: "검사 공개", count: "8개 → 6개", note: "무작위로 뽑은 2번과 10번의 값을 공개합니다. 둘 다 일치하지만 남이 읽었으므로 비밀 후보에서 뺍니다." },
  { label: "남은 6비트", count: "010110 / 011110", note: "남은 값을 신호 번호 순서로 읽습니다. 세 번째 자리인 5번이 다릅니다. 공개한 2개가 맞았어도 이 차이는 드러나지 않았습니다." },
] as const;

type CellState = "live" | "dropped" | "revealed";

function cellState(process: string, scene: number): CellState {
  if (scene >= 1 && process === "제외") return "dropped";
  if (scene >= 2 && process === "검사 공개") return "revealed";
  return "live";
}

const CELL_CLASS: Record<CellState, string> = {
  live: "border-border bg-background text-foreground",
  dropped: "border-dashed border-border/60 text-muted-foreground/45 line-through",
  revealed: "border-dashed border-primary/60 text-primary",
};

export default function SiftingRecordsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);

  return (
    <VizFrame
      eyebrow="기록 거르기"
      title="12개 기록에서 어떤 칸이 사라지는지 셉니다"
      description="칸 하나가 신호 하나입니다. 위쪽 글자는 방향, 아래쪽 숫자는 값이며 A 다음에 B를 적었습니다."
      note="설명을 위해 만든 기록입니다. 실제 실험의 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="12개 기록을 방향 비교와 검사 공개로 6개까지 줄이는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.count}</span>
            </div>
          ))}
        />
        <ol className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {SIGNAL_RECORDS.map(([id, aValue, aBasis, bBasis, bValue, process]) => {
            const state = cellState(process, scenes.active);
            const mismatch = scenes.active === 3 && state === "live" && aValue !== bValue;
            return (
              <li
                key={id}
                className={`rounded-lg border px-2 py-2 text-center font-mono text-xs leading-5 transition-colors ${
                  mismatch ? "border-red-600 text-red-700 dark:text-red-400" : CELL_CLASS[state]
                }`}
              >
                <span className="block text-[11px] font-sans font-semibold">{id}번</span>
                <span className="block">{aBasis} {bBasis}</span>
                <span className="block font-bold">{aValue} {bValue}</span>
              </li>
            );
          })}
        </ol>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
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
