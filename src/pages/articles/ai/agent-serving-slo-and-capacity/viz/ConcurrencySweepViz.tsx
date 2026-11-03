import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

/**
 * 본문 대응: small-case 절. 같은 서버(8장, 32K 문맥, rtx6kpro 표의 DCP8+MTP3 행)를
 * 동시 요청 1·8·16·32·64개로 나눠 쓸 때 합계와 요청 하나의 평균이 반대로 움직이는 구조.
 */
const POINTS = [
  { c: 1, agg: 86.7 },
  { c: 8, agg: 278.7 },
  { c: 16, agg: 399.5 },
  { c: 32, agg: 499.8 },
  { c: 64, agg: 742.0 },
] as const;

const AGG_SCALE = 800; // 합계 막대의 오른쪽 끝(tok/s)
const PER_SCALE = 100; // 요청 막대의 오른쪽 끝(tok/s)
const LINES = [
  { v: 20, label: "20" },
  { v: 30, label: "30" },
  { v: 60, label: "60" },
] as const;

const labels = POINTS.map((p) => `동시 ${p.c}개`);

const NOTES = [
  "혼자 쓰면 서버가 낼 수 있는 출력이 전부 한 요청에 갑니다. 합계도 평균도 86.7입니다.",
  "8개로 나누면 합계는 3.2배로 늘지만 요청 하나의 몫은 34.8로 줄어듭니다.",
  "16개에서 평균은 25.0입니다. 평균은 20을 넘지만 30에는 못 미칩니다.",
  "32개에서 합계는 499.8로 더 늘었지만 평균 15.6은 20 아래로 내려갑니다.",
  "64개에서 합계 742.0은 1개일 때의 8.6배이고 요청 하나는 11.6만 받습니다.",
] as const;

function fmt(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function ConcurrencySweepViz() {
  const scene = useAnimatedScenes(POINTS.length, 3200);
  const point = POINTS[scene.active];
  const per = point.agg / point.c;
  return (
    <VizFrame
      eyebrow="합계와 몫"
      title="동시 요청을 늘리면 합계는 오르고 요청 하나의 몫은 내려갑니다"
      description="8장 서버, 32K 문맥 측정표의 한 행입니다. 아래 막대는 합계를 동시 요청 수로 나눈 평균입니다."
      note="현장 경험 수치(rtx6kpro 위키, K2.6, DCP8+MTP3, 출력 길이 강제)이며 실제 에이전트 트래픽 측정이 아닙니다."
    >
      <div
        role="group"
        tabIndex={0}
        onKeyDown={scene.onKeyDown}
        aria-label="동시 요청 수에 따른 합계 출력과 요청당 평균 출력"
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="hidden grid-cols-5 gap-2 sm:grid">
          {POINTS.map((p, index) => (
            <div
              key={p.c}
              className={`border-t-2 px-1 py-2 text-center text-xs font-bold tabular-nums ${
                scene.active === index ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              C = {p.c}
            </div>
          ))}
        </div>

        <div className="border-border sm:mt-4 sm:border-t sm:pt-4">
          <p className="text-xs font-bold text-muted-foreground">동시에 답을 만드는 요청 <span className="font-mono tabular-nums text-foreground">C = {point.c}</span> (칸 하나가 요청 하나)</p>
          <div className="mt-2 grid max-w-[22rem] grid-cols-16 gap-[3px]" aria-hidden="true">
            {Array.from({ length: 64 }, (_, index) => (
              <span
                key={index}
                className={`aspect-square border transition-colors duration-300 motion-reduce:transition-none ${
                  index < point.c ? "border-primary/70 bg-primary/40" : "border-border bg-background"
                }`}
              />
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-bold text-foreground">서버 합계 출력 <span className="font-normal text-muted-foreground">(끝 = 800)</span></span>
              <span className="shrink-0 whitespace-nowrap font-mono font-bold tabular-nums text-foreground">{fmt(point.agg)} tok/s</span>
            </div>
            <div className="mt-1 h-5 w-full border border-border bg-background">
              <div
                className="h-full bg-[#64748b] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${(point.agg / AGG_SCALE) * 100}%` }}
              />
            </div>
                      </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-bold text-foreground">요청 하나의 평균 = 합계 ÷ C <span className="font-normal text-muted-foreground">(끝 = 100)</span></span>
              <span className="shrink-0 whitespace-nowrap font-mono font-bold tabular-nums text-primary">{fmt(per)} tok/s</span>
            </div>
            <div className="relative mt-4 h-5 w-full border border-border bg-background">
              <div
                className="h-full bg-primary/60 transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${Math.min(100, (per / PER_SCALE) * 100)}%` }}
              />
              {LINES.map((line) => (
                <div key={line.v} className="absolute -top-4 bottom-0" style={{ left: `${line.v}%` }}>
                  <span className="absolute -top-0.5 -translate-x-1/2 text-[10px] font-bold tabular-nums text-[#b45309]">{line.label}</span>
                  <span className="absolute bottom-0 top-3 border-l border-dashed border-[#b45309]" />
                </div>
              ))}
            </div>
                      </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {LINES.map((line) => {
              const pass = per >= line.v;
              return (
                <div
                  key={line.v}
                  className={`border px-1 py-1.5 text-center text-xs font-bold tabular-nums ${
                    pass ? "border-primary/60 text-foreground" : "border-dashed border-[#b45309] text-[#b45309]"
                  }`}
                >
                  ≥ {line.v} {pass ? "충족" : "미달"}
                </div>
              );
            })}
          </div>

          <StableSceneStack
            active={scene.active}
            className="mt-3"
            scenes={NOTES.map((note) => (
              <p key={note} className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scene} labels={labels} />
        <StaticSceneList labels={labels} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
