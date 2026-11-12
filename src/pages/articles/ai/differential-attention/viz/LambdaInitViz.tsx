import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 의 λ 재매개변수화 식 — λinit = 0.8 − 0.6·exp(−0.3(l−1)).
 * l=1 → 0.2, l=6 → 0.666…(≈0.67), l=12 → 0.778. 층 범위 1~12는 그림을 위한 가정이다.
 */
const LAYERS = Array.from({ length: 12 }, (_, i) => i + 1);
const lambdaInit = (l: number) => 0.8 - 0.6 * Math.exp(-0.3 * (l - 1));

const SCENES = [
  {
    label: "layer 1은 0.2에서 시작합니다",
    summary: "0.8 − 0.6 × e⁰ = 0.2",
    focus: 1,
    note: "l=1이면 지수 항이 e⁰=1이라 0.8에서 0.6을 통째로 뺍니다. 그래서 얕은 층은 noise map을 약하게 지우는 0.2에서 시작합니다.",
  },
  {
    label: "layer 6은 약 0.67입니다",
    summary: `0.8 − 0.6 × e^(−1.5) ≈ ${lambdaInit(6).toFixed(2)}`,
    focus: 6,
    note: "층이 깊어질수록 지수 항이 빠르게 작아져 빼는 몫이 줄어듭니다. layer 6에서는 0.6 × 0.22 ≈ 0.13만 빠져 약 0.67이 됩니다.",
  },
  {
    label: "깊어질수록 0.8에 다가갑니다",
    summary: `layer 12 ≈ ${lambdaInit(12).toFixed(2)} · 0.8 미만`,
    focus: 12,
    note: "지수 항은 0에 가까워질 뿐 0이 되지 않으므로 λinit은 0.8 아래에서 점점 평평해집니다. 층마다 정해지는 상수이고 학습되지는 않습니다.",
  },
] as const;

const W = 360;
const H = 220;
const X0 = 40;
const X1 = 344;
const Y0 = 180;
const Y1 = 24;
const x = (l: number) => X0 + ((l - 1) / 11) * (X1 - X0);
const y = (v: number) => Y0 - v * (Y0 - Y1);
const CURVE = LAYERS.map((l) => `${x(l).toFixed(1)},${y(lambdaInit(l)).toFixed(1)}`).join(" ");

export default function LambdaInitViz() {
  return (
    <SceneShell
      eyebrow="λinit"
      title="λinit은 얕은 층 0.2에서 깊은 층 0.8 쪽으로 커집니다"
      description="가로축은 층 번호 l, 세로축은 λinit = 0.8 − 0.6·exp(−0.3(l−1))입니다. λinit은 λ의 층별 시작값 상수입니다."
      note="층을 12개까지 그린 것은 그림을 위한 가정입니다. 값은 모두 본문의 식으로 계산했습니다."
      ariaLabel="층 번호에 따라 λinit이 0.2에서 0.8 쪽으로 커지는 곡선"
      scenes={SCENES}
      render={(active) => {
        const f = SCENES[active].focus;
        const v = lambdaInit(f);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => (
              <g key={t}>
                <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke={t === 0.8 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} strokeDasharray={t === 0.8 ? "4 3" : undefined} />
                <text x={X0 - 8} y={y(t) + 4} textAnchor="end" fontSize={12} fill="#64748b">
                  {t.toFixed(1)}
                </text>
              </g>
            ))}
            <text x={X1} y={y(0.8) - 6} textAnchor="end" fontSize={12} fill="#64748b">
              0.8 (닿지 않음)
            </text>
            <polyline points={CURVE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {LAYERS.map((l) => (
              <g key={l}>
                <circle cx={x(l)} cy={y(lambdaInit(l))} r={l === f ? 5 : 2.5} fill={l === f ? "#2563eb" : "#93c5fd"} />
                {(l === 1 || l === 6 || l === 12 || l % 3 === 0) && (
                  <text x={x(l)} y={Y0 + 16} textAnchor="middle" fontSize={12} fill={l === f ? "#1e293b" : "#64748b"} fontWeight={l === f ? 700 : 400}>
                    {l}
                  </text>
                )}
              </g>
            ))}
            <line x1={x(f)} x2={x(f)} y1={y(v)} y2={Y0} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
            <text x={x(f) + (f === 12 ? -8 : 8)} y={y(v) + 18} textAnchor={f === 12 ? "end" : "start"} fontSize={14} fontWeight={700} fill="#2563eb">
              l={f} → {v.toFixed(2)}
            </text>
            <text x={X1} y={Y0 + 34} textAnchor="end" fontSize={12} fill="#64748b">
              층 번호 l
            </text>
          </svg>
        );
      }}
    />
  );
}
