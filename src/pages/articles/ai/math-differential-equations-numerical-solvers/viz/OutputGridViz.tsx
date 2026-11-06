import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #source — t=[0,.25,1].
 * step_size=.5: 격자 0,.5,1 → 1,.5,.25. .25초 출력은 선형 보간 .75, 정확값 ≈.778801.
 * step_size 없음: 격자 0,.25,1 → 1,.75,.75×.25=.1875.
 */
const sx = (t: number) => 62 + 272 * t;
const sy = (x: number) => 220 - 140 * x;
const REQUEST = [0, 0.25, 1];

const SCENES = [
  { label: "step_size=0.5", summary: "0.25초 값 0.75는 보간 · 끝값 0.25", grid: [0, 0.5, 1], values: [1, 0.5, 0.25], note: "내부에서는 0.5초씩 두 번만 계산합니다. 0.25초의 0.75는 1과 0.5의 중간을 잇는 선형 보간입니다. 정확한 e^(−0.25)≈0.778801도 아니고, 0.25초 간격으로 끝까지 계산했다는 증거도 아닙니다." },
  { label: "step_size 없음", summary: "격자 = 요청 시각 · 끝값 0.1875", grid: [0, 0.25, 1], values: [1, 0.75, 0.1875], note: "이 고정 간격 클래스는 요청한 t 자체를 격자로 씁니다. 첫 간격 0.25 뒤에 간격 0.75로 이동해 끝값은 0.75×0.25=0.1875입니다. 출력 시각을 더 적는 행동이 이 설정에서는 실제 결과를 바꿀 수 있습니다." },
] as const;

export default function OutputGridViz() {
  return (
    <SceneShell
      eyebrow="출력 시각과 내부 간격"
      title="같은 t=[0, 0.25, 1]을 요청해도 내부 격자에 따라 계산이 달라집니다"
      description="위 두 줄은 요청한 출력 시각과 실제로 변화율을 읽으며 이동한 시각입니다. 아래 그래프는 같은 시간축의 값이며 Euler, 시작값 1, x′=−x입니다."
      ariaLabel="출력 시각과 내부 계산 격자의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const points = scene.grid.map((t, index) => [t, scene.values[index]] as const);
        return (
          <div>
            <PlotLegend items={[{ label: "기준 경로", color: "#64748b", kind: "dash" }, { label: "내부에서 계산한 점", color: "#2563eb", kind: "dot" }, { label: "보간한 출력", color: "#d97706", kind: "ring" }]} />
            <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={0} y={14} fontSize={11.5} fill="#64748b">요청 시각</text>
              <line x1={sx(0)} x2={sx(1)} y1={10} y2={10} stroke="#94a3b8" strokeWidth={1} />
              {REQUEST.map((t) => <circle key={t} cx={sx(t)} cy={10} r={3.4} fill="#64748b" />)}
              <text x={0} y={38} fontSize={11.5} fill="#2563eb" fontWeight={700}>내부 격자</text>
              <line x1={sx(0)} x2={sx(1)} y1={34} y2={34} stroke="#94a3b8" strokeWidth={1} />
              {scene.grid.map((t) => (
                <g key={t}>
                  <circle cx={sx(t)} cy={34} r={3.4} fill="#2563eb" />
                  <text x={sx(t)} y={50} textAnchor="middle" fontSize={11.5} fill="#2563eb">{t}</text>
                </g>
              ))}
              <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, 0.5, 1]} xLabel="시간(초)" yLabel="" xMax={1} yBottom={0} yTop={1} />
              <path d={linePath(sample((t) => Math.exp(-t), 0, 1), sx, sy)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
              <path d={linePath(points, sx, sy)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              {points.map(([t, x]) => <circle key={t} cx={sx(t)} cy={sy(x)} r={3.4} fill="#2563eb" />)}
              {active === 0 && (
                <g>
                  <circle cx={sx(0.25)} cy={sy(0.75)} r={4} fill="none" stroke="#d97706" strokeWidth={1.25} />
                  <text x={sx(0.25) - 7} y={sy(0.75) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">보간 0.75</text>
                </g>
              )}
              {active === 1 && <text x={sx(0.25) - 7} y={sy(0.75) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">0.75</text>}
              <text x={sx(1) - 6} y={sy(scene.values[2]) + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">끝값 {scene.values[2]}</text>
              <circle cx={sx(1)} cy={sy(Math.exp(-1))} r={3} fill="none" stroke="#64748b" strokeWidth={1} />
              <text x={sx(1)} y={sy(0.56)} textAnchor="end" fontSize={11.5} fill="#64748b">기준 끝값 ≈0.3679</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
