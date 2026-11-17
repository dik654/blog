import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gaussian-score — log p(x) = C − x²/2 의 기울기가 score s(x) = −x.
 * x=2 → 기울기 −2(왼쪽), x=−1 → 기울기 +1(오른쪽), 둘 다 0 쪽.
 * C를 1 키운 곡선(가정)은 위로 평행 이동할 뿐 같은 x의 기울기가 같아 score가 바뀌지 않는다.
 */
const W = 340;
const H = 244;
const X0 = 170;
const UNIT_X = 54;
const TOP_Y = 30;
const UNIT_Y = 30;
const LOG_TOP = 1.5;
const SCORE_Y = 222;
const ARROW_UNIT = 22;
const SHIFT = 1;

const px = (x: number) => X0 + x * UNIT_X;
const py = (logp: number) => TOP_Y + (LOG_TOP - logp) * UNIT_Y;
const logp = (x: number, c: number) => c - (x * x) / 2;

const SAMPLES = Array.from({ length: 51 }, (_, index) => -2.5 + index * 0.1);
const curvePath = (c: number) =>
  SAMPLES.map((x, index) => `${index === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(logp(x, c)).toFixed(1)}`).join(" ");

const POINTS = [
  { x: 2, label: "x=2", score: "s(2)=−2" },
  { x: -1, label: "x=−1", score: "s(−1)=+1" },
] as const;

const SCENES = [
  {
    label: "x=2의 기울기",
    summary: "기울기 −2 → 왼쪽",
    note: "x=2에서 곡선은 오른쪽으로 갈수록 내려갑니다. 그 기울기 −2가 score이고, 아래 줄의 화살표는 log density가 커지는 왼쪽, 곧 중심 0 쪽을 가리킵니다.",
  },
  {
    label: "x=−1의 기울기",
    summary: "기울기 +1 → 오른쪽",
    note: "x=−1에서는 곡선이 오른쪽으로 올라가므로 score는 +1입니다. 양수 위치와 음수 위치의 화살표가 서로 반대 방향이지만 둘 다 density peak인 0을 향합니다.",
  },
  {
    label: "C를 바꿔도 같은 화살표",
    summary: "곡선 높이 +1 · 기울기 그대로",
    note: "정규화 상수 C가 1 큰 곡선(가정)은 전체가 위로 올라갈 뿐이라 x=2와 x=−1의 기울기가 그대로입니다. 그래서 score 화살표만 보고는 normalized density 값을 알 수 없습니다.",
  },
] as const;

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - dir * 6} y2={y} stroke={color} strokeWidth="1.25" />
      <path d={`M${x2} ${y} L${x2 - dir * 8} ${y - 4.5} L${x2 - dir * 8} ${y + 4.5} Z`} fill={color} />
    </g>
  );
}

function Tangent({ x, c, color }: { x: number; c: number; color: string }) {
  const slope = -x;
  const half = 0.55;
  return (
    <line
      x1={px(x - half)}
      y1={py(logp(x, c) - slope * half)}
      x2={px(x + half)}
      y2={py(logp(x, c) + slope * half)}
      stroke={color}
      strokeWidth="1.25"
    />
  );
}

export default function GaussianScoreSlopeViz() {
  return (
    <SceneShell
      eyebrow="Standard Gaussian · 1차원"
      title="곡선의 기울기가 그 자리의 score 화살표가 됩니다"
      description="위는 log density 곡선 log p(x) = C − x²/2, 아래 줄은 같은 x에서의 score s(x) = −x 화살표입니다. Score는 log density를 x로 미분한 값, 곧 그 점의 기울기입니다."
      ariaLabel="표준 정규분포 log density 곡선의 기울기와 score 화살표"
      scenes={SCENES}
      render={(active) => {
        const shown = POINTS.filter((_, index) => index <= Math.min(active, 1));
        const shifted = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={SCENES[active].note} className="mx-auto block h-auto w-full max-w-[30rem]">
            <line x1={px(-2.5)} y1={py(-3.2)} x2={px(2.5)} y2={py(-3.2)} stroke="#94a3b8" strokeWidth="1" />
            {[-2, -1, 0, 1, 2].map((x) => (
              <g key={x}>
                <line x1={px(x)} y1={py(-3.2) - 3} x2={px(x)} y2={py(-3.2) + 3} stroke="#94a3b8" strokeWidth="1" />
                <text x={px(x)} y={py(-3.2) + 15} textAnchor="middle" fontSize="13" fill="#64748b">
                  {x < 0 ? `−${Math.abs(x)}` : x}
                </text>
              </g>
            ))}
            <path d={curvePath(0)} fill="none" stroke="#2563eb" strokeWidth="1.25" />
            <text x={px(0)} y={py(0) + 22} textAnchor="middle" fontSize="13" fill="#2563eb">
              log p(x)
            </text>
            <g opacity={shifted ? 1 : 0}>
              <path d={curvePath(SHIFT)} fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="5 4" />
              <text x={px(0)} y={14} textAnchor="middle" fontSize="13" fill="#7c3aed">
                점선: C가 1 큰 곡선 (가정)
              </text>
            </g>
            {shown.map((point) => (
              <g key={point.x}>
                <Tangent x={point.x} c={0} color="#d97706" />
                <circle cx={px(point.x)} cy={py(logp(point.x, 0))} r="3.5" fill="#d97706" />
                <g opacity={shifted ? 1 : 0}>
                  <Tangent x={point.x} c={SHIFT} color="#7c3aed" />
                  <circle cx={px(point.x)} cy={py(logp(point.x, SHIFT))} r="3" fill="#7c3aed" />
                </g>
                <line
                  x1={px(point.x)}
                  y1={py(logp(point.x, 0)) + 5}
                  x2={px(point.x)}
                  y2={SCORE_Y - 10}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <Arrow x1={px(point.x)} x2={px(point.x) - point.x * ARROW_UNIT} y={SCORE_Y} color="#d97706" />
                <text
                  x={px(point.x)}
                  y={SCORE_Y - 14}
                  textAnchor={point.x > 0 ? "start" : "end"}
                  fontSize="13"
                  fontWeight="700"
                  fill="#b45309"
                >
                  {point.score}
                </text>
              </g>
            ))}
            <text x={px(0)} y={SCORE_Y + 4} textAnchor="middle" fontSize="13" fill="#64748b">
              s(0)=0
            </text>
            <text x={2} y={SCORE_Y + 4} fontSize="13" fill="#64748b">
              score
            </text>
          </svg>
        );
      }}
    />
  );
}
