import SceneShell from "./SceneShell";

/**
 * 본문 대응: #components — "반복되는 AR dynamics는 p보다 긴 impulse response를 만들고",
 * "AR(1)에서는 |φ₁|<1이라는 단순 조건".
 * t=0에 ε=1 하나만 넣고 이후 ε=0으로 둔다(c=0).
 * MA(1) Zₜ=εₜ+θεₜ₋₁ → 1, θ, 0, 0 …
 * AR(1) Zₜ=φZₜ₋₁+εₜ → φ^k
 * 계수 0.6·−0.6·1은 그림을 위한 가정.
 */
const LAGS = 7;

const SCENES = [
  {
    label: "MA(1), θ₁=0.6 (가정)",
    summary: "1 → 0.6 → 0 → 0 …",
    kind: "ma",
    coef: 0.6,
    note: "MA(1)은 지금 충격 εₜ와 직전 충격 εₜ₋₁만 읽습니다. t=0의 충격은 t=1에 θ₁=0.6만큼 남고, t=2부터는 식에 그 충격이 들어갈 자리가 없어 정확히 0입니다.",
  },
  {
    label: "AR(1), φ₁=0.6 (가정)",
    summary: "1 → 0.6 → 0.36 → 0.22 …",
    kind: "ar",
    coef: 0.6,
    note: "AR(1)은 직전 값 하나(p=1)만 읽지만, 직전 값 안에 이미 충격이 들어 있습니다. 그래서 0.6을 거듭 곱하며 p=1보다 훨씬 긴 꼬리를 남깁니다. p는 기억 길이가 아니라 읽는 칸 수입니다.",
  },
  {
    label: "AR(1), φ₁=−0.6 (가정)",
    summary: "1 → −0.6 → 0.36 → −0.22 …",
    kind: "ar",
    coef: -0.6,
    note: "계수가 음수면 부호를 바꿔 가며 줄어듭니다. 위로 튄 다음 시점에 반대로 당겨지는 mean reversion 모양입니다. |φ₁|<1이므로 여전히 0으로 사라집니다.",
  },
  {
    label: "AR(1), φ₁=1 (가정)",
    summary: "1 → 1 → 1 → 1 …",
    kind: "ar",
    coef: 1,
    note: "|φ₁|<1 조건을 벗어나면 충격이 줄지 않고 계속 남습니다. Dickey–Fuller가 다룬 unit root 경계가 이 값이며, 이런 level series는 먼저 차분해 ARMA가 다룰 변화량으로 바꿉니다.",
  },
] as const;

function response(kind: "ma" | "ar", coef: number): number[] {
  return Array.from({ length: LAGS }, (_, k) => {
    if (kind === "ma") return k === 0 ? 1 : k === 1 ? coef : 0;
    return coef ** k;
  });
}

const W = 360;
const H = 190;
const LEFT = 34;
const RIGHT = 12;
const ZERO_Y = 100;
const UNIT = 66;
const SLOT = (W - LEFT - RIGHT) / LAGS;
const BAR_W = 22;

function fmt(value: number): string {
  if (Math.abs(value) < 1e-9) return "0";
  const rounded = Math.round(value * 100) / 100;
  return rounded < 0 ? `−${Math.abs(rounded)}` : `${rounded}`;
}

export default function ImpulseResponseViz() {
  return (
    <SceneShell
      eyebrow="충격 하나의 꼬리"
      title="p와 q는 몇 칸을 읽는지이고, 충격이 얼마나 오래 남는지는 따로 정해집니다"
      description="t=0에 innovation(예측하지 못한 새 충격) ε=1을 한 번 넣고 그 뒤로는 0을 넣었을 때 Zₜ가 어떻게 반응하는지 막대로 그렸습니다(상수 c=0). 계수 값은 모양을 보이려는 가정입니다."
      ariaLabel="MA(1)과 AR(1)에 단위 충격 하나를 넣었을 때 lag별 반응"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values = response(scene.kind, scene.coef);
        const barColor = scene.kind === "ma" ? "#d97706" : "#2563eb";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y - UNIT} y2={ZERO_Y - UNIT} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y + UNIT} y2={ZERO_Y + UNIT} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={LEFT - 6} y={ZERO_Y - UNIT + 4} textAnchor="end" fontSize={10} fill="#64748b">1</text>
            <text x={LEFT - 6} y={ZERO_Y + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
            <text x={LEFT - 6} y={ZERO_Y + UNIT + 4} textAnchor="end" fontSize={10} fill="#64748b">−1</text>
            {values.map((value, k) => {
              const cx = LEFT + SLOT * k + SLOT / 2;
              const h = Math.abs(value) * UNIT;
              const y = value >= 0 ? ZERO_Y - h : ZERO_Y;
              const labelY = value >= 0 ? ZERO_Y - h - 5 : ZERO_Y + h + 13;
              return (
                <g key={k}>
                  {h > 0.5 ? (
                    <rect x={cx - BAR_W / 2} y={y} width={BAR_W} height={h} rx={2} fill={barColor} opacity={k === 0 ? 0.95 : 0.7} />
                  ) : (
                    <circle cx={cx} cy={ZERO_Y} r={2.5} fill="#94a3b8" />
                  )}
                  <text x={cx} y={h > 0.5 ? labelY : ZERO_Y - 7} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">
                    {fmt(value)}
                  </text>
                  <text x={cx} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">
                    t={k}
                  </text>
                </g>
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
