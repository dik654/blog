import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview ExplainedFormula 해석 — 두 모델이 같은 분산 σ², 같은 weight 1/2, 상관 ρ이면
 * 평균 error 분산 = σ²(1+ρ)/2. σ²=1로 두면 ρ=1 → 1, ρ=0 → 0.5, ρ=−1 → 0.
 */
const W = 360;
const H = 200;
const LEFT = 44;
const RIGHT = 16;
const TOP = 18;
const BOTTOM = 160;

const x = (rho: number) => LEFT + ((rho + 1) / 2) * (W - LEFT - RIGHT);
const y = (v: number) => BOTTOM - v * (BOTTOM - TOP);
const ratio = (rho: number) => (1 + rho) / 2;

const SCENES = [
  {
    label: "ρ = 1 · 늘 함께 틀림",
    summary: "σ²(1+1)/2 = σ²",
    rho: 1,
    note: "두 모델이 모든 행에서 같은 방향·같은 크기로 틀리면 평균해도 error 분산은 한 모델과 같은 σ²입니다. 모델을 둘로 늘린 효과가 없습니다.",
  },
  {
    label: "ρ = 0 · 서로 무관",
    summary: "σ²(1+0)/2 = σ²/2",
    rho: 0,
    note: "두 error가 서로 상관없이 움직이면 평균 error 분산은 절반이 됩니다. 줄어드는 정도를 정한 것은 모델 수 2가 아니라 ρ입니다.",
  },
  {
    label: "ρ = −1 · 늘 반대로 틀림",
    summary: "σ²(1−1)/2 = 0",
    rho: -1,
    note: "모든 행에서 크기가 같고 방향만 반대이면 이상적으로 0이 됩니다. 다만 이런 완전한 음의 상관은 실제 예측에서 매우 강한 조건입니다.",
  },
] as const;

const CURVE = `M ${x(-1)} ${y(ratio(-1))} L ${x(1)} ${y(ratio(1))}`;

export default function CorrelationVarianceViz() {
  return (
    <SceneShell
      eyebrow="평균 error 분산과 상관"
      title="두 모델을 평균해도 error가 얼마나 줄지는 ρ가 정합니다"
      description="σ²는 한 모델 error의 분산(흔들림 크기), ρ는 같은 OOF 행에서 두 error가 함께 움직이는 정도인 상관계수(−1~1)입니다. 두 모델의 σ²가 같고 weight가 1/2씩이라는 글의 조건에서, 세로축은 평균 error 분산을 σ²에 대한 배수로 나타냅니다."
      ariaLabel="상관계수 rho가 1, 0, -1일 때 두 모델 평균의 error 분산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const px = x(scene.rho);
        const py = y(ratio(scene.rho));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 0.5, 1].map((v) => (
              <g key={v}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(v)} y2={y(v)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray={v === 1 ? "4 3" : undefined} />
                <text x={LEFT - 6} y={y(v) + 4} textAnchor="end" fontSize={12} fill="#64748b">{v === 1 ? "σ²" : v === 0.5 ? "σ²/2" : "0"}</text>
              </g>
            ))}
            <text x={LEFT + 4} y={y(1) - 6} textAnchor="start" fontSize={11} fill="#64748b">한 모델만 쓸 때의 분산</text>
            <path d={CURVE} stroke="#2563eb" strokeWidth={1.25} fill="none" />
            {[-1, 0, 1].map((r) => (
              <text key={r} x={x(r)} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#64748b">{r === -1 ? "−1" : r}</text>
            ))}
            <text x={(LEFT + W - RIGHT) / 2} y={BOTTOM + 34} textAnchor="middle" fontSize={12} fill="#475569">ρ (같은 행에서 두 error의 상관)</text>
            <line x1={px} x2={px} y1={BOTTOM} y2={py} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={px} cy={py} r={5} fill="#2563eb" />
            <text x={scene.rho === 1 ? px - 10 : px + 10} y={scene.rho === 1 ? py + 20 : py - 12} textAnchor={scene.rho === 1 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#1d4ed8">
              {scene.summary}
            </text>
          </svg>
        );
      }}
    />
  );
}
