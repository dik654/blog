import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison-boundary — 같은 total updates에서 single cosine과 cycle schedule을
 * 비교하고, anytime checkpoint를 final checkpoint와 섞지 않으며 evaluation cadence를 고정한다.
 * 가정: total budget 2,700(=본문의 900 + 1,800), 평가는 900 update마다.
 * single cosine: T=2,700 → t=900에서 r=1/3, a=.75, η=.07525 · t=1,800에서 r=2/3, a=.25, η=.02575.
 * restart: t=900에서 cycle 0 끝 η=.001 · t=1,800에서 cycle 1 중간 η=.0505. t=2,700에서 둘 다 .001.
 */
const ETA_MAX = 0.1;
const ETA_MIN = 0.001;
const T0 = 900;
const END = 2700;
const EVALS = [900, 1800, 2700] as const;

const X0 = 40;
const X1 = 340;
const Y_TOP = 22;
const Y_BOTTOM = 132;

const x = (t: number) => X0 + ((X1 - X0) * t) / END;
const y = (eta: number) => Y_BOTTOM - ((Y_BOTTOM - Y_TOP) * (eta - ETA_MIN)) / (ETA_MAX - ETA_MIN);
const cosineEta = (r: number) => ETA_MIN + ((ETA_MAX - ETA_MIN) * (1 + Math.cos(Math.PI * r))) / 2;
const singleEta = (t: number) => cosineEta(t / END);
const restartEta = (t: number) => (t <= T0 ? cosineEta(t / T0) : cosineEta((t - T0) / (END - T0)));

const path = (fn: (t: number) => number, from: number, to: number) =>
  Array.from({ length: 81 }, (_, i) => {
    const t = from + ((to - from) * i) / 80;
    return `${i === 0 ? "M" : "L"}${x(t).toFixed(1)} ${y(fn(t)).toFixed(1)}`;
  }).join(" ");

const SCENES = [
  {
    label: "같은 total updates",
    summary: "900 + 1,800 = 2,700 (가정)",
    note: "restart 두 cycle의 합이 2,700입니다. single cosine도 2,700 update 한 cycle로 맞추고 초기값·optimizer·data order를 고정합니다.",
  },
  {
    label: "같은 시각에 평가 (900마다, 가정)",
    summary: "t=900: ≈.0753 vs .001",
    note: "t=900에 single은 1/3 지점(≈.0753), restart는 cycle 끝(.001)입니다. t=1,800에는 ≈.0258과 .0505로 LR phase가 서로 다릅니다. 이 시각의 값은 anytime checkpoint라 final checkpoint와 같은 의미로 섞지 않습니다.",
  },
  {
    label: "final checkpoint t=2,700",
    summary: "둘 다 η=.001",
    note: "마지막 update 뒤 checkpoint는 두 run 모두 ηmin에 있습니다. 최종 비교는 이 checkpoint끼리 같은 selection rule로 합니다.",
  },
] as const;

export default function SameBudgetViz() {
  return (
    <SceneShell
      eyebrow="같은 compute"
      title="같은 2,700 update 안에서 두 곡선을 겹쳐 봅니다"
      description="본문 예의 900·1,800 cycle을 합친 2,700 update를 total budget으로 가정했습니다. 점선 세로줄은 900 update마다의 평가 시각(가정)입니다. 어느 곡선이 더 낫다는 그림이 아닙니다."
      ariaLabel="같은 total update에서 single cosine과 warm restart의 learning rate와 평가 시각 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <svg width="22" height="6" aria-hidden>
                <line x1="0" x2="22" y1="3" y2="3" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              </svg>
              single cosine (T=2,700)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="22" height="6" aria-hidden>
                <line x1="0" x2="22" y1="3" y2="3" stroke="#2563eb" strokeWidth={1.25} />
              </svg>
              warm restart (900 → 1,800)
            </span>
          </div>
          <svg
            viewBox="0 0 360 166"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
            className="mx-auto block h-auto w-full max-w-[560px] text-foreground"
          >
            <text x={X0 - 6} y={Y_TOP + 4} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">.1</text>
            <text x={X0 - 6} y={Y_BOTTOM + 4} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">.001</text>
            <line x1={X0} x2={X1} y1={Y_BOTTOM} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y_TOP} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {EVALS.map((t) => {
              const lit = (active === 1 && t < END) || (active === 2 && t === END);
              return (
                <g key={t} opacity={active === 0 ? 0.25 : lit ? 1 : 0.35}>
                  <line x1={x(t)} x2={x(t)} y1={Y_TOP - 8} y2={Y_BOTTOM} stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
                  <text x={x(t)} y={Y_BOTTOM + 13} textAnchor={t === END ? "end" : "middle"} className="text-[14px] sm:text-[9px]" fill="#64748b">
                    {t.toLocaleString("en-US")}
                  </text>
                </g>
              );
            })}
            <text x={X0} y={Y_BOTTOM + 13} textAnchor="middle" className="text-[14px] sm:text-[9px]" fill="#64748b">0</text>
            <path d={path(singleEta, 0, END)} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
            <path d={path(restartEta, 0, T0)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <path d={path((t) => cosineEta((t - T0) / (END - T0)), T0, END)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {active > 0 &&
              EVALS.filter((t) => (active === 1 ? t < END : t === END)).map((t) => (
                <g key={t}>
                  <circle cx={x(t)} cy={y(singleEta(t))} r={3.5} fill="#d97706" />
                  <circle cx={x(t)} cy={y(restartEta(t))} r={3.5} fill="#2563eb" />
                </g>
              ))}
            <text x={X1} y={160} textAnchor="end" className="text-[15px] sm:text-[10px]" fontWeight={700} fill="currentColor">
              {active === 0
                ? "가로축: optimizer update (총 2,700, 가정)"
                : active === 1
                  ? "anytime: t=900·1,800 (LR phase 서로 다름)"
                  : "final: t=2,700 (둘 다 ηmin)"}
            </text>
          </svg>
        </div>
      )}
    />
  );
}
