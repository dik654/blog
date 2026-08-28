import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 요청 100개의 TTFT 표본을 histogram 으로 놓고 P50 → P95·P99 → SLO 임계값 순서로
 * 같은 분포를 다르게 자르는 과정을 보여 준다. 한 mechanism: percentile 은 정렬 순위다.
 */
const SCENES = ["표본 100개", "P50 = 중앙값", "P95 · P99 꼬리", "SLO 1.5 s 판정"] as const;

/** bin 은 0.2 s 폭. 값은 본문의 예(P50 0.7, P95 1.45, P99 2.4, max 4.0, 평균 0.90)와 맞춘다. */
const BINS: readonly { from: number; count: number }[] = [
  { from: 0.2, count: 4 },
  { from: 0.4, count: 21 },
  { from: 0.6, count: 27 },
  { from: 0.8, count: 18 },
  { from: 1.0, count: 12 },
  { from: 1.2, count: 7 },
  { from: 1.4, count: 6 },
  { from: 1.6, count: 1 },
  { from: 1.8, count: 1 },
  { from: 2.0, count: 0 },
  { from: 2.2, count: 1 },
  { from: 2.4, count: 1 },
  { from: 2.6, count: 0 },
  { from: 2.8, count: 0 },
  { from: 3.0, count: 0 },
  { from: 3.2, count: 0 },
  { from: 3.4, count: 0 },
  { from: 3.6, count: 0 },
  { from: 3.8, count: 1 },
];

const BIN_WIDTH = 0.2;
const MAX_COUNT = 27;
const P50 = 0.7;
const P95 = 1.45;
const P99 = 2.4;
const SLO = 1.5;

const NOTES = [
  "가로축은 TTFT(s), 세로축은 그 구간에 든 요청 수입니다. 대부분은 0.4–1.0 s 에 몰려 있고 오른쪽으로 드문 표본이 4.0 s 까지 늘어져 있습니다.",
  "정렬 순위 50 번째 값이 0.7 s 입니다. 평균 0.90 s 는 오른쪽 꼬리에 끌려 중앙값보다 큽니다. 요청의 절반은 0.7 s 안에 첫 token 을 받았습니다.",
  "95 번째 값 1.45 s, 99 번째 값 2.4 s 입니다. 두 선 사이의 3 개 요청과 그 오른쪽 1 개가 tail latency 이며, 긴 prompt·대기열·preemption 이 그 원인입니다.",
  "SLO 가 P95 TTFT ≤ 1.5 s 이면 P95 1.45 s 로 이 window 는 통과입니다. 1.5 s 를 넘긴 요청은 5 개(5 %)라 요청 비율 표기(95 % 이상)로도 경계에서 통과입니다.",
] as const;

function binState(from: number, active: number): string {
  const to = from + BIN_WIDTH;
  if (active === 3) {
    return from >= SLO ? "bg-amber-600/70" : "bg-primary/45";
  }
  if (active === 2) {
    if (from >= P99) return "bg-amber-600/70";
    if (to > P95) return "bg-amber-500/40";
    return "bg-primary/30";
  }
  if (active === 1) {
    return to <= P50 + 0.1 ? "bg-primary/60" : "bg-primary/20";
  }
  return "bg-primary/35";
}

export default function LatencyPercentileHistogramViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;
  const axisMax = 4.0;
  const ratio = (x: number) => (x - 0.2) / (axisMax - 0.2);
  const pct = (x: number) => `${ratio(x) * 100}%`;
  // 축 양 끝의 label 은 canvas 밖으로 밀리지 않도록 가운데 정렬 대신 끝 정렬로 바꿉니다.
  const anchor = (x: number) =>
    ratio(x) >= 0.92 ? "-translate-x-full" : ratio(x) <= 0.08 ? "translate-x-0" : "-translate-x-1/2";

  const markers: { at: number; label: string; tone: string }[] = [];
  if (active >= 1) markers.push({ at: P50, label: "P50 0.7", tone: "bg-primary text-primary" });
  if (active === 2) {
    markers.push({ at: P95, label: "P95 1.45", tone: "bg-amber-600 text-amber-700" });
    markers.push({ at: P99, label: "P99 2.4", tone: "bg-amber-600 text-amber-700" });
  }
  if (active === 3) markers.push({ at: SLO, label: "SLO 1.5", tone: "bg-amber-600 text-amber-700" });

  return (
    <VizFrame
      eyebrow="Latency distribution"
      title="Percentile 은 같은 표본을 정렬 순위로 자른 값입니다"
      description="요청 100개의 TTFT 표본을 0.2 s 폭 histogram 으로 놓았습니다. 장면이 바뀌어도 표본은 같고, 어느 순위에서 자르는지만 달라집니다."
      note="Nearest-rank 정의입니다. NumPy·vLLM 의 선형 보간은 표본이 적을 때 값이 조금 다를 수 있습니다. 표본과 bin 은 설명용 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="TTFT latency histogram with percentiles"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-6 min-w-0">
            <div className="relative h-40 w-full border-b border-l border-border">
              {BINS.map((bin) => (
                <div
                  key={bin.from}
                  className={`absolute bottom-0 ${binState(bin.from, active)}`}
                  style={{
                    left: pct(bin.from),
                    width: `calc(${(BIN_WIDTH / (axisMax - 0.2)) * 100}% - 2px)`,
                    height: `${(bin.count / MAX_COUNT) * 100}%`,
                  }}
                  aria-hidden
                />
              ))}
              {markers.map((marker) => (
                <div
                  key={marker.label}
                  className={`absolute top-0 h-full w-px ${marker.tone.split(" ")[0]}`}
                  style={{ left: pct(marker.at) }}
                  aria-hidden
                />
              ))}
            </div>
            <div className="relative mt-1 h-10 text-[10px] font-bold text-muted-foreground">
              {[0.5, 1.0, 2.0, 3.0, 4.0].map((tick) => (
                <span key={tick} className={`absolute ${anchor(tick)}`} style={{ left: pct(tick) }}>
                  {tick.toFixed(1)}
                </span>
              ))}
              {markers.map((marker) => (
                <span
                  key={marker.label}
                  className={`absolute top-4 whitespace-nowrap ${anchor(marker.at)} ${marker.tone.split(" ")[1]}`}
                  style={{ left: pct(marker.at) }}
                >
                  {marker.label}
                </span>
              ))}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">평균</dt>
              <dd className="font-bold text-foreground">0.90 s</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">P50</dt>
              <dd className="font-bold text-foreground">{active >= 1 ? "0.70 s" : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">P95 / P99</dt>
              <dd className="font-bold text-foreground">{active >= 2 ? "1.45 / 2.40 s" : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">&gt; 1.5 s 요청</dt>
              <dd className="font-bold text-foreground">{active === 3 ? "5 개 (5 %)" : "—"}</dd>
            </div>
          </dl>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
