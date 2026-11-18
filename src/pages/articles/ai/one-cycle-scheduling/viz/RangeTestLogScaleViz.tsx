import SceneShell from "./SceneShell";

/**
 * 본문 대응: #range-test — γ=(η_end/η_start)^(1/R), η_t=η_start·γ^t, t*=min{t: unstable(t)}.
 * 글의 예: 1e−6에서 1까지 올리고 η=.2 부근에서 loss가 급증한다.
 * R=600은 설명용 가정이다. γ=10^(6/600)=10^0.01≈1.0233, 100 updates마다 ×10,
 * η=0.2가 되는 t=600+100·log10(0.2)≈530.
 */
const R = 600;
const DECADES = 6;
const PER_DECADE = R / DECADES;
const T_STAR = Math.round(R + PER_DECADE * Math.log10(0.2));

const W = 400;
const H = 222;
const X0 = 56;
const X1 = 380;
const Y_TOP = 18;
const Y_BOT = 172;
const x = (t: number) => X0 + (t / R) * (X1 - X0);
const y = (log10: number) => Y_BOT - ((log10 + DECADES) / DECADES) * (Y_BOT - Y_TOP);

const SUPER = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶"];
const power = (k: number) => (k === 0 ? "1" : `10⁻${SUPER[k]}`);

const SCENES = [
  {
    label: "한 번에 곱할 비율 γ",
    summary: "γ = (1 ÷ 10⁻⁶)^(1/600) ≈ 1.0233",
    note: "끝 LR 1을 시작 LR 10⁻⁶으로 나누면 10⁶배입니다. 이 배율을 R=600 updates(가정)에 같은 비율로 나누면 γ=10^0.01≈1.0233이고, LR는 update마다 약 2.3%씩 커집니다.",
  },
  {
    label: "γ를 100번 곱하면 10배",
    summary: "t=100 → 10⁻⁶ × 10 = 10⁻⁵",
    note: "η_t=η_start·γ^t에서 γ¹⁰⁰=10¹입니다. 그래서 t=100에서 LR는 10⁻⁵가 됩니다. 더하는 것이 아니라 곱하므로 뒤로 갈수록 한 update에 늘어나는 양 자체가 커집니다.",
  },
  {
    label: "log 축에서는 같은 간격",
    summary: "100 updates마다 한 칸(×10)",
    note: "세로축을 log scale로 그리면 100 updates마다 정확히 한 칸씩 올라가 직선이 됩니다. 10⁻⁶ 근처와 1 근처를 같은 수의 update로 살펴보는 이유입니다.",
  },
  {
    label: "급증이 처음 보인 update t*",
    summary: `η ≈ 0.2 → t* ≈ ${T_STAR}`,
    note: `η=.2 부근에서 처음 급증이 기록됐다면 t*=min{t: unstable(t)}는 600+100·log₁₀0.2≈${T_STAR}입니다. 이 점은 불안정 경계일 뿐 max LR가 아닙니다. 그보다 낮은 여러 max 후보를 독립 validation run에서 비교합니다.`,
  },
] as const;

export default function RangeTestLogScaleViz() {
  return (
    <SceneShell
      eyebrow="Range test 계산"
      title="같은 비율로 곱하면 log 축 위의 직선이 됩니다"
      description="가로축은 진단 run의 update 번호, 세로축은 LR(log scale)입니다. 시작 10⁻⁶, 끝 1, 급증 η≈.2는 글의 예이고 R=600은 계산을 보이려는 가정입니다."
      ariaLabel="Range test에서 LR를 10의 마이너스 6제곱부터 1까지 600 update 동안 같은 비율로 올리는 과정"
      scenes={SCENES}
      render={(active) => {
        const decadeMarks = Array.from({ length: DECADES + 1 }, (_, k) => k);
        const showAllDots = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {decadeMarks.map((k) => (
              <g key={k}>
                <line x1={X0} x2={X1} y1={y(-DECADES + k)} y2={y(-DECADES + k)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 8} y={y(-DECADES + k) + 4} textAnchor="end" className="text-[15px] sm:text-[11px]" fill="#64748b">
                  {power(DECADES - k)}
                </text>
              </g>
            ))}
            <line x1={X0} x2={X1} y1={Y_BOT} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y_TOP} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            {[0, 100, 200, 300, 400, 500, 600].map((t) => (
              <text key={t} x={x(t)} y={Y_BOT + 18} textAnchor="middle" className="text-[15px] sm:text-[11px]" fill="#64748b">
                {t}
              </text>
            ))}
            <text x={X1} y={Y_BOT + 40} textAnchor="end" className="text-[15px] sm:text-[11px]" fill="#64748b">
              update t (R=600, 가정)
            </text>
            <line x1={x(0)} y1={y(-6)} x2={x(R)} y2={y(0)} stroke="#2563eb" strokeWidth={1.25} opacity={active === 0 ? 0.35 : 1} />
            {decadeMarks.map((k) => {
              const t = k * PER_DECADE;
              const isEnd = k === 0 || k === DECADES;
              const isStep = active === 1 && k <= 1;
              const visible = showAllDots || isEnd || isStep;
              return visible ? (
                <circle key={t} cx={x(t)} cy={y(-DECADES + k)} r={isEnd || isStep ? 4.5 : 3.5} fill="#2563eb" />
              ) : null;
            })}
            {active === 1 && (
              <g>
                <line x1={x(0)} y1={y(-6)} x2={x(100)} y2={y(-6)} stroke="#d97706" strokeWidth={1.25} />
                <line x1={x(100)} y1={y(-6)} x2={x(100)} y2={y(-5)} stroke="#d97706" strokeWidth={1.25} />
                <text x={x(100) + 8} y={y(-5.5) + 4} className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#b45309">
                  ×γ¹⁰⁰ = ×10
                </text>
              </g>
            )}
            {active === 2 &&
              [0, 1, 2, 3, 4, 5].map((k) => (
                <text key={k} x={x(k * PER_DECADE + 50)} y={y(-6 + k + 0.5) - 6} textAnchor="middle" className="text-[13px] sm:text-[10px]" fill="#b45309">
                  ×10
                </text>
              ))}
            {active === 0 && (
              <g>
                <text x={x(0) + 8} y={y(-6) - 8} className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#1d4ed8">
                  시작 10⁻⁶
                </text>
                <text x={x(R) - 8} y={y(0) + 16} textAnchor="end" className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#1d4ed8">
                  끝 1
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                <line x1={x(T_STAR)} x2={x(T_STAR)} y1={Y_TOP} y2={Y_BOT} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <circle cx={x(T_STAR)} cy={y(Math.log10(0.2))} r={5} fill="#dc2626" />
                <text x={x(T_STAR) - 8} y={y(Math.log10(0.2)) - 4} textAnchor="end" className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#b91c1c">
                  η≈0.2 급증
                </text>
                <text x={x(T_STAR)} y={Y_TOP - 4} textAnchor="middle" className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#b91c1c">
                  t*≈{T_STAR}
                </text>
                <line x1={X0} x2={x(T_STAR)} y1={y(Math.log10(0.2))} y2={y(Math.log10(0.2))} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <line x1={X0 + 8} x2={X0 + 8} y1={y(Math.log10(0.2)) + 4} y2={y(-1.55)} stroke="#16a34a" strokeWidth={1.25} />
                <path d={`M ${X0 + 4} ${y(-1.55) - 5} L ${X0 + 8} ${y(-1.55) + 1} L ${X0 + 12} ${y(-1.55) - 5}`} fill="none" stroke="#16a34a" strokeWidth={1.25} />
                <text x={X0 + 16} y={y(-1.3)} className="text-[15px] sm:text-[11px]" fontWeight={700} fill="#15803d">
                  max 후보: η≈0.2 선보다 낮은 LR
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
