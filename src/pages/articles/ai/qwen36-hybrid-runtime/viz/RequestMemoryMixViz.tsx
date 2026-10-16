import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 KV 총량 8 GiB를 request 1개·4개·32개로 나눠 담을 때 request별 고정 state가 얼마나 붙는지 센다.
 * 눈금: 한 칸 = 256 MiB = 4,096 token의 KV(token당 64 KiB). Delta core state 144 MiB = 0.5625칸.
 * 한 mechanism: Σ M_KV(T_r)는 32칸으로 같고, Σ M_Δ만 request 수에 비례해 1·4·32조각이 된다.
 */
const KV_CELLS = 32;
const DELTA_MIB = 144;
const CELL_MIB = 256;
const COLS = 16;

interface Scene {
  label: string;
  requests: number;
  context: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "128K × 1",
    requests: 1,
    context: "131,072",
    note: "128K request 하나는 KV 32칸(8 GiB)에 Delta state 한 조각(144 MiB)을 더합니다. 이 조합에서는 KV가 거의 전부입니다.",
  },
  {
    label: "32K × 4",
    requests: 4,
    context: "32,768",
    note: "32K request 네 개도 KV는 8칸씩 모두 32칸으로 같습니다. 그런데 Delta state는 request마다 따로 있어 네 조각, 576 MiB가 됩니다.",
  },
  {
    label: "4K × 32",
    requests: 32,
    context: "4,096",
    note: "같은 32칸을 4K request 32개로 나누면 Delta state가 32조각, 4.5 GiB로 KV의 절반을 넘습니다. 짧은 request를 많이 받을수록 고정 state가 admission을 좌우합니다.",
  },
];

const KV_SHADES = ["#fcd34d", "#f59e0b"] as const;
const gib = (mib: number) => (mib / 1024).toFixed(mib % 1024 === 0 ? 0 : 2);

export default function RequestMemoryMixViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const perRequest = KV_CELLS / scene.requests;
  const deltaMib = DELTA_MIB * scene.requests;
  const totalMib = KV_CELLS * CELL_MIB + deltaMib;

  return (
    <VizFrame
      eyebrow="Per-request state"
      title="KV 총량이 같아도 request 수만큼 Delta state가 따로 붙습니다"
      description="한 칸은 256 MiB, 즉 4,096 token의 KV입니다. 노란 칸은 길이에 비례하는 KV이고 색이 바뀌는 곳이 request 경계입니다. 하늘색 조각 하나가 request 하나의 Delta core state 144 MiB입니다."
      note="token당 64 KiB와 144 MiB는 Qwen3.6 구조 글의 BF16 KV·FP32 core state 계산입니다. convolution state, block padding, weight와 workspace는 뺐습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="request 수에 따른 KV 칸과 Delta state 조각"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base font-bold">
              {scene.context} token request {scene.requests}개
            </h4>
            <span className="font-mono text-sm font-bold text-foreground">합 {gib(totalMib)} GiB</span>
          </div>

          <p className="mt-4 text-[11px] font-bold text-[#b45309]">Σ M_KV · 32칸 = 8 GiB · request당 {perRequest}칸</p>
          <div className="mt-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} role="img" aria-label={`KV 32칸을 request ${scene.requests}개가 나눔`}>
            {Array.from({ length: KV_CELLS }, (_, i) => {
              const owner = Math.floor(i / perRequest);
              return (
                <motion.span
                  key={i}
                  className="h-5 rounded-[2px] border border-[#d97706]"
                  initial={false}
                  animate={{ backgroundColor: KV_SHADES[owner % 2] }}
                  transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.012 }}
                />
              );
            })}
          </div>

          <p className="mt-4 text-[11px] font-bold text-[#0369a1]">
            Σ M_Δ · 조각 {scene.requests}개 × 0.56칸 = {deltaMib.toLocaleString()} MiB
          </p>
          {/* 32조각 = 18칸이라 두 줄을 늘 비워 둬 장면이 바뀌어도 높이가 같다. */}
          <div className="mt-1 h-[2.75rem]">
            <div className="flex flex-wrap gap-y-1">
              {Array.from({ length: scene.requests }, (_, i) => (
                <motion.span
                  key={`${scenes.active}-${i}`}
                  className="h-5 shrink-0 border border-[#0284c7] bg-[#7dd3fc]"
                  style={{ width: `calc((100% - ${(COLS - 1) * 4}px) / ${COLS} * ${DELTA_MIB / CELL_MIB})` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : 0.5 + i * 0.03 }}
                />
              ))}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">KV</dt>
              <dd className="font-bold text-[#b45309]">8 GiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Delta</dt>
              <dd className="font-bold text-[#0369a1]">{gib(deltaMib)} GiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Delta ÷ KV</dt>
              <dd className="font-bold">{((deltaMib / (KV_CELLS * CELL_MIB)) * 100).toFixed(1)}%</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
