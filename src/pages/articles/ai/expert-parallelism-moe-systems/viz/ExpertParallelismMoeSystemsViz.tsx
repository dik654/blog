import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: token 37의 입력 복사본이 expert 13·42가 있는 GPU 1·5로 갔다가 결과로 돌아와야
 * GPU 0에서 결합이 끝난다. 같은 경로를 2048 token으로 늘리면 GPU마다 4096개를 받고,
 * 한 GPU가 1.75배를 받으면 그 GPU의 계산이 layer 전체의 끝을 정한다.
 * 숫자는 본문 사례(8 GPU · 64 expert · hidden 4096 FP16 · top-2)를 그대로 쓴다.
 */
const GPUS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const PICKED = { 13: 0.25, 42: 0.75 } as const;
const HOT_GPU = 5;

type Phase = "route" | "dispatch" | "compute" | "combine" | "scale" | "hot";

interface Scene {
  label: string;
  phase: Phase;
  counter: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "Router · e13, e42",
    phase: "route",
    counter: "이동 0 KiB",
    note: "GPU g에는 expert 8g~8g+7이 있습니다. token 37이 고른 13과 42를 8로 나눈 몫이 목적 GPU라서 13은 GPU 1, 42는 GPU 5입니다.",
  },
  {
    label: "Dispatch · 8 KiB × 2",
    phase: "dispatch",
    counter: "이동 16 KiB",
    note: "같은 입력 x(4096개 × 2 B = 8 KiB)를 목적지마다 한 벌씩 보냅니다. 목적지가 둘이므로 한 번 보내는 것으로 끝나지 않습니다.",
  },
  {
    label: "각 GPU에서 expert 계산",
    phase: "compute",
    counter: "이동 16 KiB",
    note: "GPU 1은 expert 13, GPU 5는 expert 42의 가중치로만 계산합니다. 같은 GPU의 다른 expert 일곱 개는 이 token에 쓰이지 않습니다.",
  },
  {
    label: "Combine · 결과 2개 회수",
    phase: "combine",
    counter: "이동 32 KiB",
    note: "결과 y₁₃과 y₄₂가 8 KiB씩 GPU 0으로 돌아옵니다. 두 번째가 도착할 때까지 결합 칸은 기다리고, 둘이 모이면 0.25·y₁₃ + 0.75·y₄₂를 계산합니다.",
  },
  {
    label: "2048 token · 균등 배정",
    phase: "scale",
    counter: "왕복 64 MiB · remote 56 MiB",
    note: "GPU마다 2048 token × top-2 = 4096개 입력이 고르게 퍼지면 8개 GPU가 4096개씩 받고 같은 1.847 ms에 계산을 마칩니다. 1/8은 자기 GPU라 remote 왕복은 56 MiB입니다.",
  },
  {
    label: "Hot expert · 1.75배",
    phase: "hot",
    counter: "왕복 바이트는 그대로",
    note: "GPU 5가 1.75배인 7168개를 받으면 그 계산만 3.232 ms로 늘어납니다. 나머지 일곱 GPU는 1.847 ms에 끝나도 combine에서 GPU 5를 기다립니다.",
  },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export default function ExpertParallelismMoeSystemsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const d = (s: number) => (reduced ? 0 : s);
  const tokenView = scenes.active <= 3;
  const target = (g: number) => g === 1 || g === 5;

  return (
    <VizFrame
      eyebrow="Dispatch · compute · combine"
      title="token 37의 입력은 두 GPU로 나갔다가 결과로 돌아와야 합쳐집니다"
      description="상자 하나가 GPU 하나이고 안의 작은 칸 8개가 그 GPU의 expert입니다. 위 네 장면은 token 37 하나의 왕복, 아래 두 장면은 같은 경로를 2048 token으로 늘린 경우입니다."
      note="hidden 4096 · FP16 · top-2 · GPU 8개에 expert 8개씩은 본문 가정입니다. 시간은 가정한 유효 600 TFLOP/s로 계산한 값이며 header·metadata는 뺐습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="token 37의 dispatch, expert 계산, combine과 2048 token 확장"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.4rem] flex-wrap items-baseline justify-between gap-x-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs font-bold text-[#2563eb]">{scene.counter}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GPUS.map((g) => {
              const isTarget = tokenView && target(g);
              const hot = scene.phase === "hot" && g === HOT_GPU;
              const received = scene.phase === "hot" && g === HOT_GPU ? 7168 : 4096;
              const ms = received === 7168 ? 3.232 : 1.847;
              return (
                <div
                  key={g}
                  className={`min-w-0 rounded-md border p-2 ${hot ? "border-[#d97706]" : isTarget ? "border-[#2563eb]" : "border-border"}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>GPU {g}</span>
                    <span className="font-mono font-normal text-muted-foreground">
                      e{8 * g}–{8 * g + 7}
                    </span>
                  </div>
                  {/* expert 8칸 */}
                  <div className="mt-1.5 grid grid-cols-8 gap-0.5">
                    {Array.from({ length: 8 }, (_, k) => {
                      const e = 8 * g + k;
                      const picked = tokenView && e in PICKED;
                      const computing = picked && (scene.phase === "compute" || scene.phase === "combine");
                      return (
                        <span
                          key={e}
                          title={`expert ${e}`}
                          className={`h-3 rounded-[2px] border ${
                            computing
                              ? "border-[#2563eb] bg-[#2563eb]"
                              : picked
                                ? "border-[#d97706] bg-[#fde68a]"
                                : "border-border bg-muted/40"
                          }`}
                        />
                      );
                    })}
                  </div>
                  {/* 상자 아래 상태 줄: 높이 고정 */}
                  <div className="mt-1.5 flex h-6 items-center gap-1 font-mono text-[10px]">
                    {tokenView ? (
                      <TokenLine g={g} phase={scene.phase} d={d} />
                    ) : (
                      <div className="flex w-full items-center gap-1">
                        <div className="relative h-2.5 flex-1 rounded-sm bg-muted/50">
                          <motion.div
                            className={`absolute inset-y-0 left-0 rounded-sm ${hot ? "bg-[#d97706]" : "bg-[#2563eb]"}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${(ms / 3.232) * 100}%` }}
                            transition={{ duration: d(1.6), ease: "linear" }}
                          />
                          {scene.phase === "hot" && !hot ? (
                            <motion.div
                              className="absolute inset-y-0 rounded-sm border border-dashed border-[#d97706]"
                              style={{ left: `${(1.847 / 3.232) * 100}%`, right: 0 }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: d(1.6), duration: d(0.3) }}
                            />
                          ) : null}
                        </div>
                        <span className={`w-[4.2rem] shrink-0 text-right ${hot ? "font-bold text-[#b45309]" : "text-muted-foreground"}`}>
                          {fmt(received)} · {ms}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">입력 한 벌</dt>
              <dd className="font-bold text-foreground">4096 × 2 B = 8 KiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">token 37 왕복</dt>
              <dd className="font-bold text-foreground">2 목적지 × 2 방향 = 32 KiB</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GPU당 입력(균등)</dt>
              <dd className="font-bold text-foreground">2048 × 2 = 4,096</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">layer 완료(가장 늦은 GPU)</dt>
              <dd className="font-bold text-[#b45309]">{scene.phase === "hot" ? "3.232 ms" : scene.phase === "scale" ? "1.847 ms" : "결과 2개 도착 뒤"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>: {item.note}
            </li>
          ))}
        </ol>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}

/** token 37 장면에서 GPU 상자 아래에 놓이는 칩: 원본 x, 도착한 복사본, 계산 결과, 결합 칸. */
function TokenLine({ g, phase, d }: { g: number; phase: Phase; d: (s: number) => number }) {
  const chip = "rounded-sm border px-1 leading-4";
  if (g === 0) {
    const sent = phase !== "route";
    return (
      <>
        <span className={`${chip} ${sent ? "border-border text-muted-foreground" : "border-[#2563eb] text-[#2563eb]"}`}>x₃₇</span>
        {phase === "combine" ? (
          <>
            <motion.span className={`${chip} border-[#2563eb] text-[#2563eb]`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(0.4), duration: d(0.3) }}>
              y₁₃
            </motion.span>
            <motion.span className={`${chip} border-[#2563eb] text-[#2563eb]`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(1.4), duration: d(0.3) }}>
              y₄₂
            </motion.span>
            <motion.span
              className={`${chip} border-[#16a34a] text-[#166534] dark:text-[#bbf7d0]`}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              transition={{ delay: d(1.9), duration: d(0.3) }}
            >
              합
            </motion.span>
          </>
        ) : null}
      </>
    );
  }
  if (g !== 1 && g !== 5) return null;
  if (phase === "route") return <span className="text-[#b45309]">{g === 1 ? "13 ÷ 8 → 1" : "42 ÷ 8 → 5"}</span>;
  if (phase === "dispatch")
    return (
      <motion.span className={`${chip} border-[#d97706] text-[#b45309]`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d(g === 1 ? 0.3 : 0.7), duration: d(0.4) }}>
        x₃₇ 8 KiB 도착
      </motion.span>
    );
  if (phase === "compute") return <span className={`${chip} border-[#2563eb] text-[#2563eb]`}>{g === 1 ? "y₁₃ 계산" : "y₄₂ 계산"}</span>;
  return <span className="text-muted-foreground">{g === 1 ? "y₁₃ → GPU 0" : "y₄₂ → GPU 0"}</span>;
}
