import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: ModernArticle.tsx #queue-capacity — graph 사례(준비 2 · 제출 1 · 계산 4 μs, 세 회)
 * 한 mechanism: 다음 준비 전에 미완료 회 수를 세어 D개면 가장 이른 완료까지 CPU가 기다린다.
 * D=1 → 완료 7·14·21, 제출 종료 17. D=2 → 6 μs에 미완료 2개라 7까지 대기, 완료 15 그대로, 제출 종료 10.
 */
type Span = readonly [number, number];
interface Plan {
  label: string;
  depth: string;
  prep: readonly Span[];
  submit: readonly Span[];
  gpu: readonly Span[];
  wait: readonly Span[];
  note: string;
}

const T = 22;
const PLANS: readonly Plan[] = [
  {
    label: "제한 없음",
    depth: "D = ∞",
    prep: [[0, 2], [3, 5], [6, 8]],
    submit: [[2, 3], [5, 6], [8, 9]],
    gpu: [[3, 7], [7, 11], [11, 15]],
    wait: [],
    note: "미완료 회 수를 세지 않으면 CPU는 9 μs에 세 번째 제출을 끝내고 GPU는 7·11·15 μs에 끝냅니다. 미완료 줄을 보면 6 μs부터 둘입니다. 이 시점에 다음 준비를 막는 규칙이 없어서 CPU는 바로 세 번째를 준비합니다.",
  },
  {
    label: "D = 1",
    depth: "D = 1",
    prep: [[0, 2], [7, 9], [14, 16]],
    submit: [[2, 3], [9, 10], [16, 17]],
    gpu: [[3, 7], [10, 14], [17, 21]],
    wait: [[3, 7], [10, 14]],
    note: "미완료가 하나만 허용되므로 첫 회가 7 μs에 끝나야 다음 준비를 합니다. 완료는 7·14·21 μs로 매회 기다리던 경우와 같고 제출은 17 μs에 끝납니다.",
  },
  {
    label: "D = 2 · 6 μs의 검사",
    depth: "D = 2",
    prep: [[0, 2], [3, 5], [7, 9]],
    submit: [[2, 3], [5, 6], [9, 10]],
    gpu: [[3, 7], [7, 11], [11, 15]],
    wait: [[6, 7]],
    note: "두 번째 제출이 끝난 6 μs에 미완료 회가 둘이라 한도 2에 걸립니다. CPU는 가장 이른 완료 7 μs까지 1 μs 기다린 뒤 세 번째를 준비합니다.",
  },
  {
    label: "D = 2 · 완료는 15 그대로",
    depth: "D = 2",
    prep: [[0, 2], [3, 5], [7, 9]],
    submit: [[2, 3], [5, 6], [9, 10]],
    gpu: [[3, 7], [7, 11], [11, 15]],
    wait: [[6, 7]],
    note: "세 번째 기록은 10 μs에 도착하지만 GPU는 앞 회가 끝나는 11 μs부터 실행하므로 완료는 15 μs로 제한 없음과 같습니다. 늦어진 것은 CPU 제출 종료 9 → 10 μs뿐입니다.",
  },
];

const RUN = ["#2563eb", "#0d9488", "#d97706"] as const;
const PREP = "#cbd5e1";
const SUBMIT = "#475569";

const inside = (spans: readonly Span[], t: number) => spans.findIndex(([a, b]) => t >= a && t < b);
/** [t, t+1) 동안 제출은 끝났지만 아직 완료되지 않은 회 수. */
const inflight = (p: Plan, t: number) => p.submit.filter(([, s], i) => s <= t && t < p.gpu[i][1]).length;

export default function InflightDepthViz() {
  const scenes = useAnimatedScenes(PLANS.length, 4800);
  const plan = PLANS[scenes.active];
  const reduced = scenes.reducedMotion;
  const focusWait = scenes.active === 2;
  const focusEnd = scenes.active === 3;
  const cols = { gridTemplateColumns: `2.75rem repeat(${T}, minmax(0, 1fr))` };
  const cpuEnd = plan.submit[2][1];
  const gpuEnd = plan.gpu[2][1];

  const cell = "h-6 rounded-[1px]";
  return (
    <VizFrame
      eyebrow="In-flight depth"
      title="미완료 회 수를 D개로 막으면 CPU 제출만 늦고 GPU 완료는 그대로일 수 있습니다"
      description="한 칸이 1 μs입니다. CPU 줄의 회색은 준비, 진회색은 제출, 빨간 테두리 칸은 미완료 회 수 때문에 기다리는 구간이고 GPU 줄의 색이 몇 번째 회인지입니다."
      note="D는 CUDA driver의 queue 크기가 아니라 본문에서 가정한 프로그램의 제한입니다. 시간은 본문 graph 사례의 가정값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="미완료 회 수 제한에 따른 CPU와 GPU 시간표"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{plan.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{plan.depth}</span>
          </div>

          <div key={scenes.active} className="mt-3 space-y-1">
            {/* 시간 눈금 */}
            <div className="grid gap-px" style={cols}>
              <span />
              {Array.from({ length: T }, (_, t) => (
                <span key={t} className="text-center font-mono text-[8px] text-muted-foreground sm:text-[9px]">
                  {t % 3 === 0 ? t : ""}
                </span>
              ))}
            </div>
            {/* CPU */}
            <div className="grid gap-px" style={cols}>
              <span className="text-[11px] font-bold text-foreground">CPU</span>
              {Array.from({ length: T }, (_, t) => {
                const p = inside(plan.prep, t);
                const s = inside(plan.submit, t);
                const w = inside(plan.wait, t);
                const hot = focusWait && w >= 0;
                return (
                  <motion.span
                    key={t}
                    className={`${cell} border`}
                    style={{
                      borderColor: w >= 0 ? "#dc2626" : p >= 0 || s >= 0 ? (s >= 0 ? SUBMIT : "#94a3b8") : "transparent",
                      backgroundColor: s >= 0 ? SUBMIT : p >= 0 ? PREP : w >= 0 ? "#fee2e2" : undefined,
                                          }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hot ? [1, 0.4, 1] : 1 }}
                    transition={{ duration: reduced ? 0 : hot ? 1.2 : 0.15, delay: reduced ? 0 : t * 0.03, repeat: hot && !reduced ? Infinity : 0 }}
                  />
                );
              })}
            </div>
            {/* GPU */}
            <div className="grid gap-px" style={cols}>
              <span className="text-[11px] font-bold text-foreground">GPU</span>
              {Array.from({ length: T }, (_, t) => {
                const r = inside(plan.gpu, t);
                return (
                  <motion.span
                    key={t}
                    className={`${cell} flex items-center justify-center border font-mono text-[8px] font-bold text-white sm:text-[9px]`}
                    style={{ borderColor: r >= 0 ? RUN[r] : "#e2e8f0", backgroundColor: r >= 0 ? RUN[r] : undefined, borderStyle: r >= 0 ? "solid" : "dashed" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : 0.15, delay: reduced ? 0 : t * 0.03 }}
                  >
                    {r >= 0 && plan.gpu[r][0] === t ? r + 1 : ""}
                  </motion.span>
                );
              })}
            </div>
            {/* 미완료 회 수 */}
            <div className="grid gap-px" style={cols}>
              <span className="text-[10px] font-bold leading-6 text-muted-foreground">미완료</span>
              {Array.from({ length: T }, (_, t) => {
                const n = inflight(plan, t);
                const full = plan.depth !== "D = ∞" && n >= Number(plan.depth.slice(-1)) && inside(plan.wait, t) >= 0;
                return (
                  <span
                    key={t}
                    className={`${cell} flex items-center justify-center font-mono text-[8px] font-bold sm:text-[10px]`}
                    style={{ color: full ? "#dc2626" : n ? "#334155" : "#cbd5e1", backgroundColor: full && focusWait ? "#fee2e2" : undefined }}
                  >
                    {n}
                  </span>
                );
              })}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">CPU 제출 종료</dt>
              <dd className="font-bold text-foreground">{cpuEnd} μs</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GPU 완료</dt>
              <dd className={`font-bold ${focusEnd ? "text-[#2563eb]" : "text-foreground"}`}>{plan.gpu.map(([, e]) => e).join("·")} μs</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">CPU 대기</dt>
              <dd className="font-bold text-[#dc2626]">{plan.wait.reduce((a, [s, e]) => a + e - s, 0)} μs</dd>
            </div>
          </dl>
          <span className="sr-only">마지막 GPU 완료 {gpuEnd} μs</span>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {plan.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={PLANS.map((p) => p.label)} />
      </div>
    </VizFrame>
  );
}
