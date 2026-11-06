import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, type Point } from "./plotHelpers";

/**
 * 본문 대응: #noise-variance — 경로 오차는 같은 Brownian 증가량을 묶어 비교한다.
 * 증가량은 설명용 값(가정): 가는 +.3,−.2,+.4,+.1 → W .3,.1,.5,.6. 묶음 +.1,+.5 → W .1,.6. 다른 난수 +.4,−.3 → W .4,.1.
 */
const FINE: Point[] = [[0, 0], [0.25, 0.3], [0.5, 0.1], [0.75, 0.5], [1, 0.6]];
const COARSE: Point[] = [[0, 0], [0.5, 0.1], [1, 0.6]];
const OTHER: Point[] = [[0, 0], [0.5, 0.4], [1, 0.1]];
const sx = (t: number) => 38 + 290 * t;
const sy = (w: number) => 170 - 200 * w;

const SCENES = [
  { label: "가는 간격", summary: "증가량 +0.3, −0.2, +0.4, +0.1", note: "0.25초씩 네 개의 증가량을 뽑아 이은 것이 브라운 운동 W의 한 경로입니다. 숫자는 모양을 보이려고 고른 값입니다(가정)." },
  { label: "묶어서 굵은 간격", summary: "(+0.3−0.2) = +0.1 · (+0.4+0.1) = +0.5", note: "굵은 간격 0.5초의 증가량은 가는 증가량 두 개의 합으로 만듭니다. 굵은 경로가 같은 W의 점을 지나므로 두 계산의 차이는 간격의 차이에서 온 것으로 읽을 수 있습니다." },
  { label: "따로 뽑으면", summary: "끝의 W: 0.1 vs 0.6", note: "굵은 간격의 난수를 따로 뽑으면 W 자체가 다른 경로가 됩니다. 두 결과의 차이에는 수치 오차뿐 아니라 원래의 무작위 차이도 들어갑니다." },
] as const;

function Marks({ points, color }: { points: readonly Point[]; color: string }) {
  return (
    <>
      <path d={linePath(points, sx, sy)} fill="none" stroke={color} strokeWidth={1.25} />
      {points.map(([t, w]) => <circle key={t} cx={sx(t)} cy={sy(w)} r={3.2} fill={color} />)}
    </>
  );
}

export default function SameBrownianViz() {
  return (
    <SceneShell
      eyebrow="같은 난수로 비교"
      title="굵은 간격의 증가량은 가는 증가량을 묶어 만듭니다"
      description="세로는 흔들림이 누적된 W입니다. 같은 W 위에서 간격만 바꿔야 경로를 비교할 수 있습니다."
      ariaLabel="가는 간격과 굵은 간격이 같은 브라운 경로를 쓰는 경우와 다른 난수를 쓰는 경우"
      scenes={SCENES}
      render={(active) => (
        <div>
          <PlotLegend items={[{ label: "가는 간격 0.25", color: "#2563eb" }, { label: "묶은 굵은 간격 0.5", color: "#d97706" }, { label: "따로 뽑은 굵은 간격", color: "#dc2626" }]} />
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, 0.2, 0.4, 0.6]} xLabel="시간(초)" yLabel="W" xMax={1} yBottom={0} yTop={0.7} />
            <Marks points={FINE} color="#2563eb" />
            {active === 1 && <Marks points={COARSE} color="#d97706" />}
            {active === 2 && <Marks points={OTHER} color="#dc2626" />}
          </svg>
        </div>
      )}
    />
  );
}
