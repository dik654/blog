import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * C의 조각 길이 c를 늘릴 때 읽을 byte와 할 계산이 어떻게 늘어나는지 칸으로 쌓는다.
 * 한 mechanism: 가중치 100 MB는 위치 수와 무관하게 한 번만 읽으므로 전송은 위치당 2 MB만 늘고,
 * 계산은 위치당 100 MFLOP씩 늘어 c=16에서 계산 하한이 전송 하한을 넘는다.
 */
const TFLOPS = 1; // 1 TFLOP/s = 1 MFLOP/µs → 1000 MFLOP = 1 ms
const GBPS = 100; // 100 GB/s → 100 MB = 1 ms
const AXIS_MS = 2.5;
const TARGET_MS = 2;

interface Scene {
  c: number;
  label: string;
  observed?: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { c: 0, label: "C 없이", note: "A·B 두 위치만 계산합니다. 읽을 byte는 가중치 100 MB와 A·B 기록 20 MB씩, 계산 칸은 2개라 전송 1.40 ms가 하한을 정합니다." },
  { c: 4, label: "C 4위치", note: "C 네 위치를 넣으면 계산 칸은 4개 늘지만 읽을 byte는 C 기록 2 MB × 4 = 8 MB만 늘어납니다. 가중치는 이미 읽은 100 MB를 같이 씁니다." },
  { c: 16, label: "C 16위치", note: "계산 칸 18개가 1.80 ms, 전송은 172 MB로 1.72 ms입니다. 위치당 계산이 전송보다 빨리 늘어 여기서 계산 하한이 앞섭니다." },
  { c: 20, label: "C 20위치", note: "계산 칸 22개로 하한부터 2.2 ms입니다. 이 가정에서는 목표 2 ms에 끝날 수 없습니다." },
  { c: 16, label: "하한 대 측정", observed: 2.3, note: "c=16의 하한 1.8 ms는 목표 2 ms보다 작지만 통과의 증거가 아닙니다. 실제 관측이 2.3 ms라면 목표에 실패하고 하한과도 모순이 없습니다." },
];

const x = (ms: number) => `${(ms / AXIS_MS) * 100}%`;

function Cells({ n, cls, delayBase, reduced, label }: { n: number; cls: string; delayBase: number; reduced: boolean; label: string }) {
  return (
    <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] gap-0.5 sm:grid-cols-[repeat(22,minmax(0,1fr))]" aria-label={label}>
      {Array.from({ length: 22 }, (_, i) => (
        <motion.span
          key={i}
          className={`h-5 rounded-sm border ${i < n ? cls : "border-dashed border-border/60"}`}
          initial={{ opacity: i < n ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : delayBase + i * 0.04 }}
        />
      ))}
    </div>
  );
}

export default function WeightReuseCrossoverViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const positions = 2 + scene.c;
  const mflop = 100 * positions;
  const mb = 140 + 2 * scene.c;
  const computeMs = mflop / (1000 * TFLOPS);
  const memMs = mb / GBPS;
  const bound = Math.max(computeMs, memMs);

  return (
    <VizFrame
      eyebrow="Shared weights vs per-position work"
      title="가중치는 한 번만 읽으므로 위치를 늘리면 계산이 전송보다 빨리 늘어납니다"
      description="위 두 줄은 읽을 byte, 셋째 줄은 할 계산입니다. 칸 하나가 C 기록 2 MB 또는 위치 하나의 계산 100 MFLOP입니다. 아래 막대는 두 양을 장치 속도로 나눈 시간 하한입니다."
      note="F=100(2+c) MFLOP, M=(140+2c) MB, 1 TFLOP/s·100 GB/s는 본문의 작은 모형 가정이며 GPU 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="C 조각 길이별 읽을 byte와 계산 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs text-muted-foreground">
              A1 + B1 + C{scene.c} = {positions}위치
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground">읽을 byte · {mb} MB</p>
            <div className="flex h-9 w-full gap-0.5 text-[10px] font-bold">
              <span className="flex w-[55%] items-center justify-center rounded-sm bg-[#475569] text-white">가중치 100 MB · 한 번</span>
              <span className="flex w-[11%] items-center justify-center rounded-sm bg-[#2563eb] text-white">A 20</span>
              <span className="flex w-[11%] items-center justify-center rounded-sm bg-[#2563eb] text-white">B 20</span>
              <span className="flex flex-1 items-center justify-center rounded-sm border border-dashed border-border text-muted-foreground">C 기록 ↓</span>
            </div>
            <Cells n={scene.c} cls="border-[#0891b2] bg-[#0891b2]" delayBase={0.2} reduced={reduced} label={`C 기록 2 MB 칸 ${scene.c}개`} />
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground">할 계산 · {mflop.toLocaleString()} MFLOP</p>
            <Cells n={positions} cls="border-[#f59e0b] bg-[#f59e0b]" delayBase={0.6} reduced={reduced} label={`계산 100 MFLOP 칸 ${positions}개`} />
          </div>

          <div className="relative mt-2 space-y-2 border-t border-border pt-5">
            <div className="pointer-events-none absolute inset-y-0 left-[calc(2.5rem+0.5rem)] right-[calc(3.75rem+0.5rem)]" aria-hidden>
              <span className="absolute -top-0.5 h-[calc(100%+2px)] border-l border-dashed border-primary" style={{ left: x(TARGET_MS) }} />
              <span className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-primary" style={{ left: x(TARGET_MS) }}>
                목표 2 ms
              </span>
            </div>
            {[
              { label: "계산", ms: computeMs, cls: "bg-[#f59e0b]" },
              { label: "전송", ms: memMs, cls: "bg-[#0891b2]" },
              { label: "관측", ms: scene.observed ?? 0, cls: "bg-[#dc2626]" },
            ].map((bar, i) => (
              <div key={bar.label} className={`grid grid-cols-[2.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 ${bar.ms ? "" : "invisible"}`} aria-hidden={!bar.ms}>
                <span className="text-[11px] font-bold">{bar.label}</span>
                <div className="relative h-5">
                  <motion.span
                    className={`absolute inset-y-0 left-0 rounded-sm ${bar.cls}`}
                    initial={{ width: 0 }}
                    animate={{ width: x(bar.ms) }}
                    transition={{ delay: reduced ? 0 : 1.2 + i * 0.25, duration: reduced ? 0 : 0.5 }}
                  />
                  </div>
                <span className="text-right font-mono text-[11px] font-bold text-foreground">{bar.ms.toFixed(2)} ms</span>
              </div>
            ))}
          </div>

          <p className="font-mono text-sm font-bold text-foreground">
            하한 = max({computeMs.toFixed(2)}, {memMs.toFixed(2)}) = {bound.toFixed(2)} ms · {computeMs > memMs ? "계산" : "전송"}이 정함
          </p>

          <p className="min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
