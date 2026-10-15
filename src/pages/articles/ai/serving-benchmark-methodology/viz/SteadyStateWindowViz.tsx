import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 번의 benchmark 실행을 요청 순서대로 펼친다. 위는 요청별 TTFT 막대, 아래는 그 요청이 도착할 때의 대기열 길이다.
 * 한 mechanism: cold·warmup·ramp-up·drain 칸을 하나씩 버리고 대기열이 평평한 steady 칸만 측정 창에 넣는다.
 * 마지막 장면은 본문의 반복 5회 값으로 두 설정의 흔들림이 겹치는지를 본다.
 */
type Phase = "cold" | "warmup" | "ramp" | "steady" | "drain";

const PHASES: { phase: Phase; ttft: number[]; queue: number[] }[] = [
  { phase: "cold", ttft: [6.8], queue: [0] },
  { phase: "warmup", ttft: [0.35, 0.36, 0.34, 0.35], queue: [0, 0, 0, 0] },
  { phase: "ramp", ttft: [0.4, 0.48, 0.56, 0.64, 0.72, 0.77], queue: [1, 2, 3, 4, 5, 6] },
  {
    phase: "steady",
    ttft: [0.79, 0.82, 0.8, 0.81, 0.78, 0.83, 0.8, 0.79, 0.81, 0.82, 0.8, 0.79, 0.81, 0.8, 0.82, 0.78, 0.8, 0.81, 0.79, 0.8],
    queue: [6, 7, 6, 7, 6, 6, 7, 6, 7, 6, 6, 7, 6, 7, 6, 6, 7, 6, 7, 6],
  },
  { phase: "drain", ttft: [0.7, 0.58, 0.47, 0.4, 0.36], queue: [5, 4, 3, 2, 1] },
];
const REQUESTS = PHASES.flatMap(({ phase, ttft, queue }) => ttft.map((t, i) => ({ phase, ttft: t, queue: queue[i] })));
const PHASE_LABEL: Record<Phase, string> = { cold: "cold", warmup: "warmup", ramp: "ramp-up", steady: "steady 측정 창", drain: "drain" };
const MAX_T = 1.0;
const BAR_H = 84;
const QUEUE_MAX = 7;

const RUNS_A = [0.8, 0.83, 0.79, 0.84, 0.81];
const RUNS_B = [0.78, 0.8, 0.76, 0.82, 0.79];
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};

interface Scene {
  label: string;
  /** 이 장면까지 결정이 난 구간 */
  decided: Phase[];
  focus: Phase | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "cold 첫 요청", decided: ["cold"], focus: "cold", note: "첫 요청은 graph capture와 빈 cache를 모두 겪어 TTFT가 6.8초입니다. 막대가 칸을 뚫고 나가며 표본에서 따로 뺍니다." },
  { label: "warmup", decided: ["cold", "warmup"], focus: "warmup", note: "준비를 끝내는 warmup 요청 4개(예시 개수)도 회색으로 버립니다. 이 뒤의 요청은 0.35초 안팎입니다." },
  { label: "ramp-up", decided: ["cold", "warmup", "ramp"], focus: "ramp", note: "부하를 켠 직후 대기열이 0에서 6까지 차오릅니다. 이 동안의 TTFT는 정상보다 낮아 버립니다." },
  { label: "steady 창", decided: ["cold", "warmup", "ramp", "steady"], focus: "steady", note: "대기열이 6~7에서 더 이상 한쪽으로 움직이지 않는 20칸만 측정 창에 넣습니다. 이 칸들의 P50·P95가 보고할 값입니다." },
  { label: "drain", decided: ["cold", "warmup", "ramp", "steady", "drain"], focus: "drain", note: "새 도착이 끊기면 대기열이 줄고 값이 다시 빨라집니다. 마지막 5칸도 버립니다." },
  { label: "반복 5회", decided: ["cold", "warmup", "ramp", "steady", "drain"], focus: null, note: "같은 창을 5번 다시 재면 A 평균 0.814초, B 0.790초입니다. 차이 0.024초가 표준편차 0.021초 하나 정도라 판정을 보류합니다." },
];

const KEEP_COLOR = "#2563eb";
const DROP_COLOR = "#cbd5e1";
const FOCUS_COLOR = "#f97316";

function RunPlot() {
  const lo = 0.74;
  const hi = 0.86;
  const x = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  return (
    <div className="space-y-3" aria-label="반복 5회 P50 TTFT 비교">
      {[
        { name: "A", runs: RUNS_A, color: "#2563eb" },
        { name: "B", runs: RUNS_B, color: "#d97706" },
      ].map(({ name, runs, color }) => {
        const m = mean(runs);
        const s = sd(runs);
        return (
          <div key={name} className="grid grid-cols-[1.5rem_minmax(0,1fr)_7.5rem] items-center gap-2">
            <span className="text-sm font-black" style={{ color }}>
              {name}
            </span>
            <div className="relative h-8 border-b border-border">
              <motion.span
                className="absolute top-2 h-4 rounded-sm"
                style={{ left: x(m - s), width: `calc(${x(m + s)} - ${x(m - s)})`, backgroundColor: color, opacity: 0.18 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />
              {runs.map((v, i) => (
                <motion.span
                  key={i}
                  className="absolute top-3 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ left: x(v), backgroundColor: color }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                />
              ))}
              <span className="absolute top-0 h-8 w-px" style={{ left: x(m), backgroundColor: color }} />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {m.toFixed(3)} ± {s.toFixed(3)} s
            </span>
          </div>
        );
      })}
      <div className="ml-[2rem] mr-[8rem] flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{lo} s</span>
        <span>{hi} s</span>
      </div>
    </div>
  );
}

export default function SteadyStateWindowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const runs = scenes.active === SCENES.length - 1;
  const kept = REQUESTS.filter((r) => r.phase === "steady").length;
  const dropped = REQUESTS.filter((r) => scene.decided.includes(r.phase) && r.phase !== "steady").length;

  return (
    <VizFrame
      eyebrow="Measurement window"
      title="대기열이 평평한 구간의 요청만 측정 창에 넣습니다"
      description="막대 하나가 요청 하나의 TTFT, 아래 점 수가 그 요청이 도착할 때 대기열에 있던 요청 수입니다. 앞에서부터 구간을 하나씩 판정합니다."
      note="막대 값은 본문의 6.8초·0.35초와 반복 5회 값을 잇도록 만든 설명용 실행입니다. warmup 4개와 각 구간 길이는 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="benchmark 한 실행에서 버리는 구간과 측정 창"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 min-h-[10rem]">
            {runs ? (
              <RunPlot />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[18rem]">
                  <div className="flex items-end gap-[2px]" style={{ height: BAR_H + 14 }}>
                    {REQUESTS.map((r, i) => {
                      const decided = scene.decided.includes(r.phase);
                      const focus = scene.focus === r.phase;
                      const keep = r.phase === "steady" && decided;
                      const color = focus ? (keep ? KEEP_COLOR : FOCUS_COLOR) : keep ? KEEP_COLOR : decided ? DROP_COLOR : "#94a3b8";
                      const h = (Math.min(r.ttft, MAX_T) / MAX_T) * BAR_H;
                      return (
                        <div key={i} className="relative flex flex-1 flex-col items-center justify-end" style={{ height: BAR_H + 14 }}>
                          {r.ttft > MAX_T ? <span className="absolute -top-0.5 left-0 whitespace-nowrap font-mono text-[9px] font-bold text-[#f97316]">6.8 s ↑</span> : null}
                          <motion.span
                            className="w-full rounded-t-[2px]"
                            style={{ height: h, backgroundColor: color, opacity: decided || !scene.focus ? 1 : 0.45 }}
                            initial={focus ? { scaleY: 0.2 } : false}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: reduced ? 0 : 0.05 * (i % 12), duration: reduced ? 0 : 0.3 }}
                            aria-label={`요청 ${i + 1} TTFT ${r.ttft}초`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-1 flex gap-[2px]">
                    {REQUESTS.map((r, i) => (
                      <div key={i} className="flex flex-1 flex-col-reverse items-center gap-[1px]" style={{ height: QUEUE_MAX * 4 }}>
                        {Array.from({ length: r.queue }, (_, q) => (
                          <span key={q} className="h-[3px] w-full rounded-[1px] bg-[#64748b]" />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 flex gap-[2px]">
                    {PHASES.map(({ phase, ttft }) => {
                      const decided = scene.decided.includes(phase);
                      return (
                        <div
                          key={phase}
                          className="border-t pt-1 text-center text-[10px] font-bold"
                          style={{
                            flex: ttft.length,
                            borderColor: phase === "steady" && decided ? KEEP_COLOR : decided ? "#94a3b8" : "transparent",
                            color: phase === "steady" && decided ? KEEP_COLOR : decided ? "#64748b" : "transparent",
                          }}
                        >
                          {ttft.length >= 4 || phase === "cold" ? PHASE_LABEL[phase] : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <dl className="mt-2 grid grid-cols-3 gap-x-3 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">버린 요청</dt>
              <dd className="font-bold text-foreground">{runs ? 16 : dropped}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">측정 창</dt>
              <dd className="font-bold text-[#2563eb]">{scene.decided.includes("steady") ? kept : 0}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">판정</dt>
              <dd className="font-bold text-foreground">{runs ? "보류" : scene.decided.includes("steady") ? "창 확정" : "미정"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
