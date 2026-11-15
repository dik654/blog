import SceneShell from "./SceneShell";

/**
 * 본문 대응: #guidance — εu=2, εc=1.5 예시.
 * ε̂ = εu + w(εc − εu): w=0 → 2, w=1 → 1.5, w=3 → 2 + 3×(−0.5) = 0.5.
 */
const EU = 2;
const EC = 1.5;
const DIFF = EC - EU;

const SCENES = [
  {
    label: "두 예측의 차이",
    summary: "εc − εu = 1.5 − 2 = −0.5",
    note: "같은 noisy latent와 timestep에서 condition을 비운 예측 εu=2와 condition을 준 예측 εc=1.5를 얻습니다. 둘의 차이 −0.5가 condition 때문에 추가된 방향입니다.",
    w: null,
  },
  {
    label: "w = 0",
    summary: "2 + 0×(−0.5) = 2",
    note: "차이 방향을 하나도 더하지 않으므로 결과는 εu와 같은 2입니다.",
    w: 0,
  },
  {
    label: "w = 1",
    summary: "2 + 1×(−0.5) = 1.5",
    note: "차이를 한 번 더하면 정확히 εc인 1.5에 도착합니다. w=1은 conditional prediction을 그대로 쓰는 것과 같습니다.",
    w: 1,
  },
  {
    label: "w = 3",
    summary: "2 + 3×(−0.5) = 0.5",
    note: "같은 방향으로 세 번 가서 εc를 지나친 0.5가 됩니다. 이것이 w>1의 extrapolation입니다. 큰 w는 prompt adherence를 높일 수 있지만 saturation·artifact·diversity loss를 만들 수 있습니다.",
    w: 3,
  },
] as const;

const W = 360;
const H = 150;
const X0 = 28;
const X1 = 332;
const VMIN = 0;
const VMAX = 2.5;
const AXIS_Y = 96;
const x = (value: number) => X0 + ((value - VMIN) / (VMAX - VMIN)) * (X1 - X0);
const TICKS = [0, 0.5, 1, 1.5, 2, 2.5] as const;

function Eps({ sub }: { sub: string }) {
  return (
    <>
      ε<tspan fontSize={9} dy={3}>{sub}</tspan>
    </>
  );
}

export function GuidanceExtrapolationViz() {
  return (
    <SceneShell
      eyebrow="가이던스 한 좌표"
      title="w는 두 예측의 차이를 몇 번 더할지 정합니다"
      description="글의 예시처럼 예측값 한 좌표만 수직선에 놓습니다. εu는 condition을 비운 branch의 예측, εc는 text 등 condition을 준 branch의 예측, w는 guidance scale입니다. 주황 화살표 한 칸이 차이 εc − εu입니다."
      ariaLabel="classifier-free guidance에서 w가 0, 1, 3일 때 guided prediction이 수직선 위에서 움직이는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps = scene.w ?? 1;
        const result = scene.w === null ? null : EU + scene.w * DIFF;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}
            <circle cx={x(EU)} cy={AXIS_Y} r={5} fill="#64748b" />
            <text x={x(EU)} y={AXIS_Y - 50} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569"><Eps sub="u" /> = 2</text>
            <line x1={x(EU)} x2={x(EU)} y1={AXIS_Y - 44} y2={AXIS_Y - 7} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={x(EC)} cy={AXIS_Y} r={5} fill="#ffffff" stroke="#64748b" strokeWidth={1.25} />
            <text x={x(EC)} y={AXIS_Y - 50} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569"><Eps sub="c" /> = 1.5</text>
            <line x1={x(EC)} x2={x(EC)} y1={AXIS_Y - 44} y2={AXIS_Y - 7} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
            {Array.from({ length: steps }, (_, i) => {
              const from = x(EU + i * DIFF);
              const to = x(EU + (i + 1) * DIFF);
              const y = AXIS_Y - 22;
              return (
                <g key={i}>
                  <line x1={from} x2={to + 6} y1={y} y2={y} stroke="#d97706" strokeWidth={1.25} />
                  <polygon points={`${to},${y} ${to + 7},${y - 4} ${to + 7},${y + 4}`} fill="#d97706" />
                </g>
              );
            })}
            {scene.w === null && (
              <text x={(x(EU) + x(EC)) / 2} y={AXIS_Y - 28} textAnchor="middle" fontSize={11} fill="#b45309">−0.5</text>
            )}
            {result !== null && (
              <g>
                <rect x={x(result) - 6} y={AXIS_Y - 6} width={12} height={12} fill="#2563eb" />
                <text x={x(result)} y={AXIS_Y + 40} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">ε̂ = {result}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
