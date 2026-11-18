import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 10만 경로 중 10번 → 0.01%, 이항 근사 표준오차 √(0.0001×0.9999÷100,000)≈0.00316%p, 추정값의 약 31.6%.
 * 칸 1,000개. 처음 세 장면은 칸 하나 = 100경로.
 * (가정) 같은 확률 0.01%에서 경로 100만 개 → 적중 약 100번, 칸 하나 = 1,000경로,
 * 표준오차 √(0.0001×0.9999÷1,000,000)≈0.001%p → 추정값의 약 10%.
 */
const COLS = 50;
const ROWS = 20;
const HIT_ORDER = Array.from({ length: 100 }, (_, i) => (i * 389 + 17) % (COLS * ROWS));

const SCENE_TUPLE = [
  { label: "10만 경로 중 10번", summary: "10 ÷ 100,000 = 0.01%", hits: 10, perCell: "100", se: null, note: "칸 하나에 경로 100개를 담아 10만 경로를 칸 1,000개로 그렸습니다. 빨간 칸 열 개가 손실 사건이 나온 경로입니다. 추정 확률은 10÷100,000=0.01%입니다." },
  { label: "표준오차를 막대로", summary: "±0.00316%p → 0.00684~0.01316%", hits: 10, perCell: "100", se: 0.00316, note: "이항 근사 표준오차는 √(0.0001×0.9999÷100,000)≈0.00316%p입니다. 표준오차는 같은 계산을 다른 난수로 반복할 때 추정값이 흔들릴 크기의 추정이며, 막대는 0.01%에서 그만큼 양쪽으로 그었습니다." },
  { label: "추정값 대비 31.6%", summary: "0.00316 ÷ 0.01 ≈ 31.6%", hits: 10, perCell: "100", se: 0.00316, note: "흔들림이 추정값 자체의 약 31.6%입니다. 경로를 10만 개나 만들었어도 실제로 손실을 본 표본은 열 개뿐이라, 가격이나 한도를 정하기에는 흔들림이 큽니다." },
  { label: "적중이 100번이라면 (가정)", summary: "경로 100만 · ±0.001%p · 약 10%", hits: 100, perCell: "1,000", se: 0.001, note: "같은 확률 0.01%에서 경로를 100만 개로 늘려 적중이 약 100번 나왔다고 가정하면 표준오차는 약 0.001%p, 추정값의 약 10%입니다. 추정값 대비 흔들림은 대략 1÷√적중 횟수라서(1÷√10≈31.6%, 1÷√100=10%) 경로 총수보다 적중 횟수가 정합니다." },
] as const;
const SCENES: readonly (typeof SCENE_TUPLE)[number][] = SCENE_TUPLE;

const W = 360;
const H = 236;
const CELL = 6.8;
const GRID_LEFT = (W - COLS * CELL) / 2;
const GRID_TOP = 6;
const AXIS_Y = 206;
const AX_LEFT = 24;
const AX_RIGHT = 336;
const ax = (pct: number) => AX_LEFT + (pct / 0.02) * (AX_RIGHT - AX_LEFT);
const AX_TICKS = [0, 0.005, 0.01, 0.015, 0.02] as const;

export default function RareHitErrorViz() {
  return (
    <SceneShell
      eyebrow="희귀사건의 표본"
      title="경로가 많아도 적중이 적으면 추정이 거칩니다"
      description="위 칸 묶음은 만든 경로 전체, 빨간 칸은 손실 사건이 나온 경로입니다. 아래 축은 추정 확률(%)이며 막대는 추정값 ± 표준오차입니다."
      ariaLabel="10만 경로 중 10번 나온 희귀사건의 추정 확률 0.01퍼센트와 표준오차 0.00316퍼센트포인트"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hits = new Set(HIT_ORDER.slice(0, scene.hits));
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: COLS * ROWS }, (_, index) => (
              <rect
                key={index}
                x={GRID_LEFT + (index % COLS) * CELL}
                y={GRID_TOP + Math.floor(index / COLS) * CELL}
                width={CELL - 1.2}
                height={CELL - 1.2}
                fill={hits.has(index) ? "#dc2626" : "#e2e8f0"}
              />
            ))}
            <text x={GRID_LEFT} y={GRID_TOP + ROWS * CELL + 14} fontSize={10} fill="#64748b">칸 하나 = 경로 {scene.perCell}개</text>
            <text x={W - GRID_LEFT} y={GRID_TOP + ROWS * CELL + 14} textAnchor="end" fontSize={10} fontWeight={700} fill="#dc2626">적중 {scene.hits}번</text>

            <line x1={AX_LEFT} x2={AX_RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {AX_TICKS.map((tick) => (
              <g key={tick}>
                <line x1={ax(tick)} x2={ax(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={ax(tick)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}%</text>
              </g>
            ))}
            {scene.se !== null && (
              <g>
                <line x1={ax(0.01 - scene.se)} x2={ax(0.01 + scene.se)} y1={AXIS_Y - 14} y2={AXIS_Y - 14} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={ax(0.01 - scene.se)} x2={ax(0.01 - scene.se)} y1={AXIS_Y - 19} y2={AXIS_Y - 9} stroke="#2563eb" strokeWidth={1} />
                <line x1={ax(0.01 + scene.se)} x2={ax(0.01 + scene.se)} y1={AXIS_Y - 19} y2={AXIS_Y - 9} stroke="#2563eb" strokeWidth={1} />
              </g>
            )}
            <circle cx={ax(0.01)} cy={AXIS_Y - 14} r={4.5} fill="#dc2626" />
            <text x={ax(0.01)} y={AXIS_Y - 26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">
              {scene.se === null ? "0.01%" : active === 1 ? `0.01% ± ${scene.se}%p` : `흔들림 = 추정값의 ${active === 3 ? "약 10%" : "약 31.6%"}`}
            </text>
          </svg>
        );
      }}
    />
  );
}
