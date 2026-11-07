import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace, #overview — θ가 수직선 위에서 움직이는 거리.
 * 두 장부: 3 → 2.9000000005 → 2.9052631584. 현재 변화율의 0.1배만: 3 → 2.8 → 3.
 */
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  cells: readonly (readonly [string, string])[];
}[] = [
  {
    label: "첫 이동",
    summary: "3 → 약 2.9",
    note: "보정 방향 2를 분모 2+10⁻⁸로 나눈 값이 약 1이고, 여기에 이동 크기 0.1을 곱해 θ에서 뺍니다. θ는 2.9000000005가 됩니다.",
    cells: [["이동 크기 η", "0.1"], ["보정 방향 m̂", "2"], ["분모 √v̂+ε", "2+10⁻⁸"], ["θ의 변화", "약 −0.1"]],
  },
  {
    label: "둘째 이동",
    summary: "약 2.9 → 약 2.905263",
    note: "분모는 그대로인데 보정 방향이 −0.105263…으로 줄었습니다. 그래서 θ는 반대쪽으로 약 0.0052631579만 돌아와 2.9052631584가 됩니다.",
    cells: [["이동 크기 η", "0.1"], ["보정 방향 m̂", "−0.105263…"], ["분모 √v̂+ε", "2+10⁻⁸"], ["θ의 변화", "약 +0.005263"]],
  },
  {
    label: "현재 변화율만 쓰는 규칙과 비교",
    summary: "약 2.9053 대 3",
    note: "매번 현재 변화율의 0.1배를 빼는 규칙은 2.8까지 갔다가 3으로 돌아옵니다. 두 신호의 크기가 같아도, 장부를 쓰는 규칙의 두 이동량은 같지 않습니다. 두 줄 모두 이 글의 가정값으로 계산한 것이며 어느 규칙이 더 낫다는 비교는 아닙니다.",
    cells: [["두 장부: 첫 이동", "약 −0.1"], ["두 장부: 둘째", "약 +0.005263"], ["변화율만: 첫 이동", "−0.2"], ["변화율만: 둘째", "+0.2"]],
  },
];

const W = 360;
const H = 158;
const AXIS_Y = 132;
const x = (value: number) => 40 + (value - 2.8) * 1400;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#94a3b8";
const MUTED = "#64748b";

function Hop({ from, to, y, color, faded = false }: { from: number; to: number; y: number; color: string; faded?: boolean }) {
  const x1 = x(from);
  const x2 = x(to);
  const dir = x2 > x1 ? 1 : -1;
  const stroke = faded ? GRAY : color;
  return (
    <g>
      <circle cx={x1} cy={y} r={2.5} fill={stroke} />
      <line x1={x1} x2={x2 - dir * 4} y1={y} y2={y} stroke={stroke} strokeWidth={1.25} />
      <polygon points={`${x2},${y} ${x2 - dir * 6},${y - 4} ${x2 - dir * 6},${y + 4}`} fill={stroke} />
    </g>
  );
}

export default function ThetaPathViz() {
  return (
    <SceneShell
      eyebrow="θ의 이동"
      title="같은 크기의 신호인데 두 번째 이동은 수직선에서 거의 보이지 않습니다"
      description="가로줄이 학습 중인 숫자 θ의 값이고 화살표 하나가 갱신 한 번입니다. θ=3, g=[2, −2], η=0.1은 이 글의 가정입니다."
      ariaLabel="두 장부 규칙과 현재 변화율만 쓰는 규칙에서 숫자 θ가 움직이는 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SCENES[active].cells.map(([label, value], index) => (
              <div key={index} className={`min-w-0 rounded-lg border bg-background px-2 py-2 text-center ${active < 2 && index === 3 ? "border-primary" : "border-border"}`}>
                <span className="block text-xs leading-5 text-muted-foreground">{label}</span>
                <span className="block font-mono text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[2.8, 2.9, 3].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={18} y2={AXIS_Y} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
                <text x={x(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={12} fill={MUTED}>{tick === 3 ? "3" : tick}</text>
              </g>
            ))}
            <line x1={20} x2={W - 20} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            <text x={8} y={13} fontSize={12} fontWeight={700} fill={BLUE}>두 장부를 쓰는 규칙</text>
            <Hop from={3} to={2.9} y={32} color={BLUE} faded={active === 1} />
            <text x={x(2.95)} y={27} textAnchor="middle" fontSize={12} fill={active === 1 ? MUTED : BLUE}>첫 이동</text>
            {active >= 1 && (
              <>
                <Hop from={2.9} to={2.9052631584} y={48} color={BLUE} />
                <text x={x(2.9052631584) + 6} y={52} fontSize={12} fill={BLUE}>둘째 이동(약 0.005263)</text>
              </>
            )}
            {active === 2 && (
              <>
                <text x={8} y={73} fontSize={12} fontWeight={700} fill={AMBER}>현재 변화율만 쓰는 규칙</text>
                <Hop from={3} to={2.8} y={90} color={AMBER} />
                <Hop from={2.8} to={3} y={110} color={AMBER} />
                <text x={x(2.95)} y={85} textAnchor="middle" fontSize={12} fill={AMBER}>첫 이동</text>
                <text x={x(2.95)} y={124} textAnchor="middle" fontSize={12} fill={AMBER}>둘째 이동</text>
              </>
            )}
          </svg>
        </div>
      )}
    />
  );
}
