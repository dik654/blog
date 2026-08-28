import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 model 의 한 step 이 batch·chunk 에 따라 roofline 위 어디에 놓이고,
 * 그 위치가 step 시간(memory 항 vs compute 항의 max) 을 어떻게 정하는지.
 * 가정: 7B dense FP16 (W 14 GB, 2P = 14 GFLOP/token, k = 0.5 MB/token),
 *       H100 급 dense 989 TFLOP/s · 3.35 TB/s → ridge ≈ 295 FLOP/byte.
 * 모든 값은 roofline 하한 계산이며 실측이 아니다.
 */
const PEAK_TFLOPS = 989;
const BW_TBPS = 3.35;
const RIDGE = PEAK_TFLOPS / BW_TBPS;

const SCENES = [
  "Decode · batch 1",
  "Decode · batch 64",
  "Prefill · 4,096 token",
  "Mixed · 64 + chunk 512",
  "Mixed · 64 + chunk 2,048",
] as const;

/** intensity(FLOP/byte), memory 항(ms), compute 항(ms), 점 label */
const POINTS = [
  { intensity: 1.0, memMs: 4.2, computeMs: 0.014, label: "B=1" },
  { intensity: 19.7, memMs: 14.2, computeMs: 0.9, label: "B=64" },
  { intensity: 3800, memMs: 4.8, computeMs: 62, label: "n=4,096" },
  { intensity: 170, memMs: 14.3, computeMs: 8.2, label: "64+512" },
  { intensity: 610, memMs: 14.5, computeMs: 30, label: "64+2,048" },
] as const;

const NOTES = [
  "Weight 14 GB 를 읽어 token 하나를 만드니 intensity 는 1 FLOP/byte 근처입니다. 시간은 bandwidth 가 정하고 연산기는 거의 놉니다.",
  "Decode 64 개를 묶으면 weight 는 한 번만 읽지만 request 마다 KV 33.5 GB 를 따로 읽어 intensity 는 20 에 머뭅니다. 여전히 ridge 왼쪽입니다.",
  "4,096-token prompt 는 같은 weight 로 4,096 배의 연산을 하니 intensity 가 수천으로 뛰어 compute roof 에 닿습니다. 시간은 연산기가 정합니다.",
  "Decode 64 개에 512-token chunk 를 얹으면 compute 항이 8 ms 로 늘지만 memory 항 14 ms 아래라 roofline 하한은 그대로입니다. 남는 연산기를 chunk 가 씁니다.",
  "Chunk 를 2,048 로 키우면 compute 항 30 ms 가 memory 항을 넘어 step 이 compute-bound 가 됩니다. 64 개 decode 의 다음 token 이 모두 30 ms 뒤로 밀립니다.",
] as const;

const PLOT = { left: 64, right: 612, top: 18, bottom: 226 } as const;
const X_DECADES = 5; // 0.1 … 10^4 FLOP/byte
const Y_DECADES = 4; // 0.1 … 10^3 TFLOP/s

function px(intensity: number) {
  return PLOT.left + ((Math.log10(intensity) + 1) / X_DECADES) * (PLOT.right - PLOT.left);
}
function py(tflops: number) {
  return PLOT.bottom - ((Math.log10(tflops) + 1) / Y_DECADES) * (PLOT.bottom - PLOT.top);
}
function roof(intensity: number) {
  return Math.min(PEAK_TFLOPS, BW_TBPS * intensity);
}

export default function PrefillDecodePhaseDynamicsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const point = POINTS[scenes.active];
  const stepMs = Math.max(point.memMs, point.computeMs);
  const computeBound = point.computeMs > point.memMs;
  const barScale = 30; // ms → 100%
  const xTicks = [0.1, 1, 10, 100, 1000, 10000];
  const yTicks = [0.1, 1, 10, 100, 1000];

  return (
    <VizFrame
      eyebrow="Roofline · prefill vs decode"
      title="같은 model 의 한 step 이 batch 와 chunk 에 따라 roofline 위를 옮겨 다닙니다"
      description="가로축은 한 step 의 FLOP 을 읽고 쓴 byte 로 나눈 arithmetic intensity, 세로축은 그 intensity 에서 도달 가능한 연산 성능입니다. 아래 막대는 같은 step 의 memory 항과 compute 항이며 큰 쪽이 step 시간의 하한입니다."
      note="7B dense FP16, H100 급(989 TFLOP/s, 3.35 TB/s) 가정의 roofline 하한 계산입니다. 실측은 max 와 두 항의 합 사이에 놓이며, activation·launch overhead 는 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Prefill 과 decode 의 roofline 위치와 step 시간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(38rem,calc(100dvh-12rem))] min-h-[31rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 640 250"
              className="h-auto w-full min-w-[32rem] text-foreground"
              role="img"
              aria-label={`${SCENES[scenes.active]} 의 roofline 위치`}
            >
              {xTicks.map((tick) => (
                <g key={`x-${tick}`}>
                  <line x1={px(tick)} x2={px(tick)} y1={PLOT.top} y2={PLOT.bottom} stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
                  <text x={px(tick)} y={PLOT.bottom + 14} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.6}>
                    {tick >= 1 ? tick.toLocaleString() : tick}
                  </text>
                </g>
              ))}
              {yTicks.map((tick) => (
                <g key={`y-${tick}`}>
                  <line x1={PLOT.left} x2={PLOT.right} y1={py(tick)} y2={py(tick)} stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
                  <text x={PLOT.left - 6} y={py(tick) + 3} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.6}>
                    {tick >= 1 ? tick.toLocaleString() : tick}
                  </text>
                </g>
              ))}
              <text x={(PLOT.left + PLOT.right) / 2} y={PLOT.bottom + 24} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.7}>
                arithmetic intensity (FLOP/byte)
              </text>
              <text x={12} y={PLOT.top + 4} fontSize={9} fill="currentColor" fillOpacity={0.7}>
                TFLOP/s
              </text>
              <polyline
                points={`${px(0.1)},${py(roof(0.1))} ${px(RIDGE)},${py(PEAK_TFLOPS)} ${px(10000)},${py(PEAK_TFLOPS)}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
              />
              <line x1={px(RIDGE)} x2={px(RIDGE)} y1={PLOT.top} y2={PLOT.bottom} stroke="currentColor" strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 3" />
              <text x={px(RIDGE) + 4} y={PLOT.bottom - 6} fontSize={9} fill="currentColor" fillOpacity={0.75}>
                ridge ≈ {Math.round(RIDGE)}
              </text>
              <text x={px(0.3)} y={py(roof(0.3)) - 8} fontSize={9} fill="currentColor" fillOpacity={0.75}>
                bandwidth roof
              </text>
              <text x={px(2000)} y={py(PEAK_TFLOPS) - 6} fontSize={9} fill="currentColor" fillOpacity={0.75} textAnchor="middle">
                compute roof
              </text>
              {POINTS.map((item, index) => (
                <circle
                  key={item.label}
                  cx={px(item.intensity)}
                  cy={py(roof(item.intensity))}
                  r={index === scenes.active ? 6 : 3}
                  fill={index === scenes.active ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeOpacity={index === scenes.active ? 1 : 0.35}
                  strokeWidth={1}
                  className={index === scenes.active ? "text-primary" : "text-foreground"}
                />
              ))}
              <text
                x={px(point.intensity) + (point.intensity > 500 ? -10 : 10)}
                y={py(roof(point.intensity)) + (point.intensity > 500 ? 16 : -10)}
                textAnchor={point.intensity > 500 ? "end" : "start"}
                fontSize={10}
                fontWeight={700}
                fill="currentColor"
              >
                {point.label} · I≈{point.intensity >= 100 ? Math.round(point.intensity).toLocaleString() : point.intensity}
              </text>
            </svg>
          </div>
          <div className="mt-4 grid gap-2 text-xs">
            {[
              { name: "memory 항", value: point.memMs, active: !computeBound },
              { name: "compute 항", value: point.computeMs, active: computeBound },
            ].map((bar) => (
              <div key={bar.name} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3">
                <span className={bar.active ? "font-bold text-foreground" : "text-muted-foreground"}>{bar.name}</span>
                <div className="h-3 w-full border border-border bg-muted/30">
                  <div
                    className={`h-full ${bar.active ? "bg-primary/70" : "bg-foreground/25"}`}
                    style={{ width: `${Math.min(100, (bar.value / barScale) * 100)}%` }}
                  />
                </div>
                <span className="text-right font-mono tabular-nums">
                  {bar.value < 0.1 ? bar.value.toFixed(3) : bar.value.toFixed(1)} ms
                </span>
              </div>
            ))}
            <p className="text-muted-foreground">
              Step 시간 하한 ≈ <span className="font-mono font-bold text-foreground">{stepMs.toFixed(1)} ms</span>
              {" · "}
              {computeBound ? "compute-bound" : "memory-bound"}
            </p>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
