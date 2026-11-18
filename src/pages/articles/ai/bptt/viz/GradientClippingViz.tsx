import SceneShell from "./SceneShell";

/**
 * 본문 대응: "Gradient clipping은 explosion을 다루는 안전장치다"와 clipping 식.
 * g_clip = g·min(1, c/‖g‖₂). c=1, gradient 성분 두 개(가정).
 * 작은 g=(0.3,0.4): ‖g‖=0.5 → 그대로. 큰 g=(3,4): ‖g‖=5 → ×0.2 → (0.6,0.8).
 * 비교용 element별 clipping: 각 성분을 ±1에서 자르면 (1,1), 방향 53.1° → 45°.
 */
const C = 1;
const UNIT = 30;
const OX = 54;
const OY = 176;

type Vec = readonly [number, number];

const toX = (value: number) => OX + value * UNIT;
const toY = (value: number) => OY - value * UNIT;
const norm = ([x, y]: Vec) => Math.hypot(x, y);
const angle = ([x, y]: Vec) => (Math.atan2(y, x) * 180) / Math.PI;

const SMALL: Vec = [0.3, 0.4];
const BIG: Vec = [3, 4];
const scaleOf = (g: Vec) => Math.min(1, C / norm(g));
const clipByNorm = (g: Vec): Vec => [g[0] * scaleOf(g), g[1] * scaleOf(g)];
const clipEach = (g: Vec): Vec => [Math.max(-C, Math.min(C, g[0])), Math.max(-C, Math.min(C, g[1]))];

const SCENES = [
  {
    label: "norm이 c 이하",
    summary: "‖g‖ = 0.5 → 배율 1",
    note: "‖g‖=0.5가 c=1 아래이므로 min(1, 1/0.5)=1입니다. gradient는 그대로입니다. 이미 작아진 장기 gradient를 키워 주지도 않습니다.",
  },
  {
    label: "norm이 c 초과",
    summary: "‖g‖ = 5 → 배율 0.2",
    note: "‖g‖=5이므로 배율은 min(1, 1/5)=0.2입니다. (3, 4)가 (0.6, 0.8)이 되어 길이는 c=1로 줄지만 방향은 53.1° 그대로입니다.",
  },
  {
    label: "element별 clipping과 비교",
    summary: "(3, 4) → (1, 1) · 방향 45°",
    note: "성분마다 따로 ±1에서 자르면 (1, 1)이 됩니다. 길이는 약 1.41이고 방향이 53.1°에서 45°로 바뀝니다. global norm clipping은 모든 성분에 같은 배율을 곱하므로 이런 방향 변화가 없습니다.",
  },
] as const;

function Arrow({ from, to, color, dashed = false }: { from: Vec; to: Vec; color: string; dashed?: boolean }) {
  return (
    <line
      x1={toX(from[0])}
      y1={toY(from[1])}
      x2={toX(to[0])}
      y2={toY(to[1])}
      stroke={color}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={`url(#gc-${color.slice(1)})`}
    />
  );
}

export default function GradientClippingViz() {
  return (
    <SceneShell
      eyebrow="global norm clipping"
      title="threshold c를 넘은 gradient만 같은 방향으로 길이를 줄입니다"
      description="gradient 성분이 두 개뿐이라고 보고(가정) 화살표 하나로 그렸습니다. 점선 원은 길이가 c=1인 경계입니다(c 값은 가정). 회색은 원래 gradient, 파란색은 clipping 결과입니다."
      ariaLabel="gradient norm이 threshold보다 작을 때, 클 때, 그리고 element별 clipping과의 비교"
      scenes={SCENES}
      render={(active) => {
        const original = active === 0 ? SMALL : BIG;
        const result = active === 0 ? SMALL : active === 1 ? clipByNorm(BIG) : clipEach(BIG);
        const resultColor = active === 2 ? "#d97706" : "#2563eb";
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              {["#94a3b8", "#2563eb", "#d97706"].map((color) => (
                <marker key={color} id={`gc-${color.slice(1)}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill={color} />
                </marker>
              ))}
            </defs>
            <line x1={OX - 10} x2={OX + 4.4 * UNIT} y1={OY} y2={OY} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={OX} x2={OX} y1={OY + 6} y2={OY - 5.3 * UNIT} stroke="#cbd5e1" strokeWidth={1} />
            <text x={OX + 4.4 * UNIT} y={OY - 4} textAnchor="end" fontSize={12} fill="#64748b">g₁</text>
            <text x={OX + 5} y={OY - 5.1 * UNIT} fontSize={12} fill="#64748b">g₂</text>
            <circle cx={OX} cy={OY} r={C * UNIT} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={toX(-0.15)} y={toY(1.15)} textAnchor="end" fontSize={12} fill="#64748b">c = 1</text>
            {active === 2 ? <path d={`M ${toX(0)} ${toY(C)} L ${toX(C)} ${toY(C)} L ${toX(C)} ${toY(0)}`} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="2 3" /> : null}
            {active === 2 ? <text x={toX(C) + 5} y={toY(0.45)} fontSize={11} fill="#d97706">성분별 한계 ±1</text> : null}
            {active > 0 ? <Arrow from={[0, 0]} to={original} color="#94a3b8" dashed /> : null}
            <Arrow from={[0, 0]} to={result} color={resultColor} />
            {active > 0 ? <text x={toX(original[0]) - 8} y={toY(original[1]) - 4} textAnchor="end" fontSize={12} fill="#64748b">원래 g (3, 4)</text> : null}
            <g fontSize={13}>
              <text x={200} y={34} fill="#334155">{`‖g‖ = ${norm(original).toFixed(1)}`}</text>
              <text x={200} y={54} fill="#334155">{`방향 ${angle(original).toFixed(1)}°`}</text>
              <text x={200} y={88} fill={resultColor} fontWeight={700}>{active === 2 ? "element별 결과" : "clipping 결과"}</text>
              <text x={200} y={108} fill={resultColor}>{`(${result[0].toFixed(1)}, ${result[1].toFixed(1)})`}</text>
              <text x={200} y={128} fill={resultColor}>{`길이 ${norm(result).toFixed(2)}`}</text>
              <text x={200} y={148} fill={resultColor}>{`방향 ${angle(result).toFixed(1)}°`}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
