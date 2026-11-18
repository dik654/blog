import SceneShell from "./SceneShell";

/**
 * 본문 대응: #open-loop — η₀=0.1, γ=0.5, K=100.
 * Step: η=0.1·0.5^floor(t/100) → t<100: 0.1, 100–199: 0.05, 200–299: 0.025. t=250 → 0.025.
 * Exponential: η=0.1·0.5^t → t=1: 0.05, t=2: 0.025, t=10: 약 0.0001, t=250: 약 5.5×10⁻⁷⁷.
 */
const ETA0 = 0.1;
const GAMMA = 0.5;
const K = 100;

const stepLr = (t: number) => ETA0 * GAMMA ** Math.floor(t / K);
const expLr = (t: number) => ETA0 * GAMMA ** t;

const W = 360;
const H = 190;
const LEFT = 44;
const RIGHT = 344;
const TOP = 16;
const BASE = 156;

const SCENES = [
  {
    label: "Step: milestone에서만 내려감",
    summary: "t=100·200에서 ×0.5",
    note: "Step policy는 update 100과 200의 경계를 지날 때만 γ=0.5를 곱합니다. 경계 사이에서는 learning rate(LR)가 그대로입니다.",
  },
  {
    label: "Update 250 읽기",
    summary: "floor(250/100)=2 → 0.025",
    note: "Update 250은 경계 두 개를 지났으므로 0.1×0.5²=0.025입니다. 251이든 299든 같은 계단 위에 있습니다.",
  },
  {
    label: "Exponential: 매 update ×0.5",
    summary: "t=250 → 0.1×0.5²⁵⁰",
    note: "같은 γ=0.5를 update마다 곱하면 300칸짜리 축에서는 시작 직후 0에 붙어 보입니다. t=250 값은 약 5.5×10⁻⁷⁷로 0.025와 전혀 다릅니다.",
  },
  {
    label: "앞 10 update 확대",
    summary: "t=2에서 이미 0.025",
    note: "가로축을 0–10으로 늘려 보면 exponential은 update 2에서 벌써 0.025에 닿고, step은 아직 0.1입니다. 같은 γ라도 몇 번 곱하는지가 곡선을 정합니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const AXIS = "#94a3b8";
const TEXT = "#64748b";

export default function StepVsExponentialViz() {
  return (
    <SceneShell
      eyebrow="같은 γ, 다른 호출 횟수"
      title="같은 0.5를 곱해도 언제 곱하느냐에 따라 LR가 갈립니다"
      description="세로축은 learning rate(LR), 가로축은 optimizer update 번호 t입니다. 파란 선은 100 update마다 0.5를 곱하는 step, 주황 선은 매 update 0.5를 곱하는 exponential이며 둘 다 η₀=0.1에서 시작합니다."
      ariaLabel="step decay와 exponential decay의 learning rate 곡선 비교"
      scenes={SCENES}
      render={(active) => {
        const tMax = active === 3 ? 10 : 300;
        const x = (t: number) => LEFT + (t / tMax) * (RIGHT - LEFT);
        const y = (lr: number) => BASE - (lr / ETA0) * (BASE - TOP);
        const samples = active === 3 ? 10 : 299;
        const stepPath = Array.from({ length: samples + 1 }, (_, t) =>
          t === 0 ? `M${x(0).toFixed(2)} ${y(stepLr(0)).toFixed(2)}` : `H${x(t).toFixed(2)} V${y(stepLr(t)).toFixed(2)}`,
        ).join(" ");
        const expPath = Array.from({ length: samples + 1 }, (_, t) => `${t === 0 ? "M" : "L"}${x(t).toFixed(2)} ${y(expLr(t)).toFixed(2)}`).join(" ");
        const xTicks = active === 3 ? [0, 2, 4, 6, 8, 10] : [0, 100, 200, 250, 300];
        const showExp = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0.1, 0.05, 0.025].map((lr) => (
              <g key={lr}>
                <line x1={LEFT} x2={RIGHT} y1={y(lr)} y2={y(lr)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={y(lr) + 4} textAnchor="end" fontSize={11} fill={TEXT}>
                  {lr}
                </text>
              </g>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke={AXIS} strokeWidth={1} />
            <text x={LEFT - 6} y={BASE + 4} textAnchor="end" fontSize={11} fill={TEXT}>
              0
            </text>
            {xTicks.map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={BASE} y2={BASE + 4} stroke={AXIS} strokeWidth={1} />
                <text x={x(t)} y={BASE + 17} textAnchor="middle" fontSize={11} fill={t === 250 && active === 1 ? BLUE : TEXT} fontWeight={t === 250 && active === 1 ? 700 : 400}>
                  {t}
                </text>
              </g>
            ))}
            <text x={RIGHT} y={BASE + 31} textAnchor="end" fontSize={11} fill={TEXT}>
              update t{active === 3 ? " (0–10 확대)" : ""}
            </text>
            {active === 0 &&
              [100, 200].map((t) => (
                <line key={t} x1={x(t)} x2={x(t)} y1={TOP} y2={BASE} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
              ))}
            <path d={stepPath} fill="none" stroke={BLUE} strokeWidth={1.25} opacity={active === 2 ? 0.45 : 1} />
            {showExp && <path d={expPath} fill="none" stroke={AMBER} strokeWidth={1.25} />}
            {active === 1 && (
              <g>
                <line x1={x(250)} x2={x(250)} y1={y(0.025)} y2={BASE} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={x(250)} cy={y(0.025)} r={4} fill={BLUE} />
                <text x={x(250)} y={y(0.025) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>
                  0.025
                </text>
              </g>
            )}
            {active === 2 && (
              <g>
                <circle cx={x(250)} cy={y(expLr(250))} r={4} fill={AMBER} />
                <text x={x(250)} y={y(expLr(250)) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>
                  ≈ 0
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                <circle cx={x(2)} cy={y(0.025)} r={4} fill={AMBER} />
                <text x={x(2) + 8} y={y(0.025) - 6} fontSize={11} fontWeight={700} fill={AMBER}>
                  t=2 · 0.025
                </text>
                <text x={x(7)} y={y(0.1) + 16} textAnchor="middle" fontSize={11} fill={BLUE}>
                  step은 아직 0.1
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
