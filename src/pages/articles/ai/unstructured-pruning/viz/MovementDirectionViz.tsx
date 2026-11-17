import SceneShell from "./SceneShell";

/**
 * 본문 대응: #movement-score — w=.1, g=−2 → −gw = .2(0에서 멀어지는 신호),
 * g=2 → −gw = −.2(0 쪽 신호). 셋째 장면의 w=−.1은 부호 규칙을 보이려는 가정입니다.
 * 화살표는 −g 방향만 나타내며 길이는 step 크기가 아닙니다.
 */
const SCENES = [
  { label: "w = 0.1, g = −2", summary: "−gw = +0.2 · 0에서 멀어짐", w: 0.1, g: -2, note: "−g = +2는 오른쪽이고 w가 0의 오른쪽이라 0에서 멀어집니다. −(−2)(0.1) = +0.2." },
  { label: "w = 0.1, g = 2", summary: "−gw = −0.2 · 0 쪽", w: 0.1, g: 2, note: "−g = −2는 0 쪽입니다. −(2)(0.1) = −0.2. |w|만 보면 첫 장면과 구분되지 않습니다." },
  { label: "w = −0.1, g = 2 (가정)", summary: "−gw = +0.2 · 0에서 멀어짐", w: -0.1, g: 2, note: "w가 음수면 왼쪽이 0에서 멀어지는 쪽입니다. −(2)(−0.1) = +0.2. g는 둘째 장면과 같아도 w를 곱하면 부호가 갈립니다." },
] as const;

const W = 360;
const H = 140;
const CX = 180;
const UNIT = 600; // 0.1 → 60px
const AXIS_Y = 86;
const ARROW = 70;

export default function MovementDirectionViz() {
  return (
    <SceneShell
      eyebrow="Movement 신호의 부호"
      title="−gw의 부호는 weight가 0에서 멀어지는 쪽으로 밀리는지를 말합니다"
      description="점은 현재 weight w, 화살표는 loss를 줄이는 방향 −g입니다(g는 그 weight의 loss gradient). 화살표 길이는 step 크기가 아닙니다."
      note="한 step의 1차 직관입니다. 실제 movement pruning은 이 신호를 여러 step에 더하고 mask·threshold schedule과 함께 씁니다."
      ariaLabel="weight 위치와 gradient 반대 방향으로 본 movement 신호의 부호"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const x = CX + scene.w * UNIT;
        const dir = -scene.g > 0 ? 1 : -1;
        const signal = -scene.g * scene.w;
        const away = signal > 0;
        const color = away ? "#2563eb" : "#d97706";
        const tip = x + dir * ARROW;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={20} x2={W - 20} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[-0.2, -0.1, 0, 0.1, 0.2].map((t) => (
              <g key={t}>
                <line x1={CX + t * UNIT} x2={CX + t * UNIT} y1={AXIS_Y - (t === 0 ? 10 : 4)} y2={AXIS_Y + (t === 0 ? 10 : 4)} stroke={t === 0 ? "#475569" : "#94a3b8"} strokeWidth={t === 0 ? 1.25 : 1} />
                <text x={CX + t * UNIT} y={AXIS_Y + 24} fontSize={10} textAnchor="middle" fill="#64748b">{t === 0 ? "0" : t.toFixed(1)}</text>
              </g>
            ))}
            <line x1={x} x2={tip - dir * 6} y1={AXIS_Y - 26} y2={AXIS_Y - 26} stroke={color} strokeWidth={1.25} />
            <path d={`M ${tip} ${AXIS_Y - 26} L ${tip - dir * 8} ${AXIS_Y - 31} L ${tip - dir * 8} ${AXIS_Y - 21} Z`} fill={color} />
            <text x={x + dir * (ARROW / 2)} y={AXIS_Y - 34} fontSize={10} textAnchor="middle" fill={color}>−g 방향</text>
            <line x1={x} x2={x} y1={AXIS_Y - 26} y2={AXIS_Y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={x} cy={AXIS_Y} r={5} fill="#64748b" />
            <text x={x} y={AXIS_Y + 40} fontSize={11} fontWeight={700} textAnchor="middle" fill="#64748b">w = {scene.w}</text>
            <text x={W / 2} y={18} fontSize={11} fontWeight={700} textAnchor="middle" fill={color}>
              {away ? "0에서 멀어지는 쪽 → 신호 +" : "0을 향하는 쪽 → 신호 −"}
            </text>
          </svg>
        );
      }}
    />
  );
}
