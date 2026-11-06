import type { PlotScale } from "./plotMath";

/** x·y 축과 눈금입니다. 축 눈금은 그래프가 실제로 계산에 쓰는 값만 넘겨받습니다. */
export default function PlotAxes({
  scale,
  xTicks,
  yTicks,
  xLabel = "x",
  yLabel = "점수",
  xAxisAt,
}: {
  scale: PlotScale;
  xTicks: readonly number[];
  yTicks: readonly number[];
  xLabel?: string;
  yLabel?: string;
  xAxisAt?: number;
}) {
  const axisY = xAxisAt === undefined ? scale.bottom : scale.sy(xAxisAt);
  return (
    <g>
      <line x1={scale.left} x2={scale.left} y1={scale.top} y2={scale.bottom} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
      <line x1={scale.left} x2={scale.right} y1={axisY} y2={axisY} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
      {xTicks.map((tick) => (
        <g key={tick}>
          <line x1={scale.sx(tick)} x2={scale.sx(tick)} y1={axisY} y2={axisY + 4} stroke="currentColor" strokeWidth={1} />
          <text x={scale.sx(tick)} y={axisY + 17} textAnchor="middle" fontSize={12} fill="currentColor">{String(tick)}</text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line x1={scale.left - 4} x2={scale.left} y1={scale.sy(tick)} y2={scale.sy(tick)} stroke="currentColor" strokeWidth={1} />
          <text x={scale.left - 7} y={scale.sy(tick) + 4} textAnchor="end" fontSize={12} fill="currentColor">{String(tick)}</text>
        </g>
      ))}
      <text x={scale.left} y={scale.top - 6} fontSize={12} fill="currentColor">{yLabel}</text>
      <text x={scale.right + 4} y={axisY + 4} fontSize={12} fill="currentColor">{xLabel}</text>
    </g>
  );
}
