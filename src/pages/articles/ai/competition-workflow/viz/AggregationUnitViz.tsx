import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metric 첫 문단 — 방문 단위 평균과 사람별 평균의 평균은 다르다.
 * 설명용 숫자(가정): 갑 방문 3개 점수 1·1·1, 을 방문 1개 점수 0.
 * 방문 평균 = 3/4 = 0.75. 사람별: 갑 1, 을 0 → (1+0)/2 = 0.5.
 * 막대 = 전체 무게 1을 나눈 띠, 칸 너비 = 그 행의 무게, 파란 칸 = 점수 1.
 */
const ROWS: readonly { person: string; visit: string; score: number }[] = [
  { person: "갑", visit: "방문 1", score: 1 },
  { person: "갑", visit: "방문 2", score: 1 },
  { person: "갑", visit: "방문 3", score: 1 },
  { person: "을", visit: "방문 1", score: 0 },
];

const VISIT_WEIGHTS: readonly number[] = [1 / 4, 1 / 4, 1 / 4, 1 / 4];
const PERSON_WEIGHTS: readonly number[] = [1 / 6, 1 / 6, 1 / 6, 1 / 2];
const VISIT_MEAN = ROWS.reduce<number>((sum, row, i) => sum + row.score * VISIT_WEIGHTS[i], 0);
const PERSON_MEAN = ROWS.reduce<number>((sum, row, i) => sum + row.score * PERSON_WEIGHTS[i], 0);

const BLUE = "#2563eb";
const GRAY = "#64748b";
const LIGHT = "#94a3b8";

const BAR_X = 30;
const BAR_W = 300;

const SCENES = [
  { label: "방문 행 4개", summary: "갑 3방문 · 을 1방문", note: "예측 행은 방문입니다. 행 점수는 맞히면 1, 틀리면 0으로 둔 설명용 숫자입니다(가정). 갑은 방문이 3개, 을은 1개입니다." },
  { label: "방문마다 같은 무게", summary: "(1+1+1+0) ÷ 4 = 0.75", note: "네 방문을 똑같이 1/4씩 셉니다. 방문이 많은 갑이 띠의 3/4를 차지하므로 평균은 0.75입니다." },
  { label: "사람별 평균을 다시 평균", summary: "(1 + 0) ÷ 2 = 0.5", note: "먼저 사람마다 평균을 냅니다. 갑은 1, 을은 0입니다. 두 사람을 1/2씩 세면 갑의 방문 하나는 1/6, 을의 방문은 1/2의 무게를 갖고 평균은 0.5가 됩니다." },
  { label: "규칙이 값을 정함", summary: "같은 예측 · 0.75 대 0.5", note: "예측과 정답은 그대로인데 집계 규칙만 바꿔도 값이 달라집니다. 최종 목적이 사람별 피해라면 그 집계 규칙을 따로 적고, 집계 순서와 가중치를 버전과 함께 고정합니다." },
] as const;

function WeightBar({ y, weights, label, mean, emphasize }: { y: number; weights: readonly number[]; label: string; mean: number; emphasize: boolean }) {
  const starts = weights.map((_, i) => weights.slice(0, i).reduce<number>((sum, w) => sum + w, 0));
  return (
    <g>
      <text x={BAR_X} y={y - 8} fontSize={11} fontWeight={700} fill={emphasize ? BLUE : GRAY}>{label}</text>
      <text x={BAR_X + BAR_W} y={y - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={emphasize ? BLUE : GRAY}>{mean.toFixed(2)}</text>
      {weights.map((w, i) => (
        <g key={i}>
          <rect
            x={BAR_X + starts[i] * BAR_W}
            y={y}
            width={w * BAR_W}
            height={22}
            fill={ROWS[i].score === 1 ? BLUE : LIGHT}
            fillOpacity={ROWS[i].score === 1 ? 0.75 : 0.35}
            stroke="#ffffff"
            strokeWidth={1}
          />
          <text x={BAR_X + (starts[i] + w / 2) * BAR_W} y={y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={ROWS[i].score === 1 ? "#ffffff" : GRAY}>
            {`${ROWS[i].person}${i < 3 ? i + 1 : ""} ${w === 1 / 4 ? "1/4" : w === 1 / 6 ? "1/6" : "1/2"}`}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function AggregationUnitViz() {
  return (
    <SceneShell
      eyebrow="집계 단위"
      title="같은 네 방문, 평균 내는 방법에 따라 0.75와 0.5"
      description="위 칸은 방문 하나의 점수입니다. 아래 띠는 전체 무게 1을 행마다 나눈 것이고, 칸 너비가 그 행의 무게, 파란 부분의 비율이 평균입니다. 숫자는 설명용 가정입니다."
      ariaLabel="방문 단위 평균과 사람별 평균의 평균 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, i) => {
            const x = i < 3 ? 30 + i * 62 : 260;
            return (
              <g key={`${row.person}-${row.visit}`}>
                <rect x={x} y={34} width={54} height={40} rx={6} fill={row.score === 1 ? BLUE : LIGHT} fillOpacity={row.score === 1 ? 0.12 : 0.15} stroke={row.score === 1 ? BLUE : GRAY} strokeWidth={1} />
                <text x={x + 27} y={52} textAnchor="middle" fontSize={10} fill={GRAY}>{row.visit}</text>
                <text x={x + 27} y={67} textAnchor="middle" fontSize={12} fontWeight={700} fill={row.score === 1 ? BLUE : GRAY}>{row.score}</text>
              </g>
            );
          })}
          <text x={30} y={24} fontSize={11} fontWeight={700} fill={GRAY}>{active === 2 ? "갑 평균 1" : "갑"}</text>
          <text x={260} y={24} fontSize={11} fontWeight={700} fill={GRAY}>{active === 2 ? "을 평균 0" : "을"}</text>
          <line x1={30} x2={202} y1={29} y2={29} stroke={GRAY} strokeWidth={1} />
          <line x1={260} x2={314} y1={29} y2={29} stroke={GRAY} strokeWidth={1} />
          {(active === 1 || active === 3) && <WeightBar y={active === 3 ? 108 : 124} weights={VISIT_WEIGHTS} label="방문마다 같은 무게" mean={VISIT_MEAN} emphasize={active === 1} />}
          {(active === 2 || active === 3) && <WeightBar y={active === 3 ? 160 : 124} weights={PERSON_WEIGHTS} label="사람별 평균의 평균" mean={PERSON_MEAN} emphasize={active === 2} />}
          {active === 0 && <text x={30} y={140} fontSize={11} fill={GRAY}>평균을 어느 단위로 낼지는 아직 정하지 않았습니다</text>}
        </svg>
      )}
    />
  );
}
