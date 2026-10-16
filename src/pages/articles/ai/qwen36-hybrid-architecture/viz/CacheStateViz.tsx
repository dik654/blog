import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 칸 = 4,096 token의 attention KV = 4,096 × 64 KiB = 256 MiB(0.25 GiB).
 * 한 mechanism: context가 4K → 262K로 64배 늘면 KV 칸은 1 → 64칸으로 늘지만,
 * 48 DeltaNet 층의 core state 144 MiB는 같은 눈금에서 늘 0.5625칸(144 / 256)이다.
 */
const CELL_MIB = 256;
const DELTA_MIB = 144;
const GRID = 64;

interface Scene {
  label: string;
  tokens: string;
  cells: number;
  kv: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "4K", tokens: "4,096", cells: 1, kv: "0.25 GiB", note: "4,096 token이면 KV는 한 칸(256 MiB)입니다. 이 길이에서는 DeltaNet state 144 MiB가 KV 한 칸의 절반을 넘습니다." },
  { label: "32K", tokens: "32,768", cells: 8, kv: "2 GiB", note: "token이 여덟 배가 되면 KV 칸도 정확히 여덟 칸입니다. DeltaNet 쪽은 같은 0.56칸 그대로입니다." },
  { label: "128K", tokens: "131,072", cells: 32, kv: "8 GiB", note: "131,072 token에서 KV는 32칸, 8 GiB입니다. 16개 attention 층이 token마다 64 KiB를 계속 쌓기 때문입니다." },
  { label: "262K", tokens: "262,144", cells: 64, kv: "16 GiB", note: "4K의 64배 길이에서 KV는 64칸, 16 GiB가 됩니다. 48개 DeltaNet 층의 state는 처음과 같은 144 MiB라 칸 하나도 채우지 못합니다." },
];

export default function CacheStateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const deltaFraction = DELTA_MIB / CELL_MIB;

  return (
    <VizFrame
      eyebrow="Memory growth"
      title="Context가 64배 길어져도 DeltaNet matrix는 같은 크기다"
      description="두 격자는 같은 눈금입니다. 한 칸이 256 MiB(4,096 token의 KV)이고, BF16·batch 1·unsharded logical KV 기준입니다."
      note="실제 GPU 할당에는 convolution state, block padding, prefix cache, tensor parallel, CUDA graph와 workspace가 더해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="context 길이별 attention KV 칸과 DeltaNet state 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">T = {scene.tokens} token</h4>
            <span className="font-mono text-sm font-bold text-[#b45309]">KV {scene.cells}칸 = {scene.kv}</span>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="min-w-0">
              <p className="text-[11px] font-bold text-[#b45309]">16 attention 층 · token 기록을 K/V로 보존</p>
              <div className="mt-2 grid grid-cols-8 gap-1" role="img" aria-label={`KV ${scene.cells}칸`}>
                {Array.from({ length: GRID }, (_, i) => (
                  <motion.span
                    key={i}
                    className="h-5 rounded-[2px] border"
                    initial={false}
                    animate={{
                      backgroundColor: i < scene.cells ? "#fcd34d" : "rgba(0,0,0,0)",
                      borderColor: i < scene.cells ? "#d97706" : "#cbd5e1",
                    }}
                    transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : Math.min(i, 40) * 0.015 }}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">token마다 64 KiB · 4,096 token = 1칸</p>
            </section>

            <section className="min-w-0">
              <p className="text-[11px] font-bold text-[#0369a1]">48 DeltaNet 층 · 고정 matrix state</p>
              <div className="mt-2 grid grid-cols-8 gap-1" role="img" aria-label="DeltaNet state 0.56칸">
                {Array.from({ length: GRID }, (_, i) => (
                  <span key={i} className="relative h-5 overflow-hidden rounded-[2px] border border-[#cbd5e1]">
                    {i === 0 ? <span className="absolute inset-y-0 left-0 bg-[#7dd3fc]" style={{ width: `${deltaFraction * 100}%` }} /> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">144 MiB = 0.56칸 · T와 무관</p>
            </section>
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
