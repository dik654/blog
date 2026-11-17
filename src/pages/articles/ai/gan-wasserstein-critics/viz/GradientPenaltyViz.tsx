import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gradient-penalty — x̂ = εx + (1−ε)x̃, penalty = λ(∥∇f(x̂)∥₂ − 1)².
 * λ=10, 기울기 1.5 → 10×0.5² = 2.5 (본문 예). 0.5 → 2.5, 2 → 10은 같은 식의 계산.
 * ε=0.3, 0.8, 0.55와 각 지점의 기울기 값은 그림을 위한 가정입니다.
 */
const LAMBDA = 10;
const penalty = (s: number) => LAMBDA * (s - 1) ** 2;

const SCENES = [
  {
    label: "x̂ 하나 뽑기",
    summary: "ε=0.3 → x̂ = 0.3x + 0.7x̃",
    eps: [0.3],
    slope: null,
    note: "실제 x와 생성 x̃를 잇는 선분에서 한 점을 뽑습니다. ε=0.3(가정)이면 x에 0.3, x̃에 0.7을 곱해 더하므로 x̂는 x에서 x̃ 쪽으로 70% 간 자리에 놓입니다.",
  },
  {
    label: "기울기 1.5",
    summary: "10 × (1.5−1)² = 2.5",
    eps: [0.3],
    slope: 1.5,
    note: "x̂에서 critic을 입력으로 미분한 gradient의 norm이 1.5라고 하면 목표 1과의 차이는 0.5, 제곱은 0.25, λ=10을 곱하면 penalty 2.5입니다. 본문의 작은 예와 같은 값입니다.",
  },
  {
    label: "기울기 0.5",
    summary: "10 × (0.5−1)² = 2.5",
    eps: [0.3],
    slope: 0.5,
    note: "기울기가 목표보다 0.5 작아도 차이 −0.5를 제곱하면 0.25이므로 penalty는 똑같이 2.5입니다. 제곱 때문에 어느 방향의 벗어남도 양의 cost가 됩니다.",
  },
  {
    label: "기울기 2",
    summary: "10 × (2−1)² = 10",
    eps: [0.3],
    slope: 2,
    note: "벗어난 정도가 0.5에서 1로 두 배가 되면 penalty는 2.5에서 10으로 네 배가 됩니다. 큰 위반일수록 더 세게 벌하는 모양입니다.",
  },
  {
    label: "다음 batch",
    summary: "ε를 새로 뽑아 선분 위 다른 점",
    eps: [0.8, 0.55],
    slope: null,
    note: "다음 batch마다 ε를 새로 뽑습니다(여기서는 두 번 뽑은 0.8과 0.55, 가정). 그래서 penalty가 재는 곳은 real–fake 선분 위의 표본 위치뿐이고, 이것만으로 전체 입력 공간의 1-Lipschitz가 증명되지는 않습니다.",
  },
] as const;

const W = 360;
const H = 252;
const SEG_Y = 34;
const SEG_L = 44;
const SEG_R = 316;
const GX0 = 54;
const GX1 = 330;
const S_MAX = 2.15;
const GY0 = 226;
const P_MAX = 12.5;
const GY1 = 96;
const gx = (s: number) => GX0 + (s / S_MAX) * (GX1 - GX0);
const gy = (p: number) => GY0 - (p / P_MAX) * (GY0 - GY1);
const CURVE = Array.from({ length: 44 }, (_, i) => (i / 43) * 2.1)
  .map((s, i) => `${i === 0 ? "M" : "L"}${gx(s).toFixed(1)} ${gy(penalty(s)).toFixed(1)}`)
  .join(" ");

export default function GradientPenaltyViz() {
  return (
    <SceneShell
      eyebrow="gradient penalty 한 표본"
      title="선분 위 한 점에서 기울기를 재고, 1에서 벗어난 만큼 제곱해 벌합니다"
      description="위 선분은 실제 표본 x(파랑)와 생성 표본 x̃(주황)을 잇습니다. 아래 곡선은 λ=10일 때 기울기 크기 ∥∇f(x̂)∥₂에 따른 penalty입니다. ε 값과 각 점의 기울기는 설명을 위한 가정입니다."
      ariaLabel="real과 fake 사이 보간점에서 gradient norm과 penalty 곡선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const s = scene.slope;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {/* real–fake 선분 */}
            <line x1={SEG_L} y1={SEG_Y} x2={SEG_R} y2={SEG_Y} stroke="#94a3b8" strokeWidth={1} />
            <circle cx={SEG_L} cy={SEG_Y} r={6} fill="#2563eb" />
            <circle cx={SEG_R} cy={SEG_Y} r={6} fill="#f97316" />
            <text x={SEG_L} y={SEG_Y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">실제 x</text>
            <text x={SEG_R} y={SEG_Y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#c2410c">생성 x̃</text>
            {scene.eps.map((e) => {
              const cx = SEG_L + (1 - e) * (SEG_R - SEG_L);
              return (
                <g key={e}>
                  <circle cx={cx} cy={SEG_Y} r={5} fill="#7c3aed" />
                  <text x={cx} y={SEG_Y - 11} textAnchor="middle" fontSize={10} fontWeight={700} fill="#7c3aed">{`x̂ (ε=${e})`}</text>
                </g>
              );
            })}
            {/* penalty 곡선 */}
            <line x1={GX0} y1={GY0} x2={GX1} y2={GY0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={GX0} y1={GY0} x2={GX0} y2={GY1 - 4} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1, 1.5, 2].map((v) => (
              <text key={v} x={gx(v)} y={GY0 + 13} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
            ))}
            {[2.5, 10].map((v) => (
              <g key={v}>
                <line x1={GX0} y1={gy(v)} x2={GX1} y2={gy(v)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={GX0 - 5} y={gy(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
              </g>
            ))}
            <text x={GX1} y={GY0 + 24} textAnchor="end" fontSize={10} fill="#64748b">∥∇f(x̂)∥₂</text>
            <text x={GX0 + 4} y={GY1 - 8} fontSize={10} fill="#64748b">penalty</text>
            <line x1={gx(1)} y1={GY0} x2={gx(1)} y2={GY1} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
            <text x={gx(1)} y={GY1 - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#15803d">목표 1</text>
            <path d={CURVE} fill="none" stroke="#7c3aed" strokeWidth={1.25} opacity={s === null ? 0.35 : 1} />
            {s !== null && (
              <g>
                <line x1={gx(1)} y1={gy(penalty(s))} x2={gx(s)} y2={gy(penalty(s))} stroke="#7c3aed" strokeWidth={1} strokeDasharray="2 2" />
                <line x1={gx(s)} y1={GY0} x2={gx(s)} y2={gy(penalty(s))} stroke="#7c3aed" strokeWidth={1} strokeDasharray="2 2" />
                <circle cx={gx(s)} cy={gy(penalty(s))} r={5} fill="#7c3aed" />
                <text x={gx(s) + (s < 1 || s > 1.8 ? -8 : 8)} y={gy(penalty(s)) - 7} textAnchor={s < 1 || s > 1.8 ? "end" : "start"} fontSize={11} fontWeight={700} fill="#6d28d9">{`penalty ${penalty(s)}`}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
