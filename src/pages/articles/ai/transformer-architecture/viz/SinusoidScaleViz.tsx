import SceneShell from "./SceneShell";

/**
 * 본문 대응: #position-information sinusoidal PE — PE(pos,2i) = sin(pos / 10000^(2i/d)).
 * d = 8은 그림용 가정. 분모 10000^(2i/8): i=0 → 1, i=1 → 10, i=2 → 100, i=3 → 1000.
 * pos = 10의 짝수 차원 값: sin(10) ≈ −0.544, sin(1) ≈ 0.841, sin(0.1) ≈ 0.100, sin(0.01) ≈ 0.010.
 */
const D = 8;
const PAIRS = [0, 1, 2, 3];
const denom = (i: number) => 10000 ** ((2 * i) / D);
const PE = (pos: number, i: number) => Math.sin(pos / denom(i));
const POS_MAX = 60;
const PICK_POS = 10;

const COLORS = ["#2563eb", "#d97706", "#059669", "#7c3aed"];

const SCENES = [
  {
    label: "i = 0: 가장 빠른 차원",
    summary: "sin(pos / 1) · 한 바퀴 ≈ 6.3칸",
    note: "분모가 1이라 position이 하나만 바뀌어도 값이 크게 달라집니다. 가까운 순서를 표시하는 빠른 척도입니다. 값은 −1과 1 사이를 계속 되풀이합니다.",
  },
  {
    label: "i = 1: 열 배 느린 차원",
    summary: "sin(pos / 10) · 한 바퀴 ≈ 63칸",
    note: "분모가 10이라 같은 위치 변화에 열 배 천천히 움직입니다. 이 그림의 0~60 범위에서 대략 한 바퀴를 돕니다.",
  },
  {
    label: "i = 2, 3: 더 느린 차원",
    summary: "분모 100, 1000",
    note: "차원 index가 커질수록 분모가 기하급수적으로 커져 0~60 범위에서는 거의 직선처럼 천천히 오릅니다. 먼 순서를 느린 척도로 표시하는 차원입니다.",
  },
  {
    label: "한 position = 여러 척도의 값 묶음",
    summary: "pos = 10 → (−0.544, 0.841, 0.100, 0.010)",
    note: "세로선 하나가 position 하나입니다. 그 선이 각 곡선과 만나는 높이를 모은 것이 그 위치의 짝수 차원 값입니다. 홀수 차원에는 같은 분모의 cos가 들어가 짝을 이룹니다.",
  },
] as const;

const W = 360;
const H = 210;
const L = 40;
const R = 344;
const MID = 98;
const AMP = 72;
const x = (pos: number) => L + (pos / POS_MAX) * (R - L);
const y = (v: number) => MID - v * AMP;
const MUTED = "#64748b";

const PATHS = PAIRS.map((i) =>
  Array.from({ length: 241 }, (_, s) => (s / 240) * POS_MAX)
    .map((pos, s) => `${s === 0 ? "M" : "L"}${x(pos).toFixed(1)},${y(PE(pos, i)).toFixed(1)}`)
    .join(" "),
);

export default function SinusoidScaleViz() {
  return (
    <SceneShell
      eyebrow="여러 시간 척도"
      title="차원마다 다른 속도로 도는 sin이 position 하나를 표시합니다"
      description="짝수 차원 값 PE(pos, 2i) = sin(pos ÷ 10000^(2i/d))만 그렸습니다(i = 차원 쌍 번호, d = 8은 그림용 가정). 가로축 = position 0~60, 세로축 = 값(−1~1)."
      ariaLabel="Sinusoidal position encoding의 차원별 주파수 차이"
      scenes={SCENES}
      render={(active) => {
        const visible = active === 0 ? [0] : active === 1 ? [0, 1] : PAIRS;
        const focus = active === 0 ? [0] : active === 1 ? [1] : active === 2 ? [2, 3] : PAIRS;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={L} x2={R} y1={MID} y2={MID} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={L} x2={L} y1={y(1)} y2={y(-1)} stroke="#94a3b8" strokeWidth={1} />
            <text x={L - 6} y={y(1) + 4} textAnchor="end" fontSize={10} fill={MUTED}>1</text>
            <text x={L - 6} y={MID + 4} textAnchor="end" fontSize={10} fill={MUTED}>0</text>
            <text x={L - 6} y={y(-1) + 4} textAnchor="end" fontSize={10} fill={MUTED}>−1</text>
            {[0, 10, 30, 60].map((pos) => (
              <text key={pos} x={x(pos)} y={y(-1) + 16} textAnchor="middle" fontSize={10} fill={MUTED}>
                {pos}
              </text>
            ))}
            <text x={R} y={y(-1) + 30} textAnchor="end" fontSize={10} fill={MUTED}>position</text>
            {visible.map((i) => (
              <path
                key={i}
                d={PATHS[i]}
                fill="none"
                stroke={COLORS[i]}
                strokeWidth={focus.includes(i) ? 1.25 : 1}
                opacity={focus.includes(i) ? 1 : 0.3}
              />
            ))}
            <g>
              {PAIRS.map((i) => (
                <text
                  key={`k${i}`}
                  x={L + 4 + i * 76}
                  y={12}
                  fontSize={10}
                  fontWeight={focus.includes(i) ? 700 : 400}
                  fill={visible.includes(i) ? COLORS[i] : "#cbd5e1"}
                >
                  i={i} · ÷{denom(i).toLocaleString("en-US")}
                </text>
              ))}
            </g>
            {active === 3 && (
              <>
                <line x1={x(PICK_POS)} x2={x(PICK_POS)} y1={y(1)} y2={y(-1)} stroke="#0f172a" strokeWidth={1} strokeDasharray="2 3" />
                {PAIRS.map((i) => (
                  <circle key={`p${i}`} cx={x(PICK_POS)} cy={y(PE(PICK_POS, i))} r={3} fill={COLORS[i]} />
                ))}
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
