import SceneStage from "./SceneStage";

/**
 * 본문 대응: #bayes-act — 예측값 a를 0~100분으로 옮기며 네 배송의 비용 합을 그린다.
 * 절댓값 합 Σ|y−a| = 100 + 2a (0 ≤ a ≤ 100) → a=0에서 최소 100.
 * 제곱 합 Σ(y−a)² = 4a² − 200a + 10,000 → a=25에서 최소 7,500, a=0에서 10,000, a=100에서 30,000.
 */
const ACTUAL: readonly number[] = [0, 0, 0, 100];
const GRID = Array.from({ length: 101 }, (_, a) => a);
const absCost = (a: number) => ACTUAL.reduce<number>((sum, y) => sum + Math.abs(y - a), 0);
const sqCost = (a: number) => ACTUAL.reduce<number>((sum, y) => sum + (y - a) ** 2, 0);

const W = 360;
const H = 132;
const X0 = 44;
const X1 = 340;
const Y_TOP = 16;
const Y_BASE = 100;
const px = (a: number) => X0 + (a / 100) * (X1 - X0);

const SCENES = [
  {
    label: "절댓값 비용의 합",
    summary: "가장 낮은 곳 0분 · 합 100",
    note: "0분에서 예측을 오른쪽으로 1분 옮기면 실제 0분인 세 건의 비용이 1씩 늘고 100분 지연 한 건의 비용만 1 줄어, 합이 2 늘어납니다. 왼쪽에 세 건, 오른쪽에 한 건이 있는 한 오른쪽으로 갈수록 손해라서 가장 낮은 곳은 중앙값 0분입니다.",
  },
  {
    label: "제곱 비용의 합",
    summary: "가장 낮은 곳 25분 · 합 7,500",
    note: "제곱 비용은 0분에서 10,000이고 오른쪽으로 옮길수록 줄다가 25분에서 7,500으로 가장 낮습니다. 25분에서 방향 있는 잔차의 합이 −25−25−25+75=0이 되어 더 옮길 이유가 사라집니다. 이 점이 평균 25분입니다.",
  },
  {
    label: "두 비용이 고른 자리",
    summary: "중앙값 0분 · 평균 25분",
    note: "같은 네 값인데 가장 낮은 자리가 다릅니다. 절댓값 비용은 값의 개수 균형을 보고, 제곱 비용은 멀리 떨어진 100분에 끌려갑니다. 어느 쪽이 옳은지는 실제 업무 비용이 정합니다.",
  },
] as const;

function Chart({
  title,
  cost,
  best,
  ticks,
  color,
  focus,
}: {
  title: string;
  cost: (a: number) => number;
  best: number;
  ticks: readonly number[];
  color: string;
  focus: boolean;
}) {
  const values = GRID.map(cost);
  const max = Math.max(...values);
  const py = (value: number) => Y_BASE - (value / max) * (Y_BASE - Y_TOP);
  const path = GRID.map((a, index) => `${index === 0 ? "M" : "L"}${px(a).toFixed(1)},${py(values[index]).toFixed(1)}`).join(" ");
  const lineColor = focus ? color : "#94a3b8";
  return (
    <div className={`min-w-0 ${focus ? "" : "opacity-50"}`}>
      <p className="text-xs font-bold">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" role="img" aria-label={`${title}, 가장 낮은 곳 ${best}분`}>
        <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
        <line x1={X0} y1={Y_TOP - 6} x2={X0} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
        {[0, 25, 50, 100].map((a) => (
          <g key={a}>
            <line x1={px(a)} y1={Y_BASE} x2={px(a)} y2={Y_BASE + 4} stroke="#94a3b8" strokeWidth={1} />
            <text x={px(a)} y={Y_BASE + 16} textAnchor="middle" fontSize={12} fill="#64748b">
              {a}
            </text>
          </g>
        ))}
        <text x={X1} y={H - 2} textAnchor="end" fontSize={10} fill="#64748b">
          예측값(분)
        </text>
        {ticks.map((value) => (
          <text key={value} x={X0 - 6} y={py(value) + 4} textAnchor="end" fontSize={10} fill="#64748b">
            {value.toLocaleString("ko-KR")}
          </text>
        ))}
        <path d={path} fill="none" stroke={lineColor} strokeWidth={1.25} />
        <line x1={px(best)} y1={py(cost(best))} x2={px(best)} y2={Y_BASE} stroke={lineColor} strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={px(best)} cy={py(cost(best))} r={4} fill={lineColor} />
        <text
          x={px(best) + 8}
          y={best === 0 ? py(cost(best)) + 16 : py(cost(best)) - 8}
          fontSize={12}
          fontWeight={700}
          fill={focus ? color : "#64748b"}
        >
          {best}분에서 {cost(best).toLocaleString("ko-KR")}
        </text>
      </svg>
    </div>
  );
}

export default function CostCurveViz() {
  return (
    <SceneStage
      eyebrow="예측값을 옮겨 보기"
      title="비용 합이 가장 낮은 자리가 0분과 25분으로 갈립니다"
      description="실제 지연 0·0·0·100분(설명용 가정)은 그대로 두고 하나의 예측값 a를 0분에서 100분까지 옮기며 네 건의 비용 합을 그렸습니다. 두 그래프는 세로 눈금이 서로 다릅니다."
      ariaLabel="예측값에 따른 절댓값 비용 합과 제곱 비용 합, 최저점 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Chart
            title="절댓값 비용 합 Σ|y − a|"
            cost={absCost}
            best={0}
            ticks={[100, 300]}
            color="#2563eb"
            focus={active !== 1}
          />
          <Chart
            title="제곱 비용 합 Σ(y − a)²"
            cost={sqCost}
            best={25}
            ticks={[10000, 30000]}
            color="#d97706"
            focus={active !== 0}
          />
        </div>
      )}
    />
  );
}
