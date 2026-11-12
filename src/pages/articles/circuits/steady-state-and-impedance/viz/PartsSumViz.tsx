import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 같은 전류가 흐르는 저항과 축전기의 전압은 서로 다른 순간에 최대가 된다.
 * 1 kΩ·1 µF·ω=1000 rad/s(가정) 정상 상태: 입력 5cos(ωt), 축전기 3.54cos(ωt−45°),
 * 저항 = 입력 − 축전기 = 3.54cos(ωt+45°)(9절 전류 3.54 mA × 1 kΩ). t는 ms이며 ωt[rad] = t[ms].
 * 순간 합은 언제나 입력과 같지만 최대 진폭끼리 더하면 7.08 V로 입력 최대 5 V와 다르다.
 */
const AMP_IN = 5;
const AMP_PART = 5 / Math.SQRT2;
const vin = (t: number) => AMP_IN * Math.cos(t);
const vc = (t: number) => AMP_PART * Math.cos(t - Math.PI / 4);
const vr = (t: number) => AMP_PART * Math.cos(t + Math.PI / 4);
const f2 = (value: number) => (Math.abs(value) < 0.005 ? 0 : value).toFixed(2);

const T0 = -Math.PI / 2;
const T1 = (3 * Math.PI) / 2;
const X0 = 34;
const X1 = 346;
const MID = 98;
const VSCALE = 14;
const px = (t: number) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);
const py = (v: number) => MID - v * VSCALE;
const path = (fn: (t: number) => number) =>
  Array.from({ length: 121 }, (_, index) => {
    const t = T0 + ((T1 - T0) * index) / 120;
    return `${index ? "L" : "M"}${px(t).toFixed(1)} ${py(fn(t)).toFixed(1)}`;
  }).join(" ");

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const SLATE = "#64748b";
const LINE = "#94a3b8";
const RED = "#dc2626";

const SCENES = [
  { label: "입력 봉우리보다 0.785 ms 전", summary: "저항 전압이 최대", t: -Math.PI / 4, note: "저항 전압은 전류 × 1 kΩ이므로 이 순간 전류도 가장 큽니다. 그런데 축전기 전압은 0입니다. 전류가 가장 클 때 축전기 전압도 가장 크지 않습니다." },
  { label: "입력 봉우리", summary: "2.50 + 2.50 = 5.00 V", t: 0, note: "입력이 5 V로 가장 큰 순간에도 두 부품은 각각 약 2.50 V씩 나눠 가집니다. 어느 쪽도 자기 최대에 있지 않습니다." },
  { label: "입력 봉우리보다 0.785 ms 뒤", summary: "축전기 전압이 최대", t: Math.PI / 4, note: "이제 축전기가 약 3.54 V로 가장 크고 저항 전압은 0입니다. 세 순간 모두 두 부품의 순간 합이 입력과 같습니다." },
  { label: "최대 진폭끼리 더하면", summary: "3.54 + 3.54 = 7.08 V ≠ 5 V", t: null, note: "두 최대는 서로 다른 순간에 오므로, 그대로 더한 7.08 V는 입력 최대 5 V와 맞지 않습니다." },
] as const;

function Legend() {
  const items = [
    { label: "입력", color: BLUE, dash: undefined },
    { label: "축전기", color: AMBER, dash: undefined },
    { label: "저항", color: GREEN, dash: "5 3" },
  ];
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <svg width="22" height="8" aria-hidden="true">
            <line x1="1" x2="21" y1="4" y2="4" stroke={item.color} strokeWidth={item.label === "입력" ? 1.25 : 1} strokeDasharray={item.dash} />
          </svg>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Readout({ t }: { t: number | null }) {
  const rows =
    t === null
      ? [
          { label: "저항 최대", value: `${f2(AMP_PART)} V`, tone: "" },
          { label: "축전기 최대", value: `${f2(AMP_PART)} V`, tone: "" },
          { label: "단순히 더한 값", value: `${(Number(f2(AMP_PART)) * 2).toFixed(2)} V`, tone: "text-red-700 dark:text-red-400 font-bold" },
          { label: "입력 최대", value: `${f2(AMP_IN)} V`, tone: "font-bold" },
        ]
      : [
          { label: "저항", value: `${f2(vr(t))} V`, tone: "" },
          { label: "축전기", value: `${f2(vc(t))} V`, tone: "" },
          { label: "두 부품 합", value: `${f2(vr(t) + vc(t))} V`, tone: "font-bold" },
          { label: "그 순간 입력", value: `${f2(vin(t))} V`, tone: "font-bold" },
        ];
  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4 sm:text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex min-w-0 items-baseline justify-between gap-2 border-b border-border/60 py-1">
          <span className="text-muted-foreground">{row.label}</span>
          <span className={`font-mono ${row.tone}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function PartsSumViz() {
  return (
    <SceneShell
      eyebrow="같은 전류, 다른 봉우리"
      title="두 부품은 같은 순간에 가장 커지지 않습니다"
      description="가정한 1 kΩ 저항과 1 µF 축전기를 한 주기 약 6.28 ms로 계속 흔들어 반복이 안정된 뒤를 봅니다. 저항 전압은 입력에서 축전기 전압을 빼서 구했고, 그 최대 진폭 3.54 V는 9절의 전류 3.54 mA × 1 kΩ과 같습니다."
      ariaLabel="저항 전압과 축전기 전압이 최대가 되는 순간이 다르다는 것을 세 순간과 최대 진폭 합으로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const t = scene.t;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={X0} x2={X1} y1={MID} y2={MID} stroke={LINE} strokeWidth={1} />
              <text x={X0 - 4} y={py(5) + 4} textAnchor="end" fontSize={9} fill={SLATE}>5</text>
              <text x={X0 - 4} y={MID + 3} textAnchor="end" fontSize={9} fill={SLATE}>0</text>
              <text x={X0 - 4} y={py(-5) + 4} textAnchor="end" fontSize={9} fill={SLATE}>−5</text>
              <line x1={X0} x2={X0 + 3} y1={py(5)} y2={py(5)} stroke={LINE} strokeWidth={1} />
              <line x1={X0} x2={X0 + 3} y1={py(-5)} y2={py(-5)} stroke={LINE} strokeWidth={1} />
              <path d={path(vin)} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <path d={path(vc)} fill="none" stroke={AMBER} strokeWidth={1} />
              <path d={path(vr)} fill="none" stroke={GREEN} strokeWidth={1} strokeDasharray="5 3" />
              {t === null ? (
                <>
                  <line x1={X0} x2={X1} y1={py(AMP_PART)} y2={py(AMP_PART)} stroke={RED} strokeWidth={1} strokeDasharray="2 3" />
                  <circle cx={px(-Math.PI / 4)} cy={py(AMP_PART)} r={3.5} fill={GREEN} />
                  <circle cx={px(Math.PI / 4)} cy={py(AMP_PART)} r={3.5} fill={AMBER} />
                  <circle cx={px(0)} cy={py(5)} r={3.5} fill={BLUE} />
                  <text x={X1} y={py(AMP_PART) - 5} textAnchor="end" fontSize={10} fill={RED}>두 부품의 최대 3.54 V</text>
                </>
              ) : (
                <>
                  <line x1={px(t)} x2={px(t)} y1={py(5.6)} y2={py(-5.6)} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={px(t)} cy={py(vin(t))} r={3.5} fill={BLUE} />
                  <circle cx={px(t)} cy={py(vc(t))} r={3.5} fill={AMBER} />
                  <circle cx={px(t)} cy={py(vr(t))} r={3.5} fill="#ffffff" stroke={GREEN} strokeWidth={1.25} />
                </>
              )}
              {[-Math.PI / 4, 0, Math.PI / 4].map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={py(-5.6)} y2={py(-5.6) + 4} stroke={LINE} strokeWidth={1} />
                  <text x={px(tick)} y={py(-5.6) + 16} textAnchor="middle" fontSize={9} fill={SLATE}>
                    {tick === 0 ? "0" : `${tick < 0 ? "−" : "+"}0.785`}
                  </text>
                </g>
              ))}
              <text x={X1} y={py(-5.6) + 16} textAnchor="end" fontSize={9} fill={SLATE}>ms, 입력 봉우리 기준</text>
            </svg>
            <Legend />
            <Readout t={t} />
          </div>
        );
      }}
    />
  );
}
