import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: how-to-read 절 — "실업률만 내려가고 더 넓은 지표가 그대로이면 … 넷이 함께 내려갔으면".
 * 앞 두 그림과 같은 100명 보기(E=60, U=9, 잠재 노동력 8)에서 실업자 한 명이 움직이는 두 경우.
 * 일을 구함: LU1 8/69=11.6%, LU3 16/77=20.8%.
 * 찾기를 그만둠(여전히 일하고 싶고 당장 가능하다고 가정 → 잠재 노동력): LU1 8/68=11.8%, LU3 17/77=22.1%.
 */
const BASE = { e: 60, u: 9, p: 8 };

const CASES = [
  { e: 60, u: 9, p: 8 },
  { e: 61, u: 8, p: 8 },
  { e: 60, u: 8, p: 9 },
] as const;

const lu1 = (c: { e: number; u: number }) => (c.u / (c.e + c.u)) * 100;
const lu3 = (c: { e: number; u: number; p: number }) => ((c.u + c.p) / (c.e + c.u + c.p)) * 100;

const SCENES = [
  {
    label: "출발점",
    summary: "LU1 13.0% · LU3 22.1%",
    note: "앞 그림의 100명 보기입니다. 일하는 사람 60명, 실업자 9명, 잠재 노동력 8명입니다. 잠재 노동력은 일하고 싶고 당장 가능하지만 찾지 않은 사람처럼 세 문 가운데 하나에서 빠진 사람입니다. LU1은 9 ÷ 69, 잠재 노동력까지 세는 LU3은 (9 + 8) ÷ 77입니다.",
  },
  {
    label: "실업자 한 명이 일을 구했습니다",
    summary: "LU1 11.6% · LU3 20.8%",
    note: "실업자 한 명이 일하는 사람 쪽으로 옮겨 갑니다. 노동력 69명은 그대로이고 분자만 줄어 LU1은 8 ÷ 69입니다. LU3도 (8 + 8) ÷ 77로 함께 내려갑니다. 두 숫자가 같은 방향으로 움직입니다.",
  },
  {
    label: "실업자 한 명이 찾기를 그만뒀습니다",
    summary: "LU1 11.8% · LU3 22.1%",
    note: "출발점으로 돌아가 이번에는 실업자 한 명이 둘째 문에서 빠져 노동력 밖으로 나갑니다. 여전히 일하고 싶고 당장 가능하다고 가정하면 잠재 노동력으로 옮겨 갑니다. LU1은 분자와 분모가 함께 줄어 8 ÷ 68로 내려가지만, LU3은 (8 + 9) ÷ 77로 출발점과 같습니다. 일자리를 얻은 사람은 없습니다.",
  },
] as const;

const SCALE = 25;
const C_RATE = "#0ea5e9";
const C_BASE = "#475569";

function Count({ label, value, before }: { label: string; value: number; before: number }) {
  const diff = value - before;
  return (
    <div className="rounded-lg border border-border bg-background px-2 py-2 text-center">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="block font-mono text-base font-bold">{value}명</span>
      <span className={`block text-xs font-semibold ${diff === 0 ? "text-muted-foreground/60" : "text-sky-700 dark:text-sky-400"}`}>
        {diff === 0 ? "변화 없음" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} (${before}명에서)`}
      </span>
    </div>
  );
}

function RateBar({ label, sub, value, base }: { label: string; sub: string; value: number; base: number }) {
  const width = (value / SCALE) * 100;
  const marker = (base / SCALE) * 100;
  const same = Math.abs(value - base) < 0.05;
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_7.5rem] items-center gap-2 text-xs sm:grid-cols-[5.5rem_minmax(0,1fr)_8.5rem] sm:text-sm">
      <span className="leading-tight">
        <span className="block font-bold">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="h-4 w-full min-w-0" aria-hidden>
        <rect x={0} y={0} width={100} height={16} rx={2} fill="#94a3b8" opacity={0.18} />
        <rect x={0} y={0} width={width} height={16} rx={2} fill={C_RATE} opacity={0.85} />
        <line x1={marker} x2={marker} y1={0} y2={16} stroke={C_BASE} strokeWidth={1} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="text-right font-mono">
        <span className="font-bold">{value.toFixed(1)}%</span>{" "}
        <span className="text-[11px] text-muted-foreground">{same ? "그대로" : `${value < base ? "↓" : "↑"} ${base.toFixed(1)}%에서`}</span>
      </span>
    </div>
  );
}

export default function TwoDeclinesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((s) => s.label);

  return (
    <VizFrame
      eyebrow="같은 하락, 두 경로"
      title="실업률이 내려간 이유는 넓은 지표를 함께 봐야 갈립니다"
      description="앞 그림들과 같은 100명 보기에서 실업자 한 명이 움직입니다. 점선은 출발점의 값입니다."
      note="100명 보기는 설명을 위해 만든 것이고 실제 자료가 아닙니다. 찾기를 그만둔 사람이 여전히 일하고 싶고 당장 가능하다는 것은 이 그림의 가정입니다. LU3은 실업자와 잠재 노동력의 합을 노동력과 잠재 노동력의 합으로 나눈 값입니다(73항 (c))."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실업자 한 명이 일을 구한 경우와 찾기를 그만둔 경우의 LU1과 LU3 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={CASES.map((c, i) => (
            <div key={i} className="min-w-0">
              <div className="grid grid-cols-3 gap-2">
                <Count label="일하는 사람" value={c.e} before={BASE.e} />
                <Count label="실업자" value={c.u} before={BASE.u} />
                <Count label="잠재 노동력" value={c.p} before={BASE.p} />
              </div>
              <div className="mt-4 space-y-3">
                <RateBar label="LU1" sub={`${c.u} ÷ ${c.e + c.u}`} value={lu1(c)} base={lu1(BASE)} />
                <RateBar label="LU3" sub={`${c.u + c.p} ÷ ${c.e + c.u + c.p}`} value={lu3(c)} base={lu3(BASE)} />
              </div>
              <p className="mt-2 text-right text-[11px] text-muted-foreground">막대 끝 = {SCALE}%</p>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
