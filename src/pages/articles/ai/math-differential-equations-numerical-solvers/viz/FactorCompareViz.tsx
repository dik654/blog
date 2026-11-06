import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #heun-runge-kutta — a=hλ, Euler 배율 1−a, Heun 배율 1−a+a²/2=((a−1)²+1)/2.
 * a=2: Euler −1, Heun 1. a=1: Euler 0, Heun .5. a=.5: Heun .625. a=.25: Heun .78125.
 */
const euler = (a: number) => 1 - a;
const heun = (a: number) => 1 - a + (a * a) / 2;
const sx = (a: number) => 38 + 124 * a;
const sy = (y: number) => 114 - 64 * y;

const SCENES = [
  { label: "Euler 배율", summary: "1−a · a=2에서 −1", note: "a는 hλ입니다. Euler의 배율은 직선이고 a=2에서 아래쪽 경계 −1을 지납니다. 띠 안에 있는 동안만 계산값의 크기가 줄어듭니다." },
  { label: "Heun 배율", summary: "1−a+a²/2 · a=2에서 +1", note: "Heun의 배율은 항상 양수인 포물선입니다. a=1에서 가장 작은 0.5이고 a=2에서 위쪽 경계 1로 돌아옵니다. 빠져나가는 쪽은 다르지만 양의 a에서 띠 안에 있는 구간은 Euler와 같은 0<a<2입니다." },
  { label: "작은 a에서", summary: "a=0.5 → 0.625 · a=0.25 → 0.78125", note: "이 글의 h=0.5, λ=1은 a=0.5이고 h=0.25는 a=0.25입니다. 이 값들이 Heun의 단계 배율 0.625와 0.78125입니다. 차수가 높아졌어도 넘지 말아야 할 a=2는 그대로입니다." },
] as const;

export default function FactorCompareViz() {
  return (
    <SceneShell
      eyebrow="한 단계 배율"
      title="Heun도 Euler와 같은 a=2에서 감쇠 구간을 벗어납니다"
      description="가로는 a=hλ, 세로는 감소 문제에서 한 단계마다 곱하는 배율입니다. 초록 띠는 배율의 절댓값이 1보다 작은 구간입니다."
      ariaLabel="Euler와 Heun의 단계 배율 비교"
      scenes={SCENES}
      render={(active) => (
        <div>
          <PlotLegend items={[{ label: "|배율|<1", color: "#86efac", kind: "box" }, { label: "Euler 1−a", color: "#2563eb" }, { label: "Heun 1−a+a²/2", color: "#d97706" }]} />
          <svg viewBox="0 0 360 246" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={sx(0)} y={sy(1)} width={sx(2.4) - sx(0)} height={sy(-1) - sy(1)} fill="#16a34a" opacity={0.12} />
            <PlotAxes sx={sx} sy={sy} xTicks={[0, 1, 2]} yTicks={[-1, 0, 1]} xLabel="a = hλ" yLabel="한 단계 배율" xMax={2.4} yBottom={-1.5} yTop={1.5} />
            <line x1={sx(0)} x2={sx(2.4)} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
            <line x1={sx(2)} x2={sx(2)} y1={sy(1.5)} y2={sy(-1.5)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <path d={linePath(sample(euler, 0, 2.4), sx, sy)} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={active === 0 ? 1 : 0.5} />
            <circle cx={sx(2)} cy={sy(-1)} r={3.4} fill="#2563eb" />
            <text x={sx(2) - 7} y={sy(-1) + 14} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">−1</text>
            {active >= 1 && (
              <g>
                <path d={linePath(sample(heun, 0, 2.4), sx, sy)} fill="none" stroke="#d97706" strokeWidth={1.25} />
                <circle cx={sx(2)} cy={sy(1)} r={3.4} fill="#d97706" />
                <text x={sx(2) - 7} y={sy(1) - 7} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">+1</text>
              </g>
            )}
            {active === 1 && (
              <g>
                <circle cx={sx(1)} cy={sy(0.5)} r={3.4} fill="#d97706" />
                <text x={sx(1) + 3} y={sy(0.5) + 16} fontSize={12} fontWeight={700} fill="#d97706">최소 0.5</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <circle cx={sx(0.25)} cy={sy(0.78125)} r={3.4} fill="#d97706" />
                <text x={sx(0.25) + 6} y={sy(0.78125) - 8} fontSize={12} fontWeight={700} fill="#d97706">a=0.25: 0.78125</text>
                <circle cx={sx(0.5)} cy={sy(0.625)} r={3.4} fill="#d97706" />
                <text x={sx(0.76)} y={sy(0.3)} fontSize={12} fontWeight={700} fill="#d97706">a=0.5: 0.625</text>
              </g>
            )}
          </svg>
        </div>
      )}
    />
  );
}
