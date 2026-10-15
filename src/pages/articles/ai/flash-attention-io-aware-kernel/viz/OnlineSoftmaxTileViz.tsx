import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 점수 [1,3,2,5]를 두 칸씩 두 조각으로 읽으며 기준 m, 지수합 ℓ, 가중합 u만 남긴다.
 * 한 mechanism: 기준이 3에서 5로 바뀌면 옛 막대(옛 두 합)가 함께 e⁻²배로 줄어든다.
 * 막대 높이 = e^(s−m), 점선 = 현재 기준 m에서 높이 1.
 */
const SCORES = [1, 3, 2, 5] as const;
const VALUES = [2, 4, 6, 8] as const;
const BAR_MAX = 88; // px, e^(s−m)=1의 높이

type Cell = "unread" | "sram" | "dropped";

interface Scene {
  label: string;
  m: number;
  cells: readonly Cell[];
  bars: readonly (number | null)[];
  l: string;
  u: string;
  o: string;
  wrong?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "조각 1 읽기",
    m: 3,
    cells: ["sram", "sram", "unread", "unread"],
    bars: [0.135335, 1, null, null],
    l: "1.135335",
    u: "4.270671",
    o: "—",
    note: "작은 작업 공간에 [1, 3]만 올립니다. 기준 m=3에서 막대는 e⁻²≈0.135와 1이고, 두 합은 ℓ=1.135335, u=2·0.135+4·1=4.270671입니다.",
  },
  {
    label: "기준 3 → 5",
    m: 5,
    cells: ["dropped", "dropped", "sram", "sram"],
    bars: [0.018316, 0.135335, null, null],
    l: "1.135335 × e⁻² = 0.153651",
    u: "4.270671 × e⁻² = 0.577972",
    o: "—",
    note: "둘째 조각에 5가 있어 기준이 5로 올라갑니다. 옛 막대 두 개가 함께 e⁻²배로 줄고, 그래서 ℓ과 u 모두에 e⁻²를 곱합니다. 조각 1의 점수는 이미 버렸습니다.",
  },
  {
    label: "조각 2 더하기",
    m: 5,
    cells: ["dropped", "dropped", "sram", "sram"],
    bars: [0.018316, 0.135335, 0.049787, 1],
    l: "0.153651 + 1.049787 = 1.203438",
    u: "0.577972 + 8.298722 = 8.876695",
    o: "—",
    note: "같은 기준 5에서 새 막대 e⁻³≈0.050과 1을 더합니다. 값 6과 8을 곱한 8.298722가 u에 더해집니다.",
  },
  {
    label: "오답 · u 보정 누락",
    m: 5,
    cells: ["dropped", "dropped", "dropped", "dropped"],
    bars: [0.018316, 0.135335, 0.049787, 1],
    l: "1.203438",
    u: "4.270671 + 8.298722 = 12.569393",
    o: "12.569393 ÷ 1.203438 = 10.444571",
    wrong: true,
    note: "u만 기준 3에 둔 채 더하면 옛 막대를 줄이지 않은 셈입니다. 올바른 분모로 나눠도 10.444571이 나와 틀립니다.",
  },
  {
    label: "출력",
    m: 5,
    cells: ["dropped", "dropped", "dropped", "dropped"],
    bars: [0.018316, 0.135335, 0.049787, 1],
    l: "1.203438",
    u: "8.876695",
    o: "8.876695 ÷ 1.203438 = 7.376113",
    note: "점수 네 칸은 모두 버렸고 남은 것은 m, ℓ, u 세 칸뿐입니다. 마지막에 한 번 나누면 전체를 한꺼번에 계산한 가중평균 7.376113과 같습니다.",
  },
];

const cellClass: Record<Cell, string> = {
  unread: "border-dashed border-border text-muted-foreground",
  sram: "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#bfdbfe]",
  dropped: "border-border bg-muted/40 text-muted-foreground line-through",
};

export default function OnlineSoftmaxTileViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Online softmax"
      title="기준이 바뀌면 옛 막대가 함께 줄어듭니다"
      description="막대 높이는 e^(점수−기준)입니다. 두 칸씩 읽고 버리면서 기준 m과 두 합 ℓ·u만 다음 조각으로 넘깁니다."
      note="점수 [1, 3, 2, 5]와 값 [2, 4, 6, 8]은 본문의 가정이며 표시값은 소수 여섯째 자리에서 반올림했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 조각으로 나눠 읽는 online softmax의 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[11px] font-bold text-[#2563eb]">점선 = 기준 m = {scene.m}에서 높이 1</p>
              {/* 막대: e^(s−m) */}
              <div className="relative grid grid-cols-4 gap-2 border-b border-border" style={{ height: BAR_MAX + 22 }}>
                <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#2563eb]" style={{ bottom: BAR_MAX }} />
                {scene.bars.map((b, i) => (
                  <div key={i} className="flex flex-col items-center justify-end">
                    {b === null ? (
                      <div className="w-8 border border-dashed border-border" style={{ height: 6 }} />
                    ) : (
                      <>
                        <span className="mb-0.5 font-mono text-[10px] text-muted-foreground">{b.toFixed(3)}</span>
                        <motion.div
                          className={`w-8 rounded-t-sm ${i < 2 ? "bg-[#60a5fa]" : "bg-[#2563eb]"}`}
                          initial={false}
                          animate={{ height: Math.max(2, b * BAR_MAX) }}
                          transition={{ duration: reduced ? 0 : 0.6 }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
              {/* 점수와 값 */}
              <div className="mt-1 grid grid-cols-4 gap-2 font-mono text-xs">
                {SCORES.map((s, i) => (
                  <div key={s} className={`rounded-sm border px-1 py-1 text-center ${cellClass[scene.cells[i]]}`}>
                    s={s}
                    <br />v={VALUES[i]}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-muted-foreground">
                <span className="border-t border-foreground/40 pt-0.5">조각 1</span>
                <span className="border-t border-foreground/40 pt-0.5">조각 2</span>
              </div>
            </div>

            {/* 남기는 상태 */}
            <dl className="min-w-0 space-y-2 font-mono text-xs">
              <div className="rounded-sm border border-border px-3 py-2">
                <dt className="text-muted-foreground">기준 m</dt>
                <dd className="text-sm font-bold">{scene.m}</dd>
              </div>
              <div className="rounded-sm border border-border px-3 py-2">
                <dt className="text-muted-foreground">지수합 ℓ</dt>
                <dd className="min-h-[2.5rem] break-words text-sm font-bold sm:min-h-0">{scene.l}</dd>
              </div>
              <div className={`rounded-sm border px-3 py-2 ${scene.wrong ? "border-[#dc2626]" : "border-border"}`}>
                <dt className="text-muted-foreground">가중합 u</dt>
                <dd className={`min-h-[2.5rem] break-words text-sm font-bold sm:min-h-0 ${scene.wrong ? "text-[#dc2626]" : ""}`}>{scene.u}</dd>
              </div>
              <div className={`rounded-sm border px-3 py-2 ${scene.wrong ? "border-[#dc2626]" : "border-[#16a34a]"}`}>
                <dt className="text-muted-foreground">출력 O = u ÷ ℓ</dt>
                <dd className={`min-h-[2.5rem] break-words text-sm font-bold sm:min-h-0 ${scene.wrong ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{scene.o}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
