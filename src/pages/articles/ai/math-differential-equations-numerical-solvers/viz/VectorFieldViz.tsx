import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #initial-value — λ=2인 벡터장 하나와 시작값이 고르는 궤적 둘.
 * 변화율 −2x: x=3 → −6, x=1 → −2. 궤적 e^(−2t), 3e^(−2t). t=.5 → 1/e≈.368, 3/e≈1.104.
 */
const sx = (t: number) => 38 + 290 * t;
const sy = (x: number) => 196 - 54 * x;
const ARROW = 13;
const TS = [0.1, 0.3, 0.5, 0.7, 0.9];
const XS = [0.5, 1.25, 2, 2.75];

const SCENES = [
  { label: "규칙만 있을 때", summary: "x′ = −2x", note: "벡터장은 지금 어디에 있든 변화율을 알려 주는 규칙입니다. 여기서는 그 자리의 양이 3이면 초당 −6, 1이면 초당 −2입니다. 어느 경로도 아직 정해지지 않았습니다." },
  { label: "시작값 1", summary: "x(t) = e^(−2t)", note: "시작값을 1로 정하면 화살표를 따라가는 궤적 하나가 나옵니다. 0.5초 뒤에는 약 0.368입니다." },
  { label: "시작값 3", summary: "x(t) = 3e^(−2t)", note: "화살표는 그대로이고 시작값만 3으로 바꿨습니다. 궤적은 달라져 0.5초 뒤 약 1.104입니다. 벡터장은 하나이고 궤적은 시작값마다 하나씩입니다." },
] as const;

function Field() {
  return (
    <g>
      {TS.flatMap((t) =>
        XS.map((x) => {
          const dx = 290;
          const dy = 54 * 2 * x;
          const size = Math.hypot(dx, dy);
          const ux = (dx / size) * ARROW;
          const uy = (dy / size) * ARROW;
          const tipX = sx(t) + ux;
          const tipY = sy(x) + uy;
          const backX = tipX - ux * 0.38;
          const backY = tipY - uy * 0.38;
          return (
            <g key={`${t}-${x}`}>
              <line x1={sx(t) - ux} y1={sy(x) - uy} x2={backX} y2={backY} stroke="#94a3b8" strokeWidth={1} />
              <path d={`M${tipX} ${tipY}L${backX - uy * 0.25} ${backY + ux * 0.25}L${backX + uy * 0.25} ${backY - ux * 0.25}Z`} fill="#94a3b8" />
            </g>
          );
        }),
      )}
    </g>
  );
}

export default function VectorFieldViz() {
  return (
    <SceneShell
      eyebrow="벡터장과 궤적"
      title="벡터장은 모든 자리의 화살표이고 궤적은 그중 한 길입니다"
      description="가로는 시간, 세로는 양이고 λ=2 s⁻¹입니다. 회색 화살표는 그 자리의 변화 방향이며 길이는 모두 같게 그렸습니다. 기울기만 읽으세요."
      ariaLabel="같은 벡터장에서 시작값 1과 3이 만드는 서로 다른 궤적"
      scenes={SCENES}
      render={(active) => (
        <div>
          <PlotLegend items={[{ label: "벡터장(변화 방향)", color: "#94a3b8" }, { label: "시작값 1의 궤적", color: "#2563eb" }, { label: "시작값 3의 궤적", color: "#d97706" }]} />
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.5, 1]} yTicks={[0, 1, 2, 3]} xLabel="시간(초)" yLabel="양" xMax={1} yBottom={0} yTop={3.3} />
            <Field />
            {active >= 1 && (
              <g>
                <path d={linePath(sample((t) => Math.exp(-2 * t), 0, 1), sx, sy)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <circle cx={sx(0)} cy={sy(1)} r={3.5} fill="#2563eb" />
                <circle cx={sx(0.5)} cy={sy(Math.exp(-1))} r={3.5} fill="#2563eb" />
                <text x={sx(0.5) + 6} y={sy(Math.exp(-1)) + 15} fontSize={12} fontWeight={700} fill="#2563eb">≈0.368</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <path d={linePath(sample((t) => 3 * Math.exp(-2 * t), 0, 1), sx, sy)} fill="none" stroke="#d97706" strokeWidth={1.25} />
                <circle cx={sx(0)} cy={sy(3)} r={3.5} fill="#d97706" />
                <circle cx={sx(0.5)} cy={sy(3 * Math.exp(-1))} r={3.5} fill="#d97706" />
                <text x={sx(0.5) + 6} y={sy(3 * Math.exp(-1)) - 8} fontSize={12} fontWeight={700} fill="#d97706">≈1.104</text>
              </g>
            )}
          </svg>
        </div>
      )}
    />
  );
}
