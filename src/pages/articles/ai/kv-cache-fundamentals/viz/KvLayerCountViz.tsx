import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 띠의 칸 하나 = 층 하나. 두 모델을 64칸 같은 척도에 놓고 KV를 남기는 층만 곱셈에 넣는다.
 * 한 mechanism: 어느 층을 세는지 정한 뒤 head·값·K·V·byte를 차례로 곱해 token당 byte를 얻는다.
 */
const FULL = "#0891b2";
const WINDOW = "#d97706";
const MAX_LAYERS = 64;

type Model = "qwen" | "muse";

interface Scene {
  label: string;
  model: Model | "both";
  lit: number;
  result: string;
  note: string;
}

const FACTORS: Record<Model, readonly { value: number; unit: string }[]> = {
  qwen: [
    { value: 16, unit: "층" },
    { value: 4, unit: "KV head" },
    { value: 256, unit: "값" },
    { value: 2, unit: "K·V" },
    { value: 2, unit: "byte" },
  ],
  muse: [
    { value: 52, unit: "층" },
    { value: 2, unit: "KV head" },
    { value: 128, unit: "값" },
    { value: 2, unit: "K·V" },
    { value: 2, unit: "byte" },
  ],
};

const SCENES: readonly Scene[] = [
  { label: "Qwen · 곱할 층 고르기", model: "qwen", lit: 1, result: "16층", note: "64칸 중 채운 16칸만 위치마다 K와 V를 쌓습니다. 빈 칸 48층은 이 곱셈에서 뺍니다." },
  { label: "Qwen · token당 64KiB", model: "qwen", lit: 5, result: "65,536byte = 64KiB", note: "16층에서 시작해 한 항씩 곱합니다. 칸 아래 숫자가 거기까지 곱한 값입니다." },
  { label: "Muse · 52층 모두 곱하기", model: "muse", lit: 1, result: "52층", note: "13층은 전체 문맥을, 39층은 길이 2048의 window를 봅니다. 둘 다 K와 V를 남기고 한 층의 모양도 같아 함께 셉니다." },
  { label: "Muse · token당 52KiB", model: "muse", lit: 5, result: "53,248byte = 52KiB", note: "모든 위치를 남긴다고 근사한 값입니다. 층은 Qwen보다 많지만 한 층의 head와 값 수가 적습니다." },
  { label: "비교 · 81.25%", model: "both", lit: 0, result: "52 ÷ 64 = 81.25%", note: "막대는 같은 척도입니다. Qwen 쪽에는 빈 칸 48층의 상태가 빠져 있으므로 attention 몫끼리의 비교입니다." },
];

function Strip({ name, cells, active }: { name: string; cells: readonly ("full" | "window" | "off")[]; active: boolean }) {
  return (
    <div className={`transition-opacity ${active ? "opacity-100" : "opacity-35"}`}>
      <p className="mb-1 text-xs font-bold text-foreground">
        {name} <span className="font-normal text-muted-foreground">{cells.length}층</span>
      </p>
      <div className="grid h-5 gap-px" style={{ gridTemplateColumns: `repeat(${MAX_LAYERS}, minmax(0, 1fr))` }}>
        {cells.map((kind, index) => (
          <span
            key={index}
            className="border"
            style={{
              borderColor: kind === "full" ? FULL : kind === "window" ? WINDOW : "#94a3b8",
              backgroundColor: kind === "full" ? FULL : kind === "window" ? WINDOW : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const repeat = (kind: "full" | "window" | "off", count: number) => Array.from({ length: count }, () => kind);
const QWEN_CELLS = [...repeat("full", 16), ...repeat("off", 48)];
const MUSE_CELLS = [...repeat("full", 13), ...repeat("window", 39)];

function Rail({ model, lit, reduced }: { model: Model; lit: number; reduced: boolean }) {
  return (
    <ol className="grid grid-cols-5 gap-1.5">
      {FACTORS[model].map((factor, index) => {
        const running = FACTORS[model].slice(0, index + 1).reduce((product, item) => product * item.value, 1);
        const on = index < lit;
        return (
          <motion.li
            key={factor.unit}
            className="min-w-0 rounded-sm border border-border px-1 py-2 text-center"
            initial={false}
            animate={{ opacity: on ? 1 : 0.25 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : index * 0.1 }}
          >
            <span className="block font-mono text-sm font-bold text-foreground">
              {index > 0 ? "×" : ""}
              {factor.value}
            </span>
            <span className="block text-[11px] leading-4 text-muted-foreground">{factor.unit}</span>
            <span className="mt-1 block border-t border-border pt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              {running.toLocaleString("en-US")}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

function Bars({ reduced }: { reduced: boolean }) {
  const rows = [
    { name: "Qwen attention 몫", value: 64 },
    { name: "Muse, 모든 위치 보존 근사", value: 52 },
  ];
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.name}>
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{row.name}</span>
            <span className="font-mono font-bold text-foreground">{row.value}KiB</span>
          </div>
          <motion.div
            className="mt-1 h-4 rounded-sm bg-primary/70"
            initial={{ width: 0 }}
            animate={{ width: `${(row.value / 64) * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.45 }}
          />
        </div>
      ))}
    </div>
  );
}

export default function KvLayerCountViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="KV를 남기는 층 세기"
      title="같은 곱셈이어도 무엇을 층으로 세느냐에서 답이 갈립니다"
      description="칸 하나가 층 하나이고 두 띠는 같은 척도입니다. 위에서 층을 고른 뒤 아래에서 token 하나의 byte까지 곱합니다."
      note="고정 config의 층 종류·KV head·폭에 BF16 원소 2byte를 가정한 논리 용량입니다. 칸은 종류별로 모았으며 실제 층 배치 순서가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="모델별로 KV를 남기는 층과 token당 byte"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.result}</span>
          </div>
          <div className="mt-3 space-y-3">
            <Strip name="Qwen3.6-27B" cells={QWEN_CELLS} active={scene.model !== "muse"} />
            <Strip name="Muse Glimmer" cells={MUSE_CELLS} active={scene.model !== "qwen"} />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 border" style={{ backgroundColor: FULL, borderColor: FULL }} />전체 문맥</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 border" style={{ backgroundColor: WINDOW, borderColor: WINDOW }} />window 2048</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 border border-slate-400" />linear, 곱셈 제외</span>
            </div>
          </div>
          <div className="mt-4 h-[6.5rem]">
            {scene.model === "both" ? <Bars reduced={reduced} /> : <Rail model={scene.model} lit={scene.lit} reduced={reduced} />}
          </div>
          <p className="mt-2 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
