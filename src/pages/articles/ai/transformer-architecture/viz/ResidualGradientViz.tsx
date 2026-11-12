import SceneShell from "./SceneShell";

/**
 * 본문 대응: #residual-stream — 각 layer update가 gradient를 0.9배로 줄인다는 본문 가정.
 * F만 곱하면 0.9^k: 1층 0.9, 8층 0.430, 16층 0.185, 32층 0.034.
 * Identity 항이 있는 경로는 본문 설명대로 각 layer에서 최소 1배를 보존한다.
 */
const LAYERS = 32;
const RATE = 0.9;
const CURVE = Array.from({ length: LAYERS + 1 }, (_, k) => RATE ** k);
const MARKS = [1, 8, 32];

const SCENES = [
  {
    label: "한 층 지남",
    summary: "1 × 0.9 = 0.9",
    note: "본문 가정대로 layer 하나의 update가 거꾸로 흐르는 gradient를 0.9배로 줄인다고 둡니다. 출력 쪽 gradient를 1로 놓고 입력 쪽으로 한 층씩 지나갑니다.",
  },
  {
    label: "여덟 층",
    summary: "0.9⁸ ≈ 0.430",
    note: "줄어든 값에서 다시 0.9배가 됩니다. 매번 같은 양이 빠지는 것이 아니라 같은 비율이 곱해지므로, 8층만 지나도 절반 아래입니다.",
  },
  {
    label: "32층, F만 곱할 때",
    summary: "0.9³² ≈ 0.034 (3.4%)",
    note: "Residual 없이 F의 Jacobian만 32번 곱하면 처음 gradient의 3.4%만 첫 layer에 도착합니다.",
  },
  {
    label: "Identity 항이 있을 때",
    summary: "∂y/∂x = I + ∂F/∂x",
    note: "y = x + F(x)에서는 Jacobian에 항등 항 I가 그대로 남습니다. 본문 설명대로 이 경로는 각 layer에서 최소 1배를 보존해 32층을 지나도 처음 크기를 유지합니다. F가 작아도 gradient가 완전히 사라지지 않는 이유입니다.",
  },
] as const;

const W = 360;
const H = 200;
const L = 40;
const R = 344;
const TOP = 22;
const BASE = 160;
const x = (k: number) => L + (k / LAYERS) * (R - L);
const y = (v: number) => BASE - v * (BASE - TOP);
const F_COLOR = "#dc2626";
const I_COLOR = "#059669";
const MUTED = "#64748b";

export default function ResidualGradientViz() {
  return (
    <SceneShell
      eyebrow="Gradient 크기"
      title="0.9를 32번 곱하면 3.4%만 남습니다"
      description="가로축 = 출력에서 입력 쪽으로 지난 layer 수, 세로축 = 출력 쪽 gradient를 1로 둔 상대 크기. 0.9배는 본문의 설명용 가정입니다."
      ariaLabel="Residual 없이 0.9배씩 곱해지는 gradient와 identity 경로의 비교"
      scenes={SCENES}
      render={(active) => {
        const upto = active === 0 ? 1 : active === 1 ? 8 : LAYERS;
        const path = CURVE.slice(0, upto + 1)
          .map((v, k) => `${k === 0 ? "M" : "L"}${x(k).toFixed(1)},${y(v).toFixed(1)}`)
          .join(" ");
        const end = CURVE[upto];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={L - 6} y={y(1) + 4} textAnchor="end" fontSize={10} fill={MUTED}>1</text>
            <text x={L - 6} y={y(0.5) + 4} textAnchor="end" fontSize={10} fill={MUTED}>0.5</text>
            <text x={L - 6} y={BASE + 4} textAnchor="end" fontSize={10} fill={MUTED}>0</text>
            {[0, 8, 16, 24, 32].map((k) => (
              <text key={k} x={x(k)} y={BASE + 16} textAnchor="middle" fontSize={10} fill={MUTED}>
                {k}
              </text>
            ))}
            <text x={R} y={BASE + 32} textAnchor="end" fontSize={10} fill={MUTED}>지난 layer 수</text>
            {active === 3 && (
              <>
                <line x1={x(0)} x2={x(LAYERS)} y1={y(1)} y2={y(1)} stroke={I_COLOR} strokeWidth={1.25} />
                <text x={x(LAYERS)} y={y(1) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={I_COLOR}>
                  identity 항 경로: 1배 유지
                </text>
              </>
            )}
            <path d={path} fill="none" stroke={F_COLOR} strokeWidth={1.25} opacity={active === 3 ? 0.5 : 1} />
            {MARKS.filter((k) => k <= upto).map((k) => (
              <g key={k}>
                <circle cx={x(k)} cy={y(CURVE[k])} r={3} fill={F_COLOR} />
                <text x={x(k) + (k === LAYERS ? -4 : 6)} y={y(CURVE[k]) - 7} textAnchor={k === LAYERS ? "end" : "start"} fontSize={11} fontWeight={700} fill={F_COLOR}>
                  {CURVE[k].toFixed(3)}
                </text>
              </g>
            ))}
            <text x={L + 8} y={BASE - 8} fontSize={11} fill={F_COLOR} opacity={active === 3 ? 0.6 : 1}>
              F만 곱함: 0.9^{upto} ≈ {end.toFixed(3)}
            </text>
          </svg>
        );
      }}
    />
  );
}
