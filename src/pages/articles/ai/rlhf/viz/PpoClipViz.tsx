import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ppo 두 번째 ExplainedFormula, L^CLIP = E[min(ρÂ, clip(ρ, 1−ε, 1+ε)Â)].
 * 가정: ε = 0.2, Â = +1 또는 −1, 한 token의 old 확률 0.40 → new 0.60 (ρ = 1.5).
 * Â=+1, ρ=1.5: u = 1.5, c = 1.2, min = 1.2. Â=−1, ρ=0.5: u = −0.5, c = −0.8, min = −0.8.
 * Â=−1, ρ=1.5: u = −1.5, c = −1.2, min = −1.5.
 */
const EPS = 0.2;
const OLD_P = 0.4;
const NEW_P = 0.6;
const RHO = NEW_P / OLD_P;

const fx = (v: number) => v.toFixed(1).replace("-", "−");
const clip = (rho: number) => Math.min(Math.max(rho, 1 - EPS), 1 + EPS);
const objective = (rho: number, adv: number) => Math.min(rho * adv, clip(rho) * adv);

const W = 360;
const H = 200;
const L = 34;
const R = 14;
const TOP = 16;
const BOT = 176;
const px = (rho: number) => L + (rho / 2) * (W - L - R);
const py = (v: number) => TOP + ((2 - v) / 4) * (BOT - TOP);

const SCENES = [
  { adv: 0, label: "ratio ρ", summary: `ρ = ${NEW_P.toFixed(2)} / ${OLD_P.toFixed(2)} = ${RHO.toFixed(1)}`, note: "같은 token을 update 뒤 policy가 0.60, rollout을 만든 old policy가 0.40으로 봤다면 ρ는 1.5입니다. 회색 띠는 clip이 허용하는 1−ε~1+ε 구간(ε = 0.2 가정)이고, 1.5는 그 밖에 있습니다." },
  { adv: 1, label: "Â > 0: 좋은 token", summary: `min(${(RHO * 1).toFixed(1)}, ${clip(RHO).toFixed(1)}) = ${objective(RHO, 1).toFixed(1)}`, note: "Advantage Â는 그 token이 기준보다 얼마나 나았는지입니다. Â = +1이면 원래 항 u = ρÂ(점선)는 ρ를 키울수록 계속 오르지만, 실선 min(u, c)은 1.2에서 평평해집니다. ρ를 1.5까지 밀어도 objective는 1.2에 머물러 더 밀 유인이 없습니다." },
  { adv: -1, label: "Â < 0: 나쁜 token", summary: `ρ = 0.5 → min(−0.5, −0.8) = ${fx(objective(0.5, -1))}`, note: "Â = −1이면 확률을 낮추는 방향이 이득입니다. ρ를 0.8 아래로 내려도 실선은 −0.8에서 평평해 더 낮출 이득이 없습니다. 반대로 ρ가 1.2를 넘으면 실선이 점선을 따라 계속 내려가 손해는 그대로 반영됩니다. 두 항 중 낙관적인 쪽을 고르지 않는다는 뜻입니다." },
] as const;

export default function PpoClipViz() {
  return (
    <SceneShell
      eyebrow="PPO clip"
      title="ratio가 1±ε 밖으로 나가면 더 밀어도 이득이 늘지 않는다"
      description="가로축은 한 token의 확률 비율 ρ = π_θ / π_old, 세로축은 그 token의 objective 값입니다. 점선은 원래 항 ρÂ, 실선은 PPO가 실제로 쓰는 min(ρÂ, clip(ρ)Â)입니다. ε = 0.2와 Â = ±1은 가정입니다."
      ariaLabel="advantage 부호에 따라 clipped surrogate가 평평해지는 구간"
      scenes={SCENES}
      render={(active) => {
        const adv: number = SCENES[active].adv;
        const xs = Array.from({ length: 101 }, (_, i) => (i / 100) * 2);
        const line = (f: (rho: number) => number) => xs.map((rho, i) => `${i === 0 ? "M" : "L"}${px(rho).toFixed(1)},${py(f(rho)).toFixed(1)}`).join(" ");
        const pointRho = adv < 0 ? 0.5 : RHO;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={px(1 - EPS)} y={TOP} width={px(1 + EPS) - px(1 - EPS)} height={BOT - TOP} fill="#94a3b8" fillOpacity={0.18} />
            <line x1={L} x2={W - R} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={TOP} y2={BOT} stroke="#94a3b8" strokeWidth={1} />
            {[-2, -1, 0, 1, 2].map((v) => (
              <text key={v} x={L - 6} y={py(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
            ))}
            {[0, 0.8, 1.2, 2].map((v) => (
              <text key={v} x={px(v)} y={BOT + 15} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
            ))}
            <text x={W - R} y={py(0) - 6} textAnchor="end" fontSize={10} fill="#64748b">ρ →</text>
            {adv === 0 ? (
              <g>
                <line x1={px(RHO)} x2={px(RHO)} y1={TOP + 20} y2={py(0)} stroke="#d97706" strokeWidth={1.25} />
                <circle cx={px(RHO)} cy={py(0)} r={5} fill="#d97706" />
                <text x={px(RHO)} y={TOP + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">ρ = 1.5</text>
                <text x={px(1)} y={py(0) + 30} textAnchor="middle" fontSize={10} fill="#475569">허용 구간 0.8~1.2</text>
              </g>
            ) : (
              <g>
                <path d={line((rho) => rho * adv)} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
                <path d={line((rho) => objective(rho, adv))} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <circle cx={px(pointRho)} cy={py(pointRho * adv)} r={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <circle cx={px(pointRho)} cy={py(objective(pointRho, adv))} r={5} fill="#2563eb" />
                <text x={px(pointRho) + 8} y={py(objective(pointRho, adv)) + 18} fontSize={11} fontWeight={700} fill="#1d4ed8">
                  min = {fx(objective(pointRho, adv))}
                </text>
                <text x={px(1.85)} y={py(1.85 * adv) + (adv > 0 ? -8 : 16)} textAnchor="end" fontSize={10} fill="#475569">점선 ρÂ</text>
                <text x={L + 6} y={TOP + 12} fontSize={10} fill="#1d4ed8">Â = {adv > 0 ? "+1" : "−1"}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
