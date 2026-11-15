import SceneShell from "./SceneShell";

/**
 * 본문 대응: #correlation — Pearson r은 centered x·y의 곱을 더한 뒤 변동 크기로 나눈다.
 * 직선: x=[1,2,3], y=[2,4,6] (본문 예) → 곱 2,0,2 → 합 4, √2·√8=4 → r=1.
 * U자: x=[-2..2], y=x² (가정) → ȳ=2, 곱 −4,1,0,−1,4 → 합 0 → r=0.
 */
interface Case {
  xs: readonly number[];
  ys: readonly number[];
}

const LINE: Case = { xs: [1, 2, 3], ys: [2, 4, 6] };
const U_SHAPE: Case = { xs: [-2, -1, 0, 1, 2], ys: [4, 1, 0, 1, 4] };

const mean = (values: readonly number[]) => values.reduce<number>((sum, v) => sum + v, 0) / values.length;
const products = ({ xs, ys }: Case) => {
  const mx = mean(xs);
  const my = mean(ys);
  return xs.map((value, index) => (value - mx) * (ys[index] - my));
};
const pearson = (item: Case) => {
  const mx = mean(item.xs);
  const my = mean(item.ys);
  const sxx = item.xs.reduce<number>((sum, v) => sum + (v - mx) ** 2, 0);
  const syy = item.ys.reduce<number>((sum, v) => sum + (v - my) ** 2, 0);
  const sxy = products(item).reduce<number>((sum, v) => sum + v, 0);
  return sxy / Math.sqrt(sxx * syy);
};

const SCENES = [
  {
    label: "직선: 곱이 모두 같은 방향",
    summary: "곱의 합 4 → r = 1",
    note: "y=2x인 세 점은 평균보다 작은 x에서 y도 작고, 큰 x에서 y도 큽니다. 곱이 2, 0, 2로 상쇄 없이 쌓이고 변동 크기 √2·√8=4로 나누면 1입니다.",
    data: LINE,
  },
  {
    label: "U자: 곱이 서로 지웁니다",
    summary: "곱의 합 0 → r = 0",
    note: "y=x²인 다섯 점(가정)은 x가 정해지면 y가 완전히 정해지지만, 왼쪽 두 점의 곱 −4, +1과 오른쪽 두 점의 곱 −1, +4가 서로 지워 합이 0입니다. 강한 관계도 r≈0으로 보일 수 있는 이유입니다.",
    data: U_SHAPE,
  },
] as const;

const W = 360;
const H = 190;
const PLOT = { left: 24, right: 200, top: 16, bottom: 170 };

function Scatter({ data }: { data: Case }) {
  const mx = mean(data.xs);
  const my = mean(data.ys);
  const minX = Math.min(...data.xs) - 0.6;
  const maxX = Math.max(...data.xs) + 0.6;
  const minY = Math.min(...data.ys) - 0.8;
  const maxY = Math.max(...data.ys) + 0.8;
  const px = (v: number) => PLOT.left + ((v - minX) / (maxX - minX)) * (PLOT.right - PLOT.left);
  const py = (v: number) => PLOT.bottom - ((v - minY) / (maxY - minY)) * (PLOT.bottom - PLOT.top);
  const prods = products(data);
  const sum = prods.reduce<number>((acc, v) => acc + v, 0);
  const r = pearson(data);
  const barX = 222;
  const barMid = 290;
  const unit = 9;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`점과 평균선, 곱의 합 ${sum}, r=${r.toFixed(0)}`}>
      <rect x={PLOT.left} y={PLOT.top} width={PLOT.right - PLOT.left} height={PLOT.bottom - PLOT.top} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <line x1={px(mx)} x2={px(mx)} y1={PLOT.top} y2={PLOT.bottom} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={PLOT.left} x2={PLOT.right} y1={py(my)} y2={py(my)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
      <text x={px(mx) + 4} y={PLOT.top + 11} fontSize={11} fill="#64748b">x 평균</text>
      <text x={PLOT.right - 4} y={py(my) - 4} textAnchor="end" fontSize={11} fill="#64748b">y 평균</text>
      {data.xs.map((value, index) => {
        const p = prods[index];
        const color = p > 0 ? "#2563eb" : p < 0 ? "#dc2626" : "#64748b";
        return <circle key={index} cx={px(value)} cy={py(data.ys[index])} r={5} fill={color} />;
      })}
      <text x={barX} y={PLOT.top + 4} fontSize={11} fontWeight={700} fill="#64748b">점마다 곱 (왼쪽 점부터)</text>
      <line x1={barMid} x2={barMid} y1={PLOT.top + 12} y2={PLOT.top + 18 + prods.length * 20} stroke="#94a3b8" strokeWidth={1} />
      {prods.map((p, index) => {
        const y = PLOT.top + 16 + index * 20;
        const width = Math.abs(p) * unit;
        const color = p > 0 ? "#2563eb" : p < 0 ? "#dc2626" : "#64748b";
        return (
          <g key={index}>
            <rect x={p >= 0 ? barMid : barMid - width} y={y} width={Math.max(width, 1)} height={12} fill={color} opacity={0.75} />
            <text x={p >= 0 ? barMid + width + 3 : barMid - width - 3} y={y + 10} textAnchor={p >= 0 ? "start" : "end"} fontSize={11} fontWeight={700} fill={color}>
              {p > 0 ? `+${p}` : p < 0 ? `−${Math.abs(p)}` : "0"}
            </text>
          </g>
        );
      })}
      <text x={barX} y={PLOT.bottom} fontSize={11} fontWeight={700} fill="#64748b">합 {sum} · r = {Math.round(r)}</text>
    </svg>
  );
}

export default function CorrelationShapeViz() {
  return (
    <SceneShell
      eyebrow="Pearson r의 상쇄"
      title="관계가 강해도 곱이 서로 지우면 r은 0이 됩니다"
      description="점선은 x와 y의 평균입니다. 각 점의 (x−평균)×(y−평균)을 오른쪽 막대로 그렸고, 파랑은 양수·빨강은 음수입니다. 직선은 아래 식의 예, U자는 설명용 예입니다(가정)."
      ariaLabel="직선 세 점은 곱이 모두 양수라 r=1이고, U자 다섯 점은 곱이 상쇄되어 r=0인 비교"
      scenes={SCENES}
      render={(active) => <Scatter data={SCENES[active].data} />}
    />
  );
}
