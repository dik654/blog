import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schedule — ᾱₜ=0.64 → signal scale 0.8, noise scale 0.6. x₀=2, ε=−1 → xₜ=1.6−0.6=1.0.
 * variance는 넓이, scale은 변: 0.8²+0.6²=1이지만 0.8+0.6=1.4.
 */
const SCENES = [
  { label: "variance는 합이 1", summary: "0.64 + 0.36 = 1", note: "ᾱₜ=0.64이면 원본 몫이 0.64, noise 몫은 1−0.64=0.36입니다. 정사각형의 넓이로 그렸습니다." },
  { label: "곱하는 값은 제곱근", summary: "√0.64 = 0.8 · √0.36 = 0.6", note: "식에서 곱하는 scale은 넓이가 아니라 변의 길이입니다. 0.8+0.6은 1.4로 1이 아니지만, 독립인 두 항의 variance는 제곱으로 더해져 0.64+0.36=1입니다." },
  { label: "원본 항", summary: "0.8 × 2 = 1.6", note: "x₀=2에 signal scale 0.8을 곱합니다. 0에서 1.6까지 갑니다." },
  { label: "noise 항을 더함", summary: "1.6 + 0.6 × (−1) = 1.0", note: "ε=−1에 noise scale 0.6을 곱해 −0.6을 더하면 xₜ=1.0입니다. 중간 step을 하나도 계산하지 않았습니다." },
];

const lineX = (value: number) => 40 + (value + 1) * 85;

export default function ClosedFormScaleViz() {
  return (
    <SceneShell
      eyebrow="variance와 scale"
      title="몫은 0.64와 0.36인데 곱하는 값은 0.8과 0.6입니다"
      description="ᾱₜ는 원본 variance가 남은 비율, 곧 위 그림의 파란 몫입니다. 예시는 ᾱₜ=0.64, x₀=2, ε=−1입니다."
      ariaLabel="variance 0.64와 0.36을 scale 0.8과 0.6으로 바꿔 xₜ=1.0을 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? (
            <g>
              <rect x={50} y={36} width={112} height={112} fill="#2563eb" fillOpacity={0.18} stroke="#2563eb" strokeWidth={1} />
              <rect x={214} y={64} width={84} height={84} fill="#f59e0b" fillOpacity={0.22} stroke="#b45309" strokeWidth={1} />
              <text x={106} y={90} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">signal</text>
              <text x={106} y={110} textAnchor="middle" fontSize={13} fill="currentColor">넓이 0.64</text>
              <text x={256} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">noise</text>
              <text x={256} y={120} textAnchor="middle" fontSize={13} fill="currentColor">넓이 0.36</text>
              <text x={188} y={110} textAnchor="middle" fontSize={16} fill="currentColor">+</text>
              {active === 1 && (
                <>
                  <text x={106} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">변 0.8</text>
                  <text x={256} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">변 0.6</text>
                </>
              )}
            </g>
          ) : (
            <g>
              <line x1={30} x2={330} y1={130} y2={130} stroke="#94a3b8" strokeWidth={1} />
              {[-1, 0, 1, 2].map((tick) => (
                <g key={tick}>
                  <line x1={lineX(tick)} x2={lineX(tick)} y1={126} y2={134} stroke="#94a3b8" strokeWidth={1} />
                  <text x={lineX(tick)} y={150} textAnchor="middle" fontSize={12} fill="currentColor">{tick === -1 ? "−1" : tick}</text>
                </g>
              ))}
              <text x={lineX(2)} y={168} textAnchor="middle" fontSize={11} fill="#64748b">x₀=2</text>
              <line x1={lineX(0)} x2={lineX(1.6)} y1={70} y2={70} stroke="#2563eb" strokeWidth={1.25} />
              <path d={`M${lineX(1.6) - 7} 65 L${lineX(1.6)} 70 L${lineX(1.6) - 7} 75`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <text x={lineX(0.8)} y={60} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">+1.6</text>
              {active === 3 && (
                <>
                  <line x1={lineX(1.6)} x2={lineX(1)} y1={100} y2={100} stroke="#b45309" strokeWidth={1.25} />
                  <path d={`M${lineX(1) + 7} 95 L${lineX(1)} 100 L${lineX(1) + 7} 105`} fill="none" stroke="#b45309" strokeWidth={1.25} />
                  <text x={lineX(1.3)} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">−0.6</text>
                  <circle cx={lineX(1)} cy={130} r={5} fill="currentColor" />
                  <text x={lineX(1) - 8} y={118} textAnchor="end" fontSize={13} fontWeight={700} fill="currentColor">xₜ=1.0</text>
                  <line x1={lineX(1)} x2={lineX(1)} y1={100} y2={125} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                </>
              )}
            </g>
          )}
        </svg>
      )}
    />
  );
}
