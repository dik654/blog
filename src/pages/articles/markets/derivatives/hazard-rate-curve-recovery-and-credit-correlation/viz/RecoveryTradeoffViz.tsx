import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits 첫 문단 — 회수율과 세기는 서로 대신 움직여 같은 가격을 만든다(5절의 회수 40%→20%).
 * 1절의 단순 근사: 보호료 ≈ 세기 × 손실률. 보호료 1.2%를 고정하면
 * 회수 40%: 손실률 60%, 세기 2%, 1년 부도확률 1−e^(−0.02)≈1.98%
 * 회수 20%: 손실률 80%, 세기 1.5%, 1년 부도확률 1−e^(−0.015)≈1.49%
 */
const PREMIUM = 1.2;
const lambdaFor = (lossRate: number) => (PREMIUM / lossRate) * 100;
const pd = (lambda: number) => (1 - Math.exp(-lambda / 100)) * 100;

const CASES = [
  { recovery: 40, lossRate: 60 },
  { recovery: 20, lossRate: 80 },
] as const;
const POINTS = CASES.map((item) => ({ ...item, lambda: lambdaFor(item.lossRate), pd: pd(lambdaFor(item.lossRate)) }));
const pct = (value: number, digits = 1) => `${Number(value.toFixed(digits))}%`;

const SCENES = [
  {
    label: "회수 40%",
    summary: `손실률 60% × 세기 ${pct(POINTS[0].lambda)} = 1.2%`,
    note: `1절의 단순 근사는 보호료 ≈ 부도 도착 세기 × 손실률입니다. 그림의 직사각형 넓이가 그 곱이고, 회수 40%면 손실률 60% × 세기 2% = 1.2%입니다. 이때 1년 부도확률은 약 ${pct(POINTS[0].pd, 2)}입니다.`,
  },
  {
    label: "회수 20%로 바꾸면",
    summary: `손실률 80% × 세기 ${pct(POINTS[1].lambda)} = 1.2%`,
    note: `5절처럼 회수를 20%로 바꾸면 손실률은 80%가 됩니다. 같은 보호료 1.2%를 설명하려면 세기는 1.2% ÷ 80% = 1.5%로 내려가고, 1년 부도확률도 약 ${pct(POINTS[1].pd, 2)}로 바뀝니다. 넓이는 그대로입니다.`,
  },
  {
    label: "같은 보호료를 내는 모든 짝",
    summary: "보호료 1.2% 하나 ↔ 곡선 위 여러 점",
    note: "곡선 위의 점은 모두 넓이 1.2%인 짝입니다. 보호료 하나만 보면 회수 40%·세기 2%인지 회수 20%·세기 1.5%인지 가르기 어렵습니다. 그래서 10절은 회수율과 세기를 동시에 안정적으로 추정하기 어렵다고 말합니다. 위험보상·유동성은 이 근사에서 뺐습니다.",
  },
] as const;

const W = 360;
const H = 224;
const X0 = 48;
const X1 = 344;
const Y0 = 186;
const Y1 = 18;
const MAX_L = 4.5;
const px = (lossRate: number) => X0 + (lossRate / 100) * (X1 - X0);
const py = (lambda: number) => Y0 - (lambda / MAX_L) * (Y0 - Y1);
const CURVE = Array.from({ length: 74 }, (_, index) => 27 + index)
  .map((lossRate, index) => `${index === 0 ? "M" : "L"}${px(lossRate).toFixed(1)},${py(lambdaFor(lossRate)).toFixed(1)}`)
  .join(" ");
const COLORS = ["#2563eb", "#d97706"] as const;

export default function RecoveryTradeoffViz() {
  return (
    <SceneShell
      eyebrow="회수율과 세기"
      title="회수율이 바뀌면 같은 보호료를 다른 세기가 설명합니다"
      description="가로축은 손실률(1 − 회수율), 세로축은 연 부도 도착 세기입니다. 1절의 단순 근사(보호료 ≈ 세기 × 손실률)와 보호료 1.2%를 그대로 씁니다."
      ariaLabel="보호료 1.2퍼센트를 만드는 손실률과 세기의 짝: 60퍼센트와 2퍼센트, 80퍼센트와 1.5퍼센트"
      scenes={SCENES}
      render={(active) => {
        const shown = active === 2 ? [0, 1] : [active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 2, 3, 4].map((tick) => (
              <g key={`y${tick}`}>
                <line x1={X0} x2={X1} y1={py(tick)} y2={py(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={py(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}%</text>
              </g>
            ))}
            {[0, 20, 40, 60, 80, 100].map((tick) => (
              <text key={`x${tick}`} x={px(tick)} y={Y0 + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}%</text>
            ))}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            <text x={X1} y={Y0 + 32} textAnchor="end" fontSize={10} fill="#64748b">손실률 →</text>
            <text x={X0 + 4} y={Y1 + 10} fontSize={10} fill="#64748b">세기</text>
            {active === 2 && <path d={CURVE} fill="none" stroke="#475569" strokeWidth={1.25} />}
            {active === 2 && (
              <text x={px(33)} y={py(lambdaFor(33)) - 4} fontSize={10} fill="#475569">넓이 1.2%인 짝</text>
            )}
            {shown.map((index) => {
              const point = POINTS[index];
              const color = COLORS[index];
              return (
                <g key={point.recovery}>
                  <rect x={X0} y={py(point.lambda)} width={px(point.lossRate) - X0} height={Y0 - py(point.lambda)} fill={color} fillOpacity={active === 2 ? 0.08 : 0.18} stroke={color} strokeWidth={1} />
                  <circle cx={px(point.lossRate)} cy={py(point.lambda)} r={4} fill={color} />
                  <text x={index === 1 ? X1 : px(point.lossRate) + 6} y={py(point.lambda) + (index === 1 ? 22 : -6)} textAnchor={index === 1 ? "end" : "start"} fontSize={10} fontWeight={700} fill={color}>
                    회수 {point.recovery}% · 세기 {pct(point.lambda)}
                  </text>
                  {active !== 2 && (
                    <text x={(X0 + px(point.lossRate)) / 2} y={(py(point.lambda) + Y0) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
                      넓이 = 1.2%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
