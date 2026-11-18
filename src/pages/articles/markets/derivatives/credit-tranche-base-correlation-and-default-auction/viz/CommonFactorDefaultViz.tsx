import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 1요인 가우시안 코풀라. 회사 값 X = √ρ·M + √(1−ρ)·Z 가 문턱 Φ⁻¹(PD) 아래면 부도.
 * 회사 10곳의 고유 요인 Z, PD 10%, 공통 요인 M=−2/+1은 모두 설명용 가정입니다.
 * Φ⁻¹(0.10) ≈ −1.28. 부도 수: ρ=0 → 1, ρ=0.3·M=−2 → 4, ρ=0.6·M=−2 → 6, ρ=0.6·M=+1 → 0.
 */
const Z_VALUES = [-1.6, -1.1, -0.8, -0.5, -0.1, 0.2, 0.6, 0.9, 1.2, 1.6] as const;
const THRESHOLD = -1.2816;

const SCENES = [
  { label: "ρ = 0", summary: "M=−2여도 부도 1곳", rho: 0, m: -2, note: "ρ가 0이면 공통 요인 M의 몫이 없어 X는 회사 고유 요인 Z 그대로입니다. 경기가 나빠도(M=−2) 문턱 아래로 내려간 회사는 1곳뿐입니다." },
  { label: "ρ = 0.3, 나쁜 경기", summary: "M=−2 → 부도 4곳", rho: 0.3, m: -2, note: "M에 √0.3≈0.55를 곱한 만큼 모든 회사가 함께 왼쪽으로 밀립니다. 같은 문턱인데 이번에는 4곳이 문턱 아래로 떨어집니다." },
  { label: "ρ = 0.6, 나쁜 경기", summary: "M=−2 → 부도 6곳", rho: 0.6, m: -2, note: "공통 몫이 √0.6≈0.77로 커져 회사들이 더 크게 함께 밀리고 6곳이 부도입니다. 함께 부도나면 손실이 위 구간까지 번질 수 있다는 5절의 말이 이 모양입니다." },
  { label: "ρ = 0.6, 좋은 경기", summary: "M=+1 → 부도 0곳", rho: 0.6, m: 1, note: "같은 ρ라도 M이 좋으면 모두 오른쪽으로 가 부도가 없습니다. 문턱이 그대로라 회사 하나의 부도확률은 10%로 같지만, ρ가 클수록 부도가 나쁜 경기에 몰립니다." },
] as const;

const W = 300;
const LEFT = 14;
const RIGHT = 286;
const ROW = 14;
const TOP = 30;
const AXIS_Y = TOP + Z_VALUES.length * ROW + 6;
const H = AXIS_Y + 34;
const MIN = -3;
const MAX = 2;
const x = (value: number) => LEFT + ((Math.min(Math.max(value, MIN), MAX) - MIN) / (MAX - MIN)) * (RIGHT - LEFT);

export default function CommonFactorDefaultViz() {
  return (
    <SceneShell
      eyebrow="함께 부도나는 정도"
      title="공통 요인의 몫 ρ가 클수록 부도가 한꺼번에 몰립니다"
      description="점 하나가 회사 하나의 값 X = √ρ·M + √(1−ρ)·Z입니다. M은 모든 회사가 함께 받는 경기 충격, Z는 회사마다 다른 고유 충격, ρ는 공통 몫의 크기입니다. X가 빨간 문턱 Φ⁻¹(PD)(부도확률 PD에 해당하는 표준정규 분위수) 왼쪽이면 부도로 봅니다. 회사 10곳, PD 10%, Z와 M 값은 모두 설명용 가정입니다."
      ariaLabel="상관 rho와 공통 요인 M에 따라 문턱 아래로 떨어지는 회사 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values = Z_VALUES.map((z) => Math.sqrt(scene.rho) * scene.m + Math.sqrt(1 - scene.rho) * z);
        const defaults = values.filter((value) => value < THRESHOLD).length;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: 회사 10곳 중 ${defaults}곳 부도`}>
            <rect x={LEFT} y={TOP - 6} width={x(THRESHOLD) - LEFT} height={Z_VALUES.length * ROW + 6} fill="#dc2626" opacity={0.08} />
            <line x1={x(THRESHOLD)} x2={x(THRESHOLD)} y1={TOP - 14} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1.25} />
            <text x={x(THRESHOLD) - 4} y={TOP - 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">부도 쪽</text>
            <text x={x(THRESHOLD) + 4} y={TOP - 16} fontSize={12} fill="#64748b">문턱 Φ⁻¹(10%) ≈ −1.28</text>
            {values.map((value, index) => {
              const isDefault = value < THRESHOLD;
              const cy = TOP + index * ROW + ROW / 2 - 3;
              return (
                <g key={Z_VALUES[index]}>
                  <line x1={LEFT} x2={RIGHT} y1={cy} y2={cy} stroke="#94a3b8" strokeWidth={0.5} opacity={0.4} />
                  <circle
                    cx={x(value)}
                    cy={cy}
                    r={4.5}
                    fill={isDefault ? "#dc2626" : "#93c5fd"}
                    stroke={isDefault ? "#dc2626" : "#2563eb"}
                    strokeWidth={1.25}
                    className="transition-all duration-500 motion-reduce:transition-none"
                  />
                </g>
              );
            })}
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[-3, -2, -1, 0, 1, 2].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 16} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={RIGHT} y={AXIS_Y + 31} textAnchor="end" fontSize={12} fontWeight={700} fill={defaults > 0 ? "#dc2626" : "#2563eb"}>
              10곳 중 부도 {defaults}곳
            </text>
            <text x={LEFT} y={AXIS_Y + 31} fontSize={12} fill="#64748b">회사 값 X</text>
          </svg>
        );
      }}
    />
  );
}
