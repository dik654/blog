import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #initial-value ProgressiveDetail.
 * x′=2√|x|, x(0)=0: t≤a에서 0, t>a에서 (t−a)². a=0,.5,1은 고른 예.
 * x′=x², x(0)=1: 1/(1−t), t=1에 가까워지면 커짐. t=.75에서 4.
 */
const sx = (t: number) => 38 + 145 * t;
const sy = (x: number) => 196 - 42 * x;
const branch = (a: number) => (t: number) => (t <= a ? 0 : (t - a) ** 2);
const COLORS = { 0: "#2563eb", 0.5: "#d97706", 1: "#16a34a" } as const;

const SCENES = [
  { label: "a=0인 해", summary: "x′=2√|x| · x(t)=t²", shown: [0], note: "시작값 0에서 바로 올라가는 함수입니다. 미분하면 2t이고 2√(t²)도 2t이므로 식을 만족합니다." },
  { label: "a=1인 해", summary: "1초까지 0, 그 뒤 (t−1)²", shown: [1], note: "같은 시작값 0에서 1초까지 0에 머물다 올라가는 함수도 식을 만족합니다. 붙이는 시각에 양쪽 미분값은 0입니다. a=1은 고른 값입니다(가정)." },
  { label: "여러 a를 함께", summary: "시작값 하나 · 해 여럿", shown: [0, 0.5, 1], note: "임의의 a≥0마다 해가 하나씩 있으므로 시작값을 같게 주어도 경로가 하나로 정해지지 않습니다. 출발점 근처에서 앞의 유일성 조건이 깨지기 때문입니다. 세 값은 예로 고른 것입니다(가정)." },
  { label: "다른 규칙: 끝나는 해", summary: "x′=x², x(0)=1 · x(t)=1/(1−t)", shown: [], note: "이번에는 규칙이 다릅니다. 해는 유일해도 t=1에 가까워지면 커집니다. 간격을 잘게 나눈다는 이유만으로 이 해를 유한한 값으로 1초 너머까지 이어 갈 수는 없습니다." },
] as const;

export default function IvpEdgeCasesViz() {
  return (
    <SceneShell
      eyebrow="존재와 유일성"
      title="시작값이 같아도 해가 갈라지거나 도중에 끝날 수 있습니다"
      description="가로는 시간, 세로는 양입니다. 앞 세 장면은 x′=2√|x|, x(0)=0이고 a는 0에 머물다 올라가기 시작하는 시각입니다. 마지막 장면만 x′=x², x(0)=1입니다."
      ariaLabel="시작값이 같은 여러 해와 유한 시간에 커지는 해"
      scenes={SCENES}
      render={(active) => {
        const shown: readonly number[] = SCENES[active].shown;
        return (
          <div>
            <PlotLegend items={[{ label: "a=0", color: COLORS[0] }, { label: "a=0.5", color: COLORS[0.5] }, { label: "a=1", color: COLORS[1] }, { label: "1/(1−t)", color: "#dc2626" }]} />
            <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.5, 1, 1.5, 2]} yTicks={[0, 1, 2, 3, 4]} xLabel="시간(초)" yLabel="양" xMax={2} yBottom={0} yTop={4} />
              {([0, 0.5, 1] as const).filter((a) => shown.includes(a)).map((a) => (
                <path key={a} d={linePath(sample(branch(a), 0, 2, 80), sx, sy)} fill="none" stroke={COLORS[a]} strokeWidth={1.25} />
              ))}
              {active < 3 && <circle cx={sx(0)} cy={sy(0)} r={3.5} fill="#64748b" />}
              {active < 3 && <line x1={sx(0)} x2={sx(0) + 10} y1={sy(0)} y2={sy(0.9)} stroke="#94a3b8" strokeWidth={1} />}
              {active < 3 && <text x={sx(0) + 13} y={sy(0.9) + 2} fontSize={12} fill="#64748b">같은 시작값 0</text>}
              {active === 3 && (
                <g>
                  <line x1={sx(1)} x2={sx(1)} y1={sy(4)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  <path d={linePath(sample((t) => 1 / (1 - t), 0, 0.75), sx, sy)} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                  <circle cx={sx(0)} cy={sy(1)} r={3.5} fill="#dc2626" />
                  <text x={sx(1) + 6} y={sy(3)} fontSize={12} fontWeight={700} fill="#dc2626">t=1 너머로 잇지 못함</text>
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
