import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 네 입력을 (합, 합−1)로 바꾸고 음수를 0으로 지운 뒤 h₁−2h₂로 읽는다.
 * (0,0)→(0,−1)→(0,0)→0, (0,1)·(1,0)→(1,0)→(1,0)→1, (1,1)→(2,1)→(2,1)→0.
 */
type Pt = readonly [number, number];
type Input = { name: string; answer: 0 | 1; at: readonly Pt[] };

const INPUTS: readonly Input[] = [
  { name: "(0,0)", answer: 0, at: [[0, 0], [0, -1], [0, 0], [0, 0]] },
  { name: "(0,1)", answer: 1, at: [[0, 1], [1, 0], [1, 0], [1, 0]] },
  { name: "(1,0)", answer: 1, at: [[1, 0], [1, 0], [1, 0], [1, 0]] },
  { name: "(1,1)", answer: 0, at: [[1, 1], [2, 1], [2, 1], [2, 1]] },
];

type Label = { x: number; y: number; text: string; anchor?: "start" | "end" | "middle" };

const SCENES = [
  {
    label: "입력 네 점",
    summary: "필요한 답 0 · 1 · 1 · 0",
    note: "가로가 첫 입력, 세로가 둘째 입력입니다. 네모는 답 0, 동그라미는 답 1을 내야 하는 입력입니다. 답이 같은 (0,0)과 (1,1)이 서로 반대쪽 모서리에 있습니다.",
    axes: ["첫 입력", "둘째 입력"],
    labels: [
      { x: 0, y: 0, text: "(0,0)" },
      { x: 0, y: 1, text: "(0,1)" },
      { x: 1, y: 0, text: "(1,0)" },
      { x: 1, y: 1, text: "(1,1)" },
    ] as readonly Label[],
  },
  {
    label: "합과 합−1을 나란히",
    summary: "(0,0) → (0,−1)",
    note: "가로는 두 입력의 합, 세로는 그 합에서 1을 뺀 값입니다. (0,1)과 (1,0)은 같은 점 (1,0)으로 모이고, (1,1)은 (2,1)로, (0,0)은 음수 칸이 있는 (0,−1)로 갑니다.",
    axes: ["첫째 칸 = 합", "둘째 칸 = 합 − 1"],
    labels: [
      { x: 0, y: -1, text: "(0,0) → (0,−1)" },
      { x: 1, y: 0, text: "(0,1)·(1,0) → (1,0)" },
      { x: 2, y: 1, text: "(1,1) → (2,1)", anchor: "end" },
    ] as readonly Label[],
  },
  {
    label: "음수만 0으로",
    summary: "(0,−1) → (0,0)",
    note: "음수인 칸만 0으로 바꿉니다. 움직이는 점은 (0,0) 입력 하나뿐이고, 나머지는 음수 칸이 없어 그대로입니다.",
    axes: ["첫째 칸", "둘째 칸"],
    labels: [
      { x: 0, y: 0, text: "(0,0)" },
      { x: 1, y: 0, text: "(1,0)" },
      { x: 2, y: 1, text: "(2,1)", anchor: "end" },
    ] as readonly Label[],
  },
  {
    label: "마지막 계산",
    summary: "첫째 칸 − 2 × 둘째 칸",
    note: "바뀐 점마다 첫째 칸에서 둘째 칸의 두 배를 뺍니다. 0−0=0, 1−0=1, 2−2=0으로 네 입력의 답이 차례로 0, 1, 1, 0이 됩니다.",
    axes: ["첫째 칸", "둘째 칸"],
    labels: [
      { x: 0, y: 0, text: "0 − 0 = 0" },
      { x: 1, y: 0, text: "1 − 0 = 1" },
      { x: 2, y: 1, text: "2 − 2 = 0", anchor: "end" },
    ] as readonly Label[],
  },
] as const;

const X0 = 96; // 가로 0의 위치
const PX = 96; // 가로 1 = 96px
const Y0 = 116; // 세로 0의 위치
const PY = 64; // 세로 1 = 64px
const sx = (x: number) => X0 + x * PX;
const sy = (y: number) => Y0 - y * PY;

const C_ZERO = "#2563eb";
const C_ONE = "#d97706";

export default function XorRepresentationViz() {
  return (
    <SceneShell
      eyebrow="네 입력을 다시 적기"
      title="중간 계산을 거치면 네 입력이 마지막 계산으로 읽히는 자리로 옮겨집니다"
      description="점 하나가 입력 하나입니다. 네모는 답 0, 동그라미는 답 1을 내야 하는 입력입니다. 같은 평면에서 가로·세로가 가리키는 숫자는 장면마다 바뀌며, 축 이름을 함께 적었습니다."
      ariaLabel="두 스위치 문제의 네 입력이 중간 계산을 거쳐 이동하고 답으로 읽히는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <line x1={sx(-0.6)} y1={sy(0)} x2={sx(2.6)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={sx(0)} y1={sy(-1.4)} x2={sx(0)} y2={sy(1.5)} stroke="#94a3b8" strokeWidth={1} />
            {[1, 2].map((t) => (
              <g key={`x${t}`}>
                <line x1={sx(t)} x2={sx(t)} y1={sy(0) - 3} y2={sy(0) + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(t)} y={sy(0) + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">{t}</text>
              </g>
            ))}
            {[1, -1].map((t) => (
              <g key={`y${t}`}>
                <line x1={sx(0) - 3} x2={sx(0) + 3} y1={sy(t)} y2={sy(t)} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(0) - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">{t}</text>
              </g>
            ))}
            {active >= 1 && <rect x={sx(-0.6)} y={sy(0)} width={sx(2.6) - sx(-0.6)} height={sy(-1.4) - sy(0)} fill="#fee2e2" opacity={0.35} />}
            {active >= 1 && <text x={sx(2.6)} y={sy(-1.4) - 6} textAnchor="end" fontSize={11} fill="#dc2626">둘째 칸이 음수인 영역</text>}
            <text x={sx(2.6)} y={sy(0) + 32} textAnchor="end" fontSize={12} fill="#64748b">{`${s.axes[0]} →`}</text>
            <text x={sx(0) + 6} y={sy(1.5) + 10} fontSize={12} fill="#64748b">{`↑ ${s.axes[1]}`}</text>
            {INPUTS.map((input) => {
              const [x, y] = input.at[active];
              const color = input.answer === 0 ? C_ZERO : C_ONE;
              return (
                <g key={input.name} style={{ transform: `translate(${sx(x)}px, ${sy(y)}px)`, transition: "transform 500ms ease" }} className="motion-reduce:transition-none">
                  {input.answer === 0 ? (
                    <rect x={-7} y={-7} width={14} height={14} rx={2} fill={color} />
                  ) : (
                    <circle r={7} fill="none" stroke={color} strokeWidth={1.25} />
                  )}
                </g>
              );
            })}
            {s.labels.map((l) => (
              <text
                key={`${l.x},${l.y}`}
                x={sx(l.x) + (l.anchor === "end" ? -12 : 12)}
                y={sy(l.y) - 10}
                textAnchor={l.anchor ?? "start"}
                fontSize={12}
                fontWeight={700}
                className="fill-foreground"
              >
                {l.text}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
