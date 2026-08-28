import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 요청의 timeline(queue → prefill → decode token) 위에 TTFT·ITL·TPOT·E2E 를 표시하고,
 * batch 가 커지거나 대기열이 생길 때 각 구간이 어떻게 늘어나는지 보여 준다.
 * 한 mechanism: 같은 step 시간 t(B) 가 요청에는 ITL, 서버에는 tokens/s 가 된다.
 */
const SCENES = ["batch 1", "batch 8", "batch 32", "대기열 + 멈춤"] as const;

interface Scene {
  queueMs: number;
  prefillMs: number;
  gapsMs: readonly number[];
  batch: number;
}

const FIRST_TOKENS = 10;

const DATA: readonly Scene[] = [
  { batch: 1, queueMs: 0, prefillMs: 120, gapsMs: Array(FIRST_TOKENS - 1).fill(20) },
  { batch: 8, queueMs: 0, prefillMs: 180, gapsMs: Array(FIRST_TOKENS - 1).fill(28) },
  { batch: 32, queueMs: 0, prefillMs: 300, gapsMs: Array(FIRST_TOKENS - 1).fill(50) },
  { batch: 32, queueMs: 1200, prefillMs: 300, gapsMs: [50, 50, 50, 220, 50, 50, 50, 50, 50] },
];

const NOTES = [
  "요청 하나만 있으면 queue 0, prefill 120 ms 로 TTFT 0.12 s 이고 decode step 20 ms 가 그대로 ITL 입니다. 서버 tokens/s 는 1/0.02 = 50 에 그칩니다.",
  "요청 8 개를 한 step 에 묶으면 step 시간은 28 ms 로 조금 늘고 서버는 step 마다 8 token 을 냅니다. ITL 은 1.4 배, tokens/s 는 5.7 배가 됩니다.",
  "Batch 32 에서는 step 50 ms 가 모든 요청의 ITL 이 됩니다. 요청 하나는 2.5 배 느려졌지만 서버는 640 tokens/s 로 12.8 배 많은 일을 합니다.",
  "도착률이 처리율에 가까워지면 batch 자리를 기다리는 시간이 TTFT 앞에 붙고, preemption 같은 멈춤이 ITL 표본 하나를 220 ms 로 튀게 합니다. TPOT 평균은 거의 그대로입니다.",
] as const;

const SCALE_MS = 2200;
const RESPONSE_TOKENS = 200;

function fmtSec(ms: number): string {
  return `${(ms / 1000).toFixed(2)} s`;
}

export default function ServingLatencyMetricsAndSloViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = DATA[scenes.active];
  const ttft = scene.queueMs + scene.prefillMs;
  const gapSum = scene.gapsMs.reduce((acc, gap) => acc + gap, 0);
  const tpot = gapSum / scene.gapsMs.length;
  const stepMs = Math.min(...scene.gapsMs);
  const e2e = ttft + (RESPONSE_TOKENS - 1) * tpot;
  const tokensPerSec = scene.batch / (stepMs / 1000);
  const pct = (ms: number) => `${((ms / SCALE_MS) * 100).toFixed(2)}%`;

  let cursor = ttft;
  const tokenMarks = [0, ...scene.gapsMs].map((gap, index) => {
    cursor += index === 0 ? 0 : gap;
    return { at: cursor, gap, spike: gap > stepMs * 2 };
  });

  return (
    <VizFrame
      eyebrow="Serving latency timeline"
      title="같은 decode step 시간이 요청에는 ITL 이고 서버에는 tokens/s 입니다"
      description="가로축은 요청 도착 뒤 경과 시간(0–2.2 s)입니다. 회색은 queue 대기, 파란색은 prefill, 세로선은 client 에 도착한 token 입니다. 처음 10 token 만 그리고 E2E 는 200 token 응답으로 계산합니다."
      note="Step 시간은 예시 값입니다. 실제 t(B) 는 model·GPU·prefill 혼합 비율에 따라 다르고, 대기열 길이는 도착률과 처리율의 비로 정해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="LLM serving latency timeline"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6 min-w-0">
            <div className="relative h-14 w-full border-b border-border">
              <div
                className="absolute top-2 h-6 bg-muted"
                style={{ left: 0, width: pct(scene.queueMs) }}
                aria-hidden
              />
              <div
                className="absolute top-2 h-6 bg-primary/25"
                style={{ left: pct(scene.queueMs), width: pct(scene.prefillMs) }}
                aria-hidden
              />
              {tokenMarks.map((mark, index) => (
                <div
                  key={index}
                  className={`absolute top-0 h-10 w-px ${mark.spike ? "bg-amber-600" : "bg-foreground"}`}
                  style={{ left: pct(mark.at) }}
                  aria-hidden
                />
              ))}
              <div
                className="absolute bottom-0 h-px bg-primary"
                style={{ left: 0, width: pct(ttft) }}
                aria-hidden
              />
            </div>
            <div className="relative mt-1 h-5 text-[10px] font-bold text-muted-foreground">
              <span className="absolute" style={{ left: 0 }}>0</span>
              <span className="absolute" style={{ left: pct(1000) }}>1 s</span>
              <span className="absolute" style={{ left: pct(2000) }}>2 s</span>
              <span className="absolute -translate-x-1/2 text-primary" style={{ left: pct(ttft) }}>
                TTFT
              </span>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-xs sm:grid-cols-5">
            <div>
              <dt className="text-muted-foreground">TTFT</dt>
              <dd className="font-bold text-foreground">{fmtSec(ttft)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ITL min / max</dt>
              <dd className="font-bold text-foreground">
                {stepMs} / {Math.max(...scene.gapsMs)} ms
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">TPOT</dt>
              <dd className="font-bold text-foreground">{tpot.toFixed(1)} ms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E2E (200 tok)</dt>
              <dd className="font-bold text-foreground">{fmtSec(e2e)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">서버 tokens/s</dt>
              <dd className="font-bold text-foreground">{Math.round(tokensPerSec)}</dd>
            </div>
          </dl>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
