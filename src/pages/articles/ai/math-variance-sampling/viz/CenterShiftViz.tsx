import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sample-correction — 거리 합 항등식 Σ(Z−μ)² = Σ(Z−Z̄)² + n(Z̄−μ)².
 * 관측 1·1·2는 네 기록에서 나올 수 있는 한 묶음으로 고른 예(가정): 2 = 2/3 + 3·(2/3)² = 2/3 + 4/3.
 * 1·2·3은 Z̄=μ=2여서 덜 세는 양이 0이다.
 */
const CASES = {
  shifted: { obs: [1, 1, 2], mean: 4 / 3, meanLabel: "4/3" },
  centered: { obs: [1, 2, 3], mean: 2, meanLabel: "2" },
} as const;

const SCENES = [
  { label: "μ에서 재기", summary: "1 + 1 + 0 = 2", note: "원래 평균 μ=2를 아는 사람의 거리 합입니다. 관측 1·1·2는 네 기록에서 나올 수 있는 한 묶음으로 고른 예입니다(가정).", which: "shifted", from: "mu", right: ["1", "1", "0"] },
  { label: "표본평균에서 재기", summary: "1/9 + 1/9 + 4/9 = 2/3", note: "같은 세 값의 평균 4/3에서 재면 거리 합은 2/3입니다. 값 2의 제곱 거리는 0에서 4/9로 늘지만 합은 2에서 2/3으로 줄어듭니다.", which: "shifted", from: "mean", right: ["1/9", "1/9", "4/9"] },
  { label: "덜 센 양", summary: "3 × (2/3)² = 4/3", note: "차이 2 − 2/3 = 4/3은 두 기준의 간격 2/3을 제곱해 n=3을 곱한 값과 같습니다. 본문의 n(Z̄ₙ−μ)²입니다.", which: "shifted", from: "mean", right: ["1/9", "1/9", "4/9"] },
  { label: "1·2·3이면", summary: "간격 0 · 덜 센 양 0", note: "앞에서 쓴 1·2·3은 평균이 우연히 μ와 같아 덜 세는 양이 없습니다. 묶음마다 다르며, 그 기댓값이 σ² 하나 분량이라는 것이 아래 식입니다.", which: "centered", from: "mean", right: ["1", "0", "1"] },
] as const;

const W = 360;
const X0 = 34;
const X1 = 254;
const sx = (value: number) => X0 + ((value - 0.75) / 2.5) * (X1 - X0);
const ROW_Y = [58, 84, 110];
const AXIS_Y = 130;
const BAR_X = 40;
const BAR_W = 300;
const barW = (value: number) => (value / 2) * BAR_W;

export default function CenterShiftViz() {
  return (
    <SceneShell
      eyebrow="기준을 옮기면"
      title="표본평균에서 재면 거리 합이 정확히 얼마나 줄어드는가"
      description="가로줄이 관측값 하나이고 선분이 기준까지의 거리입니다. 아래 막대는 거리 합을 같은 축척으로 나눕니다."
      ariaLabel="원래 평균과 표본평균에서 잰 거리 합의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const data = CASES[scene.which];
        const center = scene.from === "mu" ? 2 : data.mean;
        const same = data.mean === 2;
        const within = scene.from === "mu" ? 2 : scene.which === "shifted" ? 2 / 3 : 2;
        const missing = active === 2 ? 4 / 3 : 0;
        return (
          <svg viewBox={`0 0 ${W} 216`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={sx(2)} x2={sx(2)} y1={36} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} />
            {same ? (
              <text x={sx(2)} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">μ = 표본평균 = 2</text>
            ) : (
              <>
                <text x={sx(2)} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">μ = 2</text>
                <line x1={sx(data.mean)} x2={sx(data.mean)} y1={36} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
                <text x={sx(data.mean) - 4} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">표본평균 4/3</text>
              </>
            )}
            {active === 2 && (
              <g>
                <line x1={sx(data.mean)} x2={sx(2)} y1={42} y2={42} stroke="#d97706" strokeWidth={1.25} />
                <text x={(sx(data.mean) + sx(2)) / 2} y={53} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">간격 2/3</text>
              </g>
            )}
            {data.obs.map((value, index) => (
              <g key={index}>
                <line x1={sx(value)} x2={sx(center)} y1={ROW_Y[index]} y2={ROW_Y[index]} stroke={scene.from === "mu" ? "#64748b" : "#2563eb"} strokeWidth={1.25} />
                <circle cx={sx(value)} cy={ROW_Y[index]} r={5} fill={scene.from === "mu" ? "#64748b" : "#2563eb"} />
                <text x={W - 8} y={ROW_Y[index] + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={scene.from === "mu" ? "#64748b" : "#2563eb"}>제곱 거리 {scene.right[index]}</text>
              </g>
            ))}
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[1, 2, 3].map((tick) => (
              <text key={tick} x={sx(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={12} fill="#64748b">{tick}점</text>
            ))}
            <text x={BAR_X} y={168} fontSize={12} fill="#64748b">거리 합 (막대 끝 = 2)</text>
            <rect x={BAR_X} y={174} width={BAR_W} height={22} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <rect x={BAR_X} y={174} width={barW(within)} height={22} rx={3} fill={scene.from === "mu" ? "#64748b" : "#2563eb"} fillOpacity={0.3} />
            <text x={BAR_X + barW(within) / 2} y={190} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.from === "mu" ? "#64748b" : "#2563eb"}>{within === 2 ? "2" : "2/3"}</text>
            {missing > 0 && (
              <>
                <rect x={BAR_X + barW(within)} y={174} width={barW(missing)} height={22} fill="#d97706" fillOpacity={0.3} />
                <text x={BAR_X + barW(within) + barW(missing) / 2} y={190} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">덜 센 4/3</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
