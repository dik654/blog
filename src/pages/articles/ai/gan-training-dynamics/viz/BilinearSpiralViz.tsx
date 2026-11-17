import SceneShell from "./SceneShell";

/**
 * 본문 대응: #game-dynamics — min_x max_y xy, simultaneous fixed-step update
 * x_{t+1}=x_t−ηy_t, y_{t+1}=y_t+ηx_t. η=0.3, 출발점 (1,1)은 그림용 가정.
 * 한 step마다 원점까지 거리는 √(1+η²)≈1.044배, 방향은 atan(η)≈16.7° 돈다.
 */
const ETA = 0.3;
const STEPS = 20;
const START = [1, 1] as const;

const POINTS = Array.from({ length: STEPS }).reduce<Array<readonly [number, number]>>(
  (path) => {
    const [x, y] = path[path.length - 1];
    return [...path, [x - ETA * y, y + ETA * x] as const];
  },
  [START],
);
const radius = (t: number) => Math.hypot(POINTS[t][0], POINTS[t][1]);
const GROWTH = Math.sqrt(1 + ETA * ETA);
const TURN_DEG = (Math.atan(ETA) * 180) / Math.PI;

const SIZE = 300;
const C = SIZE / 2;
/** 첫 장면은 한 걸음이 보이도록 확대하고, 나머지는 20 step이 모두 들어가는 축척을 쓴다. */
const scaleFor = (active: number) => (C - 18) / (active === 0 ? 1.7 : 3.8);

const SCENES = [
  {
    label: "한 step",
    upto: 1,
    summary: `(1, 1) → (${POINTS[1][0].toFixed(1)}, ${POINTS[1][1].toFixed(1)})`,
    note: "x는 xy를 줄이려고 −ηy만큼, y는 같은 xy를 키우려고 +ηx만큼 움직입니다. 둘 다 자기 목적에는 맞는 방향이지만, 한 쪽은 가로로 한 쪽은 세로로 밀어 합친 걸음은 원점(평형점)을 향하지 않고 옆으로 돕니다.",
  },
  {
    label: "8 step",
    upto: 8,
    summary: `거리 ${radius(0).toFixed(2)} → ${radius(8).toFixed(2)}`,
    note: `매 step 방향이 약 ${TURN_DEG.toFixed(1)}°씩 돌아 8 step이면 약 ${(TURN_DEG * 8).toFixed(0)}° 돌았습니다. 점선 원은 출발 거리입니다. 원점에 가까워지지 않고 오히려 바깥으로 밀려납니다.`,
  },
  {
    label: "20 step",
    upto: 20,
    summary: `거리 ${radius(0).toFixed(2)} → ${radius(20).toFixed(2)}`,
    note: `20 step이면 거의 한 바퀴(약 ${(TURN_DEG * 20).toFixed(0)}°)를 돌았고 원점까지 거리는 ${(radius(20) / radius(0)).toFixed(2)}배가 됐습니다. 각 player의 loss만 따로 보면 매번 올바른 방향으로 움직였는데도 함께 본 상태는 나선을 그립니다.`,
  },
  {
    label: "왜 바깥으로 가나",
    upto: 20,
    summary: `한 step마다 거리 ×√(1+η²) = ×${GROWTH.toFixed(3)}`,
    note: `식을 그대로 제곱해 더하면 x²+y²이 매 step (1+η²)배가 됩니다. 이 고정 step·동시 갱신 모형에서는 η가 아무리 작아도 1보다 큰 배율이 곱해집니다. 본문 말대로 이것은 bilinear local model의 결과이고, TTUR 결론은 감소 step-size 같은 별도 조건 아래의 local 범위입니다.`,
  },
] as const;

export default function BilinearSpiralViz() {
  return (
    <SceneShell
      eyebrow="bilinear game"
      title="두 player가 각자 옳게 움직여도 평형점을 돈다"
      description="가로축이 min player x, 세로축이 max player y이고 가운데 원점이 평형점입니다. 목적 함수는 xy 하나이며, step size η=0.3과 출발점 (1, 1)은 그림을 위한 가정입니다."
      ariaLabel="min x max y xy 게임에서 동시 고정 step 갱신이 그리는 바깥 나선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const S = scaleFor(active);
        const px = (x: number) => C + x * S;
        const py = (y: number) => C - y * S;
        const shown = POINTS.slice(0, scene.upto + 1);
        const d = shown.map(([x, y], i) => `${i === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(" ");
        const [x0, y0] = POINTS[0];
        const [x1, y1] = POINTS[1];
        return (
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={10} x2={SIZE - 10} y1={C} y2={C} stroke="#94a3b8" strokeWidth={1} />
            <line x1={C} x2={C} y1={10} y2={SIZE - 10} stroke="#94a3b8" strokeWidth={1} />
            <text x={12} y={C - 6} fontSize={11} fill="#64748b">x (min)</text>
            <text x={C + 6} y={20} fontSize={11} fill="#64748b">y (max)</text>
            <circle cx={C} cy={C} r={3.5} fill="currentColor" />
            <text x={C - 6} y={C + 16} textAnchor="end" fontSize={10} fill="currentColor">평형점 (0,0)</text>
            <circle cx={C} cy={C} r={radius(0) * S} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <path d={d} fill="none" stroke="#ea580c" strokeWidth={1.25} />
            {shown.map(([x, y], i) => (
              <circle key={i} cx={px(x)} cy={py(y)} r={i === 0 || i === scene.upto ? 4 : 2.2} fill={i === 0 ? "#2563eb" : "#ea580c"} />
            ))}
            {active === 0 && (
              <g fontSize={10}>
                <line x1={px(x0)} x2={px(x1)} y1={py(y0)} y2={py(y0)} stroke="#2563eb" strokeWidth={1.25} />
                <text x={px((x0 + x1) / 2)} y={py(y0) + 14} textAnchor="middle" fill="#2563eb">−ηy</text>
                <line x1={px(x1)} x2={px(x1)} y1={py(y0)} y2={py(y1)} stroke="#16a34a" strokeWidth={1.25} />
                <text x={px(x1) - 5} y={py((y0 + y1) / 2) + 3} textAnchor="end" fill="#16a34a">+ηx</text>
              </g>
            )}
            <text x={px(x0) + 7} y={py(y0) + 4} fontSize={10} fill="#2563eb">출발</text>
            <text x={12} y={SIZE - 12} fontSize={10} fill="#64748b">점선: 출발 거리 {radius(0).toFixed(2)}{active === 0 ? " · 확대 축척" : ""}</text>
          </svg>
        );
      }}
    />
  );
}
