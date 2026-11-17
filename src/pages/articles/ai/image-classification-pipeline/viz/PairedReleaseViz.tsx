import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #baseline의 paired gain 식과 release 조건.
 * 가정한 값: seed 41·42·43, baseline 0.812·0.798·0.825, candidate 0.826·0.809·0.821.
 * Δ = +0.014, +0.011, −0.004 → 합 0.021 → 평균 0.007 > 0.
 * latency 한도 40 ms(가정): p95 36 ms → 1×1 = release, p95 47 ms → 1×0 = 보류.
 */

const SEEDS = [
  { seed: "seed 41", base: 0.812, cand: 0.826 },
  { seed: "seed 42", base: 0.798, cand: 0.809 },
  { seed: "seed 43", base: 0.825, cand: 0.821 },
] as const;

const DELTAS = SEEDS.map((row) => Math.round((row.cand - row.base) * 1000) / 1000);
const DELTA_SUM = Math.round(DELTAS.reduce<number>((sum, value) => sum + value, 0) * 1000) / 1000;
const DELTA_MEAN = Math.round((DELTA_SUM / SEEDS.length) * 1000) / 1000;
const BUDGET_MS = 40;

const SCENES = [
  {
    label: "seed끼리 짝짓기",
    summary: "K = 3쌍",
    step: 0,
    p95: null,
    note: "같은 split·같은 seed로 baseline과 candidate를 한 번씩 돌려 한 쌍을 만듭니다. 빈 원이 baseline, 파란 채운 원이 candidate의 품질 지표 q(예: macro recall)입니다. seed 세 개와 모든 값은 가정입니다.",
  },
  {
    label: "짝마다 차이",
    summary: "+0.014 · +0.011 · −0.004",
    step: 1,
    p95: null,
    note: "같은 seed의 두 값끼리 뺍니다. seed 41은 +0.014, seed 42는 +0.011이고, seed 43은 −0.004로 candidate가 더 낮습니다.",
  },
  {
    label: "차이의 평균",
    summary: "0.021 ÷ 3 = +0.007",
    step: 2,
    p95: null,
    note: "세 차이를 더하면 0.021, K=3으로 나누면 0.007입니다. 0보다 크므로 품질 조건 1[Δ̄>0]은 1입니다. 한 seed가 음수여도 판정은 짝지은 차이 전체의 평균으로 합니다.",
  },
  {
    label: "p95가 한도 안",
    summary: "36 ms ≤ 40 ms → 1 × 1 = release",
    step: 3,
    p95: 36,
    note: "p95 latency(응답 시간을 작은 것부터 늘어놓았을 때 95번째 백분위)를 같은 hardware·batch·warmup·concurrency 조건에서 잽니다. 36 ms가 한도 40 ms 안이면 두 조건이 모두 1이라 release합니다(값은 가정).",
  },
  {
    label: "p95가 한도 초과",
    summary: "47 ms > 40 ms → 1 × 0 = 보류",
    step: 3,
    p95: 47,
    note: "품질 조건이 그대로 1이어도 p95가 47 ms로 한도를 넘으면 latency 조건이 0이 되어 곱이 0입니다. Candidate recall이 올라도 release하지 않습니다.",
  },
] as const;

const W = 360;
const AX_L = 70;
const AX_R = 340;
const MIN = 0.79;
const MAX = 0.83;
const ROW_Y = [34, 76, 118];
const sx = (value: number) => AX_L + ((value - MIN) / (MAX - MIN)) * (AX_R - AX_L);
const fmt = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(3)}`;

function PairPlot({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} 178`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="seed별 baseline과 candidate 품질 지표의 짝">
      {[0.79, 0.8, 0.81, 0.82, 0.83].map((tick) => (
        <g key={tick}>
          <line x1={sx(tick)} x2={sx(tick)} y1={16} y2={136} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
          <text x={sx(tick)} y={152} textAnchor="middle" fontSize={10} fill="#64748b">
            {tick.toFixed(2)}
          </text>
        </g>
      ))}
      <g fontSize={10} fill="#64748b">
        <circle cx={AX_L + 4} cy={170} r={4.5} className="fill-background" stroke="#64748b" strokeWidth={1.25} />
        <text x={AX_L + 13} y={173}>baseline (빈 원)</text>
        <circle cx={AX_L + 128} cy={170} r={5} fill="#2563eb" />
        <text x={AX_L + 137} y={173}>candidate (채운 원)</text>
      </g>
      {SEEDS.map((row, index) => {
        const y = ROW_Y[index];
        const delta = DELTAS[index];
        const color = delta >= 0 ? "#2563eb" : "#d97706";
        return (
          <g key={row.seed}>
            <text x={4} y={y + 4} fontSize={11} fontWeight={700} fill="#64748b">
              {row.seed}
            </text>
            {step >= 1 && <line x1={sx(row.base)} x2={sx(row.cand)} y1={y} y2={y} stroke={color} strokeWidth={1.25} />}
            <circle cx={sx(row.base)} cy={y} r={4.5} className="fill-background" stroke="#64748b" strokeWidth={1.25} />
            <circle cx={sx(row.cand)} cy={y} r={5} fill="#2563eb" />
            {step === 0 && (
              <text x={(sx(row.base) + sx(row.cand)) / 2} y={y - 9} textAnchor="middle" fontSize={10} fill="#64748b">
                {row.base.toFixed(3)} / {row.cand.toFixed(3)}
              </text>
            )}
            {step >= 1 && (
              <text x={(sx(row.base) + sx(row.cand)) / 2} y={y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
                Δ {fmt(delta)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Gate({ label, value, detail }: { label: string; value: "1" | "0" | "—"; detail: string }) {
  const tone = value === "1" ? "border-blue-600 text-blue-700 dark:text-blue-300" : value === "0" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground";
  return (
    <div className={`min-w-0 border-l-2 bg-background px-3 py-2 ${tone}`}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-bold">{value}</p>
      <p className="mt-0.5 break-keep text-[11px] leading-4 text-muted-foreground">{detail}</p>
    </div>
  );
}

function GateRow({ step, p95 }: { step: number; p95: number | null }) {
  const quality = step >= 2 ? (DELTA_MEAN > 0 ? "1" : "0") : "—";
  const latency = p95 === null ? "—" : p95 <= BUDGET_MS ? "1" : "0";
  const release = quality === "—" || latency === "—" ? "—" : quality === "1" && latency === "1" ? "1" : "0";
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Gate label="품질 1[Δ̄ > 0]" value={quality} detail={step >= 2 ? `Δ̄ = ${fmt(DELTA_MEAN)}` : "평균 전"} />
      <Gate label={`latency 1[p95 ≤ ${BUDGET_MS} ms]`} value={latency} detail={p95 === null ? "측정 전" : `p95 = ${p95} ms`} />
      <Gate label="release = 두 값의 곱" value={release} detail={release === "1" ? "release함" : release === "0" ? "release하지 않음" : "판정 전"} />
    </div>
  );
}

export default function PairedReleaseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="짝지은 비교와 release 판정"
      title="seed별 차이를 평균내고, latency 한도까지 통과해야 release합니다"
      description="가로축은 품질 지표 q, 한 줄이 같은 seed로 돌린 baseline·candidate 한 쌍입니다. seed 수, 점수, latency 한도 40 ms와 측정값은 모두 설명용 가정입니다."
      documentFlow
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="같은 seed끼리 차이를 내고 평균과 p95 한도로 release를 판정하는 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0 space-y-4">
              <PairPlot step={scene.step} />
              <GateRow step={scene.step} p95={scene.p95} />
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
