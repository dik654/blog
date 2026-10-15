import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 전체 예산 5칸, P 조각 상한 4, decode R1·R2가 1칸씩 먼저 쓴다.
 * 한 mechanism: 상한 4가 아니라 남은 예산 3이 P의 조각을 정하므로 P=12는 3·3·3·3, 네 번에 걸쳐 읽힌다.
 */
const BUDGET = 5;
const CAP = 4;
const P_TOTAL = 12;
const RUN_SLOTS = ["R1", "R2", "P", "P", "P"] as const;

interface Scene {
  label: string;
  runs: number;
  compare?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "비교 · 한 번에 12",
    runs: 0,
    compare: true,
    note: "(비교) 조각 상한 없이 예산을 14로 늘리면 P 12개를 한 실행에 넣습니다. R1·R2도 같은 실행에 있지만 이 긴 실행이 끝나야 다음 토큰을 받습니다.",
  },
  {
    label: "실행 1",
    runs: 1,
    note: "예산 5칸 중 R1·R2가 1칸씩 먼저 씁니다. 남은 3칸이 P의 첫 조각이 되고, 상한 4칸 틀의 마지막 1칸은 예산이 없어 비어 있습니다.",
  },
  {
    label: "실행 2",
    runs: 2,
    note: "다음 실행도 R1·R2가 먼저 1칸씩 가져가므로 P는 다시 3칸을 받습니다. P의 진행은 3에서 6이 됩니다.",
  },
  {
    label: "실행 3",
    runs: 3,
    note: "같은 모양이 반복돼 P의 진행이 9가 됩니다. 매 실행 상한 틀의 1칸이 남지만 쓸 예산이 없습니다.",
  },
  {
    label: "실행 4 · 12 완료",
    runs: 4,
    note: "네 번째 실행에서 12를 모두 읽습니다. 최소 조각 수 ⌈12/4⌉ = 3은 매번 4칸을 받을 때의 하한이고, 실제로는 3칸씩 네 번이 걸렸습니다.",
  },
];

const color = (slot: string) => (slot === "P" ? "bg-[#f59e0b] text-[#451a03]" : "bg-[#2563eb] text-white");

export default function ChunkBudgetGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const progress = scene.compare ? P_TOTAL : scene.runs * 3;

  return (
    <VizFrame
      eyebrow="Chunked prefill budget"
      title="상한 4보다 남은 예산 3이 조각 크기를 정해 12를 네 번에 읽습니다"
      description="한 행이 한 번의 실행이고 칸 하나가 예산 1 token입니다. 파란 칸은 decode R1·R2, 주황 칸은 P의 prefill 조각입니다. 갈색 점선 틀은 P 조각 상한 4칸이고 마지막 칸이 예산 밖에 걸립니다."
      note="예산 5, 상한 4, P=12, R1·R2가 끝나지 않는다는 조건은 본문의 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실행마다 예산 칸을 decode와 prefill 조각에 나누는 모습"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col gap-4">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="min-h-[9.75rem] space-y-1.5">
            {scene.compare ? (
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground">한 번</span>
                <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-0.5">
                  {["R1", "R2", ...Array(12).fill("P")].map((slot, i) => (
                    <motion.span
                      key={i}
                      className={`flex h-8 items-center justify-center rounded-sm text-[9px] font-bold ${color(slot)}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduced ? 0 : i * 0.05 }}
                    >
                      {slot}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              Array.from({ length: scene.runs }, (_, run) => (
                <div key={run} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[11px] font-bold text-foreground">실행 {run + 1}</span>
                  <div className="relative grid grid-cols-[repeat(6,minmax(0,1fr))] gap-0.5">
                    {RUN_SLOTS.map((slot, i) => (
                      <motion.span
                        key={i}
                        className={`flex h-8 items-center justify-center rounded-sm text-[11px] font-bold ${color(slot)}`}
                        initial={{ opacity: run === scene.runs - 1 ? 0 : 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: reduced ? 0 : 0.1 + i * 0.12 }}
                      >
                        {slot}
                      </motion.span>
                    ))}
                    {/* 예산 5칸 밖의 자리: 상한 4칸 틀의 마지막 칸이 여기에 걸린다 */}
                    <span className="flex h-8 items-center justify-center rounded-sm border border-dashed border-border text-[10px] text-muted-foreground">예산 밖</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-[-3px] rounded-sm border border-dashed border-[#b45309]"
                      style={{ left: `${(2 / (BUDGET + 1)) * 100}%`, width: `${(CAP / (BUDGET + 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-bold">P 입력 12</span>
              <span className="font-mono text-muted-foreground">
                {progress} / {P_TOTAL}
              </span>
            </div>
            <div className="mt-1 grid grid-cols-[repeat(12,minmax(0,1fr))] gap-0.5">
              {Array.from({ length: P_TOTAL }, (_, i) => (
                <span
                  key={i}
                  className={`h-4 rounded-sm border ${i < progress ? "border-[#f59e0b] bg-[#f59e0b]" : "border-dashed border-border"}`}
                />
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">실행 수</dt>
              <dd className="font-bold">{scene.compare ? 1 : scene.runs}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">하한 ⌈12/4⌉</dt>
              <dd className="font-bold">3</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">P 조각</dt>
              <dd className="font-bold">{scene.compare ? "12" : Array(scene.runs).fill(3).join("·")}</dd>
            </div>
          </dl>

          <p className="min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
