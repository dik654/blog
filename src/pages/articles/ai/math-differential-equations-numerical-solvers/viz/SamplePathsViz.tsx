import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, type Point } from "./plotHelpers";

/**
 * 본문 대응: #ode-sde-boundary — h=.25, g=.2: xₙ₊₁=.75xₙ+.1εₙ. 첫 단계 평균 .75, 표준편차 .1.
 * ε=0: 1,.75,.5625,.421875,.31640625. 세 ε 열은 설명용(가정).
 */
const path = (epsilons: readonly number[]): Point[] => {
  const points: Point[] = [[0, 1]];
  let x = 1;
  epsilons.forEach((eps, index) => {
    x = 0.75 * x + 0.1 * eps;
    points.push([(index + 1) * 0.25, x]);
  });
  return points;
};
const ZERO = path([0, 0, 0, 0]);
const PATHS = [
  { name: "A", eps: [1, 0.5, -0.5, 1], color: "#2563eb" },
  { name: "B", eps: [-1, 0.3, 0.8, -0.4], color: "#d97706" },
  { name: "C", eps: [0.2, -1.2, -0.6, 0.5], color: "#16a34a" },
] as const;

const sx = (t: number) => 38 + 300 * t;
const sy = (x: number) => 196 - 168 * x;

const SCENES = [
  { label: "난수 없이", summary: "ε=0 → 1, 0.75, 0.5625 …", note: "난수를 모두 0으로 두면 현재 값에 0.75를 곱하는 반복만 남습니다. 앞에서 본 간격 0.25의 Euler 값과 같은 0.31640625에서 끝납니다." },
  { label: "한 걸음의 퍼짐", summary: "다음 값: 평균 0.75 · 표준편차 0.1", note: "현재 값이 1이면 다음 값은 0.75+0.1ε이므로 평균 0.75, 표준편차 0.1입니다. 막대는 평균에서 표준편차 하나만큼의 범위이며 정규 난수는 이 밖의 값도 낼 수 있습니다." },
  { label: "같은 출발, 세 표본", summary: "끝값 ≈ 0.449 · 0.311 · 0.262", note: "시작값이 모두 1이어도 뽑힌 ε에 따라 경로가 갈립니다. 세 ε 열은 모양을 보이려고 고른 값이며 난수 실행 결과나 측정값이 아닙니다(가정)." },
] as const;

export default function SamplePathsViz() {
  return (
    <SceneShell
      eyebrow="표본 경로"
      title="같은 시작값에서 뽑힌 난수마다 다른 경로가 나옵니다"
      description="한 걸음의 식은 다음 값 = 현재 값 + 0.25×(−현재 값) + 0.2×√0.25×ε = 0.75×현재 값 + 0.1ε입니다. h=0.25, 흔들림 계수 g=0.2로 둔 가정 사례이고 ε는 평균 0, 분산 1인 표준 정규 난수입니다."
      ariaLabel="같은 시작값에서 갈라지는 확률 미분방정식의 표본 경로"
      scenes={SCENES}
      render={(active) => (
        <div>
          <PlotLegend items={[{ label: "ε=0", color: "#64748b", kind: "dash" }, ...PATHS.map((item) => ({ label: `경로 ${item.name} (ε: ${item.eps.map((e) => `${e > 0 ? "+" : "−"}${Math.abs(e)}`).join(", ")})`, color: item.color }))]} />
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, 0.5, 1]} xLabel="시간(초)" yLabel="상태 x" xMax={1} yBottom={0} yTop={1} />
            <path d={linePath(ZERO, sx, sy)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
            {active === 0 && ZERO.map(([t, x]) => <circle key={t} cx={sx(t)} cy={sy(x)} r={3} fill="#64748b" />)}
            <circle cx={sx(0)} cy={sy(1)} r={3.5} fill="#64748b" />
            {active === 1 && (
              <g>
                <line x1={sx(0.25)} x2={sx(0.25)} y1={sy(0.85)} y2={sy(0.65)} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={sx(0.25) - 5} x2={sx(0.25) + 5} y1={sy(0.85)} y2={sy(0.85)} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={sx(0.25) - 5} x2={sx(0.25) + 5} y1={sy(0.65)} y2={sy(0.65)} stroke="#dc2626" strokeWidth={1.25} />
                <circle cx={sx(0.25)} cy={sy(0.75)} r={3.2} fill="#dc2626" />
                <text x={sx(0.25) + 11} y={sy(0.85) + 3} fontSize={12} fontWeight={700} fill="#dc2626">0.85</text>
                <text x={sx(0.25) + 11} y={sy(0.75) + 3} fontSize={12} fontWeight={700} fill="#dc2626">평균 0.75</text>
                <text x={sx(0.25) + 11} y={sy(0.65) + 3} fontSize={12} fontWeight={700} fill="#dc2626">0.65</text>
              </g>
            )}
            {active === 2 && PATHS.map((item) => {
              const points = path(item.eps);
              return (
                <g key={item.name}>
                  <path d={linePath(points, sx, sy)} fill="none" stroke={item.color} strokeWidth={1.25} />
                  {points.slice(1).map(([t, x]) => <circle key={t} cx={sx(t)} cy={sy(x)} r={2.6} fill={item.color} />)}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    />
  );
}
