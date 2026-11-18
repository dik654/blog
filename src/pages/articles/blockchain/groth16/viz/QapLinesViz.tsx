import G16SceneShell from "./G16SceneShell";

/**
 * 본문 대응: #qap — L₁=2−X, L₂=X−1, U=xL₁+vL₂=9X−6, UV−W=72(X−1)(X−2).
 * w=5(§7의 잘못된 값)로 바꾸면 V=5L₁+12L₂=7X−2, UV−W=63X²−192X+132=63T−3X+6 → X=1에서 오차 3, X=2에서 0.
 * 정수 계수를 실수 X 위에 그린 설명용 그림이다.
 */
const XMIN = 0.7;
const XMAX = 2.3;
const LEFT = 46;
const RIGHT = 344;
const TOP = 14;
const BOTTOM = 176;
const STEPS = 48;

type Curve = { f: (x: number) => number; color: string; label: string; dashed?: boolean };
type Dot = { x: number; y: number; text: string; color: string };

const SCENES = [
  { label: "줄 번호의 스위치", summary: "L₁ = 2−X, L₂ = X−1", ymin: -0.4, ymax: 1.4, ticks: [0, 1], note: "L₁은 줄 1에서 1, 줄 2에서 0인 직선이고 L₂는 반대입니다. 어떤 값에 L₁을 곱하면 줄 1에서만, L₂를 곱하면 줄 2에서만 그 값이 나타납니다." },
  { label: "왼쪽 값 U", summary: "U = 3·L₁ + 12·L₂ = 9X−6", ymin: -2, ymax: 16, ticks: [0, 3, 12], note: "첫 줄의 왼쪽 x=3과 둘째 줄의 왼쪽 v=12를 하나의 직선으로 이었습니다. 같은 방식으로 V=8X−4, W=132X−120도 각 줄의 값을 지납니다." },
  { label: "오차가 두 번 0", summary: "UV−W = 72(X−1)(X−2)", ymin: -24, ymax: 32, ticks: [-18, 0, 18], note: "두 줄의 곱셈이 모두 맞으므로 오차 UV−W는 줄 1과 줄 2에서 0입니다. 그래서 두 번호를 근으로 갖는 T=(X−1)(X−2)로 나누어떨어지고 몫은 72입니다." },
  { label: "w = 5로 바꾸면", summary: "줄 1의 오차 3 · 나머지 −3X+6", ymin: -24, ymax: 32, ticks: [-18, 0, 18], note: "w만 5로 바꾸면 V=7X−2입니다. 오차는 줄 2에서 0이지만 줄 1에서 3이라 T로 나누면 나머지 −3X+6이 남습니다. 정확한 몫이 없습니다." },
] as const;

const CURVES: readonly (readonly Curve[])[] = [
  [
    { f: (x) => 2 - x, color: "#2563eb", label: "L₁" },
    { f: (x) => x - 1, color: "#d97706", label: "L₂" },
  ],
  [{ f: (x) => 9 * x - 6, color: "#2563eb", label: "U" }],
  [{ f: (x) => 72 * (x - 1) * (x - 2), color: "#2563eb", label: "UV−W" }],
  [
    { f: (x) => 72 * (x - 1) * (x - 2), color: "#94a3b8", label: "w=4", dashed: true },
    { f: (x) => 63 * x * x - 192 * x + 132, color: "#d97706", label: "w=5" },
  ],
];

const DOTS: readonly (readonly Dot[])[] = [
  [
    { x: 1, y: 1, text: "1", color: "#2563eb" },
    { x: 2, y: 0, text: "0", color: "#2563eb" },
    { x: 1, y: 0, text: "0", color: "#d97706" },
    { x: 2, y: 1, text: "1", color: "#d97706" },
  ],
  [
    { x: 1, y: 3, text: "x = 3", color: "#2563eb" },
    { x: 2, y: 12, text: "v = 12", color: "#2563eb" },
  ],
  [
    { x: 1, y: 0, text: "0", color: "#2563eb" },
    { x: 2, y: 0, text: "0", color: "#2563eb" },
  ],
  [
    { x: 1, y: 3, text: "3", color: "#d97706" },
    { x: 2, y: 0, text: "0", color: "#d97706" },
  ],
];

const px = (x: number) => LEFT + ((x - XMIN) / (XMAX - XMIN)) * (RIGHT - LEFT);

function Picture({ scene }: { scene: number }) {
  const s = SCENES[scene];
  const py = (y: number) => BOTTOM - ((y - s.ymin) / (s.ymax - s.ymin)) * (BOTTOM - TOP);
  const xs = Array.from({ length: STEPS + 1 }, (_, i) => XMIN + ((XMAX - XMIN) * i) / STEPS);
  const clamp = (y: number) => Math.max(TOP, Math.min(BOTTOM, y));
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 208" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
        {s.ticks.map((t) => (
          <g key={t}>
            <line x1={LEFT} x2={RIGHT} y1={py(t)} y2={py(t)} stroke={t === 0 ? "#64748b" : "#e2e8f0"} strokeWidth={1} />
            <text x={LEFT - 6} y={py(t) + 4} textAnchor="end" fontSize={11} fill="#64748b">{t}</text>
          </g>
        ))}
        {[1, 2].map((x) => (
          <g key={x}>
            <line x1={px(x)} x2={px(x)} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={px(x)} y={BOTTOM + 18} textAnchor="middle" fontSize={12} fill="#334155">줄 {x}</text>
          </g>
        ))}
        <text x={RIGHT} y={BOTTOM + 18} textAnchor="end" fontSize={11} fill="#94a3b8">X</text>
        {CURVES[scene].map((c) => {
          const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${px(x).toFixed(1)},${clamp(py(c.f(x))).toFixed(1)}`).join(" ");
          return <path key={c.label} d={d} fill="none" stroke={c.color} strokeWidth={1.25} strokeDasharray={c.dashed ? "4 3" : undefined} />;
        })}
        {DOTS[scene].map((dot) => (
          <g key={`${dot.x}-${dot.color}`}>
            <circle cx={px(dot.x)} cy={py(dot.y)} r={4} fill={dot.color} />
            <text x={px(dot.x) + 8} y={py(dot.y) - 6} fontSize={12} fontWeight={700} fill={dot.color}>{dot.text}</text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {CURVES[scene].map((c) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t" style={{ borderColor: c.color, borderTopStyle: c.dashed ? "dashed" : "solid" }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function QapLinesViz() {
  return (
    <G16SceneShell
      eyebrow="줄 번호를 지나는 다항식"
      title="두 줄의 값을 직선으로 잇고, 오차가 두 번호에서 모두 0인지 봅니다"
      description="가로축의 줄 1·줄 2는 7절 표의 두 곱셈 줄 번호입니다. U·V·W는 각 줄의 왼쪽·오른쪽·결과 값을 그 번호에서 지나게 이은 다항식입니다. 정수 계수를 실수 X 위에 그린 설명용 그림이며(가정), 세로 눈금은 장면마다 다릅니다."
      ariaLabel="줄 번호 스위치 직선, U 직선, 오차 다항식이 두 줄 번호에서 0이 되는 모습과 w=5일 때의 나머지"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
