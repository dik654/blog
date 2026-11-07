import SceneShell from "./SceneShell";

/**
 * 본문 대응: #radians — 호 길이를 반지름으로 나눈 값. 반지름 5와 2에서 비교.
 * 1/4바퀴 5π/2 ÷ 5 = π ÷ 2 = π/2, 반 바퀴 5π ÷ 5 = 2π ÷ 2 = π, 한 바퀴 10π ÷ 5 = 4π ÷ 2 = 2π.
 */
const SCENES = [
  { label: "1/4바퀴", summary: "θ = π/2", turn: 0.25, big: "5π/2", small: "π", theta: "π/2", note: "큰 원은 호가 5π/2, 작은 원은 π로 길이가 다릅니다. 그래도 반지름으로 나누면 둘 다 π/2입니다." },
  { label: "반 바퀴", summary: "θ = π", turn: 0.5, big: "5π", small: "2π", theta: "π", note: "한 바퀴 중 돈 비율이 같으면 원의 크기와 관계없이 같은 숫자가 나옵니다. 반 바퀴는 π, 곧 180°입니다." },
  { label: "한 바퀴", summary: "θ = 2π", turn: 1, big: "10π", small: "4π", theta: "2π", note: "반지름 5인 원의 둘레 10π를 5로 나누면 2π입니다. 그래서 한 바퀴를 2π rad, 곧 360°라고 적습니다." },
] as const;

const CX = 110;
const CY = 110;
const UNIT = 18;

function arcPath(radius: number, turn: number) {
  const r = radius * UNIT;
  if (turn >= 1) {
    return `M${CX + r} ${CY}A${r} ${r} 0 1 0 ${CX - r} ${CY}A${r} ${r} 0 1 0 ${CX + r} ${CY}`;
  }
  const angle = turn * 2 * Math.PI;
  return `M${CX + r} ${CY}A${r} ${r} 0 ${turn > 0.5 ? 1 : 0} 0 ${CX + r * Math.cos(angle)} ${CY - r * Math.sin(angle)}`;
}

export default function ArcRatioViz() {
  return (
    <SceneShell
      eyebrow="호 ÷ 반지름"
      title="원이 커져도 회전량을 재는 숫자는 그대로입니다"
      description="호는 원 둘레에서 지나간 부분입니다. 진한 선이 반시계로 지나간 호이고, 두 원은 반지름 5와 2입니다. 지나간 호를 자기 반지름으로 나눈 값이 라디안입니다."
      ariaLabel="반지름 5와 2인 원에서 호 길이를 반지름으로 나눈 값 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 220" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <circle cx={CX} cy={CY} r={5 * UNIT} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.6} />
            <circle cx={CX} cy={CY} r={2 * UNIT} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.6} />
            <line x1={CX} x2={CX + 5 * UNIT} y1={CY} y2={CY} stroke="#64748b" strokeWidth={1} />
            <path d={arcPath(5, scene.turn)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <path d={arcPath(2, scene.turn)} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <circle cx={CX} cy={CY} r={2.5} fill="#64748b" />
            <circle cx={CX + 5 * UNIT * Math.cos(scene.turn * 2 * Math.PI)} cy={CY - 5 * UNIT * Math.sin(scene.turn * 2 * Math.PI)} r={4} fill="#2563eb" />
            <circle cx={CX + 2 * UNIT * Math.cos(scene.turn * 2 * Math.PI)} cy={CY - 2 * UNIT * Math.sin(scene.turn * 2 * Math.PI)} r={4} fill="#d97706" />

            <text x={222} y={46} fontSize={12} fontWeight={700} fill="#2563eb">반지름 5</text>
            <text x={222} y={66} fontSize={14} fill="#2563eb">{scene.big} ÷ 5</text>
            <text x={222} y={106} fontSize={12} fontWeight={700} fill="#d97706">반지름 2</text>
            <text x={222} y={126} fontSize={14} fill="#d97706">{scene.small} ÷ 2</text>
            <line x1={222} x2={346} y1={144} y2={144} stroke="#94a3b8" strokeWidth={1} />
            <text x={222} y={170} fontSize={15} fontWeight={700} fill="#64748b">둘 다 {scene.theta} rad</text>
          </svg>
        );
      }}
    />
  );
}
