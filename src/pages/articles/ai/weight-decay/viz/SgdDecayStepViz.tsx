import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sgd-equivalence — w⁺=(1−ηλ)w−ηg, w=10, η=.1, λ=.02, g=3.
 * ηλ=.002 → 10×.998=9.98(축소 .02) → 9.98−.1×3=9.68.
 * L2 경로: g+λw=3+.2=3.2 → 10−.1×3.2=9.68 (같은 값).
 */
const SCENES = [
  {
    label: "1. 출발점",
    summary: "w = 10",
    note: "한 scalar weight w=10을 따라갑니다. Learning rate η=0.1, decay coefficient λ=0.02, data gradient g=3입니다.",
  },
  {
    label: "2. 비율 축소",
    summary: "10 × (1 − 0.1×0.02) = 10 × 0.998 = 9.98",
    note: "먼저 현재 weight에 0.998을 곱합니다. 줄어드는 양 0.02는 현재 weight 10에 비례합니다. Data gradient가 0이면 여기서 멈춰 9.98이 됩니다.",
  },
  {
    label: "3. Task gradient step",
    summary: "9.98 − 0.1 × 3 = 9.68",
    note: "그다음 task gradient 몫 ηg=0.3을 뺍니다. 한 step 안에서 두 몫은 0.02와 0.3으로, 이 예에서는 task step이 훨씬 큽니다.",
  },
  {
    label: "4. L2 gradient로 계산해도",
    summary: "10 − 0.1 × (3 + 0.02×10) = 10 − 0.32 = 9.68",
    note: "L2 penalty의 gradient λw=0.2를 g에 더해 한 번에 빼도 같은 9.68에 도착합니다. 이 등가는 scalar learning rate를 쓰는 plain SGD, momentum·adaptive preconditioning 이전에서의 이야기입니다.",
  },
] as const;

const W = 360;
const H = 120;
const LO = 9.6;
const HI = 10.05;
const L = 24;
const R = W - 24;
const AX = 70;
const x = (v: number) => L + ((v - LO) / (HI - LO)) * (R - L);
const TICKS = [9.6, 9.7, 9.8, 9.9, 10];
const GRAY = "#64748b";
const BLUE = "#2563eb";
const ORANGE = "#d97706";
const GREEN = "#16a34a";

function Arrow({ from, to, y, color, label }: { from: number; to: number; y: number; color: string; label: string }) {
  const x1 = x(from);
  const x2 = x(to);
  return (
    <g>
      <line x1={x1} x2={x2 + 5} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2} ${y} l6 -4 v8 z`} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function SgdDecayStepViz() {
  return (
    <SceneShell
      eyebrow="Plain SGD 한 step"
      title="w=10이 9.98을 거쳐 9.68이 되기까지"
      description="수직선 위의 점이 weight 값입니다. 숫자는 모두 본문의 w=10, η=.1, λ=.02, g=3에서 계산했습니다."
      ariaLabel="weight decay 비율 축소와 task gradient step을 수직선 위에서 나누어 보는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const point = active === 0 ? 10 : active === 1 ? 9.98 : 9.68;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`} className="mx-auto block h-auto w-full max-w-[560px]">
            <line x1={L} x2={R} y1={AX} y2={AX} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={AX - 3} y2={AX + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(t)} y={AX + 17} textAnchor="middle" fontSize={10} fill={GRAY}>{t.toFixed(1)}</text>
              </g>
            ))}
            {(active === 1 || active === 2) && <Arrow from={10} to={9.98} y={AX - 22} color={ORANGE} label="−0.02" />}
            {active === 2 && <Arrow from={9.98} to={9.68} y={AX - 22} color={BLUE} label="−0.3" />}
            {active === 3 && <Arrow from={10} to={9.68} y={AX - 22} color={GREEN} label="−0.1×3.2 = −0.32" />}
            {active >= 1 && <circle cx={x(10)} cy={AX} r={3} fill="#ffffff" stroke={GRAY} strokeWidth={1} />}
            <circle cx={x(point)} cy={AX} r={5} fill={active === 3 ? GREEN : BLUE} />
            <text x={x(point)} y={AX + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 3 ? GREEN : BLUE}>
              {point.toFixed(2)}
            </text>
          </svg>
        );
      }}
    />
  );
}
