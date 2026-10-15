import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 3절의 A(입력 6·출력 3), B(2·2), C(3·1)를 token 예산 4칸·요청 자리 2칸에 실행마다 배정한다.
 * 한 mechanism: 실행마다 예산 칸과 요청 자리가 동시에 허락해야 들어가고, B가 끝나 비운 자리에 C가 들어온다.
 */
type Req = "A" | "B" | "C";
type Slot = { req: Req; phase: "p" | "d" } | null;

const COLOR: Record<Req, string> = { A: "#2563eb", B: "#d97706", C: "#16a34a" };
const NEED: Record<Req, { input: number; output: number }> = {
  A: { input: 6, output: 3 },
  B: { input: 2, output: 2 },
  C: { input: 3, output: 1 },
};

const p = (req: Req): Slot => ({ req, phase: "p" });
const d = (req: Req): Slot => ({ req, phase: "d" });

/** 실행 1~4의 예산 칸 배정. 본문 7절과 같은 순서입니다. */
const RUNS: readonly Slot[][] = [
  [p("A"), p("A"), p("A"), p("A")],
  [p("A"), p("A"), p("B"), p("B")],
  [d("A"), d("B"), null, null],
  [d("A"), p("C"), p("C"), p("C")],
];
const SEATS: readonly Req[][] = [["A"], ["A", "B"], ["A", "B"], ["A", "C"]];

interface Progress {
  input: number;
  output: number;
}
/** 실행 n이 끝난 뒤 요청별 진행(읽은 입력·얻은 출력). */
const AFTER: readonly Record<Req, Progress>[] = [
  { A: { input: 4, output: 0 }, B: { input: 0, output: 0 }, C: { input: 0, output: 0 } },
  { A: { input: 6, output: 1 }, B: { input: 2, output: 1 }, C: { input: 0, output: 0 } },
  { A: { input: 6, output: 2 }, B: { input: 2, output: 2 }, C: { input: 0, output: 0 } },
  { A: { input: 6, output: 3 }, B: { input: 2, output: 2 }, C: { input: 3, output: 1 } },
];

interface Scene {
  label: string;
  run: number;
  queue: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "실행 1", run: 0, queue: "B 대기", note: "A의 입력 4조각이 예산 4칸을 모두 씁니다. 자리는 2칸 중 1칸만 찼지만 예산이 없어 B는 기다립니다." },
  { label: "실행 2", run: 1, queue: "비어 있음", note: "A의 남은 2조각과 B의 2조각으로 다시 4칸입니다. 두 요청 모두 입력을 다 읽어 첫 출력을 얻습니다." },
  { label: "실행 3", run: 2, queue: "C 도착", note: "A와 B가 decode 한 칸씩만 써서 2칸이 비어 있습니다. B가 두 번째 출력으로 끝나 자리 하나가 비고, 이때 C가 도착합니다." },
  { label: "실행 4", run: 3, queue: "비어 있음", note: "B가 비운 자리에 C가 들어옵니다. A의 decode 1칸과 C의 입력 3칸으로 4칸을 채우고 두 요청이 함께 끝납니다." },
  { label: "반례 · 예산 8", run: 2, queue: "C 막힘", note: "(가정을 바꿈) 예산을 8칸으로 늘리고 C가 실행 3 전에 왔다고 해 봅니다. 6칸이 비어도 요청 자리 2칸이 A·B로 차 있어 C는 들어가지 못합니다." },
];

function SlotCell({ slot, delay, reduced, current }: { slot: Slot; delay: number; reduced: boolean; current: boolean }) {
  if (!slot) return <div className="h-7 rounded-sm border border-dashed border-border" aria-label="빈 칸" />;
  return (
    <motion.div
      className="flex h-7 items-center justify-center rounded-sm border text-[11px] font-black"
      style={
        slot.phase === "p"
          ? { backgroundColor: COLOR[slot.req], borderColor: COLOR[slot.req], color: "#ffffff" }
          : { backgroundColor: "transparent", borderColor: COLOR[slot.req], color: COLOR[slot.req], borderWidth: 1.25 }
      }
      initial={current ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.25 }}
    >
      {slot.req}
    </motion.div>
  );
}

function Bar({ filled, total, color, label }: { filled: number; total: number; color: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="w-8 shrink-0 text-[10px] text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 rounded-[2px] border transition-colors duration-500"
            style={{ borderColor: color, backgroundColor: i < filled ? color : "transparent" }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        {filled}/{total}
      </span>
    </div>
  );
}

export default function IterationSlotTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = SCENES[scenes.active];
  const counter = scenes.active === 4;
  const reduced = scenes.reducedMotion;
  const progress = AFTER[scene.run];
  const shownRuns = counter ? 3 : scene.run + 1;

  return (
    <VizFrame
      eyebrow="Iteration slots"
      title="예산 칸과 요청 자리가 함께 허락해야 다음 실행에 들어갑니다"
      description="가로 4칸이 한 실행의 token 예산, 오른쪽 2칸이 함께 진행할 요청 자리입니다. 행이 위에서 아래로 실행 1~4입니다."
      note="본문 3절의 가정(예산 4·요청 2·메모리 충분·C는 실행 3 뒤 도착)을 그대로 씁니다. 마지막 반례만 예산과 도착 시점을 바꿉니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실행마다 token 예산 칸과 요청 자리 배정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 overflow-x-auto">
            <div className="min-w-[19rem] space-y-1">
              <div className="grid grid-cols-[3.2rem_minmax(0,1fr)_5.2rem] gap-2 text-[10px] font-bold text-muted-foreground">
                <span />
                <span>token 예산 {counter ? 8 : 4}칸 · 채운 칸 = 입력, 테두리 칸 = 출력</span>
                <span>요청 자리 2</span>
              </div>
              {Array.from({ length: 4 }, (_, r) => {
                const visible = r < shownRuns;
                const current = r === shownRuns - 1;
                const row = counter && r === 2 ? [...RUNS[2], null, null, null, null] : RUNS[r];
                const seats = SEATS[r];
                const used = row.filter(Boolean).length;
                return (
                  <div
                    key={r}
                    className={`grid grid-cols-[3.2rem_minmax(0,1fr)_5.2rem] items-center gap-2 rounded-sm ${current ? "bg-primary/5" : ""} ${visible ? "" : "opacity-0"}`}
                  >
                    <span className={`text-[11px] font-bold ${current ? "text-foreground" : "text-muted-foreground"}`}>
                      실행 {r + 1}
                      <span className="block font-mono text-[10px] font-normal">{used}칸</span>
                    </span>
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}>
                      {row.map((slot, i) => (
                        <SlotCell key={i} slot={visible ? slot : null} delay={0.15 + i * 0.12} reduced={reduced} current={current} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {[0, 1].map((s) => {
                        const req = visible ? seats[s] : undefined;
                        return (
                          <div
                            key={s}
                            className={`flex h-7 items-center justify-center rounded-sm border text-[11px] font-black ${req ? "" : "border-dashed border-border"}`}
                            style={req ? { borderColor: COLOR[req], color: COLOR[req] } : undefined}
                          >
                            {req ?? ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <div className="grid gap-1.5">
              {(["A", "B", "C"] as const).map((req) => (
                <div key={req} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="w-4 text-sm font-black" style={{ color: COLOR[req] }}>
                    {req}
                  </span>
                  <Bar label="입력" filled={progress[req].input} total={NEED[req].input} color={COLOR[req]} />
                  <Bar label="출력" filled={progress[req].output} total={NEED[req].output} color={COLOR[req]} />
                </div>
              ))}
            </div>
            <div className="rounded-sm border border-border px-2 py-1.5 text-xs">
              <span className="block text-[10px] font-bold text-muted-foreground">대기열</span>
              <span className={`font-bold ${scene.queue === "C 막힘" ? "text-[#dc2626]" : "text-foreground"}`}>{scene.queue}</span>
            </div>
          </div>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
