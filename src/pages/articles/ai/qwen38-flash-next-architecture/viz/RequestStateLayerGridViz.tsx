import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: RequestState.tsx — 요청 하나의 상태 중 무엇이 token을 따라 자라고 무엇이 고정인가.
 * 행 = 4층 묶음 12개(선형 3 + 희소 1, LayerScheduleViz와 같은 배열).
 * 선형 칸 = 층마다 고정 3 MiB(48 head × 128 × 128 × FP32). 희소 띠의 열 하나 = 32,768 token.
 * 희소 층 하나·열 하나의 K/V = 32,768 × 2,048 B = 64 MiB, indexer = 32,768 × 256 B = 8 MiB.
 */
const LINEAR = "#6366f1";
const KV = "#f59e0b";
const IDX = "#0ea5e9";
const GROUPS = Array.from({ length: 12 }, (_, g) => g);
const COLUMNS = 8;

interface Scene {
  label: string;
  fill: number; // 채운 열 수(1/8 = 4K)
  mode: "grow" | "token" | "compare" | "short";
  stats: { kv: string; idx: string; lin: string; total: string };
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "4K token",
    fill: 1 / 8,
    mode: "grow",
    stats: { kv: "96 MiB", idx: "12 MiB", lin: "108 MiB", total: "216 MiB" },
    note: "선형 36층의 상태 108 MiB는 처음부터 다 켜집니다. 희소 12층에는 첫 열의 1/8만 찹니다.",
  },
  {
    label: "32K token",
    fill: 1,
    mode: "grow",
    stats: { kv: "768 MiB", idx: "96 MiB", lin: "108 MiB", total: "972 MiB" },
    note: "희소 12층에 한 열(32,768 token)이 찼습니다. 선형 칸은 4K일 때와 똑같습니다.",
  },
  {
    label: "262K token",
    fill: 8,
    mode: "grow",
    stats: { kv: "6 GiB", idx: "0.75 GiB", lin: "108 MiB", total: "약 6.9 GiB" },
    note: "여덟 열이 모두 찼습니다. 자라는 것은 희소 층의 K/V와 indexer뿐이고, 선형 상태는 여전히 108 MiB입니다.",
  },
  {
    label: "token 하나의 몫",
    fill: 8,
    mode: "token",
    stats: { kv: "24,576 B", idx: "3,072 B", lin: "0 B", total: "27 KiB / token" },
    note: "token 하나는 희소 12층마다 K·V 2종 × KV head 2 × 256값 × 2 B를 남깁니다. 12층 × 2,048 B = 24,576 B입니다. indexer는 12층 × 128값 × 2 B = 3,072 B입니다.",
  },
  {
    label: "Qwen3.6과 비교",
    fill: 8,
    mode: "compare",
    stats: { kv: "6 vs 16 GiB", idx: "0.75 vs 0", lin: "108 vs 144 MiB", total: "6.9 vs 16.1 GiB" },
    note: "같은 262K에서 Qwen3.6-27B는 token당 64 KiB라 K/V가 16 GiB입니다. 희소 층이 12개로 줄고 KV head가 2개라 Flash-Next는 절반 아래입니다.",
  },
  {
    label: "짧은 상태",
    fill: 8,
    mode: "short",
    stats: { kv: "6 GiB", idx: "0.75 GiB", lin: "108 MiB", total: "+ 수백 KiB" },
    note: "2번 층의 확장 convolution은 9 token, n-gram 조회는 직전 2개 token id를 기억합니다. 크기는 작지만 요청을 다른 장비로 옮길 때 같이 옮겨야 합니다.",
  },
];

function SparseStrip({ fill, token, reduced }: { fill: number; token: boolean; reduced: boolean }) {
  return (
    <div className="relative grid grid-cols-8 gap-[2px]">
      {Array.from({ length: COLUMNS }, (_, c) => {
        const frac = Math.max(0, Math.min(1, fill - c));
        return (
          <div key={c} className="flex flex-col gap-[1px]">
            <div className="h-[10px] overflow-hidden rounded-[2px] border border-[#f59e0b]/40">
              <motion.div className="h-full" style={{ backgroundColor: KV }} initial={false} animate={{ width: `${frac * 100}%` }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : c * 0.08 }} />
            </div>
            <div className="h-[3px] overflow-hidden rounded-[1px] bg-[#0ea5e9]/15">
              <motion.div className="h-full" style={{ backgroundColor: IDX }} initial={false} animate={{ width: `${frac * 100}%` }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : c * 0.08 }} />
            </div>
          </div>
        );
      })}
      {token ? <span className="pointer-events-none absolute inset-y-0 left-[37%] w-[3px] rounded-sm bg-[#0f172a]" aria-hidden /> : null}
    </div>
  );
}

function CompareRuler() {
  const row = (label: string, kv: number, extra: number, extraColor: string) => (
    <div className="flex items-center gap-2">
      <span className="w-[5.5rem] shrink-0 text-[11px] font-bold">{label}</span>
      <div className="grid flex-1 gap-[2px]" style={{ gridTemplateColumns: "repeat(17, minmax(0, 1fr))" }}>
        {Array.from({ length: 17 }, (_, i) => {
          const isKv = i < kv;
          const isExtra = !isKv && i < kv + extra;
          return <span key={i} className="h-4 rounded-[2px] border border-border" style={{ backgroundColor: isKv ? KV : isExtra ? extraColor : "transparent" }} />;
        })}
      </div>
    </div>
  );
  return (
    <div className="space-y-2 rounded-md border border-border p-3" aria-label="1 GiB 눈금 비교">
      <p className="text-[11px] text-muted-foreground">한 칸 = 1 GiB · 262K token 요청 하나</p>
      {row("Flash-Next", 6, 1, IDX)}
      {row("Qwen3.6-27B", 16, 0, IDX)}
      <p className="text-[11px] text-muted-foreground">Flash-Next의 하늘색 1칸은 indexer 0.75 GiB입니다. 선형 상태 108·144 MiB는 1칸 아래라 그리지 않았습니다.</p>
    </div>
  );
}

export default function RequestStateLayerGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Request state"
      title="요청이 길어질 때 자라는 칸은 희소 12층뿐입니다"
      description="행은 4층 묶음 12개입니다. 보라 칸 세 개는 선형 층의 고정 상태, 오른쪽 띠는 희소 층의 K/V(주황)와 indexer(하늘)입니다. 띠의 한 열은 32,768 token입니다."
      note="BF16 K/V·indexer와 FP32 선형 상태의 논리 크기입니다. 블록 할당·병렬 분할·실행 버퍼는 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Qwen3.8-Flash-Next 요청 상태가 층별로 자라는 모습"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="mb-1 grid grid-cols-[3.4rem_auto_minmax(0,1fr)] items-end gap-2 text-[10px] text-muted-foreground">
                <span>층</span>
                <span>선형 ×3</span>
                <span>희소 1 · 0 → 262K token</span>
              </div>
              <div className="space-y-[3px]">
                {GROUPS.map((g) => (
                  <div key={g} className="grid grid-cols-[3.4rem_auto_minmax(0,1fr)] items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{g * 4 + 1}–{g * 4 + 4}</span>
                    <div className="flex gap-[2px]">
                      {[0, 1, 2].map((k) => {
                        const isLayer2 = g === 0 && k === 1;
                        return (
                          <span key={k} className="relative h-[14px] w-[14px] rounded-[2px]" style={{ backgroundColor: LINEAR }}>
                            {scene.mode === "short" && isLayer2 ? (
                              <motion.span
                                aria-hidden
                                className="absolute -inset-[3px] rounded-[3px] border-[1.25px] border-[#dc2626]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: reduced ? 1 : [0, 1, 0.3, 1] }}
                                transition={{ duration: 1.4 }}
                              />
                            ) : null}
                          </span>
                        );
                      })}
                    </div>
                    <SparseStrip fill={scene.fill} token={scene.mode === "token"} reduced={reduced} />
                  </div>
                ))}
              </div>
            </div>
            <div className="min-h-[15.5rem] min-w-0 space-y-3 lg:min-h-0">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                <div>
                  <dt className="text-muted-foreground">희소 K/V</dt>
                  <dd className="font-bold text-[#b45309]">{scene.stats.kv}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">indexer</dt>
                  <dd className="font-bold text-[#0369a1]">{scene.stats.idx}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">선형 고정</dt>
                  <dd className="font-bold text-[#4f46e5]">{scene.stats.lin}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">합계</dt>
                  <dd className="font-bold text-foreground">{scene.stats.total}</dd>
                </div>
              </dl>
              {scene.mode === "compare" ? <CompareRuler /> : null}
              {scene.mode === "token" ? (
                <p className="rounded-md border border-border p-3 font-mono text-[11px] leading-6">
                  12 × 2 × 2 × 256 × 2 B = 24,576 B
                  <br />
                  12 × 128 × 2 B = 3,072 B
                </p>
              ) : null}
            </div>
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
