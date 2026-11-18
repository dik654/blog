import SceneShell from "./SceneShell";

/**
 * 본문 대응: #one-cycle — T=1000, p=.3 → T↑=floor(pT)=300, decay 700.
 * r↑=t/T↑, r↓=(t−T↑)/(T−T↑). t=150 → r↑=.5, t=300 → r↑=1·r↓=0, t=650 → r↓=.5, t=1000 → r↓=1.
 * 개요의 세 번째 질문: micro-batch 횟수가 달라도 optimizer 갱신 수가 같으면 같은 phase 위치.
 * update 하나에 micro-batch 4개·8개를 모으는 두 설정은 설명용 가정이다.
 */
const T = 1000;
const P = 0.3;
const T_UP = Math.floor(P * T);
const T_DOWN = T - T_UP;
const ACCUM = [4, 8] as const;

const SCENES = [
  { t: 150, label: "Rise 한가운데", summary: "r↑ = 150 / 300 = 0.5", note: "Rise phase는 floor(0.3×1000)=300 updates입니다. t=150은 그 절반이므로 r↑=0.5이고, initial→max 보간의 중간에 있습니다." },
  { t: 300, label: "두 phase의 경계", summary: "r↑ = 1 · r↓ = 0", note: "t=300에서 rise local clock이 끝(1)에 닿고 decay local clock이 0에서 시작합니다. 개요의 두 번째 질문처럼 300번째 갱신 부근이 maximum LR 지점입니다." },
  { t: 650, label: "Decay 한가운데", summary: "r↓ = (650 − 300) / 700 = 0.5", note: "Decay는 rise offset 300을 뺀 local step을 남은 길이 700으로 나눕니다. t=650은 전체로는 65% 지점이지만 decay 안에서는 정확히 절반입니다." },
  { t: 1000, label: "Budget 끝", summary: "r↓ = 700 / 700 = 1", note: "T=1000에서 r↓=1이 되어 max→final 보간이 끝납니다. Run 시작 전에 T를 알아야 이 분모 700을 정할 수 있습니다." },
  { t: 300, label: "Micro-batch 수가 달라도", summary: "둘 다 t = 300 updates", note: "update 하나에 micro-batch 4개를 모으든 8개를 모으든(가정) 300번째 optimizer 갱신이면 같은 경계입니다. Micro-batch 수 1,200과 2,400으로 위치를 세면 같은 지점이 다른 곳처럼 보입니다." },
] as const;

const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

function Gauge({ name, value, formula, active }: { name: string; value: number | null; formula: string; active: boolean }) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className={`font-mono font-bold ${active ? "text-foreground" : "text-muted-foreground/60"}`}>{name}</span>
      <div className="min-w-0">
        <div className="h-3 rounded-sm bg-muted/50">
          <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value ?? 0) * 100}%`, backgroundColor: name === "r↑" ? "#2563eb" : "#d97706" }} />
        </div>
        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{formula}</p>
      </div>
      <span className={`text-right font-mono font-bold ${active ? "" : "text-muted-foreground/60"}`}>{value === null ? "−" : fmt(value)}</span>
    </div>
  );
}

export default function PhaseClockViz() {
  return (
    <SceneShell
      eyebrow="Phase local clock"
      title="1,000 updates를 300과 700으로 나누고 각 구간 안에서 다시 0→1로 셉니다"
      description="막대 전체가 optimizer update budget T=1000이고 p=.3입니다. 아래 두 막대는 rise·decay 각각의 local progress입니다."
      ariaLabel="T 1000, p 0.3인 OneCycle에서 update 위치에 따른 rise와 decay local progress"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const t = scene.t;
        const inRise = t <= T_UP;
        const inDecay = t >= T_UP;
        const rUp = inRise ? t / T_UP : null;
        const rDown = inDecay ? (t - T_UP) / T_DOWN : null;
        const microScene = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <div className="relative flex h-9 overflow-hidden rounded-md border border-border text-[11px] font-semibold sm:text-xs">
                <div className="flex items-center justify-center bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200" style={{ width: `${P * 100}%` }}>
                  rise {T_UP}
                </div>
                <div className="flex flex-1 items-center justify-center border-l border-border bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  decay {T_DOWN}
                </div>
                <div className="absolute inset-y-0 w-0.5 bg-red-600 transition-[left] duration-300 motion-reduce:transition-none" style={{ left: `calc(${(t / T) * 100}% - 1px)` }} />
              </div>
              <div className="relative mt-1 h-5 font-mono text-[11px] text-muted-foreground">
                <span className="absolute left-0">0</span>
                <span className="absolute -translate-x-1/2" style={{ left: `${P * 100}%` }}>
                  {T_UP}
                </span>
                <span className="absolute right-0">{T}</span>
              </div>
              <p className="font-mono text-sm font-bold text-red-700 dark:text-red-400">현재 t = {t}</p>
            </div>
            <div className="space-y-2">
              <Gauge name="r↑" value={rUp} formula={rUp === null ? "rise 끝남" : `t / ${T_UP} = ${t} / ${T_UP}`} active={rUp !== null} />
              <Gauge name="r↓" value={rDown} formula={rDown === null ? "decay 시작 전" : `(t − ${T_UP}) / ${T_DOWN} = ${t - T_UP} / ${T_DOWN}`} active={rDown !== null} />
            </div>
            <div className={`grid grid-cols-2 gap-2 text-xs ${microScene ? "" : "opacity-70"}`}>
              {ACCUM.map((count) => (
                <div key={count} className={`rounded-md border px-2 py-2 leading-5 ${microScene ? "border-primary/60" : "border-border"}`}>
                  <span className="block text-muted-foreground">update당 micro-batch {count}개(가정)</span>
                  <span className="block font-mono font-semibold">micro-batch {(t * count).toLocaleString("en-US")}개</span>
                  <span className="block font-mono font-bold">= update {t}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
