import SceneShell from "./SceneShell";

/**
 * 본문 대응: #damping-boundary — f(θ)=θ²/2, θ=0.1, 이전 v=2, β=0.9, η=0.1 (가정).
 * gradient = θ = 0.1, 새 v = 0.9×2 + 0.1 = 1.9 (기록 몫 1.8 + 새 몫 0.1),
 * 이동 0.1×1.9 = 0.19 (0.18 + 0.01), 다음 θ = 0.1 − 0.19 = −0.09.
 */
const SCENES = [
  { label: "출발 위치", summary: "θ = 0.1 · gradient 0.1 · 이전 v 2", note: "f(θ)=θ²/2에서 gradient는 θ 자체라 0.1입니다. 최솟값 0까지 남은 거리도 0.1뿐인데, 직전 기록 v는 2입니다." },
  { label: "새 기록", summary: "v = 0.9×2 + 0.1 = 1.9", note: "새 기록 1.9 가운데 1.8은 직전 기록에서 남은 몫(회색)이고 0.1만 이번 gradient(보라)에서 왔습니다." },
  { label: "이동", summary: "0.1 − 0.1×1.9 = −0.09", note: "이동 거리 0.19 가운데 0.18이 과거 기록에서 옵니다. 최솟값까지 0.1만 남았으므로 0을 지나 −0.09에 도착합니다." },
] as const;

const W = 360;
const CX = 180;
const HALF = 150;
const XMAX = 0.15;
const FLOOR = 132;
const TOP = 30;
const FMAX = (XMAX * XMAX) / 2;
const px = (theta: number) => CX + (theta / XMAX) * HALF;
const py = (theta: number) => FLOOR - ((theta * theta) / 2 / FMAX) * (FLOOR - TOP);
const CURVE = Array.from({ length: 31 }, (_, i) => -XMAX + (i * 2 * XMAX) / 30)
  .map((theta, i) => `${i === 0 ? "M" : "L"}${px(theta).toFixed(1)} ${py(theta).toFixed(1)}`)
  .join("");
const BAR_Y = 176;

export default function OvershootViz() {
  return (
    <SceneShell
      eyebrow="f(θ) = θ²/2 (가정)"
      title="최솟값까지 0.1 남은 자리에서 0.19를 움직입니다"
      description="곡선은 오차 f(θ)=θ²/2이고 가운데 바닥이 최솟값 θ=0입니다. 아래 띠는 이번 이동 거리를 과거 기록 몫과 이번 gradient 몫으로 나눈 것입니다. β=0.9, η=0.1."
      ariaLabel="θ=0.1에서 이전 기록 때문에 최솟값을 지나 −0.09로 가는 한 번의 이동"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <path d={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1.25} />
          <line x1={CX} x2={CX} y1={FLOOR} y2={FLOOR + 10} stroke="#64748b" strokeWidth={1} />
          <text x={CX} y={FLOOR + 22} textAnchor="middle" fontSize={10} fill="#64748b">최솟값 0</text>
          <circle cx={px(0.1)} cy={py(0.1)} r={4.5} fill={active === 2 ? "#ffffff" : "#2563eb"} stroke="#2563eb" strokeWidth={1} />
          <text x={px(0.1) + 8} y={py(0.1) - 6} fontSize={10} fontWeight={700} fill="#2563eb">θ = 0.1</text>
          <g opacity={active === 2 ? 1 : 0}>
            <circle cx={px(-0.09)} cy={py(-0.09)} r={4.5} fill="#2563eb" />
            <text x={px(-0.09) - 8} y={py(-0.09) - 6} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">θ = −0.09</text>
            <path d={`M${px(0.1)} ${py(0.1) - 8}Q${CX} ${TOP - 18} ${px(-0.09)} ${py(-0.09) - 8}`} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
          </g>
          <g opacity={active >= 1 ? 1 : 0}>
            <rect x={px(-0.09)} y={BAR_Y} width={px(0.09) - px(-0.09)} height={12} rx={2} fill="#94a3b8" />
            <rect x={px(0.09)} y={BAR_Y} width={px(0.1) - px(0.09)} height={12} rx={2} fill="#7c3aed" />
            <text x={CX} y={BAR_Y + 26} textAnchor="middle" fontSize={10} fill="#475569">{active === 2 ? "과거 기록 몫 0.18" : "과거 기록 몫 1.8"}</text>
            <text x={W - 6} y={BAR_Y + 26} textAnchor="end" fontSize={10} fill="#7c3aed">{active === 2 ? "gradient 0.01" : "gradient 0.1"}</text>
            <text x={6} y={BAR_Y + 9} fontSize={9} fill="#64748b">{active === 2 ? "이동" : "v"}</text>
            {active === 1 && <text x={CX} y={BAR_Y - 6} textAnchor="middle" fontSize={9} fill="#64748b">막대 길이는 v의 0.1배(η)로 그렸습니다</text>}
          </g>
        </svg>
      )}
    />
  );
}
