import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss-derivation — L_vlb = L_T + Σ_{t=2..T} L_{t−1} + L_0.
 * 그림은 T=4(가정): L_T는 x₄, L₃·L₂·L₁은 각 reverse step, L₀는 x₁→x₀.
 */
const NODE_X = [30, 105, 180, 255, 330];
const NODE_Y = 92;
const NAMES = ["x₀", "x₁", "x₂", "x₃", "x₄"];

type Focus = "none" | "prior" | "steps" | "recon";

const SCENES: readonly { label: string; summary: string; focus: Focus; note: string }[] = [
  { label: "두 방향", summary: "q는 고정 · p_θ는 학습", focus: "none", note: "위 화살표는 학습 전에 고정한 forward q, 아래 화살표는 network가 근사하는 reverse p_θ입니다. log-likelihood를 직접 최적화하지 못해, q를 이용한 하한(ELBO)을 칸마다 나눕니다." },
  { label: "오른쪽 끝 · L_T", summary: "학습 parameter 없음", focus: "prior", note: "x_T의 분포와 prior N(0,I)의 차이입니다. T가 크면 q(x_T|x₀)가 사실상 N(0,I)라 이 항은 상수에 가깝고 학습과 거의 무관합니다. T=4는 그림용이라 이 조건을 뜻하지 않습니다." },
  { label: "가운데 · L_{t−1}", summary: "t=2…T, reverse step마다", focus: "steps", note: "x₀까지 알 때 계산되는 정답 posterior와 model의 reverse step을 KL(두 분포의 차이를 재는 값)로 비교합니다. 실제 학습은 이 항들에서 일어납니다." },
  { label: "왼쪽 끝 · L₀", summary: "x₁ → x₀ 복원", focus: "recon", note: "마지막에 연속값을 discrete 값으로 복원하는 단계는 KL이 아니라 별도 reconstruction 항으로 처리합니다." },
];

const CHIPS: readonly { x: number; text: string; group: Focus }[] = [
  { x: 67.5, text: "L₀", group: "recon" },
  { x: 142.5, text: "L₁", group: "steps" },
  { x: 217.5, text: "L₂", group: "steps" },
  { x: 292.5, text: "L₃", group: "steps" },
];

function Chip({ x, y, text, on }: { x: number; y: number; text: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.4}>
      <rect x={x - 19} y={y - 13} width={38} height={24} rx={6} fill="var(--background)" stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{text}</text>
    </g>
  );
}

export default function ElboChainViz() {
  return (
    <SceneShell
      eyebrow="bound를 칸으로 나누기"
      title="하나의 lower bound가 사슬의 칸마다 쪼개집니다"
      description="동그라미는 noise level별 state입니다. T=4는 그림을 위한 값이며(가정), L 칩이 각 항이 걸린 자리입니다."
      ariaLabel="forward q와 reverse p 사슬에서 L_T, L_t-1, L_0 항의 위치"
      scenes={SCENES}
      render={(active) => {
        const { focus } = SCENES[active];
        return (
          <svg viewBox="0 44 360 124" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={180} y={60} textAnchor="middle" fontSize={12} fill="#64748b">forward q (고정) →</text>
            <text x={180} y={126} textAnchor="middle" fontSize={12} fill="#2563eb">← reverse p_θ (학습)</text>
            {NODE_X.slice(0, 4).map((x, index) => {
              const next = NODE_X[index + 1];
              return (
                <g key={x}>
                  <line x1={x + 17} x2={next - 17} y1={NODE_Y - 18} y2={NODE_Y - 18} stroke="#94a3b8" strokeWidth={1} />
                  <path d={`M${next - 23} ${NODE_Y - 22} L${next - 17} ${NODE_Y - 18} L${next - 23} ${NODE_Y - 14}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  <line x1={x + 17} x2={next - 17} y1={NODE_Y + 18} y2={NODE_Y + 18} stroke="#2563eb" strokeWidth={1} />
                  <path d={`M${x + 23} ${NODE_Y + 14} L${x + 17} ${NODE_Y + 18} L${x + 23} ${NODE_Y + 22}`} fill="none" stroke="#2563eb" strokeWidth={1} />
                </g>
              );
            })}
            {NODE_X.map((x, index) => (
              <g key={x}>
                <circle cx={x} cy={NODE_Y} r={15} fill="var(--background)" stroke="#64748b" strokeWidth={1} />
                <text x={x} y={NODE_Y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{NAMES[index]}</text>
              </g>
            ))}
            {CHIPS.map((chip) => (
              <Chip key={chip.text} x={chip.x} y={152} text={chip.text} on={focus === "none" || focus === chip.group} />
            ))}
            <Chip x={336} y={152} text="L_T" on={focus === "none" || focus === "prior"} />
          </svg>
        );
      }}
    />
  );
}
