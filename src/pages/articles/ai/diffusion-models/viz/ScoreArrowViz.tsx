import SceneShell from "./SceneShell";

/**
 * 본문 대응: #score — score = −(xₜ−αₜx₀)/σₜ² = −ε/σₜ.
 * σ=0.5, ε=2: d=1, score=−4. ε=−2: d=−1, score=+4. σ=1, ε=2: d=2, score=−2.
 * marginal: 후보 중심 0과 0.5, xₜ=1, 가중치 반반이면 (−4−2)/2=−3 (후보·가중치는 가정).
 */
const SCENES = [
  { label: "center의 오른쪽", summary: "σ=0.5, ε=2 → score −4", sigma: 0.5, eps: 2, score: -4, note: "noisy point는 center에서 σε=1만큼 벗어나 있습니다. score는 −ε/σ=−4이고 음수이므로 왼쪽, 곧 center 쪽을 가리킵니다." },
  { label: "center의 왼쪽", summary: "σ=0.5, ε=−2 → score +4", sigma: 0.5, eps: -2, score: 4, note: "ε의 부호를 바꾸면 point도 반대쪽에 놓이고 화살표도 뒤집힙니다(가정). 어느 쪽에 있든 center를 향합니다." },
  { label: "noise level이 커지면", summary: "σ=1, ε=2 → score −2", sigma: 1, eps: 2, score: -2, note: "같은 ε=2라도 σ=1이면(가정) 곡선이 넓어지고 point는 더 멀리 놓이지만 score 크기는 2로 작아집니다. σ로 나누기 때문입니다." },
  { label: "marginal은 평균", summary: "(−4 − 2) ÷ 2 = −3", sigma: 0.5, eps: 2, score: -3, note: "marginal score는 가능한 x₀들의 conditional score를 posterior로 평균한 값입니다. σ=0.5, xₜ=1에서 후보 둘과 반반 가중치는 그림용입니다(가정)." },
];

const AXIS_Y = 160;
const X = (d: number) => 180 + d * 60;
const curve = (center: number, sigma: number, peak: number) =>
  Array.from({ length: 61 }, (_, i) => {
    const d = -2.6 + (i * 5.2) / 60;
    const y = AXIS_Y - peak * (0.5 / sigma) * Math.exp(-((d - center) ** 2) / (2 * sigma * sigma));
    return `${i ? "L" : "M"}${X(d).toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

/** 길이 = |score|×0.25 축 단위. */
function Arrow({ from, score, y, color }: { from: number; score: number; y: number; color: string }) {
  const end = X(from + score * 0.25);
  const tip = score < 0 ? 6 : -6;
  return (
    <g>
      <line x1={X(from)} x2={end} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${end + tip} ${y - 4} L${end} ${y} L${end + tip} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function ScoreArrowViz() {
  return (
    <SceneShell
      eyebrow="화살표로 읽는 score"
      title="score는 noisy point에서 center 쪽을 가리키는 화살표입니다"
      description="곡선은 x₀를 고정한 noisy state의 Gaussian density이고 꼭대기가 conditional center αₜx₀입니다. 화살표 길이는 score 크기에 비례합니다."
      note="가로축은 center를 0으로 둔 위치이고 1차원 그림입니다(가정). 이 절의 αₜ는 1−βₜ가 아니라 √ᾱₜ, σₜ는 √(1−ᾱₜ)입니다."
      ariaLabel="Gaussian density 위에서 score 화살표의 방향과 크기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const d = scene.sigma * scene.eps;
        const marginal = active === 3;
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={20} x2={340} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[-2, -1, 0, 1, 2].map((tick) => (
              <g key={tick}>
                <line x1={X(tick)} x2={X(tick)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={X(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={12} fill="currentColor">{tick < 0 ? `−${-tick}` : tick}</text>
              </g>
            ))}
            {marginal ? (
              <g>
                <path d={curve(0, 0.5, 80)} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <path d={curve(0.5, 0.5, 80)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X(1)} x2={X(1)} y1={AXIS_Y} y2={24} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={X(1)} cy={AXIS_Y} r={5} fill="currentColor" />
                <Arrow from={1} score={-4} y={34} color="#64748b" />
                <text x={X(1) + 8} y={38} fontSize={12} fill="currentColor">중심 0: −4</text>
                <Arrow from={1} score={-2} y={56} color="#64748b" />
                <text x={X(1) + 8} y={60} fontSize={12} fill="currentColor">중심 0.5: −2</text>
                <Arrow from={1} score={-3} y={78} color="#2563eb" />
                <text x={X(1) + 8} y={82} fontSize={12} fontWeight={700} fill="#2563eb">평균: −3</text>
              </g>
            ) : (
              <g>
                <path d={curve(0, scene.sigma, 80)} fill="none" stroke="#64748b" strokeWidth={1.25} />
                <circle cx={X(d)} cy={AXIS_Y} r={5} fill="currentColor" />
                <text x={active === 2 ? X(d) + 36 : d > 0 ? X(d) + 10 : X(d) - 10} y={active === 2 ? AXIS_Y - 26 : AXIS_Y - 10} textAnchor={active !== 2 && d > 0 ? "start" : "end"} fontSize={13} fontWeight={700} fill="#2563eb">score {scene.score > 0 ? `+${scene.score}` : `−${-scene.score}`}</text>
                <Arrow from={d} score={scene.score} y={AXIS_Y - 14} color="#2563eb" />
                <text x={X(0)} y={AXIS_Y - 80 * (0.5 / scene.sigma) - 8} textAnchor="middle" fontSize={12} fill="#64748b">center</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
