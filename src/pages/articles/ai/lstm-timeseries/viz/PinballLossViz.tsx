import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training pinball loss — ρ_τ(u)=u(τ−1[u<0]).
 * u>0(실제가 예측보다 큼, 과소 예측)이면 기울기 τ, u<0이면 기울기 1−τ.
 * 오차 크기 10은 설명용 가정: τ=0.5 → 5·5, τ=0.9 → 과소 9 · 과대 1 (9배).
 */
const U = 10;
const rho = (tau: number, u: number) => u * (tau - (u < 0 ? 1 : 0));

const SCENES = [
  { label: "τ = 0.5", summary: "양쪽 기울기 0.5 · 비용 5 = 5", taus: [0.5], note: "τ=0.5이면 실제가 예측보다 커도(u>0) 작아도(u<0) 기울기가 0.5로 같습니다. 오차 크기가 10이면(가정) 양쪽 비용이 모두 5입니다. 이 경우 조건부 median을 겨냥합니다." },
  { label: "τ = 0.9", summary: "과소 기울기 0.9 · 과대 기울기 0.1", taus: [0.9], note: "τ=0.9이면 실제가 예측보다 클 때(과소 예측) 기울기 0.9, 작을 때(과대 예측) 기울기 1−0.9=0.1입니다. 같은 크기 10이라도 과소 예측은 9, 과대 예측은 1입니다." },
  { label: "두 τ 비교", summary: "9 ÷ 1 = 과소 예측 9배", taus: [0.5, 0.9], note: "τ=0.9에서는 과소 예측이 같은 크기의 과대 예측보다 9배 비쌉니다. 이 비용을 줄이려면 예측을 위로 끌어올려야 하므로, 결과는 상위 90% quantile을 겨냥합니다." },
] as const;

const W = 360;
const H = 196;
const CX = 180;
const BASE = 160;
const XS = 13;
const YS = 12;
const px = (u: number) => CX + u * XS;
const py = (loss: number) => BASE - loss * YS;
const COLOR: Record<string, string> = { "0.5": "#64748b", "0.9": "#2563eb" };

export default function PinballLossViz() {
  return (
    <SceneShell
      eyebrow="Pinball loss의 모양"
      title="τ=0.9는 과소 예측을 과대 예측보다 9배 비싸게 칩니다"
      description="Pinball loss는 오차 방향에 따라 기울기가 다른 꺾은선 비용입니다. 가로축 u는 실제값 − quantile 예측값, 세로축은 그 비용입니다. 점은 오차 크기 10(가정)에서의 비용입니다."
      ariaLabel="quantile level 0.5와 0.9의 pinball loss 기울기 비교"
      scenes={SCENES}
      render={(active) => {
        const taus: readonly number[] = SCENES[active].taus;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={px(-U) - 14} x2={px(U) + 14} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={CX} x2={CX} y1={BASE} y2={py(U) - 6} stroke="#94a3b8" strokeWidth={1} />
            <text x={CX} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">u = 0</text>
            <text x={px(-U)} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">−10</text>
            <text x={px(U)} y={BASE + 14} textAnchor="middle" fontSize={11} fill="#64748b">+10</text>
            <text x={px(-U / 2)} y={BASE + 30} textAnchor="middle" fontSize={11} fill="#475569">과대 예측 (u&lt;0)</text>
            <text x={px(U / 2)} y={BASE + 30} textAnchor="middle" fontSize={11} fill="#475569">과소 예측 (u&gt;0)</text>
            {taus.map((tau) => {
              const faded = taus.length > 1 && tau === 0.5;
              const color = COLOR[String(tau)];
              const left = rho(tau, -U);
              const right = rho(tau, U);
              return (
                <g key={tau} opacity={faded ? 0.55 : 1}>
                  <polyline points={`${px(-U)},${py(left)} ${CX},${BASE} ${px(U)},${py(right)}`} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={faded ? "4 3" : undefined} />
                  <circle cx={px(-U)} cy={py(left)} r={3} fill={color} />
                  <circle cx={px(U)} cy={py(right)} r={3} fill={color} />
                  <text x={px(-U) - 6} y={py(left) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>{Math.round(left * 10) / 10}</text>
                  <text x={px(U) + 6} y={py(right) - 6} fontSize={12} fontWeight={700} fill={color}>{Math.round(right * 10) / 10}</text>
                  <text x={px(U) + 6} y={py(right) + 8} fontSize={10} fill={color}>τ={tau}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
