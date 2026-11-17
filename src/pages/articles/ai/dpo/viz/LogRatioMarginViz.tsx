import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pair-contract → #dpo — 한 pair의 네 log-probability가 log-ratio, margin, loss로 이어지는 순서.
 * 숫자는 모두 설명용 가정이다. chosen: reference −42.0 → policy −40.5, rejected: reference −38.0 → policy −39.0.
 * r⁺ = +1.5, r⁻ = −1.0, Δ = 2.5. β = 0.5(가정) → βΔ = 1.25, −log σ(1.25) ≈ 0.25, −log σ(0) ≈ 0.69, −log σ(−1.25) ≈ 1.50.
 */
const CHOSEN_REF = -42.0;
const CHOSEN_POLICY = -40.5;
const REJECTED_REF = -38.0;
const REJECTED_POLICY = -39.0;
const R_PLUS = CHOSEN_POLICY - CHOSEN_REF;
const R_MINUS = REJECTED_POLICY - REJECTED_REF;
const MARGIN = R_PLUS - R_MINUS;
const BETA = 0.5;

const loss = (z: number) => Math.log(1 + Math.exp(-z));

const SCENES = [
  {
    label: "네 log-prob을 읽습니다",
    summary: "이 예(가정): rejected가 더 높음",
    note: "Reference와 policy가 같은 prompt의 두 응답 전체에 준 log-prob입니다(가정한 값). 이 예에서는 두 model 모두 rejected에 더 높은 값을 줍니다. DPO가 비교하는 것은 이 절대값이 아닙니다.",
  },
  {
    label: "Reference 대비 이동량",
    summary: "r⁺ = +1.5 · r⁻ = −1.0",
    note: "log(πθ/πref)는 두 log-prob의 차이며, chosen 쪽 값을 r⁺, rejected 쪽 값을 r⁻라 부릅니다. chosen은 −42.0에서 −40.5로 1.5 올랐고, rejected는 −38.0에서 −39.0으로 1.0 내려갔습니다.",
  },
  {
    label: "Chosen − rejected margin",
    summary: "Δ = 1.5 − (−1.0) = 2.5",
    note: "rejected의 절대 log-prob이 여전히 chosen보다 높아도 Δ는 양수입니다.",
  },
  {
    label: "Margin이 loss가 됩니다",
    summary: "β = 0.5(가정) → loss ≈ 0.25",
    note: "민감도 계수 β를 곱한 margin에 −log σ(σ는 0~1 확률로 바꾸는 sigmoid)를 씌웁니다. βΔ = 1.25이면 약 0.25, Δ = 0이면 약 0.69, 뒤집힌 Δ = −2.5라면 약 1.50입니다.",
  },
] as const;

const W = 360;
const H = 200;
const AX_LEFT = 88;
const AX_RIGHT = 336;
const AX_MIN = -44;
const AX_MAX = -36;
const lx = (value: number) => AX_LEFT + ((value - AX_MIN) / (AX_MAX - AX_MIN)) * (AX_RIGHT - AX_LEFT);
const UNIT = (AX_RIGHT - AX_LEFT) / (AX_MAX - AX_MIN);
const ROW_CHOSEN = 46;
const ROW_REJECTED = 96;
const AXIS_Y = 128;

const CHOSEN_COLOR = "#2563eb";
const REJECTED_COLOR = "#d97706";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const Z_MIN = -3;
const Z_MAX = 3;
const CX_LEFT = 56;
const CX_RIGHT = 336;
const CY_TOP = 22;
const CY_BASE = 164;
const LOSS_MAX = 3.2;
const cx = (z: number) => CX_LEFT + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (CX_RIGHT - CX_LEFT);
const cy = (value: number) => CY_BASE - (value / LOSS_MAX) * (CY_BASE - CY_TOP);
const CURVE = Array.from({ length: 61 }, (_, index) => Z_MIN + (index * (Z_MAX - Z_MIN)) / 60)
  .map((z, index) => `${index === 0 ? "M" : "L"}${cx(z).toFixed(1)} ${cy(loss(z)).toFixed(1)}`)
  .join(" ");

const POINTS = [
  { z: BETA * MARGIN, label: "이 pair", color: CHOSEN_COLOR, dx: 6, dy: -8, anchor: "start" },
  { z: 0, label: "Δ = 0", color: MUTED, dx: 6, dy: -8, anchor: "start" },
  { z: -BETA * MARGIN, label: "뒤집힌 pair", color: "#dc2626", dx: -6, dy: -6, anchor: "end" },
] as const;

function Marker({ x, y, color, filled }: { x: number; y: number; color: string; filled: boolean }) {
  return <circle cx={x} cy={y} r={5} fill={filled ? color : "none"} stroke={color} strokeWidth={1.25} />;
}

function NumberLine({ active }: { active: number }) {
  const rows = [
    { name: "chosen y⁺", y: ROW_CHOSEN, ref: CHOSEN_REF, policy: CHOSEN_POLICY, color: CHOSEN_COLOR, ratio: R_PLUS },
    { name: "rejected y⁻", y: ROW_REJECTED, ref: REJECTED_REF, policy: REJECTED_POLICY, color: REJECTED_COLOR, ratio: R_MINUS },
  ];
  const marginX = AX_LEFT;
  const marginY = 168;
  return (
    <>
      {rows.map((row) => (
        <g key={row.name}>
          <text x={8} y={row.y + 4} fontSize={12} fontWeight={700} fill={row.color}>{row.name}</text>
          <line x1={AX_LEFT} x2={AX_RIGHT} y1={row.y} y2={row.y} stroke="#e2e8f0" strokeWidth={1} />
          {active >= 1 && (
            <>
              <line x1={lx(row.ref)} x2={lx(row.policy)} y1={row.y} y2={row.y} stroke={row.color} strokeWidth={1.25} />
              <text x={(lx(row.ref) + lx(row.policy)) / 2} y={row.y - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={row.color}>
                {row.name.startsWith("chosen") ? "r⁺" : "r⁻"} = {row.ratio > 0 ? "+" : "−"}{Math.abs(row.ratio).toFixed(1)}
              </text>
            </>
          )}
          <Marker x={lx(row.ref)} y={row.y} color={row.color} filled={false} />
          <Marker x={lx(row.policy)} y={row.y} color={row.color} filled />
          <text x={lx(row.ref) + (row.ref < row.policy ? 4 : -4)} y={row.y + 18} textAnchor={row.ref < row.policy ? "end" : "start"} fontSize={10.5} fill={MUTED}>ref {row.ref.toFixed(1)}</text>
          <text x={lx(row.policy) + (row.ref < row.policy ? -4 : 4)} y={row.y + 18} textAnchor={row.ref < row.policy ? "start" : "end"} fontSize={10.5} fill={row.color}>policy {row.policy.toFixed(1)}</text>
        </g>
      ))}
      <line x1={AX_LEFT} x2={AX_RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke={LINE} strokeWidth={1} />
      {[-44, -42, -40, -38, -36].map((tick) => (
        <g key={tick}>
          <line x1={lx(tick)} x2={lx(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke={LINE} strokeWidth={1} />
          <text x={lx(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={10.5} fill={MUTED}>{tick}</text>
        </g>
      ))}
      <text x={8} y={AXIS_Y + 15} fontSize={10.5} fill={MUTED}>log-prob →</text>
      {active >= 2 && (
        <g>
          <rect x={marginX} y={marginY - 7} width={R_PLUS * UNIT} height={14} fill={CHOSEN_COLOR} opacity={0.85} />
          <rect x={marginX + R_PLUS * UNIT} y={marginY - 7} width={-R_MINUS * UNIT} height={14} fill={REJECTED_COLOR} opacity={0.85} />
          <text x={8} y={marginY + 4} fontSize={12} fontWeight={700} fill="#64748b">margin Δ</text>
          <text x={marginX + MARGIN * UNIT + 6} y={marginY + 4} fontSize={12} fontWeight={700} fill="#64748b">1.5 + 1.0 = 2.5</text>
        </g>
      )}
    </>
  );
}

function LossCurve() {
  return (
    <>
      <line x1={CX_LEFT} x2={CX_RIGHT} y1={CY_BASE} y2={CY_BASE} stroke={LINE} strokeWidth={1} />
      <line x1={cx(0)} x2={cx(0)} y1={CY_TOP} y2={CY_BASE} stroke="#e2e8f0" strokeWidth={1} />
      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <text key={tick} x={cx(tick)} y={CY_BASE + 14} textAnchor="middle" fontSize={10.5} fill={MUTED}>{tick}</text>
      ))}
      <text x={CX_RIGHT} y={CY_BASE + 28} textAnchor="end" fontSize={10.5} fill={MUTED}>βΔ (오른쪽일수록 chosen 쪽 margin) →</text>
      <text x={8} y={CY_TOP + 4} fontSize={10.5} fill={MUTED}>loss</text>
      {[1, 2, 3].map((tick) => (
        <text key={tick} x={CX_LEFT - 6} y={cy(tick) + 3} textAnchor="end" fontSize={10.5} fill={MUTED}>{tick}</text>
      ))}
      <path d={CURVE} fill="none" stroke={MUTED} strokeWidth={1.25} />
      {POINTS.map((point) => (
        <g key={point.label}>
          <circle cx={cx(point.z)} cy={cy(loss(point.z))} r={4.5} fill={point.color} />
          <text x={cx(point.z) + point.dx} y={cy(loss(point.z)) + point.dy} textAnchor={point.anchor} fontSize={11.5} fontWeight={700} fill={point.color}>
            {point.label} → {loss(point.z).toFixed(2)}
          </text>
        </g>
      ))}
    </>
  );
}

export default function LogRatioMarginViz() {
  return (
    <SceneShell
      eyebrow="한 pair의 계산"
      title="네 log-prob이 하나의 margin과 loss가 되는 순서"
      description="log-prob은 model이 응답 전체에 주는 확률의 log이며 오른쪽일수록 높습니다. 빈 원은 고정된 reference πref, 채운 원은 학습 중인 policy πθ입니다. 숫자와 β는 모두 설명용 가정입니다."
      ariaLabel="chosen과 rejected의 reference·policy log-prob에서 log-ratio, margin, DPO loss를 계산하는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? <NumberLine active={active} /> : <LossCurve />}
        </svg>
      )}
    />
  );
}
